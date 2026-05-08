import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Edit2, KeyRound, Plus, Search, Trash2, XCircle } from 'lucide-react';

import { PageHeader } from '../components/PageHeader';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Field, FieldLabel, Input, Select } from '../components/ui/Form';
import type { AdminRole, AdminUser } from '../types';

const ADMIN_USERS_KEY = 'ondo-admin-users';

type AdminUserForm = {
  fullName: string;
  email: string;
  role: AdminRole;
  lgaAccess: string;
  isActive: boolean;
};

const emptyForm: AdminUserForm = {
  fullName: '',
  email: '',
  role: 'ELECTION_ADMIN',
  lgaAccess: '',
  isActive: true,
};

function createId(prefix: string) {
  return `${prefix}-${Date.now()}`;
}

function loadAdminUsers(): AdminUser[] {
  try {
    const raw = localStorage.getItem(ADMIN_USERS_KEY);
    if (!raw) {
      const defaults: AdminUser[] = [
        {
          id: 'admin-1',
          fullName: 'System Administrator',
          email: 'admin@ondo.gov.ng',
          role: 'SUPER_ADMIN',
          lgaAccess: [],
          isActive: true,
          createdAt: '2024-01-01T00:00:00Z',
          lastLogin: new Date().toISOString(),
        },
      ];
      localStorage.setItem(ADMIN_USERS_KEY, JSON.stringify(defaults));
      return defaults;
    }
    return JSON.parse(raw) as AdminUser[];
  } catch {
    return [];
  }
}

export function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [form, setForm] = useState<AdminUserForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    setUsers(loadAdminUsers());
  }, []);

  useEffect(() => {
    localStorage.setItem(ADMIN_USERS_KEY, JSON.stringify(users));
  }, [users]);

  const filtered = useMemo(
    () =>
      users.filter((user) =>
        `${user.fullName} ${user.email} ${user.role}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase()),
      ),
    [users, searchTerm],
  );

  function showFeedback(message: string, type: 'success' | 'error' = 'success') {
    setFeedback({ message, type });
    window.setTimeout(() => setFeedback(null), 2500);
  }

  function clearForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  function saveUser() {
    const fullName = form.fullName.trim();
    const email = form.email.trim().toLowerCase();

    if (!fullName || !email) {
      showFeedback('Full name and email are required.', 'error');
      return;
    }

    const duplicate = users.some((user) => user.email === email && user.id !== editingId);
    if (duplicate) {
      showFeedback('This email already exists.', 'error');
      return;
    }

    const normalizedLgaAccess = form.lgaAccess
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    if (editingId) {
      setUsers((current) =>
        current.map((user) =>
          user.id === editingId
            ? { ...user, fullName, email, role: form.role, lgaAccess: normalizedLgaAccess, isActive: form.isActive }
            : user,
        ),
      );
      showFeedback(`${fullName} updated.`);
      clearForm();
      return;
    }

    const newUser: AdminUser = {
      id: createId('admin'),
      fullName,
      email,
      role: form.role,
      lgaAccess: normalizedLgaAccess,
      isActive: form.isActive,
      createdAt: new Date().toISOString(),
    };
    setUsers((current) => [newUser, ...current]);
    showFeedback(`${fullName} created.`);
    clearForm();
  }

  function startEdit(user: AdminUser) {
    setEditingId(user.id);
    setForm({
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      lgaAccess: (user.lgaAccess ?? []).join(', '),
      isActive: user.isActive,
    });
  }

  function toggleUser(id: string) {
    setUsers((current) =>
      current.map((user) => (user.id === id ? { ...user, isActive: !user.isActive } : user)),
    );
  }

  function removeUser(id: string) {
    setUsers((current) => current.filter((user) => user.id !== id));
    if (editingId === id) clearForm();
  }

  function resetPassword(user: AdminUser) {
    showFeedback(`Password reset link sent to ${user.email}.`);
  }

  return (
    <>
      <PageHeader
        eyebrow="Admin Workspace"
        title="Admin Users"
        description="Manage administrator accounts, role boundaries, and local access scopes."
      />

      {feedback && (
        <div className={`geo-feedback ${feedback.type === 'success' ? 'geo-feedback-success' : 'geo-feedback-error'}`}>
          {feedback.type === 'success' ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
          <span>{feedback.message}</span>
        </div>
      )}

      <div className="geo-workspace">
        <Card className="geo-form-card">
          <CardHeader>
            <CardTitle>{editingId ? 'Edit Admin User' : 'Create Admin User'}</CardTitle>
            <CardDescription>Assign role and optional LGA scope for operational access control.</CardDescription>
          </CardHeader>
          <CardContent>
            <form
              className="geo-form"
              onSubmit={(event) => {
                event.preventDefault();
                saveUser();
              }}
            >
              <div className="geo-form-grid">
                <Field>
                  <FieldLabel>Full Name</FieldLabel>
                  <Input value={form.fullName} onChange={(event) => setForm({ ...form, fullName: event.target.value })} />
                </Field>
                <Field>
                  <FieldLabel>Email</FieldLabel>
                  <Input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
                </Field>
                <Field>
                  <FieldLabel>Role</FieldLabel>
                  <Select value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value as AdminRole })}>
                    <option value="SUPER_ADMIN">Super Admin</option>
                    <option value="ELECTION_ADMIN">Election Admin</option>
                    <option value="REGISTRATION_OFFICER">Registration Officer</option>
                    <option value="MONITORING_OFFICER">Monitoring Officer</option>
                    <option value="RESULTS_OFFICER">Results Officer</option>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel>LGA Access (comma-separated)</FieldLabel>
                  <Input value={form.lgaAccess} onChange={(event) => setForm({ ...form, lgaAccess: event.target.value })} placeholder="lga-1, lga-2" />
                </Field>
              </div>

              <label className="geo-checkbox">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(event) => setForm({ ...form, isActive: event.target.checked })}
                />
                <span>Account Active</span>
                <small>Inactive admins cannot access the dashboard.</small>
              </label>

              <div className="geo-form-actions">
                <Button type="submit">
                  <Plus size={16} />
                  {editingId ? 'Update User' : 'Create User'}
                </Button>
                {editingId && (
                  <Button type="button" variant="ghost" onClick={clearForm}>
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="geo-list-card">
          <CardHeader>
            <div className="geo-list-header">
              <div>
                <CardTitle>Admin Accounts ({filtered.length})</CardTitle>
                <CardDescription>Search and manage access lifecycle for administrators.</CardDescription>
              </div>
              <div className="geo-search-box">
                <Search size={18} />
                <Input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  className="geo-search-input"
                  placeholder="Search by name, email, role"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="geo-table">
              <div className="geo-table-header">
                <div className="geo-col-name">Admin</div>
                <div className="geo-col-code">Role</div>
                <div className="geo-col-status">Status</div>
                <div className="geo-col-code">LGA Scope</div>
                <div className="geo-col-actions">Actions</div>
              </div>
              <div className="geo-table-body">
                {filtered.map((user) => (
                  <div key={user.id} className="geo-table-row">
                    <div className="geo-col-name">
                      <strong>{user.fullName}</strong>
                      <div style={{ color: '#64748B', fontSize: '0.82rem' }}>{user.email}</div>
                    </div>
                    <div className="geo-col-code">{user.role}</div>
                    <div className="geo-col-status">
                      <span className={`geo-status-badge ${user.isActive ? 'geo-status-active' : 'geo-status-inactive'}`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="geo-col-code">{(user.lgaAccess ?? []).join(', ') || 'All LGAs'}</div>
                    <div className="geo-col-actions">
                      <Button type="button" variant="ghost" onClick={() => startEdit(user)}>
                        <Edit2 size={16} />
                      </Button>
                      <Button type="button" variant="ghost" onClick={() => toggleUser(user.id)}>
                        {user.isActive ? 'Disable' : 'Enable'}
                      </Button>
                      <Button type="button" variant="ghost" onClick={() => resetPassword(user)}>
                        <KeyRound size={16} />
                      </Button>
                      <Button type="button" variant="ghost" onClick={() => removeUser(user.id)}>
                        <Trash2 size={16} />
                      </Button>
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
