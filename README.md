# Medical Store Management Dashboard

A comprehensive admin dashboard for medical store inventory, billing, restocking, and revenue analytics built with **Next.js (App Router)**, **React**, **Tailwind CSS**, and **Firebase**.

## Features

- **Admin-only authentication** (Firebase Auth — no signup/forgot password)
- **Product management** with MRP, selling rate, stock, expiry, and batch tracking
- **Category pages**: Medicines, Syrups, Tubes, Cosmetics, Drips
- **Low stock alerts** with one-click restock modal
- **Sales & revenue analytics** with daily/weekly/monthly/yearly charts
- **Custom date range filter** for revenue, cost, and volume metrics
- **Category distribution donut chart**
- **POS billing** with PDF invoice download
- **Dark / Light theme toggle** with smooth transitions

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS 4 |
| Icons | Lucide React |
| Charts | Recharts |
| PDF | jsPDF + html2canvas |
| Backend | Firebase Auth + Firestore |

## Getting Started

### 1. Install dependencies

```bash
cd medical-store
npm install
```

### 2. Configure Firebase

1. Create a project at [Firebase Console](https://console.firebase.google.com)
2. Enable **Authentication** → Email/Password sign-in
3. Create an **admin user** manually (Authentication → Users → Add user)
4. Enable **Cloud Firestore** database
5. Copy `.env.local.example` to `.env.local` and fill in your Firebase config:

```bash
cp .env.local.example .env.local
```

### 3. Firestore Security Rules (recommended)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and log in with your Firebase admin credentials.

## Project Structure

```
medical-store/
├── src/
│   ├── app/
│   │   ├── (dashboard)/          # Protected routes with sidebar
│   │   │   ├── dashboard/        # Main dashboard
│   │   │   ├── medicines/        # Category pages
│   │   │   ├── syrups/
│   │   │   ├── tubes/
│   │   │   ├── cosmetics/
│   │   │   ├── drips/
│   │   │   ├── restock/          # Low stock & restock
│   │   │   ├── analytics/        # Revenue charts
│   │   │   └── billing/          # POS & invoices
│   │   ├── login/                # Admin login
│   │   └── layout.tsx
│   ├── components/
│   │   ├── analytics/            # Charts & date picker
│   │   ├── auth/                 # Auth guard
│   │   ├── billing/              # POS checkout
│   │   ├── dashboard/            # Metrics & alerts
│   │   ├── layout/               # Sidebar & theme
│   │   ├── products/             # Forms & lists
│   │   └── ui/                   # Shared UI
│   ├── context/                  # Auth & theme providers
│   ├── hooks/                    # Data fetching hooks
│   ├── lib/                      # Firebase & utilities
│   └── types/                    # TypeScript types
├── .env.local.example
└── README.md
```

## Firestore Collections

| Collection | Fields |
|-----------|--------|
| `products` | name, category, mrpRate, sellingRate, stockQuantity, expiryDate, batchNumber, createdAt, updatedAt |
| `sales` | items[], totalRevenue, totalCost, totalItems, invoiceNumber, createdAt |

## License

Private — for internal medical store use.
