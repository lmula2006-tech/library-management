export const activeFor = (data, bookId) => data.loans.filter(l => l.bookId === bookId && l.returnedAt === null).length;
export const availableFor = (data, book) => book.copies - activeFor(data, book.id);
export function saveBook(store, fields, id) {
  const title = String(fields.title || '').trim(), author = String(fields.author || '').trim();
  const copies = Number(fields.copies);
  if (!title || !author) throw new Error('Enter both a title and an author.');
  if (!Number.isSafeInteger(copies) || copies < 1 || copies > 100000) throw new Error('Copies must be a whole number from 1 to 100,000.');
  return store.update(data => {
    const current = id ? data.books.find(b => b.id === id) : null;
    if (id && !current) throw new Error('This book could not be found.');
    if (current && copies < activeFor(data, id)) throw new Error('Total copies cannot be fewer than the copies currently borrowed.');
    const book = { id: current?.id || `BK-${crypto.randomUUID()}`, title, author, category: String(fields.category || '').trim(), description: String(fields.description || '').trim(), copies, createdAt: current?.createdAt || new Date().toISOString() };
    if (current) Object.assign(current, book); else data.books.push(book);
    return book;
  });
}
export const demoBooks = [
  ['Things Fall Apart', 'Chinua Achebe', 'Fiction', 5, 'A powerful portrait of life in an Igbo village, and a world on the edge of change.'],
  ['The Alchemist', 'Paulo Coelho', 'Fiction', 3, 'A young shepherd follows a dream across the desert, discovering the wisdom of the journey.'],
  ['A Grain of Wheat', 'Ngũgĩ wa Thiong’o', 'Fiction', 4, 'Interwoven lives and hidden histories on the eve of Kenyan independence.'],
  ['The Psychology of Money', 'Morgan Housel', 'Personal growth', 2, 'Timeless lessons on wealth, greed, happiness, and the choices we make.'],
  ['A Brief History of Time', 'Stephen Hawking', 'Science', 2, 'An inviting exploration of the universe, from the big bang to black holes.'],
  ['Becoming', 'Michelle Obama', 'Biography', 3, 'A candid reflection on the experiences that shape a life.']
];
export function loadDemoBooks(store) {
  store.update(data => {
    if (data.books.length || data.members.length || data.loans.length) throw new Error('Sample books can only be added to an entirely empty library.');
    data.books = demoBooks.map(([title, author, category, copies, description]) => ({id: `BK-${crypto.randomUUID()}`,title,author,category,copies,description,createdAt:new Date().toISOString()}));
  });
}
