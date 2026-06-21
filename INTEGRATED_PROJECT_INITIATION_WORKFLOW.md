# Integrated Project Initiation Workflow

**Version:** 1.0  
**Date:** June 20, 2026  
**Purpose:** Complete workflow for launching a new project aligned with AISP mission  
**Tools Used:** All 8 skills working in orchestration

---

## The Complete Flow: From Idea to Executing Sprint 1

```
PHASE 1: PROJECT PITCH & GATING
└─ Business Viability Check (30 min)
   └─ → Proceed to Phase 2 OR Reject

PHASE 2: METHODOLOGY FIT & DESIGN
└─ Detailed Assessment (1-2 hours)
   └─ /plan (architecture) → /goal (wave planning) → → Approve OR Iterate

PHASE 3: PROJECT INITIALIZATION
└─ Infrastructure Setup (15 min)
   └─ /launch-your-project (auto-generate everything)
   └─ Git, GitHub, Vercel, Slack, Linear, folders all created

PHASE 4: TEAM PREPARATION
└─ Agent Setup (if needed) (10-30 min per agent)
   └─ /launch-your-agent (deploy managed agents)

PHASE 5: PLANNING & EXECUTION
└─ Build Phase 1 Planning (2 hours)
   └─ /goal (build phase goals) → Sprint planning
   └─ /execute-sprint-build (automated execution)

PHASE 6: LEARNING & ITERATION
└─ Continuous
   └─ /memory (capture learnings)
   └─ /code-review (quality gates)
   └─ /ultrareview (pre-deployment)
```

---

## PHASE 1: Project Pitch & Business Viability Check (30 min)

**Who:** CEO (you) + Project proposer (could be director, external client, or internal initiative)

**Decision:** Does this project pass business viability?

### **Gating Question:**
> Can we deliver 30%+ faster or cheaper than human teams on this work?

### **Evaluation Criteria:**

| Criterion | Assessment | Required? |
|-----------|-----------|-----------|
| **Cost Savings** | Will autonomous execution save >30% on labor/time? | YES |
| **Deliverable Clarity** | Can we define success objectively? | YES |
| **Team Fit** | Do we have agents/skills to handle this domain? | YES (or can we learn?) |
| **Timeline Feasibility** | Can we deliver within Wave X bounds? | YES |
| **Reputation Risk** | Would failure damage AISP's reputation? | ASSESS |

### **Outputs:**
- ✓ **APPROVED → Proceed to Phase 2**
- ✗ **REJECTED → Document decision, archive for future**

---

## PHASE 2: Methodology Fit & Detailed Design (1-2 hours)

**Who:** CEO + CTO/CPO (relevant director) + Coordinator (if cross-functional)

**Decision:** Is this project aligned with AISP's autonomous playbook? Can success be replicated?

### **Sub-Phase 2A: Architecture & Design Planning (~45 min)**

**Skill:** `/plan`

```bash
/plan

Prompts:
1. What's the high-level architecture? (tech stack, services, integrations)
2. Where will agents make autonomous decisions? (key decision points)
3. What could go wrong? (failure modes, safeguards needed)
4. How is this replicable? (what's specific vs. general?)
5. What existing playbook patterns apply? (reference prior projects)

Output: DESIGN_PHASE_[ProjectName].md
```

**Decision Point:** Is this design aligned with AISP's replicability value?
- ✓ YES → Proceed to Sub-Phase 2B
- ✗ NO → Iterate (challenge the design, simplify, etc.)

### **Sub-Phase 2B: Goal Definition & Approval (~45 min)**

**Skill:** `/goal wave [N]` (high-level)

```bash
/goal wave [N]

Prompts:
1. What's the ultimate goal for this project? (business outcome)
2. How does this serve AISP's mission? (playbook improvement + financial return)
3. What's the 30-sprint vision? (Wave assignment)
4. What are success criteria? (both business + learning metrics)
5. What will we learn if we succeed/fail? (knowledge gain)

Output: WAVE_[N]_PROJECT_[Name]_PLAN.md
```

### **Outputs from Phase 2:**
- ✓ `DESIGN_PHASE_[ProjectName].md` (architecture + replicability assessment)
- ✓ `WAVE_[N]_PROJECT_[Name]_PLAN.md` (30-sprint vision + success criteria)
- ✓ **APPROVED → Proceed to Phase 3**

---

## PHASE 3: Project Initialization (~15 min)

**Who:** You (CEO) OR delegated to coordinator

**Automation Level:** Fully automated (skill does all the setup)

**Skill:** `/launch-your-project`

```bash
/launch-your-project

Questionnaire (~5 min):
1. Project name? (→ AISP-ProjectName)
2. Project description?
3. Launch goal (success metrics)?
4. Project owner (director)?
5. Team size / composition?
6. Tech stack?
7. Autonomy level (80/90/95%)?
8. Wave assignment?
9. Escalation triggers?
10. Success criteria?
11. Create Slack channels? (default: yes)
12. Create Linear project? (default: yes)
13. Deploy initial agents? (default: no, added in Phase 4)

Auto-Generation (~10 min):
✓ Folder structure: AISP/projects/AISP-[ProjectName]/
✓ Symlinks: _standards/ → _shared_resources/
✓ Config files: .env, smart_toolkit_config.json, agent_config.json
✓ Git init + initial commit + push to GitHub
✓ GitHub repo created: AISP-Company/aisp-[project-name]
✓ Vercel projects created: prod + staging (auto-deploy)
✓ Slack channels created: #aisp-[project-name]-dev, -deployments, -alerts
✓ Linear project created: AISP-[PROJECTNAME]
✓ Memory files initialized: toolkit_memory.json, agent_memory.json
✓ Documentation templates: WAVE, BUILD_PHASE, SPRINT plans
✓ GitHub workflows: CI/CD templates (.github/workflows/)

Output:
✓ Project folder ready to code in
✓ GitHub repo linked and pushed
✓ Vercel live (empty app deployed)
✓ Slack + Linear connected and populated
✓ All docs created and accessible
```

**Project is now ready. Everything is initialized and connected.**

---

## PHASE 4: Team Preparation & Agent Deployment (Conditional, 10-30 min per agent)

**Who:** Project owner (director) OR CEO

**When:** If project requires managed agents (Neo, Ghost, Tank, etc.)

**Skill:** `/launch-your-agent`

```bash
/launch-your-agent

For each managed agent:

Questionnaire (~5 min):
1. Agent name? (Neo, Ghost, Tank, custom?)
2. Agent goal? (what task, success criteria?)
3. Agent inputs? (what data does it consume?)
4. Agent outputs? (reports, decisions, escalations?)
5. Agent schedule? (daily, weekly, on-demand?)
6. Memory enabled? (yes → agent learns over time)

Deployment (~5 min):
✓ Agent spec generated
✓ Memory file initialized
✓ Cloud deployment to Anthropic
✓ Schedule configured
✓ Ready to run

Output: Agent operational, scheduled, memory tracking
```

**Decision:** Deploy now or wait for first sprint?
- **Immediately** if agent is critical path
- **First sprint** if setup task (agents learn better as project progresses)

---

## PHASE 5: Planning & Execution (~2 hours)

**Who:** Project owner (director) + team

**Skills:** `/goal` (build phase) → `/execute-sprint-build` (execution)

### **Sub-Phase 5A: Build Phase 1 Planning (~1 hour)**

**Skill:** `/goal build-phase 1.1`

```bash
/goal build-phase 1.1

Questionnaire (~15 min):
1. Build Phase name? (Foundation, Features, Polish, etc.)
2. What gets delivered in this phase? (3-5 deliverables)
3. Tech decisions? (frameworks, libraries, architecture)
4. Team capacity? (team size + availability)
5. Success criteria? (what's "done"?)

Output: BUILD_PHASE_1.1_PLAN.md with:
├─ Deliverables (what ships)
├─ Tech decisions (with rationale)
├─ 10 sprint breakdown (which sprint = which features)
├─ Acceptance criteria (how we know it's done)
└─ Risk mitigation (failure modes + safeguards)
```

### **Sub-Phase 5B: Sprint 1 Detailed Planning (~30 min)**

**Skill:** `/goal sprint 1`

```bash
/goal sprint 1

Questionnaire (~15 min):
1. Sprint name? (Sprint 1: [Feature/Task])
2. Specific features/tasks? (2-5 deliverables)
3. Team capacity? (hours available)
4. Success metrics? (tests pass, coverage, quality gates)
5. Blockers/dependencies? (what could stop us?)

Output: SPRINT_1_PLAN.md with:
├─ Sprint goal (one sentence)
├─ Tasks (owner, estimate, success criteria)
├─ Dependencies (what unblocks this sprint)
├─ Success metrics (how we know we won)
└─ Risk triggers (what would escalate)
```

### **Sub-Phase 5C: Sprint 1 Execution (~1 hour)**

**Skill:** `/execute-sprint-build 1`

```bash
/execute-sprint-build 1 /path/to/project

Automated Execution:
1. Parse SPRINT_1_PLAN.md
2. Load project memory (/memory auto-load)
3. Execute all tasks in parallel (within team capacity)
4. For each task:
   ├─ Plan approach
   ├─ Execute
   ├─ Verify against success criteria
   ├─ Iterate if needed (max 5 loops)
   └─ Escalate if stuck
5. Auto-trigger /code-review on PR creation
6. Commit to dev branch + push
7. Vercel auto-deploys to staging
8. Report: completed ✓, failed ✗, at risk ⚠️

Output:
✓ Sprint 1 code complete
✓ Tests passing
✓ Coverage >85%
✓ Zero critical bugs
✓ Deployed to staging (verifiable)
✓ Report: metrics, token burn, learnings
```

---

## PHASE 6: Learning & Iteration (Continuous)

**Skills:** `/memory` → `/code-review` → `/ultrareview` → `/plan` (iterate)

### **Continuous During Sprints:**

**Every Commit:**
- `/code-review` (auto-triggered on PR creation)
  - Linting, security, architecture checks
  - Feedback loop → agent learns

**Every Sprint End:**
- `/memory` (save sprint learnings)
  - What worked? What didn't?
  - Patterns to reuse? Patterns to avoid?
  - Team insights for next sprint

**Every Sprint 10 (Pre-Deployment):**
- `/ultrareview` (comprehensive review gate)
  - Multi-agent deep-dive review
  - Reputation protection gate
  - Only merge if quality ≥95%

**Between Build Phases:**
- `/plan` (assess design adjustments)
  - What did we learn about this project's domain?
  - Does the architecture still fit?
  - Iterate design if needed

---

## Timeline Summary

| Phase | Duration | Blocker? | Repeatable? |
|-------|----------|----------|------------|
| Phase 1: Business Viability | 30 min | YES (gate) | YES |
| Phase 2: Methodology Design | 1-2 hours | YES (gate) | YES (can be templated) |
| Phase 3: Project Initialization | 15 min | NO (automated) | YES (fully automated) |
| Phase 4: Agent Deployment | 10-30 min ea | NO (optional) | YES (fully automated) |
| Phase 5: Planning & Execution | 2 hours + sprint | NO | YES (repeats per sprint) |
| Phase 6: Learning | Continuous | NO | YES (auto-triggers) |
| **TOTAL TO FIRST SPRINT** | **~4-5 hours** | | |

---

## Decision Checkpoints

### **After Phase 1: Business Viability**
- ✓ Project passes business gate (30%+ faster/cheaper than humans)
- ✗ Reject project
- → **Proceed to Phase 2**

### **After Phase 2: Methodology Fit**
- ✓ Design is sound and replicable
- ✗ Iterate design or reject
- → **Proceed to Phase 3**

### **After Phase 3: Initialization**
- ✓ All infrastructure ready (code, GitHub, Vercel, Slack, Linear)
- → **Proceed to Phase 4**

### **After Phase 4: Agent Deployment (if applicable)**
- ✓ Agents deployed and scheduled
- ✗ Continue without agents, add later
- → **Proceed to Phase 5**

### **After Phase 5: Execution**
- ✓ Sprint 1 complete, tests passing, staged deployment live
- ✓ Ready for ongoing iteration
- → **Enter Phase 6 (continuous learning)**

---

## Quality Gates: When to Stop

**ABORT/ITERATE if:**
- [ ] Business viability not met (phase 1 gate)
- [ ] Design lacks replicability (phase 2 gate)
- [ ] Sprint 1 success criteria not met (phase 5 gate)
- [ ] Agent judgment is untrustworthy (phase 6, escalate immediately)
- [ ] Reputation risk discovered (any phase, escalate to CEO)

**NEVER COMPROMISE on:**
- Judgment (agents making good decisions)
- Replicability (success is repeatable pattern)
- Quality gates (pre-deployment review mandatory)

---

## Integration with AISP Mission

This workflow serves AISP's core mission by:

✓ **Business Viability Gate** → Only projects that prove AI-native agencies work (mission 1)

✓ **/plan + /goal** → Design projects to test/refine the playbook (mission 2)

✓ **/launch-your-project** → Repeatable initialization reinforces methodology (mission 3)

✓ **/launch-your-agent** → Agents improve over time, building organizational knowledge (mission 4)

✓ **/execute-sprint-build** → Proves autonomous execution works at scale (mission 4)

✓ **/code-review + /ultrareview** → Protects reputation + judges agent quality (mission 4)

✓ **/memory** → Captures learnings that improve future projects (mission 2)

---

## Metrics Tracked Throughout

**Business Metrics:**
- Delivered 30%+ faster than human baseline? ✓
- Cost savings vs. human team labor? ✓
- Project profitable or on budget? ✓

**Autonomous Metrics:**
- Agent decision quality (reviewer override rate) → target: <5%
- Escalation rate (human decisions needed) → target: <5%
- First-try success rate (goals met without iteration) → target: >95%

**Learning Metrics:**
- New patterns added to shared KB? ✓
- Time-to-competence improvement vs. prior project? ✓
- Playbook refinements discovered? ✓

---

## Related Documents

- **AISP_MISSION_AND_CHARTER.md** — Why this workflow exists + core values
- **AISP_SKILLS_INVENTORY.html** — Detailed documentation of each skill
- **PROJECT_INITIALIZATION_GUIDE.html** — User-facing guide for new projects
- **DEVELOPMENT_NOMENCLATURE_STANDARD.md** — Sprint/Build Phase/Wave structure
- **AISP_COMPANY_PLAYBOOK.html** — How to execute within this workflow

---

**Status:** Ready for implementation in Wave 1, Build Phase 1.1, Sprint 1

**Next:** Launch first project (AISP Portal) using this workflow
