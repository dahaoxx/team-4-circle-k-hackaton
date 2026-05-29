import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { api } from '../lib/api'
import type { ChargeEstimate, PlaceAmenities } from '../lib/types'
import { PLACES } from '../lib/places'
import { useKvil } from '../lib/state'
import {
  Screen,
  PageHeader,
  PlainCard,
  Pill,
  PrimaryButton,
  BackLink,
  ClockIcon,
  CoffeeIcon,
  FlameIcon,
  CarwashIcon,
  WifiIcon,
} from '../components/ui'

type Suggestion = {
  label: string
  min: number
  need?: keyof PlaceAmenities
  icon: ReactNode
}

const SUGGESTIONS: Suggestion[] = [
  { label: 'Ta dagens bolle og ein kaffi', min: 8, need: 'kitchen', icon: <CoffeeIcon /> },
  { label: 'Sit ned ved peisen', min: 15, need: 'fireplace', icon: <FlameIcon /> },
  { label: 'Køyr gjennom vasken', min: 8, need: 'carwash', icon: <CarwashIcon /> },
  { label: 'Svar på e-post på wifi', min: 18, need: 'wifi', icon: <WifiIcon /> },
  { label: 'Strekk på beina ute', min: 6, icon: <ClockIcon /> },
  { label: 'Eit varmt måltid frå kjøkkenet', min: 20, need: 'kitchen', icon: <CoffeeIcon /> },
]

/** "Stay" mode — what's worth doing during the predicted window (Epic 2.4). */
export function StayScreen() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { member, collectPlace, collected } = useKvil()
  const place = PLACES[params.get('place') ?? ''] ?? PLACES.lom

  const [estimate, setEstimate] = useState<ChargeEstimate | null>(null)
  useEffect(() => {
    api
      .getChargeEstimate({ stationId: place.stationId, memberId: member.memberId, socPct: member.socPct })
      .then((r) => setEstimate(r.data))
  }, [place.stationId, member.memberId, member.socPct])

  const window = estimate?.minutes ?? place.detourMin
  const fits = SUGGESTIONS.filter(
    (s) => s.min <= window && (!s.need || place.amenities[s.need]),
  )
  const checkedIn = collected.includes(place.id)

  return (
    <Screen place={place.id}>
      <PageHeader
        eyebrow={`Kvil · ${place.name}`}
        title={`Du har ${window} minutt`}
        sub="Pausen er poenget — slik kan du bruke han"
      />

      <div className="flex flex-col gap-2">
        {fits.map((s) => (
          <PlainCard key={s.label}>
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--place-soft)]">
                {s.icon}
              </span>
              <p className="flex-1 font-medium text-[#2b2626]">{s.label}</p>
              <Pill icon={<ClockIcon />}>{s.min} min</Pill>
            </div>
          </PlainCard>
        ))}
      </div>

      {checkedIn ? (
        <div className="rounded-xl border border-[#4caf50] bg-[#e8f5e9] p-3 text-center text-sm font-semibold text-[#2e7d32]">
          ✓ Sjekka inn — stempel samla
        </div>
      ) : (
        <PrimaryButton
          className="mt-auto !bg-[var(--place-accent)]"
          onClick={() => {
            collectPlace(place.id)
            navigate('/kvilpasset')
          }}
        >
          Eg er framme — samle stempel
        </PrimaryButton>
      )}
      <BackLink to={`/plug-in?place=${place.id}`}>Tilbake</BackLink>
    </Screen>
  )
}
