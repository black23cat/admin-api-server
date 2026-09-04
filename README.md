# Polygraphic Admin API Server

Backend Server for admin api written in node.js with express and prisma API. This API is used to manage purchase order, invoice, payment and jobdata.

## 🚀 Features

### Authentication

- JWT based authentication
- User authentication using passport.jwt
- Protected API routes, unauthorized user cant access resources
- Administrator regist only

#### Purchase Order (PO) Mangement

- CRUD Purchase Order
- Store PO Details
- Find and filter PO Data
- Upload file for extracting Job Data from filename
- File Upload validation, reject invalid filename formats
- Multiple print type category

#### Invoice Management

- Generate invoice from existing PO Data
- Calculate print cost, get data from extracted filename from PO data
- Additional non-print items
- Discount or cashback
- Track invoice status and payment
- Store payment history
- Cancel invoice when necessary

#### Payment Tracking

- Store payment data history
- Support Down Payment(DP)
- Multiple payment methods

#### Job Data

- Generate job data from invoiced Purchase Order

## 🛠 Tech Stack

- Node.js
- Express.js
- PostgreSQL
- Prisma ORM
- Passport.js
- JSON Web Token
- dotenv

## ⚙️ Installation

### 1. Clone the repo

```
git clone https://github.com/black23cat/admin-api-server.git
```

#### 2. Move into the project directory and install dependencies

```
cd admin-api-server && npm install
```

## 🔐 Environment Variables

Create .env file in root directory with DATABASE_URL and JWT_SECRET
Example:

```
DATABASE_URL="postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE"
JWT_SECRET="your-secret-key"
```

## 🗄 Database Setup

### 1. Generate prisma client

```
npx prisma Generate
```

#### 2. Run Database migration

```
npx prisma migrate dev
```

## ▶️ Running the Application

### 1. Start development server

```
npm run dev
```

#### 2.The default configuration will start the server on:

```
http://localhost:3000
```

The actual port may differ depending on your environment configuration.

## 🔮 Future Improvements

Potential improvements for future development include:

- Implement Refresh token for better security
- Improve reporting dashboard
- Automated monthly financial reports

## 🙏 Acknowledgements

This project was developed as part of my journey in learning full-stack web development.

Special thanks to The Odin Project for providing a comprehensive, free, and open-source curriculum that helped me build a strong foundation in modern web development.

Thank you to The Odin Project and its open-source community for making high-quality programming education accessible to everyone.

🔗 [The Odin Project](https://www.theodinproject.com/)

🔗 [The Odin Project on GitHub](https://github.com/theodinproject)

## 👨‍💻 Author

Developed by Prayogi Pangestu @ black23cat

## 📄 License

This project is currently intended as a personal portfolio and internal administration application.

Please contact the repository owner before using this project for commercial purposes.
