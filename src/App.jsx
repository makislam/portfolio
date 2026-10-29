import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Connect from './pages/Connect';
import Header from './components/portfolio/Header';

// Loaded on demand so three.js and the paper's assets stay out of the homepage bundle.
const RemoteProprioception = lazy(() => import('./research/remote-proprioception/Page'));

function HomeLayout() {
  return (
    <>
      <Header />
      <Home />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeLayout />} />
        <Route path="/connect" element={<Connect />} />
        <Route
          path="/research/remote-proprioception"
          element={
            <Suspense fallback={<div className="min-h-screen bg-paper" />}>
              <RemoteProprioception />
            </Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
