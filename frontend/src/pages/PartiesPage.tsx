import { useEffect, useMemo, useState } from 'react';
import { CheckCircle, Edit2, Plus, Search, Trash2, XCircle } from 'lucide-react';

import { PageHeader } from '../components/PageHeader';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Field, FieldLabel, Input } from '../components/ui/Form';

export type Party = {
  id: string;
  name: string;
  abbreviation: string;
  primaryColor: string;
  secondaryColor: string;
  description: string;
  isActive: boolean;
  createdAt: string;
};

type PartyForm = Omit<Party, 'id' | 'createdAt'>;

const PARTIES_STORAGE_KEY = 'ondo-vote-parties';

function createId(prefix: string) {
  return `${prefix}-${Date.now()}`;
}

function loadParties(): Party[] {
  try {
    const raw = localStorage.getItem(PARTIES_STORAGE_KEY);
    if (!raw) {
      const defaultParties: Party[] = [
        {
          id: 'party-1',
          name: 'Peoples Democratic Party',
          abbreviation: 'PDP',
          primaryColor: '#FF0000',
          secondaryColor: '#FFFFFF',
          description: 'Major opposition party',
          isActive: true,
          createdAt: '2024-01-01',
        },
        {
          id: 'party-2',
          name: 'All Progressives Congress',
          abbreviation: 'APC',
          primaryColor: '#0066CC',
          secondaryColor: '#FFFFFF',
          description: 'Ruling party',
          isActive: true,
          createdAt: '2024-01-01',
        },
        {
          id: 'party-3',
          name: 'Labour Party',
          abbreviation: 'LP',
          primaryColor: '#FF6600',
          secondaryColor: '#FFFFFF',
          description: 'Third force party',
          isActive: true,
          createdAt: '2024-01-01',
        },
      ];
      localStorage.setItem(PARTIES_STORAGE_KEY, JSON.stringify(defaultParties));
      return defaultParties;
    }
    return JSON.parse(raw) as Party[];
  } catch {
    return [];
  }
}

function saveParties(parties: Party[]): void {
  localStorage.setItem(PARTIES_STORAGE_KEY, JSON.stringify(parties));
}

const emptyForm: PartyForm = {
  name: '',
  abbreviation: '',
  primaryColor: '#2E5AAC',
  secondaryColor: '#FFFFFF',
  description: '',
  isActive: true,
};

export function PartiesPage() {
  const [parties, setParties] = useState<Party[]>([]);
  const [form, setForm] = useState<PartyForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    setParties(loadParties());
  }, []);

  useEffect(() => {
    saveParties(parties);
  }, [parties]);

  const filtered = useMemo(
    () =>
      parties.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.abbreviation.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [parties, searchTerm],
  );

  function showFeedback(msg: string, type: 'success' | 'error' = 'success') {
    setFeedback({ message: msg, type });
    setTimeout(() => setFeedback(null), 2500);
  }

  function clearForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  function handleSave() {
    const name = form.name.trim();
    const abbr = form.abbreviation.trim().toUpperCase();

    if (!name || !abbr) {
      showFeedback('Party name and abbreviation are required.', 'error');
      return;
    }

    const duplicate = parties.some((p) => p.abbreviation === abbr && p.id !== editingId);
    if (duplicate) {
      showFeedback('That abbreviation already exists.', 'error');
      return;
    }

    if (editingId) {
      setParties((current) =>
        current.map((p) => (p.id === editingId ? { ...p, ...form, abbreviation: abbr } : p)),
      );
      showFeedback(`✓ ${name} updated`);
    } else {
      const newParty: Party = {
        id: createId('party'),
        ...form,
        abbreviation: abbr,
        createdAt: new Date().toISOString(),
      };
      setParties((current) => [newParty, ...current]);
      showFeedback(`✓ ${name} created`);
    }

    clearForm();
  }

  function startEdit(party: Party) {
    setEditingId(party.id);
    setForm({
      name: party.name,
      abbreviation: party.abbreviation,
      primaryColor: party.primaryColor,
      secondaryColor: party.secondaryColor,
      description: party.description,
      isActive: party.isActive,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function toggleStatus(id: string) {
    const party = parties.find((p) => p.id === id);
    if (!party) return;
    setParties((current) =>
      current.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p)),
    );
    showFeedback(`${party.name} is now ${!party.isActive ? 'active' : 'inactive'}`);
  }

  function removeParty(id: string) {
    const party = parties.find((p) => p.id === id);
    if (!party) return;
    setParties((current) => current.filter((p) => p.id !== id));
    if (editingId === id) clearForm();
    showFeedback(`${party.name} deleted`);
  }

  return (
    <>
      <PageHeader
        eyebrow="Admin Workspace"
        title="Parties"
        description="Create and manage political parties, their colors, and active status."
      />

      {feedback && (
        <div
          className={`geo-feedback ${feedback.type === 'success' ? 'geo-feedback-success' : 'geo-feedback-error'}`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle size={18} />
          ) : (
            <XCircle size={18} />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      <div className="geo-workspace">
        <Card className="geo-form-card">
          <CardHeader>
            <CardTitle>{editingId ? 'Edit Party' : 'Create Party'}</CardTitle>
            <CardDescription>
              {editingId
                ? 'Update party details'
                : 'Add a new political party to your election system'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              className="geo-form"
              onSubmit={(e) => {
                e.preventDefault();
                handleSave();
              }}
            >
              <div className="geo-form-grid">
                <Field>
                  <FieldLabel>Party Name</FieldLabel>
                  <Input
                    placeholder="e.g., Peoples Democratic Party"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    autoFocus
                  />
                </Field>

                <Field>
                  <FieldLabel>Abbreviation</FieldLabel>
                  <Input
                    placeholder="e.g., PDP"
                    value={form.abbreviation}
                    onChange={(e) => setForm({ ...form, abbreviation: e.target.value })}
                  />
                </Field>

                <Field>
                  <FieldLabel>Primary Color</FieldLabel>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input
                      type="color"
                      value={form.primaryColor}
                      onChange={(e) => setForm({ ...form, primaryColor: e.target.value })}
                      style={{ width: '50px', height: '46px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}
                    />
                    <Input
                      placeholder="#2E5AAC"
                      value={form.primaryColor}
                      onChange={(e) => setForm({ ...form, primaryColor: e.target.value })}
                    />
                  </div>
                </Field>

                <Field>
                  <FieldLabel>Secondary Color</FieldLabel>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input
                      type="color"
                      value={form.secondaryColor}
                      onChange={(e) => setForm({ ...form, secondaryColor: e.target.value })}
                      style={{ width: '50px', height: '46px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}
                    />
                    <Input
                      placeholder="#FFFFFF"
                      value={form.secondaryColor}
                      onChange={(e) => setForm({ ...form, secondaryColor: e.target.value })}
                    />
                  </div>
                </Field>
              </div>

              <Field>
                <FieldLabel>Description</FieldLabel>
                <textarea
                  placeholder="Party description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="ui-input ui-textarea"
                  rows={3}
                />
              </Field>

              <label className="geo-checkbox">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                />
                <span>Active Party</span>
                <small>Active parties can field candidates</small>
              </label>

              <div className="geo-form-actions">
                <Button type="submit">
                  <Plus size={16} />
                  {editingId ? 'Update Party' : 'Create Party'}
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
                <CardTitle>Parties ({filtered.length})</CardTitle>
                <CardDescription>Manage your political parties</CardDescription>
              </div>
              <div className="geo-search-box">
                <Search size={18} />
                <Input
                  placeholder="Search parties..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="geo-search-input"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filtered.length === 0 ? (
              <div className="geo-empty-state">
                <p className="geo-empty-title">
                  {parties.length === 0 ? 'No parties yet' : 'No results found'}
                </p>
                <p className="geo-empty-desc">
                  {parties.length === 0
                    ? 'Create your first party using the form above'
                    : 'Try adjusting your search'}
                </p>
              </div>
            ) : (
              <div className="geo-table">
                <div className="geo-table-header">
                  <div className="geo-col-name">Name</div>
                  <div className="geo-col-code">Abbreviation</div>
                  <div style={{ gridColumn: 2, padding: '14px 16px', fontSize: '0.85rem' }}>
                    Colors
                  </div>
                  <div className="geo-col-status">Status</div>
                  <div className="geo-col-actions">Actions</div>
                </div>
                <div className="geo-table-body">
                  {filtered.map((party) => (
                    <div key={party.id} className="geo-table-row">
                      <div className="geo-col-name">
                        <strong>{party.name}</strong>
                      </div>
                      <div className="geo-col-code">
                        <code>{party.abbreviation}</code>
                      </div>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <div
                          style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '6px',
                            backgroundColor: party.primaryColor,
                            border: '1px solid #ccc',
                          }}
                          title={`Primary: ${party.primaryColor}`}
                        />
                        <div
                          style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '6px',
                            backgroundColor: party.secondaryColor,
                            border: '1px solid #ccc',
                          }}
                          title={`Secondary: ${party.secondaryColor}`}
                        />
                      </div>
                      <div className="geo-col-status">
                        <span className={`geo-status-badge ${party.isActive ? 'geo-status-active' : 'geo-status-inactive'}`}>
                          {party.isActive ? (
                            <>
                              <CheckCircle size={14} />
                              Active
                            </>
                          ) : (
                            <>
                              <XCircle size={14} />
                              Inactive
                            </>
                          )}
                        </span>
                      </div>
                      <div className="geo-col-actions">
                        <Button type="button" variant="ghost" onClick={() => startEdit(party)}>
                          <Edit2 size={16} />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => toggleStatus(party.id)}
                        >
                          {party.isActive ? 'Deactivate' : 'Activate'}
                        </Button>
                        <Button type="button" variant="ghost" onClick={() => removeParty(party.id)}>
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
