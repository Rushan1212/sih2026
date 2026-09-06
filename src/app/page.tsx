'use client';

import React from 'react';
import LandingPageView from '../components/LandingPageView';

interface PageProps {
  onNavigate?: (route: string) => void;
  onExplorePlatform?: () => void;
  selectedMine?: any;
  onSelectMine?: (mine: any) => void;
}

export default function RootPage({
  onNavigate,
  onExplorePlatform,
  selectedMine,
  onSelectMine,
}: PageProps) {
  const handleNavigate = (route: string) => {
    if (onNavigate) {
      onNavigate(route);
    } else if (typeof window !== 'undefined') {
      window.location.hash = route.replace(/^\//, '');
      if (window.history.pushState) {
        window.history.pushState(null, '', route);
      }
    }
  };

  return (
    <LandingPageView
      onNavigate={handleNavigate}
      onExplorePlatform={onExplorePlatform}
      selectedMine={selectedMine}
      onSelectMine={onSelectMine}
    />
  );
}

