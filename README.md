# Aydence Booking & Landing Platform

This is the Next.js platform for Aydence. It handles course landing pages, booking schedules, and Google Calendar event generation. Online payments (Razorpay) are on hold and not live (see section 4).

---

## Developer Cheat Sheet

If you or any other developer wants to make changes to the website, this guide tells you exactly which file to open based on what you want to change.

### 1. Changing the Design & Global Layouts
- **Change the Logo or Menu Links:** Open `app/components/Navbar.tsx`.
- **Change Footer Links or Text:** Open `app/components/Footer.tsx`.
- **Change Global Colors, Fonts, or Backgrounds:** Open `app/globals.css`. Look for the CSS variables at the top of the file to tweak the main brand colors.
- **Add a new script (like Google Analytics) to every page:** Open `app/layout.tsx`.

### 2. Editing the Main Home Page (`/`)
Open `app/page.tsx` first. You will see that it just stacks components on top of each other. To edit the actual content, open the specific component file:
- **The top banner (Hero) and Main Video:** Edit `app/components/HomeHero.tsx`
- **The "About the Doctor" section:** Edit `app/components/AboutDrShoba.tsx`
- **The list of upcoming course batches:** Edit `app/components/UpcomingBatches.tsx`
- **The floating WhatsApp button:** Edit `app/components/WhatsAppButton.tsx`

### 3. Editing the "Advanced German" Page (`/advanced-german`)
Open `app/advanced-german/page.tsx`. Just like the home page, it is built out of Lego blocks. To edit the actual content, open these files in `app/components/`:
- **The main headline/video:** `HeroSection.tsx`
- **The "How It Works" steps:** `HowItWorks.tsx`
- **The course pricing tables:** `PricingSection.tsx`

### 4. Courses & Pricing (payments on hold)
**Razorpay payments are on hold.** We do not need online payments for now, so do not enable them on the live site. The checkout page exists but is not production-ready: the key is a placeholder, nothing is verified on the server, and prices are set in the browser.
- **To change Course Names, Descriptions, or Prices (INR):** Open `app/payment/page.tsx`. Right at the top, there is an array called `COURSES`. Edit the `priceINR`, `title`, or `shortDesc` there.
- **Before re-enabling payments:** create orders and verify the payment signature on the server, use the live key from an environment variable (not hard-coded in `handlePay()`), send a real confirmation email, and review the payment clause in `app/agb/page.tsx`.
- Links to `/payment` live in `app/components/ShortTermCourses.tsx` and `app/components/WebinarModules.tsx`.

### 5. Modifying the Booking System
- **To change the Booking UI (Calendar):** Open `app/components/BookingCalendar.tsx`.
- **To add new fields to the Booking Form (like 'Company Name'):** Add the input field in `app/components/CheckoutForm.tsx` and update the backend rules in `app/lib/validation.ts`.
- **To change how available time slots are calculated:** Open `app/lib/availability.ts`.
- **To view submitted bookings:** Go to the `/admin` URL in your browser (controlled by `app/admin/page.tsx`).

### 6. Editing Automated Emails & Calendar Invites
- **To change the text inside the Confirmation Email:** Open `app/lib/email.ts`.
- **To change the Google Calendar Event title or description:** Open `app/api/bookings/route.ts` and `app/lib/calendar.ts`.

### 7. Database & Deployment (PostgreSQL)
This project uses **PostgreSQL** through Prisma (`prisma/schema.prisma`).
- **Connection:** Managed in `app/lib/db.ts` and the `DATABASE_URL` environment variable (a PostgreSQL connection string).
- **Modifying Tables:** Edit `prisma/schema.prisma`, then run `npx prisma db push` to apply changes.
- **Deployment:** Runs on Vercel, or on a server with PM2 (`ecosystem.config.js`, `npm run start:pm2`). The live site runs on AWS Lightsail; see `.claude/docs/website-aws-deployment.md` in the parent folder.
