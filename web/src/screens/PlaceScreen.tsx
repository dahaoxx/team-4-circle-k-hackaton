import type { ReactNode } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { PLACES } from '../lib/places'
import { useKvil } from '../lib/state'
import {
  PlainCard,
  Pill,
  PrimaryButton,
  BackLink,
  KvilMark,
  BoltIcon,
  FlameIcon,
  WifiIcon,
  CoffeeIcon,
  CarwashIcon,
  ClockIcon,
} from '../components/ui'

/** A per-place themed page — each feels like its own place (Epic 1.3), with the
 *  menu priced + sourced before any commitment (5.1) and one-tap reorder (3.4). */
export function PlaceScreen() {
  const { placeId } = useParams()
  const navigate = useNavigate()
  const { member, collected } = useKvil()
  const place = (placeId && PLACES[placeId]) || PLACES.lom

  const isUsualPlace = member.usual.placeId === place.id
  const visited = collected.includes(place.id)

  const amenities = [
    place.amenities.kitchen && { icon: <CoffeeIcon />, label: 'Kjøkken' },
    place.amenities.fireplace && { icon: <FlameIcon />, label: 'Peis' },
    place.amenities.wifi && { icon: <WifiIcon />, label: 'Wifi' },
    place.amenities.carwash && { icon: <CarwashIcon />, label: 'Vask' },
  ].filter(Boolean) as { icon: ReactNode; label: string }[]

  return (
    <div data-place={place.id} className="flex min-h-full flex-col bg-[var(--place-bg)]">
      {/* Hero */}
      <div className="relative h-48">
        <img src={place.photo} alt={place.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-0.5 p-5 text-white">
          <p className="text-xs uppercase tracking-[0.2em] opacity-85">{place.tagline}</p>
          <h1 className="font-display text-3xl font-semibold">{place.name}</h1>
          <p className="text-sm opacity-90">
            {place.city} · {place.region}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4 p-5">
        {/* Host + the small Tier-2 mark */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-[var(--kvil-text-soft)]">Vert</p>
            <p className="font-display text-lg font-semibold text-[var(--place-ink)]">
              {place.host}
            </p>
          </div>
          <KvilMark withParent />
        </div>

        {visited && (
          <div className="rounded-xl border border-[#4caf50] bg-[#e8f5e9] p-3 text-sm font-semibold text-[#2e7d32]">
            ✓ Samla på passet ditt
          </div>
        )}

        {/* Amenities */}
        <div className="flex flex-wrap gap-2">
          <Pill icon={<BoltIcon />}>{place.fastChargerKw} kW</Pill>
          <Pill>
            {place.baysFree}/{place.baysTotal} ledige bays
          </Pill>
          {amenities.map((a) => (
            <Pill key={a.label} icon={a.icon}>
              {a.label}
            </Pill>
          ))}
        </div>

        {/* Signature */}
        <PlainCard>
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--kvil-text-soft)]">Signatur</p>
          <p className="mt-1 text-[var(--place-ink)]">{place.signature}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {place.topCategories.map((c) => (
              <span
                key={c}
                className="rounded-full bg-[var(--place-soft)] px-3 py-1 text-xs text-[var(--place-ink)]"
              >
                {c}
              </span>
            ))}
          </div>
        </PlainCard>

        {/* Menu — priced + sourced up front (Epic 5.1) */}
        <section className="flex flex-col gap-2">
          <h3 className="text-xs uppercase tracking-[0.2em] text-[var(--kvil-text-soft)]">Meny</h3>
          {place.menu.map((m) => (
            <PlainCard key={m.id}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-display font-semibold text-[#2b2626]">{m.name}</p>
                    {m.signature && (
                      <span className="rounded-full bg-[#171616] px-2 py-0.5 text-[10px] font-semibold text-white">
                        signatur
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[var(--kvil-text-soft)]">{m.sourcing}</p>
                  <p className="mt-1 flex items-center gap-1 text-xs text-[var(--kvil-text-soft)]">
                    <ClockIcon /> klar om ~{m.readyMin} min
                  </p>
                </div>
                <span className="shrink-0 font-display font-semibold text-[#2b2626]">
                  {m.priceNok} kr
                </span>
              </div>
            </PlainCard>
          ))}
        </section>

        {/* Actions */}
        {isUsualPlace && (
          <PrimaryButton
            className="!bg-[var(--place-accent)]"
            onClick={() =>
              navigate(`/snogg?place=${place.id}&item=${member.usual.itemId}&reorder=1`)
            }
          >
            Bestill «det vanlige»
          </PrimaryButton>
        )}
        <PrimaryButton to={`/plug-in?place=${place.id}`}>Plugg inn her</PrimaryButton>
        <BackLink to="/">Tilbake til vegen</BackLink>
      </div>
    </div>
  )
}
