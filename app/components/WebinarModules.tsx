/* NOTE: links to /payment are on hold; Razorpay payments are disabled for now. See app/payment/page.tsx. */
'use client';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ScrollReveal, fadeUp } from './AnimationHelpers';

interface WebinarCardContent {
  theme: 'blue' | 'green' | 'orange';
  title: string;
  imageSrc: string;
  description: string;
  bullets: { icon: string; text: string }[];
  priceTag: string;
  badge?: string;
  buttonText: string;
  buttonLink: string;
}

const webinarCards: WebinarCardContent[] = [
  {
    theme: 'blue',
    title: 'YOUR FIRST GERMAN CLASS with a Native Speaker',
    imageSrc: '/first_german_class.png',
    description: 'Welcome to your first German webinar! Learn fundamental phrases and get a real native speaker experience. Our expert teachers make learning fun and accessible for everyone.',
    bullets: [
      { icon: '👩‍🏫', text: 'Live Native Teacher' },
      { icon: '🔤', text: 'Learn Basics' },
      { icon: '🛡️', text: 'No Experience Needed' }
    ],
    priceTag: 'Introductory Offer: ₹ 199',
    buttonText: 'BOOK MY FIRST CLASS',
    buttonLink: '/payment?course=first-german-class'
  },
  {
    theme: 'green',
    title: 'CASUAL GERMAN SPEAKING SESSIONS (B1.1+)',
    imageSrc: '/casual_speaking_sessions.png',
    description: 'Refine your German speaking skills in a relaxed, small-group environment (B1.1+). Our guided sessions help you speak more naturally.',
    bullets: [
      { icon: '💬', text: 'Intermediate Conversation' },
      { icon: '🧭', text: 'Native Speaker Guidance' },
      { icon: '👥', text: 'Small Group' }
    ],
    priceTag: 'Starting From: ₹ 499',
    buttonText: 'JOIN A SESSION',
    buttonLink: '/payment?course=casual-speaking'
  },
  {
    theme: 'orange',
    title: 'PERSONAL CAREER ROADMAP TO GERMANY',
    imageSrc: '/personal_career_roadmap.png',
    description: 'Chart your clear, step-by-step career path to Germany with an expert consultant.',
    bullets: [
      { icon: '🗺️', text: 'Custom Roadmap' },
      { icon: '📈', text: 'Job Market Insights' },
      { icon: '🛂', text: 'Visa Guidance' }
    ],
    priceTag: 'Total Package: ₹ 12,000',
    badge: 'FREE FIRST SESSION!',
    buttonText: 'BOOK YOUR FREE CALL',
    buttonLink: '/booking'
  }
];

export default function WebinarModules() {
  const getThemeStyles = (theme: 'blue' | 'green' | 'orange') => {
    switch (theme) {
      case 'blue':
        return {
          headerBg: 'bg-[#2b658d]',
          headerText: 'text-white',
          btnBg: 'bg-[#1e486d] hover:bg-[#153450]',
          btnText: 'text-white'
        };
      case 'green':
        return {
          headerBg: 'bg-[#4a8264]',
          headerText: 'text-white',
          btnBg: 'bg-[#3b6b50] hover:bg-[#2d523d]',
          btnText: 'text-white'
        };
      case 'orange':
        return {
          headerBg: 'bg-[#d97c4a]',
          headerText: 'text-white',
          btnBg: 'bg-[#407f66] hover:bg-[#326651]', // Using a greenish button for contrast as in mockup
          btnText: 'text-white'
        };
    }
  };

  return (
    <section className="section-pad section-white" id="programmes">
      <div className="centered-content">

        {/* Existing optional headers, can be removed if strictly following the image, but good for context */}
        <ScrollReveal>
          <div className="flex items-center gap-3 mb-10">
            <span className="section-divider m-0" />
            <span className="eyebrow">Webinar Series</span>
          </div>
        </ScrollReveal>

        <div className="flex flex-col gap-10">
          {webinarCards.map((card, idx) => {
            const theme = getThemeStyles(card.theme);
            
            return (
              <ScrollReveal key={idx} custom={idx} variants={fadeUp}>
                <div className="rounded-[24px] overflow-hidden bg-white shadow-xl border border-gray-100 flex flex-col group">
                  
                  {/* Header */}
                  <div className={`${theme.headerBg} ${theme.headerText} py-5 px-8 text-center`}>
                    <h3 className="text-[22px] md:text-[26px] font-bold tracking-wide uppercase">
                      {card.title.split('with')[0]}
                      {card.title.includes('with') && (
                        <span className="block text-[18px] md:text-[20px] font-medium capitalize mt-1">
                          with {card.title.split('with')[1]}
                        </span>
                      )}
                    </h3>
                  </div>

                  {/* Body Grid */}
                  <div className="p-8 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                    
                    {/* Image Area */}
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
                      <Image 
                        src={card.imageSrc} 
                        alt={card.title} 
                        fill 
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>

                    {/* Content Area */}
                    <div className="flex flex-col h-full justify-between">
                      <div>
                        {/* Description */}
                        <p className="text-[#333] text-[17px] leading-relaxed mb-6 font-medium">
                          {card.description}
                        </p>

                        {/* Bullets */}
                        <ul className="flex flex-col gap-4 mb-8">
                          {card.bullets.map((bullet, bIdx) => (
                            <li key={bIdx} className="flex items-center gap-4 text-[#444] font-medium">
                              <span className="text-2xl w-8 text-center">{bullet.icon}</span>
                              <span className="text-[16px]">{bullet.text}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Pricing & Extras */}
                      <div className="flex items-end justify-between mb-8">
                        {/* Empty div for spacing if no badge */}
                        <div className="flex flex-col gap-2">
                           {card.badge && (
                             <span className="bg-[#fbeed4] text-[#a66a2e] font-bold text-xs px-3 py-1.5 rounded uppercase tracking-wider w-fit">
                               {card.badge}
                             </span>
                           )}
                        </div>
                        <div className="text-right">
                          <span className="block text-sm font-semibold text-gray-500 mb-1">
                            {card.priceTag.split(':')[0]}:
                          </span>
                          <span className="text-2xl font-bold text-[#1a2e6b]">
                            {card.priceTag.split(':')[1]}
                          </span>
                        </div>
                      </div>

                    </div>
                  </div>
                  
                  {/* Footer Button Full Width Wrapper */}
                  <div className="px-8 pb-8 md:px-10 md:pb-10">
                    <Link 
                      href={card.buttonLink} 
                      className={`w-full block text-center py-4 rounded-xl font-bold text-lg tracking-wide transition-all ${theme.btnBg} ${theme.btnText}`}
                    >
                      {card.buttonText}
                    </Link>
                  </div>

                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
