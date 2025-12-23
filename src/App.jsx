import React from 'react';
import Home from './pages/Home';
import DarkModeToggle from './components/portfolio/DarkModeToggle';

export default function App() {
  return (
    <>
      <DarkModeToggle />
      <Home />
    </>
  );
}
