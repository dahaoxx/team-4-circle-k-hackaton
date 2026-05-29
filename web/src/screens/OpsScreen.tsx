import { useState } from 'react'
import { FIXTURE_OPS_STATIONS } from '../lib/ops'
import type { OpsStation } from '../lib/types'
import {
  Screen,
  PageHeader,
  PlainCard,
  Pill,
  BackLink,
  CheckIcon,
} from '../components/ui'

/**
 * Ops station admin (Epic 4.3): designate which stations are Kvil places and
 * curate each one's signature — the editorial control behind the curated
 * collection of Kvilstader.
 */
export function OpsScreen() {
  const [stations, setStations] = useState<OpsStation[]>(FIXTURE_OPS_STATIONS)

  const kvilCount = stations.filter((s) => s.isKvil).length

  const toggleKvil = (stationId: string) =>
    setStations((prev) =>
      prev.map((s) =>
        s.stationId === stationId ? { ...s, isKvil: !s.isKvil } : s,
      ),
    )

  const setSignature = (stationId: string, signature: string) =>
    setStations((prev) =>
      prev.map((s) => (s.stationId === stationId ? { ...s, signature } : s)),
    )

  return (
    <Screen>
      <PageHeader
        eyebrow="Ops · Kvilested-administrasjon"
        title="Kva stasjonar er Kvil?"
        sub={`${kvilCount} av ${stations.length} stasjonar er utnemnde til Kvilstader`}
      />

      <p className="text-sm text-[var(--kvil-text-soft)]">
        Dette er den kuraterte samlinga. Slå ein stasjon på som Kvilested og gi
        han ein signatur — det som gjer staden verd ein omveg.
      </p>

      <div className="flex flex-col gap-3">
        {stations.map((station) => (
          <PlainCard key={station.stationId} id={station.stationId}>
            <div className="flex flex-col gap-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-display text-base font-semibold text-[#2b2626]">
                    {station.name}
                  </p>
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--kvil-text-soft)]">
                    {station.region} · {station.stationId}
                  </p>
                </div>
                <Pill
                  active={station.isKvil}
                  onClick={() => toggleKvil(station.stationId)}
                  icon={station.isKvil ? <CheckIcon color="#ffffff" /> : undefined}
                >
                  {station.isKvil ? 'Kvilested' : 'Gjer til Kvil'}
                </Pill>
              </div>

              {station.isKvil && (
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs uppercase tracking-[0.18em] text-[var(--kvil-text-soft)]">
                    Signatur
                  </span>
                  <input
                    type="text"
                    value={station.signature}
                    onChange={(e) =>
                      setSignature(station.stationId, e.target.value)
                    }
                    placeholder="Kva gjer denne staden spesiell?"
                    className="w-full rounded-xl border border-[var(--kvil-card-line)] bg-white px-3 py-2 text-sm text-[#241e1a] outline-none focus:border-[#171616]"
                  />
                </label>
              )}
            </div>
          </PlainCard>
        ))}
      </div>

      <BackLink to="/data">Tilbake til datapanelet</BackLink>
    </Screen>
  )
}
