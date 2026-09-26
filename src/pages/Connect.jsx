import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import ContactGateForm from '@/components/connect/ContactGateForm';
import ConnectContent from '@/components/connect/ConnectContent';

const STORAGE_KEY = 'connect_unlocked_name';

export default function Connect() {
  const [firstName, setFirstName] = useState(() => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(STORAGE_KEY);
  });

  const handleUnlock = ({ name }) => {
    const first = name.trim().split(' ')[0];
    localStorage.setItem(STORAGE_KEY, first);
    setFirstName(first);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-ivory-light dark:bg-slate-900 px-6 py-24">
      <AnimatePresence mode="wait">
        {firstName ? (
          <ConnectContent key="content" firstName={firstName} />
        ) : (
          <ContactGateForm key="form" onUnlock={handleUnlock} />
        )}
      </AnimatePresence>
    </div>
  );
}
