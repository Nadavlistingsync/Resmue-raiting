# Resume Rater Pro

A modern SaaS application that helps users improve their resumes using AI-powered analysis and rewriting.

## Features

- AI-powered resume analysis and scoring
- Detailed feedback on presentation and substance
- Industry-specific resume rewriting
- User feedback collection and analytics
- Error tracking and monitoring
- Modern, responsive UI with Tailwind CSS
- Secure authentication with Supabase
- Payment processing with Stripe

## Tech Stack

- Next.js 13+ with App Router
- TypeScript
- Tailwind CSS
- Supabase (Auth & Database)
- Stripe (Payments)
- OpenAI GPT-4-turbo
- Vercel Analytics
- Sentry (Error Tracking)

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Fill in the required environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_KEY`
   - `STRIPE_SECRET_KEY`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `OPENAI_API_KEY`
   - `NEXT_PUBLIC_SENTRY_DSN`

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Migrations

To run database migrations:

```bash
npx supabase db reset
```

## Analytics and Monitoring

The application includes comprehensive analytics and monitoring:

- User engagement tracking with Vercel Analytics
- Error tracking and monitoring with Sentry
- User feedback collection and analysis
- Performance monitoring

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 