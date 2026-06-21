# AISP Managed Agents Playbook

**Date:** June 20, 2026  
**Status:** 🟢 Ready for deployment  
**Owner:** Brandon (CEO) + Directors (Anderson, Niobe, Dozer)

---

## Overview

Managed Agents are autonomous AI agents that run on Anthropic's cloud infrastructure, execute on schedules, iterate until success criteria are met, and improve over time via memory. They complement interactive AISP for recurring monitoring, reporting, and decision-support tasks.

**Phase 1 Pilot:** 3 agents (Neo, Ghost, Tank)  
**Phase 2 Roadmap:** 3 additional agents (The Architect, Agent Smith, Zion)  
**Expected ROI:** +$2,584/year (payback in 5 weeks)

---

## The 3-Agent Pilot (Phase 1)

### 1. NEO: Code Quality Monitor

| Attribute | Value |
|-----------|-------|
| **Schedule** | Daily 6:00 AM |
| **Owner** | Anderson (CTO) |
| **Goal** | Review all PRs from past 24h; flag issues, security concerns, coverage gaps, architecture risks |
| **Success Criteria** | 100% PR coverage, >99% security detection, coverage <85% flagged, actionable recommendations |
| **Inputs** | GitHub PRs (last 24h), code diffs, coverage data |
| **Outputs** | Daily report: security issues, coverage gaps, architecture concerns, recommendations |
| **Memory** | Learns patterns (e.g., "frontend code needs extra scrutiny"), remembers standards, adjusts sensitivity |
| **ROI** | 20 hours manual review/year saved = $1,000+ in labor |

**Success Metric:** Report ready by 6:30 AM, delivered to CTO dashboard

---

### 2. GHOST: Feedback Synthesis

| Attribute | Value |
|-----------|-------|
| **Schedule** | Every Friday 5:00 PM |
| **Owner** | Niobe (CPO) |
| **Goal** | Aggregate user feedback (support, interviews, surveys, social); identify patterns; prioritize by impact |
| **Success Criteria** | >80% source coverage, 3-5 major themes, ranked by impact, churn signals detected |
| **Inputs** | Feedback logs (support, surveys, interviews), customer segments, product roadmap |
| **Outputs** | Weekly report: top themes, urgent feedback, feature requests, churn signals, recommendations |
| **Memory** | Learns recurring themes, tracks theme momentum, learns which feedback sources are most reliable |
| **ROI** | 4 hours weekly synthesis = $2,000+ in labor/year |

**Success Metric:** Report delivered Friday 5:30 PM, reviewed by CPO before Monday planning

---

### 3. TANK: Infrastructure Monitor

| Attribute | Value |
|-----------|-------|
| **Schedule** | Twice daily (6:00 AM, 6:00 PM) |
| **Owner** | Anderson (CTO) + Dozer (CFO) |
| **Goal** | Monitor system health, cloud costs, performance; flag anomalies; suggest optimizations |
| **Success Criteria** | Outages detected <5 min, cost accuracy ±5%, P95 latency/uptime monitored, optimization suggestions actionable |
| **Inputs** | Cloud metrics (uptime, latency, errors, cost), historical baselines |
| **Outputs** | Health report: status summary, alerts (critical/warning/info), performance metrics, cost analysis, trends |
| **Memory** | Learns normal baselines, remembers seasonal patterns, tracks optimization successes, learns false alerts |
| **ROI** | 5 hours weekly monitoring = $1,200+ in labor/year |

**Success Metric:** Alert within 5 minutes of critical issue; dashboard updated every 12 hours

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    INTERACTIVE AISP                          │
│  (Session-based, user-prompted, strategic decisions)         │
│  (Directors + Brandon, using agent outputs)                  │
└───────────┬───────────────────────────────────────────┬─────┘
            │                                           │
      ┌─────▼─────┐                              ┌─────▼─────┐
      │   MEMORY  │                              │  CONTEXT  │
      │   BRIDGE  │                              │  BRIDGE   │
      │  (Learn)  │                              │ (Consume) │
      └─────┬─────┘                              └─────┬─────┘
            │                                           │
      ┌─────▼──────────────────────────────────────────▼──────┐
      │   MANAGED AGENTS (Cloud-Deployed, Scheduled)          │
      │  Neo (Daily 6 AM)  Ghost (Fri 5 PM)  Tank (2x daily)  │
      │  ✅ Autonomous  ✅ Self-correcting  ✅ Memory-based    │
      └────┬──────────────────────────┬───────────────────────┘
           │                          │
      ┌────▼─────────┐      ┌────────▼────────┐
      │  DASHBOARD   │      │  ESCALATIONS    │
      │  (Results)   │      │  (Alerts)       │
      │ Daily reports│      │ Critical issues │
      └────┬─────────┘      └────────┬────────┘
           │                          │
           └──────────────┬───────────┘
                         │
                  ┌──────▼──────┐
                  │  DIRECTORS  │
                  │  & BRANDON  │
                  │  (Act on)   │
                  └─────────────┘
```

---

## Memory System

Each agent maintains a persistent memory file (JSON):

**neo_memory.json:**
- Learned patterns ("frontend code needs extra scrutiny")
- Historical baselines ("avg 3 PRs/day weekdays")
- False positives ("this warning is always wrong")
- Feedback from Trinity (developer)
- Refinements made over time

**ghost_memory.json:**
- Recurring themes ("onboarding friction appears weekly")
- User segment patterns ("enterprise users care about compliance")
- Feedback source reliability ("Reddit is noise, support is signal")
- CPO decisions and context
- What worked last time

**tank_memory.json:**
- Normal baselines (CPU, memory, cost by day/time)
- Learned anomalies ("cost spike on 1st of month is expected")
- Optimization successes ("CDN tuning saved 15% costs")
- False alerts ("spike at 3 AM is always a batch job")
- Historical incidents

**Memory Update Pattern:**
1. Agent loads its memory file
2. References past learnings in decisions
3. Updates memory with new findings
4. Commits memory back to storage
5. Interactive AISP feedback loops back to memory

---

## Launch Checklist

### Pre-Launch Verification

**System Requirements:**
- [ ] Anthropic API key configured
- [ ] `/launch-your-agent` skill installed in Claude Code
- [ ] Cloud deployment target: Anthropic managed service
- [ ] Memory storage configured (JSON file persistence)
- [ ] Results storage configured (MANAGED_AGENTS_RESULTS/ folder)

**Documentation Complete:**
- [x] This playbook (MANAGED_AGENTS_PLAYBOOK.md)
- [x] Agent specs with prompts (NEO_CodeQualityMonitor_v1.md, GHOST_FeedbackSynthesis_v1.md, TANK_InfrastructureMonitor_v1.md)

**Stakeholder Alignment:**
- [x] Anderson (CTO) aware of Neo & Tank
- [x] Niobe (CPO) aware of Ghost
- [x] Dozer (CFO) aware of Tank
- [x] Brandon (CEO) briefed on managed agents

### Agent 1: NEO

**Before Launch:**
- [ ] GitHub API credentials configured
- [ ] Repo access verified
- [ ] PR fetching tested
- [ ] Code diff parsing tested

**Launch:**
1. [ ] Run `/launch-your-agent` with NEO specification
2. [ ] Schedule: Daily 6:00 AM UTC
3. [ ] Memory file initialized: `neo_memory.json`
4. [ ] Test run 1: Manual run to verify output
5. [ ] Test run 2: Check GitHub integration
6. [ ] Validate report structure

**Validation:**
- [ ] Report generated successfully
- [ ] All PRs covered from past 24h
- [ ] Security issues identified correctly
- [ ] Coverage data accurate
- [ ] Memory file updated
- [ ] Output format matches spec

### Agent 2: GHOST

**Before Launch:**
- [ ] Feedback sources connected (support, surveys, interviews, social, bugs, chat)
- [ ] Data access verified
- [ ] Segment definitions available

**Launch:**
1. [ ] Run `/launch-your-agent` with GHOST specification
2. [ ] Schedule: Every Friday 5:00 PM UTC
3. [ ] Memory file initialized: `ghost_memory.json`
4. [ ] Test run 1: Manual with last week's data
5. [ ] Test run 2: Verify all sources covered

**Validation:**
- [ ] Feedback aggregation complete (>80%)
- [ ] Themes identified (3-5)
- [ ] Impact scores calculated
- [ ] Churn signals detected
- [ ] Segment breakdown accurate
- [ ] Memory file updated

### Agent 3: TANK

**Before Launch:**
- [ ] Cloud provider API configured
- [ ] Metrics access verified (uptime, latency, errors, cost)
- [ ] Baseline metrics established
- [ ] Alert thresholds calibrated
- [ ] Cost tracking connected

**Launch:**
1. [ ] Run `/launch-your-agent` with TANK specification
2. [ ] Schedule: Twice daily (6:00 AM, 6:00 PM UTC)
3. [ ] Memory file initialized: `tank_memory.json`
4. [ ] Test run 1: Verify metrics collection
5. [ ] Test run 2: Verify anomaly detection

**Validation:**
- [ ] All metrics collected
- [ ] Status assessment accurate
- [ ] Cost analysis correct
- [ ] Trends identified
- [ ] Suggestions actionable
- [ ] Memory file updated

---

## Operational Workflow

### Daily Standup (Anderson, CTO)
1. Check Managed Agents Dashboard
   - Neo's code quality report
   - Tank's infrastructure health
   - Any escalations?
2. Discuss with team
   - "Coverage gap in auth module"
   - "Should we raise threshold?"
3. Feedback logged for next run

### Weekly Planning (Niobe, CPO)
1. Review Ghost's Feedback Synthesis (Friday EOD)
2. Discuss findings with Morpheus
3. Update roadmap based on themes
4. Log decision for Ghost to learn from
5. Monday: New roadmap reflects learnings

### On-Call (Tank Infrastructure)
1. Tank runs twice daily
2. If critical alert: escalate immediately
3. Anderson joins interactive session
4. Investigate + fix
5. Tank learns: "Next time, try X first"
6. Next run: more efficient

---

## Success Metrics & ROI

### Phase 1 Pilot Metrics (4 weeks)

| Agent | Metric | Target | Measure |
|-------|--------|--------|---------|
| **Neo** | PRs reviewed | 100% | Coverage |
| | Security detection | >99% | False negative rate |
| | False positives | <5% | Noise level |
| **Ghost** | Feedback coverage | >80% | Source inclusion |
| | Theme accuracy | >90% | Correctness |
| | Churn signals | 100% | Detection |
| **Tank** | Outage detection | <5 min | Response time |
| | Cost accuracy | ±5% | Variance |
| | Uptime | 99.9% | Reliability |
| **All Agents** | User satisfaction | >85% | Director feedback |
| | Memory improvement | Measurable | Agent refinement |

### Cost & Savings Analysis

**Costs (Annual):**
- Neo: ~$2/run × 365 days = $730/year
- Ghost: ~$3/run × 52 weeks = $156/year
- Tank: ~$1/run × 730 runs = $730/year
- **Total: ~$1,616/year**

**Savings (Annual):**
- Neo: 20 hours manual review/year = $1,000+ in labor
- Ghost: 4 hours weekly synthesis = $2,000+ in labor
- Tank: 5 hours weekly monitoring = $1,200+ in labor
- **Total: ~$4,200+/year**

**ROI:**
- Net Benefit: $4,200 - $1,616 = **$2,584/year**
- Payback Period: **5 weeks**

---

## Phase 2 Roadmap (If Pilot Successful)

### The Architect — Daily Cost Optimization
- **Schedule:** Daily 8:00 AM
- **Owner:** Dozer (CFO)
- **Goal:** Deep-dive cost analysis, recommend daily optimizations
- **ROI:** ~$1,500+/year

### Agent Smith — Lead Generation Loop
- **Schedule:** Continuous (daily optimization)
- **Owner:** Persephone (CSO)
- **Goal:** Run campaigns, measure ROI, optimize targeting
- **ROI:** ~$3,000+/year

### Zion — Daily Status Aggregation
- **Schedule:** Daily 4:00 PM
- **Owner:** Brandon (CEO)
- **Goal:** Collect team status, identify blockers, escalate
- **ROI:** ~$800+/year

---

## Rollback Plan (If Needed)

### Risk Level: LOW
- Agents run in isolated cloud environment
- No impact on interactive AISP if they fail
- Easy to pause/delete agents anytime
- Full rollback to manual work in <1 hour

### If Something Goes Wrong

1. **Pause Agent** (Cloud console): Stop scheduled runs immediately
2. **Assess Issue** (20 min): What went wrong?
3. **Decide**:
   - Simple fix? → Refine spec, redeploy (24h)
   - Complex issue? → Debug, redesign (1 week)
   - Broken concept? → Abandon, return to manual (immediate)
4. **Redeploy or Delete**: Resume or delete from cloud
5. **No Impact on Interactive AISP**: Continue normal operations

### Go/No-Go Decision Points

**Before Day 1:**
- Go: All 3 agents deployed, first runs successful
- No-Go: API access issues, memory storage not working, output format wrong

**After Week 1:**
- Go: Success criteria met, feedback positive, agents improving
- No-Go: High false alert rate, poor output quality, no memory improvement
- Hold: Partial success; refine then extend

---

## Launch Instructions

### Option 1: Interactive Launch (Recommended)

```bash
/launch-your-agent
```

For each agent, the skill will interview you:
1. **Goal:** "I want to deploy Neo, the Code Quality Monitor"
2. **Success Criteria:** "100% PR coverage, >99% security detection"
3. **Inputs:** "GitHub PR data (last 24h)"
4. **Outputs:** "Daily report with security flags, coverage gaps, recommendations"
5. **Schedule:** "Daily at 6:00 AM UTC"
6. **Memory:** "Yes, enable memory for learning"

Then copy the full prompt from the agent spec file into the prompt field.

### Option 2: Batch Deploy All 3

Repeat `/launch-your-agent` three times:
1. Neo (use NEO_CodeQualityMonitor_v1.md spec)
2. Ghost (use GHOST_FeedbackSynthesis_v1.md spec)
3. Tank (use TANK_InfrastructureMonitor_v1.md spec)

Each should take ~5-10 minutes.

---

## Documentation Files

```
AISP/
├─ MANAGED_AGENTS_PLAYBOOK.md ............... THIS FILE (consolidated)
└─ MANAGED_AGENTS/
   ├─ NEO_CodeQualityMonitor_v1.md ......... Agent spec (copy prompt to skill)
   ├─ GHOST_FeedbackSynthesis_v1.md ....... Agent spec (copy prompt to skill)
   └─ TANK_InfrastructureMonitor_v1.md .... Agent spec (copy prompt to skill)

Results Storage:
└─ MANAGED_AGENTS_RESULTS/
   ├─ neo_daily_[DATE].json ................. Daily reports
   ├─ ghost_weekly_[DATE].json .............. Weekly reports
   └─ tank_health_[TIME].json ............... Twice-daily reports

Memory Storage:
└─ MANAGED_AGENTS_MEMORY/
   ├─ neo_memory.json ....................... Agent learning
   ├─ ghost_memory.json ..................... Agent learning
   └─ tank_memory.json ...................... Agent learning
```

---

## Next Steps

1. ✅ Design complete
2. ⏳ **Run `/launch-your-agent` for Neo** (start first)
3. ⏳ Verify Neo deployment + first run
4. ⏳ **Run `/launch-your-agent` for Ghost**
5. ⏳ **Run `/launch-your-agent` for Tank**
6. ⏳ Monitor all 3 for week 1
7. ⏳ Collect feedback from Anderson, Niobe, Dozer
8. ⏳ Refine based on feedback
9. ⏳ Go/No-Go decision (June 28)
10. ⏳ Scale to Phase 2 agents if approved

---

## Action Checklist

- [ ] Brandon: Review this playbook
- [ ] Brandon: Ensure Anthropic API key configured
- [ ] Brandon: Run `/launch-your-agent` for Neo
- [ ] Brandon: Run `/launch-your-agent` for Ghost
- [ ] Brandon: Run `/launch-your-agent` for Tank
- [ ] Anderson: Review Neo's first run (June 22, 6 AM)
- [ ] Anderson: Review Tank's first run (June 21, 6 PM)
- [ ] Niobe: Review Ghost's first run (June 28, 5 PM)
- [ ] All: Week 1 validation & feedback
- [ ] Brandon: Go/No-Go decision (June 28)

---

## Summary

✅ **Designed:** 3-agent pilot (Neo, Ghost, Tank)  
✅ **Documented:** Full specs with prompts ready  
✅ **Planned:** Integration with interactive AISP  
✅ **Budgeted:** ROI +$2,584/year (payback in 5 weeks)  
✅ **Verified:** Low risk, easy rollback  

**🚀 Ready to deploy when you give the word.**

---

**Questions before launch?** Contact Brandon (CEO) or relevant director.
