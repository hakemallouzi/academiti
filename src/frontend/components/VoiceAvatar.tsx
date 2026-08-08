"use client";

export function VoiceAvatar({
  src,
  label,
  size = 32,
  className = "",
}: {
  src: string;
  label: string;
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={`relative inline-flex shrink-0 overflow-hidden rounded-full border border-white/80 bg-white shadow-sm ${className}`}
      style={{ width: size, height: size }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={label}
        width={size}
        height={size}
        className="h-full w-full object-cover"
        loading="lazy"
      />
    </span>
  );
}
