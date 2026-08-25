# 💕 A Little Date? — React + Supabase

A colorful, romantic, mobile-friendly date invitation.

## 1. Create the database table
Open your Supabase project's SQL Editor and run `supabase.sql`.

## 2. Get the Supabase anon key
In Supabase, open Project Settings → API and copy the **Publishable/anon key**.

## 3. Configure environment variables
Create `.env` in the project root:

VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_PUBLISHABLE_OR_ANON_KEY

Do not put a Supabase service-role key in the browser.

## 4. Install and run

npm install
npm install
npm run dev

You can also run with `npm start` (equivalent to `vite`).

## 5. Build

npm run build

The "No" button intentionally moves whenever the user tries to select it.
After "Yes", the app collects date, food, restaurant and area preferences and inserts the response into `date_responses`.


## Dynamic welcome name

The opening screen reads the name from `date_invite_config`.
The included SQL inserts `Indu Reddy` automatically if that name is not already present.
To change the recipient later, update the active row in Supabase.
