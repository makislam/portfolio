import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, HandHeart, Church, Bot, Disc3, Plane } from 'lucide-react';
import Header from '@/components/portfolio/Header';
import PhotoGallery from '@/components/portfolio/PhotoGallery';
import LeadershipMap from '@/components/portfolio/LeadershipMap';

// Roles from the CV, shown as pins. `photos` (in /public) fill the pin and detail card;
// without photos the card shows `Icon`. `scene` places the role in the Beyond the Lab landscape.
const leadership = [
  {
    title: 'UW Chinese Christian Fellowship',
    short: 'UW Chinese Christian Fellowship',
    scene: 'fellowship',
    Icon: HandHeart,
    logo: '/uwccf.jpg',
    gradient: 'from-zinc-500 to-zinc-900',
    tilt: -6,
    photos: [],
    role: 'Chair · Vice Chair · Executive Member',
    dates: '2024 – Present',
    description:
      'A Christian community at the University of Waterloo, where I have served as Executive Member, Vice Chair and Chair.',
  },
  {
    title: 'KW Redeemer Presbyterian Church',
    short: 'KW Redeemer Church',
    scene: 'church',
    Icon: Church,
    logo: '/kwr.jpg',
    logoScale: 1.12,
    gradient: 'from-stone-400 to-stone-800',
    tilt: 4,
    photos: [],
    role: 'AV Volunteer',
    dates: '2023 – Present',
    description: 'Serving on the audio-visual team for the church community in Kitchener-Waterloo.',
  },
  {
    title: 'Mecha Mayhem',
    scene: 'mecha',
    Icon: Bot,
    gradient: 'from-slate-500 to-slate-900',
    tilt: -3,
    photos: ['/gallery/received_2030490920804957.jpeg'],
    role: 'Key Volunteer & AV Coordinator',
    dates: '2023 – Present',
    description: "Helping run Canada's largest robotics competition as a key volunteer and AV coordinator.",
  },
  {
    title: 'UW Varsity Ultimate Frisbee',
    short: 'Varsity Ultimate',
    scene: 'frisbee',
    Icon: Disc3,
    gradient: 'from-yellow-300 to-amber-600',
    tilt: 5,
    photos: ['/gallery/img_4557.jpg', '/gallery/PXL_20230729_180615293.MP.jpg'],
    role: 'Team Captain (2023)',
    dates: '2022 – 2025',
    description: 'Played varsity ultimate for Waterloo and captained the team in 2023.',
  },
  {
    title: '351 Silver Star Royal Canadian Air Cadets',
    short: '351 Air Cadets',
    scene: 'cadets',
    Icon: Plane,
    gradient: 'from-sky-400 to-blue-800',
    tilt: -4,
    photos: ['/gallery/Lam2.png', '/gallery/pilot-1.jpg'],
    focus: 'center 15%',
    role: 'Warrant Officer Second Class',
    dates: '2017 – 2022',
    description:
      'Five years in the Royal Canadian Air Cadets, rising to Warrant Officer Second Class and receiving the Lord Strathcona Trust Fund Medal.',
  },
];

// Non-engineering projects. `embed` is a Spotify embed URL (open.spotify.com/embed/...).
const otherProjects = [
  {
    title: 'Gospel Sharing',
    description: 'A podcast episode where I share the gospel and what my faith means to me.',
    link: 'https://open.spotify.com/episode/4mcgPbxIKla8fhRaeSabwM',
    embed: 'https://open.spotify.com/embed/episode/4mcgPbxIKla8fhRaeSabwM',
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7 },
};

function SectionHeading({ eyebrow, children }) {
  return (
    <div className="text-center mb-12">
      <p className="text-sm uppercase tracking-[0.3em] text-accent mb-4">{eyebrow}</p>
      <h2 className="text-4xl md:text-5xl font-light text-slate-900 dark:text-ivory-light">{children}</h2>
    </div>
  );
}

export default function About() {
  const [visitorCount, setVisitorCount] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    // Read-only: the homepage is what increments the counter.
    fetch('https://api.counterapi.dev/v1/mlam-portfolio/visits')
      .then((res) => res.json())
      .then((data) => {
        if (typeof data?.count === 'number') setVisitorCount(data.count);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-ivory-light dark:bg-slate-900">
      <Link
        to="/"
        className="fixed top-2 left-2 sm:top-4 sm:left-4 md:top-6 md:left-6 z-50 p-2 sm:p-3 rounded-full bg-ivory-light dark:bg-slate-800 shadow-lg border border-ivory-dark dark:border-slate-700 text-slate-800 dark:text-ivory-light hover:text-accent transition-colors"
        aria-label="Back to home"
      >
        <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
      </Link>
      <Header />

      {/* Intro */}
      <section className="pt-28 md:pt-36 pb-20 px-6">
        <motion.div {...fadeUp} className="max-w-3xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 text-center sm:text-left">
            <div className="w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-accent/30 shadow-xl flex-shrink-0">
              <picture>
                <source srcSet="/hero/me-4.webp" type="image/webp" />
                <img src="/hero/me-4.jpg" alt="Makis Lam" className="w-full h-full object-cover" />
              </picture>
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-accent mb-2">About</p>
              <h1 className="text-4xl md:text-6xl font-light text-slate-900 dark:text-ivory-light tracking-tight">
                Makis <span className="font-medium">Lam</span>
              </h1>
              <p className="mt-2 text-cloud-dark dark:text-cloud-light">Mechanical Engineering @ UWaterloo</p>
            </div>
          </div>
          <p className="mt-10 text-lg leading-relaxed text-cloud-dark dark:text-cloud-light">
            I'm a Mechanical Engineering student at the University of Waterloo. I like to work on cool things.
            I also am a devout Christian, pilot, former Air Cadet, Varsity Frisbee Athlete, photographer and F1
            enthusiast. Check out some of my work!
          </p>
        </motion.div>
      </section>

      {/* Leadership */}
      <section className="py-20 px-6 bg-ivory dark:bg-slate-800">
        <motion.div {...fadeUp} className="max-w-5xl mx-auto">
          <SectionHeading eyebrow="Leadership & Community">
            Beyond the <span className="font-medium">Lab</span>
          </SectionHeading>
          <LeadershipMap items={leadership} />
        </motion.div>
      </section>

      {/* Other projects */}
      <section className="py-20 px-6">
        <motion.div {...fadeUp} className="max-w-3xl mx-auto">
          <SectionHeading eyebrow="Beyond Engineering">
            Other <span className="font-medium">Projects</span>
          </SectionHeading>
          <div className="space-y-8">
            {otherProjects.map((p) => (
              <div
                key={p.title}
                className="rounded-2xl bg-ivory dark:bg-slate-800 border border-ivory-dark dark:border-slate-700 p-5 md:p-6 shadow-sm"
              >
                <h3 className="text-xl font-medium text-slate-900 dark:text-ivory-light">{p.title}</h3>
                <p className="mt-1 mb-4 text-cloud-dark dark:text-cloud-light">{p.description}</p>
                {p.embed && (
                  <iframe
                    title={p.title}
                    src={p.embed}
                    width="100%"
                    height="152"
                    loading="lazy"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    className="rounded-xl border-0"
                  />
                )}
                <a
                  href={p.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block text-sm text-accent hover:underline"
                >
                  Open in Spotify →
                </a>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Gallery */}
      <section className="py-20 px-1 md:px-6 bg-ivory dark:bg-slate-800">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp}>
            <SectionHeading eyebrow="A collection of moments">
              Photo <span className="font-medium">Gallery</span>
            </SectionHeading>
          </motion.div>
          <PhotoGallery />
        </div>
      </section>

      {typeof visitorCount === 'number' && (
        <p className="py-6 pr-6 text-[10px] text-cloud dark:text-cloud-light text-right opacity-50 select-none">
          {visitorCount.toLocaleString()} visits
        </p>
      )}
    </div>
  );
}
