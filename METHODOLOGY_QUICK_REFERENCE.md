# AISP Methodology Quick Reference

**Version:** 1.0 | **Status:** Company-Wide Standard | **Effective:** June 20, 2026

> **TL;DR:** Every AISP project follows an 11-phase workflow. Project type determines which phases are mandatory. Environment variables control enforcement. Gating points ensure quality.

---

## The 11-Phase Workflow (All Projects)

```
1. IDEA → 2. DISCOVERY → 3. PLANNING [GATE 1] → 4. DESIGN → 5. ARCHITECTURE [GATE 2]
    ↓          ↓            ↓             ↓              ↓
PROJECT_IDEA  VALIDATE    SCOPE          UX/DESIGN      TECH
FORMED        PROBLEM     APPROVED       COMPLETED      DESIGNED
                          [GATE 3]
                              ↓
6. BUILD → 7. REVIEW → 8. TEST → 9. RELEASE → 10. AUDIT → 11. OPTIMISE
  ↓          ↓           ↓         ↓            ↓          ↓
CODE       REVIEWED     TESTED    LIVE       MEASURED    IMPROVED
BUILT      APPROVED     VERIFIED  MONITORING  LEARNINGS   FEEDBACK
```

---

## Project Type Matrix

| Project Type | All Phases? | Skip Design? | Skip Arch? | Gates Active? | Typical Duration |
|--------------|-----------|-------------|-----------|---------------|-----------------|
| **Feature** | ✅ All 11 | ❌ No | ❌ No | ✅ All 3 gates | 8-12 weeks |
| **Bug** | ⚠️ 10/11 | ✅ Yes (technical fixes only) | ❌ No | ✅ Gates 1+2 | 1-3 weeks |
| **Maintenance** | ⚠️ 9/11 | ✅ Yes | ✅ Yes | ✅ Gate 1 only | 1-2 weeks |

---

## The 3 Gating Points (Non-Negotiable)

### **GATE 1: Business Viability** (End of PLANNING Phase)
**Question:** Can we deliver **30%+ faster or cheaper** than human teams?  
**Decision:** PASS → Proceed to DESIGN | FAIL → REJECT PROJECT  
**Applies To:** Feature, Bug, Maintenance (ALL project types)  
**Cannot Override:** NO (CEO approval only)

### **GATE 2: Methodology Fit** (End of ARCHITECTURE Phase)
**Question:** Is this aligned with AISP's playbook? Can success be **replicated**?  
**Decision:** PASS → Proceed to BUILD | FAIL → ITERATE (return to DESIGN)  
**Applies To:** Feature, Bug (Wave 1-2 only) | Maintenance N/A  
**Cannot Override:** NO (CEO approval only)

### **GATE 3: Success Definition** (Before BUILD Phase)
**Question:** Are success criteria **measurable and clear**?  
**Decision:** CONFIRMED → Proceed to BUILD | UNCLEAR → ITERATE (refine criteria)  
**Applies To:** Feature, Bug | Maintenance N/A  
**Cannot Override:** NO (must be explicit)

---

## Phase-to-Tool Mapping (What Gets Invoked)

| Phase | Tool/Skill | Auto-Invoked? | What It Does |
|-------|-----------|---------------|------------|
| PLANNING | `/goal wave [N]` | ✅ Auto | Define project goals + success criteria |
| PLANNING | `/launch-your-project` | ✅ Auto | Initialize project folder, GitHub, Vercel, Slack, Linear |
| ARCHITECTURE | `/plan` | ✅ Auto | Design technical architecture + validate replicability |
| BUILD (each sprint) | `/goal sprint [N]` | ✅ Auto | Define sprint objectives |
| BUILD (each sprint) | `/execute-sprint-build [N]` | ✅ Auto | Execute sprint automatically |
| BUILD (continuous) | `/code-review` | ✅ Auto | Review every PR (continuous feedback) |
| REVIEW (Sprint 10) | `/ultrareview` | ✅ Auto | Comprehensive multi-agent review (pre-production gate) |
| AUDIT | `/memory` | ✅ Auto | Save learnings + patterns + decisions |
| Session Start | `/memory` load | ✅ Auto | Load prior project context |

---

## Environment Variables: The Control Panel

### **Project Setup (Set During Init)**
```bash
PROJECT_NAME=AISP-ProjectName
PROJECT_TYPE=feature|bug|maintenance
PROJECT_OWNER=Anderson|Niobe|Persephone|Dozer
WAVE=1|2|3
```

### **Enforcement Level (Controls How Strict Methodology Is)**
```bash
PHASE_ENFORCEMENT=flexible  # warn/suggest but allow override with docs
GATE_BUSINESS_VIABILITY=true  # Always enforce, cannot skip
GATE_METHODOLOGY_FIT=true  # Enforce for Wave 1-2, skip for Wave 3+
GATE_SUCCESS_DEFINITION=true  # Always enforce
```

### **Autonomy & Execution (Controls Agent Behavior)**
```bash
AUTONOMY_LEVEL=90  # How autonomous agents can be (80/90/95%)
AGENT_LOOP_MAX_ITERATIONS=5  # Max iterations before escalating
TOKEN_BUDGET_PER_SPRINT=80000  # Cost control ($$ equivalent)
```

### **What Gets Measured (Success Metrics)**
```bash
MEASURE_TOKEN_EFFICIENCY=true  # 25-50% savings target
MEASURE_AUTONOMY_RATE=true  # <5% override rate target
MEASURE_TIME_SAVINGS=true  # Speed vs. human baseline
MEASURE_REPLICABILITY=true  # Can another team do this?
```

---

## How a Project Flows Through The Methodology

### **Week 1: IDEA + DISCOVERY + PLANNING**

```
Day 1: IDEA (brainstorm) → CEO approval to proceed
  └─ Question: Is this worth AISP's time?

Days 2-3: DISCOVERY (research) → Validate problem
  └─ Question: Is this problem real?

Days 4-6: PLANNING (scope) → Define success
  ├─ Tool: /goal wave [N] → Creates WAVE_N_PROJECT_[Name]_PLAN.md
  ├─ Tool: /launch-your-project → Creates folder, GitHub, Vercel, Slack
  └─ GATE 1 (Business Viability): 30%+ faster/cheaper? → PASS/FAIL
```

### **Week 2: DESIGN + ARCHITECTURE**

```
Days 7-10: DESIGN (UX) → Design specs
  └─ Manual work (Figma/design tool)
  └─ Can skip for Bug projects (override: "technical fix only")

Days 11-13: ARCHITECTURE (tech) → Tech design
  ├─ Tool: /plan → Creates DESIGN_PHASE_[ProjectName].md
  └─ GATE 2 (Methodology Fit): Replicable? → PASS/FAIL
  └─ GATE 3 (Success Definition): Criteria clear? → CONFIRM/ITERATE
```

### **Weeks 3-11: BUILD (Sprints 1-10)**

```
Sprint 1-9: Regular Build
  ├─ Day 1: /goal sprint [N] → Creates SPRINT_N_PLAN.md
  ├─ Days 2-9: /execute-sprint-build [N] → Auto-execute sprint
  ├─ Daily: /code-review (auto on every PR) → Feedback loop
  └─ Budget: Token budget tracked daily/sprint

Sprint 10: Build + Pre-Release Review
  ├─ Days 1-5: Final features + sprint 10 goals
  ├─ Days 6-9: /ultrareview → Comprehensive quality gate
  └─ READY FOR RELEASE? → PASS/FAIL
```

### **Week 12: RELEASE**

```
Day 1: Deploy to production
  ├─ Tool: Vercel (auto-deploy on GitHub merge)
  ├─ Tool: GitHub Actions (CI/CD + smoke tests)
  └─ Live in production ✅
```

### **Week 13: AUDIT**

```
Days 1-5: Post-release metrics + learnings
  ├─ Tool: /memory → Auto-save learnings (patterns, decisions)
  ├─ Manual: Measure success against criteria
  ├─ Manual: Review incidents (if any)
  └─ Output: Audit report (success? learnings? replicability proof?)
```

### **Week 14+: OPTIMISE**

```
Ongoing: Improvements + pattern sharing
  ├─ Manual: Prioritize optimization work
  ├─ Tool: /memory → Update shared pattern library
  └─ Document: Add learnings to company methodology
```

---

## Skipping Phases: The Override System

### **Can You Skip a Phase?**

**GATE Phases (CANNOT skip):**
- ❌ GATE 1 (Business Viability, end of PLANNING)
- ❌ GATE 2 (Methodology Fit, end of ARCHITECTURE)
- ❌ GATE 3 (Success Definition, before BUILD)

**Conditional Phases (Can skip with override):**

| Phase | Feature | Bug | Maintenance | Override Process |
|-------|---------|-----|------------|-----------------|
| DESIGN | ❌ No | ⚠️ Can skip | ⚠️ Can skip | Provide 1-liner: "Technical fix only" |
| ARCHITECTURE | ❌ No | ❌ No | ⚠️ Can skip | Provide 1-liner: "Internal refactor" |

**Override Process:**
1. User attempts to skip a phase
2. System prompts: "Reason for skipping [PHASE]?"
3. User provides justification (e.g., "Bug fix, no design change needed")
4. System logs in audit trail: `OVERRIDE_SKIP_DESIGN_BUG_FIX_20260620.log`
5. System warns: "Proceeding without DESIGN. Phase skipped with override: [reason]"
6. Proceed to next phase

---

## Success Metrics: How We Know It's Working

### **Quantitative (Measurable)**
- ✅ **Token Efficiency:** 25-50% savings vs. manual baseline (measure in AUDIT phase)
- ✅ **Autonomy Rate:** <5% human override rate (measure in BUILD phase)
- ✅ **Time Savings:** Deploy 30%+ faster than human consultants (measure in RELEASE phase)
- ✅ **First-Try Success:** >95% goals met without iteration (measure in AUDIT phase)

### **Qualitative (Observable)**
- ✅ **Agent Judgment:** Reviewers trust agent decisions (low override rate)
- ✅ **Replicability:** Another team can execute this project with our playbook
- ✅ **Learning Capture:** New patterns documented + shared with future projects
- ✅ **Reputation:** Zero production incidents caused by autonomous agent errors

---

## Enforcement: What Happens at Each Gate

```
GATE 1 (Business Viability):
├─ PASS (30%+ savings achievable)
│  └─ ✅ Proceed to DESIGN
└─ FAIL (Cannot hit 30% savings)
   └─ ❌ REJECT PROJECT (document decision, archive)

GATE 2 (Methodology Fit):
├─ PASS (Project is replicable, uses known patterns)
│  └─ ✅ Proceed to BUILD
├─ FAIL (Project is one-off, custom architecture needed)
│  └─ ⚠️ ITERATE (return to DESIGN, simplify architecture)
└─ After 2 iterations still failing?
   └─ ❌ ESCALATE to CEO (is this worth the custom work?)

GATE 3 (Success Definition):
├─ CLEAR (Success criteria are measurable, objective)
│  └─ ✅ Proceed to BUILD
└─ UNCLEAR (Success criteria are vague, subjective)
   └─ ⚠️ ITERATE (refine criteria, make objective)
```

---

## Compliance Dashboard: Real-Time Status

Every project shows:
```
✅ IDEA - Complete
✅ DISCOVERY - Complete
✅ PLANNING - Complete [GATE 1 PASSED]
✅ DESIGN - Complete
✅ ARCHITECTURE - Complete [GATE 2 PASSED]
🔄 BUILD - In Progress (Sprints 1-5 of 10 complete)
⏳ REVIEW - Pending
⏳ TEST - Pending
⏳ RELEASE - Pending
⏳ AUDIT - Pending
⏳ OPTIMISE - Pending

Token Budget: 62K / 80K used
Autonomy Rate: 92% (agent decisions, 8% escalations)
Overrides: 0
Next Gate: Sprint 10 completion
```

---

## The Methodology in One Sentence

> **Every AISP project flows through 11 phases, gated at 3 critical points, with project type determining which phases are mandatory, environment variables controlling enforcement, and all decisions logged for audit and learning.**

---

## Quick Start: Creating a New Project

```bash
# Step 1: Project Pitch (manual, CEO)
Your idea → CEO says yes/no (IDEA phase)

# Step 2: Initiate Project (automated)
/launch-your-project
  ├─ Questionnaire (5 min)
  ├─ /goal wave [N] (set goals)
  ├─ /launch-your-project (init infrastructure)
  └─ Output: Project ready with all folders, repos, tools configured

# Step 3: Start Build (automated per sprint)
/goal sprint 1
/execute-sprint-build 1
  ├─ Auto-runs all sprint tasks
  ├─ /code-review on every PR
  ├─ Tests run automatically
  └─ Reports at sprint end

# Step 4: Release (automated)
Merge to main branch
  ├─ GitHub Actions → Run tests
  ├─ Vercel → Deploy to production
  └─ Auto-live

# Step 5: Audit (automated)
Sprint ends
  ├─ /memory → Auto-save learnings
  ├─ Metrics collection
  └─ Report: Did we meet success criteria?
```

---

## Real-World Examples

### **Example 1: Feature Project (All 11 Phases)**
**Project:** "Add user authentication system"  
**PROJECT_TYPE=feature**

| Phase | Duration | Auto? | Notes |
|-------|----------|-------|-------|
| IDEA | 1 day | ❌ | CEO approval |
| DISCOVERY | 2 days | ❌ | Research auth patterns |
| PLANNING | 3 days | ✅ | /goal + /launch-project |
| DESIGN | 4 days | ❌ | Design login flows |
| ARCHITECTURE | 3 days | ✅ | /plan (tech design) |
| BUILD | 8 weeks | ✅ | Sprints 1-10 |
| REVIEW | 2 days | ✅ | /code-review + /ultrareview |
| TEST | 3 days | ✅ | GitHub Actions |
| RELEASE | 1 day | ✅ | Vercel deploy |
| AUDIT | 3 days | ✅ | /memory save |
| OPTIMISE | 2 weeks | ❌ | Refinements |
| **Total** | **~12 weeks** | | All 3 gates enforced |

---

### **Example 2: Bug Fix (10 Phases, No Design)**
**Project:** "Fix user login timeout"  
**PROJECT_TYPE=bug**

| Phase | Duration | Auto? | Notes |
|-------|----------|-------|-------|
| IDEA | ½ day | ❌ | Reported + assigned |
| DISCOVERY | 1 day | ❌ | Diagnose root cause |
| PLANNING | 1 day | ✅ | Quick scope |
| DESIGN | ❌ SKIP | — | Override: "technical fix" |
| ARCHITECTURE | 1 day | ✅ | Minimal design |
| BUILD | 2 days | ✅ | Code fix |
| REVIEW | 1 day | ✅ | PR review |
| TEST | 1 day | ✅ | Regression tests |
| RELEASE | ½ day | ✅ | Deploy |
| AUDIT | 1 day | ✅ | Verify fix |
| OPTIMISE | ❌ N/A | — | Not needed |
| **Total** | **~1 week** | | Gates 1+2 |

---

### **Example 3: Maintenance (9 Phases, No Design/Arch)**
**Project:** "Upgrade Node.js v18 → v20"  
**PROJECT_TYPE=maintenance**

| Phase | Duration | Auto? | Notes |
|-------|----------|-------|-------|
| IDEA | ½ day | ❌ | Planned upgrade |
| DISCOVERY | ½ day | ❌ | Check compatibility |
| PLANNING | ½ day | ✅ | Quick scope |
| DESIGN | ❌ SKIP | — | Override: "internal only" |
| ARCHITECTURE | ❌ SKIP | — | Override: "internal only" |
| BUILD | 3 days | ✅ | Upgrade + test |
| REVIEW | 1 day | ✅ | Code review |
| TEST | 1 day | ✅ | Regression tests |
| RELEASE | ½ day | ✅ | Deploy |
| AUDIT | ½ day | ✅ | Verify stability |
| OPTIMISE | ❌ N/A | — | Not needed |
| **Total** | **~1 week** | | Gate 1 only |

---

## Key Takeaways

1. **One Workflow:** All projects use the same 11-phase structure
2. **Three Gates:** Non-negotiable quality checkpoints (business, methodology, success)
3. **Flexible Enforcement:** Phases can be skipped with documented override (except gates)
4. **Project Types:** Feature/Bug/Maintenance have different mandatory phases
5. **Automated:** Tools auto-invoke at each phase (when configured)
6. **Measured:** Success is quantified at every stage
7. **Documented:** Audit trail logs all decisions for learning

---

## Related Documents

- **COMPANY_DEVELOPMENT_METHODOLOGY.md** — Full 11-phase details
- **.env.company.default** — All environment variables
- **INTEGRATED_PROJECT_INITIATION_WORKFLOW.md** — How to start projects
- **AISP_MISSION_AND_CHARTER.md** — Why this methodology exists

---

**This is the AISP operating system. Every project, every decision, every metric flows through this framework.**

