export function getRankColor(rank: number): string {
  if (rank === 1) {
    return "from-yellow-300 to-yellow-500 text-black shadow-yellow-500/40";
  }
  if (rank === 2) {
    return "from-slate-200 to-slate-400 text-black shadow-slate-400/40";
  }
  if (rank === 3) {
    return "from-orange-300 to-orange-500 text-white shadow-orange-500/40";
  }
  return "bg-secondary text-white";
}

export function getRankColorLinear(rank: number): string {
  if (rank === 1) {
    return "bg-linear-to-br from-yellow-300 to-yellow-500 text-black shadow-yellow-500/30";
  }
  if (rank === 2) {
    return "bg-linear-to-br from-slate-200 to-slate-400 text-black shadow-slate-400/30";
  }
  if (rank === 3) {
    return "bg-linear-to-br from-orange-300 to-orange-500 text-white shadow-orange-500/30";
  }
  return "bg-secondary text-foreground";
}
