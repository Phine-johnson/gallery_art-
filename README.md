# Gallery Art

A production-ready gallery website for graphic designers to display and manage their artwork.

## Tech Stack
- **Frontend:** React (HTML, CSS, JS)
- **Backend:** Node.js, Express
- **Database:** MongoDB (Mongoose)
- **Image Upload:** Multer (local `/uploads`)
- **Authentication:** JWT, bcrypt

## Features
- Modern responsive UI (dark/light mode)
- Hero section, gallery grid, artwork cards
- User registration & login
- Artwork CRUD, like, search, filter, modal preview
- Secure REST API (Helmet, CORS, rate limiting)

## Setup Instructions

### Prerequisites
- Node.js & npm
- MongoDB

### 1. Backend Setup
```
cd server
npm install
cp .env.example .env # Edit with your values
npm run dev
```

### 2. Frontend Setup
```
cd ../client
npm install
npm start
```

### 3. Environment Variables
Create a `.env` file in `/server` with:
```
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

### 4. Image Uploads
Uploaded images are stored in `/uploads`.

---

## Project Structure
- `/client` — React frontend
- `/server` — Express backend (MVC)
- `/uploads` — Image storage

---

## Deployment
- Ready for deployment to services like Heroku, Vercel, or your own server.

---

## License
MIT
