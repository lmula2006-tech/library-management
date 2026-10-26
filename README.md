# Chapter · Library Management

A small, friendly library workspace built with HTML5, CSS3 and vanilla JavaScript modules. Register readers, organize a catalogue with multiple physical copies, borrow and return books, and explore borrowing history. Records save automatically in the browser. No backend, login, frameworks, database, payments, due dates or fines.

- **Live site:** https://library.cosmicpenguin.xyz/
- **Source code:** https://github.com/lmula2006-tech/library-management
- **Original repository link:** https://github.com/oscar-mugambi/library-management (redirects to the new owner’s repository)
- **GitHub Pages address:** https://lmula2006-tech.github.io/library-management/ (uses the custom domain once Pages is configured)

## Start here: a beginner’s guide for Lmula

GitHub stores the project’s files online. A **repository** is the project folder on GitHub. Your computer can have its own copy of that folder, where you edit and run the project.

### 1. Find your project

The ownership transfer is complete. The project is called **library-management** and belongs to **lmula2006-tech**.

1. Sign in to GitHub as **lmula2006-tech**.
2. Open [your repository](https://github.com/lmula2006-tech/library-management). You should see **lmula2006-tech / library-management** at the top.
3. You can also click your profile picture, choose **Your repositories**, and look for **library-management**.
4. Scroll down on the repository’s main page to read this guide.

The repository already contains the code and its change history. The custom domain and DigitalOcean account remain managed separately by Oscar.

### 2. Get the code: easiest option

If you just want to run the project or submit its files:

1. Open [your repository](https://github.com/lmula2006-tech/library-management).
2. Click the green **Code** button, then **Download ZIP**.
3. Find the ZIP in your Downloads folder.
4. Right-click it and choose **Extract All** on Windows, or double-click it on macOS. Work in the extracted folder, not inside the ZIP.
5. The project folder should contain `index.html`, `css`, `js`, and this `README.md`.

A ZIP is a snapshot of the code. Editing that downloaded copy does not update GitHub or the live website. Use GitHub Desktop below if you want to publish your changes.

### 3. Open and run it in VS Code

1. Install [Visual Studio Code](https://code.visualstudio.com/).
2. Open VS Code, choose **File → Open Folder**, and select the extracted project folder. On macOS the command may appear as **File → Open…**.
3. Open **Extensions** in the left sidebar. Search for **Live Server** and install the extension by **Ritwick Dey**.
4. In VS Code’s file list, right-click `index.html` and choose **Open with Live Server**.
5. The library should open in your browser. A completely empty library starts with eight classic books.
6. Open **Members**, register a name, note the generated library ID, then borrow a book from **Book catalogue**. Use **Loans & history** to return it.

Do not open `index.html` by double-clicking it in your file manager. This project uses JavaScript modules, so it needs Live Server. You do not need to install Node.js, run `npm install`, or set up a database to use the app. Node.js is only needed if you choose to run the optional code tests.

Your library records stay in the browser and website address you used. The local VS Code preview and the public website have separate records. Keep using the same local address and browser; clearing that site’s browser data removes its records.

### 4. Edit and publish: GitHub Desktop option

[GitHub Desktop](https://desktop.github.com/) is a convenient option on Windows and macOS. It avoids needing Git terminal commands. On other operating systems, Git and VS Code’s Source Control can perform the same steps.

1. Install GitHub Desktop and sign in as **lmula2006-tech**.
2. Choose **File → Clone repository → URL**.
3. Enter `https://github.com/lmula2006-tech/library-management.git`, choose a local folder, then click **Clone**. Cloning downloads the code and connects that folder to your GitHub repository.
4. Choose **Repository → Open in Visual Studio Code**. If it offers another editor, set VS Code under GitHub Desktop’s default-editor preferences, or open the cloned folder directly from VS Code.
5. Use this cloned folder for your edits instead of the ZIP copy. Before starting new work, use **Fetch origin** and **Pull origin** if Desktop offers it, to get changes made elsewhere.
6. Edit a file and save it in VS Code. Test the app with Live Server.
7. Return to GitHub Desktop and review the changed files. Enter a short **Summary**, such as `Update library colours`.
8. Click **Commit to main**. A commit records a checkpoint on your computer.
9. Click **Push origin**. This uploads your committed changes to GitHub.
10. On GitHub, open the repository’s **Actions** tab. Wait for the **pages build and deployment** run for your change to finish successfully, then check [the live website](https://library.cosmicpenguin.xyz/).

**Save → Commit → Push:** saving changes the file on your computer, committing records the change locally, and pushing sends it to GitHub. Downloading a ZIP or pressing Save alone does not change the public website.

### 5. Which files should I change?

| What you want to change                                | File                             |
| ------------------------------------------------------ | -------------------------------- |
| Page title, sidebar labels, or the main HTML structure | `index.html`                     |
| Colours, spacing, fonts, and layout                    | `css/styles.css`                 |
| The eight default books, authors, and copy counts      | `js/books.js`, in `defaultBooks` |
| Page content, forms, and button behaviour              | `js/app.js`                      |
| Member registration and library IDs                    | `js/members.js`                  |
| Borrowing and returning rules                          | `js/loans.js`                    |
| Browser saving and data validation                     | `js/storage.js`                  |

For JavaScript or CSS updates, increase the `?v=3` version in `index.html` and the versioned imports in `js/app.js` and `js/loans.js` together, for example to `?v=4`. This tells browsers to load the updated files. Keep the same version in all those asset references.

Changing `defaultBooks` only affects a completely empty library. To change books already saved in your browser, use the app’s **Add a book** or edit buttons. You can test new defaults in another browser without erasing your existing records.

### 6. Check hosting

1. Open **your repository → Settings → Pages**.
2. The publishing source should be **Deploy from a branch**, branch **main**, folder **/ (root)**.
3. To keep the current address, leave the `CNAME` file and custom-domain setting as `library.cosmicpenguin.xyz`.
4. DigitalOcean’s existing `library` CNAME record points to **lmula2006-tech.github.io.** Oscar manages that DNS account; ask him to check the record if the custom address stops working. Do not create a duplicate record or change unrelated DNS records.
5. Check that **Enforce HTTPS** is enabled after GitHub’s domain check succeeds. If GitHub needs a new certificate, provisioning can take time.
6. Open the public site and test the catalogue, registration and a borrow/return transaction.

Transferring the code does not automatically transfer the domain account. If the site stops loading, send Oscar the Pages error message so he can check the domain connection. The technical reference below explains the project in more detail.

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

## Local development reference

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
- DigitalOcean DNS record: type **CNAME**, hostname **library**, TTL **300** seconds. Its target is **lmula2006-tech.github.io.**.
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
