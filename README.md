\# Meeting Digest



Turn messy meeting notes into structured decisions, action items, and open questions using AI — then track and revisit them over time.



!\[Meeting Digest home screen](./screenshots/home1.png)



\## What it does



Paste in raw, unstructured meeting notes or a transcript, and Meeting Digest extracts:

\- \*\*Decisions\*\* that were actually made

\- \*\*Action items\*\*, each with an owner (defaulting to "Unassigned" if none is mentioned)

\- \*\*Open questions\*\* that were raised but not resolved



Every digest is saved automatically and viewable later on the history page, which shows a collapsed preview of each entry that expands to the full notes and results on click.



\## Why this exists



Most meeting note summarizers just produce a paragraph of prose you still have to read carefully. This project focuses on turning notes into \*\*structured, trackable data\*\* instead — something closer to how tools like Otter.ai or Fireflies approach meeting follow-ups, built from scratch to understand exactly how that pipeline works end to end.



\## Tech stack



\- \*\*Frontend:\*\* React (Vite), React Router

\- \*\*Backend:\*\* Node.js, Express

\- \*\*Database:\*\* MongoDB (Atlas), Mongoose

\- \*\*AI:\*\* Google Gemini API, using structured JSON output (`responseSchema`) so extraction results are reliably shaped data, not free text to parse



\## Architecture



meeting-digest/

├── client/ # React frontend (Vite)

│ └── src/

│ ├── components/ # NotesInput, DigestResult

│ ├── pages/ # Home, History

│ └── api.js # All backend API calls

├── server/ # Express backend

│ ├── routes/ # /api/digests routes

│ ├── models/ # Mongoose Digest schema

│ └── services/ # Gemini API integration (aiService.js)



!\[Past digests history view](./screenshots/home.png)

!\[Past digests history view](./screenshots/generated.png)

!\[Past digests history view](./screenshots/history.png)



The AI integration is isolated in a single `aiService.js` file — if the AI provider ever needs to change, only that file needs to be rewritten.



\## Key design decisions



\- \*\*Structured output over free text.\*\* Gemini's `responseSchema` feature constrains the model to return a fixed JSON shape (`decisions`, `actionItems`, `openQuestions`), which is far more reliable than parsing free-form summary text.

\- \*\*Retry with backoff for AI calls.\*\* The Gemini API occasionally returns `503 UNAVAILABLE` under load. The backend retries up to 3 times with increasing delay before failing, rather than surfacing a transient error to the user immediately.

\- \*\*Validation on both client and server.\*\* The frontend disables submission for notes under 20 characters as a UX nicety; the backend enforces the same limit (plus a max length and a type check) as the actual security boundary, since the API can be called directly regardless of what the frontend allows.

\- \*\*MongoDB over a relational database.\*\* Each digest (notes + decisions + action items + open questions) is naturally one self-contained document with no complex relational needs, which fit Mongo's document model better than normalizing into multiple SQL tables for a project this size.



\## Running it locally



\### Prerequisites

\- Node.js installed

\- A free \[Google Gemini API key](https://aistudio.google.com/app/apikey)

\- A free \[MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) cluster



\### Setup



1\. Clone the repo:



git clone https://github.com/YOUR\_USERNAME/meeting-digest.git

cd meeting-digest





2\. Install backend dependencies:



cd server

npm install





3\. Create `server/.env`:



GEMINI\_API\_KEY=your\_key\_here

MONGODB\_URI=your\_connection\_string\_here





4\. Start the backend:



node server.js





5\. In a separate terminal, install and start the frontend:



cd client

npm install

npm run dev





6\. Open the printed local URL (usually `http://localhost:5173`)



\## Known limitations



\- No authentication — all digests are currently visible to anyone using the app (fine for a personal/demo project, not production-ready as-is)

\- Free-tier Gemini API rate limits mean occasional delays or retries under heavy use



\## Possible future additions



\- User accounts, so digests are private per user

\- Slack/email integration to auto-import meeting transcripts

\- Editable action items with due dates and reminders





