import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import { OPS_KPIS } from '../lib/ops'
import type { KvilpassetEconomics } from '../lib/types'
import {
  Screen,
  PageHeader,
  PlainCard,
  AICard,
  PrimaryButton,
  ProgressBar,
} from '../components/ui'

const nok = (n: number) =>
  new Intl.NumberFormat('nb-NO', { maximumFractionDigits: 0 }).format(n)

/**
 * The Ops data panel (Epic 4.4): Kvil Premium uptake, premium-segment spend
 * lift, and Kvil i bil conversion — derived from loyalty_members,
 * store_transactions and charging_sessions via the economics endpoint plus the
 * headline Ops KPIs.
 */
export function DataPanelScreen() {
  const [econ, setEcon] = useState<KvilpassetEconomics | null>(null)
  const [source, setSource] = useState<'live' | 'fixture'>('fixture')

  useEffect(() => {
    api.getKvilpassetEconomics().then((r) => {
      setEcon(r.data)
      setSource(r.source)
    })
  }, [])

  if (!econ)
    return <div className="p-5 text-[var(--kvil-text-soft)]">Lastar…</div>

  // Normalise the two dwell numbers onto the 0–100 ProgressBar scale.
  const maxDwell = Math.max(
    OPS_KPIS.avgDwellMinChosen,
    OPS_KPIS.avgDwellMinForced,
    1,
  )

  return (
    <Screen>
      <PageHeader
        eyebrow="Drift · Forretningsmodell"
        title="Kvifor Kvil tener meir"
        sub="Frå loyalty_members, store_transactions og charging_sessions"
      />

      {/* Spend-lift hero */}
      <AICard glow>
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--kvil-text-soft)]">
          Premium meirforbruk
        </p>
        <p className="font-display text-5xl font-semibold text-[#2b2626]">
          +{econ.spendLiftPct}%
        </p>
        <p className="mt-1 text-sm text-[var(--kvil-text-soft)]">
          {nok(econ.premiumAvgSpendNok)} vs {nok(econ.baseAvgSpendNok)} NOK / år
          per medlem
        </p>
      </AICard>

      {/* Dwell comparison: chosen Kvil stop vs forced short stop */}
      <PlainCard>
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--kvil-text-soft)]">
          Opphaldstid · valt Kvilstopp dveler lenger
        </p>
        <div className="mt-3 flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-[#241e1a]">Valt Kvilstopp</span>
              <span className="font-display text-lg font-semibold text-[#2b2626]">
                {OPS_KPIS.avgDwellMinChosen} min
              </span>
            </div>
            <ProgressBar
              value={(OPS_KPIS.avgDwellMinChosen / maxDwell) * 100}
            />
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-[#241e1a]">Tvinga kortstopp</span>
              <span className="font-display text-lg font-semibold text-[var(--kvil-text-soft)]">
                {OPS_KPIS.avgDwellMinForced} min
              </span>
            </div>
            <ProgressBar
              value={(OPS_KPIS.avgDwellMinForced / maxDwell) * 100}
            />
          </div>
        </div>
      </PlainCard>

      {/* Stat tiles */}
      <div className="grid grid-cols-2 gap-3">
        <Stat
          label="Kvil Premium-opptak"
          value={`${OPS_KPIS.extraPremiumUptakePct}%`}
          note={`+${OPS_KPIS.premiumUptakeDeltaPct}% vs forrige kvartal`}
        />
        <Stat
          label="Kvil i bil-konvertering"
          value={`${OPS_KPIS.kvilIBilConversionPct}%`}
          note="plugg-inn til ordre"
        />
        <Stat
          label="Vask-abonnement"
          value={`${econ.carwashSubscriptionSharePct}%`}
          note="andel av premium"
        />
        <Stat
          label="Premium-segment"
          value={nok(econ.premiumSegmentSize)}
          note="aktive medlemmer"
        />
      </div>

      {/* Modelled annual Kvilpasset revenue */}
      <PlainCard>
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--kvil-text-soft)]">
          Modellert Kvilpasset-inntekt / år
        </p>
        <p className="font-display text-3xl font-semibold text-[#2b2626]">
          {nok(econ.modelledAnnualRevenueNok.expected)} NOK
        </p>
        <div className="mt-3 flex justify-between text-sm">
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-[0.18em] text-[var(--kvil-text-soft)]">
              Låg
            </span>
            <span className="font-display font-semibold text-[#2b2626]">
              {nok(econ.modelledAnnualRevenueNok.low)}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-[0.18em] text-[var(--kvil-text-soft)]">
              Venta
            </span>
            <span className="font-display font-semibold text-[#2b2626]">
              {nok(econ.modelledAnnualRevenueNok.expected)}
            </span>
          </div>
          <div className="flex flex-col text-right">
            <span className="text-xs uppercase tracking-[0.18em] text-[var(--kvil-text-soft)]">
              Høg
            </span>
            <span className="font-display font-semibold text-[#2b2626]">
              {nok(econ.modelledAnnualRevenueNok.high)}
            </span>
          </div>
        </div>
        <p className="mt-2 text-xs text-[var(--kvil-text-soft)]">
          ved {nok(econ.assumedMonthlyPriceNok)} NOK/mnd
        </p>
      </PlainCard>

      <PrimaryButton to="/ops">Administrer Kvilstader</PrimaryButton>

      <p className="text-center text-[10px] text-[var(--kvil-text-soft)]">
        kjelde: {source === 'live' ? 'direkte' : 'reservedata'}
      </p>
    </Screen>
  )
}

function Stat({
  label,
  value,
  note,
}: {
  label: string
  value: string
  note?: string
}) {
  return (
    <PlainCard>
      <p className="text-xs uppercase tracking-[0.2em] text-[var(--kvil-text-soft)]">
        {label}
      </p>
      <p className="font-display text-2xl font-semibold text-[#2b2626]">
        {value}
      </p>
      {note && (
        <p className="mt-0.5 text-xs text-[var(--kvil-text-soft)]">{note}</p>
      )}
    </PlainCard>
  )
}
