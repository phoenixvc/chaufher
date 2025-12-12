# ADR-012: Project Management & Dashboard – Linear vs Alternatives

**Status:** Accepted
**Date:** 2025-01-15
**Decision Makers:** Engineering, Product, Leadership
**Technical Story:** Project management and issue tracking platform selection

---

## Context

ChaufHER requires a project management platform for:
- Sprint planning and backlog management
- Issue/bug tracking
- Roadmap visualization
- Cross-team collaboration (engineering, product, ops)
- Release planning and tracking
- Developer workflow integration (GitHub)

The platform must:
- Support agile/scrum workflows
- Integrate with GitHub (issues, PRs, branches)
- Provide good UX for small team
- Scale as team grows
- Enable visibility for stakeholders

---

## Decision Drivers

1. **Developer Experience** – Fast, keyboard-driven, minimal friction
2. **GitHub Integration** – Sync issues, PRs, branch tracking
3. **Ease of Use** – Quick adoption, low learning curve
4. **Roadmap Visibility** – Stakeholder-friendly views
5. **Cost** – Affordable for startup
6. **Speed** – Performance for daily use
7. **Customization** – Workflows, fields, views
8. **Mobile Access** – Check status on the go
9. **Reporting** – Velocity, cycle time, burndown
10. **Scalability** – Grow with team

---

## Options Considered

### Option A: Linear

Modern issue tracking built for speed and developer experience.

**Pros:**
- Extremely fast, keyboard-first UX
- Beautiful, modern interface
- Excellent GitHub integration (auto-links, branch tracking)
- Cycles (sprints) and roadmaps built-in
- Automatic issue numbering (CHF-123)
- Triage and inbox workflow
- Real-time collaboration
- Great mobile app
- Reasonable pricing ($8/user/month)

**Cons:**
- Less customizable than Jira
- Newer product (less mature ecosystem)
- Limited reporting compared to enterprise tools
- No time tracking built-in
- Smaller marketplace for integrations

### Option B: Jira (Atlassian)

Enterprise-grade project management platform.

**Pros:**
- Industry standard for enterprise
- Highly customizable workflows
- Extensive reporting and dashboards
- Large marketplace (apps, integrations)
- Advanced roadmaps (Premium)
- Time tracking built-in
- Mature and battle-tested

**Cons:**
- Slow, heavy UX
- Steep learning curve
- Expensive at scale
- Over-engineered for small teams
- GitHub integration requires marketplace app
- Configuration complexity

### Option C: GitHub Issues + Projects

GitHub's native issue tracking and project boards.

**Pros:**
- Native GitHub integration (obviously)
- Free with GitHub
- Issues live with code
- Projects v2 has improved significantly
- No context switching for developers
- Markdown-first

**Cons:**
- Limited project management features
- No proper sprint/cycle management
- Roadmap views basic
- Cross-repo projects awkward
- Reporting minimal
- Not designed for non-developers

### Option D: Notion (Projects)

Using Notion's database features for project management.

**Pros:**
- Already using for documentation (ADR-005)
- Flexible database views
- Good for small team
- Free/cheap
- Customizable

**Cons:**
- Not designed for issue tracking
- No GitHub integration (without Zapier)
- No sprint management
- Performance issues at scale
- Manual workflows
- Mixing docs and issues can get messy

### Option E: Shortcut (formerly Clubhouse)

Developer-focused project management.

**Pros:**
- Good balance of features and UX
- GitHub integration
- Stories, epics, milestones
- Iteration planning
- Reasonable pricing

**Cons:**
- Less polished than Linear
- Smaller community
- Some features feel incomplete
- Mobile app less refined
- GitHub sync can lag

---

## Weighted Evaluation Matrix

| Criterion | Weight | Linear | Jira | GitHub Issues | Notion | Shortcut |
|-----------|--------|--------|------|---------------|--------|----------|
| **Developer Experience** | 20% | 5 | 2 | 4 | 3 | 4 |
| **GitHub Integration** | 15% | 5 | 3 | 5 | 2 | 4 |
| **Ease of Use** | 15% | 5 | 2 | 4 | 4 | 4 |
| **Roadmap Visibility** | 12% | 5 | 5 | 2 | 3 | 4 |
| **Cost** | 10% | 4 | 2 | 5 | 5 | 4 |
| **Speed** | 8% | 5 | 2 | 4 | 3 | 4 |
| **Customization** | 8% | 3 | 5 | 2 | 5 | 4 |
| **Mobile Access** | 5% | 5 | 4 | 3 | 4 | 3 |
| **Reporting** | 4% | 4 | 5 | 2 | 3 | 4 |
| **Scalability** | 3% | 4 | 5 | 3 | 3 | 4 |

### Weighted Scores

| Option | Calculation | **Total Score** |
|--------|-------------|-----------------|
| **Linear** | (5×.20)+(5×.15)+(5×.15)+(5×.12)+(4×.10)+(5×.08)+(3×.08)+(5×.05)+(4×.04)+(4×.03) | **4.63** |
| **GitHub Issues** | (4×.20)+(5×.15)+(4×.15)+(2×.12)+(5×.10)+(4×.08)+(2×.08)+(3×.05)+(2×.04)+(3×.03) | **3.72** |
| **Shortcut** | (4×.20)+(4×.15)+(4×.15)+(4×.12)+(4×.10)+(4×.08)+(4×.08)+(3×.05)+(4×.04)+(4×.03) | **3.96** |
| **Notion** | (3×.20)+(2×.15)+(4×.15)+(3×.12)+(5×.10)+(3×.08)+(5×.08)+(4×.05)+(3×.04)+(3×.03) | **3.38** |
| **Jira** | (2×.20)+(3×.15)+(2×.15)+(5×.12)+(2×.10)+(2×.08)+(5×.08)+(4×.05)+(5×.04)+(5×.03) | **3.06** |

### Score Summary

| Rank | Option | Score |
|------|--------|-------|
| 1 | **Linear** | 4.63 |
| 2 | Shortcut | 3.96 |
| 3 | GitHub Issues | 3.72 |
| 4 | Notion | 3.38 |
| 5 | Jira | 3.06 |

---

## Analysis

### Why Linear Wins for ChaufHER

1. **Developer-First UX**: Linear is built for developers:
   - Keyboard shortcuts for everything
   - Sub-100ms response times
   - Clean, distraction-free interface
   - Vim-style navigation

2. **GitHub Integration Excellence**:
   - Auto-links issues to PRs and branches
   - Branch naming: `chf-123-feature-name`
   - PR status synced to issues
   - Commit mentions update issues

3. **Modern Agile Support**:
   - Cycles (sprints) with velocity tracking
   - Triage inbox for new issues
   - Roadmap views for stakeholders
   - Project milestones

4. **Right-Sized for ChaufHER**: Linear avoids enterprise bloat:
   - Quick setup (minutes, not days)
   - Sensible defaults
   - No certification required to use

5. **Cost-Effective**: $8/user/month is reasonable for a startup.

### Jira Consideration

Jira is powerful but overkill for a small team. If ChaufHER grows to 20+ engineers with complex workflows, Jira migration could be considered.

### When to Reconsider

Consider alternatives if:
- Enterprise compliance requires Jira (SOC 2 attestations, etc.)
- Team grows significantly and needs advanced reporting
- Confluence adoption makes Jira more attractive
- GitHub Issues improves substantially

---

## Decision

**Selected: Linear** for project management

### Workspace Structure

```
ChaufHER (Linear Workspace)
├── Teams
│   ├── Engineering
│   ├── Product
│   └── Operations
├── Projects
│   ├── MVP Launch
│   ├── Driver App
│   ├── Admin Portal
│   └── Infrastructure
└── Roadmap
    ├── Q1 2025 - MVP
    ├── Q2 2025 - Phase 2
    └── Future
```

### Issue Workflow

```
Triage → Backlog → Todo → In Progress → In Review → Done
           ↓
       Cancelled
```

### Labels

| Label | Purpose |
|-------|---------|
| `bug` | Defect/issue |
| `feature` | New functionality |
| `improvement` | Enhancement |
| `tech-debt` | Refactoring |
| `security` | Security-related |
| `urgent` | Needs immediate attention |

### GitHub Integration

```
Branch: chf-123-add-panic-button
PR: Closes CHF-123
Commit: CHF-123: Implement panic button UI
```

---

## Consequences

### Positive

- Fast, enjoyable daily workflow for developers
- Excellent GitHub integration reduces context switching
- Roadmaps provide stakeholder visibility
- Quick onboarding for new team members
- Modern, maintained product

### Negative

- Less customizable than Jira
- Limited advanced reporting
- Smaller ecosystem (fewer integrations)
- Migration to Jira would be effort if needed later

### Neutral

- Team learns Linear (quick learning curve)
- Separates docs (Notion) from issues (Linear) - clear boundaries
- Pricing scales with team size

---

## Related Documents

- [ADR-005: Documentation Platform (Notion)](005-documentation-notion.md)
- [ADR-006: Team Communication (Slack)](006-team-communication.md)
- [ADR-011: CI/CD Platform (GitHub Actions)](011-cicd-github-actions.md)

---

## References

- [Linear Official Site](https://linear.app/)
- [Linear GitHub Integration](https://linear.app/docs/github)
- [Linear Pricing](https://linear.app/pricing)
- [Linear Keyboard Shortcuts](https://linear.app/docs/keyboard-shortcuts)
