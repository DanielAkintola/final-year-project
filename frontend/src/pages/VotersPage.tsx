import { useEffect, useMemo, useState } from 'react';
import { CheckCircle, Edit2, Plus, Search, Trash2, XCircle } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Field, FieldLabel, Input, Select } from '../components/ui/Form';

const emptyForm = { voterId: '', firstName: '', lastName: '', phone: '', status: 'PENDING_REVIEW' as const, lga: '' };

export function VotersPage() {
  const [voters, setVoters] = useState(emptyForm && localStorage.getItem('voters') ? JSON.parse(localStorage.getItem('voters')!) : []);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = useMemo(() => voters.filter((v: any) => v.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || v.voterId.includes(searchTerm)), [voters, searchTerm]);

  function handleSave() {
    if (!form.voterId.trim() || !form.firstName.trim()) return;
    if (editingId) {
      setVoters((v: any[]) => v.map((x) => x.id === editingId ? { ...x, ...form } : x));
    } else {
      setVoters((v: any[]) => [{ id: `v${Date.now()}`, ...form }, ...v]);
    }
    setForm(emptyForm);
    setEditingId(null);
  }

  useEffect(() => {
    localStorage.setItem('voters', JSON.stringify(voters));
  }, [voters]);

  return (
    <>
      <PageHeader eyebrow="Admin Workspace" title="Voters" description="Register, approve, and manage voter records." />
      <div className="geo-workspace">
        <Card className="geo-form-card">
          <CardHeader><CardTitle>{editingId ? 'Edit Voter' : 'Register Voter'}</CardTitle></CardHeader>
          <CardContent>
            <form className="geo-form" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
              <div className="geo-form-grid">
                <Field><FieldLabel>Voter ID</FieldLabel><Input placeholder="VT001" value={form.voterId} onChange={(e) => setForm({ ...form, voterId: e.target.value })} autoFocus /></Field>
                <Field><FieldLabel>First Name</FieldLabel><Input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} /></Field>
                <Field><FieldLabel>Last Name</FieldLabel><Input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} /></Field>
                <Field><FieldLabel>Phone</FieldLabel><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></Field>
              </div>
              <div className="geo-form-actions"><Button type="submit"><Plus size={16} />{editingId ? 'Update' : 'Register'}</Button></div>
            </form>
          </CardContent>
        </Card>
        <Card className="geo-list-card">
          <CardHeader><CardTitle>Voters ({filtered.length})</CardTitle></CardHeader>
          <CardContent>
            {filtered.length === 0 ? <div className="geo-empty-state"><p className="geo-empty-title">No voters</p></div> : (
              <div className="geo-table">
                <div className="geo-table-header"><div className="geo-col-name">Name</div><div className="geo-col-code">ID</div><div className="geo-col-status">Status</div><div className="geo-col-actions">Actions</div></div>
                <div className="geo-table-body">
                  {filtered.map((v: any) => (
                    <div key={v.id} className="geo-table-row">
                      <div className="geo-col-name"><strong>{v.firstName} {v.lastName}</strong></div>
                      <div className="geo-col-code"><code>{v.voterId}</code></div>
                      <div className="geo-col-status"><span className="geo-status-badge geo-status-active">{v.status}</span></div>
                      <div className="geo-col-actions"><Button variant="ghost" onClick={() => setVoters((x: any[]) => x.filter((item) => item.id !== v.id))}><Trash2 size={16} /></Button></div>
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
