# ADR-007: Authentication Provider – Azure AD B2C

**Status:** Accepted
**Date:** 2025-12-12
**Owner:** Jurie
**Reviewer:** Eben
**Decision Makers:** Engineering, Security
**Technical Story:** User authentication and identity management for ChaufHER platform

---

## Context

ChaufHER requires an authentication system for:
- Rider registration and login
- Driver registration and login (with additional verification)
- Admin authentication
- Social login options (Google, Apple, Facebook)
- Multi-factor authentication (MFA) for sensitive operations
- Session management across devices
- Password reset and account recovery

The solution must:
- Support customer identity (B2C) scenarios
- Scale with user growth
- Provide security best practices (MFA, brute force protection)
- Integrate with .NET backend
- Support mobile and web clients (PWA)
- Meet compliance requirements (GDPR, POPIA)

---

## Decision Drivers

1. **Security** – Industry-standard authentication, MFA, brute force protection
2. **Social Identity** – Google, Apple, Facebook login support
3. **Azure Integration** – Seamless with existing Azure infrastructure
4. **Customization** – Branded login pages, custom user flows
5. **Scalability** – Handle growth from hundreds to millions of users
6. **Cost** – Predictable pricing for startup budget
7. **Developer Experience** – Good SDKs, documentation
8. **Compliance** – GDPR, data residency, audit logs
9. **Self-Service** – Password reset, account management
10. **Token Management** – JWT support, token refresh, revocation

---

## Options Considered

### Option A: Azure Active Directory B2C

Microsoft's cloud identity service designed for customer-facing applications.

**Pros:**
- Purpose-built for B2C (customer identity) scenarios
- Native Azure integration (App Service, Functions, API Management)
- Social identity providers (Google, Apple, Facebook, Microsoft)
- Custom policies (Identity Experience Framework) for complex flows
- Multi-factor authentication built-in
- Self-service password reset
- Branded, customizable UI
- GDPR compliance features
- Scales to millions of users
- First 50,000 MAU free

**Cons:**
- Complex custom policy XML syntax (learning curve)
- Limited customization in user flows (without custom policies)
- UI customization requires HTML/CSS knowledge
- Debugging custom policies challenging
- Some features require Premium P1/P2

### Option B: Auth0 (Okta)

Popular third-party identity platform.

**Pros:**
- Excellent developer experience
- Beautiful default UI, highly customizable
- Easy social login setup
- Actions/Rules for custom logic
- Excellent documentation
- Multi-tenant support
- Universal Login for best security

**Cons:**
- Third-party vendor (not Azure-native)
- Can be expensive at scale ($23/1000 MAU on B2C plans)
- Additional latency (external service)
- Data stored outside Azure (compliance consideration)
- Requires separate management console

### Option C: Firebase Authentication

Google's authentication service for web and mobile.

**Pros:**
- Easy to implement
- Good mobile SDK support
- Social login support
- Anonymous authentication
- Phone number authentication
- Free tier generous

**Cons:**
- Google ecosystem (not Azure-native)
- Limited enterprise features
- Less customization for enterprise flows
- No custom branding in free tier
- Limited audit/compliance features
- Data in Google Cloud

### Option D: Keycloak (Self-Hosted)

Open-source identity and access management.

**Pros:**
- Open source, no licensing costs
- Full control over data
- Extensive customization
- SAML, OIDC, OAuth2 support
- User federation capabilities

**Cons:**
- Requires self-hosting (operational overhead)
- No SLA (self-managed)
- Security responsibility shifts to team
- Scaling requires infrastructure work
- No social login out-of-box (plugins needed)

### Option E: AWS Cognito

Amazon's identity service.

**Pros:**
- Fully managed
- Social identity support
- User pools and identity pools
- Adaptive authentication
- Pay-per-use pricing

**Cons:**
- AWS ecosystem (not Azure-native)
- Complex pricing model
- Lambda triggers for customization (AWS-specific)
- Cross-cloud complexity
- Not optimal for Azure-first architecture

---

## Weighted Evaluation Matrix

| Criterion | Weight | Azure AD B2C | Auth0 | Firebase | Keycloak | Cognito |
|-----------|--------|--------------|-------|----------|----------|---------|
| **Security** | 20% | 5 | 5 | 4 | 4 | 5 |
| **Social Identity** | 12% | 5 | 5 | 5 | 3 | 5 |
| **Azure Integration** | 15% | 5 | 3 | 2 | 3 | 2 |
| **Customization** | 10% | 4 | 5 | 3 | 5 | 3 |
| **Scalability** | 10% | 5 | 5 | 5 | 3 | 5 |
| **Cost** | 10% | 5 | 2 | 4 | 5 | 4 |
| **Developer Experience** | 8% | 3 | 5 | 5 | 3 | 3 |
| **Compliance** | 8% | 5 | 4 | 3 | 4 | 4 |
| **Self-Service** | 4% | 5 | 5 | 4 | 4 | 4 |
| **Token Management** | 3% | 5 | 5 | 4 | 5 | 4 |

### Weighted Scores

| Option | Calculation | **Total Score** |
|--------|-------------|-----------------|
| **Azure AD B2C** | (5×.20)+(5×.12)+(5×.15)+(4×.10)+(5×.10)+(5×.10)+(3×.08)+(5×.08)+(5×.04)+(5×.03) | **4.74** |
| **Auth0** | (5×.20)+(5×.12)+(3×.15)+(5×.10)+(5×.10)+(2×.10)+(5×.08)+(4×.08)+(5×.04)+(5×.03) | **4.32** |
| **Firebase** | (4×.20)+(5×.12)+(2×.15)+(3×.10)+(5×.10)+(4×.10)+(5×.08)+(3×.08)+(4×.04)+(4×.03) | **3.82** |
| **Keycloak** | (4×.20)+(3×.12)+(3×.15)+(5×.10)+(3×.10)+(5×.10)+(3×.08)+(4×.08)+(4×.04)+(5×.03) | **3.78** |
| **Cognito** | (5×.20)+(5×.12)+(2×.15)+(3×.10)+(5×.10)+(4×.10)+(3×.08)+(4×.08)+(4×.04)+(4×.03) | **3.94** |

### Score Summary

| Rank | Option | Score |
|------|--------|-------|
| 1 | **Azure AD B2C** | 4.74 |
| 2 | Auth0 | 4.32 |
| 3 | AWS Cognito | 3.94 |
| 4 | Firebase Auth | 3.82 |
| 5 | Keycloak | 3.78 |

---

## Analysis

### Why Azure AD B2C Wins for ChaufHER

1. **Azure-Native**: Seamless integration with Azure infrastructure:
   - App Service authentication
   - API Management policies
   - Azure Functions triggers
   - Application Insights monitoring

2. **Cost-Effective**: First 50,000 Monthly Active Users (MAU) free, then $0.00325/MAU. For a startup, this is extremely economical.

3. **Purpose-Built for B2C**: Unlike Azure AD (enterprise), B2C is designed for customer identity:
   - Self-service signup
   - Social login
   - Custom attributes
   - User journeys

4. **Security Features**:
   - Conditional access policies
   - MFA (SMS, authenticator app)
   - Risk-based authentication
   - Brute force protection
   - Token replay prevention

5. **Compliance Ready**:
   - GDPR compliant
   - Data residency options
   - Audit logs
   - Consent management

### Implementation Approach

**User Flows (Simple)** for MVP:
- Sign up and sign in
- Password reset
- Profile editing

**Custom Policies (Advanced)** for future:
- Progressive profiling (driver verification)
- Custom MFA flows
- Complex business logic

### When to Reconsider

Consider Auth0 if:
- Complex custom flows needed immediately
- Developer experience is paramount
- Multi-cloud strategy emerges
- Need features not in B2C

---

## Decision

**Selected: Azure Active Directory B2C**

### Configuration

| User Type | Flow | MFA | Social Login |
|-----------|------|-----|--------------|
| Rider | Sign-up/Sign-in | Optional | Google, Apple, Facebook |
| Driver | Sign-up/Sign-in + Verification | Required | Google, Apple |
| Admin | Sign-in only | Required | None (email/password) |

### Custom Attributes

| Attribute | User Type | Purpose |
|-----------|-----------|---------|
| `userType` | All | Role identification |
| `verificationStatus` | Driver | Document verification status |
| `consentTimestamp` | All | GDPR consent tracking |
| `preferredLanguage` | All | Localization |

### Token Configuration

| Setting | Value |
|---------|-------|
| Access token lifetime | 1 hour |
| Refresh token lifetime | 14 days |
| ID token lifetime | 1 hour |
| Single sign-out | Enabled |

### Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   PWA Client    │────▶│  Azure AD B2C    │◀────│  .NET Backend   │
│                 │◀────│   (Identity)     │────▶│  (API)          │
└─────────────────┘     └──────────────────┘     └─────────────────┘
                                │
                                ▼
                        ┌──────────────────┐
                        │ Social Providers │
                        │ Google, Apple,   │
                        │ Facebook         │
                        └──────────────────┘
```

### API Protection

```csharp
// Program.cs
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddMicrosoftIdentityWebApi(builder.Configuration.GetSection("AzureAdB2C"));

// Endpoint protection
app.MapGet("/api/rides", [Authorize] async () => { ... });
```

---

## Consequences

### Positive

- Native Azure integration reduces complexity
- Cost-effective pricing (50K MAU free)
- Enterprise-grade security features
- Social login simplifies user onboarding
- Compliance-ready (GDPR, audit logs)

### Negative

- Custom policy learning curve (XML-based)
- UI customization requires development effort
- Some advanced features need Premium tier
- Debugging complex flows is challenging

### Neutral

- Builds Azure identity expertise
- Can migrate to Auth0 if needed (standard OAuth2/OIDC)
- Custom policies unlock advanced scenarios when needed

---

## Related Documents

- [ADR-008: Cloud Provider Selection](008-cloud-provider-azure.md)
- [ADR-009: Backend Framework Selection](009-backend-framework-dotnet.md)
- [Product Requirements Document](../docs/PRD.md)

---

## References

- [Azure AD B2C Documentation](https://docs.microsoft.com/azure/active-directory-b2c/)
- [Azure AD B2C Pricing](https://azure.microsoft.com/pricing/details/active-directory-b2c/)
- [Custom Policies Overview](https://docs.microsoft.com/azure/active-directory-b2c/custom-policy-overview)
- [MSAL.js Library](https://docs.microsoft.com/azure/active-directory/develop/msal-js-overview)
