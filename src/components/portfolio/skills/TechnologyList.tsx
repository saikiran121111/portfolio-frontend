interface TechnologyListProps {
  items: readonly string[];
  ariaLabel: string;
  label?: string;
  compact?: boolean;
}

export default function TechnologyList({
  items,
  ariaLabel,
  label,
  compact = false,
}: TechnologyListProps) {
  const technologies = Array.from(
    new Set(items.map((item) => item.trim()).filter(Boolean)),
  );

  if (!technologies.length) return null;

  return (
    <div className={compact ? "technology-display is-compact" : "technology-display"}>
      {label ? <p className="technology-display-label">{label}</p> : null}
      <ul className="technology-list" aria-label={ariaLabel}>
        {technologies.map((technology) => (
          <li key={technology}>{technology}</li>
        ))}
      </ul>
    </div>
  );
}
