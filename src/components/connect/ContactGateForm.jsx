import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Send } from 'lucide-react';
import { submitConnectRequest } from '@/api/connectForm';

export default function ContactGateForm({ onUnlock }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | submitting | error
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    setError('');
    try {
      await submitConnectRequest(form);
      onUnlock(form);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
      setStatus('error');
    }
  };

  const inputClass =
    'w-full rounded-lg border border-ivory-dark dark:border-slate-700 bg-ivory-light dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-ivory-light placeholder:text-cloud focus:outline-none focus:ring-2 focus:ring-accent transition-shadow';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="text-center mb-8">
        <p className="text-sm uppercase tracking-[0.3em] text-accent mb-4">Let's Connect</p>
        <h1 className="text-3xl md:text-4xl font-light text-slate-900 dark:text-ivory-light mb-3">
          Nice to <span className="font-medium">meet you</span>
        </h1>
        <p className="text-cloud-dark dark:text-cloud">
          Leave your contact info and I'll get back to you — then you'll see mine (CV, transcript, and how to reach me).
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          required
          value={form.name}
          onChange={handleChange}
          placeholder="Your name"
          className={inputClass}
        />
        <input
          type="email"
          name="email"
          required
          value={form.email}
          onChange={handleChange}
          placeholder="Your email"
          className={inputClass}
        />
        <input
          type="tel"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone (optional)"
          className={inputClass}
        />
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          placeholder="What would you like to chat about? (optional)"
          rows={3}
          className={inputClass + ' resize-none'}
        />

        {status === 'error' && (
          <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
        )}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={status === 'submitting'}
          className="w-full flex items-center justify-center gap-2 rounded-lg bg-accent text-ivory-light px-6 py-3 font-medium hover:bg-accent/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {status === 'submitting' ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
          {status === 'submitting' ? 'Sending...' : 'Send & continue'}
        </motion.button>
      </form>
    </motion.div>
  );
}
