// ============================================
// aiProvider.ts
// কাজ: কাস্টমারের মেসেজ পেয়ে AI থেকে উত্তর আনা।
// প্রথমে Gemini try হবে, fail করলে ধাপে ধাপে
// OpenRouter-এর ফ্রি মডেলগুলো try হবে।
// ============================================

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.API_KEY;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

const SYSTEM_PROMPT = `তুমি একজন বাংলাদেশি কাস্টমার সার্ভিস AI এজেন্ট। নিয়মাবলী:
- সবসময় বাংলায় উত্তর দেবে, বাংলাদেশের কথ্য ভাষায় (যেমন: 'অর্ডার আসে নাই', 'ভাই জিনিসটা কোথায়' এই ধরনের কথা বুঝতে পারবে)
- উত্তর ছোট ও স্বাভাবিক হবে, কখনো লম্বা রোবোটিক প্যারাগ্রাফ লিখবে না
- একসাথে একাধিক প্রশ্ন করবে না, একবারে একটা প্রশ্ন করবে
- কোনো তথ্য না জানলে বানিয়ে বলবে না, বরং বলবে যে এই বিষয়ে জেনে জানাবে
- Customer যদি রাগান্বিত বা হতাশ মনে হয়, তাহলে শান্ত ও empathetic ভাষায় উত্তর দেবে`;

const FALLBACK_MODELS = [
  {
    id: "thinkingmachines/inkling:free",
    role: "প্রথম fallback — বহুভাষিক কথোপকথনে ভালো",
  },
  {
    id: "z-ai/glm-5.2:free",
    role: "দ্বিতীয় fallback — জটিল প্রশ্নে reasoning ভালো",
  },
  {
    id: "minimax/minimax-m3:free",
    role: "তৃতীয়/শেষ fallback — সাধারণ ব্যাকআপ",
  },
];

async function callGemini(userMessage: string): Promise<string> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: SYSTEM_PROMPT }],
        },
        contents: [{ parts: [{ text: userMessage }] }],
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Gemini failed: ${response.status}`);
  }

  const data: any = await response.json();
  return data.candidates[0].content.parts[0].text;
}

async function callOpenRouter(modelId: string, userMessage: string): Promise<string> {
  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: modelId,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userMessage },
        ],
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`OpenRouter model ${modelId} failed: ${response.status}`);
  }

  const data: any = await response.json();
  return data.choices[0].message.content;
}

export async function getAIResponse(userMessage: string): Promise<string> {
  try {
    return await callGemini(userMessage);
  } catch (geminiError) {
    console.log("Gemini fail করেছে, OpenRouter fallback শুরু হচ্ছে...");
  }

  for (const model of FALLBACK_MODELS) {
    try {
      console.log(`Try করা হচ্ছে: ${model.id} (${model.role})`);
      return await callOpenRouter(model.id, userMessage);
    } catch (err) {
      console.log(`${model.id} ও fail করেছে, পরেরটা try হচ্ছে...`);
      continue;
    }
  }

  return "দুঃখিত, এই মুহূর্তে সেবা ব্যস্ত আছে। একটু পরে আবার চেষ্টা করুন।";
}
