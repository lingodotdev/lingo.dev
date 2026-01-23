interface SectionProps {
  children: React.ReactNode;
  title?: React.ReactNode;
  className?: string;
}

export default function Section({ children, title, className = "" }: SectionProps) {
  return (
    <section className={`rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-8 shadow-sm ${className}`}>
      {title && (
        <h2 className="text-2xl font-bold mb-6 tracking-tight text-zinc-900 dark:text-zinc-100 border-l-4 border-orange-500 pl-4">
          {title}
        </h2>
      )}
      {children}
    </section>
  );
}
