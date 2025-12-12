# ADR-001: Client Technology Selection – Flutter vs PWA vs Alternatives

**Status:** Accepted
**Date:** 2025-12-12
**Owner:** Jurie
**Reviewer:** Eben
**Decision Makers:** Engineering, Product
**Technical Story:** ChaufHER mobile/web client technology selection

---

## Context

ChaufHER requires a client application that serves three user types (Riders, Drivers, Admins) across mobile and desktop devices. The platform must deliver:

- Reliable ride scheduling and status notifications
- Secure payment processing
- Real-time updates (status changes, notifications)
- Offline-resilient booking confirmation
- Cross-platform reach (iOS, Android, Web)
- Rapid MVP delivery with a small team (1 engineer)

The PRD specifies a **Progressive Web App (PWA)** approach, but this decision warrants formal evaluation against alternatives to ensure we're making an informed, defensible choice.

---

## Decision Drivers

1. **Time to Market** – MVP delivery in 3-6 weeks with minimal team
2. **Cross-Platform Reach** – iOS, Android, and desktop web from single codebase
3. **Development Cost** – Small team, limited budget
4. **User Experience** – App-like feel, responsive, accessible
5. **Offline Capability** – Booking confirmations must persist
6. **Native Device Access** – Push notifications, geolocation, camera (for driver docs)
7. **Maintainability** – Single codebase, straightforward updates
8. **Distribution** – Ease of deployment and updates
9. **Performance** – Fast load times, smooth interactions
10. **Future Scalability** – Ability to add features (live tracking, chat, etc.)

---

## Options Considered

### Option A: Progressive Web App (PWA)

A web application using modern browser APIs (Service Workers, Web Push, Web App Manifest) that can be installed on devices and work offline.

**Pros:**
- Single codebase for all platforms (web, iOS, Android)
- No app store approval delays or fees
- Instant updates without user action
- Lower development cost and faster iteration
- Works on any device with a modern browser
- SEO benefits for discoverability
- Smaller install footprint

**Cons:**
- Limited iOS support (no Web Push until iOS 16.4+, limited background sync)
- Less "native" feel than compiled apps
- Limited access to some device APIs (Bluetooth, NFC, advanced sensors)
- Performance ceiling for complex animations/graphics
- Browser-dependent feature support

### Option B: Flutter (Cross-Platform Native)

Google's UI toolkit for building natively compiled applications from a single Dart codebase.

**Pros:**
- True native performance and feel
- Full access to device APIs (camera, GPS, push, sensors)
- Single codebase for iOS, Android, Web, Desktop
- Rich widget library and animations
- Strong typing and tooling
- Growing ecosystem and community

**Cons:**
- Larger app bundle sizes (5-15MB minimum)
- Requires app store submission and approval
- Web support still maturing (performance, SEO challenges)
- Dart language learning curve (if team is JS-focused)
- Update delays due to app store review
- Higher initial setup complexity

### Option C: React Native

Facebook's framework for building native apps using React and JavaScript.

**Pros:**
- Native performance with JavaScript
- Large ecosystem and community
- Code sharing with React web apps
- Hot reload for fast development
- Extensive third-party libraries

**Cons:**
- "Bridge" architecture can cause performance bottlenecks
- Native module maintenance burden
- Frequent breaking changes between versions
- Web support requires separate implementation (React Native Web is limited)
- Debugging can be complex

### Option D: Native Development (Swift + Kotlin)

Separate native apps for iOS (Swift/SwiftUI) and Android (Kotlin/Jetpack Compose).

**Pros:**
- Best possible performance and UX
- Full platform API access
- First-class platform support and documentation
- Best for complex, performance-critical apps

**Cons:**
- Two separate codebases to maintain
- Double the development effort and cost
- Requires expertise in both ecosystems
- No web presence without third codebase
- Longest time to market

### Option E: Hybrid (Capacitor/Ionic)

Web technologies wrapped in a native container with access to native APIs via plugins.

**Pros:**
- Web skills transfer directly
- Single codebase for all platforms
- Access to native APIs via plugins
- Can leverage existing web frameworks (Angular, React, Vue)
- Faster development than pure native

**Cons:**
- Performance not as good as true native
- Plugin quality varies
- "Webview" feel can be noticeable
- Debugging native issues requires native knowledge
- Dependency on plugin maintainers

---

## Weighted Evaluation Matrix

Each criterion is weighted based on ChaufHER's specific priorities (MVP speed, small team, cross-platform reach). Scores are 1-5 (5 = best).

| Criterion | Weight | PWA | Flutter | React Native | Native | Capacitor |
|-----------|--------|-----|---------|--------------|--------|-----------|
| **Time to Market** | 20% | 5 | 3 | 3 | 1 | 4 |
| **Cross-Platform Reach** | 15% | 5 | 4 | 3 | 2 | 4 |
| **Development Cost** | 15% | 5 | 3 | 3 | 1 | 4 |
| **User Experience** | 12% | 3 | 5 | 4 | 5 | 3 |
| **Offline Capability** | 10% | 4 | 5 | 4 | 5 | 4 |
| **Native Device Access** | 8% | 3 | 5 | 5 | 5 | 4 |
| **Maintainability** | 8% | 5 | 4 | 3 | 2 | 4 |
| **Distribution Ease** | 5% | 5 | 2 | 2 | 2 | 3 |
| **Performance** | 4% | 3 | 5 | 4 | 5 | 3 |
| **Future Scalability** | 3% | 3 | 5 | 4 | 5 | 3 |

### Weighted Scores

| Option | Calculation | **Total Score** |
|--------|-------------|-----------------|
| **PWA** | (5×0.20)+(5×0.15)+(5×0.15)+(3×0.12)+(4×0.10)+(3×0.08)+(5×0.08)+(5×0.05)+(3×0.04)+(3×0.03) | **4.36** |
| **Flutter** | (3×0.20)+(4×0.15)+(3×0.15)+(5×0.12)+(5×0.10)+(5×0.08)+(4×0.08)+(2×0.05)+(5×0.04)+(5×0.03) | **3.92** |
| **React Native** | (3×0.20)+(3×0.15)+(3×0.15)+(4×0.12)+(4×0.10)+(5×0.08)+(3×0.08)+(2×0.05)+(4×0.04)+(4×0.03) | **3.40** |
| **Native** | (1×0.20)+(2×0.15)+(1×0.15)+(5×0.12)+(5×0.10)+(5×0.08)+(2×0.08)+(2×0.05)+(5×0.04)+(5×0.03) | **2.76** |
| **Capacitor** | (4×0.20)+(4×0.15)+(4×0.15)+(3×0.12)+(4×0.10)+(4×0.08)+(4×0.08)+(3×0.05)+(3×0.04)+(3×0.03) | **3.76** |

### Score Summary

| Rank | Option | Score |
|------|--------|-------|
| 1 | **PWA** | 4.36 |
| 2 | Flutter | 3.92 |
| 3 | Capacitor/Ionic | 3.76 |
| 4 | React Native | 3.40 |
| 5 | Native | 2.76 |

---

## Analysis

### Why PWA Wins for ChaufHER MVP

1. **Speed is Critical**: With a 3-6 week MVP timeline and 1 engineer, PWA's simplicity and immediate deployability are decisive advantages.

2. **Distribution Freedom**: No app store delays means faster iteration based on pilot feedback. Critical for a startup validating product-market fit.

3. **Good Enough Native Access**: Modern PWAs support:
   - Push notifications (including iOS 16.4+)
   - Geolocation (essential for pickup/dropoff)
   - Camera access (driver document upload)
   - Offline storage (booking confirmations)

4. **Target Audience Fit**: ChaufHER's users are women booking scheduled rides—not gamers or power users demanding peak native performance. Status clarity and reliability matter more than 60fps animations.

5. **Web-First Discovery**: Women discovering ChaufHER via referral or search can use it immediately without app store friction.

### When to Reconsider

Flutter or native development becomes preferable if:

- **Live tracking becomes MVP**: Complex map rendering and continuous GPS updates favour native performance
- **iOS push notifications are critical before iOS 16.4 adoption**: Would require native fallback
- **Driver app needs advanced features**: Background location, turn-by-turn navigation, etc.
- **Scale demands performance optimization**: Thousands of concurrent users with real-time updates

### Risk Mitigation

| Risk | Mitigation |
|------|------------|
| iOS PWA limitations | Target iOS 16.4+ users; provide SMS fallback for notifications |
| Performance ceiling | Keep UI simple per Design Guardrails; defer complex features |
| "Not a real app" perception | Strong install prompts; app-like UI; home screen icon |
| Future migration cost | Use clean architecture; isolate platform-specific code |

---

## Decision

**Recommended: Progressive Web App (PWA)** for ChaufHER MVP

The weighted evaluation confirms the PRD's PWA recommendation. For a small team with tight timelines targeting a specific user segment, PWA provides the best balance of speed, cost, and capability.

### Conditions for Revisiting

This decision should be revisited if:

1. MVP feedback reveals critical native capability gaps
2. iOS adoption data shows significant pre-16.4 user base
3. Phase 2 requirements (live tracking, in-app chat) prove PWA-incompatible
4. Team capacity increases to support parallel native development

---

## Consequences

### Positive

- Fastest path to MVP launch
- Single codebase reduces maintenance burden
- Instant updates without app store delays
- Lower hosting and distribution costs
- SEO and direct-link sharing benefits

### Negative

- Accept iOS PWA limitations (mitigated by SMS fallback)
- May need to rebuild for native if requirements change significantly
- Performance ceiling for future complex features
- Less "premium" perception vs. native apps

### Neutral

- Team builds web platform expertise (valuable regardless)
- Architecture should remain portable (clean separation of concerns)

---

## Related Documents

- [Product Requirements Document](../docs/PRD.md)
- [Design Guardrails](../docs/design_guardrails.md)

---

## Appendix: PWA Capability Checklist for ChaufHER

| Feature | PWA Support | ChaufHER Need | Status |
|---------|-------------|---------------|--------|
| Push Notifications | ✅ (iOS 16.4+) | MVP | ✅ Supported |
| Geolocation | ✅ Full | MVP | ✅ Supported |
| Camera Access | ✅ Full | MVP (driver docs) | ✅ Supported |
| Offline Storage | ✅ Full | MVP | ✅ Supported |
| Home Screen Install | ✅ Full | MVP | ✅ Supported |
| Background Sync | ⚠️ Limited iOS | Nice-to-have | ⚠️ Partial |
| Bluetooth/NFC | ❌ Limited | Not needed | N/A |
| Advanced Sensors | ❌ Limited | Not needed | N/A |
| Background Location | ⚠️ Limited | Future (tracking) | ⚠️ May need native |

---

## References

- [web.dev PWA Documentation](https://web.dev/progressive-web-apps/)
- [Flutter Official Documentation](https://flutter.dev/)
- [iOS 16.4 Web Push Support](https://webkit.org/blog/13878/web-push-for-web-apps-on-ios-and-ipados/)
- [What PWA Can Do Today](https://whatpwacando.today/)
