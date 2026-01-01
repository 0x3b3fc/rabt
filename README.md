# وحدة الربط المركزي (Central Linking Unit)

A full-stack web platform for managing union membership applications, built with Next.js 14, TypeScript, and PostgreSQL.

## Features

- **Arabic-first RTL interface** with Cairo font
- **Role-based authentication** (User/Admin)
- **Application workflow**: Submit -> Review -> Accept/Reject
- **Admin dashboard** with statistics and management tools
- **Governorate and Unit management**
- **Image upload** via Cloudinary
- **Responsive design** with shadcn/ui components

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Auth.js v5 (NextAuth)
- **UI**: TailwindCSS + shadcn/ui
- **Image Upload**: Cloudinary
- **Validation**: Zod
- **Forms**: React Hook Form

## Prerequisites

- Node.js 18+
- PostgreSQL database
- Cloudinary account (for image uploads)

## Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/rabt_db"

# Auth.js
AUTH_SECRET="your-secret-key-generate-with-openssl-rand-base64-32"
AUTH_URL="http://localhost:3000"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

### Generate AUTH_SECRET

```bash
openssl rand -base64 32
```

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd rabt
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Copy the example above to `.env`
   - Fill in your database and Cloudinary credentials

4. **Generate Prisma client**
   ```bash
   npm run db:generate
   ```

5. **Push schema to database**
   ```bash
   npm run db:push
   ```

6. **Seed the database**
   ```bash
   npm run db:seed
   ```

7. **Run the development server**
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Admin Credentials

After running the seed script:

- **Email**: `admin@central.local`
- **Password**: `Password123!`

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema to database |
| `npm run db:migrate` | Run migrations |
| `npm run db:seed` | Seed the database |
| `npm run db:studio` | Open Prisma Studio |
| `npm run db:reset` | Reset database |

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Auth pages (login, register)
│   ├── (user)/            # User pages (dashboard, apply, application)
│   ├── admin/             # Admin pages
│   └── api/               # API routes
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── layout/            # Layout components
│   ├── forms/             # Form components
│   └── shared/            # Shared components
├── actions/               # Server actions
├── validations/           # Zod schemas
├── lib/                   # Utilities and configurations
├── providers/             # React providers
└── types/                 # TypeScript types
```

## Database Schema

- **User**: System users with role (USER/ADMIN)
- **Governorate**: Egyptian governorates (27 seeded)
- **Unit**: Units within governorates
- **Application**: Membership applications
- **Setting**: System settings (key/value)

## User Flow

1. User registers an account
2. User submits application with personal data and photo
3. Admin reviews and accepts/rejects applications
4. If accepted, user is assigned to a unit
5. User can view their unit details and WhatsApp link

## Admin Features

- Dashboard with statistics
- Application management (review, accept, reject)
- User management
- Governorate CRUD
- Unit CRUD
- System settings

## Validation Rules

- **Full Name**: Arabic only, at least 4 words
- **National ID**: Exactly 14 digits, unique
- **Birth Date**: Valid date, age 18-100
- **Photo**: Required, max 5MB (JPG, PNG, WEBP)

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Set environment variables
4. Deploy

### Manual Deployment

1. Build the project:
   ```bash
   npm run build
   ```

2. Start the server:
   ```bash
   npm run start
   ```

## Security Features

- Password hashing with bcrypt (12 rounds)
- Server-side validation with Zod
- Middleware-based route protection
- Role-based access control
- CSRF protection (built into Auth.js)
- Secure file upload validation

## License

MIT License
