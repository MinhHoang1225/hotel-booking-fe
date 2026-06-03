# 🏨 Hotel Booking System - Frontend (User Interface)

The frontend project for the Hotel Booking System. Built with ReactJS, Vite, and Tailwind CSS, providing a smooth user experience, lightning-fast page loads, and an intuitive management dashboard.

## ✨ Key Features

- **Customer Interface (User):**
  - Search for hotels by location and number of guests (with synced URL Query Params).
  - Book rooms, check availability, and auto-calculate total prices.
  - Secure and intuitive simulated payment gateway.
  - View booking history and write reviews.

- **Hotel Owner Dashboard:**
  - Register and manage hotel information, upload multiple images (Base64/Cloudinary).
  - Manage room lists, prices, capacities, and amenities.
  - Track customer bookings and overall revenue.
  - View and respond directly to customer reviews.

- **Admin Dashboard:**
  - Manage all users in the system.
  - Role-based access control (User, Owner, Admin).
  - Moderate new hotels (Approve / Reject).
  - Monitor all bookings across the system.

## 🚀 Tech Stack

- **Core:** React, Vite, TypeScript
- **Routing:** React Router DOM
- **Styling:** Tailwind CSS
- **Icons & UI:** Lucide React, React Hot Toast
- **Forms & State:** React Hook Form, Zustand (`useAuthStore`)
- **API & Realtime:** Fetch API/Axios, Socket.io (client)

## ⚙️ Installation & Setup

**1. Install dependencies**

```bash
cd hotel-booking-fe
npm install
```

**2. Configure environment variables**
Create a `.env` file in the root of the frontend directory:

```bash
cp .env.example .env
```

_Update `.env`:_

```dotenv
VITE_API_URL=http://localhost:4000/api/v1     # Ensure this points to the correct Backend port (e.g., 4000)
VITE_SOCKET_URL=http://localhost:4000
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

**3. Run the application (Development Mode)**

```bash
npm run dev
```

The app will be available at: `http://localhost:5173`

**4. Build for Production**

```bash
npm run build
npm run preview
```

## 📁 Project Structure

- `src/components`: Shared UI Components (Button, Card, Input, Select, ErrorState, etc.).
- `src/pages`:
  - `/booking`: Checkout, payment, and success pages.
  - `/dashboard`: Admin/Owner interfaces (Approve Hotels, Manage Rooms, Manage Users, etc.).
  - `HomePage.tsx`: Main search page.
- `src/services`: Separated API call functions (hotels, bookings, users, reviews, etc.).
- `src/types`: TypeScript interfaces defining standard data types from the Backend.
- `src/store`: Global state management (e.g., `authStore` for user authentication).

---

_Developed by the Hotel Booking Project Team._
