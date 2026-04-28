import { useState } from 'react';
import GSTAlert from '../components/GSTAlert';
import IncomeForm from '../components/IncomeForm';
import MonthlyTrendChart from '../charts/MonthlyTrendChart';
import PlatformComparisonChart from '../charts/PlatformComparisonChart';
import { useAnalytics } from '../hooks/useAnalytics';
import { useIncome } from '../hooks/useIncome';

const rupees = (value) => `₹${Number(value || 0).toLocaleString('en-IN')}`;
const dateText = (date) => new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
const loanStatus = (monthlyIncome, netAfterExpenses) => {
  if (monthlyIncome >= 35000 && netAfterExpenses > 25000) return { label: 'Strong loan profile', tone: 'text-green-700 bg-green-50 border-green-100', note: 'Stable monthly collections look healthy.' };
  if (monthlyIncome >= 18000) return { label: 'Building eligibility', tone: 'text-orange-700 bg-orange-50 border-orange-100', note: 'Keep adding entries for a stronger proof trail.' };
  return { label: 'Needs more history', tone: 'text-slate-700 bg-slate-50 border-slate-200', note: 'More consistent income records will help.' };
};

const DashboardPage = () => {
  const [open, setOpen] = useState(false);
  const summary = useAnalytics('/api/analytics/summary');
  const trend = useAnalytics('/api/analytics/monthly-trend');
  const platform = useAnalytics('/api/analytics/platform-comparison');
  const income = useIncome({ limit: 5 });

  const refresh = () => {
    summary.refetch();
    trend.refetch();
    platform.refetch();
    income.refetch();
  };

  if (summary.loading) return <p className="p-4 text-slate-600">Loading dashboard...</p>;
  if (summary.error) return <p className="p-4 text-red-700">{summary.error}</p>;

  const loan = loanStatus(summary.data.thisMonth, summary.data.netAfterExpenses);
  const stats = [
    ['Total this month', summary.data.thisMonth, 'border-l-blue-600'],
    ['Total this year', summary.data.thisYear, 'border-l-orange-500'],
    ['Net after expenses', summary.data.netAfterExpenses, 'border-l-green-600'],
    ['Estimated tax', summary.data.estimatedTax, 'border-l-slate-900']
  ];

  return (
    <main className="page-shell">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div><p className="text-sm font-semibold text-blue-700">Good to see you</p><h1 className="text-[30px] font-bold text-slate-900">Performance dashboard</h1><p className="text-sm text-slate-500">Monthly collections, platform mix, tax estimate, and loan-readiness signals.</p></div>
        <button onClick={() => setOpen(true)} className="btn-primary">Quick add income</button>
      </div>
      <GSTAlert show={summary.data.gstThresholdAlert} />
      <section className="app-card overflow-hidden bg-slate-950 text-white">
        <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
          <div>
            <p className="text-sm text-blue-100">Loan eligibility snapshot</p>
            <h2 className="mt-2 text-2xl font-bold">{loan.label}</h2>
            <p className="mt-2 text-sm text-slate-300">{loan.note} Banks and NBFCs usually look for consistent monthly collections, low expense pressure, and proof documents.</p>
          </div>
          <div className={`rounded-2xl border p-4 ${loan.tone}`}>
            <p className="text-sm font-semibold">Monthly collection</p>
            <p className="mt-1 text-3xl font-bold">{rupees(summary.data.thisMonth)}</p>
            <p className="mt-2 text-xs">Use Certificate page to generate income proof.</p>
          </div>
        </div>
      </section>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(([label, value, border]) => <div key={label} className={`stat-card border-l-4 ${border}`}><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-2xl font-bold text-slate-900">{rupees(value)}</p></div>)}
      </section>
      <section className="grid gap-5 xl:grid-cols-2">
        <div className="app-card"><h2 className="mb-3 text-xl font-semibold text-slate-900">Monthly collections</h2>{trend.loading ? <div className="skeleton h-72" /> : <MonthlyTrendChart data={(trend.data || []).slice(-6)} />}</div>
        <div className="app-card"><h2 className="mb-3 text-xl font-semibold text-slate-900">Gig app performance</h2>{platform.loading ? <div className="skeleton h-72" /> : <PlatformComparisonChart data={platform.data || []} />}</div>
      </section>
      <section className="app-card">
        <h2 className="mb-3 text-xl font-semibold text-slate-900">Recent entries</h2>
        {income.loading ? <p>Loading...</p> : (
          <div className="overflow-x-auto"><table className="fin-table"><thead><tr><th>Date</th><th>Platform</th><th>Amount</th></tr></thead><tbody>{income.entries.map((entry) => <tr key={entry._id}><td>{dateText(entry.date)}</td><td>{entry.platform}</td><td className="font-semibold">{rupees(entry.amount)}</td></tr>)}</tbody></table></div>
        )}
      </section>
      <IncomeForm open={open} onClose={() => setOpen(false)} onSaved={refresh} />
    </main>
  );
};

export default DashboardPage;
