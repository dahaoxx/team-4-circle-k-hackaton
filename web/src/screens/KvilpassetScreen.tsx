/**
 * Kvilpasset — Epic 3 (Membership / Extra Premium).
 *   3.1 Join / upgrade to Extra Premium in-app → tiered plans + instant digital pass.
 *   3.2 Recognition on arrival → "du blir kjend att" card (usual + tier).
 *   3.3 Passport of collected places → stamps, progress, unlocked perk.
 */
import { useKvil } from '../lib/state'
import { PLACES, PLACE_LIST } from '../lib/places'
import {
  Screen,
  PageHeader,
  AICard,
  PlainCard,
  PrimaryButton,
  BackLink,
  KBadge,
  ProgressBar,
  Stamp,
  GreenBanner,
  CheckIcon,
  BoltIcon,
  CoffeeIcon,
  ChevronRight,
} from '../components/ui'
import type { StampState } from '../components/ui'
import type { ReactNode } from 'react'

/** A single perk line inside a plan card. */
function Perk({ icon, children }: { icon?: ReactNode; children: ReactNode }) {
  return (
    <li className="flex items-start gap-2 text-sm text-[#2b2626]">
      <span className="mt-0.5 shrink-0">{icon ?? <CheckIcon />}</span>
      <span>{children}</span>
    </li>
  )
}

export function KvilpassetScreen() {
  const { member, isPremium, collected, upgradeToPremium } = useKvil()

  const total = PLACE_LIST.length
  const stamped = collected.length
  const progress = total > 0 ? (stamped / total) * 100 : 0
  const complete = stamped >= total

  const usualPlace = PLACES[member.usual.placeId]

  return (
    <Screen>
      <PageHeader
        eyebrow="Medlemskap"
        title="Kvilpasset"
        sub="Eitt pass. Alle Kvil-stader."
      />

      {/* 3.1 — Join / upgrade or instant digital pass */}
      {isPremium ? (
        <AICard glow>
          <div className="flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-0.5">
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--kvil-text-soft)]">
                  Digitalt pass
                </p>
                <p className="font-display text-xl font-semibold text-[#2b2626]">
                  {member.name}
                </p>
                <p className="text-sm font-semibold text-[#2b2626]">
                  Extra Premium
                </p>
              </div>
              <KBadge size={40} />
            </div>
            <div className="flex items-center justify-between rounded-xl border border-[var(--kvil-card-line)] bg-white/60 px-3 py-2">
              <span className="text-xs uppercase tracking-[0.16em] text-[var(--kvil-text-soft)]">
                Medlemsnr
              </span>
              <span className="font-mono text-sm font-semibold text-[#2b2626]">
                {member.memberId}
              </span>
            </div>
            <p className="text-xs leading-relaxed text-[var(--kvil-text-soft)]">
              Passet er aktivt. Vis det ved framkomst — vertskapet kjenner deg att.
            </p>
          </div>
        </AICard>
      ) : (
        <>
          <AICard glow>
            <div className="flex flex-col gap-2">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--kvil-text-soft)]">
                Din faste kvil
              </p>
              <p className="font-display text-lg font-semibold text-[#2b2626]">
                Ta deg ein kvil — utan å tenkje på det.
              </p>
              <p className="text-sm leading-relaxed text-[var(--kvil-text-soft)]">
                Med Extra Premium står det vanlege klart, ladeøkta er gratis og
                vertskapet kjenner deg att frå første stopp.
              </p>
            </div>
          </AICard>

          <div className="flex flex-col gap-3">
            <PlainCard>
              <div className="flex flex-col gap-3">
                <div className="flex items-baseline justify-between">
                  <p className="font-display text-lg font-semibold text-[#2b2626]">
                    Extra
                  </p>
                  <p className="text-sm font-semibold text-[#2b2626]">Gratis</p>
                </div>
                <ul className="flex flex-col gap-2">
                  <Perk>Samle stader i Kvilpasset</Perk>
                  <Perk>Bestill og betal i appen</Perk>
                  <Perk>Tener poeng på kvar kvil</Perk>
                </ul>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--kvil-text-soft)]">
                  <CheckIcon color="#645c56" />
                  Ditt noverande medlemskap
                </div>
              </div>
            </PlainCard>

            <PlainCard className="shadow-[var(--kvil-glow)]">
              <div className="flex flex-col gap-3">
                <div className="flex items-baseline justify-between">
                  <div className="flex items-center gap-2">
                    <KBadge size={22} />
                    <p className="font-display text-lg font-semibold text-[#2b2626]">
                      Extra Premium
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-[#2b2626]">
                    149 kr/mnd
                  </p>
                </div>
                <ul className="flex flex-col gap-2">
                  <Perk icon={<BoltIcon />}>Ei gratis ladeøkt kvar månad</Perk>
                  <Perk icon={<CoffeeIcon />}>Det vanlege klart når du kjem</Perk>
                  <Perk>Personleg vertskap på kvar stad</Perk>
                  <Perk>Eksklusiv Kvil-merch</Perk>
                </ul>
              </div>
            </PlainCard>
          </div>

          <PrimaryButton onClick={upgradeToPremium}>
            Bli Extra Premium — 149 kr/mnd
          </PrimaryButton>
        </>
      )}

      {/* 3.2 — Recognition on arrival */}
      <PlainCard>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-[0.2em] text-[var(--kvil-text-soft)]">
              Du blir kjend att
            </span>
          </div>
          <p className="text-sm leading-relaxed text-[#2b2626]">
            Vertskapet hjå{' '}
            <span className="font-semibold">{usualPlace?.name ?? 'Kvil'}</span> ser{' '}
            <span className="font-semibold">{member.name}</span> ({member.tier}) og
            har det vanlege klart:
          </p>
          <div className="flex items-center justify-between rounded-xl border border-[var(--kvil-card-line)] bg-[var(--kvil-card-soft)] px-3 py-2.5">
            <div className="flex items-center gap-2">
              <CoffeeIcon />
              <span className="text-sm font-semibold text-[#2b2626]">
                {member.usual.label}
              </span>
            </div>
            <ChevronRight />
          </div>
        </div>
      </PlainCard>

      {/* 3.3 — Passport of collected places */}
      <section className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-semibold text-[#2b2626]">
              Passet ditt
            </h2>
            <span className="text-xs font-semibold text-[var(--kvil-text-soft)]">
              {stamped} av {total} stader samla
            </span>
          </div>
          <ProgressBar value={progress} />
        </div>

        <PlainCard>
          <div className="grid grid-cols-4 gap-3">
            {PLACE_LIST.map((p) => {
              const state: StampState = collected.includes(p.id) ? 'done' : 'empty'
              return <Stamp key={p.id} name={p.city} state={state} />
            })}
          </div>
        </PlainCard>

        {complete && (
          <GreenBanner
            title="Passet fullført — gratis ladeøkt låst opp"
            body="Du har samla alle Kvil-stadene. Den neste ladeøkta di er på huset."
          />
        )}
      </section>

      <BackLink to="/">Tilbake til Kvil</BackLink>
    </Screen>
  )
}
