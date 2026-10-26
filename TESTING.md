# Verification record

Date: 26 October 2026 (Africa/Nairobi).

## Core rules

`npm test`: **24 passed, 0 failed**, using Node.js’s built-in test runner. No third-party test dependency.

Coverage includes unique member IDs; required names and optional contacts; five-copy inventory with two borrowers and a return; unknown IDs; duplicate/repeated borrowing; unavailable titles; different titles for one member; repeat returns; inventory reductions; required book fields and copy limits; exact state reload; dashboard counts; invalid stored schemas, duplicates, orphans, timestamps, excess active loans and unknown versions; malformed startup preservation; storage access/write failures; stale tabs; safe first-visit loading; isolated snapshots.

## Simplified interface checks

Verified locally in the Codex in-app browser:

- Navigation has exactly four sections: Overview, Book catalogue, Members, and Loans & history.
- The sidebar describes automatic saving. No file-management controls or reminders remain.
- An old removed-section URL falls back to Overview and becomes `#dashboard`.
- Existing records from before the interface change loaded correctly: 2 members, 1 title, 5 copies and 2 active loans.
- Confirmed a return for Brian Otieno: availability increased from 3 to 4 and active loans decreased from 2 to 1.
- A second open tab updated its dashboard automatically. Refreshing retained the return and both existing members.
- Returned-history filtering retained the older and newer borrowing transactions and their timestamps.
- Checked the mobile layout at 390 × 844: the document fits the viewport, the sidebar note is hidden, and the four navigation links remain in the scrollable navigation strip. Cleared the test viewport afterward.
- Browser console reported no warnings or errors during these checks.

The storage key and data schema are unchanged, so application updates continue to use existing records. An entirely empty library receives the classic starting collection once. Startup never overwrites existing records; malformed records remain untouched and editing is blocked with a plain-language error. Failed writes do not report success.

## Default classic books

- A fresh browser origin opened directly with eight titles, 27 total copies and 27 available copies, with no manual loading step.
- Edited _The River Between_ from three copies to four and refreshed. The catalogue stayed at eight titles and retained four copies; totals became 28 instead of resetting to 27. Set the test copy count back to three afterward.
- The catalogue displays all eight titles with authors, descriptions and availability.
- Core tests additionally verify repeat initialization, preservation of existing members/books/loans and malformed records, failed storage writes, and competing first-visit tabs.
- Existing libraries are not changed automatically. Missing classic titles can be added through the normal book form without replacing existing titles.

## Deployment

- Public repository: `lmula2006-tech/library-management`, default branch `main`.
- GitHub Pages publishes the repository root from `main`.
- Custom site: https://library.cosmicpenguin.xyz/.
- GitHub Pages project URL: https://lmula2006-tech.github.io/library-management/.
- DigitalOcean provides DNS only: `library` CNAME → `lmula2006-tech.github.io.`, TTL 300 seconds. Unrelated DNS records are unchanged.
- HTTPS certificate is approved and HTTPS enforcement is enabled. The custom HTTPS document returns HTTP 200 with normal certificate validation; HTTP redirects to HTTPS.
- Initial deployment browser checks verified registration, sample inventory, borrowing, returning, history and refresh persistence on the public HTTPS origin.

## Test limits

Full browser-process restart has not been performed because closing the user’s browser would interrupt unrelated work. Page refresh, tab close/reopen and fresh storage-layer instances were tested. VS Code Live Server instructions are documented; local browser checks used Python’s static HTTP server.
