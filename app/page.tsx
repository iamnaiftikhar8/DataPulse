//app/page.TSX
'use client';
import React, { useState } from 'react';

import HomePage from '@/components/pages/HomePage';
import FeaturesPage from '@/components/pages/FeaturesPage';
import PricingPage from '@/components/pages/PricingPage';
import AboutPage from '@/components/pages/AboutPage';
import ContactPage from '@/components/pages/ContactPage';
import LoginPage from '@/components/pages/LoginPage';
import SignupPage from '@/components/pages/SignupPage';
import AnalyzePage from '@/components/pages/AnalyzePage';

// If you want the pages to navigate via setCurrentPage, use Option A above (NavProps)
// and pass setCurrentPage below; otherwise remove the prop everywhere.

type CurrentPage =
  | 'home'
  | 'features'
  | 'pricing'
  | 'about'
  | 'contact'
  | 'login'
  | 'signup'
  | 'analyze';

export default function AllInOneApp() {
  const [currentPage, setCurrentPage] = useState<CurrentPage>('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage /* setCurrentPage={setCurrentPage} */ />;
      case 'features':
        return <FeaturesPage /* setCurrentPage={setCurrentPage} */ />;
      case 'pricing':
        return <PricingPage /* setCurrentPage={setCurrentPage} */ />;
      case 'about':
        return <AboutPage /* setCurrentPage={setCurrentPage} */ />;
      case 'contact':
        return <ContactPage /* setCurrentPage={setCurrentPage} */ />;
      case 'login':
        return <LoginPage /* setCurrentPage={setCurrentPage} */ />;
      case 'signup':
        return <SignupPage /* setCurrentPage={setCurrentPage} */ />;
      case 'analyze':
        return <AnalyzePage /* setCurrentPage={setCurrentPage} */ />;
      default:
        return <HomePage /* setCurrentPage={setCurrentPage} */ />;
    }
  };

  return (
    <div>
      {/* Your header/nav here — buttons can call setCurrentPage('pricing') etc. */}
      {renderPage()}
    </div>
  );
}
