# Fullstack Project Management Dashboard

This is a fullstack project management dashboard built with Next.js, Tailwind CSS, Redux Toolkit, Material UI Data Grid, Nodejs, Express, TypeScript, Prisma, PostgreSQL, and JWT.

## Live Demo

[https://full-stack-project-management-system.vercel.app/auth](https://full-stack-project-management-system.vercel.app/auth)

### Credentials

- **Email**: `test409@test.com`
- **Password**: `Password1`

## Technology Stack

- **Frontend**: Next.js, Tailwind CSS, Redux Toolkit, Redux Toolkit Query, Material UI Data Grid
- **Backend**: Node.js with Express, Prisma (PostgreSQL ORM)
- **Database**: PostgreSQL, managed with PgAdmin

## Features

- **Task Management**: Create, update, and delete tasks with a user-friendly interface.
- **Project Management**: Organize tasks into projects and assign them to team members.
- **User Authentication**: Secure user registration and login with JWT-based authentication.
- **Search and Filtering**: Filter tasks by project, status, and priority.
- **Image Upload**: Upload images for user creation.
- **Responsive Design**: Optimized for various screen sizes.

## Getting Started

### Installation Steps

1. Clone the repository:
   `git clone [git url]`
   `cd project-management`

2. Install dependencies in both client and server:
   `cd client`
   `npm i`
   `cd ..`
   `cd server`
   `npm i`

3. Set up the database:
   `npx prisma generate`
   `npx prisma migrate dev --name init`

4. Configure environment variables:

- `.env` for server settings (PORT, DATABASE_URL)
- `.env.local` for client settings (NEXT_PUBLIC_API_BASE_URL)

5. Run the project
   `npm run dev`
