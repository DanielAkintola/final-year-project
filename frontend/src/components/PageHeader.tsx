type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
};

export function PageHeader({ eyebrow, title, description, actions }: PageHeaderProps) {
  return (
    <header className="page-header">
      <div className="page-header-text">
        {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
        <h1 className="page-header-title">{title}</h1>
        {description ? <p className="page-header-desc">{description}</p> : null}
      </div>
      {actions ? <div className="page-header-actions">{actions}</div> : null}
    </header>
  );
}
