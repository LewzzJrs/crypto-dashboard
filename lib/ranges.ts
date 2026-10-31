export const RANGES = [
  { label: "1D", days: 1 },
  { label: "1W", days: 7 },
  { label: "1M", days: 30 },
] as const;

export type RangeDays = (typeof RANGES)[number]["days"];

export function isRangeDays(value: number): value is RangeDays {
  return RANGES.some((range) => range.days === value);
}

export const INTERVALS = ["1m", "15m", "1h", "4h"] as const;

export type Interval = (typeof INTERVALS)[number];

export function isInterval(value: string): value is Interval {
  return (INTERVALS as readonly string[]).includes(value);
}

export type Timeframe =
  | { id: string; label: string; kind: "interval"; interval: Interval }
  | { id: string; label: string; kind: "days"; days: RangeDays };

export const TIMEFRAMES: readonly Timeframe[] = [
  ...INTERVALS.map(
    (interval): Timeframe => ({
      id: interval,
      label: interval,
      kind: "interval",
      interval,
    }),
  ),
  ...RANGES.map(
    (range): Timeframe => ({
      id: `range-${range.days}`,
      label: range.label,
      kind: "days",
      days: range.days,
    }),
  ),
];

export const DEFAULT_TIMEFRAME_ID = "range-7";
