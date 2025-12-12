# ADR-024: Security Architecture – Defense in Depth

**Status:** Accepted
**Date:** 2025-12-12
**Owner:** Jurie
**Reviewer:** Eben
**Decision Makers:** Engineering, Security, Legal
**Technical Story:** Comprehensive security architecture for a women's safety-focused platform

---

## Context

ChaufHER is a women-focused ride-hailing platform where security is not just a technical requirement but a core product differentiator. The platform handles:

- Personal identification data (names, phone numbers, photos)
- Location data (real-time GPS, ride history)
- Financial data (payment methods, transaction history)
- Sensitive documents (driver licenses, ID documents, background checks)
- Safety-critical features (panic button, ride sharing, emergency contacts)

The platform must:
- Comply with POPIA (Protection of Personal Information Act) in South Africa
- Protect against common attack vectors (OWASP Top 10)
- Ensure data confidentiality, integrity, and availability
- Provide audit trails for compliance and incident investigation
- Enable secure operation without impeding user experience
- Support the trust model central to the ChaufHER brand

---

## Decision Drivers

1. **Data Protection** – Encryption, access control
2. **POPIA Compliance** – South African privacy law
3. **Attack Prevention** – OWASP Top 10 mitigation
4. **Identity Security** – Authentication, authorization
5. **Audit Trail** – Logging, non-repudiation
6. **Secrets Management** – Credentials, API keys
7. **Incident Response** – Detection, response capability
8. **User Trust** – Transparent security measures
9. **Developer Experience** – Security without friction
10. **Cost** – Security investment vs. risk

---

## Security Principles

| Principle | Description |
|-----------|-------------|
| **Defense in Depth** | Multiple security layers; no single point of failure |
| **Least Privilege** | Minimum access required for each component |
| **Zero Trust** | Verify explicitly, assume breach, limit blast radius |
| **Secure by Default** | Security on by default, opt-out requires justification |
| **Fail Secure** | System fails to a secure state |
| **Transparency** | Users understand how their data is protected |

---

## Security Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        SECURITY LAYERS                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │ LAYER 1: PERIMETER                                                      │ │
│  │ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │ │
│  │ │  Azure   │ │   WAF    │ │   DDoS   │ │   Geo    │ │   Rate   │      │ │
│  │ │Front Door│ │ (OWASP)  │ │Protection│ │ Blocking │ │ Limiting │      │ │
│  │ └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘      │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │ LAYER 2: IDENTITY                                                       │ │
│  │ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │ │
│  │ │Azure AD  │ │   MFA    │ │   JWT    │ │   RBAC   │ │ Session  │      │ │
│  │ │   B2C    │ │  (OTP)   │ │  Tokens  │ │  Claims  │ │  Mgmt    │      │ │
│  │ └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘      │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │ LAYER 3: APPLICATION                                                    │ │
│  │ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │ │
│  │ │  Input   │ │  Output  │ │  CSRF    │ │  CORS    │ │ Security │      │ │
│  │ │Validation│ │ Encoding │ │Protection│ │  Policy  │ │ Headers  │      │ │
│  │ └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘      │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │ LAYER 4: DATA                                                           │ │
│  │ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │ │
│  │ │Encryption│ │Encryption│ │  Field   │ │   Data   │ │  Backup  │      │ │
│  │ │ At Rest  │ │In Transit│ │ Masking  │ │ Classes  │ │Encryption│      │ │
│  │ └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘      │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │ LAYER 5: INFRASTRUCTURE                                                 │ │
│  │ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │ │
│  │ │  VNet    │ │ Private  │ │  NSG     │ │ Managed  │ │  Key     │      │ │
│  │ │Isolation │ │Endpoints │ │  Rules   │ │ Identity │ │  Vault   │      │ │
│  │ └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘      │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │ LAYER 6: MONITORING                                                     │ │
│  │ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │ │
│  │ │  Azure   │ │ Security │ │  Audit   │ │  Threat  │ │ Incident │      │ │
│  │ │ Monitor  │ │  Center  │ │  Logs    │ │Detection │ │ Response │      │ │
│  │ └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘      │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Decision

**Selected: Defense in Depth** security architecture using Azure-native services

### Layer 1: Perimeter Security

#### Web Application Firewall (WAF)

| Rule Set | Protection |
|----------|------------|
| OWASP 3.2 | SQL injection, XSS, command injection |
| Bot Manager | Credential stuffing, scraping |
| Custom Rules | App-specific protections |

#### Rate Limiting

| Endpoint | Limit | Window | Rationale |
|----------|-------|--------|-----------|
| `/api/auth/login` | 5 | 1 min | Brute force prevention |
| `/api/auth/otp/request` | 3 | 5 min | OTP bombing prevention |
| `/api/rides/estimate` | 30 | 1 min | Abuse prevention |
| `/api/*` | 1000 | 1 min | General protection |

#### Geographic Restrictions

```json
{
  "allowedCountries": ["ZA"],
  "allowedExceptions": [
    "admin-whitelisted-ips"
  ]
}
```

### Layer 2: Identity & Access

#### Authentication Flow

```
┌────────┐     ┌─────────┐     ┌──────────┐     ┌─────────┐
│  User  │     │   API   │     │ Azure AD │     │   SMS   │
│  PWA   │     │         │     │   B2C    │     │ Gateway │
└───┬────┘     └────┬────┘     └────┬─────┘     └────┬────┘
    │               │               │                │
    │ 1. Login      │               │                │
    │    (phone)    │               │                │
    │──────────────▶│               │                │
    │               │ 2. Initiate   │                │
    │               │──────────────▶│                │
    │               │               │ 3. Send OTP    │
    │               │               │───────────────▶│
    │               │               │                │──┐
    │               │               │                │  │ SMS
    │◀──────────────────────────────────────────────────┘
    │ 4. Enter OTP  │               │                │
    │──────────────▶│──────────────▶│                │
    │               │               │                │
    │               │ 5. Validate   │                │
    │               │◀──────────────│                │
    │               │               │                │
    │ 6. JWT tokens │               │                │
    │◀──────────────│               │                │
```

#### Token Strategy

| Token | Lifetime | Storage | Refresh |
|-------|----------|---------|---------|
| **Access Token** | 15 min | Memory | Via refresh token |
| **Refresh Token** | 7 days | Secure cookie | Rotate on use |
| **Session** | 24 hours | Redis | Extend on activity |

#### Role-Based Access Control

| Role | Permissions |
|------|-------------|
| **Rider** | Book rides, view history, manage profile |
| **Driver** | Accept rides, view earnings, manage documents |
| **Support** | View users, view rides, handle disputes |
| **Admin** | Full system access, user management |
| **Super Admin** | System configuration, audit access |

### Layer 3: Application Security

#### Input Validation

```csharp
// FluentValidation example
public class CreateRideRequestValidator : AbstractValidator<CreateRideRequest>
{
    public CreateRideRequestValidator()
    {
        RuleFor(x => x.PickupLatitude)
            .InclusiveBetween(-90, 90)
            .WithMessage("Invalid latitude");

        RuleFor(x => x.PickupLongitude)
            .InclusiveBetween(-180, 180)
            .WithMessage("Invalid longitude");

        RuleFor(x => x.PickupAddress)
            .NotEmpty()
            .MaximumLength(500)
            .Must(NotContainScriptTags)
            .WithMessage("Invalid address");
    }
}
```

#### Security Headers

```csharp
// Middleware configuration
app.UseSecurityHeaders(options =>
{
    options.AddContentSecurityPolicy(builder =>
    {
        builder.AddDefaultSrc().Self();
        builder.AddScriptSrc().Self().UnsafeInline(); // For PWA
        builder.AddStyleSrc().Self().UnsafeInline();
        builder.AddImgSrc().Self().Data().From("https://*.googleapis.com");
        builder.AddConnectSrc().Self().From("https://*.signalr.net");
    });

    options.AddStrictTransportSecurity(maxAge: 31536000, includeSubDomains: true);
    options.AddXContentTypeOptionsNoSniff();
    options.AddXFrameOptionsDeny();
    options.AddReferrerPolicyStrictOriginWhenCrossOrigin();
    options.RemoveServerHeader();
});
```

#### CORS Policy

```csharp
services.AddCors(options =>
{
    options.AddPolicy("Production", builder =>
    {
        builder
            .WithOrigins(
                "https://app.chaufher.co.za",
                "https://admin.chaufher.co.za"
            )
            .AllowCredentials()
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});
```

### Layer 4: Data Security

#### Encryption Standards

| Data State | Algorithm | Key Management |
|------------|-----------|----------------|
| **At Rest (DB)** | AES-256 | Azure-managed |
| **At Rest (Blob)** | AES-256 | Customer-managed |
| **In Transit** | TLS 1.3 | Managed certificates |
| **Backup** | AES-256 | Separate key |

#### Data Classification

| Class | Examples | Controls |
|-------|----------|----------|
| **Public** | App version, terms | None |
| **Internal** | Ride statistics | Auth required |
| **Confidential** | User profiles, ride history | Auth + role |
| **Restricted** | ID documents, background checks | Auth + role + audit |
| **Secret** | Payment tokens, API keys | Key Vault only |

#### Field-Level Security

```csharp
// Sensitive data handling
public class User
{
    public Guid Id { get; set; }

    [PersonalData]
    public string FirstName { get; set; }

    [PersonalData]
    [SensitiveData(MaskType = MaskType.Phone)]
    public string PhoneNumber { get; set; }

    [PersonalData]
    [SensitiveData(MaskType = MaskType.IDNumber)]
    public string IdNumber { get; set; }
}

// Masked logging
_logger.LogInformation("User {UserId} phone: {Phone}",
    user.Id,
    user.PhoneNumber.Mask()); // Outputs: +27***456
```

### Layer 5: Infrastructure Security

#### Network Isolation

```
┌─────────────────────────────────────────────────────────────────┐
│                    Virtual Network (10.0.0.0/16)                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Subnet: snet-aca (10.0.1.0/24)                           │   │
│  │ ┌────────────┐ ┌────────────┐ ┌────────────┐            │   │
│  │ │ Rides API  │ │ Users API  │ │ Payments   │            │   │
│  │ └────────────┘ └────────────┘ └────────────┘            │   │
│  │ NSG: Allow 443 from Front Door, Deny all else           │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Subnet: snet-data (10.0.2.0/24)                          │   │
│  │ ┌────────────┐ ┌────────────┐                           │   │
│  │ │ PostgreSQL │ │   Redis    │ (Private Endpoints)       │   │
│  │ └────────────┘ └────────────┘                           │   │
│  │ NSG: Allow from snet-aca only                           │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

#### Managed Identity

```csharp
// No connection strings in code
var credential = new DefaultAzureCredential();

// Key Vault access
var secretClient = new SecretClient(
    new Uri("https://kv-chaufher-prod.vault.azure.net"),
    credential
);

// Blob Storage access
var blobClient = new BlobServiceClient(
    new Uri("https://stchaufherprod.blob.core.windows.net"),
    credential
);

// PostgreSQL access (via AAD token)
var connection = new NpgsqlConnection(connectionString);
var token = await credential.GetTokenAsync(
    new TokenRequestContext(new[] { "https://ossrdbms-aad.database.windows.net/.default" })
);
connection.AccessToken = token.Token;
```

### Layer 6: Monitoring & Incident Response

#### Security Monitoring

| Event | Detection | Alert |
|-------|-----------|-------|
| Failed logins (>5) | App Insights | Slack |
| WAF block events | Front Door logs | Slack |
| Privilege escalation | Audit logs | Email + SMS |
| Data access anomaly | Azure Sentinel | Email + SMS |
| Secret access | Key Vault logs | Slack |

#### Audit Logging

```csharp
public class AuditService : IAuditService
{
    public async Task LogAsync(AuditEvent auditEvent)
    {
        var entry = new AuditEntry
        {
            Timestamp = DateTimeOffset.UtcNow,
            UserId = auditEvent.UserId,
            Action = auditEvent.Action,
            Resource = auditEvent.Resource,
            ResourceId = auditEvent.ResourceId,
            IpAddress = auditEvent.IpAddress,
            UserAgent = auditEvent.UserAgent,
            Outcome = auditEvent.Outcome,
            Details = auditEvent.Details
        };

        // Immutable audit log
        await _auditRepository.InsertAsync(entry);

        // Real-time alerting for sensitive actions
        if (auditEvent.IsSensitive)
        {
            await _alertService.SendAsync(entry);
        }
    }
}
```

#### Incident Response Plan

| Severity | Response Time | Actions |
|----------|---------------|---------|
| **Critical** | 15 min | Page on-call, war room, executive notification |
| **High** | 1 hour | Alert on-call, begin investigation |
| **Medium** | 4 hours | Ticket created, next business day |
| **Low** | 24 hours | Logged for review |

---

## POPIA Compliance

### Data Subject Rights Implementation

| Right | Implementation |
|-------|----------------|
| **Access** | GET `/api/users/me/data-export` |
| **Rectification** | PUT `/api/users/me` |
| **Erasure** | DELETE `/api/users/me` (soft delete + anonymization) |
| **Portability** | GET `/api/users/me/data-export?format=json` |
| **Object** | PUT `/api/users/me/preferences` |

### Data Retention

| Data Type | Retention | After Retention |
|-----------|-----------|-----------------|
| **Active user data** | While active | Anonymize after 2 years inactive |
| **Ride history** | 7 years | Archive then delete |
| **Payment records** | 7 years | Archive then delete |
| **Audit logs** | 7 years | Archive then delete |
| **Driver documents** | Employment + 5 years | Secure delete |

### Privacy by Design

```csharp
// Data minimization
public class RideHistoryDto
{
    public Guid RideId { get; set; }
    public DateTime Date { get; set; }

    // Only show first name, not full profile
    public string DriverFirstName { get; set; }

    // Generalized location (suburb, not exact address)
    public string PickupArea { get; set; }
    public string DropoffArea { get; set; }

    public decimal Fare { get; set; }
}
```

---

## Secrets Management

### Azure Key Vault Structure

```
kv-chaufher-{env}/
├── secrets/
│   ├── payfast-merchant-id
│   ├── payfast-merchant-key
│   ├── sendgrid-api-key
│   ├── africastalking-api-key
│   ├── google-maps-api-key
│   ├── sentry-dsn
│   └── jwt-signing-key
├── keys/
│   ├── data-encryption-key
│   └── backup-encryption-key
└── certificates/
    └── api-chaufher-co-za
```

### Secret Rotation

| Secret | Rotation Period | Method |
|--------|-----------------|--------|
| **API Keys** | 90 days | Manual + alert |
| **JWT Signing Key** | 30 days | Automatic |
| **Database Password** | 90 days | Automatic (AAD preferred) |
| **Encryption Keys** | 1 year | Key Vault rotation |

---

## Security Testing

### Automated Security Checks

| Check | Tool | Frequency |
|-------|------|-----------|
| **SAST** | SonarQube | Every PR |
| **Dependency Scan** | Dependabot | Daily |
| **Container Scan** | Trivy | Every build |
| **Secret Scan** | GitLeaks | Every commit |
| **DAST** | OWASP ZAP | Weekly |

### Penetration Testing

| Type | Frequency | Scope |
|------|-----------|-------|
| **Automated** | Monthly | Full application |
| **Manual** | Annually | Full platform |
| **Bug Bounty** | Continuous | Public endpoints |

---

## Consequences

### Positive

- Comprehensive protection across all layers
- POPIA compliance built-in
- Audit trail for all sensitive operations
- No secrets in code or configuration
- Defense in depth reduces single points of failure

### Negative

- Increased complexity in development
- Some performance overhead (encryption, validation)
- Key Vault adds latency to secret access
- Security monitoring costs

### Neutral

- Team requires security training
- Regular security reviews needed
- Incident response procedures must be tested

---

## Related Documents

- [ADR-007: Authentication (Azure AD B2C)](007-authentication-azure-ad-b2c.md)
- [ADR-023: Networking & API Gateway](023-networking-api-gateway.md)
- [ADR-013: Monitoring & Observability](013-monitoring-observability.md)
- [ADR-019: File Storage (Azure Blob)](019-file-storage.md)

---

## References

- [POPIA Act](https://popia.co.za/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Azure Security Best Practices](https://docs.microsoft.com/azure/security/fundamentals/best-practices-and-patterns)
- [Azure Key Vault](https://docs.microsoft.com/azure/key-vault/)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)
