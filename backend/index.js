import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { google } from 'googleapis';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

function extractSpreadsheetId(sheetUrl) {
  const match = sheetUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
  return match ? match[1] : null;
}

app.post('/add-row', async (req, res) => {
  const { followers, sheetUrl } = req.body;
  console.log("Req ", req.body)

  if (!followers || !sheetUrl) {
    return res.status(400).json({ error: 'Missing followers or sheet URL' });
  }

  const sheetId = extractSpreadsheetId(sheetUrl);
  console.log("SHEETid ",sheetId)
  if (!sheetId) {
    return res.status(400).json({ error: 'Invalid Google Sheet URL' });
  }
  
  const values = followers.map(f => [f.fullName, f.userName, f.profileLink]);

  try {
    console.log("trying ....")
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: 'Sheet1!A1',
      valueInputOption: 'RAW',
      requestBody: {
        values
      },
    });

    res.status(200).json({ status: 'Rows added to sheet', data: response.data });
    console.log("done....")
  } catch (error) {
    console.log("failed......")
    console.error(error);
    res.status(500).json({ error: 'Error adding row' });
  }
});

app.listen(5000, () => console.log('Server running on port 5000'));
