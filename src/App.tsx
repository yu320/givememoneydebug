import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Bug, CheckCircle, Clock, LayoutGrid, Info } from 'lucide-react';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface BugReport {
  id: string;
  description: string;
  status: 'pending' | 'resolved';
  created_at: string;
  user_id: string;
}

export default function App() {
  const [reports, setReports] = useState<BugReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  async function fetchReports() {
    setLoading(true);
    const { data, error } = await supabase
      .from('bug_reports')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) setReports(data);
    setLoading(false);
  }

  const stats = {
    total: reports.length,
    pending: reports.filter(r => r.status === 'pending').length,
    resolved: reports.filter(r => r.status === 'resolved').length
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] text-slate-800 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-indigo-600 rounded-lg">
                <Bug className="text-white w-6 h-6" />
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight">Issue Tracker</h1>
            </div>
            <p className="text-slate-500 font-medium">GiveMeMoney 錯誤與功能建議看板</p>
          </div>
          <button 
            onClick={fetchReports}
            className="px-4 py-2 bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 transition-all font-semibold text-sm"
          >
            更新資料
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatCard icon={<LayoutGrid />} label="總量" value={stats.total} color="blue" />
          <StatCard icon={<Clock />} label="待處理" value={stats.pending} color="amber" />
          <StatCard icon={<CheckCircle />} label="已解決" value={stats.resolved} color="emerald" />
        </div>

        {/* Main List */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
            <Info className="w-5 h-5 text-indigo-500" />
            所有報告 ({reports.length})
          </h2>

          {loading ? (
            <div className="space-y-4 animate-pulse">
              {[1,2,3].map(i => <div key={i} className="h-32 bg-white rounded-xl border border-slate-200" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
              {reports.map((report) => (
                <div key={report.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <StatusBadge status={report.status} />
                    <span className="text-xs font-bold text-slate-400">
                      {new Date(report.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-slate-600 font-medium leading-relaxed mb-6 h-20 overflow-y-auto">
                    {report.description}
                  </p>
                  <div className="flex items-center gap-2 pt-4 border-t border-slate-50 text-xs text-slate-400 font-bold">
                    <span className="bg-slate-100 px-2 py-1 rounded">UID: {report.user_id.substring(0, 10)}...</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: any, label: string, value: number, color: string }) {
  const colors: any = {
    blue: "text-blue-600 bg-blue-50 border-blue-100",
    amber: "text-amber-600 bg-amber-50 border-amber-100",
    emerald: "text-emerald-600 bg-emerald-50 border-emerald-100"
  };
  return (
    <div className={`flex items-center gap-4 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm`}>
      <div className={`p-3 rounded-xl ${colors[color]} border`}>
        {React.cloneElement(icon as React.ReactElement, { className: "w-6 h-6" })}
      </div>
      <div>
        <div className="text-sm font-bold text-slate-400 uppercase tracking-wider">{label}</div>
        <div className="text-2xl font-black text-slate-800">{value}</div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === 'pending') {
    return <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-extrabold uppercase tracking-wide">Pending</span>;
  }
  return <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-extrabold uppercase tracking-wide whitespace-nowrap">Resolved</span>;
}
