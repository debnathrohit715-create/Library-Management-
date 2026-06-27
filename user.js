// User Portal - Library Management System
// Features: Browse books, borrow/return, view history, manage profile, request books

// Check user authentication
if(localStorage.getItem('lms_user_logged_in') !== 'true'){
  window.location.href = 'login.html';
}

const demoBooks = [
  {id: id(), title: 'Clean Code', author: 'Robert C. Martin', isbn: '9780132350884', copies: 4, desc: 'A Handbook of Agile Software Craftsmanship', borrowed:0},
  {id: id(), title: 'You Don\'t Know JS', author: 'Kyle Simpson', isbn: '9781491904244', copies: 2, desc: 'Deep dive into JavaScript fundamentals', borrowed:1},
  {id: id(), title: 'Eloquent JavaScript', author: 'Marijn Haverbeke', isbn: '9781593279509', copies: 3, desc: 'A Modern Introduction to Programming', borrowed:0},
  {id: id(), title: 'The Pragmatic Programmer', author: 'Andrew Hunt', isbn: '9780135957059', copies: 3, desc: 'Your Journey To Mastery', borrowed:1},
  {id: id(), title: 'Design Patterns', author: 'Gang of Four', isbn: '9780201633610', copies: 2, desc: 'Elements of Reusable Object-Oriented Software', borrowed:0},
  {id: id(), title: 'Refactoring', author: 'Martin Fowler', isbn: '9780134757599', copies: 2, desc: 'Improving the Design of Existing Code', borrowed:0},
  {id: id(), title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', isbn: '9780262033848', copies: 3, desc: 'Comprehensive guide to algorithms', borrowed:0},
  {id: id(), title: 'Code Complete', author: 'Steve McConnell', isbn: '9780735619678', copies: 2, desc: 'A Practical Handbook of Software Construction', borrowed:1},
];

let currentUser = load('lms_current_user') || {
  id: id(),
  name: 'Alice Sharma',
  email: 'alice@example.com',
  phone: '+91 98765 43210',
  memberSince: new Date().toISOString().split('T')[0],
  borrowed: [],
  history: []
};

let state = {
  books: load('lms_books') || demoBooks,
  requests: load('lms_user_requests') || []
};

let currentFilter = 'all';
let searchQuery = '';
let selectedBookId = null;

function id(){return 'id_'+Math.random().toString(36).slice(2,11)}
function save(key, val){localStorage.setItem(key, JSON.stringify(val))}
function load(key){try{return JSON.parse(localStorage.getItem(key))}catch(e){return null}}
function escapeHtml(s){ return String(s||'').replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[c])) }
function formatDate(dateStr){
  if(!dateStr) return 'N/A';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', {year:'numeric', month:'short', day:'numeric'});
}

const navButtons = document.querySelectorAll('.nav button');
const views = {
  browse: document.getElementById('browseView'),
  myborrowed: document.getElementById('myborrowedView'),
  history: document.getElementById('historyView'),
  profile: document.getElementById('profileView'),
  request: document.getElementById('requestView')
};
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const filterTabs = document.querySelectorAll('.filter-tabs button');
const booksGrid = document.getElementById('booksGrid');
const borrowModal = document.getElementById('borrowModal');
const cancelBorrowBtn = document.getElementById('cancelBorrowBtn');
const confirmBorrowBtn = document.getElementById('confirmBorrowBtn');
const borrowBookDetails = document.getElementById('borrowBookDetails');
const logoutBtn = document.getElementById('logoutBtn');
const profileName = document.getElementById('profileName');
const profileEmail = document.getElementById('profileEmail');
const profilePhone = document.getElementById('profilePhone');
const profileMemberSince = document.getElementById('profileMemberSince');
const saveProfileBtn = document.getElementById('saveProfileBtn');
const reqTitle = document.getElementById('reqTitle');
const reqAuthor = document.getElementById('reqAuthor');
const reqIsbn = document.getElementById('reqIsbn');
const reqReason = document.getElementById('reqReason');
const submitRequestBtn = document.getElementById('submitRequestBtn');
const hamburgerBtn = document.getElementById('hamburgerBtn');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');

init();

function init(){
  updateUserInfo();
  attachListeners();
  render();
  setupStorageSync();
}

// Sync with admin panel changes in real-time
function setupStorageSync(){
  window.addEventListener('storage', (e) => {
    if(e.key === 'lms_books'){
      // Reload books from localStorage when admin updates them
      state.books = load('lms_books') || demoBooks;
      render();
      showSyncNotification();
      // Update borrowed view if currently viewing it
      const activeView = document.querySelector('.nav button.active');
      if(activeView && activeView.dataset.view === 'myborrowed'){
        renderMyBorrowed();
      }
    }
  });
  
  // Also check for updates periodically (for same-tab updates)
  setInterval(() => {
    const latestBooks = load('lms_books');
    if(latestBooks && JSON.stringify(latestBooks) !== JSON.stringify(state.books)){
      state.books = latestBooks;
      render();
      showSyncNotification();
      const activeView = document.querySelector('.nav button.active');
      if(activeView && activeView.dataset.view === 'myborrowed'){
        renderMyBorrowed();
      }
    }
  }, 2000); // Check every 2 seconds
}

function showSyncNotification(){
  const toast = document.getElementById('syncToast');
  if(!toast) return;
  toast.style.display = 'flex';
  setTimeout(() => {
    toast.style.display = 'none';
  }, 3000);
}

function updateUserInfo(){
  document.getElementById('userName').textContent = currentUser.name;
  document.getElementById('userEmail').textContent = currentUser.email;
}

function attachListeners(){
  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      navButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      showView(btn.dataset.view);
      closeMobileMenu(); // Close menu on mobile after selection
    });
  });

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentFilter = tab.dataset.filter;
      renderBooks();
    });
  });

  searchInput.addEventListener('input', () => {
    searchQuery = searchInput.value;
    renderBooks();
  });

  searchBtn.addEventListener('click', () => {
    searchQuery = searchInput.value;
    renderBooks();
  });

  cancelBorrowBtn.addEventListener('click', closeBorrowModal);
  confirmBorrowBtn.addEventListener('click', confirmBorrow);
  saveProfileBtn.addEventListener('click', saveProfile);
  submitRequestBtn.addEventListener('click', submitRequest);
  logoutBtn.addEventListener('click', logout);

  // Mobile menu listeners
  if(hamburgerBtn){
    hamburgerBtn.addEventListener('click', toggleMobileMenu);
  }
  if(sidebarOverlay){
    sidebarOverlay.addEventListener('click', closeMobileMenu);
  }
}

function toggleMobileMenu(){
  if(sidebar && sidebarOverlay){
    sidebar.classList.toggle('open');
    sidebarOverlay.classList.toggle('show');
  }
}

function closeMobileMenu(){
  if(sidebar && sidebarOverlay){
    sidebar.classList.remove('open');
    sidebarOverlay.classList.remove('show');
  }
}

function showView(viewName){
  Object.values(views).forEach(v => v.style.display = 'none');
  if(views[viewName]){
    views[viewName].style.display = 'block';
    if(viewName === 'myborrowed') renderMyBorrowed();
    if(viewName === 'history') renderHistory();
    if(viewName === 'profile') loadProfile();
    if(viewName === 'request') renderRequests();
  }
}

function render(){
  renderBooks();
}

function renderBooks(){
  const q = searchQuery.trim().toLowerCase();
  let filtered = state.books;

  if(q){
    filtered = filtered.filter(b => 
      b.title.toLowerCase().includes(q) || 
      b.author.toLowerCase().includes(q) || 
      b.isbn.toLowerCase().includes(q)
    );
  }

  if(currentFilter === 'available'){
    filtered = filtered.filter(b => (b.copies - (b.borrowed||0)) > 0);
  } else if(currentFilter === 'borrowed'){
    filtered = filtered.filter(b => (b.borrowed||0) > 0);
  }

  if(filtered.length === 0){
    booksGrid.innerHTML = '<div class="empty-state"><div class="icon">📚</div><p>No books found</p></div>';
    return;
  }

  booksGrid.innerHTML = filtered.map(book => {
    const available = book.copies - (book.borrowed||0);
    const isBorrowed = currentUser.borrowed.some(b => b.bookId === book.id);
    
    return `
      <div class="card book-card">
        <h4>${escapeHtml(book.title)}</h4>
        <div class="author">${escapeHtml(book.author)}</div>
        <div class="isbn">ISBN: ${escapeHtml(book.isbn)}</div>
        <div class="desc">${escapeHtml(book.desc)}</div>
        <div style="margin-top:12px">
          ${available > 0 
            ? `<span class="badge badge-success">${available} Available</span>` 
            : `<span class="badge badge-danger">Not Available</span>`
          }
        </div>
        <div class="actions">
          ${isBorrowed 
            ? `<button class="btn btn-secondary" data-id="${book.id}" onclick="returnBook('${book.id}')">Return</button>`
            : available > 0 
              ? `<button class="btn btn-success" data-id="${book.id}" onclick="openBorrowModal('${book.id}')">Borrow</button>`
              : `<button class="btn" disabled style="opacity:0.5">Unavailable</button>`
          }
        </div>
      </div>
    `;
  }).join('');
}

function openBorrowModal(bookId){
  selectedBookId = bookId;
  const book = state.books.find(b => b.id === bookId);
  if(!book) return;

  borrowBookDetails.innerHTML = `
    <strong>${escapeHtml(book.title)}</strong><br/>
    <span class="muted">by ${escapeHtml(book.author)}</span>
  `;
  borrowModal.style.display = 'flex';
}

function closeBorrowModal(){
  borrowModal.style.display = 'none';
  selectedBookId = null;
}

function confirmBorrow(){
  if(!selectedBookId) return;
  
  const book = state.books.find(b => b.id === selectedBookId);
  if(!book) return;

  const available = book.copies - (book.borrowed||0);
  if(available <= 0){
    alert('Sorry, this book is not available');
    closeBorrowModal();
    return;
  }

  if(currentUser.borrowed.some(b => b.bookId === selectedBookId)){
    alert('You have already borrowed this book');
    closeBorrowModal();
    return;
  }

  book.borrowed = (book.borrowed||0) + 1;

  currentUser.borrowed.push({
    bookId: selectedBookId,
    borrowDate: new Date().toISOString()
  });

  save('lms_books', state.books);
  save('lms_current_user', currentUser);

  alert('Book borrowed successfully!');
  closeBorrowModal();
  render();
}

function returnBook(bookId){
  const book = state.books.find(b => b.id === bookId);
  if(!book) return;

  const borrowRecord = currentUser.borrowed.find(b => b.bookId === bookId);
  if(!borrowRecord){
    alert('You have not borrowed this book');
    return;
  }

  if(!confirm(`Return "${book.title}"?`)) return;

  book.borrowed = Math.max(0, (book.borrowed||0) - 1);
  currentUser.borrowed = currentUser.borrowed.filter(b => b.bookId !== bookId);

  currentUser.history.push({
    bookId: bookId,
    bookTitle: book.title,
    bookAuthor: book.author,
    borrowDate: borrowRecord.borrowDate,
    returnDate: new Date().toISOString(),
    status: 'returned'
  });

  save('lms_books', state.books);
  save('lms_current_user', currentUser);

  alert('Book returned successfully!');
  render();
}

function renderMyBorrowed(){
  const borrowed = currentUser.borrowed || [];
  
  document.getElementById('statCurrentBorrowed').textContent = borrowed.length;
  document.getElementById('statTotalBorrowed').textContent = borrowed.length + (currentUser.history?.length || 0);
  document.getElementById('statReturned').textContent = currentUser.history?.length || 0;

  const container = document.getElementById('borrowedBooksContainer');
  
  if(borrowed.length === 0){
    container.innerHTML = '<div class="empty-state"><div class="icon">📚</div><p>You have no borrowed books</p></div>';
    return;
  }

  container.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Book Title</th>
          <th>Author</th>
          <th>Borrowed Date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${borrowed.map(record => {
          const book = state.books.find(b => b.id === record.bookId);
          if(!book) return '';
          return `
            <tr>
              <td><strong>${escapeHtml(book.title)}</strong></td>
              <td>${escapeHtml(book.author)}</td>
              <td>${formatDate(record.borrowDate)}</td>
              <td>
                <button class="btn btn-secondary" onclick="returnBook('${book.id}')">Return</button>
              </td>
            </tr>
          `;
        }).join('')}
      </tbody>
    </table>
  `;
}

function renderHistory(){
  const history = currentUser.history || [];
  const tbody = document.querySelector('#historyTable tbody');

  if(history.length === 0){
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:40px;color:#9ca3af">No borrowing history yet</td></tr>';
    return;
  }

  tbody.innerHTML = history.slice().reverse().map(record => `
    <tr>
      <td><strong>${escapeHtml(record.bookTitle)}</strong></td>
      <td>${escapeHtml(record.bookAuthor)}</td>
      <td>${formatDate(record.borrowDate)}</td>
      <td>${formatDate(record.returnDate)}</td>
      <td><span class="badge badge-success">Returned</span></td>
    </tr>
  `).join('');
}

function loadProfile(){
  profileName.value = currentUser.name || '';
  profileEmail.value = currentUser.email || '';
  profilePhone.value = currentUser.phone || '';
  profileMemberSince.value = formatDate(currentUser.memberSince);
}

function saveProfile(){
  const name = profileName.value.trim();
  const email = profileEmail.value.trim();
  const phone = profilePhone.value.trim();

  if(!name || !email){
    alert('Name and email are required');
    return;
  }

  currentUser.name = name;
  currentUser.email = email;
  currentUser.phone = phone;

  save('lms_current_user', currentUser);
  updateUserInfo();
  alert('Profile updated successfully!');
}

function submitRequest(){
  const title = reqTitle.value.trim();
  const author = reqAuthor.value.trim();
  const isbn = reqIsbn.value.trim();
  const reason = reqReason.value.trim();

  if(!title || !author){
    alert('Title and author are required');
    return;
  }

  const request = {
    id: id(),
    userId: currentUser.id,
    userName: currentUser.name,
    title,
    author,
    isbn,
    reason,
    date: new Date().toISOString(),
    status: 'pending'
  };

  state.requests.push(request);
  save('lms_user_requests', state.requests);

  reqTitle.value = '';
  reqAuthor.value = '';
  reqIsbn.value = '';
  reqReason.value = '';

  alert('Request submitted successfully!');
  renderRequests();
}

function renderRequests(){
  const userRequests = state.requests.filter(r => r.userId === currentUser.id);
  const container = document.getElementById('requestsContainer');

  if(userRequests.length === 0){
    container.innerHTML = '<div class="empty-state" style="padding:30px"><p>No requests yet</p></div>';
    return;
  }

  container.innerHTML = userRequests.slice().reverse().map(req => `
    <div class="request-item">
      <div style="display:flex;justify-content:space-between;align-items:start">
        <div>
          <strong>${escapeHtml(req.title)}</strong>
          <div class="muted">by ${escapeHtml(req.author)}</div>
          ${req.isbn ? `<div class="muted" style="font-size:12px">ISBN: ${escapeHtml(req.isbn)}</div>` : ''}
        </div>
        <span class="badge badge-warning">${req.status}</span>
      </div>
      ${req.reason ? `<p style="margin:8px 0 0;font-size:14px;color:#64748b">${escapeHtml(req.reason)}</p>` : ''}
      <div class="muted" style="font-size:12px;margin-top:8px">Requested on ${formatDate(req.date)}</div>
    </div>
  `).join('');
}

function logout(){
  if(confirm('Are you sure you want to logout?')){
    localStorage.removeItem('lms_user_logged_in');
    window.location.href = 'login.html';
  }
}
