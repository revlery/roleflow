# Roleflow — Product Vision

*June 2026 · Larry Cao · github.com/revlery*

---

## What is Roleflow

Roleflow is an open source agentic job search platform with a human-in-the-loop interface. It serves as the data and automation layer for job seekers — usable directly as a kanban-style job tracker, or as infrastructure that AI agents can build on top of.

The core insight: job searching is a pipeline problem. Roleflow brings the same tools that sales teams use for CRM into the hands of individual job seekers, with AI automation and privacy-first architecture built in from the start.

---

## The Problem

**For job seekers:**
- Tracking applications across spreadsheets, notes, and email is fragmented and error-prone
- Finding recruiter contact information is manual, time-consuming, and inconsistent
- Interview scheduling requires juggling email threads and calendar apps separately
- No single tool connects the full workflow from discovery to offer

**For people building job search agents:**
- Everyone reinvents the same plumbing — Gmail parsing, ATS detection, calendar scheduling
- No standard interface means fragile, one-off automations
- Giving agents full inbox access creates privacy and security risks
- No human review layer means false positives cause real damage

---

## The Solution

Roleflow provides three layers that work together:

### 1. Human interface
A clean kanban board for tracking job applications through stages: Wishlist → Applied → Recruiter Contact → Interview → Offer. Stats, timelines, and recruiter contact cards built in. Works standalone with no agents required.

### 2. Recruiter email intelligence
A standardized, community-trained classifier for identifying recruiter emails from Gmail. Connects via OAuth with minimal required scopes (`gmail.metadata` only — we never read email bodies). The classifier improves over time as users correct false positives, creating a data network effect that makes it more accurate than any individual could build alone.

### 3. Agent API
A clean REST API that AI agents can plug into — locally or cloud-hosted. Agents read structured job data from Roleflow and write actions back for human review before execution. This means:
- Agents never need direct inbox access
- Works with any LLM — Claude, GPT, Gemini, Llama, Mistral, local models via Ollama
- Every agent action is visible and reversible in the UI
- Enterprise and privacy-conscious users can self-host the entire stack

---

## Key Differentiators

### Open source trust model
Being open source isn't just a distribution strategy — it's the core trust mechanism. Users can audit exactly what Roleflow does with their Gmail access. The recruiter classifier is inspectable. The API is transparent. This removes the biggest objection to connecting sensitive data.

### Human-in-the-loop by design
Most AI job search tools are either fully manual or fully autonomous. Roleflow sits in the middle: agents can automate the tedious parts, but every action surfaces in the UI for review before it executes. This makes it safe to use with weaker local models, appropriate for regulated industries, and comfortable for users who want control.

### LLM agnostic
Because the human review layer catches mistakes, Roleflow works with any model. Users aren't locked into a specific AI provider. This future-proofs the platform as better models emerge and gives privacy-conscious users the option to run everything locally.

### Network effect on recruiter detection
Every correction a user makes to the recruiter classifier improves it for everyone. Over time, Roleflow's recruiter email detection becomes more accurate than anything an individual developer or company could build independently. This is a durable moat that grows with adoption.

### Teaches agentic skills
Job seekers using Roleflow learn how AI agents work by watching them operate transparently. Every agent action is logged and explained. Users graduate from passive consumers to people who can configure, adjust, and eventually build their own agentic workflows — a skill that is increasingly valuable in the job market itself.

---

## Privacy Model

Roleflow is built on minimal access:

- `gmail.metadata` scope — reads email headers only (sender, subject, date), never email body
- `gmail.compose` scope — writes drafts only, never sends without user action
- Local deployment option — OAuth token stays on device, scanning runs locally, nothing hits external servers
- Structured extraction — Roleflow stores recruiter name, email, company, and role. Raw email content is never stored.

The draft-only model for outbound means no email ever sends without the user reviewing it first. You are always the last action.

---

## Use Cases

**Individual job seekers** — Track applications, find recruiter emails, schedule interviews, and get AI-assisted outreach drafts — all in one place without exposing full inbox access to any third party.

**Developers building job search agents** — Use Roleflow as the data layer instead of building Gmail parsing, calendar integration, and job tracking from scratch. Ship faster with a foundation the community maintains.

**Consulting and freelance pipeline** — The same kanban workflow applies to finding consulting clients. A mode toggle converts job tracking into a client pipeline tracker.

**Power users** — Users managing multiple simultaneous job searches benefit from Roleflow's structured pipeline and calendar conflict detection without exposing credentials to multiple services.

---

## The Bigger Picture

Roleflow is a bridge layer — built for the transition period between fully manual work and fully autonomous agents. Today, humans review every action. Over time, as trust is established and capability proven, the human steps back. The UI doesn't disappear; it becomes the audit log.

The companies and tools building trusted human-in-the-loop platforms right now will own the agent workflows of the future. Because when agents become fully capable, they'll still need somewhere to store state, audit actions, and interface with humans who want visibility.

Roleflow is that layer for job searching.

---

## Roadmap

**Phase 1 — MVP**
- [ ] Kanban job tracker with manual entry
- [ ] Gmail OAuth + recruiter email detection (metadata scope only)
- [ ] Google Calendar integration for interview scheduling
- [ ] Open source on GitHub, deployed on Vercel

**Phase 2 — Agent layer**
- [ ] REST API for agent integrations
- [ ] Human review queue for agent actions
- [ ] Local LLM support via Ollama
- [ ] Recruiter classifier feedback loop

**Phase 3 — Platform**
- [ ] Developer documentation and agent SDK
- [ ] Community classifier contributions
- [ ] Consulting / client pipeline mode
- [ ] Roleflow Recruit — recruiter-facing product

---

## Monetization

The core product is and remains open source. Monetization follows the open core model:

- **Free:** open source, self-hostable, full job tracking and basic email finding
- **Paid ($8–12/month):** hosted cloud version, advanced recruiter intelligence, priority classifier updates, calendar automation
- **Enterprise:** on-premise deployment, SSO, audit logs, custom LLM integration

---

## Why Now

AI agents are becoming a standard part of job searching, but the tooling is fragmented and trust is low. People are hacking together brittle automations that require full inbox access and have no human oversight. Roleflow arrives at the moment when there is clear demand for agentic job search tooling but no trusted, open, standardized platform to build on.

The job search market is permanent and universal. Every person who works will search for a job. Building the open source infrastructure layer for that process — with privacy, human oversight, and community-driven intelligence — is a durable and meaningful problem to solve.

---

*Built by Larry Cao · github.com/revlery*
