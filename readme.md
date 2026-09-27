# Backend Ledger

A double-entry accounting ledger system built with **Node.js**, **Express 5**, and **MongoDB (Mongoose)**. It provides secure user authentication, account management, and atomic money transfers between accounts — with an immutable ledger, idempotent transactions, and email notifications.

## ✨ Features

- **JWT Authentication** — Register/login with hashed passwords (bcrypt) and cookie/Bearer token support.
- **Multi-Account Support** — Each user can create and manage multiple accounts (`ACTIVE`, `FROZEN`, `CLOSED` states).
- **Double-Entry Ledger** — Every transaction produces a matching `DEBIT` and `CREDIT` ledger entry. Ledger entries are **immutable** — they can never be updated or deleted, enforced at the schema level.
- **Balance Derivation** — Account balance is always computed on the fly from the ledger (`CREDIT − DEBIT`), never stored directly, so it can't drift out of sync.
- **Idempotent Transfers** — Every transaction requires a unique `idempotencyKey`, preventing duplicate transfers on retry.
- **Atomic Transactions** — Transfers run inside a MongoDB session/transaction, so a debit and its matching credit either both succeed or both fail.
- **System User Flow** — A dedicated `system` user role can inject initial funds into accounts (e.g. for onboarding/seeding).
- **Transactional Email Notifications** — Registration and transfer confirmations sent via the Brevo (Sendinblue) API.

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express 5 |
| Database | MongoDB + Mongoose |
| Auth | JSON Web Tokens (`jsonwebtoken`), `bcryptjs` |
| Email | Brevo (`@getbrevo/brevo`) transactional email API |
| Dev Tooling | Nodemon, dotenv |

## 📁 Project Structure

```
backend-ledger/
├── server.js                  # Entry point — loads env, connects DB, starts server
├── src/
│   ├── app.js                 # Express app setup & route mounting
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/
│   │   ├── auth.controller.js         # Register / Login
│   │   ├── account.controller.js      # Create account, list accounts, get balance
│   │   └── transaction.controller.js  # Create transfer, system initial-funds
│   ├── middleware/
│   │   └── auth.middleware.js # JWT auth + system-user auth guards
│   ├── models/
│   │   ├── user.model.js
│   │   ├── account.model.js   # Includes getBalance() ledger aggregation
│   │   ├── ledger.model.js    # Immutable double-entry records
│   │   └── transaction.model.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── account.routes.js
│   │   └── transaction.routes.js
│   └── services/
│       └── email.service.js   # Brevo email sender
└── package.json
```

## 🔌 API Endpoints

### Auth — `/api/auth`
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/register` | Register a new user | Public |
| POST | `/login` | Log in and receive a JWT | Public |

### Accounts — `/api/accounts`
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/` | Create a new account for the logged-in user | Required |
| GET | `/` | List all accounts of the logged-in user | Required |
| GET | `/balance/:accountId` | Get the current balance of an account | Required |

### Transactions — `/api/transactions`
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/` | Transfer funds between two accounts | Required |
| POST | `/system/initial-funds` | Credit an account from the system account (funding) | System user only |

## ⚙️ Environment Variables

Create a `.env` file in the project root:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
BREVO_API_KEY=your_brevo_api_key
EMAIL_USER=your_sender_email@example.com
```

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/ALI-creator307/backend-ledger.git
cd backend-ledger

# Install dependencies
npm install

# Set up your .env file (see above)

# Run in development (auto-restart with nodemon)
npm run dev

# Run in production
npm start
```

The server starts on `http://localhost:3000` by default.

## 🧾 How a Transfer Works

1. Validate the request body (`fromAccount`, `toAccount`, `amount`, `idempotencyKey`).
2. Check the `idempotencyKey` — if it already exists, return the existing result instead of double-processing.
3. Verify both accounts are `ACTIVE`.
4. Derive the sender's live balance from the ledger and confirm sufficient funds.
5. Open a MongoDB session/transaction.
6. Create the `transaction` record as `PENDING`.
7. Write a `DEBIT` ledger entry for the sender.
8. Write a `CREDIT` ledger entry for the receiver.
9. Mark the transaction `COMPLETED` and commit the session.
10. Send an email notification to the sender.
