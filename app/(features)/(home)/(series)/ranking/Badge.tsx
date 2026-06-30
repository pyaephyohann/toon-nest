interface Props {
  badge?: string;
}

export default function Badge({ badge }: Props) {
  if (!badge) return null;

  return (
    <span className="absolute right-2 top-2 rounded-md bg-primary px-2 py-1 text-[10px] font-semibold text-white">
      {badge}
    </span>
  );
}
