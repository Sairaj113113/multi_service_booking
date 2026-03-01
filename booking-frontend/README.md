# LuxeBook — Premium Service Booking Frontend

React + Vite + Tailwind CSS + Framer Motion frontend for the Multi-Service Booking & Appointment System.

## Tech Stack

- **React 18** + **Vite 5**
- **Tailwind CSS** — luxury dark theme with gold accents
- **Framer Motion** — smooth page/component animations
- **Axios** — API layer with JWT interceptors
- **React Router v6** — client-side routing
- **Context API** — global auth state
- **react-hot-toast** — toast notifications

---

## Project Structure

```
src/
├── api/
│   ├── api.js              # Axios instance + interceptors
│   └── endpoints.js        # All API call functions
├── components/
│   ├── booking/
│   │   ├── BookingCard.jsx  # Booking list item with cancel
│   │   ├── ServiceCard.jsx  # Service card with hover effects
│   │   └── SlotCard.jsx     # Slot selection card
│   ├── layout/
│   │   ├── Footer.jsx
│   │   ├── Navbar.jsx       # Animated sticky navbar
│   │   ├── PageLayout.jsx   # Wrapper with Navbar + Footer
│   │   └── ProtectedRoute.jsx
│   └── ui/
│       ├── Badge.jsx        # Status badges
│       ├── EmptyState.jsx   # Illustrated empty states
│       ├── GoldDivider.jsx  # Decorative dividers
│       └── SkeletonCard.jsx # Loading skeletons
├── context/
│   └── AuthContext.jsx      # Auth state + JWT management
├── hooks/
│   └── useApi.js            # Generic API hooks
└── pages/
    ├── LandingPage.jsx       # Hero + services showcase + CTA
    ├── LoginPage.jsx
    ├── RegisterPage.jsx
    ├── ServicesPage.jsx      # Service grid with search
    ├── ServiceDetailPage.jsx # Slots + booking flow
    ├── MyBookingsPage.jsx    # Dashboard with cancel
    └── NotFoundPage.jsx
```

---

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
```
Edit `.env`:
```
VITE_API_BASE_URL=http://localhost:8080
```

### 3. Start dev server
```bash
npm run dev
# → http://localhost:3000
```

### 4. Build for production
```bash
npm run build
# Output: dist/
```

---

## Design System

| Token | Value |
|-------|-------|
| Primary Gold | `#D4AF37` |
| Background | `#07070f` |
| Surface | `#0d0d1a` |
| Surface 2 | `#18182c` |
| Font Display | Playfair Display |
| Font Body | DM Sans |
| Font Mono | JetBrains Mono |

---

## Pages & Routes

| Route | Access | Description |
|-------|--------|-------------|
| `/` | Public | Landing page |
| `/login` | Public | Sign in |
| `/register` | Public | Create account |
| `/services` | Public | Browse services |
| `/services/:id` | Public | Slots + book |
| `/my-bookings` | ROLE_USER | Booking dashboard |

---

## Features

- **Parallax hero** with animated gold orbs
- **Glassmorphism cards** throughout
- **Skeleton loaders** on all data-fetching views
- **Empty states** with illustrations
- **Booking success modal** with ripple animation
- **Tabbed bookings dashboard** (All / Active / Cancelled)
- **Inline cancel confirmation** — no separate page
- **JWT auto-attach** via Axios interceptor
- **Auto-redirect** to login on 401
- **Role-aware navbar** — shows relevant links per role
- **Responsive** — mobile-first with hamburger menu
