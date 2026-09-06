'use client';

import React from 'react';
import { FieldNavigationHeader } from '../../components/field/FieldNavigationHeader';
import { HazardOutboxView } from '../../components/field/HazardOutboxView';

interface PageProps {
  onNavigate?: (route: string) => void;
}

export default function HazardOutboxPage({ onNavigate }: PageProps) {
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
    <div className="min-h-screen bg-coal text-offwhite font-sans selection:bg-amber selection:text-coal relative overflow-x-clip">
      {/* Antigravity Ambient Spatial Lighting */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-amber/[0.035] blur-[160px] pointer-events-none rounded-full z-0" />
      <div className="fixed bottom-0 left-0 w-[700px] h-[500px] bg-teal/[0.025] blur-[180px] pointer-events-none rounded-full z-0" />

      {/* Tactical Top Bar */}
      <FieldNavigationHeader
        currentRoute="outbox"
        onNavigate={handleNavigate}
      />

      {/* Main Workflow View */}
      <main className="relative z-10">
        <HazardOutboxView
          onNavigateToCapture={() => handleNavigate('/field-capture')}
        />
      </main>
    </div>
  );
}

