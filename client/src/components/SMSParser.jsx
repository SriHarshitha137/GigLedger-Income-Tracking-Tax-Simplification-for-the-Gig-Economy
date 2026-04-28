import { useState } from 'react';
import api from '../lib/axios';
import IncomeForm from './IncomeForm';

const confidenceClass = (confidence) => {
  if (confidence > 0.8) return 'bg-green-100 text-green-700';
  if (confidence >= 0.5) return 'bg-yellow-100 text-yellow-700';
  return 'bg-red-100 text-red-700';
};

const SMSParser = ({ onSaved }) => {
  const [smsText, setSmsText] = useState('');
  const [parsed, setParsed] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  const parse = async () => {
    setLoading(true);
    setError('');
    setParsed(null);
    try {
      const { data } = await api.post('/api/income/parse-sms', { smsText });
      if (data.data.error) {
        setError(data.data.error);
        return;
      }
      setParsed(data.data);
      setShowForm(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not parse SMS');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="app-card">
      <div className="mb-3 flex items-center justify-between">
        <div><h2 className="text-xl font-semibold text-slate-900">SMS parser</h2><p className="text-sm text-slate-500">No external API key needed. Works with common payout message formats.</p></div>
        {parsed && <span className={`pill ${confidenceClass(parsed.confidence)}`}>{Math.round(parsed.confidence * 100)}% confidence</span>}
      </div>
      <textarea
        value={smsText}
        onChange={(e) => setSmsText(e.target.value)}
        placeholder="Paste your payout SMS here"
        className="h-28 w-full rounded-[10px] border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
      />
      {error && <p className="mt-2 rounded-md bg-red-50 p-2 text-sm text-red-700">{error}</p>}
      {parsed && <div className="mt-3 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-950">Detected {parsed.platform} payout of ₹{Number(parsed.amount).toLocaleString('en-IN')} for {parsed.date}.</div>}
      <button onClick={parse} disabled={loading || !smsText.trim()} className="btn-primary mt-3">
        {loading ? <span className="block h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" /> : 'Parse SMS'}
      </button>
      <IncomeForm open={showForm} onClose={() => setShowForm(false)} onSaved={onSaved} initialData={parsed ? { ...parsed, source: 'sms_parsed' } : null} />
    </section>
  );
};

export default SMSParser;
