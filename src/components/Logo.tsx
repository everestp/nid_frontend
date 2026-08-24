interface LogoProps {
  size?: number;
  className?: string;
}

export function Logo({ size = 32, className = '' }: LogoProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div
        className="relative rounded-lg border border-ink-600 bg-ink-900 flex items-center justify-center overflow-hidden"
        style={{ width: size, height: size }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-brand-500/20 to-transparent" />
        <svg
          width={size * 0.6}
          height={size * 0.6}
          viewBox="0 0 32 32"
          fill="none"
          className="relative z-10"
        >
          <path
            d="M10 8v16M10 8l12 16V8"
            stroke="#818cf8"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <span className="text-lg font-semibold tracking-tight text-ink-50">
        NID<span className="text-ink-400">.xyz</span>
      </span>
    </div>
  );
}

export function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <div
      className="relative rounded-lg border border-ink-600 bg-ink-900 flex items-center justify-center overflow-hidden"
      style={{ width: size, height: size }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-brand-500/20 to-transparent" />
      <svg
        width={size * 0.6}
        height={size * 0.6}
        viewBox="0 0 32 32"
        fill="none"
        className="relative z-10"
      >
        <path
          d="M10 8v16M10 8l12 16V8"
          stroke="#818cf8"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
