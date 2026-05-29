/**
 * The small "eit Kvil-sted" endorser mark — the thread that ties the distinct
 * places back to the Kvil collection. Tier 2 of the brand hierarchy.
 */
export function KvilMark({ withParent = false }: { withParent?: boolean }) {
  return (
    <div className="flex flex-col items-center leading-tight">
      <span className="text-[10px] uppercase tracking-[0.25em] text-[var(--kvil-muted)]">
        eit
      </span>
      <span className="font-serif-kvil text-sm tracking-wide text-[var(--kvil-ink)]">
        Kvil-sted
      </span>
      {withParent && (
        <span className="mt-0.5 text-[8px] uppercase tracking-[0.2em] text-[var(--kvil-muted)]">
          drift av Circle K
        </span>
      )}
    </div>
  )
}
