import { availableFor } from './books.js';
export function borrowBook(store, bookId, memberId) {
  return store.update(data => {
    const member = data.members.find(m => m.id === String(memberId).trim().toUpperCase());
    const book = data.books.find(b => b.id === bookId);
    if (!member) throw new Error('Library ID not found. Register the member first, then try again.');
    if (!book) throw new Error('This book could not be found.');
    if (data.loans.some(l => l.bookId === bookId && l.memberId === member.id && l.returnedAt === null)) throw new Error('This member already has an active loan of this title.');
    if (availableFor(data, book) < 1) throw new Error('All copies of this book are currently borrowed.');
    const loan = {id:`LN-${crypto.randomUUID()}`,bookId,memberId:member.id,borrowedAt:new Date().toISOString(),returnedAt:null};
    data.loans.push(loan); return loan;
  });
}
export function returnBook(store, loanId) {
  return store.update(data => {
    const loan = data.loans.find(l => l.id === loanId);
    if (!loan) throw new Error('This loan could not be found.');
    if (loan.returnedAt !== null) throw new Error('This book has already been returned.');
    loan.returnedAt = new Date(Math.max(Date.now(), Date.parse(loan.borrowedAt))).toISOString(); return loan;
  });
}
export function statistics(data) {
  const copies = data.books.reduce((total, book) => total + book.copies, 0);
  const borrowed = data.loans.filter(l => l.returnedAt === null).length;
  return {members:data.members.length, titles:data.books.length, copies, borrowed, available:copies-borrowed};
}
