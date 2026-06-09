# roleflow

> Open source agentic job search platform with a human-in-the-loop interface.

Roleflow is the missing layer between job seekers and AI agents. Use it as a clean kanban-style job tracker, or as infrastructure that AI agents can build on top of — locally or cloud-hosted, with any LLM.

**[Read the full product vision →](VISION.md)**

---

## What it does

- Track job applications through a structured pipeline: Wishlist → Applied → Recruiter Contact → Interview → Offer
- Find recruiter emails via Gmail OAuth (metadata scope only — we never read your email body)
- Draft outreach emails via agent — you always review before sending
- Schedule interviews via Google Calendar integration
- Expose a REST API for AI agents to plug into

## Why open source

Being open source isn't just a distribution strategy — it's the core trust mechanism. You can audit exactly what Roleflow does with your Gmail access. The recruiter classifier is inspectable. The API is transparent.

## Stack

- Frontend: React
- Backend: Node.js / Express
- Auth: Gmail OAuth (`gmail.metadata` + `gmail.compose` scopes only)
- Local or cloud deployment

## Privacy model

- Minimal OAuth scopes — metadata only for recruiter detection, compose only for drafts
- Local deployment option — nothing leaves your machine
- We extract recruiter contact info and discard the rest
- Every agent action requires human review before execution

## Roadmap

- [ ] Kanban job tracker
- [ ] Gmail OAuth + recruiter email detection
- [ ] Google Calendar interview scheduling
- [ ] Agent REST API
- [ ] Local LLM support via Ollama
- [ ] Community recruiter classifier

## Author

Larry Cao · [github.com/revlery](https://github.com/revlery)

---

*Roleflow is early. Star the repo to follow along.*
