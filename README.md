This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


## Stack
- Next.js
- SSG
- Tailwind, React
- TypeScript
- AWS
- Chatbot (Gemini/OpenAI, Redis, Kafka)
- CI/CD stuff using github actions, maybe jenkins
- jest unit testing, react testing library
- Playwright for E2E and API testing

## Home Page
- Hours and phone number should be displayed as soon as you get there
- Location Button / Google Map integration
- Menu Button to go to menu
- Maybe reviews button / yelp / google to redirect
- Rotating / clickable photo portfolio

## Menu Page
- Full menu, pictures
- Search bar
- have a need recommendations button at the bottom, redirect to chatbot page or something

### Resume
- Transfered website from database to SSG and made the site load 80% faster
- Redesigned website

Features:
- Menu - Search - Filter - AI chatbot
- Separate category pages 
- Location using Google Maps
- Photos - maybe of stuff using ai idk - rotating photos or slide show - manually upload if we cant get api access
- Contact us at phone number
- Yelp, scrap Google photos or something maybe - requested api access, maybe need to scrap with apify
- Directions - Google map, build like pathway to restaurant - just have a link
- Reviews 
- Multilingual support using AI
- Dark mode