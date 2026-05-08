import { ReactNode } from "react";

type GlassCardProps = {
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
};

export function GlassCard({
  children,
  className = "",
  title,
  subtitle,
}: GlassCardProps) {
  return (
    <div
      className={`bg-white/80 backdrop-blur-[12px] border border-slate-200/80 rounded-xl ${className}`}
    >
      {title && (
        <div className="p-gutter border-b border-outline-variant bg-white/50">
          <h3 className="font-headline-sm text-on-background flex items-center gap-2">
            {title}
          </h3>
          {subtitle && (
            <p className="text-label-md text-outline mt-1">{subtitle}</p>
          )}
        </div>
      )}
      {children}
    </div>
  );
}
