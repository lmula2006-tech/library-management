# Verification record

Date: 26 October 2026 (Africa/Nairobi).

## Core rules

`npm test`: **20 passed, 0 failed**, using Node.js’s built-in test runner. No third-party test dependency.

Coverage includes unique member IDs; required names and optional contacts; five-copy inventory with two borrowers and a return; unknown IDs; duplicate/repeated borrowing; unavailable titles; different titles for one member; repeat returns; inventory reductions; required book fields and copy limits; exact state reload; dashboard counts; invalid stored schemas, duplicates, orphans, timestamps, excess active loans and unknown versions; malformed startup preservation; storage access/write failures; stale tabs; explicit sample loading; isolated snapshots.

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

The storage key and data schema are unchanged, so application updates continue to use existing records. Startup never overwrites data; malformed records remain untouched and editing is blocked with a plain-language error. Failed writes do not report success.

## Deployment

- Public repository: `oscar-mugambi/library-management`, default branch `main`.
- GitHub Pages publishes the repository root from `main`.
- Custom site: https://library.cosmicpenguin.xyz/.
- GitHub Pages project URL: https://oscar-mugambi.github.io/library-management/.
- DigitalOcean provides DNS only: `library` CNAME → `oscar-mugambi.github.io.`, TTL 300 seconds. Unrelated DNS records are unchanged.
- HTTPS certificate is approved and HTTPS enforcement is enabled. The custom HTTPS document returns HTTP 200 with normal certificate validation; HTTP redirects to HTTPS.
- Initial deployment browser checks verified registration, sample inventory, borrowing, returning, history and refresh persistence on the public HTTPS origin.

## Test limits

Full browser-process restart has not been performed because closing the user’s browser would interrupt unrelated work. Page refresh, tab close/reopen and fresh storage-layer instances were tested. VS Code Live Server instructions are documented; local browser checks used Python’s static HTTP server.
