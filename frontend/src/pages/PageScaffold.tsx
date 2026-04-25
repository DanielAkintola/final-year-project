import { PageHeader } from '../components/PageHeader';

type PageScaffoldProps = {
  title: string;
  description: string;
  actions: string[];
};

export function PageScaffold({ title, description, actions }: PageScaffoldProps) {
  return (
    <>
      <PageHeader description={description} eyebrow="Admin Workspace" title={title} />
      <section className="todo-panel">
        <h2>Planned Actions</h2>
        <div className="todo-list">
          {actions.map((action) => (
            <label key={action}>
              <input type="checkbox" readOnly />
              <span>{action}</span>
            </label>
          ))}
        </div>
      </section>
    </>
  );
}
