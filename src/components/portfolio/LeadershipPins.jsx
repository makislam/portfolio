import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

// Pinboard of leadership & community roles. Each pin opens a card with photos and details.
// `photos` are full-size paths in /public; the pin face uses the first photo, or `Icon` if none.
export default function LeadershipPins({ items }) {
  const [openIndex, setOpenIndex] = useState(null);
  const open = openIndex === null ? null : items[openIndex];

  return (
    <>
      {/* Board */}
      <div
        className="relative rounded-3xl border border-ivory-dark dark:border-slate-700 bg-ivory-light dark:bg-slate-900 px-4 py-10 md:px-10 md:py-14 shadow-inner overflow-hidden"
        style={{
          backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        }}
      >
        <div className="absolute inset-0 bg-ivory-light/90 dark:bg-slate-900/90 pointer-events-none" />
        <div className="relative flex flex-wrap justify-center gap-x-6 gap-y-10 md:gap-x-6">
          {items.map((item, i) => (
            <motion.button
              key={item.title}
              onClick={() => setOpenIndex(i)}
              initial={{ opacity: 0, scale: 0.6, rotate: item.tilt ?? 0 }}
              whileInView={{ opacity: 1, scale: 1, rotate: item.tilt ?? 0 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.08, rotate: 0, y: -4 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 260, damping: 18, delay: i * 0.06 }}
              className="group flex w-32 md:w-40 flex-col items-center text-center focus:outline-none"
              aria-label={`${item.title}: view details`}
            >
              <Pin item={item} />
              <span className="mt-3 text-sm font-medium leading-snug text-slate-900 dark:text-ivory-light group-hover:text-accent transition-colors">
                {item.short ?? item.title}
              </span>
              <span className="text-xs text-cloud-dark dark:text-cloud-light">{item.dates}</span>
            </motion.button>
          ))}
        </div>
        <p className="relative mt-10 text-center text-xs tracking-wide text-cloud dark:text-cloud-light">
          Tap a pin to open it
        </p>
      </div>

      <LeadershipDetail item={open} onClose={() => setOpenIndex(null)} />
    </>
  );
}

// Popup with photos and details for one role. Shared by the pinboard and the landscape.
export function LeadershipDetail({ item, onClose }) {
  useEffect(() => {
    if (!item) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [item, onClose]);

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm p-3 md:p-6"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', bounce: 0.2, duration: 0.45 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-ivory-light dark:bg-slate-800 shadow-2xl"
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {item.photos?.length ? (
              <div className={`grid gap-1 ${item.photos.length > 1 ? 'grid-cols-2' : ''}`}>
                {item.photos.map((src, i) => (
                  <img
                    key={src}
                    src={src}
                    alt={item.title}
                    className="w-full h-56 md:h-72 object-cover"
                    style={{ objectPosition: i === 0 && item.focus ? item.focus : "center" }}
                  />
                ))}
              </div>
            ) : (
              <div className={`flex h-48 items-center justify-center bg-gradient-to-br ${item.gradient}`}>
                {item.logo ? (
                  <img src={item.logo} alt={`${item.title} logo`} className="h-32 w-32 rounded-2xl object-cover shadow-xl" />
                ) : (
                  <item.Icon className="w-16 h-16 text-white/90" strokeWidth={1.5} />
                )}
              </div>
            )}

            <div className="p-6 md:p-8">
              <div className="flex items-center gap-4">
                <Pin item={item} small />
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-accent">{item.dates}</p>
                  <h3 className="text-2xl font-medium text-slate-900 dark:text-ivory-light">{item.title}</h3>
                </div>
              </div>
              <p className="mt-4 inline-block rounded-full bg-ivory dark:bg-slate-700 border border-ivory-dark dark:border-slate-600 px-3 py-1 text-sm text-slate-800 dark:text-ivory-light">
                {item.role}
              </p>
              <p className="mt-4 leading-relaxed text-cloud-dark dark:text-cloud-light">{item.description}</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Enamel-pin look: coloured metal ring, photo or icon face, glossy highlight, pushpin on top.
function Pin({ item, small = false }) {
  const size = small ? 'w-14 h-14' : 'w-28 h-28 md:w-32 md:h-32';
  const thumb = item.photos?.[0] && toThumb(item.photos[0]);
  return (
    <div className={`relative ${size} flex-shrink-0`}>
      {!small && (
        <span className="absolute -top-1.5 left-1/2 z-20 h-4 w-4 -translate-x-1/2 rounded-full bg-gradient-to-br from-red-400 to-red-700 shadow-md ring-1 ring-black/20" />
      )}
      <div className={`relative h-full w-full rounded-full bg-gradient-to-br ${item.gradient} p-[5px] shadow-[0_8px_20px_-6px_rgba(0,0,0,0.45)]`}>
        <div className="relative h-full w-full overflow-hidden rounded-full ring-2 ring-white/70 dark:ring-white/30 bg-slate-800">
          {item.logo ? (
            <img
              src={item.logo}
              alt={`${item.title} logo`}
              loading="lazy"
              className="h-full w-full object-cover"
              style={{ transform: `scale(${item.logoScale ?? 1})` }}
            />
          ) : thumb ? (
            <picture>
              <source srcSet={thumb} type="image/webp" />
              <img
                src={item.photos[0]}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover"
                style={{ objectPosition: item.focus ?? 'center' }}
              />
            </picture>
          ) : (
            <div className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${item.gradient}`}>
              <item.Icon className={small ? 'w-6 h-6 text-white' : 'w-11 h-11 text-white'} strokeWidth={1.6} />
            </div>
          )}
          <span className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-br from-white/35 via-transparent to-transparent" />
        </div>
      </div>
    </div>
  );
}

// /gallery/foo.jpg -> /gallery/thumb-foo.webp (matches the gallery's generated thumbnails)
function toThumb(src) {
  if (!src.startsWith('/gallery/')) return null;
  const file = src.slice('/gallery/'.length);
  return `/gallery/thumb-${file.replace(/\.[^.]+$/, '')}.webp`;
}
