// pages/api/calendar.js
import { google } from 'googleapis';

const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID;
const CLIENT_SECRET = process.env.NEXT_PUBLIC_CLIENT_SECRET;
const REDIRECT_URI = 'http://localhost:3000/api/calendar';

export default async function handler(req, res) {
    if (req.method === 'POST') {
      const { accessToken, eventDetails } = req.body;
  
      try {
        const googleCalendarApiUrl = 'https://www.googleapis.com/calendar/v3/calendars/primary/events';
  
        const response = await fetch(googleCalendarApiUrl, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            summary: eventDetails.summary,
            description: eventDetails.description,
            start: { dateTime: eventDetails.startTime },
            end: { dateTime: eventDetails.endTime },
          }),
        });
  
        const result = await response.json();
  
        if (response.ok) {
          res.status(200).json(result);
        } else {
          res.status(response.status).json(result);
        }
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
  }
  