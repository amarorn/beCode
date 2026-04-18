import React, { useState } from 'react';
import { Button } from './components/Button';
import { Badge } from './components/Badge';
import { Panel } from './components/Panel';

export const App: React.FC = () => {
  const [dark, setDark] = useState(true);

  React.useEffect(() => {
    const root = document.documentElement;
    if (dark) root.classList.add('dark');
    else root.classList.remove('dark');
  }, [dark]);

  return (
    <div className="min-h-screen p-lg space-y-lg">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">beCode UI — Demo</h1>
          <p className="text-content-muted dark:text-content-dark-muted text-sm">
            Showcase dos componentes do design system da IDE.
          </p>
        </div>
        <Button variant="secondary" size="sm" onClick={() => setDark((v) => !v)}>
          {dark ? 'Light mode' : 'Dark mode'}
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
        <Panel title="Buttons">
          <div className="flex flex-wrap gap-sm">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
          </div>
          <div className="mt-md flex flex-wrap gap-sm items-center">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
            <Button disabled>Disabled</Button>
          </div>
        </Panel>

        <Panel title="Badges">
          <div className="flex flex-wrap gap-sm">
            <Badge>default</Badge>
            <Badge status="info">info</Badge>
            <Badge status="success">success</Badge>
            <Badge status="warning">warning</Badge>
            <Badge status="error">error</Badge>
          </div>
        </Panel>

        <Panel title="Status workspace" className="md:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm">workspace-api-core</p>
              <p className="text-xs text-content-muted dark:text-content-dark-muted">
                squad-plataforma &middot; tenant-acme
              </p>
            </div>
            <div className="flex items-center gap-sm">
              <Badge status="success">running</Badge>
              <Button size="sm" variant="ghost">Stop</Button>
              <Button size="sm" variant="secondary">Open</Button>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
};
