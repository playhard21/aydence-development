'use client';
/*
 * ON HOLD: Razorpay payments are not needed for now (decision 2026-11-09).
 *
 * This page is NOT production-ready and must not be used to take real money:
 *  - the Razorpay key below is a placeholder (rzp_test_YourKeyHere),
 *  - there is no server-side order creation or signature verification,
 *  - prices come from the client-side COURSES array, so they can be tampered with,
 *  - the success screen claims a confirmation email was sent, but none is.
 * Before re-enabling: create orders on the server, verify the payment signature,
 * use the live key from an environment variable, and send the email.
 * The "Enrol" links that point here are in components/ShortTermCourses.tsx and
 * components/WebinarModules.tsx. Re-point or hide them as the business decides.
 * Tracked in .claude/TODO.md (parent folder).
 */
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

/* ────────────────────────────────────────────────────────────────
   Razorpay type shim (loaded via CDN script)
   ──────────────────────────────────────────────────────────────── */
declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}
interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  image?: string;
  prefill?: { name?: string; email?: string; contact?: string };
  theme?: { color?: string };
  handler: (response: RazorpayResponse) => void;
  modal?: { ondismiss?: () => void };
}
interface RazorpayInstance {
  open: () => void;
}
interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
}

/* ────────────────────────────────────────────────────────────────
   Course catalogue (single source of truth)
   ──────────────────────────────────────────────────────────────── */
export interface CourseInfo {
  slug: string;
  title: string;
  priceINR: number;       // in rupees
  shortDesc: string;
  color: string;          // accent color hex
  icon: string;
}

const COURSES: CourseInfo[] = [
  {
    slug: 'first-german-class',
    title: 'Your First German Class',
    priceINR: 199,
    shortDesc: 'Live class with a Native German speaker — perfect for absolute beginners.',
    color: '#2b658d',
    icon: '👩‍🏫',
  },
  {
    slug: 'casual-speaking',
    title: 'Casual German Speaking Session',
    priceINR: 499,
    shortDesc: 'Small-group speaking practice for intermediate learners (B1.1+).',
    color: '#4a8264',
    icon: '💬',
  },
  {
    slug: 'career-roadmap',
    title: 'Personal Career Roadmap to Germany',
    priceINR: 12000,
    shortDesc: 'Custom step-by-step career roadmap with visa guidance & job-market insights.',
    color: '#d97c4a',
    icon: '🗺️',
  },
  {
    slug: 'intro-german-course',
    title: 'Introduction to German (A1–B2)',
    priceINR: 4999,
    shortDesc: 'Comprehensive entry-level course: foundational grammar + conversation.',
    color: '#4a6332',
    icon: '📚',
  },
  {
    slug: 'b2-intense-speaking',
    title: 'B2/C1 Intense Speaking',
    priceINR: 6999,
    shortDesc: 'Advanced fluency sessions led by native German coaches.',
    color: '#111827',
    icon: '🎓',
  },
];

/* ────────────────────────────────────────────────────────────────
   Helpers
   ──────────────────────────────────────────────────────────────── */
function formatINR(n: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(n);
}

/* ────────────────────────────────────────────────────────────────
   Inner component that uses useSearchParams (needs Suspense)
   ──────────────────────────────────────────────────────────────── */
function PaymentInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const courseSlug = searchParams.get('course');

  const course = COURSES.find((c) => c.slug === courseSlug) ?? null;

  /* form state */
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [paymentId, setPaymentId] = useState('');
  const [errors, setErrors] = useState<{ name?: string; email?: string; phone?: string }>({});

  /* inject Razorpay script once */
  useEffect(() => {
    if (document.getElementById('razorpay-sdk')) return;
    const s = document.createElement('script');
    s.id = 'razorpay-sdk';
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.async = true;
    document.head.appendChild(s);
  }, []);

  /* ── validation ── */
  function validate() {
    const e: typeof errors = {};
    if (!name.trim()) e.name = 'Name is required';
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Valid email required';
    if (!phone.trim() || !/^\+?\d{10,15}$/.test(phone.replace(/\s/g, ''))) e.phone = 'Valid phone required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  /* ── launch checkout ── */
  function handlePay() {
    if (!validate() || !course) return;
    setLoading(true);

    const options: RazorpayOptions = {
      // ON HOLD: placeholder key, payments are disabled for now (see top of file).
      // When re-enabling, load the live key from an env var and create the order server-side.
      key: 'rzp_test_YourKeyHere',
      amount: course.priceINR * 100, // Razorpay needs paise
      currency: 'INR',
      name: 'Aydence',
      description: course.title,
      image: '/logo-new.svg',
      prefill: { name, email, contact: phone },
      theme: { color: course.color },
      // Client-side only: the payment is NOT verified on our server (see top of file).
      handler(response: RazorpayResponse) {
        setPaymentId(response.razorpay_payment_id);
        setSuccess(true);
        setLoading(false);
      },
      modal: {
        ondismiss() {
          setLoading(false);
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  }

  /* ── No course selected → picker ── */
  if (!course) {
    return (
      <div className="min-h-screen bg-[#f4f5fa] pt-32 pb-20">
        <div className="centered-content max-w-3xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-[--c-navy] mb-10 hover:underline">
            ← Back to Home
          </Link>

          <motion.h1
            className="display-lg text-[#1a2e6b] mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Choose a Programme
          </motion.h1>
          <p className="text-gray-500 mb-12 text-lg">Select the course you&apos;d like to enrol in:</p>

          <div className="grid sm:grid-cols-2 gap-6">
            {COURSES.map((c, i) => (
              <motion.button
                key={c.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                onClick={() => router.push(`/payment?course=${c.slug}`)}
                className="text-left rounded-2xl bg-white border border-gray-100 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group"
              >
                <span className="text-3xl mb-3 block">{c.icon}</span>
                <h3 className="font-bold text-[#1a2e6b] text-lg mb-1 group-hover:text-[--c-navy-mid] transition-colors">{c.title}</h3>
                <p className="text-gray-500 text-sm mb-4 leading-relaxed">{c.shortDesc}</p>
                <span className="text-xl font-extrabold" style={{ color: c.color }}>{formatINR(c.priceINR)}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ── Success ── */
  if (success) {
    return (
      <div className="min-h-screen bg-[#f4f5fa] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center mx-4"
        >
          {/* animated checkmark */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
            style={{ background: `${course.color}18` }}
          >
            <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke={course.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <motion.path
                d="M5 13l4 4L19 7"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              />
            </svg>
          </motion.div>

          <h2 className="text-2xl font-bold text-[#1a2e6b] mb-2">Payment Successful!</h2>
          <p className="text-gray-500 mb-6">
            Thank you, <span className="font-semibold text-gray-700">{name}</span>. Your spot for <span className="font-semibold" style={{ color: course.color }}>{course.title}</span> has been confirmed.
          </p>

          <div className="bg-gray-50 rounded-xl p-4 mb-8 text-sm text-gray-600 space-y-1">
            <p><span className="font-semibold text-gray-700">Payment ID:</span> {paymentId}</p>
            <p><span className="font-semibold text-gray-700">Amount:</span> {formatINR(course.priceINR)}</p>
            <p><span className="font-semibold text-gray-700">Email:</span> {email}</p>
          </div>

          <p className="text-xs text-gray-400 mb-6">A confirmation email has been sent to your inbox.</p>

          <Link href="/" className="btn-primary inline-flex">
            ← Return Home
          </Link>
        </motion.div>
      </div>
    );
  }

  /* ── Payment Form ── */
  return (
    <div className="min-h-screen bg-[#f4f5fa] pt-28 pb-20">
      <div className="centered-content">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-[--c-navy] mb-10 hover:underline">
          ← Back to Home
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">

          {/* ── Left: Order Summary ── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 bg-white rounded-3xl shadow-xl overflow-hidden sticky top-28"
          >
            {/* accent header */}
            <div className="p-8 text-white relative overflow-hidden" style={{ background: course.color }}>
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.4) 0%, transparent 60%)' }} />
              <span className="text-4xl block mb-3 relative z-10">{course.icon}</span>
              <h2 className="text-xl font-bold relative z-10 leading-snug">{course.title}</h2>
            </div>

            <div className="p-8">
              <p className="text-gray-500 text-sm leading-relaxed mb-8">{course.shortDesc}</p>

              <div className="border-t border-dashed border-gray-200 pt-6 space-y-3">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Course Fee</span>
                  <span className="font-semibold">{formatINR(course.priceINR)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Tax</span>
                  <span className="font-semibold text-green-600">Included</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between">
                  <span className="font-bold text-[#1a2e6b]">Total</span>
                  <span className="font-extrabold text-xl" style={{ color: course.color }}>{formatINR(course.priceINR)}</span>
                </div>
              </div>

              <div className="mt-8 flex items-center gap-3 text-xs text-gray-400">
                <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Secured by Razorpay · 256-bit SSL Encryption
              </div>
            </div>
          </motion.div>

          {/* ── Right: Checkout Form ── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-3 bg-white rounded-3xl shadow-xl p-8 md:p-10"
          >
            <h2 className="text-2xl font-bold text-[#1a2e6b] mb-1">Complete Your Booking</h2>
            <p className="text-gray-500 text-sm mb-8">Fill in your details to proceed with payment.</p>

            <div className="space-y-6">
              {/* Name */}
              <div>
                <label htmlFor="pay-name" className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                <input
                  id="pay-name"
                  type="text"
                  placeholder="e.g. Priya Sharma"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: undefined })); }}
                  className={`w-full rounded-xl border ${errors.name ? 'border-red-400 ring-2 ring-red-100' : 'border-gray-200'} px-5 py-3.5 text-[15px] transition-all focus:outline-none focus:border-[--c-navy-mid] focus:ring-2 focus:ring-[#4a6abf20] placeholder:text-gray-300`}
                />
                <AnimatePresence>{errors.name && <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-red-500 text-xs mt-1.5">{errors.name}</motion.p>}</AnimatePresence>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="pay-email" className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                <input
                  id="pay-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: undefined })); }}
                  className={`w-full rounded-xl border ${errors.email ? 'border-red-400 ring-2 ring-red-100' : 'border-gray-200'} px-5 py-3.5 text-[15px] transition-all focus:outline-none focus:border-[--c-navy-mid] focus:ring-2 focus:ring-[#4a6abf20] placeholder:text-gray-300`}
                />
                <AnimatePresence>{errors.email && <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-red-500 text-xs mt-1.5">{errors.email}</motion.p>}</AnimatePresence>
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="pay-phone" className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                <input
                  id="pay-phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => { setPhone(e.target.value); setErrors((p) => ({ ...p, phone: undefined })); }}
                  className={`w-full rounded-xl border ${errors.phone ? 'border-red-400 ring-2 ring-red-100' : 'border-gray-200'} px-5 py-3.5 text-[15px] transition-all focus:outline-none focus:border-[--c-navy-mid] focus:ring-2 focus:ring-[#4a6abf20] placeholder:text-gray-300`}
                />
                <AnimatePresence>{errors.phone && <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-red-500 text-xs mt-1.5">{errors.phone}</motion.p>}</AnimatePresence>
              </div>
            </div>

            {/* pay button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              onClick={handlePay}
              className="w-full mt-10 py-4 rounded-xl font-bold text-lg text-white transition-all disabled:opacity-60 cursor-pointer flex items-center justify-center gap-3"
              style={{ background: course.color }}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Processing…
                </>
              ) : (
                <>Pay {formatINR(course.priceINR)} →</>
              )}
            </motion.button>

            {/* trust badges */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-gray-400">
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                SSL Secured
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                Verified Merchant
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                UPI · Cards · NetBanking
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────
   Page wrapper with Suspense (required for useSearchParams)
   ──────────────────────────────────────────────────────────────── */
export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f4f5fa] flex items-center justify-center">
        <div className="animate-pulse text-gray-400 text-lg font-medium">Loading checkout…</div>
      </div>
    }>
      <PaymentInner />
    </Suspense>
  );
}
