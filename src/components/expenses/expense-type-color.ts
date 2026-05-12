export interface TypeAccent {
  dot: string;
  chip: string;
}

const TYPE_ACCENTS: TypeAccent[] = [
  { dot: "bg-fuchsia-500", chip: "bg-fuchsia-50 text-fuchsia-900 ring-fuchsia-200/70" },
  { dot: "bg-amber-500", chip: "bg-amber-50 text-amber-900 ring-amber-200/70" },
  { dot: "bg-emerald-500", chip: "bg-emerald-50 text-emerald-900 ring-emerald-200/70" },
  { dot: "bg-sky-500", chip: "bg-sky-50 text-sky-900 ring-sky-200/70" },
  { dot: "bg-rose-500", chip: "bg-rose-50 text-rose-900 ring-rose-200/70" },
  { dot: "bg-violet-500", chip: "bg-violet-50 text-violet-900 ring-violet-200/70" },
  { dot: "bg-teal-500", chip: "bg-teal-50 text-teal-900 ring-teal-200/70" },
  { dot: "bg-orange-500", chip: "bg-orange-50 text-orange-900 ring-orange-200/70" },
];

const NEUTRAL_ACCENT: TypeAccent = {
  dot: "bg-muted-foreground/50",
  chip: "bg-muted text-muted-foreground ring-border",
};

export function getTypeAccent(id: string | null | undefined): TypeAccent {
  if (!id) return NEUTRAL_ACCENT;

  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash |= 0;
  }
  return TYPE_ACCENTS[Math.abs(hash) % TYPE_ACCENTS.length] ?? NEUTRAL_ACCENT;
}
