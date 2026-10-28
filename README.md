# Oracle Skills

This repository contains a small, file-based workflow for taking a GitHub issue through planning, implementation, and review. The skills live in [`.agents/skills/`](.agents/skills/) and store work for active changes in [`context/changes/`](context/changes/). Run `/oracle-init` only when the context folders have not yet been set up.

## Change Workflow

```mermaid
flowchart TD
    A[GitHub issue] --> B["/oracle-new GitHub issue URL"]
    B --> C[Create feature branch and change.md]
    C --> D["/oracle-plan change-id"]
    D --> E[Research, decisions, plan.md, and plan-brief.md]
    E --> F["/oracle-implement change-id"]
    F --> G[Complete phases, verify, and commit progress]
    G --> H["/oracle-impl-review change-id"]
    H --> I{Findings?}
    I -- Yes --> J[Triage approved fixes or record decisions]
    I -- No --> K[Implementation approved]
    J --> K
    K --> L["/oracle-archive change-id"]
    L --> M[Move change record to context archive and commit]
```

## Skills

### `/oracle-init` (optional setup)

Sets up the change-tracking folders when they do not already exist. It creates only missing items, so it is safe to run again.

```text
/oracle-init
```

It ensures these files and directories exist:

```text
context/changes/
context/changes/README.md
context/archive/
context/archive/README.md
```

If it creates files, it can optionally propose a dedicated branch and commit. Existing files and unrelated working-tree changes are left alone.

```mermaid
flowchart TD
    A[Run oracle-init] --> B{Does context changes exist?}
    B -- No --> C[Create changes folder and guide]
    B -- Yes --> D[Keep existing changes folder]
    C --> E{Does archive exist?}
    D --> E
    E -- No --> F[Create archive folder and guide]
    E -- Yes --> G[Keep existing archive folder]
    F --> H[Show setup summary]
    G --> H
    H --> I{Files created?}
    I -- Yes --> J[Offer branch and commit]
    I -- No --> K[Finish]
    J --> K
```

### `/oracle-new`

Starts a change from an open GitHub issue in this repository.

```text
/oracle-new https://github.com/OWNER/REPO/issues/123
```

The skill validates the URL, confirms GitHub CLI authentication, assigns the issue to you, derives a concise `gh-<issue>-<slug>` branch name, creates and pushes that branch from `origin/main`, then writes:

```text
context/changes/gh-123-example-change/change.md
```

It commits and pushes only this initial record so the branch has a diff from `main`, opens a draft pull request targeting `main`, and appends the PR link to the GitHub issue description while preserving its existing content. An existing matching open PR or issue link is reused. Invoking `/oracle-new` authorizes these setup actions; later planning and implementation commits keep their own approval steps.

Use the exact issue URL from this repository. It stops safely if the issue is closed, the branch or change folder already exists, GitHub authentication fails, or the remote is not a GitHub repository.

```mermaid
flowchart TD
    A[Provide GitHub issue URL] --> B[Validate context, GitHub login, and repository]
    B --> C{Valid open issue?}
    C -- No --> X[Stop with an error]
    C -- Yes --> D[Assign issue to current user]
    D --> E[Derive change id and branch name]
    E --> F{Change folder or branch exists?}
    F -- Yes --> X
    F -- No --> G[Fetch origin main]
    G --> H[Create and push feature branch]
    H --> I[Write change.md]
    I --> J[Commit and push initial change record]
    J --> K[Open or reuse draft pull request]
    K --> L[Link PR in issue description and verify]
    L --> M[Suggest oracle-plan command]
```

### `/oracle-plan`

Turns a change request into a detailed, reviewed implementation plan.

```text
/oracle-plan gh-123-example-change
```

You can also pass a relevant file, such as a research document or frame brief:

```text
/oracle-plan @context/changes/gh-123-example-change/research.md
```

The skill reads the supplied context, researches the codebase, clarifies unresolved decisions, and creates `plan.md` plus a concise `plan-brief.md` in the change folder. `plan.md` includes phases, success criteria, scope boundaries, and a `## Progress` section. That Progress section is the source of truth for later implementation.

```mermaid
flowchart TD
    A[Start planning] --> B[Read change context and supplied files]
    B --> C[Research codebase and existing patterns]
    C --> D[Assess complexity and unresolved decisions]
    D --> E[Discuss requirements with user]
    E --> F[Draft phased plan]
    F --> G[Write plan.md and plan-brief.md]
    G --> H[Review and refine plan]
    H --> I[Plan ready for implementation]
```

### `/oracle-implement`

Executes an approved plan phase by phase.

```text
/oracle-implement gh-123-example-change
```

To resume or target one phase:

```text
/oracle-implement gh-123-example-change phase 2
```

The skill reads `plan.md`, starts at the first unchecked item in `## Progress`, implements and verifies each phase, and updates only the completed progress items. It tracks files touched per phase, proposes explicit commits for user approval, and records the resulting commit SHA beside completed progress rows. When every progress item is complete, it marks `change.md` as `implemented` and offers a final review.

```mermaid
flowchart TD
    A[Load plan.md] --> B[Find first unchecked progress item]
    B --> C[Implement current phase work]
    C --> D[Run phase verification]
    D --> E{Verification passes?}
    E -- No --> C
    E -- Yes --> F[Mark completed progress items]
    F --> G[Propose scoped phase commit]
    G --> H{Commit approved?}
    H -- No --> I[Adjust commit message or stop]
    H -- Yes --> J[Commit and record SHA]
    J --> K{More phases?}
    K -- Yes --> B
    K -- No --> L[Mark change implemented]
    L --> M[Offer final review]
```

### `/oracle-impl-review`

Checks completed implementation work against its plan for drift, unsafe choices, pattern inconsistencies, and unmet success criteria.

```text
/oracle-impl-review gh-123-example-change
```

For a focused review of one completed phase:

```text
/oracle-impl-review @context/changes/gh-123-example-change/plan.md phase 2
```

The review compares the plan with the Git diff, runs the plan's automated checks, and produces a persisted report in one of these locations:

```text
context/changes/<change-id>/reviews/impl-review.md
context/changes/<change-id>/reviews/impl-review-phase-<N>.md
```

Each finding has severity, impact, location, evidence, and a recommended fix. You may triage findings immediately, resume a saved report later, or leave the report for manual follow-up. The skill makes code changes only after you choose a specific fix.

```mermaid
flowchart TD
    A[Load plan and completed scope] --> B[Compare plan with Git changes]
    B --> C[Check quality, safety, and project patterns]
    C --> D[Run planned verification]
    D --> E[Compile verdicts and findings]
    E --> F[Save review report and update change status]
    F --> G{How to proceed?}
    G -- Triage now --> H[Choose a fix or record a decision]
    H --> I[Update saved report]
    G -- Triage later --> J[Resume from saved report later]
    G -- Done --> K[Finish with saved report]
    I --> K
```

### `/oracle-archive`

Closes an active change by moving its record to `context/archive/` and marking it archived.

```text
/oracle-archive gh-123-example-change
```

You can also provide the active change folder:

```text
/oracle-archive @context/changes/gh-123-example-change/
```

The skill blocks if the change folder or Git index has uncommitted work. It otherwise surfaces incomplete progress, missing review reports, or missing progress SHAs as warnings and lets you decide whether to continue. On archive, it updates `change.md`, moves the folder to `context/archive/<created-date>-<change-id>/`, and creates a scoped `chore(archive)` commit. If a matching item exists in `context/foundation/roadmap.md`, it is marked done as part of the same archive operation.

```mermaid
flowchart TD
    A[Provide an active change ID or folder] --> B[Check change record and Git state]
    B --> C{Uncommitted change-folder or staged work?}
    C -- Yes --> X[Stop without moving files]
    C -- No --> D[Surface lifecycle warnings]
    D --> E{Archive anyway?}
    E -- No --> Y[Leave active change unchanged]
    E -- Yes --> F[Stamp change.md as archived]
    F --> G[Move folder to context archive]
    G --> H[Close matching roadmap item when present]
    H --> I[Commit archive operation]
```

## Typical session

```text
/oracle-new https://github.com/OWNER/REPO/issues/123
/oracle-plan gh-123-example-change
/oracle-implement gh-123-example-change
/oracle-impl-review gh-123-example-change
/oracle-archive gh-123-example-change
```

If this is a new repository and `context/changes/` does not exist, run `/oracle-init` once before starting the session.

## Change records

Each active change has its own directory under `context/changes/<change-id>/`. Common artifacts are:

| File or directory | Purpose |
| --- | --- |
| `change.md` | Change identity, linked issue, lifecycle status, and dates. |
| `research.md` / `frame.md` | Optional research and problem-framing inputs for planning. |
| `plan.md` | The implementation plan and authoritative progress checklist. |
| `plan-brief.md` | A short, stakeholder-friendly plan summary. |
| `reviews/` | Saved implementation-review reports and triage decisions. |

`context/archive/` holds completed change records and is read-only by convention. `/oracle-archive` moves a completed active record there. Some skill text also refers to `/oracle-status`; that skill is not currently included in this repository.

## Conventions and safety

- Do not edit a completed plan's `## Progress` checklist casually; it drives resume behavior and completion status.
- Use an active change under `context/changes/`; implementation and review refuse to modify archived plans.
- Keep Git commits scoped to the files touched by the current phase. The implementation skill asks for approval before committing.
- Review is deliberately non-destructive: it reports findings first and applies a change only after your explicit triage decision.
