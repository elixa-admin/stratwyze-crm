# AISP Company Development Methodology

**Version:** 1.0  
**Date:** June 20, 2026  
**Status:** Company-Wide Standard (applies to ALL projects)  
**Compliance:** Mandatory with documented flexibility

---

## Overview: 11-Phase Workflow

Every AISP project follows this 11-phase workflow. The workflow is **designed to be flexible** — phases can be combined, shortened, or skipped with documented justification, but the workflow structure remains the standard.

```
IDEA
  ↓
DISCOVERY
  ↓
PLANNING ─────────┐
  ↓               │ (Gating Point 1: Business Viability)
DESIGN            │
  ↓               │
ARCHITECTURE ─────┘ (Gating Point 2: Methodology Fit)
  ↓
BUILD ────────────┐ (Gating Point 3: Success Definition)
  ↓               │
REVIEW            │
  ↓               │
TEST              │
  ↓               │
RELEASE ──────────┘
  ↓
AUDIT
  ↓
OPTIMISE
```

---

## The 11 Phases: Detailed Breakdown

### **1. IDEA** (Duration: Variable)
**Purpose:** Conceptualization and initial scoping  
**Who:** Proposer + CEO (approval)  
**Inputs:** Business problem, initial vision, rough timeline  
**Outputs:** Project brief, decision to proceed to Discovery

**Key Questions:**
- What's the core problem we're solving?
- Why is this worth AISP's time?
- Rough timeline and team size estimate?

**Skills Involved:** None (human brainstorm)  
**Gate:** Proceed to Discovery? (CEO approval)

---

### **2. DISCOVERY** (Duration: 1-3 days)
**Purpose:** Research, validate assumptions, understand constraints  
**Who:** Project owner (director) + analyst (if needed)  
**Inputs:** Project brief, stakeholder inputs  
**Outputs:** Discovery report with problem validation, assumptions, risks, solution directions

**Key Questions:**
- Is this problem real and worth solving?
- What are the constraints (budget, timeline, technical, regulatory)?
- What's the competitive landscape?
- Who are the users/stakeholders?

**Skills Involved:** 
- `/plan` (research architecture, design investigation plan)
- `/memory` (load prior similar project learnings)
- Manual research (stakeholder interviews, market research)

**Gate:** Does problem validate? Proceed to Planning?

---

### **3. PLANNING** (Duration: 2-5 days)
**Purpose:** Define scope, timeline, team, budget, success criteria  
**Who:** CEO + Project owner (director) + Coordinator  
**Inputs:** Discovery report  
**Outputs:** Project plan with scope, timeline, team structure, budget, success metrics

**GATING POINT 1: BUSINESS VIABILITY CHECK**
- **Question:** Can we deliver 30%+ faster or cheaper than human teams?
- **Decision:** Approve → Proceed to Design OR Reject

**Skills Involved:**
- `/goal wave [N]` (define success criteria for entire project)
- `/launch-your-project` (initialize project folder structure)
- Manual planning (timeline breakdown, budget)

**Gate:** Business viability passed? Scope clear? Team ready? → Proceed to Design

---

### **4. DESIGN** (Duration: 3-5 days, may be skipped for Bug/Maintenance)
**Purpose:** Design UX, interfaces, workflows, user-facing architecture  
**Who:** Designer + Product owner + Engineers  
**Inputs:** Project plan, user stories, requirements  
**Outputs:** Design docs, wireframes, user flows, design system specs

**Key Questions:**
- How will users interact with this?
- What's the information architecture?
- What are the key workflows?
- Are there accessibility/UX constraints?

**Skills Involved:**
- `/plan` (design planning + refinement)
- Manual design tools (Figma, etc.)
- `/code-review` (design artifact review)

**Gate:** Design approved? → Proceed to Architecture

---

### **5. ARCHITECTURE** (Duration: 2-4 days, may be skipped for Maintenance)
**Purpose:** Design technical system, components, data flow, integration points  
**Who:** Lead engineer + architects  
**Inputs:** Design specs, requirements, technical constraints  
**Outputs:** Architecture document, component diagrams, data models, deployment strategy

**GATING POINT 2: METHODOLOGY FIT CHECK**
- **Question:** Is this project aligned with AISP's autonomous playbook? Can success be replicated?
- **Decision:** Approve → Proceed to Build OR Iterate → Return to Design

**Key Questions:**
- What's the technical architecture (services, databases, APIs)?
- Where will agents make autonomous decisions?
- What failure modes exist and how do we mitigate?
- How is this replicable?

**Skills Involved:**
- `/plan` (architecture design + validation)
- `/code-review` (architecture artifact review)
- Manual architecture documentation

**Gate:** Architecture sound and replicable? → Proceed to Build

---

### **6. BUILD** (Duration: 6-8 weeks for features, 1-3 days for bugs/maintenance)
**Purpose:** Implementation of design and architecture  
**Who:** Engineering team + agents (autonomous execution)  
**Inputs:** Design specs, architecture document, acceptance criteria  
**Outputs:** Working code, feature-complete implementation, deployed to staging

**GATING POINT 3: SUCCESS DEFINITION CHECK**
- **Question:** Are success criteria measurable and clear?
- **Decision:** Confirm criteria → Proceed to Build execution

**Build Structure (per sprint, max 10 sprints per build phase):**

**Sub-Phase: Sprint Planning**
- Skill: `/goal sprint [N]` (define sprint objectives)
- Output: SPRINT_N_PLAN.md with tasks, estimates, success criteria

**Sub-Phase: Sprint Execution**
- Skill: `/execute-sprint-build [N]` (auto-execute sprint plan)
- Output: Code committed to dev branch, tests passing, staged deployment

**Sub-Phase: Continuous Quality**
- Skill: `/code-review` (auto-triggered on every PR)
- Output: Feedback loop, agent learning

**Skills Involved:**
- `/goal sprint [N]` (sprint planning)
- `/execute-sprint-build [N]` (automated execution)
- `/code-review` (continuous feedback)
- `/memory` (load/save sprint learnings)
- Git, GitHub (version control)
- Vercel (staging deployment)

**Gate:** Sprint N complete? Tests passing? Coverage >85%? → Proceed to next sprint or Review

---

### **7. REVIEW** (Duration: 1-2 days)
**Purpose:** Comprehensive code review, design review, architecture review  
**Who:** Lead reviewers, architects, product owners  
**Inputs:** Completed code, design artifacts, architecture decisions  
**Outputs:** Review report with feedback, approval to proceed or iteration needed

**Key Questions:**
- Does code meet quality standards?
- Are design principles followed?
- Is architecture sound?
- Are there security, performance, or accessibility issues?

**Skills Involved:**
- `/code-review` (PR-level reviews)
- `/ultrareview` (comprehensive multi-agent review, optional but recommended for major features)
- Manual review (design artifacts, documentation)

**Gate:** All review feedback addressed? Approved to proceed? → Proceed to Test

---

### **8. TEST** (Duration: 2-5 days)
**Purpose:** QA, integration testing, performance testing, security testing  
**Who:** QA team + automated test suite  
**Inputs:** Code from Review phase  
**Outputs:** Test report, confirmed bug-free, performance verified, security cleared

**Testing Levels:**
1. **Unit Tests** → Passing (automated, PR-gated)
2. **Integration Tests** → Passing (automated, pre-release)
3. **E2E Tests** → Passing (automated, pre-release)
4. **Performance Tests** → Meeting targets (automated)
5. **Security Tests** → Cleared (automated + manual)
6. **UAT (if applicable)** → Stakeholders approve

**Skills Involved:**
- Automated test suite (GitHub Actions)
- `/code-review` (test coverage review)
- Manual testing (edge cases, real-world scenarios)
- Performance monitoring tools
- Security scanning tools

**Gate:** All tests passing? Coverage >85%? Performance targets met? Security cleared? → Proceed to Release

---

### **9. RELEASE** (Duration: 1 day)
**Purpose:** Deploy to production, monitor rollout  
**Who:** DevOps / Release engineer + team on-call  
**Inputs:** Tested code, release notes, rollback plan  
**Outputs:** Production deployment, release notes published, monitoring active

**Release Checklist:**
- [ ] Final smoke tests passing
- [ ] Release notes prepared
- [ ] Rollback plan documented
- [ ] On-call team ready
- [ ] Monitoring/alerts configured
- [ ] Production deployment executed
- [ ] Post-deployment verification

**Skills Involved:**
- Vercel (deployment automation)
- GitHub Actions (CI/CD)
- Monitoring tools (logs, metrics, alerts)
- `/ultrareview` (final gate before production, mandatory for major releases)
- Manual release coordination

**Gate:** Production healthy? Metrics nominal? → Proceed to Audit

---

### **10. AUDIT** (Duration: 2-5 days post-release)
**Purpose:** Post-release review, metrics analysis, incident review  
**Who:** Project owner + team  
**Inputs:** Production metrics, incident reports, user feedback  
**Outputs:** Audit report with insights, decisions for next iteration

**Key Questions:**
- Did we meet success criteria?
- Were there incidents? How did we respond?
- What's the user adoption/engagement?
- Did we achieve 30%+ efficiency vs. human baseline?
- What surprised us (good or bad)?

**Skills Involved:**
- `/memory` (save project learnings, patterns, decisions)
- Monitoring/analytics tools (metrics dashboard)
- Incident review (post-mortems if applicable)
- Manual retrospective (team debrief)

**Gate:** Audit complete? Learnings captured? → Proceed to Optimise or close project

---

### **11. OPTIMISE** (Duration: 1-2 weeks, ongoing as phase)
**Purpose:** Improvement, refinement, learning capture  
**Who:** Entire team + future teams (via patterns captured)  
**Inputs:** Audit report, user feedback, performance data, team learnings  
**Outputs:** Improvement backlog, pattern library updates, methodology refinements

**Optimisation Focus:**
- **Code:** Refactor hot paths, improve maintainability
- **Performance:** Profile and optimize slow operations
- **Security:** Apply learnings from security audit
- **Process:** Capture patterns that worked well for future projects
- **Playbook:** Update AISP methodology based on what we learned

**Skills Involved:**
- `/memory` (persist patterns, decisions, learnings)
- `/plan` (design optimisation work)
- Manual code review + refactoring
- Methodology refinement (add to shared standards)

**Gate:** Optimisation complete → Project CLOSED or cycle back to IDEA (new feature)

---

## Project Type Definitions

### **Type 1: Feature** (New capability)
**Mandatory Phases:** All 11 phases  
**Typical Duration:** 8-12 weeks (can vary)  
**Gating Points:** All 3 (business viability, methodology fit, success definition)

**Example:** "Add user authentication system"

**Phase Breakdown:**
- IDEA (1 day)
- DISCOVERY (2-3 days)
- PLANNING (3-5 days)
- DESIGN (3-5 days) ✓ MANDATORY
- ARCHITECTURE (2-4 days) ✓ MANDATORY
- BUILD (6-8 weeks)
- REVIEW (1-2 days)
- TEST (2-5 days)
- RELEASE (1 day)
- AUDIT (2-5 days)
- OPTIMISE (1-2 weeks, ongoing)

---

### **Type 2: Bug** (Fix an issue)
**Mandatory Phases:** DISCOVERY, PLANNING, ARCHITECTURE, BUILD, REVIEW, TEST, RELEASE, AUDIT  
**Skippable Phases:** DESIGN (can skip if fix is purely technical)  
**Typical Duration:** 1-3 weeks  
**Gating Points:** 2 (business viability, methodology fit)

**Example:** "Fix user login timeout issue"

**Phase Breakdown:**
- IDEA (1 day)
- DISCOVERY (1 day)
- PLANNING (1 day)
- DESIGN (SKIP) ✗ Can skip for technical bug fixes
- ARCHITECTURE (1 day)
- BUILD (2-5 days)
- REVIEW (1 day)
- TEST (1-2 days)
- RELEASE (½ day)
- AUDIT (1 day)
- OPTIMISE (1 day, minimal)

---

### **Type 3: Maintenance** (Refactor, upgrade, dependency update)
**Mandatory Phases:** DISCOVERY, PLANNING, BUILD, REVIEW, TEST, RELEASE, AUDIT  
**Skippable Phases:** DESIGN, ARCHITECTURE (both can skip for internal refactoring)  
**Typical Duration:** 1-2 weeks  
**Gating Points:** 1 (business viability only, no methodology fit check)

**Example:** "Upgrade Node.js from v18 to v20" or "Refactor auth service for clarity"

**Phase Breakdown:**
- IDEA (½ day)
- DISCOVERY (½ day)
- PLANNING (½ day)
- DESIGN (SKIP) ✗ Not needed
- ARCHITECTURE (SKIP) ✗ Not needed for maintenance
- BUILD (3-5 days)
- REVIEW (1 day)
- TEST (1-2 days)
- RELEASE (½ day)
- AUDIT (½ day)
- OPTIMISE (minimal, 1 day)

---

## Global Environment Variables

Every AISP project initializes with these environment variables. They control which phases are invoked and how strictly.

```bash
# PROJECT TYPE (controls which phases are mandatory)
PROJECT_TYPE=feature|bug|maintenance
# Default: feature (all phases)

# PHASE ENFORCEMENT (controls gate strictness)
PHASE_ENFORCEMENT=strict|flexible|tiered
# Default: flexible (warn/suggest, allow override with docs)

# GATING POINTS (which gates are active for this project)
GATE_BUSINESS_VIABILITY=true|false
# Default: true (always check business viability first)

GATE_METHODOLOGY_FIT=true|false
# Default: true for Wave 1-2, false for Wave 3+ (legacy projects)

GATE_SUCCESS_DEFINITION=true|false
# Default: true (always confirm success criteria before build)

# PHASE AUTOMATION (which phases auto-invoke tools)
PHASE_DISCOVERY_AUTO_INVOKED=true|false
# Default: false (manual research + stakeholder interviews)

PHASE_PLANNING_AUTO_INVOKED=true|false
# Default: true (auto-invoke /goal and /launch-your-project)

PHASE_DESIGN_AUTO_INVOKED=true|false
# Default: false (manual design work)

PHASE_ARCHITECTURE_AUTO_INVOKED=true|false
# Default: true (auto-invoke /plan for architecture)

PHASE_BUILD_AUTO_INVOKED=true|false
# Default: true (auto-invoke /execute-sprint-build per sprint)

PHASE_REVIEW_AUTO_INVOKED=true|false
# Default: true (/code-review on every PR, /ultrareview on Sprint 10)

PHASE_TEST_AUTO_INVOKED=true|false
# Default: true (automated test suite via GitHub Actions)

PHASE_RELEASE_AUTO_INVOKED=true|false
# Default: true (Vercel auto-deploys on merge to main)

PHASE_AUDIT_AUTO_INVOKED=true|false
# Default: true (/memory auto-save, metrics collection)

PHASE_OPTIMISE_AUTO_INVOKED=true|false
# Default: false (manual decision on optimisation work)

# SKIP PHASE (allow skipping a phase with documented override)
SKIP_PHASE_DESIGN=false|override_key
# Default: false (DESIGN is mandatory for Feature projects)

SKIP_PHASE_ARCHITECTURE=false|override_key
# Default: false (ARCHITECTURE is mandatory for Feature projects)

# DOCUMENTATION REQUIREMENTS (what must be documented when skipping)
SKIP_DOCUMENTATION_REQUIRED=false|lightweight|detailed
# Default: lightweight (one-liner explanation)

# AUTONOMY LEVEL (how autonomous agents can be in this project)
AUTONOMY_LEVEL=80|90|95
# Default: 90 (standard autonomous execution)

# WAVE ASSIGNMENT (which Wave this project belongs to)
WAVE=1|2|3
# Default: 1 (until explicitly upgraded)

# TOKEN BUDGET (max tokens per sprint for this project)
TOKEN_BUDGET_PER_SPRINT=40000|80000|160000
# Default: 80000 (medium projects)

# SUCCESS METRICS (what gets measured)
MEASURE_TOKEN_EFFICIENCY=true|false
# Default: true (measure 25-50% savings target)

MEASURE_AUTONOMY_RATE=true|false
# Default: true (measure <5% override rate)

MEASURE_TIME_SAVINGS=true|false
# Default: true (measure speed vs. human baseline)

MEASURE_REPLICABILITY=true|false
# Default: true (can another team do this with our playbook?)
```

**Example: Feature Project (.env file)**
```bash
PROJECT_TYPE=feature
PHASE_ENFORCEMENT=flexible
GATE_BUSINESS_VIABILITY=true
GATE_METHODOLOGY_FIT=true
GATE_SUCCESS_DEFINITION=true
PHASE_PLANNING_AUTO_INVOKED=true
PHASE_BUILD_AUTO_INVOKED=true
PHASE_REVIEW_AUTO_INVOKED=true
AUTONOMY_LEVEL=90
WAVE=1
TOKEN_BUDGET_PER_SPRINT=80000
```

**Example: Maintenance Project (.env file)**
```bash
PROJECT_TYPE=maintenance
PHASE_ENFORCEMENT=flexible
GATE_BUSINESS_VIABILITY=true
GATE_METHODOLOGY_FIT=false
GATE_SUCCESS_DEFINITION=false
SKIP_PHASE_DESIGN=override_minimal_refactor
SKIP_PHASE_ARCHITECTURE=override_internal_only
SKIP_DOCUMENTATION_REQUIRED=lightweight
PHASE_BUILD_AUTO_INVOKED=true
AUTONOMY_LEVEL=90
WAVE=3
TOKEN_BUDGET_PER_SPRINT=40000
```

---

## Enforcement Rules

### **Rule 1: Phase Gates Are Warnings by Default**
- When a phase would be skipped, system warns: "You're about to skip [PHASE]. Document why."
- User must provide override key + justification
- Justification is logged in project audit trail

### **Rule 2: Gating Points Are Hard Blocks**
- Business Viability gate (Phase 3): CANNOT skip, CANNOT override
- Methodology Fit gate (Phase 5): Can override ONLY with CEO signature
- Success Definition gate (Phase 6): CANNOT skip, CANNOT override

### **Rule 3: Project Types Define Mandatory Phases**
- Feature: All 11 phases mandatory
- Bug: DESIGN can be skipped with justification
- Maintenance: DESIGN + ARCHITECTURE can be skipped with justification

### **Rule 4: Tools Auto-Invoke When Phase Is Active**
- If `PHASE_PLANNING_AUTO_INVOKED=true` → `/goal` + `/launch-your-project` auto-invoked
- If `PHASE_BUILD_AUTO_INVOKED=true` → `/execute-sprint-build` auto-invoked per sprint
- If `PHASE_REVIEW_AUTO_INVOKED=true` → `/code-review` auto-triggered on PR

### **Rule 5: Audit Trail**
- Every skip, gate decision, override is logged in `/project_audit.log`
- Wave completion report includes enforcement metrics
- Methodology compliance is measured (% projects following full flow)

---

## Integration with Skills & Tools

### **Auto-Invocation Map:**

| Phase | Skill | Trigger | Mandatory? |
|-------|-------|---------|-----------|
| PLANNING | `/goal wave [N]` | `PHASE_PLANNING_AUTO_INVOKED` | Yes if Feature |
| PLANNING | `/launch-your-project` | `PHASE_PLANNING_AUTO_INVOKED` | Yes if Feature |
| ARCHITECTURE | `/plan` | `PHASE_ARCHITECTURE_AUTO_INVOKED` | Yes if Feature |
| BUILD | `/goal sprint [N]` | `PHASE_BUILD_AUTO_INVOKED` | Yes every sprint |
| BUILD | `/execute-sprint-build [N]` | `PHASE_BUILD_AUTO_INVOKED` | Yes every sprint |
| REVIEW | `/code-review` | `PHASE_REVIEW_AUTO_INVOKED` | Yes, auto on PR |
| REVIEW | `/ultrareview` | `PHASE_REVIEW_AUTO_INVOKED` | Yes, Sprint 10 |
| AUDIT | `/memory` | `PHASE_AUDIT_AUTO_INVOKED` | Yes, auto save |
| ALL | `/memory` load | Session start | Yes, always |

---

## Methodology Compliance Dashboard

Every project has a compliance dashboard showing:

```
Project: AISP-ProjectAlpha
Wave: 1, Build Phase: 1.1, Sprint: 5/10

Phase Completion:
✅ IDEA (100%) - Completed Day 1
✅ DISCOVERY (100%) - Completed Day 3
✅ PLANNING (100%) - Completed Day 6
✅ DESIGN (100%) - Completed Day 10
✅ ARCHITECTURE (100%) - Completed Day 13
🔄 BUILD (50%) - Sprints 1-5 complete, 5 remaining
⏳ REVIEW - Pending (Sprint 10)
⏳ TEST - Pending (Sprint 10)
⏳ RELEASE - Pending (Week 12)
⏳ AUDIT - Pending (Week 13)
⏳ OPTIMISE - Pending (Week 14+)

Gating Points:
✅ Business Viability - PASSED (30% token savings projected)
✅ Methodology Fit - PASSED (replicable pattern identified)
🔄 Success Definition - IN PROGRESS (3/5 metrics defined)

Skipped Phases:
- None (Feature project requires all phases)

Overrides:
- None

Tools Invoked This Sprint:
✅ /goal sprint 5 - Executed
✅ /execute-sprint-build 5 - In progress (token budget: 62K/80K used)
✅ /code-review - Auto-triggered on 7 PRs
✓ /memory - Auto-save on Sprint 5 end

Next Gate: Sprint 10 completion → Proceed to REVIEW phase
```

---

## Company-Wide Commitment

This methodology is **not optional**. It's the AISP standard for all projects.

**By following this 11-phase workflow:**
- ✅ We prove that autonomous agencies can operate systematically
- ✅ We ensure consistency and replicability across projects
- ✅ We capture learnings that improve future projects
- ✅ We protect reputation (quality gates enforced)
- ✅ We measure success objectively (metrics tied to phases)

**Exceptions require justification and CEO/Director sign-off.**

---

## Related Documents

- **AISP_MISSION_AND_CHARTER.md** — Why this methodology exists
- **INTEGRATED_PROJECT_INITIATION_WORKFLOW.md** — How to start projects (Phases 1-3)
- **AISP_SKILLS_INVENTORY.html** — Detailed tool documentation
- **PROJECT_INITIALIZATION_GUIDE.html** — User guide to project setup
- **_company_templates/.env.default** — Default environment variables (referenced here)

---

**Status:** Effective June 20, 2026  
**Review Cycle:** Every Wave completion (every 30 sprints)  
**Approval:** Brandon (CEO)

This is the AISP operating system. Every project, every team, every decision flows through this methodology.
