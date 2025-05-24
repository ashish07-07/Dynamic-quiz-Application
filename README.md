# Dynamic Math Quiz Application



A real-time, interactive math quiz application built with modern web technologies. Features live competition, multiple difficulty levels, and instant results.

## Features

- 🚀 Real-time math quizzes using Socket.io
- 🏆 Live leaderboard with user rankings
- ⏱️ Timed questions and quick answer submission
- 🔐 User authentication system
- 📈 Progress tracking and historical results

## Technologies Used

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Real-Time Communication**: Socket.io
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**:Next-Auth
## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/dynamic-math-quiz.git
   cd dynamic-math-quiz

   cd backend
2. Backend Setup
```bash
npm install
npm run build
```
3 Create environment file from template
cp .env.example .env

  Database Setup
```bash
# Run Prisma migrations
npx prisma migrate dev --name init

# Generate Prisma client
npx prisma generate
```

4. Frontend Setup
```bash
cd ../client
npm install

# Create frontend environment file
cp .env.example .env.local
```

Running the Application
```bash
# Build andstart  backend
cd backend
npm run build
npm run start

# Start frontend (in new terminal)
cd ../client
npm run dev


