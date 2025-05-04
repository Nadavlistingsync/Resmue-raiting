# Resume Rater Pro

A full-stack SaaS application that helps users improve their resumes by providing AI-powered analysis and feedback.

## Features

- AI-powered resume analysis and scoring
- Industry-specific feedback
- Resume rewriting suggestions
- Leaderboard system
- Analytics tracking

## Tech Stack

- Next.js 15
- React 19
- TypeScript
- Google Sheets API
- OpenAI GPT-4
- Vercel Analytics

## Prerequisites

- Node.js 18.x
- npm or yarn
- Google Cloud Project with Sheets API enabled
- OpenAI API key
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

3. Create a `.env` file with the following environment variables:
   ```bash
   OPENAI_API_KEY=your_openai_api_key
   GOOGLE_SHEETS_CLIENT_EMAIL=your_service_account_email
   GOOGLE_SHEETS_PRIVATE_KEY=your_private_key
   GOOGLE_SHEETS_SPREADSHEET_ID=your_spreadsheet_id
   ```

4. Set up your Google Sheet:
   - Create a new Google Sheet
   - Name the first sheet "Ratings"
   - Add the following columns:
     - Nickname
     - Industry
     - Total Score
     - Presentation Scores (JSON)
     - Substance Scores (JSON)
     - Feedback (JSON)
     - Created At

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
   - Add the required environment variables in the Vercel dashboard
   - Deploy your application

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 