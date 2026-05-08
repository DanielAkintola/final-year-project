import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Flag, RefreshCcw, Search, XCircle } from 'lucide-react';

import { PageHeader } from '../components/PageHeader';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Input, Select } from '../components/ui/Form';
import { mockBiometricProfiles, mockVoters } from '../mocks/data';
import type { BiometricStatus } from '../types';

type BiometricReviewRecord = {
  id: string;
  voterId: string;
  voterName: string;
  faceStatus: BiometricStatus;
  fingerprintStatus: BiometricStatus;
  attempts: number;
  flagged: boolean;
  updatedAt: string;
};

const BIOMETRIC_REVIEW_KEY = 'ondo-biometric-review';

function loadRecords(): BiometricReviewRecord[] {
  try {
    const raw = localStorage.getItem(BIOMETRIC_REVIEW_KEY);
    if (raw) return JSON.parse(raw) as BiometricReviewRecord[];

    const defaults: BiometricReviewRecord[] = mockBiometricProfiles.map((profile) => {
      const voter = mockVoters.find((item) => item.id === profile.voterId);
      return {
        id: profile.id,
        voterId: profile.voterId,
        voterName: voter ? `${voter.firstName} ${voter.lastName}` : profile.voterId,
        faceStatus: profile.faceEnrollmentStatus,
        fingerprintStatus: profile.fingerprintEnrollmentStatus,
        attempts: profile.verificationAttempts,
        flagged: false,
        updatedAt: profile.createdAt,
      };
    });

    localStorage.setItem(BIOMETRIC_REVIEW_KEY, JSON.stringify(defaults));
    return defaults;
  } catch {
    return [];
  }
}

export function BiometricReviewPage() {
  const [records, setRecords] = useState<BiometricReviewRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | BiometricStatus>('ALL');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    setRecords(loadRecords());
  }, []);

  useEffect(() => {
    localStorage.setItem(BIOMETRIC_REVIEW_KEY, JSON.stringify(records));
  }, [records]);

  const filtered = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return records.filter((record) => {
      const matchesSearch =
        record.voterName.toLowerCase().includes(term) || record.voterId.toLowerCase().includes(term);
      const matchesStatus = statusFilter === 'ALL' || record.faceStatus === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [records, searchTerm, statusFilter]);

  function showFeedback(message: string, type: 'success' | 'error' = 'success') {
    setFeedback({ message, type });
    window.setTimeout(() => setFeedback(null), 2500);
  }

  function updateRecord(id: string, updater: (record: BiometricReviewRecord) => BiometricReviewRecord) {
    setRecords((current) => current.map((record) => (record.id === id ? updater(record) : record)));
  }

  function approveEnrollment(id: string) {
    updateRecord(id, (record) => ({
      ...record,
      faceStatus: 'ENROLLED',
      fingerprintStatus: 'ENROLLED',
      flagged: false,
      updatedAt: new Date().toISOString(),
    }));
    showFeedback('Biometric profile approved.');
  }

  function flagProfile(id: string) {
    updateRecord(id, (record) => ({
      ...record,
      faceStatus: 'POOR_QUALITY',
      flagged: true,
      updatedAt: new Date().toISOString(),
    }));
    showFeedback('Profile flagged for quality review.', 'error');
  }

  function requestReenrollment(id: string) {
    updateRecord(id, (record) => ({
      ...record,
      faceStatus: 'PENDING',
      fingerprintStatus: 'PENDING',
      attempts: record.attempts + 1,
      flagged: false,
      updatedAt: new Date().toISOString(),
    }));
    showFeedback('Re-enrollment request logged.');
  }

  return (
    <>
      <PageHeader
        eyebrow="Admin Workspace"
        title="Biometric Review"
        description="Review enrollment quality, approve valid profiles, and flag suspicious or poor biometric submissions."
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
            <CardTitle>Review Queue Controls</CardTitle>
            <CardDescription>Filter records by voter or biometric status to speed up validation.</CardDescription>
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
                    placeholder="Search by name or voter ID"
                  />
                </div>
              </label>
              <label className="ui-field">
                <span className="ui-field-label">Face Status</span>
                <Select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as 'ALL' | BiometricStatus)}>
                  <option value="ALL">All statuses</option>
                  <option value="PENDING">Pending</option>
                  <option value="ENROLLED">Enrolled</option>
                  <option value="POOR_QUALITY">Poor Quality</option>
                  <option value="DUPLICATE_ALERT">Duplicate Alert</option>
                  <option value="FAILED">Failed</option>
                </Select>
              </label>
            </div>
          </CardContent>
        </Card>

        <Card className="geo-list-card">
          <CardHeader>
            <CardTitle>Profiles ({filtered.length})</CardTitle>
            <CardDescription>Action each profile with approve, flag, or re-enrollment workflow.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="geo-table">
              <div className="geo-table-header">
                <div className="geo-col-name">Voter</div>
                <div className="geo-col-code">Face / Fingerprint</div>
                <div className="geo-col-status">Flags</div>
                <div className="geo-col-actions">Actions</div>
              </div>
              <div className="geo-table-body">
                {filtered.map((record) => (
                  <div key={record.id} className="geo-table-row">
                    <div className="geo-col-name">
                      <strong>{record.voterName}</strong>
                      <div style={{ color: '#64748B', fontSize: '0.82rem' }}>{record.voterId}</div>
                    </div>
                    <div className="geo-col-code">
                      <div>{record.faceStatus}</div>
                      <small style={{ color: '#64748B' }}>{record.fingerprintStatus}</small>
                    </div>
                    <div className="geo-col-status">
                      <span className={`geo-status-badge ${record.flagged ? 'geo-status-inactive' : 'geo-status-active'}`}>
                        {record.flagged ? 'Flagged' : 'Clean'}
                      </span>
                      <small style={{ display: 'block', marginTop: 6, color: '#64748B' }}>
                        Attempts: {record.attempts}
                      </small>
                    </div>
                    <div className="geo-col-actions">
                      <Button type="button" variant="ghost" onClick={() => approveEnrollment(record.id)}>
                        <CheckCircle2 size={16} />
                      </Button>
                      <Button type="button" variant="ghost" onClick={() => flagProfile(record.id)}>
                        <Flag size={16} />
                      </Button>
                      <Button type="button" variant="ghost" onClick={() => requestReenrollment(record.id)}>
                        <RefreshCcw size={16} />
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
