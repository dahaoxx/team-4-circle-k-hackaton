import { PLACE_LIST } from '../lib/places'

/** Stub: Kvilpasset join + passport of places collected. To be built out per impl plan §4.2. */
export function KvilpassetScreen() {
  // First two places shown as "collected" for the skeleton.
  const collected = new Set([PLACE_LIST[0].id, PLACE_LIST[1].id])

  return (
    <div className="flex flex-col gap-5 p-5">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--kvil-muted)]">
          Medlemskap
        </p>
        <h1 className="font-serif-kvil text-2xl text-[var(--kvil-ink)]">Kvilpasset</h1>
        <p className="text-sm text-[var(--kvil-muted)]">
          Eitt pass. Alle Kvil-stader.
        </p>
      </header>

      <section>
        <h3 className="mb-3 text-xs uppercase tracking-[0.2em] text-[var(--kvil-muted)]">
          Passet ditt — stader samla
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {PLACE_LIST.map((p) => {
            const got = collected.has(p.id)
            return (
              <div
                key={p.id}
                data-place={p.id}
                className={[
                  'aspect-square rounded-2xl border p-3 flex flex-col justify-between',
                  got
                    ? 'border-transparent bg-[var(--place-surface)]'
                    : 'border-dashed border-[var(--kvil-line)] bg-transparent opacity-50',
                ].join(' ')}
              >
                <span
                  className="self-end text-lg"
                  style={{ color: got ? 'var(--place-accent)' : 'var(--kvil-muted)' }}
                >
                  {got ? '●' : '○'}
                </span>
                <p className="font-serif-kvil text-sm text-[var(--place-ink)]">{p.name}</p>
              </div>
            )
          })}
        </div>
      </section>

      <button className="rounded-full bg-[var(--kvil-accent)] py-3 font-medium text-white">
        Bli Kvilpasset-medlem
      </button>
    </div>
  )
}
