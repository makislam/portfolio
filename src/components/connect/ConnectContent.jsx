import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Loader2, Send, Check, Home } from 'lucide-react';
import { submitFollowUp } from '@/api/connectForm';

// Map an "?e=" URL param to a one-line greeting. Add new events here.
const EVENT_GREETINGS = {
  corl26: 'Thanks for the conversation at CoRL 2026.',
};

const CV_UPDATED = 'Sept 2026';

function WorkItem({ role, org, dates }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-0.5 sm:gap-4">
      <div>
        <p className="text-slate-900">{role}</p>
        <p className="text-sm text-cloud-dark">{org}</p>
      </div>
      <p className="text-sm text-cloud-dark sm:text-right sm:flex-shrink-0">{dates}</p>
    </div>
  );
}

export default function ConnectContent() {
  const [searchParams] = useSearchParams();
  const eventCode = searchParams.get('e');
  const greeting = eventCode ? EVENT_GREETINGS[eventCode] : null;

  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | submitting | sent | error

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setStatus('submitting');
    try {
      await submitFollowUp({ email, event: eventCode });
      setStatus('sent');
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Link
        to="/"
        aria-label="Back to home"
        className="inline-flex items-center gap-1.5 text-sm text-cloud-dark hover:text-accent focus-visible:text-accent transition-colors mb-4"
      >
        <Home className="w-4 h-4" />
        Home
      </Link>

      {greeting && <p className="text-sm text-cloud-dark mb-4">{greeting}</p>}

      <div className="flex items-center gap-4 mb-2">
        <picture>
          <source srcSet="/hero/me-1-avatar.webp" type="image/webp" />
          <img
            src="/hero/me-1-avatar.jpg"
            alt="Makis Lam"
            className="w-24 h-24 rounded-full object-cover flex-shrink-0"
            loading="eager"
            fetchpriority="high"
            decoding="async"
          />
        </picture>
        <h1 className="text-4xl font-medium text-slate-900 leading-tight">Makis Lam</h1>
      </div>

      <p className="text-sm text-cloud-dark mb-5">Applying to PhD programs for Fall 2027</p>

      <p className="text-lg text-slate-900 mb-6 leading-relaxed">
        I like building robots 🤖.
      </p>

      <div className="mb-8">
        <picture>
          <source srcSet="/projects/raspberry-hardware.webp" type="image/webp" />
          <img
            src="/projects/raspberry-hardware.jpg"
            alt="Real-time force control on a raspberry with no embedded sensors in the fingers."
            className="w-full aspect-video object-cover rounded-lg"
            loading="lazy"
            decoding="async"
          />
        </picture>
        <p className="text-sm text-cloud-dark mt-2">
          Real-time force control on a raspberry with no embedded sensors in the fingers.
        </p>
      </div>

      <div className="mb-8">
        <p className="text-sm font-medium text-accent mb-3">Current work</p>
        <div className="space-y-4">
          <WorkItem
            role="Robotics Engineer Co-op"
            org="FuturHand Robotics, with CMU collaborators"
            dates="May 2026 - Present"
          />
          <WorkItem
            role="Undergraduate Researcher"
            org="SMART-Lab, University of Waterloo"
            dates="Sept. 2025 - Present"
          />
        </div>
      </div>

      <div className="mb-8 space-y-2">
        <a
          href="/Makis_Lam_Curriculum_Vitae.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-accent hover:underline focus-visible:underline font-medium"
        >
          CV · PDF · {CV_UPDATED} →
        </a>
        <a
          href="/Official_Transcript.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="block text-sm text-accent hover:underline focus-visible:underline"
        >
          Transcript · PDF
        </a>
      </div>

      <div className="mb-10">
        <a
          href="mailto:makis.lam@uwaterloo.ca"
          className="text-accent hover:underline focus-visible:underline"
        >
          Email
        </a>
        <span className="text-cloud mx-2">·</span>
        <a
          href="https://github.com/makislam"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent hover:underline focus-visible:underline"
        >
          GitHub
        </a>
        <span className="text-cloud mx-2">·</span>
        <a
          href="https://linkedin.com/in/makislam"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent hover:underline focus-visible:underline"
        >
          LinkedIn
        </a>
      </div>

      <div className="border-t border-ivory-dark pt-6">
        {status === 'sent' ? (
          <p className="text-sm text-slate-900 flex items-center gap-2">
            <Check className="w-4 h-4 text-accent" />
            Got it, thanks.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <p className="text-sm text-cloud-dark">Leave your email and I will follow up.</p>
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="flex-1 rounded-lg border border-ivory-dark bg-ivory-light px-4 py-2 text-slate-900 placeholder:text-cloud focus:outline-none focus:ring-2 focus:ring-accent transition-shadow"
              />
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="rounded-lg border border-accent text-accent px-4 py-2 font-medium hover:bg-accent hover:text-ivory-light transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                aria-label="Send"
              >
                {status === 'submitting' ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
            {status === 'error' && (
              <p className="text-sm text-red-500">Something went wrong. Try emailing me directly.</p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
