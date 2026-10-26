import { createStore, validateData } from './storage.js';
import { registerMember } from './members.js';
import { saveBook, availableFor, activeFor, loadDemoBooks } from './books.js';
import { borrowBook, returnBook, statistics } from './loans.js';

const paths = {
 dashboard:'M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z',
 book:'M3 4h6a4 4 0 0 1 3 1.5A4 4 0 0 1 15 4h6v16h-6a4 4 0 0 0-3 1.5A4 4 0 0 0 9 20H3z M12 5.5v16',
 members:'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8 M22 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75',
 loans:'M8 3H4v4 M4 7a9 9 0 1 1-1 8 M4 7l4-4 M12 7v5l3 2',
 settings:'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8 M10 2h4l1 3 3 1 3 1v4l-2 2-1 3-2 3h-4l-2-3-3-1-3-1v-4l2-2 1-3z',
 plus:'M12 5v14 M5 12h14', arrow:'M5 12h14 M14 7l5 5-5 5', search:'M21 21l-5-5 M10 3a7 7 0 1 0 0 14 7 7 0 0 0 0-14',
 copies:'M8 8h12v13H8z M4 16H3V3h13v1', available:'M9 12l2 2 4-4 M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18',
 calendar:'M4 5h16v16H4z M4 10h16 M8 3v4 M16 3v4', edit:'M14 5l5 5 M3 21l5-1L21 7l-5-5L3 15z',
 download:'M12 3v12 M7 10l5 5 5-5 M4 16v5h16v-5', upload:'M12 16V4 M7 9l5-5 5 5 M4 16v5h16v-5', close:'M6 6l12 12 M6 18L18 6', check:'M5 12l4 4L19 6', return:'M9 10L4 5l5-4 M4 5h10a7 7 0 0 1 0 14h-3'
};
const icon = name => `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${paths[name] || paths.book}"/></svg>`;
document.querySelectorAll('[data-icon]').forEach(el => { el.innerHTML = icon(el.dataset.icon); });
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const store = createStore({ getItem: key => window.localStorage.getItem(key), setItem: (key, value) => window.localStorage.setItem(key, value) });
const main = document.querySelector('main'), modal = document.querySelector('#modal');
let page = '', query = '', bookFilter = 'all', loanFilter = 'active', categoryFilter = 'all', toastTimer, priorFocus;
const labels = {dashboard:'Overview',books:'Book catalogue',members:'Members',loans:'Loans & history',backup:'Settings & backup'};
const dateFormat = new Intl.DateTimeFormat(undefined, {day:'numeric',month:'short',year:'numeric'});
const dateTimeFormat = new Intl.DateTimeFormat(undefined, {day:'numeric',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'});
const date = value => dateFormat.format(new Date(value));
const dateTime = value => dateTimeFormat.format(new Date(value));
const initials = name => name.trim().split(/\s+/).slice(0,2).map(n => [...n][0]).join('').toUpperCase();
function notify(message, error = false) {
  const toast = document.querySelector('#toast'); clearTimeout(toastTimer);
  toast.textContent = message; toast.className = `toast visible${error?' error':''}`;
  toastTimer = setTimeout(() => { toast.className = 'toast'; }, error ? 9000 : 5000);
}
function empty(title, description, action = '', compact = false) {
  return `<div class="empty${compact?' compact':''}"><div class="empty-icon">${icon('book')}</div><h3>${title}</h3><p>${description}</p>${action}</div>`;
}
const btn = (action, label, type = 'plus', secondary = false, id = '') => `<button class="btn${secondary?' secondary':''}" data-action="${action}"${id?` data-id="${esc(id)}"`:''}>${icon(type)}${label}</button>`;
function heading(title, subtitle, action = '', eyebrow = 'YOUR LIBRARY, AT A GLANCE') {
  return `<div class="page-heading"><div><p class="eyebrow">${eyebrow}</p><h1>${title}</h1><p class="subtitle">${subtitle}</p></div>${action}</div>`;
}
function art() {
  return '<div class="hero-art" aria-hidden="true"><div class="arch"></div><div class="art-book"><span>STORIES</span></div><div class="art-book"><span>CHAPTERS</span></div><div class="art-book"><span>WONDER</span></div><div class="art-book"><span>IDEAS</span></div><div class="art-book"><span>EXPLORE</span></div><div class="shelf"></div></div>';
}
const palettes = [['#843b2e','#f1dbb5','#ebe8dc'],['#b89452','#382f25','#f0ecdf'],['#49644b','#efdfb7','#e8ece2'],['#d3c4a0','#3c5349','#efeee6'],['#3d4f65','#eee2bf','#e9ebed'],['#865e4b','#f2dfc3','#eee7e2']];
function bookCard(book, data, index, compact = false) {
  const available = availableFor(data, book), borrowed = activeFor(data, book.id), palette = palettes[index % palettes.length];
  return `<article class="book-card"><div class="cover-stage" style="background:${palette[2]}"><div class="book-cover" aria-hidden="true" style="--cover:${palette[0]};--cover-ink:${palette[1]}"><span class="cover-title">${esc(book.title)}</span><span class="cover-mark">✳</span><span class="cover-author">${esc(book.author)}</span></div><span class="pill ${available?'active':'unavailable'}">${available?'Available':'All borrowed'}</span></div><div class="book-info"><div class="book-category">${esc(book.category || 'Uncategorized')}</div><h3>${esc(book.title)}</h3><p class="book-author">by ${esc(book.author)}</p>${!compact&&book.description?`<p class="book-description">${esc(book.description)}</p>`:''}<div class="book-inventory"><span><strong>${available}</strong> available</span><span>${borrowed} borrowed</span><span>${book.copies} total</span></div><div class="book-actions"><button class="btn tertiary" data-action="borrow" data-id="${esc(book.id)}" ${available?'':'disabled'} aria-label="Borrow ${esc(book.title)}">${icon('plus')} Borrow book</button><button class="icon-btn" data-action="edit-book" data-id="${esc(book.id)}" aria-label="Edit ${esc(book.title)}">${icon('edit')}</button></div></div></article>`;
}
function loanTable(loans, data, {compact = false, profile = false} = {}) {
  if (!loans.length) return empty('No loans here yet', 'Borrow a book from the catalogue and it will appear here.', `<a class="btn secondary" href="#books">Explore catalogue ${icon('arrow')}</a>`, compact);
  return `<div class="table-wrap"><table><thead><tr><th>Book title</th>${profile?'':'<th>Member</th>'}<th>Borrowed</th><th>Status</th>${compact?'':'<th>Returned</th>'}<th><span class="sr-only">Action</span></th></tr></thead><tbody>${loans.map(l => {
    const book = data.books.find(b => b.id === l.bookId), member = data.members.find(m => m.id === l.memberId);
    return `<tr><td><span class="table-title">${esc(book.title)}</span><span class="table-sub">${esc(book.author)}</span></td>${profile?'':`<td><span class="table-title">${esc(member.name)}</span><span class="member-id">${esc(member.id)}</span></td>`}<td><time datetime="${esc(l.borrowedAt)}" title="${esc(dateTime(l.borrowedAt))}">${esc(compact?date(l.borrowedAt):dateTime(l.borrowedAt))}</time></td><td><span class="pill ${l.returnedAt?'returned':'active'}">${l.returnedAt?'Returned':'On loan'}</span></td>${compact?'':`<td>${l.returnedAt?`<time datetime="${esc(l.returnedAt)}">${esc(dateTime(l.returnedAt))}</time>`:'—'}</td>`}<td>${l.returnedAt?'':`<button class="btn secondary small" data-action="return" data-id="${esc(l.id)}">Return</button>`}</td></tr>`;
  }).join('')}</tbody></table></div>`;
}
function sortedLoans(data) { return [...data.loans].sort((a,b) => Date.parse(b.borrowedAt)-Date.parse(a.borrowedAt)); }
function renderDashboard(data) {
  const s = statistics(data), active = sortedLoans(data).filter(l => !l.returnedAt).slice(0,4);
  const stats = [['Registered members',s.members,'members','Our reading community'],['Book titles',s.titles,'book','Stories on our shelves'],['Total copies',s.copies,'copies','Every physical book'],['Available copies',s.available,'available','Ready for the next reader'],['Currently borrowed',s.borrowed,'loans','Out in the world']];
  main.innerHTML = heading('A new chapter, every day.', 'A little overview of the books and people that make your library.', `<div class="date-chip">${icon('calendar')}${esc(new Intl.DateTimeFormat(undefined,{weekday:'short',day:'numeric',month:'short',year:'numeric'}).format(new Date()))}</div>`)
    + `<section class="hero" aria-label="Welcome"><div><p class="eyebrow">GOOD BOOKS. GREAT COMMUNITY.</p><h2>A home for every story.</h2><p>Keep your shelves in order, your books in circulation,<br>and your community turning pages.</p><a class="btn" href="#books">Explore the catalogue ${icon('arrow')}</a></div>${art()}</section>`
    + `<section class="stats" aria-label="Library statistics">${stats.map(([label,value,i,note]) => `<div class="stat"><div class="stat-head">${label}${icon(i)}</div><div class="stat-value">${value}</div><div class="stat-note">${i==='available'?'<span class="dot">●</span> ':''}${note}</div></div>`).join('')}</section>`
    + `<div class="dashboard-grid"><section class="panel"><div class="panel-header"><div><h2>Currently in circulation</h2><p>A quick look at the books being enjoyed.</p></div><a href="#loans" class="text-link">View all loans <span>↗</span></a></div>${loanTable(active,data,{compact:true})}</section><div><section class="panel"><div class="panel-header"><div><h2>Keep things moving</h2><p>Your everyday library essentials.</p></div></div><div class="quick-actions">${[['new-book','book','Add a book','Make room for a new story'],['new-member','members','Register a member','Welcome another reader'],['open-loans','return','Return a book','Bring a story back to the shelf']].map(([action,i,title,sub])=>`<button class="quick-action" data-action="${action}"><span class="quick-icon">${icon(i)}</span><span><strong>${title}</strong><small>${sub}</small></span><span>↗</span></button>`).join('')}</div></section><div class="reading-note">${icon('book')}<div><p>“A book is a dream that you hold in your hand.”</p><small>NEIL GAIMAN</small></div></div></div></div>`
    + `<section><div class="section-heading"><div><h2>On the shelves</h2><p class="subtitle">The next great read is waiting.</p></div><a href="#books" class="text-link">Browse catalogue <span>↗</span></a></div>${data.books.length?`<div class="book-grid">${data.books.slice(0,3).map((b,i)=>bookCard(b,data,i,true)).join('')}</div>`:empty('Your next chapter starts here', 'Add your first book to start building a collection your readers will love.',btn('new-book','Add your first book'))}</section>`
    + (!data.books.length&&!data.members.length&&!data.loans.length?`<div class="onboarding"><div><h3>A fresh start for your library</h3><p>Build your own collection, or take a look around with six sample books.</p></div>${btn('demo','Add sample books','book',true)}</div>`:'');
}
function searchField(placeholder) { return `<div class="search-field">${icon('search')}<input id="search" type="search" aria-label="${placeholder}" placeholder="${placeholder}" value="${esc(query)}" autocomplete="off"></div>`; }
function renderBooks(data) {
  const categories = [...new Set(data.books.map(b=>b.category).filter(Boolean))].sort();
  main.innerHTML = heading('The book catalogue', 'Every title, every copy. A collection worth exploring.',btn('new-book','Add a book'),'DISCOVER & ORGANIZE')
    + `<div class="toolbar">${searchField('Search title, author or category…')}<select id="availability" aria-label="Filter by availability"><option value="all">All availability</option><option value="available">Available books</option><option value="unavailable">All copies borrowed</option></select><select id="category" aria-label="Filter by category"><option value="all">All categories</option>${categories.map(c=>`<option value="${esc(c)}">${esc(c)}</option>`).join('')}</select><span class="result-count" id="result-count" role="status"></span></div><div id="book-results" class="book-grid"></div>`;
  document.querySelector('#availability').value = bookFilter; document.querySelector('#category').value = categoryFilter;
  document.querySelector('#availability').onchange = e => {bookFilter=e.target.value;updateBookResults();};
  document.querySelector('#category').onchange = e => {categoryFilter=e.target.value;updateBookResults();};
  document.querySelector('#search').oninput = e => {query=e.target.value;updateBookResults();};
  updateBookResults();
}
function updateBookResults() {
  const data=store.snapshot(), q=query.toLocaleLowerCase().trim();
  const books=data.books.filter(b=>`${b.title} ${b.author} ${b.category}`.toLocaleLowerCase().includes(q) && (categoryFilter==='all'||b.category===categoryFilter) && (bookFilter==='all'||(bookFilter==='available'?availableFor(data,b)>0:availableFor(data,b)===0)));
  document.querySelector('#result-count').textContent=`${books.length} ${books.length===1?'title':'titles'}`;
  document.querySelector('#book-results').innerHTML=books.length?books.map(b=>bookCard(b,data,data.books.indexOf(b))).join(''):`<div class="panel no-results">${empty(data.books.length?'No matching books':'Your shelves are waiting',data.books.length?'Try another search or change your filters.':'Add your first title and start your collection.',data.books.length?'':btn('new-book','Add a book'))}</div>`;
}
function renderMembers(data) {
  main.innerHTML=heading('A community of readers', 'A familiar name, a unique library ID, and a world of books.',btn('new-member','Register a member'),'MEET YOUR MEMBERS')+`<div class="toolbar">${searchField('Search member name or library ID…')}<span class="result-count" id="result-count" role="status"></span></div><section class="panel" id="member-results"></section>`;
  document.querySelector('#search').oninput=e=>{query=e.target.value;updateMemberResults();};updateMemberResults();
}
function updateMemberResults() {
  const data=store.snapshot(), q=query.toLocaleLowerCase().trim();
  const members=data.members.filter(m=>`${m.name} ${m.id} ${m.email} ${m.phone}`.toLocaleLowerCase().includes(q));
  document.querySelector('#result-count').textContent=`${members.length} ${members.length===1?'member':'members'}`;
  document.querySelector('#member-results').innerHTML=members.length?`<div class="table-wrap"><table><thead><tr><th>Member</th><th>Library ID</th><th>Contact</th><th>Active loans</th><th>Joined</th><th>History</th></tr></thead><tbody>${members.map(m=>`<tr><td><div class="member-name"><span class="member-avatar">${esc(initials(m.name))}</span><span class="table-title">${esc(m.name)}</span></div></td><td><span class="member-id">${esc(m.id)}</span></td><td>${m.email?`<span class="table-title">${esc(m.email)}</span>`:''}<span class="table-sub">${esc(m.phone||(!m.email?'No contact details':''))}</span></td><td>${data.loans.filter(l=>l.memberId===m.id&&!l.returnedAt).length}</td><td>${esc(date(m.createdAt))}</td><td><button class="btn secondary small" data-action="profile" data-id="${esc(m.id)}">View member</button></td></tr>`).join('')}</tbody></table></div>`:empty(data.members.length?'No matching members':'Every reader starts here',data.members.length?'Search for a different name or library ID.':'Register your first member. We’ll give them a library ID right away.',data.members.length?'':btn('new-member','Register a member','members'));
}
function renderLoans() {
  main.innerHTML=heading('Stories in circulation', 'Follow every book from your shelves and back again.','','BORROW, RETURN & REMEMBER')+`<div class="tabs" aria-label="Loan status filter">${[['active','Active loans'],['returned','Returned'],['all','All transactions']].map(([v,label])=>`<button data-filter="${v}" aria-pressed="${loanFilter===v}">${label}</button>`).join('')}</div><div class="toolbar">${searchField('Search book, member or library ID…')}<span class="result-count" id="result-count" role="status"></span></div><section class="panel" id="loan-results"></section>`;
  document.querySelector('#search').oninput=e=>{query=e.target.value;updateLoanResults();};
  document.querySelectorAll('[data-filter]').forEach(b=>b.onclick=()=>{loanFilter=b.dataset.filter;document.querySelectorAll('[data-filter]').forEach(el=>el.setAttribute('aria-pressed',el===b));updateLoanResults();}); updateLoanResults();
}
function updateLoanResults() {
  const data=store.snapshot(), q=query.toLocaleLowerCase().trim();
  const loans=sortedLoans(data).filter(l=>{
    const book=data.books.find(b=>b.id===l.bookId),member=data.members.find(m=>m.id===l.memberId);
    return (loanFilter==='all'||(loanFilter==='active'?!l.returnedAt:!!l.returnedAt))&&`${book.title} ${member.name} ${member.id}`.toLocaleLowerCase().includes(q);
  });
  document.querySelector('#result-count').textContent=`${loans.length} ${loans.length===1?'transaction':'transactions'}`;
  document.querySelector('#loan-results').innerHTML=loans.length?loanTable(loans,data):empty(query.trim()?'No matching loans':loanFilter==='returned'?'No returned books yet':'A quiet moment on the shelves',query.trim()?'Try another book title, member name or library ID.':loanFilter==='returned'?'Once a book comes back, its record will be kept here.':'Books borrowed from the catalogue will appear here.',`<a href="#books" class="btn secondary">Explore the catalogue ${icon('arrow')}</a>`);
}
function renderBackup(data) {
  main.innerHTML=heading('A safe place for your records', 'Your library lives in this browser. A backup keeps its story safe.','','SETTINGS & BACKUP')+`<div class="settings-grid"><section class="panel settings-card">${icon('download')}<h2>Export your library</h2><p>Download every member, book and borrowing record as one JSON file. Keep a copy somewhere safe and export regularly.</p>${btn('export','Export library data','download')}<small>${data.members.length} members · ${data.books.length} titles · ${data.loans.length} transactions</small>${store.status().blocked?`<div style="margin-top:15px">${btn('export-original','Export original saved data','download',true)}</div>`:''}</section><section class="panel settings-card">${icon('upload')}<h2>Restore a backup</h2><p>Choose a previously exported JSON file. We’ll check every record and show you a summary before replacing this browser’s library.</p><label class="field" for="backup-file">Library backup file</label><input id="backup-file" class="file-input" type="file" accept=".json,application/json"><small>Restoring replaces all current records. Export a backup first.</small></section></div><div class="info-box"><strong>One library. One browser.</strong>Records are saved only on this browser and this website address. They aren’t synchronized across devices or browsers. Clearing browser data, using private browsing, or changing the website address can remove access to your records. Use Export to move your library safely.</div><div class="info-box"><strong>Simple by design</strong>No accounts, passwords, due dates, fines or backend. Everyone using this browser can access the library’s records. Backup files contain member contact information, so keep them private.</div>`;
  document.querySelector('#backup-file').onchange=readBackup;
}
function render() {
  const next=location.hash.slice(1).split('?')[0];
  if (next!==page) {query='';bookFilter='all';categoryFilter='all';loanFilter='active';}
  page=labels[next]?next:'dashboard';
  const data=store.snapshot();
  document.title=`${labels[page]} · Chapter`;
  document.querySelector('#breadcrumb').textContent=labels[page];
  document.querySelector('#book-count').textContent=data.books.length;
  document.querySelectorAll('[data-nav]').forEach(el=>{const active=el.dataset.nav===page;el.classList.toggle('active',active);if(active)el.setAttribute('aria-current','page');else el.removeAttribute('aria-current');});
  ({dashboard:renderDashboard,books:renderBooks,members:renderMembers,loans:renderLoans,backup:renderBackup}[page])(data);
  const {blocked,issue}=store.status();
  document.querySelector('#storage-state').innerHTML=blocked?'Storage needs attention':'<i></i> Stored on this device';
  if(blocked)main.insertAdjacentHTML('afterbegin',`<div class="storage-error" role="alert">${esc(issue)} <a href="#backup">Open Backup</a></div>`);
}
function openModal(title, body, wide=false) {
  priorFocus=modal.open?priorFocus:document.activeElement;
  modal.classList.toggle('wide',wide);
  modal.innerHTML=`<div class="modal-header"><h2 id="modal-title">${title}</h2><button class="icon-btn" data-action="close" aria-label="Close dialog">${icon('close')}</button></div><div class="modal-body">${body}</div>`;
  if(!modal.open)modal.showModal();
  (modal.querySelector('input,select,textarea') || modal.querySelector('.modal-body button') || modal.querySelector('button'))?.focus();
}
function closeModal() {modal.close(); if(priorFocus?.isConnected)priorFocus.focus(); else { const replacement=[...document.querySelectorAll('[data-action]')].find(el=>el.dataset.action===priorFocus?.dataset?.action && el.dataset.id===priorFocus?.dataset?.id); (replacement || main).focus({preventScroll:true}); }}
modal.addEventListener('click',e=>{if(e.target===modal){const r=modal.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeModal();}});
modal.addEventListener('cancel',()=>{queueMicrotask(()=>priorFocus?.isConnected&&priorFocus.focus());});
function formActions(label) {return `<div class="form-error" role="alert" id="form-error"></div><div class="modal-actions"><button type="button" class="btn secondary" data-action="close">Cancel</button><button class="btn" type="submit">${label}</button></div>`;}
function bindForm(fn) {
  modal.querySelector('form').onsubmit=e=>{
    e.preventDefault();const button=e.submitter;
    if(button?.disabled)return;
    if(button)button.disabled=true;
    try{fn(Object.fromEntries(new FormData(e.target)));}catch(error){modal.querySelector('#form-error').textContent=error.message;}
    finally{if(button?.isConnected)button.disabled=false;}
  };
}
function memberForm() {
  openModal('Welcome a new reader',`<p>Register a member to start their next chapter.</p><form><label class="field">Full name <input name="name" required maxlength="150" autocomplete="name" placeholder="e.g. Amina Wanjiku"></label><label class="field">Email address <span class="optional">Optional</span><input name="email" type="email" maxlength="254" autocomplete="email" placeholder="reader@example.com"></label><label class="field">Phone number <span class="optional">Optional</span><input name="phone" type="tel" maxlength="50" autocomplete="tel" placeholder="e.g. +254 712 345 678"></label><p class="form-help">A unique library ID will be generated when you register.</p>${formActions('Register member')}</form>`);
  bindForm(fields=>{const member=registerMember(store,fields);render();openModal('You’re part of the library',`<div class="member-success"><span class="success-stamp">${icon('check')}</span><h3>${esc(member.name)}</h3><p>Here’s your library ID. Keep it handy to borrow books.</p><span class="id-display">${esc(member.id)}</span><p>Your membership is saved in this browser.</p><button class="btn" data-action="close">All set ${icon('check')}</button></div>`);});
}
function bookForm(id) {
  const book=id?store.snapshot().books.find(b=>b.id===id):null;
  if(id&&!book)return notify('Book not found. Refresh and try again.',true);
  openModal(book?'Edit book details':'Make room for a new story',`<p>${book?'Keep your catalogue and inventory up to date.':'Add a title and tell us how many copies are on your shelves.'}</p><form><div class="form-grid"><label class="field full">Book title<input name="title" required maxlength="200" value="${esc(book?.title||'')}" placeholder="e.g. Things Fall Apart"></label><label class="field full">Author<input name="author" required maxlength="150" value="${esc(book?.author||'')}" placeholder="e.g. Chinua Achebe"></label><label class="field">Category <span class="optional">Optional</span><input name="category" maxlength="80" value="${esc(book?.category||'')}" placeholder="e.g. Fiction" list="categories"><datalist id="categories">${['Fiction','Biography','Science','History','Personal growth','Poetry','Children’s books'].map(c=>`<option value="${c}">`).join('')}</datalist></label><label class="field">Total copies<input name="copies" type="number" required min="1" max="100000" step="1" value="${book?.copies||1}"><small>${book?`${activeFor(store.snapshot(),id)} currently borrowed`:'Physical copies of this title'}</small></label><label class="field full">Description <span class="optional">Optional</span><textarea name="description" maxlength="2000" placeholder="A few words about this book…">${esc(book?.description||'')}</textarea></label></div>${formActions(book?'Save changes':'Add to catalogue')}</form>`);
  bindForm(fields=>{saveBook(store,fields,id);closeModal();render();notify(book?'Book details updated.':'A new story is on the shelves.');});
}
function borrowForm(id) {
  const data=store.snapshot(),book=data.books.find(b=>b.id===id);
  if(!book||availableFor(data,book)<1)return notify('All copies of this book are currently borrowed.',true);
  openModal('A new story to take home',`<div class="book-summary">${icon('book')}<div><h3>${esc(book.title)}</h3><p>${esc(book.author)} · ${availableFor(data,book)} ${availableFor(data,book)===1?'copy':'copies'} available</p></div></div><form><label class="field">Member’s library ID<input name="memberId" required maxlength="100" placeholder="e.g. LIB-0001" autocomplete="off" autocapitalize="characters" list="member-ids"><datalist id="member-ids">${data.members.map(m=>`<option value="${esc(m.id)}">${esc(m.name)}</option>`).join('')}</datalist><small>Only registered members can borrow books.</small></label>${!data.members.length?'<p class="form-help">No members yet. Register a member from the Members page first.</p>':''}${formActions('Confirm borrowing')}</form>`);
  bindForm(fields=>{borrowBook(store,id,fields.memberId);closeModal();render();notify(`“${book.title}” is now on loan.`);});
}
function confirmReturn(id) {
  const data=store.snapshot(),loan=data.loans.find(l=>l.id===id);
  if(!loan||loan.returnedAt)return notify('This loan has already been returned or is unavailable.',true);
  const book=data.books.find(b=>b.id===loan.bookId),member=data.members.find(m=>m.id===loan.memberId);
  openModal('Back on the shelf',`<div class="book-summary">${icon('return')}<div><h3>${esc(book.title)}</h3><p>${esc(member.name)} · ${esc(member.id)}</p></div></div><p>Confirm this copy has been returned. It will become available immediately, and the loan will stay in your history.</p><form>${formActions('Confirm return')}</form>`);
  bindForm(()=>{returnBook(store,id);closeModal();render();notify('Book returned. Ready for its next reader.');});
}
function profile(id) {
  const data=store.snapshot(),member=data.members.find(m=>m.id===id);if(!member)return;
  const loans=sortedLoans(data).filter(l=>l.memberId===id);
  openModal('Member details',`<div class="member-overview"><span class="member-avatar">${esc(initials(member.name))}</span><div><h3>${esc(member.name)}</h3><span class="member-id">${esc(member.id)}</span><p>${esc([member.email,member.phone].filter(Boolean).join(' · ')||'No contact details provided')} · Joined ${esc(date(member.createdAt))}</p></div></div><div class="member-profile-stat"><strong>${loans.filter(l=>!l.returnedAt).length}</strong> active loans <span style="margin:0 12px">·</span> ${loans.length} lifetime loans</div><h3 style="margin-bottom:12px">Borrowing history</h3>${loanTable(loans,data,{profile:true})}`,true);
}
function download(content, filename) {
  const url=URL.createObjectURL(new Blob([content],{type:'application/json'}));
  const a=document.createElement('a');a.href=url;a.download=filename;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),10000);
}
function exportData() {download(JSON.stringify(store.snapshot(),null,2),`chapter-library-${new Date().toISOString().slice(0,10)}.json`);notify('Your library backup is ready to download.');}
async function readBackup(e) {
  const file=e.target.files[0];e.target.value='';if(!file)return;
  try {
    if(file.size>10*1024*1024)throw new Error('Choose a JSON backup smaller than 10 MB.');
    let candidate;try{candidate=JSON.parse(await file.text());}catch{throw new Error('This file is not valid JSON. Existing records were not changed.');}
    const next=validateData(candidate),s=statistics(next);
    openModal('Restore this library?',`<p>We checked <strong>${esc(file.name)}</strong>. It contains:</p><div class="book-summary"><div><h3>${s.members} members · ${s.titles} titles</h3><p>${s.copies} copies · ${next.loans.length} transactions · ${s.borrowed} active loans</p></div></div><p>This will replace <strong>all current library records</strong> in this browser. Export your current data first if you want to keep it.</p><button class="btn secondary" data-action="export">${icon('download')}Export current records</button><form>${formActions('Replace & restore library')}</form>`);
    bindForm(()=>{store.restore(next);closeModal();render();notify('Library restored. All records are ready.');});
  }catch(error){notify(error.message,true);}
}
document.addEventListener('click',e=>{
  const target=e.target.closest('[data-action]');if(!target||target.disabled)return;
  const action=target.dataset.action,id=target.dataset.id;
  try {
    ({'new-book':()=>bookForm(),'edit-book':()=>bookForm(id),'new-member':memberForm,borrow:()=>borrowForm(id),return:()=>confirmReturn(id),profile:()=>profile(id),close:closeModal,'open-loans':()=>{location.hash='loans';},demo:()=>{loadDemoBooks(store);render();notify('Six sample books are ready to explore.');},export:exportData,'export-original':()=>download(store.original()??'','chapter-original-recovery.json')}[action])?.();
  }catch(error){notify(error.message,true);}
});
window.addEventListener('hashchange',()=>{if(location.hash==='#main'){main.focus();return;}if(modal.open)closeModal();render();main.focus({preventScroll:true});});
window.addEventListener('storage',e=>{if(e.key==='chapter-library-v1'||e.key===null){store.load();if(modal.open)closeModal();render();notify('Library updated from another tab.');}});
render();
