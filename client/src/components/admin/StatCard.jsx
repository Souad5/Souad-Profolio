export default function StatCard({ label, value, icon, accent = "primary" }) {
  return (
    <div className="card bg-base-100 shadow-sm border border-base-300">
      <div className="card-body flex-row items-center gap-4 p-5">
        <div className={`btn btn-circle btn-${accent} text-2xl`}>{icon}</div>
        <div>
          <p className="text-sm opacity-70">{label}</p>
          <p className="text-2xl font-bold">{value ?? 0}</p>
        </div>
      </div>
    </div>
  );
}
