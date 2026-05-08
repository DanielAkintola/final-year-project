import { useMemo, useState } from 'react';
import { Download, Search } from 'lucide-react';

import { PageHeader } from '../components/PageHeader';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Input, Select } from '../components/ui/Form';
import { mockAuditLogs } from '../mocks/data';
import type { AuditAction } from '../types';

const AUDIT_LOGS_KEY = 'ondo-audit-logs';

type AuditLogRow = {
  id: string;
  adminEmail: string;
  action: AuditAction;
  resourceType: string;
  resourceId: string;
  timestamp: string;
};

function loadLogs(): AuditLogRow[] {
  try {
    const raw = localStorage.getItem(AUDIT_LOGS_KEY);
    if (!raw) {
      localStorage.setItem(AUDIT_LOGS_KEY, JSON.stringify(mockAuditLogs));
      return mockAuditLogs;
    }
    return JSON.parse(raw) as AuditLogRow[];
  } catch {
    return [];
  }
}

function downloadCsv(filename: string, rows: AuditLogRow[]) {
  if (!rows.length) return;
  const headers = ['timestamp', 'adminEmail', 'action', 'resourceType', 'resourceId'];
  const csv = [
    headers.join(','),
    ...rows.map((row) =>
      [row.timestamp, row.adminEmail, row.action, row.resourceType, row.resourceId]
        .map((value) => `"${String(value).replace(/"/g, '""')}"`)
        .join(','),
    ),
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function AuditLogsPage() {
  const [logs] = useState<AuditLogRow[]>(loadLogs());
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState<'ALL' | AuditAction>('ALL');

  const filtered = useMemo(
    () =>
      logs.filter((log) => {
        const matchesSearch =
          `${log.adminEmail} ${log.resourceId} ${log.resourceType}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        const matchesAction = actionFilter === 'ALL' || log.action === actionFilter;
        return matchesSearch && matchesAction;
      }),
    [logs, searchTerm, actionFilter],
  );

  return (
    <>
      <PageHeader
        eyebrow="Admin Workspace"
        title="Audit Logs"
        description="Inspect sensitive system actions, filter activity trails, and export evidence-ready log bundles."
      />

      <div className="geo-workspace">
        <Card className="geo-form-card">
          <CardHeader>
            <CardTitle>Filter Logs</CardTitle>
            <CardDescription>Use action and keyword filtering for targeted investigations.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="geo-form-grid">
              <label className="ui-field">
                <span className="ui-field-label">Search</span>
                <div className="geo-search-box">
                  <Search size={18} />
                  <Input
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    className="geo-search-input"
                    placeholder="Admin email, resource, or ID"
                  />
                </div>
              </label>
              <label className="ui-field">
                <span className="ui-field-label">Action</span>
                <Select value={actionFilter} onChange={(event) => setActionFilter(event.target.value as 'ALL' | AuditAction)}>
                  <option value="ALL">All actions</option>
                  {Array.from(new Set(logs.map((log) => log.action))).map((action) => (
                    <option key={action} value={action}>
                      {action}
                    </option>
                  ))}
                </Select>
              </label>
            </div>
            <div className="geo-form-actions">
              <Button type="button" onClick={() => downloadCsv('audit-logs.csv', filtered)}>
                <Download size={16} />
                Export CSV
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="geo-list-card">
          <CardHeader>
            <CardTitle>Audit Timeline ({filtered.length})</CardTitle>
            <CardDescription>Chronological record of high-impact actions.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="geo-table">
              <div className="geo-table-header">
                <div className="geo-col-name">Admin</div>
                <div className="geo-col-code">Action</div>
                <div className="geo-col-code">Resource</div>
                <div className="geo-col-status">Time</div>
                <div className="geo-col-actions">Trace</div>
              </div>
              <div className="geo-table-body">
                {filtered.map((log) => (
                  <div key={log.id} className="geo-table-row">
                    <div className="geo-col-name">
                      <strong>{log.adminEmail}</strong>
                    </div>
                    <div className="geo-col-code">{log.action}</div>
                    <div className="geo-col-code">{log.resourceType}</div>
                    <div className="geo-col-status">
                      <span className="geo-status-badge geo-status-active">
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <div className="geo-col-actions">
                      <span style={{ color: '#64748B' }}>{log.resourceId}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
