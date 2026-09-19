# TASK.md

# SEAL --- Development Task Plan

## Current Phase

### Phase 0 --- Web Foundation

Status:

-   [x] Create project root
-   [x] Add project documentation
-   [x] Create Vite React TypeScript app
-   [x] Install Tailwind CSS
-   [x] Install React Router
-   [x] Create feature-oriented folders
-   [x] Create initial routes
-   [x] Create login UI foundation
-   [ ] Build reusable application shell
-   [ ] Build navigation/sidebar
-   [ ] Add basic page layout
-   [ ] Establish frontend conventions
-   [ ] Add frontend error/loading states

Do not start advanced security or AI implementation before the
foundation is stable.

------------------------------------------------------------------------

# Phase 1 --- Backend Foundation

-   [ ] Create `server/`
-   [ ] Initialize Node.js + TypeScript
-   [ ] Add Fastify
-   [ ] Add CORS configuration
-   [ ] Add environment configuration
-   [ ] Add Zod
-   [ ] Add centralized error handling
-   [ ] Add structured logging
-   [ ] Add health endpoint
-   [ ] Add API versioning
-   [ ] Add basic tests

### Exit Criteria

``` text
GET /api/health
→ 200 OK
```

Backend starts cleanly and configuration is documented.

------------------------------------------------------------------------

# Phase 2 --- Database

-   [ ] Install/configure Prisma
-   [ ] Configure PostgreSQL
-   [ ] Create migrations
-   [ ] Create College model
-   [ ] Create User model
-   [ ] Create Role representation
-   [ ] Create Subject
-   [ ] Create Unit
-   [ ] Create Topic
-   [ ] Create Question
-   [ ] Add ownership relationships
-   [ ] Add timestamps
-   [ ] Add indexes
-   [ ] Seed development data

### Exit Criteria

A development database can be created from migrations and seeded
successfully.

------------------------------------------------------------------------

# Phase 3 --- Real Authentication

-   [ ] Login API
-   [ ] Password hashing
-   [ ] Session/token handling
-   [ ] Auth middleware
-   [ ] RBAC middleware
-   [ ] College isolation
-   [ ] Failed-login tracking
-   [ ] Rate limiting
-   [ ] Logout/session invalidation
-   [ ] Connect login UI to API

### Exit Criteria

A user can log in and only access resources allowed by their role and
college.

------------------------------------------------------------------------

# Phase 4 --- Syllabus Management

-   [ ] Subject creation
-   [ ] Subject listing
-   [ ] Subject details
-   [ ] Unit creation
-   [ ] Topic creation
-   [ ] Edit/archive
-   [ ] Frontend forms
-   [ ] Backend validation
-   [ ] Authorization checks

### Exit Criteria

Professor can create:

``` text
Subject
 ├── Unit
 │    ├── Topic
 │    └── Topic
 └── Unit
      ├── Topic
      └── Topic
```

------------------------------------------------------------------------

# Phase 5 --- Question Bank

-   [ ] Question CRUD
-   [ ] Question metadata
-   [ ] Difficulty
-   [ ] Marks
-   [ ] Type
-   [ ] Unit/topic mapping
-   [ ] Search
-   [ ] Filters
-   [ ] Versioning
-   [ ] Authorization
-   [ ] College isolation

### Exit Criteria

Professor can maintain a usable structured question bank.

------------------------------------------------------------------------

# Phase 6 --- AI Question Engine

-   [ ] AI gateway in backend
-   [ ] Structured prompt/input
-   [ ] Structured output schema
-   [ ] AI response validation
-   [ ] Candidate-question generation
-   [ ] Syllabus context
-   [ ] Difficulty constraints
-   [ ] Marks constraints
-   [ ] Failure handling
-   [ ] Rate limiting/cost controls

### Exit Criteria

AI can produce candidate questions without directly publishing them.

------------------------------------------------------------------------

# Phase 7 --- Validation and Duplicate Detection

-   [ ] Syllabus validation
-   [ ] Marks validation
-   [ ] Unit validation
-   [ ] Difficulty validation
-   [ ] Question-type validation
-   [ ] Embedding/similarity service
-   [ ] Similarity threshold
-   [ ] Duplicate review UI
-   [ ] Review decision storage

### Exit Criteria

Potential duplicates and invalid questions are clearly flagged before
paper approval.

------------------------------------------------------------------------

# Phase 8 --- Paper Builder

-   [ ] Exam configuration
-   [ ] Total marks
-   [ ] Unit distribution
-   [ ] Difficulty distribution
-   [ ] Question count
-   [ ] Candidate selection
-   [ ] Complete-paper validation
-   [ ] Paper preview
-   [ ] Teacher approval
-   [ ] Version snapshot
-   [ ] Locking

### Exit Criteria

A professor can create and approve a complete balanced paper.

------------------------------------------------------------------------

# Phase 9 --- Paper Security

-   [ ] Encryption service abstraction
-   [ ] Authenticated encryption
-   [ ] Per-paper key strategy
-   [ ] Ciphertext storage
-   [ ] Key-release abstraction
-   [ ] Prevent plaintext logging
-   [ ] Early-release denial
-   [ ] Decryption event logging

### Exit Criteria

A locked paper is encrypted and cannot be retrieved as plaintext before
valid release conditions.

------------------------------------------------------------------------

# Phase 10 --- Security Monitoring

-   [ ] Login events
-   [ ] Paper access events
-   [ ] Decryption events
-   [ ] Administrative events
-   [ ] Device metadata
-   [ ] Network/IP metadata
-   [ ] Access-time rules
-   [ ] Repeated-attempt detection
-   [ ] Security dashboard

------------------------------------------------------------------------

# Phase 11 --- Risk Engine

-   [ ] Define risk factors
-   [ ] Implement scoring
-   [ ] Explain score contributors
-   [ ] Configure thresholds
-   [ ] High-risk alerts
-   [ ] Incident IDs
-   [ ] Link incidents to audit events

### Demo

Simulate:

``` text
03:00 AM
Unknown device
Unknown network
Attempt to access encrypted paper
```

Expected:

``` text
High risk
Access denied
Incident recorded
```

------------------------------------------------------------------------

# Phase 12 --- Watermarking

-   [ ] College ID
-   [ ] Exam session
-   [ ] Paper ID
-   [ ] Version
-   [ ] Visible watermark
-   [ ] Document identifier
-   [ ] Watermark validation

------------------------------------------------------------------------

# Phase 13 --- Tauri Exam Center

Only after the web/backend MVP works.

-   [ ] Create Tauri app
-   [ ] Exam-center authentication
-   [ ] College/device verification
-   [ ] Release-condition verification
-   [ ] Secure paper retrieval
-   [ ] Controlled decryption
-   [ ] Display
-   [ ] Printing
-   [ ] Release audit event

------------------------------------------------------------------------

# Phase 14 --- Advanced AI Evaluation

Optional.

-   [ ] Answer upload
-   [ ] OCR
-   [ ] Rubric
-   [ ] Reference answer
-   [ ] AI suggested marks
-   [ ] Confidence
-   [ ] Teacher review
-   [ ] Evaluation audit

------------------------------------------------------------------------

# Phase 15 --- Testing

## Core Tests

-   [ ] Authentication
-   [ ] Authorization
-   [ ] College isolation
-   [ ] Syllabus validation
-   [ ] Question validation
-   [ ] Duplicate detection
-   [ ] Paper constraints
-   [ ] Paper locking
-   [ ] Encryption
-   [ ] Early release
-   [ ] Audit events
-   [ ] Risk scoring
-   [ ] AI failure handling

## Security Demo Tests

-   [ ] Wrong user
-   [ ] Wrong role
-   [ ] Wrong college
-   [ ] Unknown device
-   [ ] Early access
-   [ ] Repeated failed login
-   [ ] Locked paper modification
-   [ ] Malformed AI response

------------------------------------------------------------------------

# Phase 16 --- Documentation

-   [ ] Architecture diagram
-   [ ] Database ERD
-   [ ] API documentation
-   [ ] Security/threat model
-   [ ] AI workflow
-   [ ] Testing report
-   [ ] Limitations
-   [ ] Future scope
-   [ ] Presentation
-   [ ] Research-paper material

------------------------------------------------------------------------

# Definition of Done

A feature is complete only when:

-   It works.
-   It is validated.
-   Security implications are considered.
-   Critical behavior is tested.
-   Important actions are auditable where appropriate.
-   Documentation matches implementation.
-   No secrets are committed.

------------------------------------------------------------------------

# Git Rule

**Never commit, amend, merge, rebase, or push unless the user explicitly
requests it.**
