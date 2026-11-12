"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { WHATSAPP_URL } from "../lib/links";

const COURSE_SLUG = "free-trial";
const INTEREST_OPTIONS = ["Free trial session", "Speaking Coaching (B1 Level)", "Personal Translation Assistance"];
const LEVEL_OPTIONS = ["Not sure", "A1", "A2", "B1", "B2 or higher"];
const LOCATION_OPTIONS = ["Germany", "India", "Other"];

interface SlotAvailability {
  date: string;
  total: number;
  booked: number;
  remaining: number;
  isFull: boolean;
}

export default function BookingPage() {
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [availability, setAvailability] = useState<SlotAvailability[]>([]);
  const [slots, setSlots] = useState<Record<string, string[]>>({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [interest, setInterest] = useState(INTEREST_OPTIONS[0]);
  const [level, setLevel] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitted, setSubmitted] = useState("");
  const [duplicateWarning, setDuplicateWarning] = useState<{ message: string } | null>(null);
  const [loadingAvailability, setLoadingAvailability] = useState(false);

  // Fetch availability when the month changes
  const fetchAvailability = useCallback(async () => {
    setLoadingAvailability(true);
    const monthStr = `${calendarMonth.year}-${String(calendarMonth.month + 1).padStart(2, "0")}`;
    try {
      const res = await fetch(`/api/availability?course=${COURSE_SLUG}&month=${monthStr}`);
      const data = await res.json();
      setAvailability(data.availability || []);
      setSlots(data.slots || {});
    } catch { setAvailability([]); setSlots({}); }
    setLoadingAvailability(false);
  }, [calendarMonth]);

  useEffect(() => { fetchAvailability(); }, [fetchAvailability]);

  // Reset the time when the date changes
  useEffect(() => { setSelectedTime(""); }, [selectedDate]);

  const freeTimes = slots[selectedDate] || [];

  // Calendar helpers
  const daysInMonth = new Date(calendarMonth.year, calendarMonth.month + 1, 0).getDate();
  const firstDayOfWeek = (new Date(calendarMonth.year, calendarMonth.month, 1).getDay() + 6) % 7; // Mon=0
  const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];

  const prevMonth = () => {
    setCalendarMonth((p) => p.month === 0 ? { year: p.year - 1, month: 11 } : { year: p.year, month: p.month - 1 });
  };
  const nextMonth = () => {
    setCalendarMonth((p) => p.month === 11 ? { year: p.year + 1, month: 0 } : { year: p.year, month: p.month + 1 });
  };

  const isDayAvailable = (day: number) => {
    const dateStr = `${calendarMonth.year}-${String(calendarMonth.month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return availability.some((a) => a.date === dateStr && !a.isFull);
  };
  const isDayFull = (day: number) => {
    const dateStr = `${calendarMonth.year}-${String(calendarMonth.month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return availability.some((a) => a.date === dateStr && a.isFull);
  };
  const isDayCourseDay = (day: number) => {
    const wd = new Date(calendarMonth.year, calendarMonth.month, day).getDay();
    return wd >= 1 && wd <= 5; // Mon-Fri
  };

  // Client-side validation
  const validate = () => {
    const e: Record<string, string> = {};
    if (!selectedDate) e.date = "Please select a date.";
    else if (!selectedTime) e.time = "Please select a time.";
    if (!name || name.trim().length < 2) e.name = "Name is required (min 2 characters).";
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Valid email is required.";
    if (!level) e.level = "Please choose your current German level.";
    if (!location) e.location = "Please tell us where you live.";
    if (!consent) e.consent = "Please agree to the privacy policy.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (forceDuplicate = false) => {
    if (!validate()) return;
    setIsSubmitting(true);
    setSubmitError("");
    setDuplicateWarning(null);

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseSlug: COURSE_SLUG, date: selectedDate, time: selectedTime,
          name: name.trim(), email: email.trim(), phone: phone.trim() || undefined,
          interest, level, location, notes: notes.trim() || undefined, consent, forceDuplicate,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.isDuplicate && !forceDuplicate) {
          setDuplicateWarning({ message: data.message });
          setIsSubmitting(false);
          return;
        }
        setSubmitError(data.message || "Something went wrong.");
        if (res.status === 409) fetchAvailability();
        setIsSubmitting(false);
        return;
      }

      setSubmitted(data.message || "Thank you! I will confirm your appointment by email shortly.");
      setIsSubmitting(false);
    } catch {
      setSubmitError("Network error. Please try again.");
      setIsSubmitting(false);
    }
  };

  const formatSlot = (start: string) => {
    const [h, m] = start.split(":").map(Number);
    const endMin = h * 60 + m + 30;
    const end = `${String(Math.floor(endMin / 60)).padStart(2, "0")}:${String(endMin % 60).padStart(2, "0")}`;
    return `${start} - ${end}`;
  };

  const inputCls = (err?: string) =>
    `w-full border rounded-lg px-3 py-3 text-[14px] text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-gray-400 transition-colors bg-white ${err ? "border-red-400" : "border-gray-200"}`;

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 flex justify-center font-sans">
        <div className="w-full max-w-[600px] bg-white border border-gray-100 rounded-2xl p-8 shadow-sm text-center h-fit">
          <h1 className="text-[20px] font-medium text-gray-900 mb-4">{submitted}</h1>
          <p className="text-[14px] text-gray-500 mb-6">
            {selectedDate} · {selectedTime && formatSlot(selectedTime)} (German time)
          </p>
          <Link href="/" className="text-blue-600 hover:underline text-[14px]">Back to the home page</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 flex justify-center font-sans">
      <div className="w-full max-w-[600px] bg-white border border-gray-100 rounded-2xl p-6 md:p-8 shadow-sm">
        <h1 className="text-[20px] font-medium text-gray-900 mb-3">Book your free trial session</h1>
        <p className="text-[14px] text-gray-500 mb-8">A short, free online session with me. I check your German level, answer your questions and tell you honestly whether the Speaking Coaching is right for you.</p>

        {/* Section 2: Calendar */}
        <section className="mb-10">
          <h2 className="text-[16px] font-medium text-gray-900 mb-1">Select a date</h2>
          <p className="text-[13px] text-gray-500 mb-4">Monday to Friday, 10:00-18:00 German time (CET/CEST)</p>
          <div className="border border-gray-200 rounded-xl p-4 md:p-6">
            <div className="flex justify-between items-center mb-6">
              <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
              </button>
              <span className="font-medium text-gray-900">{monthNames[calendarMonth.month]} {calendarMonth.year}</span>
              <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
            {loadingAvailability && <div className="text-center text-sm text-gray-400 mb-4">Loading availability...</div>}
            <div className="grid grid-cols-7 gap-1 md:gap-2 mb-2 text-center text-[13px] font-medium text-gray-500">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => <div key={d}>{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1 md:gap-2 text-center text-[14px]">
              {/* Empty cells for offset */}
              {Array.from({ length: firstDayOfWeek }, (_, i) => <div key={`empty-${i}`} className="py-2" />)}
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                const dateStr = `${calendarMonth.year}-${String(calendarMonth.month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                const isCourseDay = isDayCourseDay(day);
                const isAvail = isDayAvailable(day);
                const isFull = isDayFull(day);
                const isSelected = selectedDate === dateStr;
                const isDisabled = !isCourseDay || (!isAvail && !isFull);

                return (
                  <button
                    key={day}
                    onClick={() => !isDisabled && !isFull && setSelectedDate(dateStr)}
                    disabled={isDisabled || isFull}
                    className={`py-2 rounded-lg transition-all min-h-[44px] flex flex-col items-center justify-center text-[13px]
                      ${isDisabled ? "text-gray-300 cursor-not-allowed" : ""}
                      ${isFull ? "text-red-300 cursor-not-allowed" : ""}
                      ${!isDisabled && !isFull && !isSelected ? "text-gray-900 hover:bg-gray-100 cursor-pointer" : ""}
                      ${isSelected ? "border-2 border-blue-600 font-medium bg-blue-50/30" : "border-2 border-transparent"}
                    `}
                  >
                    <span>{day}</span>
                    {isFull && <span className="text-[9px] text-red-400 leading-none">Full</span>}
                    {isAvail && !isSelected && <span className="w-1 h-1 bg-green-400 rounded-full mt-0.5" />}
                  </button>
                );
              })}
            </div>
          </div>
          {errors.date && <p className="text-red-500 text-[13px] mt-2">{errors.date}</p>}
        </section>

        {/* Section 3: Time Slot */}
        {selectedDate && (
          <section className="mb-10">
            <h2 className="text-[16px] font-medium text-gray-900 mb-4">Select a time (German time)</h2>
            {freeTimes.length === 0 ? (
              <p className="text-[14px] text-gray-500">No free times on this day. Please choose another date.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {freeTimes.map((t) => (
                  <button key={t} type="button" onClick={() => setSelectedTime(t)}
                    className={`py-2 px-2 rounded-lg border text-[13px] min-h-[44px] transition-colors ${selectedTime === t ? "border-blue-600 bg-blue-50/30 text-blue-800 font-bold" : "border-gray-200 text-gray-900 hover:bg-gray-100"}`}>
                    {formatSlot(t)}
                  </button>
                ))}
              </div>
            )}
            {errors.time && <p className="text-red-500 text-[13px] mt-2">{errors.time}</p>}
          </section>
        )}

        {/* Section 4: Customer Details */}
        <section className="mb-10">
          <h2 className="text-[16px] font-medium text-gray-900 mb-4">Your details</h2>
          <div className="space-y-4">
            <div>
              <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className={inputCls(errors.name)} />
              {errors.name && <p className="text-red-500 text-[12px] mt-1">{errors.name}</p>}
            </div>
            <div>
              <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls(errors.email)} />
              {errors.email && <p className="text-red-500 text-[12px] mt-1">{errors.email}</p>}
            </div>
            <div>
              <input type="tel" placeholder="Phone or WhatsApp number (optional)" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputCls()} />
            </div>
            <div>
              <label className="block text-[13px] text-gray-600 mb-1">What are you interested in?</label>
              <select value={interest} onChange={(e) => setInterest(e.target.value)} className={inputCls()}>
                {INTEREST_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[13px] text-gray-600 mb-1">Your current German level</label>
              <select value={level} onChange={(e) => setLevel(e.target.value)} className={inputCls(errors.level)}>
                <option value="" disabled>Please choose</option>
                {LEVEL_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
              {errors.level && <p className="text-red-500 text-[12px] mt-1">{errors.level}</p>}
            </div>
            <div>
              <label className="block text-[13px] text-gray-600 mb-1">Where do you live?</label>
              <select value={location} onChange={(e) => setLocation(e.target.value)} className={inputCls(errors.location)}>
                <option value="" disabled>Please choose</option>
                {LOCATION_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
              {errors.location && <p className="text-red-500 text-[12px] mt-1">{errors.location}</p>}
            </div>
            <div>
              <textarea placeholder="Message (optional)" value={notes} onChange={(e) => setNotes(e.target.value)}
                className={`${inputCls()} min-h-[80px] resize-y`} />
            </div>
            <div>
              <label className="flex items-start gap-2 text-[13px] text-gray-700">
                <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1" />
                <span>I agree to the <Link href="/datenschutz" target="_blank" className="text-blue-600 underline">privacy policy</Link>.</span>
              </label>
              {errors.consent && <p className="text-red-500 text-[12px] mt-1">{errors.consent}</p>}
            </div>
          </div>
        </section>

        {/* Errors / Warnings */}
        {submitError && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-[14px]">{submitError}</div>
        )}
        {duplicateWarning && (
          <div className="mb-4 bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg text-[14px]">
            <p className="mb-2">{duplicateWarning.message}</p>
            <div className="flex gap-2">
              <button onClick={() => handleSubmit(true)} className="bg-yellow-600 text-white px-3 py-1 rounded text-[13px] font-medium hover:bg-yellow-700">Proceed Anyway</button>
              <button onClick={() => setDuplicateWarning(null)} className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-[13px] font-medium hover:bg-gray-300">Cancel</button>
            </div>
          </div>
        )}

        {/* Section 5: Actions */}
        <div className="flex gap-4 pt-4 border-t border-gray-100">
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 py-3 px-4 rounded-lg font-medium transition-colors text-[14px] min-h-[44px] flex items-center justify-center text-center">
            Questions? WhatsApp me
          </a>
          <button
            onClick={() => handleSubmit(false)}
            disabled={isSubmitting}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white border border-blue-600 py-3 px-4 rounded-lg font-medium transition-colors text-[14px] min-h-[44px] disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>Processing...</>
            ) : "Book your free trial session"}
          </button>
        </div>
      </div>
    </div>
  );
}
