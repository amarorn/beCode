import React, { useState } from 'react';
import { Button } from './components/Button';
import { Badge } from './components/Badge';
import { Panel } from './components/Panel';
import { Input } from './components/Input';
import { Modal } from './components/Modal';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './components/Table';

export const App: React.FC = () => {
  const [dark, setDark] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  React.useEffect(() => {
    const root = document.documentElement;
    if (dark) root.classList.add('dark');
    else root.classList.remove('dark');
  }, [dark]);

  const workspaces = [
    { name: 'workspace-api-core', status: 'running', type: 'Node.js', lastActive: '2m ago' },
    { name: 'frontend-dashboard', status: 'stopped', type: 'React', lastActive: '1h ago' },
    { name: 'data-pipeline', status: 'error', type: 'Python', lastActive: '5m ago' },
  ];

  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark p-lg space-y-lg text-content dark:text-content-dark">
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
          <div className="flex flex-col gap-md">
            <div className="flex flex-wrap gap-sm">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger">Danger</Button>
            </div>
            <div className="flex flex-wrap gap-sm items-center">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
              <Button disabled>Disabled</Button>
            </div>
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

        <Panel title="Inputs">
          <div className="flex flex-col gap-md">
            <Input label="Workspace Name" placeholder="e.g. my-awesome-workspace" />
            <Input 
              label="Environment Variables" 
              placeholder="KEY=value" 
              helperText="Add environment variables for your application" 
            />
            <Input 
              label="Repository URL" 
              placeholder="https://github.com/..." 
              error 
              helperText="Invalid repository URL format" 
            />
          </div>
        </Panel>

        <Panel title="Modals & Dialogs">
          <div className="flex items-center h-full">
            <Button variant="primary" onClick={() => setIsModalOpen(true)}>
              Open Settings Modal
            </Button>
          </div>
        </Panel>

        <Panel title="Data Table" className="md:col-span-2">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Workspace</TableHeader>
                <TableHeader>Type</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Last Active</TableHeader>
                <TableHeader className="text-right">Actions</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {workspaces.map((ws) => (
                <TableRow key={ws.name}>
                  <TableCell className="font-medium text-content dark:text-content-dark">{ws.name}</TableCell>
                  <TableCell>{ws.type}</TableCell>
                  <TableCell>
                    <Badge status={ws.status === 'running' ? 'success' : ws.status === 'error' ? 'error' : 'default'}>
                      {ws.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{ws.lastActive}</TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="ghost">Manage</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Panel>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Workspace Settings"
      >
        <div className="space-y-4">
          <p className="text-sm text-content-muted dark:text-content-dark-muted">
            Configure the settings for your current workspace. These settings will be applied immediately.
          </p>
          <Input label="Workspace Name" defaultValue="workspace-api-core" />
          <Input label="Instance Type" defaultValue="standard-2vcpu-4gb" />
        </div>
      </Modal>
    </div>
  );
};
