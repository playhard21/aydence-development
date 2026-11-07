# Aydence Booking & Landing Platform

This is the Next.js platform for Aydence. It handles course landing pages, booking schedules, Razorpay payment links, and Google Calendar event generation.

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

### 4. Changing Courses & Pricing (Razorpay)
- **To change Course Names, Descriptions, or Prices (INR):** Open `app/payment/page.tsx`. Right at the top, there is an array called `COURSES`. Edit the `priceINR`, `title`, or `shortDesc` there.
- **To change the Razorpay API Key:** Open `app/payment/page.tsx` and scroll down to the `handlePay()` function. You will see `key: 'rzp_test_YourKeyHere'`. Change this to your live key.

### 5. Modifying the Booking System
- **To change the Booking UI (Calendar):** Open `app/components/BookingCalendar.tsx`.
- **To add new fields to the Booking Form (like 'Company Name'):** Add the input field in `app/components/CheckoutForm.tsx` and update the backend rules in `app/lib/validation.ts`.
- **To change how available time slots are calculated:** Open `app/lib/availability.ts`.
- **To view submitted bookings:** Go to the `/admin` URL in your browser (controlled by `app/admin/page.tsx`).

### 6. Editing Automated Emails & Calendar Invites
- **To change the text inside the Confirmation Email:** Open `app/lib/email.ts`.
- **To change the Google Calendar Event title or description:** Open `app/api/bookings/route.ts` and `app/lib/calendar.ts`.

### 7. Database & Deployment (SQLite)
This project uses **SQLite** for zero-cost local database persistence.
- **Connection:** Managed in `app/lib/db.ts` and `.env` (`DATABASE_URL="file:./dev.db"`).
- **Modifying Tables:** Edit `prisma/schema.prisma`, then run `npx prisma db push` to apply changes.
- **Deployment:** The project is configured to run on PM2 (`ecosystem.config.js`). Running `npm run start:pm2` will start the server. SQLite ensures data safely persists on the server's local storage.
