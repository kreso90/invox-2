# INVOX

INVOX is a web application for simple business and invoice management. Built for the Croatian market, it features a localized interface and support for Croatian business data.

## Demo

Try the application: [invox-dusky.vercel.app](https://invox-dusky.vercel.app/)

Use the following demo credentials to sign in:

| Field    | Value           |
| -------- | --------------- |
| Email    | `demo@invox.hr` |
| Password | `admin123`      |

The demo account is intended for testing purposes only. Do not enter real or confidential information.

## Features

- Business overview, including revenue and upcoming obligations
- Client and product management
- Invoice creation and tracking, including payments and due dates
- Business obligations and tax information tracking
- Business profile and settings management
- PDF invoice generation and payment barcode generation

## Tech Stack

- [Next.js](https://nextjs.org/) and React
- TypeScript
- [Prisma](https://www.prisma.io/) and PostgreSQL
- [Better Auth](https://www.better-auth.com/)
- Tailwind CSS

## Getting Started

### Prerequisites

- Node.js and npm
- A PostgreSQL database

### Installation

1. Clone the repository and install the dependencies:

   ```bash
   git clone https://github.com/kreso90/invox-2.git
   cd invox-2
   npm install
   ```

2. Create a `.env` file in the project root:

   ```env
   DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?schema=public"
   BETTER_AUTH_URL="http://localhost:3000"
   RESEND_API_KEY="your-resend-api-key"
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   ```

   `DATABASE_URL` is required to connect to PostgreSQL. The email and Google OAuth configuration variables are required for the corresponding authentication and email functionality.

3. Apply database migrations, generate the Prisma Client, and start the development server:

   ```bash
   npx prisma migrate deploy
   npx prisma generate
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

To create the demo user and sample data, run:

```bash
npx prisma db seed
```

## Disclaimer

INVOX is a business administration tool. Before making tax or accounting decisions, verify the applicable regulations and consult a qualified professional.
