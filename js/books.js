export const activeFor = (data, bookId) =>
  data.loans.filter((l) => l.bookId === bookId && l.returnedAt === null).length;
export const availableFor = (data, book) =>
  book.copies - activeFor(data, book.id);
export function saveBook(store, fields, id) {
  const title = String(fields.title || "").trim(),
    author = String(fields.author || "").trim();
  const copies = Number(fields.copies);
  if (!title || !author) throw new Error("Enter both a title and an author.");
  if (!Number.isSafeInteger(copies) || copies < 1 || copies > 100000)
    throw new Error("Copies must be a whole number from 1 to 100,000.");
  return store.update((data) => {
    const current = id ? data.books.find((b) => b.id === id) : null;
    if (id && !current) throw new Error("This book could not be found.");
    if (current && copies < activeFor(data, id))
      throw new Error(
        "Total copies cannot be fewer than the copies currently borrowed.",
      );
    const book = {
      id: current?.id || `BK-${crypto.randomUUID()}`,
      title,
      author,
      category: String(fields.category || "").trim(),
      description: String(fields.description || "").trim(),
      copies,
      createdAt: current?.createdAt || new Date().toISOString(),
    };
    if (current) Object.assign(current, book);
    else data.books.push(book);
    return book;
  });
}
// A small starting collection for a new, completely empty library.
export const defaultBooks = [
  [
    "Things Fall Apart",
    "Chinua Achebe",
    "Fiction",
    5,
    "A village in Nigeria faces change through the story of Okonkwo and his family.",
  ],
  [
    "A Grain of Wheat",
    "Ngũgĩ wa Thiong’o",
    "Fiction",
    4,
    "Lives, loyalties and hidden histories intertwine on the eve of Kenyan independence.",
  ],
  [
    "The River Between",
    "Ngũgĩ wa Thiong’o",
    "Fiction",
    3,
    "A young man tries to unite two communities divided by tradition and change.",
  ],
  [
    "Pride and Prejudice",
    "Jane Austen",
    "Fiction",
    3,
    "Elizabeth Bennet navigates family expectations, first impressions and love.",
  ],
  [
    "Animal Farm",
    "George Orwell",
    "Fiction",
    3,
    "A farmyard rebellion becomes a fable about power and broken promises.",
  ],
  [
    "To Kill a Mockingbird",
    "Harper Lee",
    "Fiction",
    3,
    "Scout Finch grows up in a small Southern town and learns about courage and injustice.",
  ],
  [
    "Jane Eyre",
    "Charlotte Brontë",
    "Fiction",
    3,
    "An orphaned girl grows into an independent woman determined to choose her own path.",
  ],
  [
    "Treasure Island",
    "Robert Louis Stevenson",
    "Fiction",
    3,
    "A mysterious map takes young Jim Hawkins on an adventure among pirates.",
  ],
];

export function seedDefaultBooks(store) {
  const data = store.snapshot();
  if (
    store.status().blocked ||
    data.books.length ||
    data.members.length ||
    data.loans.length
  ) {
    return false;
  }
  store.update((next) => {
    next.books = defaultBooks.map(
      ([title, author, category, copies, description]) => ({
        id: `BK-${crypto.randomUUID()}`,
        title,
        author,
        category,
        copies,
        description,
        createdAt: new Date().toISOString(),
      }),
    );
  });
  return true;
}
