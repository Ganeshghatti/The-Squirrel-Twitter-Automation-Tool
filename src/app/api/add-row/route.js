import { google } from 'googleapis';

const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

function extractSpreadsheetId(sheetUrl) {
  const match = sheetUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
  return match ? match[1] : null;
}

export async function POST(request){
    try {
        const { followers, sheetUrl } = await request.json();
        console.log("Req ", { followers, sheetUrl });
    
        if (!followers || !sheetUrl) {
          return Response.json({ error: 'Missing followers or sheet URL' }, { status: 400 });
        }
    
        const sheetId = extractSpreadsheetId(sheetUrl);
        console.log("SHEETid ", sheetId);
    
        if (!sheetId) {
          return Response.json({ error: 'Invalid Google Sheet URL' }, { status: 400 });
        }
    
        const values = followers.map(f => [f.fullName, f.userName, f.profileLink]);
        console.log("Trying to append rows...");
    
        const response = await sheets.spreadsheets.values.append({
          spreadsheetId: sheetId,
          range: 'Sheet1!A1',
          valueInputOption: 'RAW',
          requestBody: { values },
        });
    
        console.log("Done appending rows...");
        return Response.json({ status: 'Rows added to sheet', data: response.data });
      } catch (error) {
        console.error("Failed to add row:", error);
        return Response.json({ error: 'Error adding row' }, { status: 500 });
      }
    }