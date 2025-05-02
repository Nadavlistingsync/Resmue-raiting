# Resume Rater Pro

An AI-powered resume rating and improvement tool built with Next.js, Supabase, and OpenAI GPT-4.

## Features

- Resume rating with detailed scoring breakdown
- Industry-specific feedback
- Leaderboard of top submissions
- AI-powered resume rewriting (premium feature)
- Modern, responsive UI with Tailwind CSS

## Tech Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Supabase (Auth + Database)
- OpenAI GPT-4
- Stripe (for premium features)

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/resume-rater-pro.git
   cd resume-rater-pro
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   OPENAI_API_KEY=your_openai_api_key
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   ```

4. Set up your Supabase database:
   - Create a new project in Supabase
   - Create a table called `resume_ratings` with the following columns:
     - `id` (uuid, primary key)
     - `nickname` (text)
     - `industry` (text)
     - `total_score` (integer)
     - `presentation_scores` (jsonb)
     - `substance_scores` (jsonb)
     - `feedback` (jsonb)
     - `created_at` (timestamp with time zone)

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `/app` - Next.js app router pages
- `/components` - Reusable React components
- `/lib` - Utility functions and client configurations
- `/utils` - Helper functions and prompt generators

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 