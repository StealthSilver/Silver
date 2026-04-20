"use client";

export default function ImmersiveBackground({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen transition-all duration-500">{children}</div>
  );
}
