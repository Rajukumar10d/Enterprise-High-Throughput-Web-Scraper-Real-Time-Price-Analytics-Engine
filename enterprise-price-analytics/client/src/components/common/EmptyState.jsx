export default function EmptyState({ title = 'No data available', description = 'There are no records to display.' }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-600">
      <p className="text-lg font-semibold text-slate-700">{title}</p>
      <p className="mt-2 text-sm">{description}</p>
    </div>
  )
}
