# Authentication System Guide

## Overview

The Library Management System now includes a complete authentication system with separate login portals for users and administrators.

## Files Structure

```
library management/
├── index.html           # Landing page (choose user/admin)
├── login.html           # User login page
├── register.html        # User registration page
├── admin-login.html     # Admin login page
├── user.html            # User portal (protected)
├── admin.html           # Admin panel (protected)
└── user.js              # User portal logic
```

## User Registration

### Registration Fields (All Required):
1. **Full Name** - User's complete name
2. **Roll Number** - Student roll number (e.g., 2024001)
3. **Serial No.** - Serial number (e.g., SN-001)
4. **JISU ID** - JISU identification number
5. **Email Address** - Must be unique
6. **Password** - Minimum 6 characters
7. **Confirm Password** - Must match password

### Registration Process:
1. Open `register.html` or click "Register here" from login page
2. Fill in all required fields
3. Password strength indicator shows security level
4. Click "Create Account"
5. System validates:
   - All fields are filled
   - Email is unique (not already registered)
   - Roll number is unique
   - JISU ID is unique
   - Password meets minimum length
   - Passwords match
6. On success, redirects to login page

### Data Storage:
- Users stored in: `localStorage['lms_registered_users']`
- Each user gets unique ID: `user_[timestamp]_[random]`
- Member since date automatically set

## User Login

### Login Credentials:
- **Email Address**
- **Password**

### Login Process:
1. Open `login.html` or start from `index.html`
2. Enter registered email and password
3. Optional: Check "Remember me" to save email
4. Click "Login"
5. System validates credentials against registered users
6. On success:
   - Sets `lms_user_logged_in = 'true'`
   - Sets `lms_current_user` with user data
   - Redirects to `user.html`

### Features:
- ✅ Remember me functionality
- ✅ Forgot password link (placeholder)
- ✅ Link to registration page
- ✅ Link to admin login

## Admin Login

### Default Admin Credentials:
```
Email: admin@library.com
Password: admin123
```

### Login Process:
1. Open `admin-login.html` or click "Admin Login" from user login
2. Enter admin email and password
3. Click "Login as Admin"
4. System validates against stored admin credentials
5. On success:
   - Sets `lms_admin_logged_in = 'true'`
   - Sets `lms_admin_session` with login details
   - Redirects to `admin.html`

### Security Features:
- ✅ Separate admin portal
- ✅ Different color scheme (teal/dark blue)
- ✅ Admin badge indicator
- ✅ Session tracking

## Protected Routes

### User Portal (`user.html`):
- Checks `lms_user_logged_in` on page load
- If not logged in → redirects to `login.html`
- Logout button clears session and redirects to login

### Admin Panel (`admin.html`):
- Checks `lms_admin_logged_in` on page load
- If not logged in → redirects to `admin-login.html`
- Logout button clears session and redirects to admin login

## Logout Functionality

### User Logout:
```javascript
// Clears user session
localStorage.removeItem('lms_user_logged_in');
// Redirects to login page
window.location.href = 'login.html';
```

### Admin Logout:
```javascript
// Clears admin session
localStorage.removeItem('lms_admin_logged_in');
localStorage.removeItem('lms_admin_session');
// Redirects to admin login
window.location.href = 'admin-login.html';
```

## LocalStorage Keys

### Authentication:
- `lms_user_logged_in` - User login status (true/false)
- `lms_admin_logged_in` - Admin login status (true/false)
- `lms_admin_session` - Admin session data
- `lms_remembered_email` - Saved email for "Remember me"

### User Data:
- `lms_registered_users` - Array of all registered users
- `lms_current_user` - Currently logged-in user data
- `lms_admin_credentials` - Admin login credentials

### Shared Data:
- `lms_books` - Book catalog (shared between admin & user)
- `lms_users` - User list (admin view)
- `lms_user_requests` - Book requests from users

## User Data Structure

```javascript
{
  id: "user_1234567890_abc123",
  name: "Alice Sharma",
  roll: "2024001",
  serialNo: "SN-001",
  jisuId: "JISU12345",
  email: "alice@example.com",
  password: "hashed_password",
  phone: "+91 98765 43210",
  memberSince: "2024-10-14",
  borrowed: [],
  history: []
}
```

## Testing the System

### Test User Registration:
1. Go to `register.html`
2. Fill in test data:
   - Name: Test User
   - Roll: TEST001
   - Serial: SN-TEST
   - JISU ID: JISU001
   - Email: test@example.com
   - Password: test123
3. Register and login

### Test Admin Access:
1. Go to `admin-login.html`
2. Use default credentials:
   - Email: admin@library.com
   - Password: admin123
3. Access admin panel

## Security Considerations

### Current Implementation (Demo):
- ⚠️ Passwords stored in plain text in localStorage
- ⚠️ Client-side validation only
- ⚠️ No session expiration
- ⚠️ No password reset functionality

### Production Recommendations:
1. **Backend Authentication**
   - Use server-side validation
   - Implement JWT tokens
   - Hash passwords (bcrypt, argon2)

2. **Session Management**
   - Add session timeout
   - Implement refresh tokens
   - Track login attempts

3. **Security Enhancements**
   - Add CAPTCHA for registration
   - Implement 2FA (Two-Factor Authentication)
   - Add password reset via email
   - Rate limiting for login attempts

4. **Database Integration**
   - Move from localStorage to database
   - Use Firebase Auth or similar
   - Implement proper user roles

## Workflow Diagram

```
Start (index.html)
    ↓
Choose Portal
    ↓
    ├─→ User Portal
    │   ↓
    │   New User? → register.html → Fill Form → Create Account
    │   ↓
    │   login.html → Enter Credentials → Validate
    │   ↓
    │   Success → user.html (Protected)
    │   ↓
    │   Browse/Borrow Books
    │   ↓
    │   Logout → Back to login.html
    │
    └─→ Admin Portal
        ↓
        admin-login.html → Enter Admin Credentials → Validate
        ↓
        Success → admin.html (Protected)
        ↓
        Manage System
        ↓
        Logout → Back to admin-login.html
```

## Common Issues & Solutions

### Issue: Can't login after registration
**Solution**: Check browser console for errors. Ensure all fields were filled correctly during registration.

### Issue: Forgot password
**Solution**: Currently no reset feature. Clear localStorage and re-register, or use browser DevTools to view stored passwords.

### Issue: Admin credentials not working
**Solution**: Ensure you're using exact credentials:
- Email: `admin@library.com`
- Password: `admin123`

### Issue: Redirected to login after refresh
**Solution**: Check if localStorage is enabled. Some browsers in private mode may clear it.

### Issue: Multiple users with same email
**Solution**: System prevents this during registration. If it occurs, manually edit localStorage.

## Customization

### Change Admin Credentials:
1. Open browser DevTools (F12)
2. Go to Application → Local Storage
3. Find `lms_admin_credentials`
4. Edit the JSON:
```json
{
  "email": "your.admin@email.com",
  "password": "your_password"
}
```

### Add More Registration Fields:
1. Edit `register.html` - add form fields
2. Edit registration script - capture new fields
3. Update user data structure in `user.js`

### Customize Login Pages:
- Edit CSS in `<style>` section of login files
- Change colors, fonts, layouts
- Add company logo/branding

## Best Practices

1. **Always logout** when done using the system
2. **Use strong passwords** (mix of letters, numbers, symbols)
3. **Don't share credentials** with others
4. **Clear browser data** if using public computer
5. **Keep admin credentials secure**

## Future Enhancements

- [ ] Email verification for registration
- [ ] Password strength requirements
- [ ] Password reset via email
- [ ] Account activation workflow
- [ ] User profile pictures
- [ ] Social login (Google, Facebook)
- [ ] Multi-factor authentication
- [ ] Login history tracking
- [ ] Account lockout after failed attempts
- [ ] Session timeout warnings
