interface SectionProps {
  children: React.ReactNode;
  title?: React.ReactNode;
}

export default function Section({ children, title }: SectionProps) {
  return (
    <div className="flex flex-col gap-4 bg-white px-4 py-4 rounded-lg border border-gray-200 w-full">
      {title && <h2 className="text-xl font-bold text-gray-400">{title}</h2>}
      {children}
    </div>
  );
}
