# Assignment Notes

## Overview

This document describes the technical approach and implementation decisions made to complete the assignment.

The main objective was to integrate Supabase into the existing project, persist user swipe interactions, and implement reciprocal match detection.

The work was developed incrementally following a clear evolution:

1. Supabase setup
2. Swipe persistence
3. Match verification logic
4. Reciprocal match detection refinement

---

## Implementation Timeline

### 1. Supabase Integration

- Added `@supabase/supabase-js` dependency.
- Created a Supabase client in `services/supabase.ts`.
- Integrated Supabase into `App.tsx` with a connection test.

This ensured the backend connection was properly established before building business logic.

---

### 2. Swipe Persistence

- Implemented a swipe service layer for Supabase integration.
- Persisted both left and right swipes.
- Added explicit error handling during persistence.

A dedicated service layer was introduced to separate database logic from UI logic, improving maintainability and clarity.

---

### 3. Reciprocal Match Verification

- Implemented a match verification service.
- Added reciprocal match detection logic.

Match detection works by verifying whether a reverse positive swipe already exists in the database.

Flow:

- User A swipes right on User B.
- The swipe is stored in the `swipes` table.
- The system checks if User B has already swiped right on User A.
- If so, a match is confirmed.

---

## Database Design

A single `swipes` table is used to store user interactions:

- `user_id` (string)
- `liked_user_id` (string)
- `liked` (boolean)

### Why No `matches` Table?

Instead of introducing a separate `matches` table, reciprocal verification is performed via query.

For the scope of this assignment:

- A single query is sufficient.
- It avoids redundant data storage.
- It keeps the schema simple.
- It aligns with MVP principles.

This avoids premature optimization while maintaining correct business logic.

---

## Architectural Decisions

### Service Layer Abstraction

Database operations are abstracted into a dedicated swipe/match service layer.

Benefits:

- Clear separation of concerns
- Improved readability
- Easier future refactoring
- Better testability

### Error Handling

Explicit error handling was added during swipe persistence and match verification to ensure:

- Failures are not silent
- Application state remains consistent

---

## Trade-offs

This implementation prioritizes:

- Simplicity
- Clarity
- Maintainability

Over:

- Performance optimization at scale

For large-scale production systems, additional optimizations would be required.

---

## Possible Improvements

If the system were to scale, the following enhancements could be considered:

- Introduce a dedicated `matches` table for performance optimization.
- Add a unique constraint to prevent duplicate swipes.
- Add database indexes for faster reciprocal lookup.
- Implement authentication instead of a fixed user ID.
- Add automated tests for swipe and match logic.

---

## Final Considerations

The goal of this implementation was to:

- Properly integrate a backend service (Supabase)
- Persist user interactions reliably
- Implement correct reciprocal match detection
- Maintain clean and organized architecture

The result is a clean MVP with a clear evolution path toward production readiness.
