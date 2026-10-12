interface PageHeaderProps {
  title: string;
  subtitle?: string;
  category?: string;
}

const PageHeader = ({ title, subtitle, category }: PageHeaderProps) => {
  return (
    <div className="text-center max-w-3xl mx-auto mb-12 animate-fade-in">
      {category && (
        <span className="text-xs font-semibold uppercase tracking-widest text-coral mb-3 block">
          {category}
        </span>
      )}
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-ink tracking-tight font-normal leading-tight">
        {title}
      </h1>
      {subtitle && (
        <p className="text-base text-body mt-4 leading-relaxed font-sans max-w-xl mx-auto">
          {subtitle}
        </p>
      )}
      <div className="w-16 h-px bg-hairline mx-auto mt-8" />
    </div>
  );
};

export default PageHeader;
