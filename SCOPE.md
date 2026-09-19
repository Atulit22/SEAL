# SCOPE.md

# SEAL --- Scope

## Project Definition

SEAL is a **web-first academic prototype** for an AKTU-style secure
examination workflow.

The project demonstrates AI-assisted question-paper generation together
with security controls for protecting examination information.

A Tauri desktop client is an **optional later component** focused on
secure exam-center paper release/distribution.

------------------------------------------------------------------------

# In Scope --- MVP

## 1. Web Application

The primary application shall be a web app.

It shall provide:

-   Login
-   Role-based dashboards
-   College isolation
-   Subject management
-   Syllabus management
-   Question-bank management
-   Paper generation
-   Paper review
-   Security monitoring
-   Audit logs

------------------------------------------------------------------------

## 2. Authentication

-   User accounts
-   Secure login
-   Password hashing
-   Session/token management
-   RBAC
-   Failed-login monitoring
-   College-level access control

Roles:

``` text
UNIVERSITY_ADMIN
COLLEGE_ADMIN
QUESTION_SETTER
EXAMINER
EXAM_CENTER_OPERATOR
AUDITOR
```

------------------------------------------------------------------------

## 3. Syllabus

Authorized users can manage:

-   Subjects
-   Units
-   Topics
-   Marks
-   Academic sessions
-   Course/program information

------------------------------------------------------------------------

## 4. Question Bank

The system supports:

-   Create/edit/archive questions
-   Unit/topic mapping
-   Marks
-   Difficulty
-   Question type
-   Versioning
-   Search/filtering

------------------------------------------------------------------------

## 5. AI Question Generation

AI can:

-   Generate candidate questions
-   Rephrase questions
-   Assist with difficulty estimation
-   Generate questions for specific units/topics
-   Assist with syllabus relevance

AI output must pass backend validation.

------------------------------------------------------------------------

## 6. Paper Quality

The system shall support:

### Unit distribution

Example:

``` text
Unit 1 = 20 marks
Unit 2 = 20 marks
Unit 3 = 20 marks
Unit 4 = 20 marks
Unit 5 = 20 marks
```

### Difficulty distribution

Example:

``` text
Easy   = 30%
Medium = 50%
Hard   = 20%
```

### Duplicate detection

Semantic similarity should identify differently worded but substantially
equivalent questions.

### Syllabus validation

Out-of-syllabus questions should be flagged/rejected.

------------------------------------------------------------------------

## 7. Teacher Approval

The teacher must be able to:

-   Preview the paper
-   See validation results
-   Review duplicate warnings
-   Review difficulty
-   Approve
-   Reject
-   Revise

Approved papers become versioned snapshots.

------------------------------------------------------------------------

## 8. Paper Security

The MVP shall demonstrate:

-   Paper locking
-   Encryption
-   Secure ciphertext storage
-   Controlled decryption
-   Release conditions
-   Release auditing

The project does not claim perfect leak prevention.

------------------------------------------------------------------------

## 9. Security Monitoring

Track:

-   Login attempts
-   Paper access
-   Decryption requests
-   Administrative actions
-   IP/network metadata
-   Device metadata
-   Access time
-   Repeated attempts

------------------------------------------------------------------------

## 10. Risk Scoring

The system may score:

-   Unusual time
-   Unknown device
-   Unknown network
-   Failed authentication
-   Repeated requests
-   Sensitive resource access

The score must be explainable.

A high score is not proof of malicious activity.

------------------------------------------------------------------------

## 11. Audit

Record:

``` text
Event ID
Timestamp
Actor
College
Action
Resource
Result
Network/IP metadata
Device metadata
Risk score
Incident ID
```

Do not put encryption keys or sensitive paper plaintext into ordinary
logs.

------------------------------------------------------------------------

## 12. Watermarking

Final documents may include:

``` text
College ID
Exam Session
Paper ID
Version
```

IP may be stored as supporting metadata but must not be the sole college
identifier.

------------------------------------------------------------------------

# Optional Advanced Scope

Only implement after the MVP works.

## Face Verification

-   Photo enrollment
-   Face verification
-   Optional liveness/anti-spoofing
-   Authentication fallback

## AI Answer Evaluation

-   Answer upload
-   OCR
-   Reference answer
-   Rubric
-   AI suggested marks
-   Confidence
-   Teacher review

## Anomaly Detection

-   Behavioral baselines
-   Unusual access patterns
-   Device/network anomalies

## Break-Glass Access

Controlled emergency release requiring additional authorization and
complete auditing.

## Tauri Exam Center

A desktop client may later provide:

-   Exam-center authentication
-   Device verification
-   Release-condition checks
-   Controlled decryption
-   Display/printing
-   Release audit events

------------------------------------------------------------------------

# Out of Scope

The initial project will not claim:

-   Official AKTU production integration
-   Guaranteed leak prevention
-   Perfect AI accuracy
-   Complete replacement of teachers
-   Enterprise-scale national deployment
-   IP-only identity
-   Custom cryptographic algorithms
-   Fully autonomous AI marking

------------------------------------------------------------------------

# Architecture Boundary

The system should maintain this separation:

``` text
WEB APP
  |
  +-- User/Admin Management
  +-- Syllabus
  +-- Question Bank
  +-- AI
  +-- Paper Builder
  +-- Security
  +-- Audit

BACKEND
  |
  +-- Authorization
  +-- Database
  +-- AI Gateway
  +-- Encryption
  +-- Risk Engine
  +-- Audit

LATER DESKTOP CLIENT
  |
  +-- Exam Center
  +-- Authentication
  +-- Release
  +-- Decryption
  +-- Distribution
```

------------------------------------------------------------------------

# MVP Success Criteria

The MVP is successful when a professor can:

1.  Log in.
2.  Create/select a subject.
3.  Enter a syllabus.
4.  Add/manage questions.
5.  Configure paper constraints.
6.  Generate candidate questions with AI.
7.  Detect duplicate/similar questions.
8.  Reject out-of-syllabus questions.
9.  Review and approve a paper.
10. Lock and encrypt the paper.

And the security system can:

11. Deny unauthorized access.
12. Prevent early release.
13. Record important security events.
14. Generate a risk score for suspicious activity.
15. Produce an institution/session/document watermark.

------------------------------------------------------------------------

# Project Positioning

The project should be presented as:

> **A secure, AI-assisted examination platform that helps authorized
> faculty generate and validate balanced question papers while keeping
> sensitive examination data under controlled application
> infrastructure.**

It should not be presented as a claim that AI or encryption can make
examination leaks impossible.
