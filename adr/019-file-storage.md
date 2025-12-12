# ADR-019: File & Document Storage – Azure Blob Storage

**Status:** Accepted
**Date:** 2025-12-12
**Owner:** Jurie
**Reviewer:** Eben
**Decision Makers:** Engineering, DevOps
**Technical Story:** File storage for driver documents, profile photos, and receipts

---

## Context

ChaufHER requires file storage for:
- Driver verification documents (license, ID, PDP, vehicle registration)
- Profile photos (riders and drivers)
- Vehicle photos
- Ride receipts (PDF)
- Insurance documents
- Background check certificates
- Marketing assets (future)

The platform must:
- Store files securely with encryption
- Control access per user/role
- Generate secure, time-limited URLs
- Handle file uploads from PWA
- Integrate with Azure ecosystem
- Be cost-effective for storage volume
- Support compliance requirements (document retention)

---

## Decision Drivers

1. **Azure Integration** – Native Azure ecosystem fit
2. **Security** – Encryption, access control
3. **Cost** – Storage and bandwidth pricing
4. **Performance** – Upload/download speed
5. **CDN Support** – Fast delivery globally
6. **Access Control** – Fine-grained permissions
7. **Compliance** – Data residency, retention
8. **Scalability** – Handle growth
9. **Developer Experience** – SDK, API quality
10. **Redundancy** – Data durability

---

## Options Considered

### Option A: Azure Blob Storage

Microsoft's object storage service.

**Pros:**
- Native Azure integration
- South Africa region available
- Hot/Cool/Archive tiers
- Excellent .NET SDK
- Azure CDN integration
- Shared Access Signatures (SAS)
- Managed identity auth
- 99.999999999% durability
- Lifecycle management
- Immutable storage (compliance)

**Cons:**
- Azure-specific (vendor lock-in)
- Pricing can be complex
- Egress costs add up
- Learning curve for SAS tokens

### Option B: Amazon S3

AWS's industry-standard object storage.

**Pros:**
- Industry standard
- Massive ecosystem
- Excellent durability
- Global infrastructure
- Well-documented
- Many tools support S3 API

**Cons:**
- Requires AWS account
- Not Azure-native
- Cape Town region only (not Johannesburg)
- Cross-cloud complexity
- Separate billing

### Option C: Azure Files

Azure's managed file shares.

**Pros:**
- SMB/NFS protocols
- Mountable as network drive
- Azure native
- Easy migration

**Cons:**
- More expensive than Blob
- Designed for file shares, not objects
- Less suitable for web uploads
- Overkill for document storage

### Option D: Cloudinary

Media management platform.

**Pros:**
- Image/video optimization
- Automatic transformations
- CDN included
- Easy integrations

**Cons:**
- Media-focused (not general documents)
- More expensive
- Another vendor
- Not Azure-native
- Overkill for documents

### Option E: MinIO (Self-hosted)

S3-compatible object storage.

**Pros:**
- S3-compatible API
- Self-hosted control
- No vendor lock-in
- Open source

**Cons:**
- Operational overhead
- Infrastructure management
- Security responsibility
- No managed CDN
- Not recommended for startup

---

## Weighted Evaluation Matrix

| Criterion | Weight | Azure Blob | Amazon S3 | Azure Files | Cloudinary | MinIO |
|-----------|--------|------------|-----------|-------------|------------|-------|
| **Azure Integration** | 20% | 5 | 2 | 5 | 2 | 2 |
| **Security** | 15% | 5 | 5 | 5 | 4 | 4 |
| **Cost** | 15% | 4 | 4 | 3 | 3 | 5 |
| **Performance** | 12% | 5 | 5 | 4 | 5 | 4 |
| **CDN Support** | 10% | 5 | 5 | 3 | 5 | 2 |
| **Access Control** | 8% | 5 | 5 | 4 | 3 | 4 |
| **Compliance** | 8% | 5 | 5 | 5 | 3 | 3 |
| **Scalability** | 5% | 5 | 5 | 5 | 5 | 3 |
| **Developer Experience** | 4% | 5 | 5 | 4 | 5 | 3 |
| **Redundancy** | 3% | 5 | 5 | 5 | 5 | 3 |

### Weighted Scores

| Option | Calculation | **Total Score** |
|--------|-------------|-----------------|
| **Azure Blob** | (5×.20)+(5×.15)+(4×.15)+(5×.12)+(5×.10)+(5×.08)+(5×.08)+(5×.05)+(5×.04)+(5×.03) | **4.82** |
| **Amazon S3** | (2×.20)+(5×.15)+(4×.15)+(5×.12)+(5×.10)+(5×.08)+(5×.08)+(5×.05)+(5×.04)+(5×.03) | **4.22** |
| **Azure Files** | (5×.20)+(5×.15)+(3×.15)+(4×.12)+(3×.10)+(4×.08)+(5×.08)+(5×.05)+(4×.04)+(5×.03) | **4.20** |
| **Cloudinary** | (2×.20)+(4×.15)+(3×.15)+(5×.12)+(5×.10)+(3×.08)+(3×.08)+(5×.05)+(5×.04)+(5×.03) | **3.67** |
| **MinIO** | (2×.20)+(4×.15)+(5×.15)+(4×.12)+(2×.10)+(4×.08)+(3×.08)+(3×.05)+(3×.04)+(3×.03) | **3.42** |

### Score Summary

| Rank | Option | Score |
|------|--------|-------|
| 1 | **Azure Blob Storage** | 4.82 |
| 2 | Amazon S3 | 4.22 |
| 3 | Azure Files | 4.20 |
| 4 | Cloudinary | 3.67 |
| 5 | MinIO | 3.42 |

---

## Analysis

### Why Azure Blob Storage Wins for ChaufHER

1. **Azure Native**: Seamless integration with existing stack:
   - Same subscription/resource group
   - Managed identity authentication
   - Single billing
   - Azure Monitor integration

2. **South Africa Region**: Data stays local:
   - South Africa North (Johannesburg)
   - POPIA compliance easier
   - Low latency for SA users

3. **Storage Tiers**: Cost optimization:
   ```
   Hot Tier    → Profile photos (frequent access)
   Cool Tier   → Completed ride documents (30+ days)
   Archive     → Historical records (compliance)
   ```

4. **SAS Tokens**: Secure, time-limited access:
   ```csharp
   var sasBuilder = new BlobSasBuilder
   {
       BlobContainerName = "driver-documents",
       BlobName = "license-123.pdf",
       ExpiresOn = DateTimeOffset.UtcNow.AddMinutes(15)
   };
   sasBuilder.SetPermissions(BlobSasPermissions.Read);
   var sasToken = sasBuilder.ToSasQueryParameters(credential);
   ```

5. **Lifecycle Management**: Automatic tier transitions:
   - Move to Cool after 30 days inactive
   - Move to Archive after 1 year
   - Delete after 7 years (compliance)

### Cost Estimate (MVP)

| Item | Volume | Monthly Cost |
|------|--------|--------------|
| Storage (Hot) | 10 GB | ~R3.50 |
| Storage (Cool) | 50 GB | ~R5.00 |
| Operations | 100K | ~R1.00 |
| Egress | 10 GB | ~R15.00 |
| **Total** | | **~R25/month** |

*Extremely cost-effective for document storage.*

### When to Reconsider

Consider alternatives if:
- Multi-cloud strategy becomes priority
- Need S3-compatible API for tooling
- Cloudinary transformations needed (image optimization)

---

## Decision

**Selected: Azure Blob Storage** with Hot/Cool tier strategy

### Container Structure

```
chaufher-storage/
├── profile-photos/          (Hot tier)
│   ├── riders/{userId}/profile.jpg
│   └── drivers/{userId}/profile.jpg
├── vehicle-photos/          (Hot tier)
│   └── {vehicleId}/
│       ├── front.jpg
│       ├── back.jpg
│       └── interior.jpg
├── driver-documents/        (Cool tier after 30 days)
│   └── {driverId}/
│       ├── license.pdf
│       ├── id.pdf
│       ├── pdp.pdf
│       └── vehicle-registration.pdf
├── ride-receipts/           (Cool tier after 7 days)
│   └── {year}/{month}/{rideId}.pdf
└── compliance/              (Archive after 1 year)
    └── {year}/
        ├── background-checks/
        └── audit-logs/
```

### Access Control

| Container | Access Level | Who |
|-----------|--------------|-----|
| profile-photos | Public (read) | Anyone |
| vehicle-photos | Public (read) | Anyone |
| driver-documents | Private (SAS) | Driver, Admin |
| ride-receipts | Private (SAS) | Rider, Driver, Admin |
| compliance | Private (SAS) | Admin only |

### Upload Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        Upload Flow                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. PWA requests upload URL                                     │
│     POST /api/uploads/request                                   │
│     { "type": "driver-license", "contentType": "application/pdf" }│
│                                                                  │
│  2. API generates SAS token (write permission, 15 min expiry)   │
│     Returns: { "uploadUrl": "https://...?sv=...", "blobName": "..."}│
│                                                                  │
│  3. PWA uploads directly to Blob Storage                        │
│     PUT {uploadUrl}                                             │
│     Content-Type: application/pdf                               │
│     Body: <file bytes>                                          │
│                                                                  │
│  4. PWA confirms upload complete                                │
│     POST /api/uploads/complete                                  │
│     { "blobName": "...", "type": "driver-license" }            │
│                                                                  │
│  5. API validates and records in database                       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Configuration

```csharp
// appsettings.json
{
  "AzureStorage": {
    "ConnectionString": "DefaultEndpointsProtocol=https;AccountName=...",
    "Containers": {
      "ProfilePhotos": "profile-photos",
      "VehiclePhotos": "vehicle-photos",
      "DriverDocuments": "driver-documents",
      "RideReceipts": "ride-receipts"
    },
    "SasExpiryMinutes": 15
  }
}
```

### Service Implementation

```csharp
public interface IStorageService
{
    Task<string> GetUploadUrlAsync(string container, string blobName, string contentType);
    Task<string> GetDownloadUrlAsync(string container, string blobName);
    Task DeleteAsync(string container, string blobName);
}

public class AzureBlobStorageService : IStorageService
{
    public async Task<string> GetUploadUrlAsync(string container, string blobName, string contentType)
    {
        var blobClient = _containerClient.GetBlobClient(blobName);

        var sasBuilder = new BlobSasBuilder
        {
            BlobContainerName = container,
            BlobName = blobName,
            Resource = "b",
            ExpiresOn = DateTimeOffset.UtcNow.AddMinutes(_options.SasExpiryMinutes)
        };
        sasBuilder.SetPermissions(BlobSasPermissions.Write | BlobSasPermissions.Create);

        var sasToken = blobClient.GenerateSasUri(sasBuilder);
        return sasToken.ToString();
    }
}
```

### Lifecycle Policy

```json
{
  "rules": [
    {
      "name": "move-to-cool",
      "type": "Lifecycle",
      "definition": {
        "filters": {
          "blobTypes": ["blockBlob"],
          "prefixMatch": ["driver-documents/", "ride-receipts/"]
        },
        "actions": {
          "baseBlob": {
            "tierToCool": { "daysAfterModificationGreaterThan": 30 }
          }
        }
      }
    },
    {
      "name": "archive-compliance",
      "type": "Lifecycle",
      "definition": {
        "filters": {
          "prefixMatch": ["compliance/"]
        },
        "actions": {
          "baseBlob": {
            "tierToArchive": { "daysAfterModificationGreaterThan": 365 }
          }
        }
      }
    }
  ]
}
```

---

## Consequences

### Positive

- Native Azure integration simplifies architecture
- South Africa region ensures data residency
- Storage tiers optimize costs automatically
- SAS tokens provide secure, controlled access
- Lifecycle management handles retention

### Negative

- Azure vendor lock-in for storage
- SAS token management complexity
- Egress costs can accumulate

### Neutral

- Team learns Azure Blob SDK
- Direct browser upload reduces server load
- Can add CDN later if needed

---

## Related Documents

- [ADR-008: Cloud Provider (Azure)](008-cloud-provider-azure.md)
- [ADR-007: Authentication (Azure AD B2C)](007-authentication-azure-ad-b2c.md)
- [ADR-010: Infrastructure as Code (Bicep)](010-infrastructure-bicep.md)
- [ADR-024: Security Architecture](024-security-architecture.md)

---

## References

- [Azure Blob Storage Documentation](https://docs.microsoft.com/azure/storage/blobs/)
- [Azure Storage .NET SDK](https://docs.microsoft.com/dotnet/api/overview/azure/storage)
- [Blob Storage Access Tiers](https://docs.microsoft.com/azure/storage/blobs/access-tiers-overview)
- [Shared Access Signatures](https://docs.microsoft.com/azure/storage/common/storage-sas-overview)
