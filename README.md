# Resume Rater Pro

A full-stack SaaS application that helps users improve their resumes by providing AI-powered analysis and feedback.

## Features

- AI-powered resume analysis and scoring
- Industry-specific feedback
- Resume rewriting suggestions
- Leaderboard system
- User feedback collection
- Analytics tracking

## Tech Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Supabase
- OpenAI GPT-4
- Sentry
- Vercel Analytics

## Prerequisites

- Node.js 18.x
- npm or yarn
- Supabase account
- OpenAI API key
- Sentry account (optional)
- Vercel account (optional)

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/resume-rater-pro.git
   cd resume-rater-pro
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file based on `.env.example` and fill in your environment variables:
   ```bash
   cp .env.example .env
   ```

4. Set up your Supabase database with the following tables:

   ```sql
   -- resume_ratings table
   create table resume_ratings (
     id uuid default uuid_generate_v4() primary key,
     nickname text not null,
     industry text not null,
     total_score integer not null,
     presentation_scores jsonb not null,
     substance_scores jsonb not null,
     feedback jsonb not null,
     created_at timestamp with time zone default timezone('utc'::text, now()) not null
   );

   -- feedback table
   create table feedback (
     id uuid default uuid_generate_v4() primary key,
     resume_id uuid references resume_ratings(id),
     rating integer not null,
     comment text,
     created_at timestamp with time zone default timezone('utc'::text, now()) not null
   );
   ```

5. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## Deployment

1. Push your code to GitHub:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. Deploy to Vercel:
   - Connect your GitHub repository to Vercel
   - Add your environment variables in the Vercel dashboard
   - Deploy

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 