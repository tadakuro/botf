interface StatCardProps { label: string; value: string | number; icon: string; }

export function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <div className="card flex items-center gap-4">
      <span className="text-3xl">{icon}</span>
      <div>
        <p className="text-2xl font-bold text-white">{value}</p>
        <p className="text-sm text-gray-400">{label}</p>
      </div>
    </div>
  );
}
