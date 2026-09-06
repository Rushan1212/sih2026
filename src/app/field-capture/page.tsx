'use client';

import React from 'react';
import { FieldNavigationHeader } from '../../components/field/FieldNavigationHeader';
import { HazardCaptureView } from '../../components/field/HazardCaptureView';

interface PageProps {
  onNavigate?: (route: string) => void;
}

export default function FieldCapturePage({ onNavigate }: PageProps) {
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
      <div className="fixed bottom-0 right-0 w-[700px] h-[500px] bg-[#2D3561]/20 blur-[180px] pointer-events-none rounded-full z-0" />

      {/* Tactical Top Bar */}
      <FieldNavigationHeader
        currentRoute="capture"
        onNavigate={handleNavigate}
      />

      {/* Main Workflow View */}
      <main className="relative z-10">
        <HazardCaptureView
          onNavigateToOutbox={() => handleNavigate('/hazard-outbox')}
        />
      </main>
    </div>
  );
}

