const WIDTH = 208;
const HEIGHT = 60;
const MAX_POINTS = 60;

export function Sparkline({
  values,
  stroke,
  className,
}: {
  values: number[];
  stroke: string;
  className?: string;
}) {
  if (values.length < 2) return null;

  const step = Math.max(1, Math.ceil(values.length / MAX_POINTS));
  const sampled = values.filter((_, index) => index % step === 0);
  const min = Math.min(...sampled);
  const max = Math.max(...sampled);
  const range = max - min || 1;

  const points = sampled
    .map((value, index) => {
      const x = (index / (sampled.length - 1)) * WIDTH;
      const y = HEIGHT - ((value - min) / range) * HEIGHT;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      preserveAspectRatio="none"
      aria-hidden
      className={className}
    >
      <polyline
        points={points}
        fill="none"
        stroke={stroke}
        strokeWidth={2}
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
