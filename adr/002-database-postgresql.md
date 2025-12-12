# ADR-002: Database Technology Selection – PostgreSQL

**Status:** Accepted
**Date:** 2025-12-12
**Owner:** Jurie
**Reviewer:** Eben
**Decision Makers:** Engineering, DevOps
**Technical Story:** Primary database selection for ChaufHER backend services

---

## Context

ChaufHER requires a primary database for storing:
- User accounts (riders, drivers, admins)
- Ride bookings and history
- Driver verification and compliance documents
- Payment transactions and records
- Ratings and reviews
- Audit logs

The database must support:
- ACID transactions for payment and booking integrity
- Complex queries (reporting, analytics, search)
- Geographic queries (pickup/dropoff locations)
- High availability for production workloads
- Scalability as user base grows
- Azure-native deployment for operational simplicity

---

## Decision Drivers

1. **Data Integrity** – ACID compliance for financial and booking transactions
2. **Query Flexibility** – Complex reporting, full-text search, geographic queries
3. **Azure Integration** – Managed service availability, backup, scaling
4. **Cost Efficiency** – Predictable pricing for startup budget
5. **Developer Experience** – ORM support, tooling, community resources
6. **Scalability** – Handle growth from MVP to production scale
7. **Operational Simplicity** – Managed service, minimal DBA overhead
8. **Performance** – Low latency for real-time booking operations
9. **Ecosystem** – Extensions, libraries, community support
10. **Team Expertise** – Existing team knowledge and learning curve

---

## Options Considered

### Option A: Azure Database for PostgreSQL (Flexible Server)

Fully managed PostgreSQL service on Azure with built-in HA, backups, and scaling.

**Pros:**
- Full PostgreSQL compatibility with extensions (PostGIS, pg_trgm, etc.)
- Excellent .NET/Entity Framework Core support
- Built-in high availability and automatic failover
- Point-in-time recovery and geo-redundant backups
- PostGIS for geographic queries (ride locations)
- Flexible scaling (compute and storage independent)
- Mature, proven technology with vast ecosystem
- Strong Azure integration (VNet, Private Link, Azure AD auth)

**Cons:**
- Requires connection pooling at scale (PgBouncer)
- Less "Azure-native" than Cosmos DB for global distribution
- Manual read replica setup for read scaling
- Storage costs separate from compute

### Option B: Azure SQL Database

Microsoft's fully managed SQL Server service.

**Pros:**
- Deep Azure integration and tooling
- Familiar to .NET developers
- Automatic tuning and performance insights
- Built-in threat detection
- Elastic pools for cost optimization

**Cons:**
- Higher licensing costs than PostgreSQL
- Vendor lock-in to Microsoft ecosystem
- Limited geographic extensions (no PostGIS equivalent)
- Less flexible for open-source tooling

### Option C: Azure Cosmos DB

Microsoft's globally distributed, multi-model NoSQL database.

**Pros:**
- Global distribution with multi-region writes
- Guaranteed low latency (<10ms reads)
- Automatic scaling (serverless option)
- Multiple APIs (SQL, MongoDB, etc.)
- Built for massive scale

**Cons:**
- Higher cost for relational workloads
- No ACID transactions across partitions
- Complex data modeling (denormalization required)
- RU-based pricing can be unpredictable
- Less suitable for complex reporting queries
- Steeper learning curve for SQL-trained team

### Option D: Azure Database for MySQL

Fully managed MySQL service.

**Pros:**
- Wide adoption and familiarity
- Lower cost than SQL Server
- Good .NET support via MySQL Connector
- Simpler than PostgreSQL for basic use cases

**Cons:**
- Weaker feature set than PostgreSQL
- Limited extension ecosystem
- No native geographic support (requires workarounds)
- Less sophisticated query optimizer
- Percona/MariaDB fragmentation in ecosystem

### Option E: MongoDB Atlas on Azure

Managed MongoDB deployment on Azure infrastructure.

**Pros:**
- Flexible document model
- Good for rapidly evolving schemas
- Native Azure marketplace integration
- Horizontal scaling (sharding)
- Rich query language for documents

**Cons:**
- No ACID transactions across documents (until recent versions)
- Joins require application-level handling
- Higher cost for transactional workloads
- Third-party service (not Azure-native)
- Reporting/analytics requires aggregation pipelines

---

## Weighted Evaluation Matrix

| Criterion | Weight | PostgreSQL | SQL Server | Cosmos DB | MySQL | MongoDB |
|-----------|--------|------------|------------|-----------|-------|---------|
| **Data Integrity (ACID)** | 20% | 5 | 5 | 3 | 5 | 4 |
| **Query Flexibility** | 15% | 5 | 5 | 3 | 4 | 4 |
| **Azure Integration** | 12% | 4 | 5 | 5 | 4 | 3 |
| **Cost Efficiency** | 12% | 5 | 3 | 2 | 5 | 3 |
| **Developer Experience** | 10% | 5 | 5 | 3 | 4 | 4 |
| **Scalability** | 10% | 4 | 4 | 5 | 4 | 5 |
| **Operational Simplicity** | 8% | 4 | 5 | 4 | 4 | 3 |
| **Performance** | 5% | 5 | 5 | 5 | 4 | 4 |
| **Ecosystem (Extensions)** | 5% | 5 | 4 | 3 | 3 | 4 |
| **Team Expertise** | 3% | 4 | 4 | 2 | 4 | 3 |

### Weighted Scores

| Option | Calculation | **Total Score** |
|--------|-------------|-----------------|
| **PostgreSQL** | (5×.20)+(5×.15)+(4×.12)+(5×.12)+(5×.10)+(4×.10)+(4×.08)+(5×.05)+(5×.05)+(4×.03) | **4.62** |
| **SQL Server** | (5×.20)+(5×.15)+(5×.12)+(3×.12)+(5×.10)+(4×.10)+(5×.08)+(5×.05)+(4×.05)+(4×.03) | **4.53** |
| **Cosmos DB** | (3×.20)+(3×.15)+(5×.12)+(2×.12)+(3×.10)+(5×.10)+(4×.08)+(5×.05)+(3×.05)+(2×.03) | **3.45** |
| **MySQL** | (5×.20)+(4×.15)+(4×.12)+(5×.12)+(4×.10)+(4×.10)+(4×.08)+(4×.05)+(3×.05)+(4×.03) | **4.29** |
| **MongoDB** | (4×.20)+(4×.15)+(3×.12)+(3×.12)+(4×.10)+(5×.10)+(3×.08)+(4×.05)+(4×.05)+(3×.03) | **3.81** |

### Score Summary

| Rank | Option | Score |
|------|--------|-------|
| 1 | **PostgreSQL** | 4.62 |
| 2 | SQL Server | 4.53 |
| 3 | MySQL | 4.29 |
| 4 | MongoDB | 3.81 |
| 5 | Cosmos DB | 3.45 |

---

## Analysis

### Why PostgreSQL Wins for ChaufHER

1. **Full ACID Compliance**: Critical for payment transactions and booking integrity. PostgreSQL's transaction model is battle-tested and reliable.

2. **PostGIS for Geographic Data**: ChaufHER's core functionality involves locations. PostGIS provides industry-leading spatial queries for:
   - Finding nearby drivers
   - Calculating route distances
   - Geofencing for service areas

3. **Cost-Effective**: Open-source licensing means no per-core costs. Azure Flexible Server pricing is transparent and predictable.

4. **Excellent .NET Support**: Entity Framework Core has first-class PostgreSQL support via Npgsql. Strong ORM capabilities reduce boilerplate.

5. **Rich Extension Ecosystem**:
   - `pg_trgm` for fuzzy text search
   - `uuid-ossp` for distributed ID generation
   - `pgcrypto` for encryption
   - `pg_stat_statements` for query analysis

6. **Future-Proof**: PostgreSQL's feature velocity is industry-leading. JSON support, full-text search, and window functions provide flexibility.

### SQL Server Consideration

SQL Server scored close (4.53 vs 4.62) and is a valid alternative with stronger Azure integration. PostgreSQL wins on:
- Cost (no licensing fees)
- Geographic queries (PostGIS)
- Open-source ecosystem

### When to Reconsider

Consider alternative approaches if:
- Global distribution becomes critical (evaluate Cosmos DB)
- Document-centric data dominates (evaluate MongoDB)
- Enterprise SQL Server skills are abundant on team
- Azure cost negotiations favor SQL Server licensing

---

## Decision

**Selected: Azure Database for PostgreSQL (Flexible Server)**

### Configuration Recommendations

| Environment | Tier | vCores | Storage | HA |
|-------------|------|--------|---------|-----|
| Development | Burstable B1ms | 1 | 32 GB | No |
| Staging | General Purpose D2s | 2 | 64 GB | No |
| Production | General Purpose D4s | 4 | 128 GB | Zone redundant |

### Key Settings

- **Version**: PostgreSQL 16 (latest stable)
- **Extensions**: PostGIS, pg_trgm, uuid-ossp
- **Backup**: 7-day retention (dev), 35-day retention (prod)
- **Connectivity**: Private endpoint within VNet
- **Connection Pooling**: PgBouncer enabled

---

## Consequences

### Positive

- Cost-effective managed database with predictable pricing
- PostGIS enables sophisticated location-based queries
- Strong .NET/EF Core integration for rapid development
- Rich ecosystem of extensions and tooling
- Active open-source community and documentation

### Negative

- Connection pooling required at scale (PgBouncer adds complexity)
- Less native Azure integration than SQL Server
- Manual configuration for read replicas
- Team may need PostgreSQL-specific training

### Neutral

- Builds PostgreSQL expertise (valuable skill)
- Migration from PostgreSQL to other systems is straightforward
- Schema management via EF Core migrations

---

## Related Documents

- [ADR-001: Client Technology Selection](001-client-technology-flutter-vs-pwa.md)
- [ADR-008: Cloud Provider Selection](008-cloud-provider-azure.md)
- [Product Requirements Document](../docs/PRD.md)

---

## References

- [Azure Database for PostgreSQL Documentation](https://docs.microsoft.com/azure/postgresql/)
- [PostGIS Documentation](https://postgis.net/documentation/)
- [Npgsql Entity Framework Core Provider](https://www.npgsql.org/efcore/)
- [PostgreSQL 16 Release Notes](https://www.postgresql.org/docs/16/release-16.html)
