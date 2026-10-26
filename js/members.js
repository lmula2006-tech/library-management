export function registerMember(store, fields) {
  const name = String(fields.name || '').trim();
  const email = String(fields.email || '').trim();
  const phone = String(fields.phone || '').trim();
  if (!name) throw new Error('Enter the member’s full name.');
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Enter a valid email address or leave it empty.');
  return store.update(data => {
    const highest = data.members.reduce((max, m) => Math.max(max, Number(m.id.slice(4))), 0);
    if (!Number.isSafeInteger(highest + 1)) throw new Error('Member ID limit reached.');
    const member = { id: `LIB-${String(highest + 1).padStart(4, '0')}`, name, email, phone, createdAt: new Date().toISOString() };
    data.members.push(member); return member;
  });
}
