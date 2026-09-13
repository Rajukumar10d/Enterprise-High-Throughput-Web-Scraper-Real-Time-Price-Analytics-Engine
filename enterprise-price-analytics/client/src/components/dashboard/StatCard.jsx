import { ArrowDownRight, ArrowUpRight } from 'lucide-react'

export default function StatCard({ title, value, detail, tone = 'neutral', icon: Icon }) {
  const tones = {
    neutral: 'bg-slate-50 text-slate-700 border-slate-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-red-50 text-red-700 border-red-200',
    info: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  }

  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{title}</p>
          <p className="mt-3 text-3xl font-bold text-slate-800">{value}</p>
        </div>
        {Icon && (
          <div className={`rounded-xl border p-2 ${tones[tone] || tones.neutral}`}>
            <Icon size={18} />
          </div>
        )}
      </div>
      <div className="mt-4 flex items-center gap-2 text-sm">
        {detail?.trend === 'up' ? <ArrowUpRight size={14} className="text-emerald-600" /> : null}
        {detail?.trend === 'down' ? <ArrowDownRight size={14} className="text-red-600" /> : null}
        <span className={detail?.trend === 'down' ? 'text-red-600' : 'text-slate-600'}>{detail?.text || '—'}</span>
      </div>
    </div>
  )
}
