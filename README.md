# NFT Market Project

A comprehensive NFT Marketplace solution featuring a main user marketplace, a dedicated creator dashboard, and a robust Django backend.

## Folder Structure

The project is organized into three main components. Below is the detailed structure:

```bash
NFT_Market/
├── frontend_nft/                  # User Marketplace (React + Vite)
│   ├── src/
│   │   ├── page/                  # Application Routes/Pages
│   │   │   ├── Home.tsx           # Landing Page
│   │   │   ├── Explore.tsx        # Marketplace Grid
│   │   │   ├── NFTDetail.tsx      # Single NFT View
│   │   │   ├── Auctions.tsx       # Live Auctions
│   │   │   ├── Transaction.tsx    # Buying/Selling Logic
│   │   │   ├── EditProfilePage.tsx
│   │   │   └── ... (Auth pages)
│   │   ├── components/            # UI Components
│   │   │   ├── ui/                # Base UI Elements (Radix/Tailwind)
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── NFTCard.tsx
│   │   │   ├── HeroSection.tsx
│   │   │   ├── Creator.tsx
│   │   │   └── ...
│   │   ├── context/               # State Management
│   │   ├── lib/                   # Utilities
│   │   └── App.tsx                # Main Router Config
│
├── frontend-creator/              # Creator/Admin Dashboard (React + Vite)
│   ├── src/
│   │   ├── pages/                 # Dashboard Routes
│   │   │   ├── DashboardHome.tsx
│   │   │   ├── Login.tsx
│   │   │   └── Register.tsx
│   │   ├── components/            # Dashboard Components
│   │   │   ├── dashboard/         # Sidebar, Charts, Tables
│   │   │   └── ui/                # Shared UI Elements
│   │   └── App.tsx
│
└── market/                        # Backend API (Django REST Framework)
    ├── marketplace/               # Main Application Logic
    │   ├── models.py              # Database Schemas (NFT, Collection, User)
    │   ├── views.py               # API Enpoints & Logic
    │   ├── serializers.py         # JSON Data Conversion
    │   ├── urls.py                # API Route Definitions
    │   ├── admin.py               # Django Admin Config
    │   └── tests.py               # Unit Tests
    ├── nft_market/                # Project Settings
    ├── media/                     # User Uploads (NFTs, Avatars)
    ├── db.sqlite3                 # Local Database
    └── manage.py                  # CLI Entry Point
```

## Tech Stack

### Frontend
- **Framework**: React 19 (via Vite)
- **Language**: TypeScript
- **Styling**: TailwindCSS 4, Radix UI, Framer Motion
- **HTTP Client**: Axios

### Backend
- **Framework**: Django
- **Database**: SQLite (Default)
- **Authentication**: JWT (Suggested/Standard for this stack)

---

## Setup Instructions

Follow these steps to get the project running locally.

### 1. Backend Setup (`market`)

Prerequisites: Python 3.x installed.

1.  Navigate to the backend directory:
    ```bash
    cd market
    ```

2.  Create and activate a virtual environment:
    ```bash
    # Create (if not exists)
    python -m venv env

    # Activate (Linux/Mac)
    source env/bin/activate

    # Activate (Windows)
    .\env\Scripts\activate
    ```

3.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```

4.  Run database migrations:
    ```bash
    python manage.py migrate
    ```

5.  Start the development server:
    ```bash
    python manage.py runserver
    ```
    The backend runs at `http://127.0.0.1:8000/`.

### 2. Main Marketplace Frontend (`frontend_nft`)

1.  Navigate to the directory:
    ```bash
    cd frontend_nft
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Start the development server:
    ```bash
    npm run dev
    ```
    The app runs at `http://localhost:5173/` (or similar).

### 3. Creator Dashboard Frontend (`frontend-creator`)

1.  Navigate to the directory:
    ```bash
    cd frontend-creator
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Start the development server:
    ```bash
    npm run dev
    ```
    The dashboard runs at `http://localhost:5174/` (or whichever port Vite checks out).
