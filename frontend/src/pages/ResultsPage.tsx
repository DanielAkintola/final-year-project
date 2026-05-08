import { useMemo, useState } from 'react';
import { Download, Trophy } from 'lucide-react';

import { PageHeader } from '../components/PageHeader';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Field, FieldLabel, Input, Select } from '../components/ui/Form';
import { mockCandidates, mockLGAs, mockParties, mockTurnoutStats } from '../mocks/data';

type ResultRow = {
  candidateId: string;
  candidateName: string;
  partyName: string;
  lgaId: string;
  votes: number;
};

const seedResults: ResultRow[] = [
  { candidateId: 'cand-1', candidateName: 'Rotimi Akeredolu', partyName: 'APC', lgaId: 'lga-1', votes: 476200 },
  { candidateId: 'cand-2', candidateName: 'Eyitayo Jegede', partyName: 'PDP', lgaId: 'lga-1', votes: 429800 },
  { candidateId: 'cand-1', candidateName: 'Rotimi Akeredolu', partyName: 'APC', lgaId: 'lga-2', votes: 288500 },
  { candidateId: 'cand-2', candidateName: 'Eyitayo Jegede', partyName: 'PDP', lgaId: 'lga-2', votes: 309000 },
  { candidateId: 'cand-1', candidateName: 'Rotimi Akeredolu', partyName: 'APC', lgaId: 'lga-3', votes: 221900 },
  { candidateId: 'cand-2', candidateName: 'Eyitayo Jegede', partyName: 'PDP', lgaId: 'lga-3', votes: 210600 },
];

function downloadCsv(filename: string, rows: Array<Record<string, string | number>>) {
  const headers = Object.keys(rows[0] ?? {});
  const body = rows.map((row) => headers.map((header) => String(row[header] ?? '')).join(','));
  const csv = [headers.join(','), ...body].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function ResultsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLgaId, setSelectedLgaId] = useState('ALL');

  const candidates = mockCandidates;
  const parties = mockParties;

  const aggregated = useMemo(() => {
    const filtered =
      selectedLgaId === 'ALL'
        ? seedResults
        : seedResults.filter((result) => result.lgaId === selectedLgaId);

    const byCandidate = new Map<string, ResultRow>();
    filtered.forEach((row) => {
      const existing = byCandidate.get(row.candidateId);
      if (existing) {
        existing.votes += row.votes;
        return;
      }
      byCandidate.set(row.candidateId, { ...row });
    });

    const results = Array.from(byCandidate.values());
    const totalVotes = results.reduce((sum, row) => sum + row.votes, 0);

    return results
      .map((row) => ({
        ...row,
        percentage: totalVotes === 0 ? 0 : (row.votes / totalVotes) * 100,
      }))
      .filter((row) =>
        `${row.candidateName} ${row.partyName}`.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      .sort((a, b) => b.votes - a.votes);
  }, [searchTerm, selectedLgaId]);

  const totalVisibleVotes = aggregated.reduce((sum, row) => sum + row.votes, 0);
  const leader = aggregated[0];

  function exportVisibleResults() {
    if (aggregated.length === 0) return;
    downloadCsv(
      'results-export.csv',
      aggregated.map((row) => ({
        candidate: row.candidateName,
        party: row.partyName,
        votes: row.votes,
        percentage: `${row.percentage.toFixed(2)}%`,
      })),
    );
  }

  return (
    <>
      <PageHeader
        eyebrow="Admin Workspace"
        title="Results"
        description="Review vote totals, compare candidate performance, and export reports by geography."
      />

      <div className="stats-grid stats-grid-wide">
        <Card className="stat-card">
          <span>Total votes in view</span>
          <strong>{totalVisibleVotes.toLocaleString()}</strong>
          <small>Subset by current LGA filter</small>
        </Card>
        <Card className="stat-card">
          <span>Leader</span>
          <strong>{leader ? leader.candidateName : 'N/A'}</strong>
          <small>{leader ? `${leader.percentage.toFixed(2)}%` : 'No data available'}</small>
        </Card>
        <Card className="stat-card">
          <span>Turnout benchmark</span>
          <strong>{Math.round((mockTurnoutStats.totalVotesCast / mockTurnoutStats.totalRegisteredVoters) * 100)}%</strong>
          <small>From monitoring totals</small>
        </Card>
      </div>

      <div className="geo-workspace">
        <Card className="geo-form-card">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Narrow down the result view before export.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="geo-form-grid">
              <Field>
                <FieldLabel>Search Candidate / Party</FieldLabel>
                <Input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search results"
                />
              </Field>
              <Field>
                <FieldLabel>LGA</FieldLabel>
                <Select value={selectedLgaId} onChange={(event) => setSelectedLgaId(event.target.value)}>
                  <option value="ALL">All LGAs</option>
                  {mockLGAs.map((lga) => (
                    <option key={lga.id} value={lga.id}>
                      {lga.name}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>
            <div className="geo-form-actions">
              <Button type="button" onClick={exportVisibleResults}>
                <Download size={16} />
                Export CSV
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="geo-list-card">
          <CardHeader>
            <CardTitle>Result Table</CardTitle>
            <CardDescription>Live consolidated totals from all reporting units in scope.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="geo-table">
              <div className="geo-table-header">
                <div className="geo-col-name">Candidate</div>
                <div className="geo-col-code">Party</div>
                <div className="geo-col-code">Votes</div>
                <div className="geo-col-status">Share</div>
                <div className="geo-col-actions">Rank</div>
              </div>
              <div className="geo-table-body">
                {aggregated.map((row, index) => (
                  <div key={row.candidateId} className="geo-table-row">
                    <div className="geo-col-name">
                      <strong>{row.candidateName}</strong>
                    </div>
                    <div className="geo-col-code">{row.partyName}</div>
                    <div className="geo-col-code">{row.votes.toLocaleString()}</div>
                    <div className="geo-col-status">
                      <span className="geo-status-badge geo-status-active">{row.percentage.toFixed(2)}%</span>
                    </div>
                    <div className="geo-col-actions">
                      {index === 0 ? (
                        <span style={{ color: '#B45309', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                          <Trophy size={15} /> Leading
                        </span>
                      ) : (
                        <span style={{ color: '#64748B' }}>#{index + 1}</span>
                      )}
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
