# Flipkart Clone – Frontend

A modern, responsive e-commerce frontend inspired by Flipkart, built using **React.js, Vite, and Tailwind CSS**. The application connects to a Node.js/Express backend and MongoDB database to provide product browsing, user authentication, shopping cart management, checkout, and Razorpay payment integration.

## 🚀 Live Demo

- **Live Website:** https://flipkart-clone-6bsn.vercel.app
- **Backend API:** https://flipkart-clone-backend-esb4.onrender.com

## ✨ Features

- **Responsive UI:** Modern interface optimized for desktop and mobile devices.
- **Product Browsing:** View product listings and detailed product information.
- **Search & Filtering:** Find products and explore categories.
- **Authentication:** Login, registration, and protected routes.
- **Shopping Cart:** Add products, update quantities, and persist cart data.
- **Checkout:** Delivery address management and checkout workflow.
- **Online Payments:** Razorpay payment gateway integration.
- **Order Confirmation:** View payment and order details after successful verification.
- **User Profile:** Manage profile information and profile image.
- **Admin Dashboard:** Access product and user management features through the admin section.
- **Performance Optimization:** Lazy loading, reusable components, and optimized API requests.

## 🧰 Tech Stack

- **React.js** – Component-based UI development
- **Vite** – Frontend development and build tool
- **Tailwind CSS** – Responsive styling
- **React Router** – Client-side navigation
- **Axios** – Backend API integration
- **Context API** – Shared application and authentication state
- **Razorpay Checkout** – Online payment interface
- **Cloudinary** – Product and profile image delivery

## 📂 Project Structure

```text
Frontend/
├── public/
├── src/
│   ├── admin/
│   ├── components/
│   ├── context/
│   ├── pages/
│   ├── App.jsx
│   └── main.jsx
├── .env
├── package.json
└── README.md
```

## ⚙️ Installation and Setup

### Prerequisites

- Node.js and npm
- Git
- A running backend API with the required environment configuration

### 1. Clone the Repository

```bash
git clone <YOUR_FRONTEND_REPOSITORY_URL>
cd Frontend
```

Replace the placeholder with your actual frontend GitHub repository URL.

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the frontend root directory:

```env
VITE_API_URL=http://localhost:5000
```

Use the exact variable name expected by your Axios configuration. For production, configure the deployed backend URL in your hosting provider's environment settings.

### 4. Run the Development Server

```bash
npm run dev
```

Open the local URL displayed by Vite, usually `http://localhost:5173`.

### 5. Build for Production

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## 🔗 Backend Integration

This repository contains the frontend application. Authentication, product data, order processing, database operations, and payment verification rely on the connected backend API.

- **Backend Technology:** Node.js and Express.js
- **Database:** MongoDB
- **Authentication:** JWT
- **Payment Gateway:** Razorpay
- **Image Hosting:** Cloudinary

## 🌐 Deployment

The frontend can be deployed using Vercel or another static hosting platform.

Before deployment:

1. Set the correct production API URL.
2. Configure backend CORS settings for the deployed frontend domain.
3. Verify authentication cookies and credential settings.
4. Test product browsing, cart, checkout, and payment flows.
5. Ensure no API secrets or private credentials are included in frontend environment variables.

## 🔮 Future Improvements

- Improved product discovery and filtering.
- Enhanced mobile experience and accessibility.
- Additional frontend performance optimizations.
- Improved order tracking and real-time customer support.

## 👨‍💻 Author

**Virang Dalwadi**

MCA Student | MERN Stack Developer

Building responsive and user-friendly web applications.

## 📄 Disclaimer

This project was developed for educational and portfolio purposes. Flipkart is a trademark of its respective owner. This project is not affiliated with or endorsed by Flipkart.
