# Skill routing — which tool for which work

Given a task, consult this table and pick the best-fitting skill/subagent, then use it.
**Skills are a fixed installed set — Claude can only invoke skills that already exist.**
Only the tools listed here exist today. New ones can be created (see "Gaps" below).

| Kind of work | Reach for | Notes |
|---|---|---|
| Plan a feature / choose an approach | **Plan** subagent or built-in **plan mode** | Always before non-trivial code (Karpathy #1). |
| Understand existing code/files | **Explore** subagent (read-only) | Cheap context gathering. |
| Research a fact / library / best practice | **deep-research** skill | e.g. Astro patterns, GH Pages specifics, a11y. |
| Initialize/refresh codebase docs | **init** skill | Once the repo has real structure worth documenting. |
| Configure the harness (hooks, permissions, env) | **update-config** skill | e.g. allow `npm run dev`/`build` without prompts. |
| Design / visually polish a page ("make it look nice") | **design-pass** skill | Warm Editorial language + build→screenshot→critique loop. Covers home, blog index, post page. |
| See a change running / screenshot it | **run** skill | Launches the Astro dev server / built site. |
| Confirm a change does what was asked | **verify** skill | Behavioral check, not just "it renders." |
| Bug-hunt the current diff | **code-review** skill | Effort low→ultra; `--fix` applies, `--comment` for PRs. |
| Tidy/simplify changed code (quality, not bugs) | **simplify** skill | Complements code-review. |
| Review a pull request | **review** skill | PR-level (vs code-review's working diff). |
| Security pass before publishing | **security-review** skill | Low stakes for a static blog, but cheap pre-deploy. |
| General multi-step coding, scope unknown | **general-purpose** subagent | Fallback when no specialized skill fits. |

## Gaps — no skill exists yet (do inline now; create a skill when it recurs)
None of the installed skills cover these. For now, handle them **inline** (directly in
the session, no skill). When a gap keeps recurring, a **`BOOTSTRAP:` session can author
a custom skill** at `.claude/skills/<name>/SKILL.md`; once it exists it appears in the
skill list and gets a row above — that is how task→skill coverage grows over time.

| Gap | Inline approach today | Candidate custom skill (BOOTSTRAP) |
|---|---|---|
| **Writing / reviewing post prose** | Draft or critique directly in chat; use **deep-research** for facts. The voice stays the owner's. | `writing-review` |
| **Deploy to GitHub Pages** | Author the Actions workflow inline; **run**/**verify** the build; **update-config** for new command permissions. | (usually a one-off; skip) |

Rule: don't fake a skill that doesn't exist. Either use a real one from the table, do
the work inline, or (in BOOTSTRAP) create the skill first — then use it.
