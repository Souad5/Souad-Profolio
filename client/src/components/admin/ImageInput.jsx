export default function ImageInput({ label, value, onChange, placeholder = "/image.png" }) {
  return (
    <div className="form-control w-full">
      <span className="label">
        <span className="label-text">{label} (image URL)</span>
      </span>
      <div className="flex items-center gap-3">
        <div className="avatar">
          <div className="w-14 h-14 rounded-lg bg-base-200 overflow-hidden">
            {value ? (
              <img src={value} alt="preview" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-base-400 text-xs">
                none
              </div>
            )}
          </div>
        </div>
        <input
          type="text"
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="input input-bordered w-full"
        />
      </div>
    </div>
  );
}
