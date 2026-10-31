export function CoinLogo({
  src,
  name,
  className,
}: {
  src: string;
  name: string;
  className?: string;
}) {
  return (
    <img
      src={src}
      alt={name}
      loading="lazy"
      className={`rounded-full object-cover ${className ?? ""}`}
    />
  );
}
