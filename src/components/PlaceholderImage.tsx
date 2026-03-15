interface PlaceholderImageProps {
  title: string;
  className?: string;
}

const COLORS = [
  "from-amber-200 to-orange-300",
  "from-sky-200 to-indigo-300",
  "from-emerald-200 to-teal-300",
  "from-rose-200 to-pink-300",
  "from-violet-200 to-purple-300",
  "from-yellow-200 to-amber-300",
];

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function PlaceholderImage({ title, className = "" }: PlaceholderImageProps) {
  const colorIndex = hashString(title) % COLORS.length;
  const gradient = COLORS[colorIndex];

  return (
    <div
      className={`bg-gradient-to-br ${gradient} flex items-center justify-center ${className}`}
    >
      <div className="text-center p-6">
        <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-white/30 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-white/70"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z"
            />
          </svg>
        </div>
        <p className="text-sm font-medium text-white/80">{title}</p>
      </div>
    </div>
  );
}
