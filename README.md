# Library Management System

A modern, responsive library management system with complete authentication, separate admin and user portals.

## Files

### Authentication
- **index.html** - Landing page with portal selection
- **login.html** - User login page
- **register.html** - User registration page
- **admin-login.html** - Admin login page

### Main Application
- **admin.html** - Admin panel for managing books, users, loans, and settings
- **user.html** - User portal for browsing and borrowing books
- **user.js** - JavaScript logic for the user portal

### Documentation
- **README.md** - This file
- **AUTH_GUIDE.md** - Complete authentication documentation
- **MOBILE_GUIDE.md** - Mobile UI testing guide

## Features

### 🔐 Authentication System
- ✅ User registration with validation
- ✅ Secure login for users and admin
- ✅ Protected routes (authentication required)
- ✅ Session management
- ✅ Remember me functionality
- ✅ Logout functionality
- ✅ Separate admin and user portals

**Registration Fields:**
- Full Name
- Roll Number
- Serial Number
- JISU ID
- Email Address
- Password

**Default Admin Credentials:**
- Email: `admin@library.com`
- Password: `admin123`

### Admin Panel (`admin.html`)
- ✅ Add, edit, and delete books
- ✅ Manage users
- ✅ Track active loans
- ✅ Search and filter books
- ✅ Export/import data as JSON
- ✅ Dashboard with statistics
- ✅ Secure logout

### User Portal (`user.html`)
- 🔍 Browse and search books
- 📚 Borrow and return books
- 🕓 View borrowing history
- 👤 Manage profile
- 💬 Request new books
- 🚪 Secure logout

## Data Synchronization

**The admin and user portals are fully synchronized!**

### How It Works:
1. Both portals use the same `localStorage` key: `lms_books`
2. When admin makes changes (add/edit/delete books), the data is saved to `localStorage`
3. User portal automatically detects changes via:
   - **Storage Event Listener** - Detects changes across different browser tabs
   - **Polling (every 2 seconds)** - Detects changes within the same tab
4. A green toast notification appears when data syncs

### What Gets Synced:
- ✅ Book additions, edits, and deletions
- ✅ Book availability (copies and borrowed counts)
- ✅ All book metadata (title, author, ISBN, description)

### Testing the Sync:
1. Open `admin.html` in one browser tab
2. Open `user.html` in another tab
3. Add or edit a book in the admin panel
4. Watch the user portal update automatically within 2 seconds
5. You'll see a "Synced with admin updates" notification

## Getting Started

### First Time Setup:

1. **Open the landing page**: `index.html`
2. **Choose your portal**:
   - User Portal → Register new account
   - Admin Portal → Use default credentials

### For New Users:

1. Click **"User Portal"** from landing page
2. Click **"Register here"** on login page
3. Fill in registration form:
   - Full Name
   - Roll Number (e.g., 2024001)
   - Serial No. (e.g., SN-001)
   - JISU ID
   - Email Address
   - Password (min 6 characters)
4. Click **"Create Account"**
5. Login with your credentials
6. Access user portal

### For Registered Users:

1. Open `login.html` or click "User Portal"
2. Enter your email and password
3. Optional: Check "Remember me"
4. Click **"Login"**
5. Browse and borrow books

### For Admins:

1. Open `admin-login.html` or click "Admin Panel"
2. Enter admin credentials:
   - Email: `admin@library.com`
   - Password: `admin123`
3. Click **"Login as Admin"**
4. Manage the library system

### Admin Tasks:
- Add, edit, and delete books
- View all registered users
- Track active loans
- Export/import data
- Monitor system statistics

### User Tasks:
- Browse and search books
- Borrow available books
- Return borrowed books
- View borrowing history
- Update profile information
- Request new books

## Data Storage

All data is stored in browser `localStorage`:

### Authentication Data:
- `lms_registered_users` - All registered user accounts
- `lms_current_user` - Currently logged-in user data
- `lms_user_logged_in` - User login status
- `lms_admin_logged_in` - Admin login status
- `lms_admin_credentials` - Admin login credentials
- `lms_admin_session` - Admin session data
- `lms_remembered_email` - Saved email for "Remember me"

### Application Data:
- `lms_books` - Book catalog (shared between admin and user)
- `lms_users` - User list (admin view)
- `lms_user_requests` - Book requests from users

## Mobile-Friendly Design

The user portal is fully optimized for mobile devices:

### Mobile Features:
- 📱 **Responsive Layout** - Adapts to all screen sizes
- ☰ **Hamburger Menu** - Slide-out navigation on mobile
- 👆 **Touch Optimized** - Tap-friendly buttons and interactions
- 📊 **Single Column Grid** - Easy browsing on small screens
- 🔄 **Swipeable Tabs** - Horizontal scroll for filter tabs
- 💬 **Bottom Toast** - Mobile-positioned notifications
- 🎨 **Native Feel** - Sticky header and smooth animations

### Mobile Breakpoint:
- **Desktop**: Full sidebar + 4-column grid
- **Tablet** (≤900px): 2-column grid
- **Mobile** (≤768px): Hamburger menu + 1-column grid

## Browser Compatibility

Works in all modern browsers:
- Chrome/Edge
- Firefox
- Safari
- Opera

Tested on:
- iOS Safari
- Android Chrome
- Desktop browsers

## Notes

- This is a frontend-only demo using localStorage
- No backend or database required
- Data persists in the browser
- To reset, clear browser localStorage
- For production, connect to a backend API (Firebase, Node.js, etc.)
