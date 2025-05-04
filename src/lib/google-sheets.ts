import { google } from 'googleapis';

if (!process.env.GOOGLE_SHEETS_CLIENT_EMAIL) {
  throw new Error('Missing GOOGLE_SHEETS_CLIENT_EMAIL');
}

if (!process.env.GOOGLE_SHEETS_PRIVATE_KEY) {
  throw new Error('Missing GOOGLE_SHEETS_PRIVATE_KEY');
}

if (!process.env.GOOGLE_SHEETS_SPREADSHEET_ID) {
  throw new Error('Missing GOOGLE_SHEETS_SPREADSHEET_ID');
}

const auth = new google.auth.JWT({
  email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
  key: process.env.GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, '\n'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

export interface ResumeRating {
  id: string;
  nickname: string;
  industry: string;
  total_score: number;
  presentation_scores: Record<string, number>;
  substance_scores: Record<string, number>;
  feedback: Record<string, string>;
  created_at: string;
}

export const googleSheets = {
  async appendRating(rating: Omit<ResumeRating, 'id'>) {
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEETS_SPREADSHEET_ID,
      range: 'Ratings!A:G',
      valueInputOption: 'RAW',
      requestBody: {
        values: [[
          rating.nickname,
          rating.industry,
          rating.total_score,
          JSON.stringify(rating.presentation_scores),
          JSON.stringify(rating.substance_scores),
          JSON.stringify(rating.feedback),
          rating.created_at,
        ]],
      },
    });

    return response.data;
  },

  async getLeaderboard(limit = 50) {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEETS_SPREADSHEET_ID,
      range: 'Ratings!A:G',
    });

    if (!response.data.values) {
      return [];
    }

    const ratings = response.data.values.slice(1).map((row) => ({
      id: row[0],
      nickname: row[1],
      industry: row[2],
      total_score: Number(row[3]),
      presentation_scores: JSON.parse(row[4]),
      substance_scores: JSON.parse(row[5]),
      feedback: JSON.parse(row[6]),
      created_at: row[7],
    }));

    return ratings
      .sort((a, b) => b.total_score - a.total_score)
      .slice(0, limit);
  },
}; 