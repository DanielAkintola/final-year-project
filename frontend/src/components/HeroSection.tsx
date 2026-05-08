type HeroSectionProps = {
  eyebrow: string;
  title: string;
  description: string;
  stats: Array<{
    label: string;
    value: string | number;
    color?: "primary" | "tertiary" | "error";
  }>;
};

export function HeroSection({
  eyebrow,
  title,
  description,
  stats,
}: HeroSectionProps) {
  const colorClasses = {
    primary: "bg-primary/5 border-primary/10 text-primary",
    tertiary: "bg-tertiary/5 border-tertiary/10 text-tertiary",
    error: "bg-error/5 border-error/10 text-error",
  };

  return (
    <section className="bg-white/80 backdrop-blur-[12px] border border-slate-200/80 rounded-xl p-stack-lg flex flex-col md:flex-row items-center justify-between gap-stack-lg">
      <div className="max-w-2xl">
        <p className="font-label-lg text-primary tracking-widest uppercase mb-2">
          {eyebrow}
        </p>
        <h2 className="font-display-md text-display-md text-on-background mb-4 leading-tight">
          {title}
        </h2>
        <p className="font-body-md text-on-surface-variant">{description}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-stack-md w-full md:w-auto">
        {stats.map((stat, idx) => {
          const color = stat.color || "primary";
          const colorClass = colorClasses[color];

          return (
            <div key={idx} className={`${colorClass} p-4 rounded-lg border`}>
              <p className="font-label-md text-on-surface-variant">
                {stat.label}
              </p>
              <p
                className={`font-headline-lg ${color === "primary" ? "text-primary" : color === "tertiary" ? "text-tertiary" : "text-error"}`}
              >
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
