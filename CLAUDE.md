# blog — Claude grounding

Personal blog (learning + sports adventures), built as a job-application portfolio
piece. Static site, **Astro**, deployed to **GitHub Pages**. Owner is a strong
programmer but not a web developer — favor clear, simple, well-explained changes.

## Behavioral rules (always apply)
@.claude/karpathy.md

## How every session starts — read the first message's prefix

- **`BOOTSTRAP:`** — You are working ON this grounding system, NOT the blog.
  - You own `CLAUDE.md` + everything under `.claude/`. Do not touch site code/content.
  - First read all of `.claude/` so edits stay consistent and non-duplicative.
  - Typical work: tune `routing.md`, update `project.md`/`stack.md` to match reality,
    re-sync `karpathy.md`, keep `CLAUDE.md` short.
  - You may **create custom skills** at `.claude/skills/<name>/SKILL.md` to fill a
    recurring gap (e.g. writing review, design pass), then add a `routing.md` row.

- **`TASK:`** — You are doing real blog work (features, content, styling, deploy).
  - First read `.claude/project.md` and `.claude/stack.md`.
  - Obey the contract: **adding a post = creating ONE content file** from the template.
  - Pick tools using `.claude/routing.md`. Plan before non-trivial code.
  - Do NOT edit grounding files to work around a problem — that is BOOTSTRAP work.

- **No prefix** — Ask which mode, or state your inferred mode before acting.
