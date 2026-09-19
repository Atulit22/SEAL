# CLAUDE.md

## Project: SEAL --- Secure Examination System

SEAL is a final-year academic project for an AKTU-style examination
workflow.

The project is being built from scratch as a **web-first application**.
A small Tauri desktop client will be added later for the secure
exam-center release/distribution workflow.

## Current Development Priority

The project is currently in:

> **Phase 0 --- Web application foundation**

Current stack:

-   React
-   TypeScript
-   Vite
-   Tailwind CSS
-   React Router
-   Node.js + TypeScript backend
-   Fastify
-   PostgreSQL
-   Prisma
-   Zod

Do not jump ahead to AI, encryption, face authentication, or the desktop
application unless explicitly requested or the current phase is
complete.

## Architecture

``` text
                 SEAL WEB APPLICATION
                         |
        +----------------+----------------+
        |                                 |
   React Frontend                    Node Backend
        |                                 |
        |                            PostgreSQL
        |                                 |
        +------------------------- AI Service
                                          |
                                   Security Services
                                          |
                                   Audit / Risk Engine

                         |
                         v
               Later: Tauri Exam Center
                     Desktop Client
```

### Web application

The web app is the main system.

It will eventually contain:

-   Authentication
-   Role-based dashboards
-   College management
-   Subjects
-   Syllabus
-   Question bank
-   AI question generation
-   Paper generation
-   Paper review
-   Security dashboard
-   Audit logs

### Desktop application

The desktop application is **not the main application**.

It will be added later and will focus on:

-   Exam-center authentication
-   Device/college verification
-   Release-condition checking
-   Controlled paper decryption
-   Display/printing
-   Release audit events

Do not build the desktop client during the current web foundation phase.

------------------------------------------------------------------------

## Core Security Principle

### AI is not the database.

Sensitive examination information must remain under the application's
controlled backend.

Do not send the entire:

-   Question bank
-   Final paper
-   Answer key
-   Student database
-   Security logs

to an external AI provider.

Send only the minimum context needed for a specific AI operation.

``` text
Secure Backend
      |
      | minimum required context
      v
   AI Service
      |
      | result
      v
Backend validation
      |
      v
Secure Database
```

The browser must never contain privileged AI credentials.

------------------------------------------------------------------------

## AI Responsibilities

AI may assist with:

-   Question generation
-   Question rewriting
-   Difficulty estimation
-   Semantic similarity
-   Syllabus relevance
-   Answer evaluation

AI must not independently enforce hard examination constraints.

The backend must enforce:

-   Total marks
-   Unit distribution
-   Question count
-   Difficulty distribution
-   Question types
-   Exam duration
-   Release conditions

AI output must be treated as untrusted input and validated.

------------------------------------------------------------------------

## Question Generation Pipeline

``` text
Professor configuration
        ↓
Candidate questions
        ↓
AI generation/selection
        ↓
Schema validation
        ↓
Syllabus validation
        ↓
Rule validation
        ↓
Semantic duplicate detection
        ↓
Teacher review
        ↓
Approved paper
```

Never allow raw AI output to directly become an approved examination
paper.

------------------------------------------------------------------------

## Security Architecture

Use defense in depth:

1.  Authentication
2.  Authorization
3.  College isolation
4.  Input validation
5.  Encryption
6.  Release controls
7.  Device/network checks
8.  Risk monitoring
9.  Audit logging
10. Human approval

IP address is supporting security metadata, not a permanent identity.

------------------------------------------------------------------------

## Paper Lifecycle

Use explicit states:

``` text
DRAFT
  ↓
AI_GENERATED
  ↓
VALIDATED
  ↓
TEACHER_REVIEW
  ↓
APPROVED
  ↓
LOCKED
  ↓
ENCRYPTED
  ↓
RELEASED
  ↓
ARCHIVED
```

Locked papers must not be silently modified.

A modification after locking requires a new version and an audit event.

------------------------------------------------------------------------

## Encryption

Use established cryptographic libraries.

Do not:

-   Invent encryption algorithms
-   Hard-code keys
-   Commit keys
-   Put keys in frontend code
-   Store keys next to ciphertext unnecessarily
-   Log plaintext papers
-   Log encryption keys

Prefer authenticated encryption.

For the prototype, keep key management behind a dedicated
service/interface so it can later be replaced by a proper KMS.

------------------------------------------------------------------------

## Authentication and Roles

Expected roles:

``` text
UNIVERSITY_ADMIN
COLLEGE_ADMIN
QUESTION_SETTER
EXAMINER
EXAM_CENTER_OPERATOR
AUDITOR
```

Use RBAC and least privilege.

Authentication and authorization are separate concerns.

Every protected backend endpoint must verify authorization server-side.

------------------------------------------------------------------------

## College Isolation

Every college-owned resource must be scoped by college/institution ID.

A user from College A must not be able to access College B's:

-   Questions
-   Subjects
-   Papers
-   Users
-   Security events
-   Audit information

Never rely only on frontend filtering for this.

------------------------------------------------------------------------

## Audit Logging

Security-sensitive events should be structured.

Recommended fields:

``` text
eventId
timestamp
actorId
collegeId
action
resourceId
result
ip/network metadata
device metadata
riskScore
incidentId
```

Do not log sensitive plaintext examination content or cryptographic
secrets.

------------------------------------------------------------------------

## Risk Engine

The risk engine may consider:

-   Unusual access time
-   Unknown device
-   Unknown network
-   Repeated failed login
-   Unusual access frequency
-   Sensitive resource request
-   Abnormal behavior

Example:

``` text
03:00 AM
Unknown device
Unrecognized network
Attempt to access encrypted paper

→ HIGH RISK
→ Access denied
→ Incident recorded
```

A risk score is a security signal for investigation, not proof of
malicious behavior.

------------------------------------------------------------------------

## Development Rules

1.  Inspect existing code before modifying it.
2.  Make the smallest coherent change.
3.  Do not rewrite unrelated code.
4.  Keep business rules deterministic and testable.
5.  Validate all external input.
6.  Add tests for security-sensitive behavior.
7.  Run lint/type checks after meaningful changes.
8.  Do not claim a feature works without testing it.
9.  Keep documentation aligned with actual implementation.
10. Do not introduce dependencies without a reason.

------------------------------------------------------------------------

## Current Frontend Structure

The current web app should remain feature-oriented:

``` text
web/src/
├── app/
│   ├── App.tsx
│   └── routes.tsx
├── components/
│   ├── ui/
│   └── layout/
├── features/
│   ├── auth/
│   ├── dashboard/
│   ├── subjects/
│   ├── syllabus/
│   ├── questions/
│   ├── papers/
│   └── security/
├── lib/
└── types/
```

Do not create a huge flat `components/` directory.

Feature-specific components should live with their feature.

------------------------------------------------------------------------

## Current Phase

The current implementation has:

-   Vite + React + TypeScript
-   Tailwind CSS
-   React Router
-   Initial application folders
-   Login page foundation
-   Placeholder routes

The immediate next goal is:

``` text
Login UI
   ↓
Application shell
   ↓
Backend foundation
   ↓
Database
   ↓
Real authentication
   ↓
Syllabus management
```

------------------------------------------------------------------------

## Git Rule

**Never commit, amend, merge, rebase, or push changes unless the user
explicitly asks.**

You may inspect Git state and suggest commands.

Do not perform Git mutations automatically.
