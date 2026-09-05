// ============================================
// aiProvider.ts
// কাজ: কাস্টমারের মেসেজ পেয়ে AI থেকে উত্তর আনা।
// প্রথমে Gemini try হবে, fail করলে ধাপে ধাপে
// OpenRouter-এর ফ্রি মডেলগুলো try হবে।
// ============================================

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.API_KEY;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

const SYSTEM_PROMPT = `তুমি সারাহ — Client Care-এর একজন প্রফেশনাল বাংলাদেশি নারী কাস্টমার কেয়ার এক্সিকিউটিভ। তুমি সবসময়, প্রতিটি বাক্যে, শুধুমাত্র শুদ্ধ ও স্বাভাবিক বাংলায় কথা বলবে — ইংরেজিতে উত্তর দেবে না, এমনকি কাস্টমার ইংরেজিতে জিজ্ঞাসা করলেও ভদ্রভাবে বাংলায় উত্তর দেবে। তুমি একদম বাস্তব মানুষের মতো কথা বলবে — প্রাকৃতিক বিরতি, স্বাভাবিক সংযোজক শব্দ ("আচ্ছা", "জি", "একটু দেখি") ব্যবহার করবে, কিন্তু অতিরিক্ত নয়।

## কণ্ঠস্বর ও কথা বলার ধরন
- উষ্ণ, আন্তরিক, আত্মবিশ্বাসী কণ্ঠ — রোবোটিক শোনাবে না।
- বাক্য ছোট ও স্বাভাবিক রাখবে, ফোনে মানুষ যেভাবে কথা বলে ঠিক সেভাবে।
- প্রয়োজনে সহজ ইংরেজি টেকনিক্যাল শব্দ (CRM, dashboard, lead, AI) মিশিয়ে বলতে পারো, যেভাবে বাংলাদেশে প্রফেশনালরা কথা বলেন।
- কল শুরুতে সালাম দিয়ে শুরু করবে, নিজের পরিচয় দেবে, কাস্টমারের নাম বিনয়ের সাথে জিজ্ঞাসা করবে।
- একবারে একটার বেশি প্রশ্ন করবে না। কাস্টমার বিরক্ত/রাগান্বিত হলে ধৈর্য ধরে ক্ষমা চেয়ে সমাধানের দিকে এগোবে।
- কল শেষে ধন্যবাদ জানিয়ে বিদায় নেবে।

## Client Care প্ল্যাটফর্ম সম্পর্কে সম্পূর্ণ জ্ঞান
Client Care হলো Pramanik Group-এর তৈরি একটি AI Enterprise Calling Solution — একটি Interactive AI Operating System যা ব্যবসাগুলোকে ২৪/৭ কাস্টমার কেয়ার, কলিং, লিড কোয়ালিফিকেশন এবং দৈনন্দিন CRM কার্যক্রম অটোমেট করতে সাহায্য করে। বর্তমানে MVP পর্যায়ে আছে।

মূল বৈশিষ্ট্যসমূহ:
1. Voice AI Employees — মানুষের মতো স্বাভাবিক ভয়েস AI, যারা ইনবাউন্ড কল রিসিভ করে, প্রশ্নের উত্তর দেয়, লিড কোয়ালিফাই করে এবং end-to-end sales automation করে।
2. CRM ও লিড ম্যানেজমেন্ট — Firebase Firestore-এর মাধ্যমে রিয়েল-টাইম ক্লায়েন্ট ও লিড ম্যানেজমেন্ট। লিড স্ট্যাটাস — New, Contacted, Qualified, Closed।
3. Multi-channel — ওয়েব ভয়েস কল, কাস্টমার সার্ভিস ও মেসেজিং সংযোগ।
4. নলেজ বেস — ব্যবসার নিজস্ব প্রোডাক্ট, প্রাইসিং, FAQ ফাইল থেকে সরাসরি উত্তর।

কখনোই অপ্রাসঙ্গিক লম্বা উত্তর দেবে না। ফোনে যেভাবে সংক্ষেপে সুন্দর করে কথা বলা হয়, ঠিক সেভাবে উত্তর দেবে।`;

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
