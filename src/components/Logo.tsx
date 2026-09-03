interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  clickable?: boolean;
  onClick?: () => void;
  className?: string;
}

export const Logo = ({
  size = 'md',
  showSubtitle = true,
  clickable = false,
  onClick,
  className = '',
}: LogoProps) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
    xl: 'w-14 h-14',
  };

  const titleSizes = {
    sm: 'text-sm font-bold tracking-tight',
    md: 'text-base font-bold tracking-tight',
    lg: 'text-xl font-bold tracking-tight',
    xl: 'text-2xl font-bold tracking-tight',
  };

  const subSizes = {
    sm: 'text-[9px]',
    md: 'text-[10px]',
    lg: 'text-[11px]',
    xl: 'text-xs',
  };

  return (
    <div
      onClick={clickable ? onClick : undefined}
      className={`inline-flex items-center gap-2.5 select-none ${
        clickable ? 'cursor-pointer group' : ''
      } ${className}`}
    >
      {/* Abstract geometric mark representing Care, Conversation & AI Connection */}
      <div className={`relative ${iconSizes[size]} flex-shrink-0 flex items-center justify-center`}>
        <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-[1px] shadow-sm shadow-blue-500/20 transition-all duration-300 group-hover:shadow-blue-500/40">
          <div className="w-full h-full bg-[#080B14] rounded-[11px] flex items-center justify-center overflow-hidden">
            <svg
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-4/5 h-4/5"
            >
              <defs>
                <linearGradient id="careGrad1" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#38BDF8" />
                  <stop offset="0.5" stopColor="#6366F1" />
                  <stop offset="1" stopColor="#A855F7" />
                </linearGradient>
                <linearGradient id="neuralPulse" x1="10" y1="16" x2="22" y2="16" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#67E8F9" />
                  <stop offset="1" stopColor="#818CF8" />
                </linearGradient>
              </defs>
              {/* Outer caring embrace arc */}
              <path
                d="M6 14C6 8.477 10.477 4 16 4C21.523 4 26 8.477 26 14C26 19.523 21.523 24 16 24C13.8 24 11.75 23.29 10.08 22.09L6 23.5L7.41 19.42C6.52 17.82 6 15.98 6 14Z"
                stroke="url(#careGrad1)"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Connected neural nodes */}
              <circle cx="12" cy="13.5" r="1.75" fill="#38BDF8" />
              <circle cx="20" cy="13.5" r="1.75" fill="#C084FC" />
              {/* Converging conversational synapse curve */}
              <path
                d="M12 13.5C13.5 17 18.5 17 20 13.5"
                stroke="url(#neuralPulse)"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="flex flex-col leading-none">
        <div className="flex items-center gap-1.5">
          <span className={`text-white tracking-tight ${titleSizes[size]}`}>
            Client Care
          </span>
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            MVP
          </span>
        </div>
        {showSubtitle && (
          <span className={`text-slate-400 font-medium tracking-normal mt-0.5 ${subSizes[size]}`}>
            Pramanik Group
          </span>
        )}
      </div>
    </div>
  );
};
