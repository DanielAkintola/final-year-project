import { useEffect, useMemo, useState } from 'react';
import { Building2, CheckCircle, Edit2, Plus, Search, Trash2, XCircle } from 'lucide-react';

import { PageHeader } from '../components/PageHeader';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Field, FieldLabel, Input, Select } from '../components/ui/Form';
import { loadGeographyState, saveGeographyState } from '../data/geography';
import type { LGA } from '../types';

type LgaFormValues = {
  name: string;
  code: string;
  isActive: boolean;
};

const emptyLgaForm: LgaFormValues = {
  name: '',
  code: '',
  isActive: true,
};

function createId(prefix: string) {
  return `${prefix}-${Date.now()}`;
}

export function GeographyPage() {
  const [lgas, setLgas] = useState<LGA[]>([]);
  const [lgaForm, setLgaForm] = useState<LgaFormValues>(emptyLgaForm);
  const [editingLgaId, setEditingLgaId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const geography = loadGeographyState();
    setLgas(geography.lgas);
  }, []);

  useEffect(() => {
    saveGeographyState({
      ...loadGeographyState(),
      lgas,
    });
  }, [lgas]);

  const filteredLgas = useMemo(() => {
    if (!searchTerm.trim()) {
      return lgas;
    }
    const term = searchTerm.toLowerCase();
    return lgas.filter(
      (lga) => lga.name.toLowerCase().includes(term) || lga.code.toLowerCase().includes(term),
    );
  }, [lgas, searchTerm]);

  function showFeedback(message: string, type: 'success' | 'error' = 'success') {
    setFeedback({ message, type });
    window.setTimeout(() => setFeedback(null), 2500);
  }

  function clearForm() {
    setLgaForm(emptyLgaForm);
    setEditingLgaId(null);
  }

  function startEdit(lga: LGA) {
    setEditingLgaId(lga.id);
    setLgaForm({
      name: lga.name,
      code: lga.code,
      isActive: lga.isActive,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleSaveLga() {
    const name = lgaForm.name.trim();
    const code = lgaForm.code.trim().toUpperCase();

    if (!name || !code) {
      showFeedback('LGA name and code are required.', 'error');
      return;
    }

    const duplicateCode = lgas.some(
      (lga) => lga.code.toUpperCase() === code && lga.id !== editingLgaId,
    );

    if (duplicateCode) {
      showFeedback('That LGA code already exists.', 'error');
      return;
    }

    if (editingLgaId) {
      const updated = lgas.map((lga) =>
        lga.id === editingLgaId
          ? {
              ...lga,
              name,
              code,
              isActive: lgaForm.isActive,
            }
          : lga,
      );

      setLgas(updated);
      showFeedback(`✓ ${name} updated successfully`);
      clearForm();
      return;
    }

    const newLga: LGA = {
      id: createId('lga'),
      name,
      code,
      isActive: lgaForm.isActive,
      createdAt: new Date().toISOString(),
    };

    setLgas((current) => [newLga, ...current]);
    showFeedback(`✓ ${name} created successfully`);
    clearForm();
  }

  function toggleLgaStatus(lgaId: string) {
    const lga = lgas.find((item) => item.id === lgaId);
    if (!lga) return;

    setLgas((current) =>
      current.map((item) =>
        item.id === lgaId
          ? {
              ...item,
              isActive: !item.isActive,
            }
          : item,
      ),
    );
    showFeedback(`${lga.name} is now ${!lga.isActive ? 'active' : 'inactive'}`);
  }

  function removeLga(lgaId: string) {
    const lga = lgas.find((item) => item.id === lgaId);
    if (!lga) {
      return;
    }

    setLgas((current) => current.filter((item) => item.id !== lgaId));
    if (editingLgaId === lgaId) {
      clearForm();
    }
    showFeedback(`${lga.name} deleted`);
  }

  return (
    <>
      <PageHeader
        eyebrow="Admin Workspace"
        title="Geography"
        description="Manage geographic hierarchy (LGAs) for election configuration. Create, update, and activate/deactivate LGAs."
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
        {/* Form Section */}
        <Card className="geo-form-card">
          <CardHeader>
            <CardTitle>{editingLgaId ? 'Edit LGA' : 'Create New LGA'}</CardTitle>
            <CardDescription>
              {editingLgaId
                ? 'Update the LGA details below'
                : 'Add a new Local Government Area to your election system'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              className="geo-form"
              onSubmit={(event) => {
                event.preventDefault();
                handleSaveLga();
              }}
            >
              <div className="geo-form-grid">
                <Field>
                  <FieldLabel>LGA Name</FieldLabel>
                  <Input
                    placeholder="e.g., Akure South"
                    value={lgaForm.name}
                    onChange={(event) =>
                      setLgaForm((current) => ({ ...current, name: event.target.value }))
                    }
                    autoFocus
                  />
                </Field>

                <Field>
                  <FieldLabel>LGA Code</FieldLabel>
                  <Input
                    placeholder="e.g., AKR-S"
                    value={lgaForm.code}
                    onChange={(event) =>
                      setLgaForm((current) => ({ ...current, code: event.target.value }))
                    }
                  />
                </Field>
              </div>

              <label className="geo-checkbox">
                <input
                  type="checkbox"
                  checked={lgaForm.isActive}
                  onChange={(event) =>
                    setLgaForm((current) => ({ ...current, isActive: event.target.checked }))
                  }
                />
                <span>Active LGA</span>
                <small>Active LGAs are available for election configuration</small>
              </label>

              <div className="geo-form-actions">
                <Button type="submit">
                  <Plus size={16} />
                  {editingLgaId ? 'Update LGA' : 'Create LGA'}
                </Button>
                {editingLgaId && (
                  <Button type="button" variant="ghost" onClick={clearForm}>
                    Cancel Editing
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* List Section */}
        <Card className="geo-list-card">
          <CardHeader>
            <div className="geo-list-header">
              <div>
                <CardTitle>LGAs ({filteredLgas.length})</CardTitle>
                <CardDescription>Manage your geographic configuration</CardDescription>
              </div>
              <div className="geo-search-box">
                <Search size={18} />
                <Input
                  placeholder="Search LGAs..."
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  className="geo-search-input"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredLgas.length === 0 ? (
              <div className="geo-empty-state">
                <Building2 size={48} />
                <p className="geo-empty-title">
                  {lgas.length === 0 ? 'No LGAs yet' : 'No results found'}
                </p>
                <p className="geo-empty-desc">
                  {lgas.length === 0
                    ? 'Create your first LGA using the form above'
                    : 'Try adjusting your search criteria'}
                </p>
              </div>
            ) : (
              <div className="geo-table">
                <div className="geo-table-header">
                  <div className="geo-col-name">Name</div>
                  <div className="geo-col-code">Code</div>
                  <div className="geo-col-status">Status</div>
                  <div className="geo-col-actions">Actions</div>
                </div>
                <div className="geo-table-body">
                  {filteredLgas.map((lga) => (
                    <div key={lga.id} className="geo-table-row">
                      <div className="geo-col-name">
                        <strong>{lga.name}</strong>
                      </div>
                      <div className="geo-col-code">
                        <code>{lga.code}</code>
                      </div>
                      <div className="geo-col-status">
                        <span className={`geo-status-badge ${lga.isActive ? 'geo-status-active' : 'geo-status-inactive'}`}>
                          {lga.isActive ? (
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
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => startEdit(lga)}
                          title="Edit this LGA"
                        >
                          <Edit2 size={16} />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => toggleLgaStatus(lga.id)}
                          title={lga.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {lga.isActive ? 'Deactivate' : 'Activate'}
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => removeLga(lga.id)}
                          title="Delete this LGA"
                        >
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
