# GigLedger

GigLedger is a full-stack income tracker for Indian gig workers who earn across platforms like Ola, Uber, Swiggy, Zomato, Dunzo, Rapido, and Urban Company. It helps workers record income and expenses, estimate taxes under the Indian presumptive taxation scheme, get simple AI guidance, and generate self-reported income certificates.
India has over 15 million gig workers powering the country’s on-demand economy — driving cabs, delivering food, and running errands across platforms like Ola, Swiggy, and Dunzo.

They earn consistently.

But financially, they remain invisible.

A gig worker might earn ₹35,000 per month across multiple apps — yet struggle to:

rent a house apply for a loan show proof of income file taxes correctly

Because their income is scattered, unstructured, and undocumented.

🚨 The Problem

Today, gig workers face three major challenges:

No formal income proof Banks and landlords require salary slips or ITRs — which gig workers don’t have. Poor financial visibility Earnings are split across platforms with no unified view. Tax confusion & overpayment Most workers are unaware of deductions like fuel, phone, or maintenance. 💡 The Solution — GigLedger

GigLedger is a fintech dashboard built specifically for Indian gig workers.

It helps them:

📊 Track income across multiple platforms 💸 Log expenses and reduce taxable income 📈 Visualize earnings with simple analytics 🧾 Calculate tax liability automatically 📄 Generate professional income certificates

All in one place

## Prerequisites

- Node.js 20+
- MongoDB Atlas account and connection string

## Quick Start

1. Clone repo.
2. Run `npm run install:all`.
3. Copy `server/.env.example` to `server/.env` and fill in `MONGO_URI`, `JWT_SECRET`, and `CLIENT_URL`.
4. Copy `client/.env.example` to `client/.env`.
5. Run `npm run seed` to load optional test data.
6. Run `npm run dev`.
7. Open `http://localhost:5173`.
8. Test login: phone `9876543210`, password `test123`.

## API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/auth/register` | Register a worker account |
| POST | `/api/auth/login` | Log in and receive JWT |
| GET | `/api/auth/me` | Fetch current profile |
| PATCH | `/api/auth/onboarding` | Complete onboarding |
| GET | `/api/income` | List income entries |
| POST | `/api/income` | Create income entry |
| PUT | `/api/income/:id` | Update income entry |
| DELETE | `/api/income/:id` | Delete income entry |
| POST | `/api/income/parse-sms` | Parse payout SMS using local rules |
| GET | `/api/expenses` | List expenses |
| POST | `/api/expenses` | Create expense |
| PUT | `/api/expenses/:id` | Update expense |
| DELETE | `/api/expenses/:id` | Delete expense |
| GET | `/api/analytics/summary` | Dashboard and tax summary |
| GET | `/api/analytics/monthly-trend` | Last 12 months income trend |
| GET | `/api/analytics/platform-comparison` | Platform contribution breakdown |
| GET | `/api/analytics/earning-heatmap` | Average earning by weekday |
| GET | `/api/ai/tax-advisory` | AI tax advice |
| GET | `/api/pdf/certificate` | Download income certificate PDF |

## Project Structure

```text
gigledger/
├── server/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   ├── seed.js
│   ├── server.js
│   └── .env.example
├── client/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── charts/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   └── vite.config.js
├── package.json
└── README.md
```





<img width="1356" height="599" alt="image" src="https://github.com/user-attachments/assets/aa141f81-d554-4f10-850c-bacc54e71a07" />


