# 🪙 Wallet Service API

* **Version:** 1.0.0
* **Specification:** OAS 3.0
* **Live URL:** [https://wallet-service-ny2w.onrender.com](https://wallet-service-ny2w.onrender.com)
* **API Docs:** [https://wallet-service-ny2w.onrender.com/docs](https://wallet-service-ny2w.onrender.com/docs)

---

## ✨ Project Overview

This is a **ledger-based wallet service** designed for high-traffic applications such as gaming platforms or loyalty rewards systems.

Key Features:

* Manage user credits (Gold Coins, Reward Points, etc.) in a **closed-loop system** (cannot transfer outside the app)
* **Top up**, **bonus**, and **spend** wallet credits
* **Ledger-based double-entry system** for auditability
* **Concurrency-safe** and **idempotent** transactions
* Prevents negative balances, lost transactions, or race conditions

---
## 🛠 Tech Stack

| Layer             | Technology / Tool         |
| ----------------- | ------------------------- |
| Backend           | Node.js, TypeScript       |
| Framework         | Express.js                |
| Database          | PostgreSQL                |
| ORM / DB Toolkit  | Prisma                    |
| Authentication    | JWT (if applicable)       |
| Logging           | Winston / Custom Logger   |
| API Documentation | Swagger (OpenAPI 3.0)     |
| Containerization  | Docker, Docker Compose    |
| Deployment        | Render                    |
| Testing           | Postman                   |

---

## ⚡ Setup & Installation

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/SekharSunkara6/Wallet-Service.git
cd Wallet-Service
```

### 2️⃣ Install Dependencies

```bash
npm install
```

---

### 3️⃣ Environment Variables

Create a `.env` file for local development:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5433/walletdb"
PORT=4000
BASE_URL=http://localhost:4000
```

Render deployment environment variables:

| Key          | Value                                                                                |
| ------------ | ------------------------------------------------------------------------------------ |
| BASE_URL     | [https://wallet-service-ny2w.onrender.com](https://wallet-service-ny2w.onrender.com) |
| DATABASE_URL | postgresql://<user>:<password>@<host>/wallet_db_me4j                                 |
| PORT         | 10000                                                                                |

---

### 4️⃣ Database Migration & Seed

#### Prisma Migrations

```bash
npx prisma migrate dev --name init
```

#### Seed Data

```bash
npx ts-node prisma/seed.ts
```

Seed script creates:

* **Assets:** INR, USD, BTC, ETH
* **Users:** Alice, Bob, Charlie, System
* **User Wallets:** Initial balances
* **System Wallets:** For ledger operations

---

### 5️⃣ Run the Server

#### Local

```bash
npx ts-node src/server.ts
```

#### Docker (Recommended)

**Dockerfile**:

```dockerfile
FROM node:20
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate
RUN npx tsc
EXPOSE 3000
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.js"]
```

**docker-compose.yml**:

```yaml
services:
  db:
    image: postgres:15
    restart: always
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: walletdb
    ports:
      - "5433:5432"
    volumes:
      - db-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres -d walletdb"]
      interval: 5s
      timeout: 5s
      retries: 5

  app:
    build: .
    depends_on:
      db:
        condition: service_healthy
    environment:
      DATABASE_URL: "postgresql://postgres:password@db:5432/walletdb"
    ports:
      - "4000:4000"
    command: sh -c "npx prisma migrate deploy && npx ts-node prisma/seed.ts && node dist/server.js"

volumes:
  db-data:
```

Start containers:

```bash
docker compose up -d
```

---

## 📝 API Endpoints & Test Results

All API requests accept and return **JSON**.

### 1️⃣ Top-up Wallet

**POST** `/wallet/topup`

**Request Body:**

```json
{
  "userId": "userA",
  "assetId": "INR",
  "amount": 1000
}
```

**Response (200 OK):**

```json
{
  "walletId": "656a3f55-c3e9-4358-8c78-d6c31a185ff4",
  "balance": 1000
}
```

> ✅ Wallet credited successfully

---

### 2️⃣ Spend Wallet

**POST** `/wallet/spend`

**Request Body:**

```json
{
  "userId": "userA",
  "assetId": "INR",
  "amount": 5000
}
```

**Response (400 Bad Request):**

```json
{
  "success": false,
  "message": "Insufficient balance"
}
```

**Request Body (Sufficient Funds):**

```json
{
  "userId": "userA",
  "assetId": "INR",
  "amount": 253
}
```

**Response (200 OK):**

```json
{
  "walletId": "656a3f55-c3e9-4358-8c78-d6c31a185ff4",
  "balance": 747
}
```

> ✅ Wallet debited successfully

---

### 3️⃣ Add Bonus

**POST** `/wallet/bonus`

**Request Body Example:**

```json
{
  "userId": "userA",
  "assetId": "INR",
  "amount": 100
}
```

**Response (200 OK):**

```json
{
  "walletId": "656a3f55-c3e9-4358-8c78-d6c31a185ff4",
  "balance": 847
}
```

---

### 4️⃣ Get Balance

**GET** `/wallet/{userId}/{assetId}/balance`

**Example:**

```bash
curl -X GET "https://wallet-service-ny2w.onrender.com/wallet/userA/INR/balance" -H "accept: application/json"
```

**Response (200 OK):**

```json
{
  "walletId": "656a3f55-c3e9-4358-8c78-d6c31a185ff4",
  "balance": 747
}
```

---

### 5️⃣ Get Transactions

**GET** `/wallet/{userId}/{assetId}/transactions?page=1&limit=10`

**Response (200 OK):**

```json
{
  "success": true,
  "walletId": "656a3f55-c3e9-4358-8c78-d6c31a185ff4",
  "page": 1,
  "limit": 10,
  "transactions": [
    {
      "id": "34f97451-dda2-4d8d-9cac-b357d3e34db8",
      "walletId": "656a3f55-c3e9-4358-8c78-d6c31a185ff4",
      "amount": -253,
      "type": "DEBIT",
      "reference": "54bf7747-7088-47e3-b8ed-13d720bffcb0",
      "createdAt": "2026-02-22T13:56:49.259Z"
    },
    {
      "id": "f34df3fa-5d9f-4eef-9b13-8477ad8d64e2",
      "walletId": "656a3f55-c3e9-4358-8c78-d6c31a185ff4",
      "amount": 1000,
      "type": "CREDIT",
      "reference": "f00b4b96-0974-4f0f-ad20-dcdaffc1f5c3",
      "createdAt": "2026-02-22T13:54:31.802Z"
    }
  ]
}
```

---

## 🔒 Concurrency & Idempotency

* All **credit/debit operations** are wrapped in `Prisma $transaction` to ensure **atomicity**
* **Idempotency keys** prevent duplicate transactions if the same request is retried

---

## 📚 Ledger Architecture

* Implements **double-entry ledger system**:

  * Each transaction generates a **CREDIT** in user wallet and **DEBIT** in system wallet
* Enables **full audit trail**, prevents **negative balances**, ensures **data consistency**

---

## 🛠 Error Handling & Logging

* Errors are returned in a **clean JSON format**:

```json
{
  "success": false,
  "message": "Error message here"
}
```

* Basic logging records all top-ups, spends, and bonuses in `logger.ts`

---

## ☁ Deployment

* **Hosted on Render:** [https://wallet-service-ny2w.onrender.com](https://wallet-service-ny2w.onrender.com)
* Dockerized deployment ensures **easy reproducibility**

---

## 🧑‍💻 Author

* **Name:** PurnaSekhar Sunkara
* **GitHub:** [https://github.com/SekharSunkara6](https://github.com/SekharSunkara6)
* **Portfolio:** [https://sekharsunkaraportfolio.netlify.app/](https://sekharsunkaraportfolio.netlify.app/)
