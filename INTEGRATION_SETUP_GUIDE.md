# AISP Integration Setup Guide

**Version:** 1.0 | **Date:** June 20, 2026 | **Status:** Configuration Reference

> **Goal:** Master configuration file for all integrations. Set up once, use everywhere. No repetitive API key entry.

---

## Current Integration Status

| Integration | Status | Action Required |
|-------------|--------|-----------------|
| **GitHub (gh CLI)** | ⚠️ Unknown | [Verify Authentication](#github-verification) |
| **Vercel** | ⚠️ May Exist | [Verify Configuration](#vercel-verification) |
| **Anthropic Claude API** | ❌ Missing | [Add API Key](#anthropic-api-setup) |
| **Slack** | ❌ Not Configured | [Optional: Add Later](#slack-optional) |
| **Linear** | ❌ Not Configured | [Optional: Add Later](#linear-optional) |
| **Monitoring (Datadog/Sentry)** | ❌ Not Configured | [Optional: Add Later](#monitoring-optional) |

---

## Integration Configuration Architecture

```
Master Config File (.env.integrations)
├─ GitHub Auth (gh CLI token)
├─ Vercel Token (production deployments)
├─ Anthropic API Key (managed agents)
├─ Slack Token (notifications, optional)
└─ Linear API Key (task tracking, optional)

↓ (Sourced at)

Project .env Files
├─ Each project inherits integrations
├─ Can override per project
└─ Never commit (add to .gitignore)

↓ (Smart Routing uses)

Environment Variables
├─ GITHUB_TOKEN → gh CLI
├─ VERCEL_TOKEN → vercel CLI + Vercel API
├─ ANTHROPIC_API_KEY → Claude API
├─ SLACK_BOT_TOKEN → Slack API
└─ LINEAR_API_KEY → Linear API

↓ (Auto-injected into)

CLI Commands & Skills
├─ /launch-your-project (uses GITHUB_TOKEN + VERCEL_TOKEN)
├─ /launch-your-agent (uses ANTHROPIC_API_KEY)
├─ /code-review (uses ANTHROPIC_API_KEY)
├─ /ultrareview (uses ANTHROPIC_API_KEY)
├─ /goal (uses ANTHROPIC_API_KEY)
├─ /execute-sprint-build (uses all tokens)
└─ Notifications (uses SLACK_BOT_TOKEN)
```

---

## Step 1: GitHub Authentication Verification

### **Check if gh CLI is authenticated:**

```bash
# Run this command to verify:
gh auth status

# Expected output:
# ✓ Logged in to github.com as [YOUR_USERNAME] (HTTPS)
# ✓ Token: gho_xxxxxxxxxxxxx...
# ✓ Token scopes: admin:org_hook, admin:repo_hook, admin:public_key, delete_repo, gist, read:discussion, read:packages, repo, user, workflow
```

### **If NOT authenticated:**

```bash
# Run this to authenticate:
gh auth login

# Follow prompts:
# 1. Where do you want to log in? → github.com
# 2. What is your preferred protocol for Git operations? → HTTPS
# 3. Authenticate Git with your GitHub credentials? → Y
# 4. How would you like to authenticate GitHub CLI? → Login with a web browser

# Browser will open. Grant access.
```

### **After authentication, store in environment:**

```bash
# Get your token:
GITHUB_TOKEN=$(gh auth token)

# Add to ~/.zshrc or ~/.bashrc:
export GITHUB_TOKEN=$(gh auth token)

# Or store in ~/.env.integrations (created next)
```

---

## Step 2: Vercel Configuration Verification

### **Check if Vercel CLI is authenticated:**

```bash
# Run this command:
vercel whoami

# Expected output:
# [your-username]
# Associated team: [your-team-name]
```

### **If NOT authenticated OR you need to verify token:**

```bash
# Authenticate Vercel:
vercel login

# Browser opens, follow prompts to connect GitHub account
```

### **Get/Store Vercel Token:**

**Option A: Use existing authentication (recommended)**
```bash
# Vercel stores token in: ~/.vercel/auth.json
# No action needed if `vercel whoami` works

# To verify it's working for our projects:
vercel ls
# Should list your projects
```

**Option B: Create a new token for AISP projects**

1. Go to **Vercel Dashboard:** https://vercel.com/account/tokens
2. Click **Create Token**
3. Name it: `AISP_GITHUB_ACTIONS` (for CI/CD)
4. Scope: **Full Access**
5. Copy token, store in `.env.integrations`

### **Store Vercel token:**

```bash
# Add to ~/.env.integrations:
export VERCEL_TOKEN=your_token_here
```

---

## Step 3: Anthropic Claude API Setup

### **Get your Anthropic API Key:**

1. **Visit:** https://console.anthropic.com/
2. **Log in** with your Anthropic account (or create one)
3. Click **API Keys** in left sidebar
4. Click **Create Key**
5. Name it: `AISP_DEPLOYMENT`
6. **Copy the key immediately** (only shown once)

### **Store securely:**

**Option A: macOS Keychain (Recommended)**
```bash
# Store in Keychain:
security add-generic-password \
  -a "anthropic-api-key" \
  -s "AISP_ANTHROPIC_API_KEY" \
  -w "sk-ant-xxxxxxxxxxxxxx"

# Retrieve when needed:
security find-generic-password \
  -a "anthropic-api-key" \
  -s "AISP_ANTHROPIC_API_KEY" \
  -w
```

**Option B: Environment file (.env.integrations)**
```bash
# Add to ~/.env.integrations:
export ANTHROPIC_API_KEY="sk-ant-xxxxxxxxxxxxxx"

# Add ~/.env.integrations to ~/.gitignore (local only)
echo "~/.env.integrations" >> ~/.gitignore
```

**Option C: Claude Code Settings (Built-in)**

Claude Code has settings at `~/.claude/settings.json`:
```bash
# Edit settings:
nano ~/.claude/settings.json

# Add:
{
  "ANTHROPIC_API_KEY": "sk-ant-xxxxxxxxxxxxxx"
}
```

---

## Step 4: Create Master Integration Config File

### **Create ~/.env.integrations**

```bash
# Create the file:
touch ~/.env.integrations

# Add permissions (so only you can read):
chmod 600 ~/.env.integrations

# Edit and add all tokens:
nano ~/.env.integrations
```

### **Contents of ~/.env.integrations:**

```bash
# ============================================================================
# MASTER INTEGRATION CONFIGURATION
# DO NOT COMMIT THIS FILE
# Add to ~/.gitignore
# ============================================================================

# GitHub (gh CLI)
export GITHUB_TOKEN=$(gh auth token)
# Alternative (if gh doesn't work):
# export GITHUB_TOKEN="ghp_xxxxxxxxxxxxx"

# Vercel
export VERCEL_TOKEN="vercel_xxxxxxxxxxxxx"
# Or leave blank to use ~/.vercel/auth.json

# Anthropic Claude API (REQUIRED for managed agents)
export ANTHROPIC_API_KEY="sk-ant-xxxxxxxxxxxxx"

# Slack (Optional, add later if needed)
# export SLACK_BOT_TOKEN="xoxb-xxxxxxxxxxxxx"
# export SLACK_SIGNING_SECRET="xxxxxxxxxxxxxxxx"

# Linear (Optional, add later if needed)
# export LINEAR_API_KEY="lin_xxxxxxxxxxxxx"

# ============================================================================
# Feature Flags (Control which integrations are active)
# ============================================================================

# Auto-load integrations on session start?
AUTO_LOAD_INTEGRATIONS=true

# Which integrations are enabled?
INTEGRATION_GITHUB=true
INTEGRATION_VERCEL=true
INTEGRATION_ANTHROPIC=true
INTEGRATION_SLACK=false      # Set to true when Slack is ready
INTEGRATION_LINEAR=false     # Set to true when Linear is ready

# Fallback behavior if token missing?
FALLBACK_ON_MISSING_TOKEN=warn  # Options: warn | skip | error

# ============================================================================
# Routing (Smart routing for skill invocation)
# ============================================================================

# Auto-detect best integration for each operation?
SMART_ROUTING_ENABLED=true

# Default integrations for each operation:
ROUTE_VERSION_CONTROL=github
ROUTE_DEPLOYMENT=vercel
ROUTE_AI_EXECUTION=anthropic
ROUTE_NOTIFICATIONS=slack       # Fallback: log to console if slack disabled
ROUTE_TASK_TRACKING=linear      # Fallback: ignore if linear disabled
```

### **Load integrations on session start:**

Add to **~/.zshrc** or **~/.bashrc**:

```bash
# Load AISP integrations
if [ -f ~/.env.integrations ]; then
  set -a
  source ~/.env.integrations
  set +a
fi

# Verify integrations
if [ "$AUTO_LOAD_INTEGRATIONS" = "true" ]; then
  echo "✓ AISP integrations loaded"
fi
```

Then reload shell:
```bash
source ~/.zshrc
# or
source ~/.bashrc
```

---

## Step 5: Integration Verification Script

Create **./scripts/verify-integrations.sh**:

```bash
#!/bin/bash

echo "🔍 Verifying AISP Integrations..."
echo ""

# GitHub
echo "▸ GitHub (gh CLI)..."
if gh auth status > /dev/null 2>&1; then
  echo "  ✅ GitHub authenticated as: $(gh api user -q '.login')"
else
  echo "  ❌ GitHub NOT authenticated. Run: gh auth login"
fi

# Vercel
echo ""
echo "▸ Vercel..."
if vercel whoami > /dev/null 2>&1; then
  echo "  ✅ Vercel authenticated as: $(vercel whoami)"
else
  echo "  ❌ Vercel NOT authenticated. Run: vercel login"
fi

# Anthropic API Key
echo ""
echo "▸ Anthropic Claude API..."
if [ -z "$ANTHROPIC_API_KEY" ]; then
  echo "  ❌ ANTHROPIC_API_KEY not set"
  echo "  📝 Set it: export ANTHROPIC_API_KEY='sk-ant-xxxxx'"
else
  echo "  ✅ ANTHROPIC_API_KEY is set (length: ${#ANTHROPIC_API_KEY})"
fi

# Slack (optional)
echo ""
echo "▸ Slack (optional)..."
if [ "$INTEGRATION_SLACK" = "true" ]; then
  if [ -z "$SLACK_BOT_TOKEN" ]; then
    echo "  ⚠️  Slack enabled but token not set"
  else
    echo "  ✅ Slack token is set"
  fi
else
  echo "  ⊘ Slack not enabled (optional)"
fi

# Linear (optional)
echo ""
echo "▸ Linear (optional)..."
if [ "$INTEGRATION_LINEAR" = "true" ]; then
  if [ -z "$LINEAR_API_KEY" ]; then
    echo "  ⚠️  Linear enabled but token not set"
  else
    echo "  ✅ Linear API key is set"
  fi
else
  echo "  ⊘ Linear not enabled (optional)"
fi

echo ""
echo "✅ Integration verification complete"
```

Run it:
```bash
chmod +x ./scripts/verify-integrations.sh
./scripts/verify-integrations.sh
```

---

## Step 6: Smart Routing Configuration

Create **AISP_INTEGRATION_ROUTING.md**:

This file defines how skills auto-route to the correct integration.

### **Smart Routing Rules**

When a skill is invoked (e.g., `/launch-your-project`), the system:

1. **Detects the operation type** (project init, deployment, code review, etc.)
2. **Checks which integrations are available** (GitHub? Vercel? etc.)
3. **Routes to the best integration** (primary > fallback > manual)
4. **Auto-injects credentials** (from environment variables)

### **Routing Examples**

**Operation: /launch-your-project**
```
Requires: GitHub (repo creation) + Vercel (deployment setup)
├─ Check: INTEGRATION_GITHUB = true?
│  └─ Use: GITHUB_TOKEN → gh repo create
├─ Check: INTEGRATION_VERCEL = true?
│  └─ Use: VERCEL_TOKEN → vercel project setup
└─ If either missing:
   └─ Warn: "GitHub/Vercel token missing. Manual setup required."
```

**Operation: /execute-sprint-build**
```
Requires: Anthropic API (autonomous execution)
├─ Check: INTEGRATION_ANTHROPIC = true?
│  └─ Use: ANTHROPIC_API_KEY → Claude API calls
├─ Check: INTEGRATION_GITHUB = true? (for PR + commits)
│  └─ Use: GITHUB_TOKEN → gh pr create/comment
├─ Check: INTEGRATION_VERCEL = true? (for staging deploy)
│  └─ Use: VERCEL_TOKEN → Vercel deploy
└─ Notifications:
   ├─ If INTEGRATION_SLACK = true: Send to Slack
   └─ Else: Log to console
```

**Operation: /code-review**
```
Requires: Anthropic API (code review engine)
├─ Check: INTEGRATION_ANTHROPIC = true?
│  └─ Use: ANTHROPIC_API_KEY → Claude API
└─ Auto-invoked on: GitHub PR creation (requires GITHUB_TOKEN)
```

**Operation: /ultrareview**
```
Requires: Anthropic API (multi-agent review)
├─ Check: INTEGRATION_ANTHROPIC = true?
│  └─ Use: ANTHROPIC_API_KEY → Claude API (with full cache context)
└─ Triggered before: Production deployment via Vercel
```

---

## Step 7: Credential Injection in Projects

Each project automatically inherits integrations via:

### **Project .env File**

When `/launch-your-project` runs:

```bash
# .env (project-specific overrides)
PROJECT_NAME=AISP-ProjectAlpha

# Inherited from ~/.env.integrations (do NOT repeat here):
# GITHUB_TOKEN=... (auto-inherited)
# VERCEL_TOKEN=... (auto-inherited)
# ANTHROPIC_API_KEY=... (auto-inherited)

# Can override if needed for this specific project:
# GITHUB_ORG=AISP-Company  (override org)
# VERCEL_TEAM=my-team      (override team)
```

### **CI/CD (GitHub Actions)**

Credentials are injected via GitHub Secrets:

```bash
# In .github/workflows/deploy.yml:

env:
  GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}      # Org-level secret
  VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}      # Org-level secret
  ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}  # Org-level secret

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: npm install
      - run: npm run build
      - run: vercel --token ${{ env.VERCEL_TOKEN }} --prod
```

To set GitHub Secrets:
```bash
# Method 1: CLI
gh secret set ANTHROPIC_API_KEY --body "sk-ant-xxxxx" --org AISP-Company
gh secret set VERCEL_TOKEN --body "vercel_xxxxx" --org AISP-Company

# Method 2: Web UI
# Go to: https://github.com/AISP-Company/settings/secrets/actions
# Click "New organization secret"
# Add each token
```

---

## Step 8: Optional Integrations (Add Later)

### **Slack Integration** (Optional)

Enables phase notifications, gate alerts, deployment notifications.

1. Create Slack app: https://api.slack.com/apps
2. Get Bot Token from **OAuth & Permissions**
3. Add to `.env.integrations`:
   ```bash
   export SLACK_BOT_TOKEN="xoxb-xxxxxxxxxxxxx"
   export INTEGRATION_SLACK=true
   ```

### **Linear Integration** (Optional)

Enables sprint tracking, automatic issue creation, PR linking.

1. Get API key: https://linear.app/settings/api
2. Add to `.env.integrations`:
   ```bash
   export LINEAR_API_KEY="lin_xxxxxxxxxxxxx"
   export INTEGRATION_LINEAR=true
   ```

---

## Step 9: Testing Integration Setup

Run verification script:
```bash
./scripts/verify-integrations.sh
```

Expected output:
```
🔍 Verifying AISP Integrations...

▸ GitHub (gh CLI)...
  ✅ GitHub authenticated as: brandondienar

▸ Vercel...
  ✅ Vercel authenticated as: brandondienar

▸ Anthropic Claude API...
  ✅ ANTHROPIC_API_KEY is set (length: 42)

▸ Slack (optional)...
  ⊘ Slack not enabled (optional)

▸ Linear (optional)...
  ⊘ Linear not enabled (optional)

✅ Integration verification complete
```

If any ❌, refer to the step above to fix.

---

## Integration Auto-Detection Logic

When a skill is invoked:

```
1. Check ~/.env.integrations exists
   └─ If no: Warn user to run setup
2. Source ~/.env.integrations
   └─ All credentials loaded into environment
3. For each required integration:
   ├─ Check: INTEGRATION_[NAME] = true?
   ├─ Check: Corresponding token/key is set?
   └─ If missing:
      ├─ Option A (FALLBACK_ON_MISSING_TOKEN=warn): Warn + continue
      ├─ Option B (=skip): Skip that integration, use fallback
      └─ Option C (=error): Stop, error, ask for setup
4. Auto-inject credentials into CLI commands
   └─ Example: `gh repo create` uses $GITHUB_TOKEN automatically
5. Execute operation
   └─ All integrations available to the skill
```

---

## Summary: No Repetition Architecture

| Before | After |
|--------|-------|
| ❌ Every project setup asks for API keys | ✅ Keys stored once, used everywhere |
| ❌ Manual token injection per command | ✅ Auto-injected from environment |
| ❌ Credentials scattered across files | ✅ Master config at ~/.env.integrations |
| ❌ Repeating "set GITHUB_TOKEN, set VERCEL_TOKEN..." | ✅ One-time setup, then automatic |
| ❌ Different integration setup per project | ✅ All projects use same integration config |
| ❌ No way to verify all integrations work | ✅ verify-integrations.sh checks everything |

---

## Checklist: Complete Integration Setup

- [ ] **Step 1:** GitHub CLI authenticated (`gh auth status` works)
- [ ] **Step 2:** Vercel authenticated (`vercel whoami` works)
- [ ] **Step 3:** Anthropic API key obtained from https://console.anthropic.com/
- [ ] **Step 4:** Created ~/.env.integrations with all tokens
- [ ] **Step 5:** Added to ~/.zshrc/~/.bashrc to auto-load
- [ ] **Step 6:** Ran verify-integrations.sh, all ✅ green
- [ ] **Step 7:** Tested that `/launch-your-project` can create GitHub repos
- [ ] **Step 8:** (Optional) Slack integration added if needed
- [ ] **Step 9:** (Optional) Linear integration added if needed

---

## Next: Ready for Deployment

Once all steps complete, all integrations are:
- ✅ Verified and working
- ✅ Stored securely (not in git)
- ✅ Auto-loaded at session start
- ✅ Auto-injected into skill invocations
- ✅ Smart-routed to best integration
- ✅ No repetitive manual setup needed

**Result:** When `/launch-your-project` runs, GitHub, Vercel, and Anthropic integrations are already available. No asking for credentials. No searching for tokens. Fully automated.

---

**Status:** Ready for your review and credential setup

