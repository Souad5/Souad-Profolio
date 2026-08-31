export function Field({ label, children, hint }) {
  return (
    <label className="form-control w-full">
      <span className="label">
        <span className="label-text">{label}</span>
      </span>
      {children}
      {hint && <span className="label-text-alt opacity-70 mt-1">{hint}</span>}
    </label>
  );
}

export function TextInput({ ...props }) {
  return <input {...props} className={`input input-bordered w-full ${props.className ?? ""}`} />;
}

export function TextArea({ ...props }) {
  return <textarea {...props} className={`textarea textarea-bordered w-full ${props.className ?? ""}`} />;
}

export function Toggle({ checked, onChange, label }) {
  return (
    <label className="flex items-center justify-between gap-3 cursor-pointer">
      <span className="label-text">{label}</span>
      <input
        type="checkbox"
        className="toggle toggle-primary"
        checked={!!checked}
        onChange={(e) => onChange(e.target.checked)}
      />
    </label>
  );
}

export function StatusToggle({ checked, onChange }) {
  return (
    <input
      type="checkbox"
      className="toggle toggle-success toggle-sm"
      checked={!!checked}
      onChange={(e) => onChange(e.target.checked)}
      aria-label="toggle status"
    />
  );
}
