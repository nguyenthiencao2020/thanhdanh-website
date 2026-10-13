/** Decorative gear outline, `teeth` evenly spaced. Rotate it with an animate-* class. */
export function Gear({ teeth = 12, className = "" }: { teeth?: number; className?: string }) {
  const outer = 50;
  const inner = 41;
  const pts: string[] = [];
  for (let i = 0; i < teeth; i++) {
    const a = (i / teeth) * Math.PI * 2;
    const w = (Math.PI / teeth) * 0.55;
    for (const [r, da] of [
      [inner, -w * 1.5],
      [outer, -w * 0.8],
      [outer, w * 0.8],
      [inner, w * 1.5],
    ] as const) {
      pts.push(`${(60 + r * Math.cos(a + da)).toFixed(2)},${(60 + r * Math.sin(a + da)).toFixed(2)}`);
    }
  }
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
      <polygon points={pts.join(" ")} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
      <circle cx="60" cy="60" r="16" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="60" cy="60" r="30" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 5" />
    </svg>
  );
}
