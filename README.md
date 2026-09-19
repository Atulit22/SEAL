# SEAL --- Secure Examination System

## Overview

SEAL is a final-year academic project for an **AKTU-style secure
examination workflow**.

It combines:

-   AI-assisted question-paper generation
-   Syllabus-aware question selection
-   Difficulty balancing
-   Semantic duplicate detection
-   Teacher approval
-   Paper versioning
-   Encrypted question-paper storage
-   Controlled exam-time release
-   Authentication and role-based access
-   Suspicious-access monitoring
-   Risk scoring
-   Audit logging
-   Institution-specific document traceability
-   Optional AI-assisted answer evaluation

The goal is to demonstrate how AI can assist examination workflows
**without making the AI service the owner of sensitive examination
data**.

> This is an academic prototype. It must not claim official AKTU
> integration or guaranteed leak prevention unless such
> integration/guarantee actually exists.

------------------------------------------------------------------------

## Architecture

SEAL is **web-first**.

``` text
                 WEB APPLICATION
                       |
        +--------------+--------------+
        |                             |
   React Frontend               Node Backend
                                      |
                              PostgreSQL
                                      |
                               AI Service
                                      |
                            Security/Audit
                                      |
                              Encrypted Papers
                                      |
                         Later: Exam Center
                           Tauri Desktop
```

### Web App

The main application handles:

-   Authentication
-   Dashboards
-   College management
-   Subjects
-   Syllabus
-   Question bank
-   AI paper generation
-   Paper review
-   Security
-   Audit logs

### Desktop App

A later Tauri application will be used only for the exam-center
workflow:

-   Secure authentication
-   College/device verification
-   Release-condition checking
-   Controlled decryption
-   Display/printing
-   Release auditing

------------------------------------------------------------------------

## Core Principle

> **The AI is a processing tool, not the examination database.**

Sensitive data remains under the application's secure backend.

``` text
Secure Database
      |
      | minimum required context
      v
    AI
      |
      | result
      v
Validation
      |
      v
Secure Database
```

------------------------------------------------------------------------

## Main Workflow

``` text
Professor
   ↓
Syllabus + Question Bank
   ↓
Exam Configuration
   ↓
AI-assisted Question Generation
   ↓
Syllabus Validation
   ↓
Difficulty Validation
   ↓
Semantic Duplicate Detection
   ↓
Teacher Review
   ↓
Paper Approval
   ↓
Paper Lock
   ↓
Encryption
   ↓
Secure Storage
   ↓
Exam Center Authorization
   ↓
Release Conditions
   ↓
Controlled Decryption
   ↓
Distribution
```

------------------------------------------------------------------------

## Security Workflow

``` text
Access Request
      ↓
Authentication
      ↓
Authorization
      ↓
College Verification
      ↓
Device/Network Checks
      ↓
Time/Behavior Checks
      ↓
Risk Score
      ↓
Allow / Deny / Escalate
      ↓
Audit Event
```

Example:

``` text
03:17 AM
Unknown device
Unrecognized network
Attempt to access encrypted paper

→ HIGH RISK
→ ACCESS DENIED
→ INCIDENT RECORDED
```

Risk scoring is an investigation signal, not proof of malicious
behavior.

------------------------------------------------------------------------

## Main Modules

### Authentication and RBAC

Roles:

-   University Admin
-   College Admin
-   Question Setter
-   Examiner
-   Exam Center Operator
-   Auditor

### Syllabus

-   Subjects
-   Units
-   Topics
-   Marks
-   Course/program
-   Academic session

### Question Bank

Each question may contain:

``` text
Question ID
Subject
Unit
Topic
Marks
Difficulty
Question Type
Source
Status
Version
```

### AI Question Engine

AI can assist with:

-   Generation
-   Rewriting
-   Difficulty estimation
-   Syllabus relevance
-   Similarity analysis

Hard constraints remain backend-controlled.

### Duplicate Detection

Use semantic similarity, not only exact text matching.

Example:

> Explain the advantages of normalization.

and

> Discuss the benefits of database normalization.

should be flagged as potentially similar.

### Paper Security

After approval:

1.  Paper is locked.
2.  Paper is encrypted.
3.  Ciphertext is stored securely.
4.  Decryption permission is controlled.
5.  Release/decryption is audited.

### Security Monitoring

Monitor:

-   Login attempts
-   Paper access
-   Decryption requests
-   Administrative actions
-   Device/network changes
-   Unusual access times
-   Repeated attempts

### Traceability

Final papers can contain:

``` text
College ID
Exam Session
Paper ID
Version
```

Watermarking provides traceability but does not guarantee leak-source
identification.

------------------------------------------------------------------------

## Technology

### Frontend

-   React
-   TypeScript
-   Vite
-   Tailwind CSS
-   React Router

### Backend

-   Node.js
-   TypeScript
-   Fastify

### Database

-   PostgreSQL
-   Prisma

### Validation

-   Zod

### AI

AI is accessed through the backend.

Never expose privileged AI credentials to the browser.

### Desktop

Later:

-   Tauri
-   React
-   TypeScript

------------------------------------------------------------------------

## Current Status

The project currently has the initial web foundation:

-   Vite
-   React
-   TypeScript
-   Tailwind CSS
-   React Router
-   Feature-oriented source structure
-   Initial routing
-   Login UI foundation

The next development goal is:

``` text
Frontend Shell
    ↓
Backend Foundation
    ↓
Database
    ↓
Real Authentication
    ↓
Syllabus Management
```

------------------------------------------------------------------------

## Scope

See:

-   `SCOPE.md` for project boundaries.
-   `TASK.md` for implementation phases.
-   `CLAUDE.md` for Claude development instructions.
-   `AGENT.md` for coding/agent rules.

------------------------------------------------------------------------

## Git Rule

Do not commit or push automatically.

Git mutations require explicit user instruction.
