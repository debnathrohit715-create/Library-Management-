# Mobile UI Guide

## How to Test Mobile View

### Option 1: Browser DevTools (Recommended)
1. Open `user.html` in Chrome/Edge/Firefox
2. Press `F12` to open DevTools
3. Click the **Device Toolbar** icon (or press `Ctrl+Shift+M`)
4. Select a mobile device (e.g., iPhone 12, Galaxy S20)
5. Refresh the page

### Option 2: Resize Browser Window
1. Open `user.html`
2. Resize browser window to less than 768px width
3. Mobile UI will activate automatically

### Option 3: Actual Mobile Device
1. Host the files on a local server or deploy online
2. Open on your phone/tablet browser

## Mobile UI Features

### 📱 Sticky Header
- Blue gradient header stays at top while scrolling
- Shows app name and hamburger menu button
- Always accessible navigation

### ☰ Hamburger Menu
- Tap the **☰** button in top-right
- Sidebar slides in from left
- Dark overlay appears behind menu
- Tap overlay or menu item to close

### 🎨 Visual Changes on Mobile

| Desktop | Mobile |
|---------|--------|
| Permanent sidebar | Hidden sidebar (hamburger) |
| 4-column book grid | 1-column book grid |
| Large cards | Compact cards |
| Wide search bar | Full-width search |
| Side-by-side stats | Stacked stats |

### 👆 Touch Interactions
- **Tap** buttons for instant feedback
- **Swipe** filter tabs horizontally
- **Tap overlay** to close menu
- **Active states** on button press

### 📊 Responsive Breakpoints

```
Desktop (>900px):
├── Full sidebar visible
├── 4-column book grid
└── Wide layout

Tablet (768-900px):
├── Narrower sidebar
├── 2-column book grid
└── Medium layout

Mobile (<768px):
├── Hamburger menu
├── 1-column book grid
├── Sticky header
└── Compact layout
```

## Mobile-Specific Optimizations

### Typography
- Smaller headings on mobile
- Adjusted font sizes for readability
- Optimized line heights

### Spacing
- Reduced padding on cards
- Tighter gaps in grids
- Compact form fields

### Tables
- Horizontal scroll enabled
- Smaller text size
- Reduced cell padding

### Modals
- Full-width on small screens
- Adjusted padding
- Larger touch targets

### Notifications
- Toast spans full width
- Positioned above bottom edge
- Centered text

## Testing Checklist

- [ ] Hamburger menu opens/closes smoothly
- [ ] All navigation items work
- [ ] Books display in single column
- [ ] Search bar is full-width
- [ ] Filter tabs scroll horizontally
- [ ] Borrow/Return buttons are tap-friendly
- [ ] Modals fit on screen
- [ ] Forms are easy to fill
- [ ] Tables scroll horizontally
- [ ] Sync notification appears correctly

## Tips for Best Mobile Experience

1. **Portrait Mode**: Best for browsing books
2. **Landscape Mode**: Better for tables and forms
3. **Zoom**: Pinch to zoom if text is too small
4. **Scroll**: Smooth scrolling enabled throughout
5. **Tap**: All interactive elements are 44px+ for easy tapping

## Known Mobile Behaviors

- Sidebar closes automatically after selecting a menu item
- Filter tabs can be swiped left/right
- Tables scroll horizontally to show all columns
- Modals are centered and scrollable if content is long
- Toast notifications auto-dismiss after 3 seconds
