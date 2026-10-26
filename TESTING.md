# Verification record

Date: 26 October 2026 (Africa/Nairobi).

## Core rules

`npm test`: **21 passed, 0 failed**, using Node.js’s built-in test runner. No third-party test dependency.

Coverage includes unique member IDs; required names and optional contacts; five-copy inventory with two borrowers and a return; unknown IDs; duplicate/repeated borrowing; unavailable titles; different titles for one member; repeat returns; inventory reductions; required book fields and copy limits; exact state reload; dashboard counts; complete JSON restore; invalid schema, duplicates, orphans, timestamps, excess active loans and unknown versions; corrupt startup recovery; storage access/write failures; stale tabs; explicit sample loading; isolated snapshots.

## Browser acceptance

Verified in Brave via browser automation on localhost:

- Registered Amina Wanjiku as `LIB-0001` and Brian Otieno as `LIB-0002`.
- Added _Things Fall Apart_ with five copies.
- Borrowed once for each member: dashboard showed 2 members, 1 title, 5 total, 3 available and 2 borrowed.
- Rejected duplicate borrowing by the same member and unknown `LIB-9999` with visible error messages.
- Rejected reducing copies to 1 while 2 were borrowed.
- Confirmed a return: available increased to 4 and borrowed decreased to 1.
- Refreshed the page: both members, the book, loans and statistics persisted.

Additional browser checks passed:

- Returned-history filter retained Brian’s transaction and displayed both timestamps.
- Member search by `LIB-0002` opened Brian’s individual returned history.
- Downloaded a real JSON backup and verified its 2 members, 1 title, 5 copies, 2 transactions and 1 active loan.
- Restored that file through the file chooser into a second browser (Codex in-app browser); dashboard totals matched.
- Rejected malformed JSON and a valid JSON file with an orphaned member reference. Existing counts stayed unchanged.
- Reduced the title to exactly 1 active copy: borrowing became disabled. Available-only filter showed zero titles; all-copies-borrowed filter and author search showed the correct title. Restored copies to 5 afterward.
- Tested the mobile dashboard and catalogue at 390 × 844. The document did not overflow horizontally; the navigation strip and wide data tables use their own scrolling areas. Reset the temporary viewport afterward.
- Confirmed registration focuses the name field; Escape closes the dialog and returns focus to its initiating button. Saving a book returns focus to that book’s edit button.
- Closed and reopened the in-app browser tab: records and the dashboard’s 2 / 1 / 5 / 4 / 1 counts persisted.

Full browser-process restart has **not** been performed because closing the user’s browser would interrupt unrelated work. Page refresh, tab close/reopen and fresh storage-layer instances have been tested. VS Code Live Server instructions are documented; the local static application was served with Python’s HTTP server.

## Deployment

- Created public `oscar-mugambi/library-management` repository; pushed source to default branch `main`.
- GitHub Pages publishes from `main`, repository root; initial Pages build completed successfully.
- Approved custom hostname: `library.cosmicpenguin.xyz`.
- Inspected DigitalOcean’s existing domain and filtered existing records before adding a CNAME. No conflicting library record existed. Saved exactly one CNAME, `library` → `oscar-mugambi.github.io.`, TTL 300 seconds. No unrelated DNS records changed.
- DigitalOcean remains DNS-only. Authoritative nameservers and public resolvers (Google and Cloudflare) resolve the CNAME and GitHub Pages A records correctly.
- The GitHub Pages hostname redirects to the custom domain, and custom-domain HTTP serves the application from GitHub.
- GitHub’s initial cached DNS failure was retried through **Check again**, which requested a TLS certificate. Final HTTPS and deployed-browser verification are pending certificate provisioning and will be recorded before delivery.
