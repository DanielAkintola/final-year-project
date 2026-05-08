import { useMemo, useState } from 'react';

import { PageHeader } from '../components/PageHeader';
import { Button } from '../components/ui/Button';

type PageScaffoldProps = {
  title: string;
  description: string;
  actions: string[];
};

export function PageScaffold({ title, description, actions }: PageScaffoldProps) {
  const [completedActions, setCompletedActions] = useState<string[]>([]);

  const completedCount = completedActions.length;
  const remainingCount = actions.length - completedCount;

  const actionStatus = useMemo(
    () =>
      actions.map((action) => ({
        action,
        completed: completedActions.includes(action),
      })),
    [actions, completedActions]
  );

  function toggleAction(action: string) {
    setCompletedActions((current) =>
      current.includes(action)
        ? current.filter((item) => item !== action)
        : [...current, action]
    );
  }

  function resetActions() {
    setCompletedActions([]);
  }

  return (
    <>
      <PageHeader description={description} eyebrow="Admin Workspace" title={title} />
      <section className="todo-panel">
        <div className="todo-panel-header">
          <div>
            <h2>Planned Actions</h2>
            <p>
              {completedCount} complete, {remainingCount} remaining
            </p>
          </div>
          <Button type="button" variant="ghost" onClick={resetActions} disabled={completedCount === 0}>
            Reset progress
          </Button>
        </div>

        <div className="todo-list">
          {actionStatus.map(({ action, completed }) => (
            <button
              className={completed ? 'todo-item todo-item-complete' : 'todo-item'}
              key={action}
              onClick={() => toggleAction(action)}
              type="button"
            >
              <span className="todo-check">{completed ? '✓' : ''}</span>
              <span>{action}</span>
            </button>
          ))}
        </div>
      </section>
    </>
  );
}
