# AGENT.md

# SEAL Agent Rules

## Mission

Build SEAL incrementally as a secure, maintainable academic examination
system.

The project is currently web-first. Do not start the desktop exam-center
client until the web/backend foundation is functional.

## Priority Order

Always prefer:

1.  Correctness
2.  Security
3.  Maintainability
4.  Testability
5.  Clear UX
6.  Feature breadth

Do not sacrifice the first four to add flashy features.

------------------------------------------------------------------------

## Phase Discipline

The project is divided into phases.

### Phase 0 --- Foundation

-   React/Vite
-   Tailwind
-   Routing
-   Frontend structure
-   Backend setup
-   Database setup
-   Environment configuration

### Phase 1 --- Authentication

-   Users
-   Roles
-   Login
-   Sessions
-   RBAC
-   College isolation

### Phase 2 --- Academic Data

-   Colleges
-   Subjects
-   Syllabus
-   Units
-   Topics
-   Question bank

### Phase 3 --- AI

-   Structured question generation
-   Difficulty analysis
-   Syllabus validation
-   Semantic duplicate detection

### Phase 4 --- Paper System

-   Paper assembly
-   Teacher approval
-   Versioning
-   Locking

### Phase 5 --- Security

-   Encryption
-   Controlled release
-   Audit logs
-   Risk scoring
-   Watermarking

### Phase 6 --- Advanced

-   Face verification
-   OCR
-   AI answer evaluation
-   Anomaly detection
-   Break-glass access
-   Tauri exam-center client

Do not implement later phases prematurely.

------------------------------------------------------------------------

## AI Safety Rules

Treat AI output as untrusted.

Every AI response must:

1.  Be schema validated.
2.  Be checked against syllabus data.
3.  Be checked against hard paper constraints.
4.  Be checked for similarity/duplicates where applicable.
5.  Be reviewable by an authorized teacher.

Never allow the LLM to directly write an approved paper to the database.

------------------------------------------------------------------------

## Sensitive Data

Minimize data sent to external AI services.

Never send unnecessary:

-   Student identity
-   Full question database
-   Final paper
-   Answer keys
-   Audit logs
-   Credentials
-   Encryption keys

Use backend-controlled context.

Never put AI API keys in frontend code.

------------------------------------------------------------------------

## Backend Security

Security decisions belong on the backend.

Never trust frontend values for:

-   Role
-   College
-   User identity
-   Paper release time
-   Paper ownership
-   Authorization
-   Risk level
-   Decryption permission

------------------------------------------------------------------------

## Database Rules

Every college-owned entity must have a clear ownership relationship.

Examples:

``` text
College
  └── User
  └── Subject
  └── Question
  └── Exam
  └── Paper
```

Prevent cross-college access at the service/database layer.

Use migrations.

Do not manually edit production-like databases without a migration.

------------------------------------------------------------------------

## Authentication

Use secure password hashing.

Never store plaintext passwords.

Use secure session/token handling.

Rate-limit authentication attempts.

Record security-relevant failures.

------------------------------------------------------------------------

## Cryptography

Never invent cryptography.

Use established libraries.

Never:

-   Hard-code keys
-   Commit keys
-   Expose keys to browser code
-   Log keys
-   Put secrets in source files

------------------------------------------------------------------------

## Audit Events

Audit:

-   Login failures
-   Login success where appropriate
-   Role changes
-   Paper generation
-   Paper approval
-   Paper locking
-   Paper release
-   Decryption requests
-   Administrative changes
-   Suspicious activity

Avoid putting sensitive paper content into audit logs.

------------------------------------------------------------------------

## Risk Scoring

Risk factors may include:

-   Access time
-   Device
-   IP/network
-   Failed attempts
-   Access frequency
-   Requested resource
-   User role

Risk scoring must remain explainable.

Do not describe a user as malicious merely because their risk score is
high.

------------------------------------------------------------------------

## Watermarking

Use:

-   College ID
-   Exam session
-   Paper ID
-   Version

IP can be recorded as supporting metadata but must not be treated as the
sole college identity.

------------------------------------------------------------------------

## Error Handling

Never expose internal errors, secrets, stack traces, or cryptographic
details to users.

Use safe user-facing messages and secure server-side logging.

------------------------------------------------------------------------

## Testing

Security-sensitive code requires tests.

At minimum:

-   Authentication
-   Authorization
-   College isolation
-   Syllabus validation
-   Duplicate detection
-   Marks distribution
-   Paper locking
-   Encryption/decryption
-   Early release prevention
-   Audit events
-   Risk scoring
-   AI failure/malformed responses

------------------------------------------------------------------------

## Git

**No automatic Git mutations.**

Do not:

-   commit
-   amend
-   merge
-   rebase
-   push

unless the user explicitly requests it.

------------------------------------------------------------------------

## Change Management

Before changing code:

1.  Read the relevant file.
2.  Understand existing behavior.
3.  Make the smallest necessary change.
4.  Check imports/types.
5.  Run the relevant test/build command.
6.  Report what changed and what was verified.

Do not make unrelated cleanup changes.

------------------------------------------------------------------------

## Claims

Never claim:

-   Leak prevention is guaranteed.
-   AI is always correct.
-   Face recognition is perfect.
-   IP identifies a college with certainty.
-   The system is production-ready.
-   The project is officially integrated with AKTU.

Unless independently established, describe the system as an academic
prototype.
