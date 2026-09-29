# Next-Phase Roadmap

Recommended improvements for the next development wave, ordered by impact and feasibility.

---

## Phase 1: Background Job Queue

**Priority**: Medium
**Effort**: Medium
**Dependencies**: None

### Goals
- Reliable async processing for emails (form notifications) and notifications
- Retry logic with exponential backoff
- Dead-letter queue for failed jobs
- Job monitoring dashboard

### Implementation Plan
1. Adopt `pg-boss` (PostgreSQL-backed) or `BullMQ` (Redis-backed) job queue
2. Migrate email sending from synchronous to queued
3. Add notification dispatch as a queued job
4. Move scheduled CMS publishing and system backups from in-process timers to jobs
5. Add admin UI for viewing job status, retrying failed jobs

---

## Phase 2: Dashboards & Alerting for Latency and Failures

**Priority**: Low
**Effort**: Medium
**Dependencies**: Phase 1 (beneficial but not required)

### Goals
- Real-time performance monitoring
- Alert on elevated error rates or latency
- Historical trend analysis

### Implementation Plan
1. Extend the existing metrics collection (`server/utils/metrics.ts`) with percentile tracking
2. Add a `/api/admin/system/metrics` endpoint with historical data
3. Create an admin system health page showing request rates, error rates, and latency percentiles
4. Add alerting thresholds (e.g., p95 latency > 2s, error rate > 5%)
5. Integrate with external monitoring service (Datadog, Grafana Cloud, or Uptime Robot) for alerts
6. Add slow-query logging (queries > 500ms) to identify database bottlenecks

---

## Timeline Summary

| Phase | Name | Priority | Effort | Suggested Timeline |
|-------|------|----------|--------|--------------------|
| 1 | Background Job Queue | Medium | Medium | Weeks 1–2 |
| 2 | Dashboards & Alerting | Low | Medium | Weeks 3–4 |
