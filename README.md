# Chapter · Library Management

A small, friendly library workspace built with HTML5, CSS3 and vanilla JavaScript modules. Register readers, organize a catalogue with multiple physical copies, borrow and return books, and explore borrowing history. Records save automatically in the browser. No backend, login, frameworks, database, payments, due dates or fines.

- **Live site:** https://library.cosmicpenguin.xyz/
- **GitHub Pages address:** https://oscar-mugambi.github.io/library-management/ (redirects to the custom domain once configured)
- **Source:** https://github.com/oscar-mugambi/library-management

## Features

- Dashboard with counts calculated from actual members, titles, physical copies and active loans.
- Member registration with readable sequential IDs (`LIB-0001`), optional email/phone, searchable directory and individual borrowing history.
- Book creation and editing, categories, descriptions, search, category/availability filters, and per-title inventory.
- Borrowing by registered library ID. A member can borrow different titles, but cannot have two active loans of the same title. Repeated clicks cannot create duplicate loans.
- Confirmed returns, active/returned/all transaction views, searchable history, and borrowing/return timestamps.
- Responsive layouts, native keyboard-accessible dialogs, explicit labels, visible focus, reduced-motion support and status/error notifications.
- Eight classic books appear automatically when the library is completely empty, with 27 physical copies in total. Existing books, members and loans are never replaced.

## Technology and structure

The production application has no JavaScript dependencies and no build step. Node.js is optional and is used only for the core test runner, never as an application server. Google Fonts supplies DM Sans and Manrope; system sans-serif fallbacks work if font loading is unavailable. The book artwork is made with CSS and does not depend on remote cover images.

```text
library-management/
├── index.html
├── assets/favicon.svg
├── css/styles.css
├── js/
│   ├── app.js       # Rendering, navigation and dialogs
│   ├── storage.js   # Versioned validation and atomic persistence
│   ├── books.js     # Inventory rules and default classics
│   ├── members.js   # Registration and readable ID generation
│   └── loans.js     # Borrow/return rules and statistics
├── tests/library.test.js
├── CNAME           # Approved GitHub Pages custom hostname
├── .nojekyll
├── package.json    # Optional dependency-free core tests
├── TESTING.md
└── README.md
```

## Local development

1. Clone this repository and open its folder in VS Code.
2. Install the **Live Server** extension by Ritwick Dey.
3. Right-click `index.html` and choose **Open with Live Server**.
4. Keep using the same browser and local URL/port to access the same local records.

Native ES modules require HTTP. Opening `index.html` directly with a `file://` URL is unsupported. A Python alternative is `python3 -m http.server 4173 --bind 127.0.0.1`, then visit `http://127.0.0.1:4173`.

## Everyday use

### Register readers

Choose **Members → Register a member**. Full name is required; email and phone are optional. The generated library ID appears immediately after the record is saved. Record that ID for future borrowing. Search the directory by name or ID (email/phone also work); **View member** shows their active and returned loans.

### Manage books

Choose **Book catalogue → Add a book**. Enter a title, author and whole number of physical copies (1–100,000). Category and description are optional. The edit icon updates a title’s details. Total copies cannot be reduced below the number currently borrowed. Available copies always equal total copies minus active loans; there is no independently maintained counter.

### Borrow and return

Choose **Borrow book** on a title, enter or select a registered library ID, and choose **Confirm borrowing**. All copies borrowed, unregistered IDs and duplicate active loans are rejected. Use **Loans & history** (or the dashboard’s circulation table) to return a copy, then confirm the return. The record stays in history and the copy becomes immediately available. Active transactions are sorted newest first. History supports active, returned and all-transaction filters, plus search by title, member name or ID.

## Starting collection

New libraries start with _Things Fall Apart_, _A Grain of Wheat_, _The River Between_, _Pride and Prejudice_, _Animal Farm_, _To Kill a Mockingbird_, _Jane Eyre_ and _Treasure Island_. The collection includes multiple copies, so borrowing and availability work immediately after registering a member.

The collection is saved through the normal storage layer. Refreshing does not add duplicates or reset copy counts. A library with any existing books, members or loans is left unchanged.

## Storage and reliability

The sole persistent store is browser `localStorage`, under `chapter-library-v1`:

```json
{ "version": 1, "members": [], "books": [], "loans": [] }
```

Members include `id`, `name`, `email`, `phone` and `createdAt`. Books include `id`, `title`, `author`, `category`, `description`, `copies` and `createdAt`. Loans include `id`, `bookId`, `memberId`, `borrowedAt` and `returnedAt` (initially `null`). Timestamps are stored as ISO strings and displayed in the browser’s local time. Books and loans use browser-generated UUIDs; members use the largest existing member ID plus one.

Startup validates the saved schema, IDs, dates, references, duplicate active loans and inventory consistency. An entirely empty library receives the default classics once. Existing records are never overwritten or replenished automatically. If data cannot be read or validated, editing is blocked and the original value is preserved. Refresh the page and check browser storage permissions if a problem occurs; if it continues, ask your teacher for help. No malformed records are silently discarded.

Each mutation operates on a copy, validates the complete result, and writes the entire document before changing in-memory state or reporting success. Write failures leave the prior state intact. Another tab’s changes are detected and refreshed; a stale tab cannot silently overwrite newer records. This remains a one-browser, one-operator project: it is not a concurrent multi-user database.

**Important:** Data is not synchronized between computers, browsers, devices, local development URLs or domains. Closing a normal browser preserves localStorage; private-browsing sessions may not. Clearing browser data removes records. GitHub publishes application files only; it does not store your library’s records. Use a normal browsing window on the same device and website address to keep access to your records. All people using this browser can see member contact information.

## GitHub Pages deployment

Hosting is **GitHub Pages**, publishing branch `main` from `/` (the repository root). `.nojekyll` keeps native files/modules unmodified. All app assets use relative references, so the site works at both `/library-management/` and a custom-domain root.

To recreate deployment on another GitHub account:

1. Create a repository named `library-management` and push these files to `main`.
2. In **Settings → Pages**, choose **Deploy from a branch**, branch **main**, folder **/ (root)**.
3. Remove or update the `CNAME` file before deploying under another owner/domain.
4. Wait for the Pages build to succeed and open `https://<username>.github.io/library-management/`.

No Droplet, DigitalOcean application hosting, server or paid infrastructure is required.

## Custom domain and HTTPS

The approved hostname is `library.cosmicpenguin.xyz`. DigitalOcean is used **only for DNS**.

- GitHub Pages custom domain / repository `CNAME` file: `library.cosmicpenguin.xyz`.
- DigitalOcean DNS record: type **CNAME**, hostname **library**, target **oscar-mugambi.github.io.**, TTL **300** seconds.
- Do not point the CNAME at a GitHub repository URL or a path.
- Inspect for conflicts before creating a record; preserve all unrelated DNS records.
- Wait for GitHub’s DNS check and certificate provisioning, then enable **Enforce HTTPS** in Pages settings.
- Check `dig +short library.cosmicpenguin.xyz CNAME` and open the custom HTTPS URL. Verify styles and native modules load as well as the document.

Switching domains creates a separate browser data store. HTTPS issuance and DNS propagation can take time. Deployment verification details and any unfinished checks are recorded in `TESTING.md`.

Official references: [GitHub Pages custom domains](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site) and [DigitalOcean DNS records](https://docs.digitalocean.com/products/networking/dns/how-to/manage-records/).

## Updating the site

Edit the files, run `npm test` if Node.js is available, and check the changed workflows locally. When changing JavaScript or CSS, increment the `?v=3` asset version in `index.html` and the JavaScript module imports together so browsers load the current files. Commit and push to `main`; GitHub Pages republishes automatically. Verify the deployed site after the build. Application updates do not replace local records; avoid changing the storage key or schema without a migration. Never commit member data to the public repository.

## Tests and limitations

Run `npm test` with Node.js 22+ (no install required). The tests exercise registration, copies, borrowing, returns, history, statistics, stored-data validation, malformed records, failed storage writes, stale tabs and safe first-visit loading. See `TESTING.md` for browser acceptance results.

The application is deliberately small: no authentication/roles, remote synchronization, recovery service, book deletion, email delivery, due dates or fines. localStorage has browser-specific capacity limits and may be blocked by browser policies. Use a current browser with ES modules, `crypto.randomUUID`, `structuredClone` and native `<dialog>` support, over HTTPS (localhost is also trusted). Operate from one browser. Clearing this site’s browser data permanently removes its records.
