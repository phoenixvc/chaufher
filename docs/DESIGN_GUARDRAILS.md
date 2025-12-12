# ChaufHER Design Guardrails

## Purpose & Scope

These guardrails define the non-negotiable UX principles for ChaufHER. They apply to all rider, driver, and admin interfaces for the MVP and subsequent phases. Any new flow, screen, or feature must be reviewed against these principles before sign-off.

---

## 1. Safety and Trust Are Explicit

**Safety is the product. It must be visible and concrete, not implied.**

* Show vetting and safety signals in core flows: female driver indicator, verified documents, insurance, operating licence.
* Make minors' rules and consents explicit in registration and booking; do not hide them in T&Cs.
* Keep panic/safety tools (panic button, live-location options, SAFER links) easy to find on relevant trip screens.

---

## 2. Status Clarity Over Visual Polish

**Users must always know "what is happening now" and "what happens next".**

* Define and display clear trip states: awaiting driver, driver accepted, en route, arrived, trip started, trip ended, no driver found / at risk.
* Use plain, unambiguous English for status and next steps.
* Prioritise readability and hierarchy over animations, gradients, or novel visual treatments.

---

## 3. Predictability Beats Configurability

**Simple, predictable rules beat many options.**

* Keep pricing, cancellation, and payout rules short, consistent, and always visible near the relevant actions.
* Minimise settings and advanced preferences; use strong defaults.
* Only introduce choices where they materially improve safety, reliability, or compliance.

---

## 4. Human Fallback Is Always Obvious

**No user should feel trapped in automation, especially when a child or late-night trip is involved.**

* Provide clear paths to human help (WhatsApp, call, email) in all critical states: booking issues, active trip issues, disputes/refunds.
* Separate "panic/emergency" from "contact support" and clearly explain what each does.
* Ensure error states always indicate how to escalate, not just "try again".

---

## 5. Designed for Repetition

**ChaufHER is used for recurring patterns: school runs, shifts, airports. Flows must minimise rework.**

* Make re-booking from recent trips one of the primary paths.
* Support saving and quickly selecting frequent locations (home, work, school, airport).
* When full recurrence/templates are introduced, they must feel like a natural extension of existing booking patterns.

---

## Application to MVP

For MVP scope and trade-offs:

* Favour clear states and notifications over live map tracking and in-app chat.
* Accept some manual admin processes, but never at the cost of status clarity or visible safety for the rider.
* Keep flows narrow: one way to do a thing, with strong defaults and minimal configuration.
* Prioritise simple helpers (favourites, re-book) over large, complex feature sets.

---

## Application to Future Phases

For Phase 2+ (recurring bookings, coordinator portals, live tracking, multilingual, etc.):

* New features must reinforce these guardrails, not dilute them.
* Organisational tools (schools, corporates) and driver tools (stats, instant payouts) should reduce friction and ambiguity, not add complexity.
* Any market or audience expansion must retain visible safety and clear status for women and minors.

---

## Review & Governance

* Product, design, and engineering use these guardrails as a checklist in design and release reviews.
* Any proposed exception must be written down and explicitly approved; "quick hacks" should not silently bypass guardrails.
* Guardrails can evolve based on real user feedback, but only through deliberate revision, not incremental erosion.

---

## Quick Reference Checklist

Use this checklist during design and code reviews:

- [ ] **Safety Visible**: Are vetting/safety signals shown in this flow?
- [ ] **Status Clear**: Does the user know current state and next steps?
- [ ] **Predictable**: Are rules simple and visible, not hidden in settings?
- [ ] **Human Fallback**: Can the user reach a human easily from here?
- [ ] **Repetition-Friendly**: Does this support re-booking and saved locations?
- [ ] **No Silent Bypasses**: Has any guardrail exception been documented and approved?
