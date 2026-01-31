# 🛒 ASTU Marketplace – High-End Campus Commerce

A sophisticated, full-stack student-to-student marketplace built with the MERN stack. This platform allows students to list, discover, and trade campus essentials with a luxury editorial user interface.

## ✨ Key Features

- **Secure Authentication:** JWT-based auth using HTTP-only cookies for maximum security.
- **Product CRUD:** Complete listing lifecycle (Create, Read, Update, Delete).
- **Role-Based Access Control (RBAC):**
  - Users can only edit/delete their own listings.
  - Admins have "Moderator Mode" to manage all content.
- **Wink Studio UI:** A premium, minimalist design inspired by luxury fashion editorials.
- **Dynamic Filtering:** Real-time search, category grouping, and price range filtering.
- **Seller Inquiry:** One-click email connection between buyers and sellers.
- **Fully Responsive:** Optimized for everything from high-res monitors to mobile phones.

## 🛠️ Tech Stack

- **Frontend:** Next.js 15 (App Router), Tailwind CSS v4, Lucide Icons, Axios.
- **Backend:** Node.js, Express.js, TypeScript.
- **Database:** MongoDB Atlas with Mongoose ODM.
- **Deployment:** Render (Backend), Vercel (Frontend).

## 🚦 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/fenet-s/ASTU_MSJ_2025_Bootcamp_sisters.git
cd ASTU_MSJ_2025_Bootcamp_sisters/marketplace

Create a .env file in the backend folder:

PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

Create a .env.local file in the frontend folder:
NEXT_PUBLIC_API_URL=http://localhost:5000/api

 Install & Run

Backend

cd backend
npm install
npm run dev

Frontend

cd frontend
npm install
npm run dev

📂 Project Structure
/backend: Express API, JWT Auth, and Mongoose Models.
/frontend: Next.js 15 App with Tailwind v4 styling.
/README.md
/subscription-tracker: (Legacy/Other project).
🏆 Deployment
Live Site: [Insert your Vercel Link Here]
API Endpoint: [Insert your Render Link Here]
```
