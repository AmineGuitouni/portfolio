/**
 * Animated SVG motif per project — a visual metaphor for what each system does.
 * Pure SVG + SMIL so it renders on the server and animates with zero JS.
 */
type GlyphProps = {
  slug: string;
  color: string;
  /** Line / secondary color */
  ink?: string;
  className?: string;
};

export default function ProjectGlyph({ slug, color, ink = "currentColor", className }: GlyphProps) {
  return (
    <svg viewBox="0 0 400 400" className={className} fill="none" aria-hidden preserveAspectRatio="xMidYMid slice">
      {glyphs[slug]?.(color, ink) ?? glyphs.megatel(color, ink)}
    </svg>
  );
}

const glyphs: Record<string, (c: string, ink: string) => React.ReactNode> = {
  // Live signal: rings broadcasting out of a source + a streaming waveform
  megatel: (c, ink) => (
    <g>
      {[0, 1, 2, 3].map((i) => (
        <circle key={i} cx="200" cy="170" r="20" stroke={c} strokeWidth="2">
          <animate attributeName="r" from="16" to="170" dur="4s" begin={`${i}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" from="1" to="0" dur="4s" begin={`${i}s`} repeatCount="indefinite" />
        </circle>
      ))}
      <circle cx="200" cy="170" r="12" fill={c} />
      <g transform="translate(40 320)">
        {Array.from({ length: 40 }).map((_, i) => (
          <rect key={i} x={i * 8} y="-10" width="4" height="20" rx="2" fill={ink} opacity="0.6">
            <animate attributeName="height" values="4;40;10;28;4" dur={`${1 + (i % 5) * 0.23}s`} repeatCount="indefinite" />
            <animate attributeName="y" values="-2;-20;-5;-14;-2" dur={`${1 + (i % 5) * 0.23}s`} repeatCount="indefinite" />
          </rect>
        ))}
      </g>
    </g>
  ),
  // A wall of machines, each drum spinning at its own speed
  launderer: (c, ink) => (
    <g>
      {Array.from({ length: 9 }).map((_, i) => {
        const x = 80 + (i % 3) * 120;
        const y = 80 + Math.floor(i / 3) * 120;
        const active = [0, 2, 4, 5, 7].includes(i);
        return (
          <g key={i}>
            <rect x={x - 48} y={y - 48} width="96" height="96" rx="14" stroke={ink} strokeOpacity="0.35" strokeWidth="1.5" />
            <circle cx={x} cy={y} r="30" stroke={active ? c : ink} strokeOpacity={active ? 1 : 0.35} strokeWidth="2" />
            <circle cx={x} cy={y} r="20" stroke={active ? c : ink} strokeOpacity={active ? 0.8 : 0.2} strokeWidth="2" strokeDasharray="6 8">
              {active && <animateTransform attributeName="transform" type="rotate" from={`0 ${x} ${y}`} to={`360 ${x} ${y}`} dur={`${1.2 + (i % 4) * 0.5}s`} repeatCount="indefinite" />}
            </circle>
            <circle cx={x + 34} cy={y - 38} r="3" fill={active ? c : ink} opacity={active ? 1 : 0.3} />
          </g>
        );
      })}
    </g>
  ),
  // Services wired together with packets in flight
  megashop: (c, ink) => {
    const nodes = [
      [80, 110], [80, 290], [200, 200], [320, 110], [320, 290],
    ];
    const paths = ["M80 110 L200 200", "M80 290 L200 200", "M200 200 L320 110", "M200 200 L320 290"];
    return (
      <g>
        {paths.map((d, i) => (
          <g key={d}>
            <path d={d} stroke={ink} strokeOpacity="0.35" strokeWidth="2" strokeDasharray="4 6" />
            <circle r="6" fill={c}>
              <animateMotion path={d} dur="1.8s" begin={`${i * 0.45}s`} repeatCount="indefinite" keyPoints={i < 2 ? "0;1" : "0;1"} keyTimes="0;1" calcMode="linear" />
            </circle>
          </g>
        ))}
        {nodes.map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r={i === 2 ? 38 : 24} fill={i === 2 ? c : "none"} stroke={i === 2 ? c : ink} strokeWidth="2" />
            {i === 2 && (
              <circle cx={x} cy={y} r="38" stroke={c} strokeWidth="2">
                <animate attributeName="r" from="38" to="80" dur="1.8s" repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.8" to="0" dur="1.8s" repeatCount="indefinite" />
              </circle>
            )}
          </g>
        ))}
      </g>
    );
  },
  // A board being searched square by square
  "rust-chess-engine": (c, ink) => (
    <g transform="translate(40 40)">
      {Array.from({ length: 64 }).map((_, i) => {
        const x = (i % 8) * 40;
        const y = Math.floor(i / 8) * 40;
        const dark = (Math.floor(i / 8) + (i % 8)) % 2 === 1;
        return (
          <rect key={i} x={x} y={y} width="40" height="40" fill={dark ? ink : "none"} fillOpacity={dark ? 0.12 : 0}>
            <animate attributeName="fill" values={`${ink};${c};${ink}`} dur="3.2s" begin={`${((i * 37) % 64) * 0.05}s`} repeatCount="indefinite" />
            <animate attributeName="fill-opacity" values={`${dark ? 0.12 : 0};0.9;${dark ? 0.12 : 0}`} keyTimes="0;0.08;1" dur="3.2s" begin={`${((i * 37) % 64) * 0.05}s`} repeatCount="indefinite" />
          </rect>
        );
      })}
      <rect width="320" height="320" stroke={ink} strokeOpacity="0.5" strokeWidth="2" />
    </g>
  ),
  // People ↔ projects graph drawing itself
  "ai-business-platform": (c, ink) => {
    const left = [70, 150, 230, 310];
    const right = [110, 200, 290];
    const links = [[0, 0], [1, 0], [1, 1], [2, 1], [2, 2], [3, 2], [0, 1], [3, 1]];
    return (
      <g>
        {links.map(([a, b], i) => (
          <path key={i} d={`M90 ${left[a]} C200 ${left[a]} 200 ${right[b]} 310 ${right[b]}`} stroke={i % 3 === 0 ? c : ink} strokeOpacity={i % 3 === 0 ? 1 : 0.4} strokeWidth="2" strokeDasharray="300" strokeDashoffset="300">
            <animate attributeName="stroke-dashoffset" values="300;0;0;300" keyTimes="0;0.4;0.8;1" dur="4s" begin={`${i * 0.2}s`} repeatCount="indefinite" />
          </path>
        ))}
        {left.map((y) => (
          <g key={y}>
            <circle cx="90" cy={y} r="16" stroke={ink} strokeWidth="2" />
            <circle cx="90" cy={y - 4} r="5" fill={ink} />
          </g>
        ))}
        {right.map((y) => (
          <rect key={y} x="296" y={y - 16} width="32" height="32" rx="6" fill={c} />
        ))}
      </g>
    );
  },
  // Indentation diamond, corners detected
  "vickers-hardness": (c, ink) => (
    <g>
      <circle cx="200" cy="200" r="160" stroke={ink} strokeOpacity="0.2" strokeWidth="1.5" />
      <path d="M200 70 L330 200 L200 330 L70 200 Z" fill={ink} fillOpacity="0.08" stroke={ink} strokeOpacity="0.6" strokeWidth="2" />
      <path d="M200 70 L200 330 M70 200 L330 200" stroke={ink} strokeOpacity="0.4" strokeDasharray="4 6" />
      {[[200, 70], [330, 200], [200, 330], [70, 200]].map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="10" fill={c} />
          <circle cx={x} cy={y} r="10" stroke={c} strokeWidth="2">
            <animate attributeName="r" values="10;28;10" dur="2s" begin={`${i * 0.5}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="1;0;1" dur="2s" begin={`${i * 0.5}s`} repeatCount="indefinite" />
          </circle>
        </g>
      ))}
    </g>
  ),
};
