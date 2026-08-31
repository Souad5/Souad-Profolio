export function LoadingState({ label = "Loading…" }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-base-400">
      <span className="loading loading-spinner loading-lg"></span>
      <p className="text-sm">{label}</p>
    </div>
  );
}

export function ErrorState({ message = "Something went wrong", retry }) {
  return (
    <div className="alert alert-error justify-center">
      <span>{message}</span>
      {retry && (
        <button className="btn btn-sm btn-ghost" onClick={retry}>
          Retry
        </button>
      )}
    </div>
  );
}

export function EmptyState({ message = "Nothing here yet" }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-base-400 gap-2">
      <span className="text-4xl">🗂️</span>
      <p>{message}</p>
    </div>
  );
}
