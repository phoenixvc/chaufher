# ADR-014: Payment Gateway – PayFast vs Alternatives

**Status:** Proposed
**Date:** 2025-12-12
**Owner:** Jurie
**Reviewer:** Eben
**Decision Makers:** Engineering, Finance, Leadership
**Technical Story:** Payment processing platform for ride payments in South Africa

---

## Context

ChaufHER requires a payment gateway for:
- Rider payments (card, EFT, mobile wallets)
- Driver payouts (bank transfers)
- Subscription/membership fees (future)
- Refund processing
- Payment dispute handling
- Receipt generation

The platform must:
- Support South African payment methods (cards, EFT, SnapScan, Zapper)
- Handle ZAR currency
- Provide PCI DSS compliance
- Integrate with .NET backend
- Support recurring payments (future: subscriptions)
- Offer reasonable transaction fees

---

## Decision Drivers

1. **South Africa Support** – Local payment methods, ZAR currency
2. **Transaction Fees** – Cost per transaction
3. **Integration Ease** – .NET SDK, API quality
4. **Payout Support** – Driver bank transfers
5. **Security** – PCI DSS compliance, fraud protection
6. **Reliability** – Uptime, transaction success rate
7. **Mobile Wallets** – SnapScan, Zapper, Apple Pay
8. **Developer Experience** – Documentation, sandbox
9. **Settlement Speed** – Time to receive funds
10. **Support** – Local support availability

---

## Options Considered

### Option A: PayFast

South Africa's leading payment gateway.

**Pros:**
- Market leader in South Africa
- Supports cards, EFT, SnapScan, Zapper, Mobicred
- ZAR native, no currency conversion
- PCI DSS Level 1 compliant
- Instant EFT via Ozow integration
- Split payments for marketplace (driver payouts)
- Good documentation
- Local support
- Competitive fees (3.5% + R2.00)

**Cons:**
- South Africa only (no expansion)
- .NET SDK less mature than Stripe
- Webhook reliability can vary
- Dashboard UX dated
- Limited subscription features

### Option B: Stripe

Global payment platform with South Africa support.

**Pros:**
- Excellent developer experience
- World-class .NET SDK
- Stripe Connect for marketplace payouts
- Advanced fraud protection (Radar)
- Comprehensive API
- Beautiful dashboard
- Global expansion ready
- Subscription billing built-in

**Cons:**
- Higher fees in South Africa (2.9% + R5.00)
- Limited local payment methods (no EFT, SnapScan)
- Settlement in USD (currency conversion)
- Less local support
- Payout delays (7-14 days)

### Option C: Paystack

African-focused payment provider (acquired by Stripe).

**Pros:**
- Built for Africa
- Good developer experience
- Stripe-backed infrastructure
- Supports multiple African countries
- Card and bank transfer support
- Reasonable fees (2.9% + R1.50)
- Modern API

**Cons:**
- Stronger in Nigeria than South Africa
- Limited SA payment methods
- No SnapScan/Zapper
- Smaller SA merchant network
- Support timezone challenges

### Option D: Peach Payments

South African payment aggregator.

**Pros:**
- Multiple payment methods
- Local presence
- Card, EFT, mobile wallets
- PCI DSS compliant
- Bank integrations

**Cons:**
- Less developer-friendly
- Older API design
- Higher integration effort
- Less documentation
- Variable fees

### Option E: Yoco

South African fintech (primarily POS, expanding online).

**Pros:**
- Growing SA brand
- Modern approach
- Mobile-first
- Good for small business
- Competitive fees

**Cons:**
- Online payments less mature
- Limited marketplace features
- No split payments
- API still evolving
- Better for in-person

---

## Weighted Evaluation Matrix

| Criterion | Weight | PayFast | Stripe | Paystack | Peach | Yoco |
|-----------|--------|---------|--------|----------|-------|------|
| **South Africa Support** | 20% | 5 | 3 | 3 | 4 | 5 |
| **Transaction Fees** | 15% | 4 | 3 | 4 | 3 | 4 |
| **Integration Ease** | 12% | 4 | 5 | 5 | 3 | 3 |
| **Payout Support** | 12% | 5 | 5 | 4 | 3 | 2 |
| **Security** | 10% | 5 | 5 | 5 | 4 | 4 |
| **Reliability** | 10% | 4 | 5 | 4 | 4 | 3 |
| **Mobile Wallets** | 8% | 5 | 2 | 2 | 4 | 3 |
| **Developer Experience** | 5% | 3 | 5 | 5 | 3 | 3 |
| **Settlement Speed** | 5% | 4 | 3 | 4 | 4 | 4 |
| **Support** | 3% | 5 | 3 | 3 | 4 | 5 |

### Weighted Scores

| Option | Calculation | **Total Score** |
|--------|-------------|-----------------|
| **PayFast** | (5×.20)+(4×.15)+(4×.12)+(5×.12)+(5×.10)+(4×.10)+(5×.08)+(3×.05)+(4×.05)+(5×.03) | **4.48** |
| **Stripe** | (3×.20)+(3×.15)+(5×.12)+(5×.12)+(5×.10)+(5×.10)+(2×.08)+(5×.05)+(3×.05)+(3×.03) | **3.95** |
| **Paystack** | (3×.20)+(4×.15)+(5×.12)+(4×.12)+(5×.10)+(4×.10)+(2×.08)+(5×.05)+(4×.05)+(3×.03) | **3.87** |
| **Peach** | (4×.20)+(3×.15)+(3×.12)+(3×.12)+(4×.10)+(4×.10)+(4×.08)+(3×.05)+(4×.05)+(4×.03) | **3.59** |
| **Yoco** | (5×.20)+(4×.15)+(3×.12)+(2×.12)+(4×.10)+(3×.10)+(3×.08)+(3×.05)+(4×.05)+(5×.03) | **3.55** |

### Score Summary

| Rank | Option | Score |
|------|--------|-------|
| 1 | **PayFast** | 4.48 |
| 2 | Stripe | 3.95 |
| 3 | Paystack | 3.87 |
| 4 | Peach Payments | 3.59 |
| 5 | Yoco | 3.55 |

---

## Analysis

### Why PayFast Wins for ChaufHER

1. **South African Market Leader**: PayFast dominates the SA e-commerce market:
   - Trusted by major SA brands
   - Riders familiar with PayFast checkout
   - Extensive local payment method support

2. **Local Payment Methods**: Critical for SA market:
   - Instant EFT (via Ozow) – many SA users prefer EFT
   - SnapScan – popular mobile wallet
   - Zapper – QR code payments
   - Mobicred – buy now, pay later

3. **Split Payments**: Essential for marketplace model:
   ```
   Rider pays R100
   ├── ChaufHER commission: R15 (15%)
   └── Driver payout: R85
   ```
   PayFast handles split automatically.

4. **ZAR Native**: No currency conversion:
   - Prices in Rands
   - Settlements in Rands
   - No FX fees

5. **Reasonable Fees**: 3.5% + R2.00 per transaction:
   - On R100 ride: R5.50 total fees
   - Competitive for SA market

### Stripe Consideration

Stripe scored well (3.90) and is excellent for:
- Teams with Stripe experience
- Plans to expand beyond South Africa
- Need for advanced subscription billing

For SA-focused MVP, PayFast's local payment support is decisive.

### When to Reconsider

Consider Stripe if:
- Expanding to international markets
- Need advanced subscription management
- Stripe adds SA local payment methods
- Developer experience becomes critical bottleneck

---

## Decision

**Selected: PayFast** for payment processing

### Integration Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   PWA App   │────▶│  .NET API   │────▶│   PayFast   │
│  (Checkout) │     │ (Backend)   │     │   Gateway   │
└─────────────┘     └──────┬──────┘     └──────┬──────┘
                          │                    │
                          ▼                    ▼
                   ┌─────────────┐     ┌─────────────┐
                   │  Database   │     │  Webhooks   │
                   │ (Payments)  │     │ (Callbacks) │
                   └─────────────┘     └─────────────┘
```

### Payment Flow

```
1. Rider requests ride → API creates payment intent
2. API returns PayFast checkout URL
3. PWA redirects to PayFast hosted page
4. Rider completes payment (card/EFT/wallet)
5. PayFast sends webhook to API
6. API updates payment status
7. Ride confirmed, driver notified
```

### Configuration

```csharp
// appsettings.json
{
  "PayFast": {
    "MerchantId": "xxx",
    "MerchantKey": "xxx",
    "Passphrase": "xxx",
    "UseSandbox": true,
    "NotifyUrl": "https://api.chaufher.co.za/webhooks/payfast",
    "ReturnUrl": "https://app.chaufher.co.za/payment/success",
    "CancelUrl": "https://app.chaufher.co.za/payment/cancel"
  }
}
```

### Fee Structure

| Payment Method | Fee | Example (R100 ride) |
|----------------|-----|---------------------|
| Credit Card | 3.5% + R2.00 | R5.50 |
| Instant EFT | 2.0% + R2.00 | R4.00 |
| SnapScan | 2.5% + R0.50 | R3.00 |
| Zapper | 2.5% + R0.50 | R3.00 |

### Security

- PCI DSS Level 1 compliant (no card data touches our servers)
- 3D Secure for card payments
- Webhook signature verification
- IP whitelisting for callbacks

---

## Consequences

### Positive

- Supports all major SA payment methods
- Riders trust PayFast brand
- Split payments simplify driver payouts
- ZAR native eliminates FX complexity
- Local support in SA timezone

### Negative

- South Africa only (limits expansion)
- .NET SDK less polished than Stripe
- Dashboard UX could be better
- Webhook reliability requires retry logic

### Neutral

- Team learns PayFast integration
- Can add Stripe later for international
- Fee structure is market-standard

---

## Related Documents

- [ADR-008: Cloud Provider (Azure)](008-cloud-provider-azure.md)
- [ADR-009: Backend Framework (.NET 9)](009-backend-framework-dotnet.md)
- [ADR-007: Authentication (Azure AD B2C)](007-authentication-azure-ad-b2c.md)

---

## References

- [PayFast Developer Documentation](https://developers.payfast.co.za/)
- [PayFast Split Payments](https://developers.payfast.co.za/docs#split-payments)
- [PayFast .NET Integration](https://developers.payfast.co.za/docs#step-1-create-payment-form)
- [PayFast Pricing](https://www.payfast.co.za/pricing/)
