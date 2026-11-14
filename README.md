# Manu Sharma — Portfolio

Personal portfolio site for **Manu Sharma**, built with React + Vite. Light and dark themes,
responsive down to phone width, no UI libraries.

## Profile

| | |
| --- | --- |
| **Headline** | Java Full Stack Developer |
| **Current role** | Senior Software Engineer, Netsmartz (04/2021 – Present) |
| **Experience** | 6+ years |
| **Location** | Punjab, India |
| **Email** | manu66449@gmail.com |
| **LinkedIn** | [linkedin.com/in/manusharma-javadev](https://www.linkedin.com/in/manusharma-javadev) |
| **GitHub** | [github.com/manu-javadev](https://github.com/manu-javadev) |

## Run locally

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually http://localhost:5173).

## Build

```bash
npm run build     # outputs to dist/
npm run preview   # preview the production build
```

## Editing content

All text lives in **`src/data.js`**: profile and links, stats, about, experience, projects,
skills, and education. You don't need to touch the components to update the site.

- **Headline title:** `profile.role` (currently "Java Full Stack Developer").
- **Job titles:** the `role` of each entry in `experience` (Netsmartz is "Senior Software Engineer").
- **Location:** `profile.location` (currently "Punjab, India").
- **Resume:** replace `public/resume.pdf` with your latest resume (keep the filename).
- **FlowPulse GitHub button:** currently links to your GitHub profile. Set `featuredProject.link`
  to the repo URL.
- **Highlighted skills:** the `core` list in each skill group controls which chips are highlighted.
- **Availability badge:** change or clear `profile.availability`.
- **Notice period:** optional. Set `profile.noticePeriod` (e.g. `'30 days'`) and the chat assistant
  will answer notice-period questions; leave it `''` and it refers people to you by email.

## Before publishing

- [ ] Update `public/resume.pdf` so it matches the site: Netsmartz title **Senior Software Engineer**
      and location **Punjab, India**. Remove the phone number from it if you don't want that public.
- [ ] Set `featuredProject.link` to the FlowPulse repo URL.
- [ ] Optionally set `profile.noticePeriod`.

## Chat assistant

The round bot button in the bottom-right corner opens a chat that answers visitors' questions
using only the content in `src/data.js`. It runs entirely in the browser: no API keys, no server,
no cost, and nothing is sent anywhere.

- **What it answers:** skills ("Does she know Kafka?"), projects, each job, years of experience,
  education, location, availability, and contact details.
- **When it doesn't know** (a technology not on the resume, salary, notice period, relocation,
  anything off-topic), it says so instead of guessing and shows an **Email Manu** button.
  The email is pre-filled with the visitor's question.
- **Contact it uses:** email only, from `profile.email`. No phone number is included anywhere in
  the site.
- **Teaching it new answers:** edit `src/chatbot/engine.js`. Aliases for projects/companies are in
  `ENTITIES`, technologies in `TECH`, and technologies to explicitly say "not on resume" for are in
  `NOT_ON_RESUME`.

## Files

| File | What it is |
| --- | --- |
| `src/data.js` | All site content |
| `src/App.jsx` | Page sections and layout |
| `src/chatbot/` | Chat assistant: answer logic (`engine.js`), UI (`Chatbot.jsx`), styles |
| `src/Icon.jsx` | Inline SVG icons |
| `src/index.css` | Styles and light/dark theme colors (tokens at the top) |
| `public/` | Resume PDF and favicon |

## Deploy

Works on Vercel or Netlify out of the box: import the GitHub repo, framework **Vite**,
build command `npm run build`, output directory `dist`.
