export default function ErrorMessage({ message = 'Unable to load data.', onRetry }) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700 shadow-sm">
      <p className="font-semibold">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-700"
        >
          Try Again
        </button>
      )}
    </div>
  )
}
