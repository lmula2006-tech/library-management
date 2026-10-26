# Verification record

Date: 26 October 2026 (Africa/Nairobi).

## Core rules

`npm test`: **21 passed, 0 failed**, using Node.js’s built-in test runner. No third-party test dependency.

Coverage includes unique member IDs; required names and optional contacts; five-copy inventory with two borrowers and a return; unknown IDs; duplicate/repeated borrowing; unavailable titles; different titles for one member; repeat returns; inventory reductions; required book fields and copy limits; exact state reload; dashboard counts; complete JSON restore; invalid schema, duplicates, orphans, timestamps, excess active loans and unknown versions; corrupt startup recovery; storage access/write failures; stale tabs; explicit sample loading; isolated snapshots.

## Browser acceptance

Verified in Brave via browser automation on localhost:

- Registered Amina Wanjiku as `LIB-0001` and Brian Otieno as `LIB-0002`.
- Added *Things Fall Apart* with five copies.
- Borrowed once for each member: dashboard showed 2 members, 1 title, 5 total, 3 available and 2 borrowed.
- Rejected duplicate borrowing by the same member and unknown `LIB-9999` with visible error messages.
- Rejected reducing copies to 1 while 2 were borrowed.
- Confirmed a return: available increased to 4 and borrowed decreased to 1.
- Refreshed the page: both members, the book, loans and statistics persisted.

Remaining browser/deployment verification is in progress and will be recorded before delivery. An actual full browser-process restart has not been performed; closing the user’s browser would interrupt unrelated work.
