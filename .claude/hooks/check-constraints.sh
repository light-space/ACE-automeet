#!/usr/bin/env bash
#
# PostToolUse guard for Write/Edit.
#
# Sirius runs its coding agent with permissionMode: 'bypassPermissions', so
# permission rules gate nothing. Hooks are the only lever that can stop the
# agent mid-run. This one re-reads whatever file was just written and fails it
# if the content violates a constraint that would otherwise only surface in
# review — by which point the PR is already wrong.
#
# Contract (verified against https://code.claude.com/docs/en/hooks.md):
#   stdin  — JSON; the written path is at .tool_input.file_path
#   exit 0 — accept
#   exit 2 — reject; stderr is fed back to the model, which then self-corrects.
#            (For PostToolUse exit 2 cannot un-run the tool, but the agent gets
#            the message and fixes the file on its next turn, which is the goal.)
#
# Checked here rather than in CI on purpose: a failing check inside the run is
# cheap to fix, and .sirius/config.yml deliberately declares no commands.check
# because a red one blocks the PR outright.

set -uo pipefail

payload=$(cat)

# Extract .tool_input.file_path without assuming jq exists in the sandbox.
extract_path() {
  if command -v jq >/dev/null 2>&1; then
    printf '%s' "$payload" | jq -r '.tool_input.file_path // empty'
  elif command -v python3 >/dev/null 2>&1; then
    printf '%s' "$payload" | python3 -c \
      'import json,sys; d=json.load(sys.stdin); print((d.get("tool_input") or {}).get("file_path") or "")' 2>/dev/null
  elif command -v node >/dev/null 2>&1; then
    printf '%s' "$payload" | node -e \
      'let s="";process.stdin.on("data",c=>s+=c).on("end",()=>{try{process.stdout.write((JSON.parse(s).tool_input||{}).file_path||"")}catch{}})' 2>/dev/null
  else
    printf ''
  fi
}

file_path=$(extract_path)

# Nothing to inspect — never block on our own inability to parse.
[ -z "$file_path" ] && exit 0
[ -f "$file_path" ] || exit 0

case "$file_path" in
  # The guard would flag its own rule text, and legacy/ is frozen Python.
  */.claude/hooks/*|*/legacy/*|*/CLAUDE.md|*/.sirius/config.yml) exit 0 ;;
esac

violations=""
add() { violations="${violations}  - $1"$'\n'; }

# Lines carrying the literal marker `guard-ok` are exempt.
#
# This exists because the files that DOCUMENT these constraints necessarily
# quote them — Callout.tsx explains the PO rule, tokens.ts spells out that
# `text-accent` must not exist — and a guard that flags its own documentation
# trains the agent to delete the documentation. The marker is deliberately
# ugly and greppable so its use is obvious in review:
#
#     git grep -n 'guard-ok'
#
# Use it ONLY on prose describing a rule, never to silence a real violation.
subject=$(grep -v 'guard-ok' "$file_path")

# 1. Microsoft Teams, never Slack.
if printf '%s' "$subject" | grep -Eiq '\bslack\b'; then
  add "Mentions Slack. This client runs on Microsoft Teams — use components/ui/TeamsCard.tsx. Remove every Slack reference, including in comments and example strings."
fi

# 2. No subscription management; Chargebee is out of scope.
if printf '%s' "$subject" | grep -Eiq '\bchargebee\b'; then
  add "Mentions Chargebee. Subscription management is out of scope for this engagement — remove it."
fi

# 3. Never emit a PO-block. Warn-and-acknowledge is fine; blocking is not.
#    Look for a purchase-order mention sitting next to blocking language.
if printf '%s' "$subject" | grep -Eiq 'purchase order|\bPO\b|po_?number|poNumber'; then
  if printf '%s' "$subject" | grep -Eiq 'block(ed|ing|s)?|cannot proceed|can not proceed|can.t proceed|prevent(ed|s|ing)?|disabled until|required before|must (be )?(provided|entered|supplied) before|halt(ed|s)?|reject(ed|s)?'; then
    add "Looks like a PO-block: this file mentions a purchase order alongside blocking language. Never block a quote on a missing PO. Warn and let the user acknowledge and proceed — use components/ui/Callout.tsx with tone=\"warning\"."
  fi
fi

# 4. #FF6105 must never be a text colour — it fails 4.5:1 on #FAFAF8.
# Matches CSS (`color: #FF6105`), JS style objects (`color: "#FF6105"`),
# `-webkit-text-fill-color`, the Tailwind arbitrary value, and the class that
# deliberately does not exist.
if printf '%s' "$subject" | grep -Eiq '(^|[^-a-z])(text-fill-)?color:[[:space:]]*["'"'"']?#FF6105|text-\[#FF6105\]|\btext-accent\b'; then
  add "Uses brand accent #FF6105 as a text colour (or the non-existent text-accent class). #FF6105 is fill-only. Accent text is #C64B03 — use text-accentText."
fi

if [ -n "$violations" ]; then
  {
    echo "Repo constraint violation in ${file_path}:"
    echo ""
    printf '%s' "$violations"
    echo "These are hard constraints from CLAUDE.md and .sirius/config.yml. Fix the file now."
  } >&2
  exit 2
fi

exit 0
