export default function Loading({ message = 'Loading data...' }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 text-slate-600 shadow-sm">
      <span className="spinner" aria-label="Loading" />
      <span>{message}</span>
    </div>
  )
}
