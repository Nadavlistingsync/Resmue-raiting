# Resume Rating Pro

A professional resume rating application that provides detailed feedback and scoring based on multiple criteria.

## Features

- **Comprehensive Rating System**: Evaluates resumes across multiple categories including technical skills, experience, education, projects, and soft skills
- **Tier-Based Scoring**: Categorizes resumes into four tiers:
  - 🏆 Top 1% (98-100): Elite, polished, ready to submit anywhere
  - 🥈 Top 10% (90-97): Excellent, minor improvements possible
  - 🥉 Mid-tier (70-89): Good, but needs targeted improvements
  - 📝 Below average (<70): Likely needs major revision
- **Detailed Feedback**: Provides specific feedback for each category
- **Industry-Specific Analysis**: Tailors feedback based on the industry
- **Leaderboard**: Tracks top performers across different categories

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/Nadavlistingsync/resume-rating.git
```

2. Install dependencies:
```bash
cd resume-rating
npm install
```

3. Set up environment variables:
Create a `.env.local` file with the following variables:
```
GOOGLE_SHEETS_CLIENT_EMAIL=your_client_email
GOOGLE_SHEETS_PRIVATE_KEY=your_private_key
GOOGLE_SHEETS_SPREADSHEET_ID=your_spreadsheet_id
```

4. Run the development server:
```bash
npm run dev
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 