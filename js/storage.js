export const STORAGE_KEY = "chapter-library-v1";
export const emptyData = () => ({
  version: 1,
  members: [],
  books: [],
  loans: [],
});
const fail = (message) => {
  throw new Error(message);
};
const text = (v, max, required = false) =>
  typeof v === "string" &&
  v.length <= max &&
  (!required || v.trim().length > 0);
const date = (v) =>
  typeof v === "string" &&
  /^\d{4}-\d{2}-\d{2}T/.test(v) &&
  Number.isFinite(Date.parse(v));
export function validateData(value) {
  if (
    !value ||
    value.version !== 1 ||
    !["members", "books", "loans"].every((k) => Array.isArray(value[k]))
  )
    fail("Unsupported or incomplete backup. Use a Chapter version 1 export.");
  const ids = new Set(),
    members = new Set(),
    books = new Map(),
    pairs = new Set(),
    counts = new Map();
  const unique = (id) => {
    if (!text(id, 100, true) || ids.has(id))
      fail("Records must have unique, valid IDs.");
    ids.add(id);
  };
  for (const m of value.members) {
    if (
      !m ||
      !/^LIB-\d{4,}$/.test(m.id) ||
      !text(m.name, 150, true) ||
      !text(m.email, 254) ||
      !text(m.phone, 50) ||
      !date(m.createdAt)
    )
      fail("Invalid member record.");
    unique(m.id);
    members.add(m.id);
  }
  for (const b of value.books) {
    if (
      !b ||
      !text(b.title, 200, true) ||
      !text(b.author, 150, true) ||
      !text(b.category, 80) ||
      !text(b.description, 2000) ||
      !Number.isSafeInteger(b.copies) ||
      b.copies < 1 ||
      b.copies > 100000 ||
      !date(b.createdAt)
    )
      fail(
        "Invalid book record. Copies must be a whole number from 1 to 100,000.",
      );
    unique(b.id);
    books.set(b.id, b);
  }
  for (const l of value.loans) {
    if (
      !l ||
      !members.has(l.memberId) ||
      !books.has(l.bookId) ||
      !date(l.borrowedAt) ||
      !(
        l.returnedAt === null ||
        (date(l.returnedAt) &&
          Date.parse(l.returnedAt) >= Date.parse(l.borrowedAt))
      )
    )
      fail("Invalid loan or missing linked member/book.");
    unique(l.id);
    if (l.returnedAt === null) {
      const pair = `${l.memberId}:${l.bookId}`;
      if (pairs.has(pair))
        fail("A member cannot have two active loans of the same title.");
      pairs.add(pair);
      counts.set(l.bookId, (counts.get(l.bookId) || 0) + 1);
    }
  }
  for (const [id, count] of counts)
    if (count > books.get(id).copies)
      fail("Active loans exceed the book’s total copies.");
  // Return only supported fields; never retain unexpected backup properties.
  return {
    version: 1,
    members: value.members.map(({ id, name, email, phone, createdAt }) => ({
      id,
      name,
      email,
      phone,
      createdAt,
    })),
    books: value.books.map(
      ({ id, title, author, category, description, copies, createdAt }) => ({
        id,
        title,
        author,
        category,
        description,
        copies,
        createdAt,
      }),
    ),
    loans: value.loans.map(
      ({ id, memberId, bookId, borrowedAt, returnedAt }) => ({
        id,
        memberId,
        bookId,
        borrowedAt,
        returnedAt,
      }),
    ),
  };
}
export function createStore(storage) {
  let data = emptyData(),
    raw = null,
    blocked = false,
    issue = "";
  function load() {
    try {
      raw = storage.getItem(STORAGE_KEY);
      data = raw === null ? emptyData() : validateData(JSON.parse(raw));
      blocked = false;
      issue = "";
    } catch {
      blocked = true;
      issue =
        "Saved data could not be read. Your original data has been preserved. Export the original data in Backup, then restore a valid backup to continue.";
    }
    return { data: structuredClone(data), blocked, issue };
  }
  function persist(next, replace = false) {
    if (blocked && !replace) fail(issue);
    const clean = validateData(next);
    try {
      const current = storage.getItem(STORAGE_KEY);
      if (current !== raw)
        fail(
          "Library data changed in another tab. Refresh before trying again.",
        );
      const serialized = JSON.stringify(clean);
      storage.setItem(STORAGE_KEY, serialized);
      raw = serialized;
    } catch (error) {
      if (error.message.includes("another tab")) throw error;
      fail(
        "Could not save to this browser. Storage may be full or blocked. No changes were made. Export a backup and check browser settings.",
      );
    }
    data = clean;
    blocked = false;
    issue = "";
    return structuredClone(data);
  }
  load();
  return {
    load,
    snapshot: () => structuredClone(data),
    status: () => ({ blocked, issue }),
    original: () => raw,
    update(fn) {
      const next = structuredClone(data);
      const result = fn(next);
      persist(next);
      return result;
    },
    restore: (next) => persist(next, true),
  };
}
