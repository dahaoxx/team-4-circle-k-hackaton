# Kvil — ta deg ein kvil

> **Kvil** (Nynorsk: rest, a pause). The Nynorsk form of *hvile* — the language of the fjords and the mountains. It carries the K of Circle K, and it sounds like the road it lives on.
> 

## The bet

Everyone in the EV era is racing to *minimise* the stop — faster chargers, shorter dwell, get them out. Circle K's own 26→15 minute anxiety lives in that frame. **Kvil bets the other way: don't fight for the shrinking 15 minutes — sell a stop people choose, and choose to pay more for.**

Norway is the one country where this is obvious. This is the land of *hytteliv* and *friluftsliv*, where the pause on the Friday drive to the mountains *is* the point. The proof already exists: people detour to a bakery in Lom — a town of 2,400 — because it's the opposite of a chain. Circle K owns the road. Nobody owns the rest.

Kvil is how Circle K becomes the best part of the drive, not the interruption.

## What Kvil is

**Kvil is Circle K's premium destination brand** — a soft collection layered onto the best highway and scenic-route hubs. It is not a new logo stamped on 456 forecourts. It is a *promise*: a quality floor, a design standard, real hosting, and one membership — wrapped around places that each get to be entirely themselves.

The brand does three jobs and three only:

1. **Signals quality.** A Kvil mark means: this is a stop worth taking. Clean, beautiful, well-fed, well-hosted.
2. **Carries the membership.** *Kvilpasset* — the premium tier of Extra V2 — works across every Kvil place.
3. **Speaks one warm line.** *"Ta deg ein kvil."* Take a rest. The tone of the whole thing in four words.

Everything else — the name on the door, the food, the materials, the host — belongs to the place.

## The brand hierarchy

Three tiers, borrowed from how Marriott runs Autograph Collection and how Norway's own **De Historiske** unites independent historic hotels under one quiet quality mark.

- **Tier 1 — Circle K (quiet parent).** Owns the network, charging, ops, loyalty backbone, trust. Rarely on the sign — it's the *drift av Circle K* in the fine print.
- **Tier 2 — Kvil (endorser + membership).** The collection brand and *Kvilpasset*. The filter that says "one of the good ones," the thread that makes a loose set of places feel like one worth joining.
- **Tier 3 — the places (each its own).** Named for where they are, hosted by who belongs there, built from the region:
    - **Bakeriet på Nebbenes** — on Norway's busiest rest stop, a real bakery with a bun worth the E6 detour.
    - **Brygga i Lærdal** — a fjord-side stop that tastes of the fjord: local cider, smoked trout, apples.
    - **Stova på Dombås** — a mountain-cabin room for the Dovre crossing, fireplace and all.
    - **Kaia i Lofoten** — coffee, cod, and the light.

### How it renders

- **Signage:** big — *Brygga i Lærdal*. Beneath, small — *eit Kvil-sted*. Tiny — *drift av Circle K*.
- **App:** route card reads *"Eit Kvil-sted 40 min fram — Brygga i Lærdal."* Kvil is the filter; the place name is the destination.
- **Membership:** *Kvilpasset* spans every place; each visit stamps a passport of places collected.
- **Voice:** *"Ta deg ein kvil"* ties Tier 2 to Tier 3 without flattening anyone.

## The audience

**The Norwegian road-tripper who believes the pause is the point** — the Friday hytte drive, the Dovre crossing, the slow fjord route — and the remote-working EV driver who wants one genuinely good place to land for an hour. Circle K's highest-value, most loyal, most willing-to-pay segment, currently served the same hot dog as everyone else.

We are explicitly *not* designing the cheapest stop. We're designing the one worth paying more for — and the one a charger-only rival (Fastned, Recharge, Ionity) structurally cannot offer.

## Why Kvil makes more money

- **Detour demand = pricing power.** A *place* people drive out of their way for competes on nothing. Kvil is the mark that earns the detour.
- **Premium that's believable.** A higher price under the Kvil quality mark reads as craft, not gouging — the Lom proof.
- **Recurring revenue via Kvilpasset.** A paid membership turns volatile footfall into predictable income and locks the high-value driver to Circle K trip after trip.
- **Dwell becomes an asset.** Longer, chosen stops mean more baskets, more wash, more merch. Kvil *wants* the 45 minutes.
- **An unclonable moat.** A competitor copies a logo overnight. They cannot copy a baker in Lærdal and twenty hosts who each belong to their town — held together by Kvil.
- **Employee-as-host, finally real.** Kvil gives every place a name, a signature, and a host who matters.

## The user journey

1. **Choose the stop.** App surfaces a Kvil place ahead — *"Eit Kvil-sted, 40 min fram. Brygga i Lærdal — local cider, smoked trout, 6 fast bays free."*
2. **Arrive somewhere specific.** Local materials, local food, the host who belongs there. It feels like the fjord, not a logo.
3. **Be hosted, not served.** Kvilpasset recognised at the door; the host knows the regular's order.
4. **Spend the pause well + stamp the passport.** Another Kvil place collected; status grows.
5. **Leave with a story.** Full battery, a bun worth the detour, and the next Kvil-sted already on your list.

## Sub-concept: Kvil Snøgg — rett til bilen

*Snøgg* (Nynorsk: quick, swift). The same Kvil quality, none of the wait — for the driver who can't, or won't, leave the car.

Not everyone wants the 45-minute pause. Sometimes you've got a meeting, kids asleep in the back, or a 15-minute fast-charge and that's it. The mistake would be to send that person to a lesser brand. **Kvil Snøgg keeps them inside the Kvil world** — same baker's bun, same proper coffee — and brings it to them.

1. **Plug in. The window is known.** The app predicts the stop to the minute from the car's battery profile, charger output, state of charge and the live (cold = slower) weather. *"You've got 14 minutes at Brygga i Lærdal."*
2. **One-tap pre-order.** A short, curated Kvil menu — the place's signature plus the member's usual.
3. **Timed to the charge, delivered to the car.** The kitchen fires on a timer so it finishes ~2 minutes before the battery does. A host brings it to the window.
4. **Drive off full, in both senses.** Receipt, Kvilpasset points, one-tap reorder.

In the hierarchy, Snøgg is a *mode* of Kvil, not a separate brand — surfaced as a toggle the moment you plug in: *Kvil* (stay) or *Snøgg* (to the car).

## How it uses the dataset

- **stations** — location, amenities, charger mix → which sites become Kvil places and each region's signature.
- **loyalty_members** — tier, lifetime spend, frequency, **vehicle + battery capacity** → the premium segment, Kvilpasset modelling, and the Snøgg charge-time prediction.
- **store_transactions** — basket categories/value by station → regional taste patterns behind each local signature and the premium menu.
- **charging_sessions** — dwell, kWh, store-entry flag → the spend lift of a *chosen* Kvil stop, and the data to predict the Snøgg 15-minute window.
- **carwash_visits** — subscription behaviour → proven Norwegian appetite for recurring paid services (the Kvilpasset case).
- **weather_observations** — the fireplace-and-bun demand signal; scenic-route timing.
- **employees** — barista/kitchen training → the named-host model.

## Why it wins on the rubric

- **Concept strength** — a true reframe plus a fresh, ownable brand: *Kvil*, Nynorsk-authentic, carrying the K.
- **User journey** — sensory, place-specific, with a collectible membership backbone and trust signals throughout.
- **Technical execution** — demoable as three distinct Kvil places + the Kvilpasset flow + a data-driven member model.
- **Strategic relevance** — hits every named driver: dwell, foodservice premiumisation, loyalty, employee-as-host.
- **Use of data** — the places, signatures, segment and Pass economics are all derived from the dataset.

## The two-hour prototype

A single-file, brand-rich mobile mock:

- **Route surfacing** of a Kvil place ahead — local signature, host, bays free.
- **The plug-in moment**: a *Kvil* (stay) / *Snøgg* (to the car) toggle, with a live charge-time prediction driving the Snøgg window.
- **Snøgg flow**: pre-order → kitchen timer → "delivered to bay 3, ready before your car."
- **Three distinct place pages** (Nebbenes / Lærdal / Dombås) — each its own look, unified only by the small *eit Kvil-sted* mark.
- **Kvilpasset + passport**: join flow, places-collected screen, premium perks.
- A small **data panel**: premium-member spend lift and modelled Kvilpasset revenue across the network.

---

*Kvil — ta deg ein kvil.*