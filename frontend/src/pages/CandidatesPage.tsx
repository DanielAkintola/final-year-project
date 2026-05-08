import { useEffect, useMemo, useState } from 'react';
import { CheckCircle, Edit2, Plus, Search, Trash2, XCircle } from 'lucide-react';

import { PageHeader } from '../components/PageHeader';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Field, FieldLabel, Input, Select } from '../components/ui/Form';

export type Candidate = {
  id: string;
  name: string;
  party: string;
  election: string;
  ballotOrder: number;
  status: 'DRAFT' | 'APPROVED' | 'DISQUALIFIED' | 'WITHDRAWN';
  createdAt: string;
};

const CANDIDATES_KEY = 'ondo-candidates';

type CandidateForm = {
  name: string;
  party: string;
  election: string;
  ballotOrder: number;
  status: Candidate['status'];
};

const emptyForm: CandidateForm = {
  name: '',
  party: '',
  election: '',
  ballotOrder: 1,
  status: 'DRAFT',
};

function loadCandidates(): Candidate[] {
  try {
    const raw = localStorage.getItem(CANDIDATES_KEY);
    if (!raw) {
      const defaults: Candidate[] = [
        { id: 'c1', name: 'Candidate A', party: 'PDP', election: 'elec-1', ballotOrder: 1, status: 'APPROVED', createdAt: '2024-01-01' },
        { id: 'c2', name: 'Candidate B', party: 'APC', election: 'elec-1', ballotOrder: 2, status: 'APPROVED', createdAt: '2024-01-01' },
      ];
      localStorage.setItem(CANDIDATES_KEY, JSON.stringify(defaults));
      return defaults;
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function CandidatesPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [form, setForm] = useState<CandidateForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setCandidates(loadCandidates());
  }, []);

  useEffect(() => {
    localStorage.setItem(CANDIDATES_KEY, JSON.stringify(candidates));
  }, [candidates]);

  const filtered = useMemo(
    () => candidates.filter((c) => c.name.toLowerCase().includes(searchTerm.toLowerCase())),
    [candidates, searchTerm],
  );

  function showFeedback(msg: string, type: 'success' | 'error' = 'success') {
    setFeedback({ message: msg, type });
    setTimeout(() => setFeedback(null), 2500);
  }

  function handleSave() {
    if (!form.name.trim() || !form.party || !form.election) {
      showFeedback('All fields required', 'error');
      return;
    }

    if (editingId) {
      setCandidates((c) => c.map((x) => (x.id === editingId ? { ...x, ...form, ballotOrder: Number(form.ballotOrder) } : x)));
      showFeedback(`✓ ${form.name} updated`);
    } else {
      setCandidates((c) => [
        { id: `c${Date.now()}`, ...form, ballotOrder: Number(form.ballotOrder), createdAt: new Date().toISOString() },
        ...c,
      ]);
      showFeedback(`✓ ${form.name} created`);
    }
    setForm(emptyForm);
    setEditingId(null);
  }

  return (
    <>
      <PageHeader
        eyebrow="Admin Workspace"
        title="Candidates"
        description="Manage candidates, assign to parties, set ballot order, and manage approval status."
      />

      {feedback && (
        <div className={`geo-feedback ${feedback.type === 'success' ? 'geo-feedback-success' : 'geo-feedback-error'}`}>
          {feedback.type === 'success' ? <CheckCircle size={18} /> : <XCircle size={18} />}
          <span>{feedback.message}</span>
        </div>
      )}

      <div className="geo-workspace">
        <Card className="geo-form-card">
          <CardHeader>
            <CardTitle>{editingId ? 'Edit Candidate' : 'Add Candidate'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="geo-form" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
              <div className="geo-form-grid">
                <Field>
                  <FieldLabel>Candidate Name</FieldLabel>
                  <Input
                    placeholder="Full name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    autoFocus
                  />
                </Field>
                <Field>
                  <FieldLabel>Party</FieldLabel>
                  <Select value={form.party} onChange={(e) => setForm({ ...form, party: e.target.value })}>
                    <option value="">Select party</option>
                    <option value="PDP">PDP</option>
                    <option value="APC">APC</option>
                    <option value="LP">LP</option>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel>Election</FieldLabel>
                  <Select value={form.election} onChange={(e) => setForm({ ...form, election: e.target.value })}>
                    <option value="">Select election</option>
                    <option value="elec-1">Ondo Governorship 2026</option>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel>Ballot Order</FieldLabel>
                  <Input type="number" min="1" value={form.ballotOrder} onChange={(e) => setForm({ ...form, ballotOrder: Number(e.target.value) })} />
                </Field>
              </div>

              <Field>
                <FieldLabel>Status</FieldLabel>
                <Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as any })}>
                  <option value="DRAFT">Draft</option>
                  <option value="APPROVED">Approved</option>
                  <option value="DISQUALIFIED">Disqualified</option>
                  <option value="WITHDRAWN">Withdrawn</option>
                </Select>
              </Field>

              <div className="geo-form-actions">
                <Button type="submit"><Plus size={16} />{editingId ? 'Update' : 'Create'}</Button>
                {editingId && <Button type="button" variant="ghost" onClick={() => { setForm(emptyForm); setEditingId(null); }}>Cancel</Button>}
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="geo-list-card">
          <CardHeader>
            <div className="geo-list-header">
              <div><CardTitle>Candidates ({filtered.length})</CardTitle></div>
              <div className="geo-search-box">
                <Search size={18} />
                <Input placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="geo-search-input" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filtered.length === 0 ? (
              <div className="geo-empty-state">
                <p className="geo-empty-title">{candidates.length === 0 ? 'No candidates' : 'No results'}</p>
              </div>
            ) : (
              <div className="geo-table">
                <div className="geo-table-header">
                  <div className="geo-col-name">Name</div>
                  <div className="geo-col-code">Party</div>
                  <div className="geo-col-code">Order</div>
                  <div className="geo-col-status">Status</div>
                  <div className="geo-col-actions">Actions</div>
                </div>
                <div className="geo-table-body">
                  {filtered.map((c) => (
                    <div key={c.id} className="geo-table-row">
                      <div className="geo-col-name"><strong>{c.name}</strong></div>
                      <div className="geo-col-code"><code>{c.party}</code></div>
                      <div className="geo-col-code">{c.ballotOrder}</div>
                      <div className="geo-col-status">
                        <span className={`geo-status-badge ${c.status === 'APPROVED' ? 'geo-status-active' : 'geo-status-inactive'}`}>
                          {c.status}
                        </span>
                      </div>
                      <div className="geo-col-actions">
                        <Button variant="ghost" onClick={() => { setEditingId(c.id); setForm({ name: c.name, party: c.party, election: c.election, ballotOrder: c.ballotOrder, status: c.status }); }}>
                          <Edit2 size={16} />
                        </Button>
                        <Button variant="ghost" onClick={() => { setCandidates((x) => x.filter((item) => item.id !== c.id)); showFeedback(`${c.name} deleted`); }}>
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
