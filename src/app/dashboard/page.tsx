'use client';

import React, { useState } from 'react';
import ExploreDashboard from '../../components/ExploreDashboard';
import MineSelectorModal from '../../components/MineSelectorModal';
import DemoModal from '../../components/DemoModal';
import VideoModal from '../../components/VideoModal';
import { preExistingMines, buildCuratedMineTelemetry } from '../../data/mineRecords';

interface DashboardPageProps {
  onNavigate?: (route: string) => void;
  selectedMine?: any;
  onSelectMine?: (mine: any) => void;
}

export default function DashboardPage({
  onNavigate,
  selectedMine: initialMine,
  onSelectMine,
}: DashboardPageProps) {
  const [mineSelectorOpen, setMineSelectorOpen] = useState(false);
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  const [selectedMine, setSelectedMine] = useState(() => {
    return initialMine || buildCuratedMineTelemetry(preExistingMines[0]);
  });

  const handleSelectMine = (mineData: any) => {
    setSelectedMine(mineData);
    if (onSelectMine) {
      onSelectMine(mineData);
    }
    setMineSelectorOpen(false);
  };

  const handleBackToLanding = () => {
    if (onNavigate) {
      onNavigate('/');
    } else if (typeof window !== 'undefined') {
      window.location.hash = '';
      if (window.history.pushState) {
        window.history.pushState(null, '', '/');
      }
    }
  };

  return (
    <>
      <ExploreDashboard
        onBackToLanding={handleBackToLanding}
        onOpenDemoModal={() => setDemoModalOpen(true)}
        selectedMine={selectedMine}
        onChangeMine={() => setMineSelectorOpen(true)}
      />
      <MineSelectorModal
        isOpen={mineSelectorOpen}
        onClose={() => setMineSelectorOpen(false)}
        onSelectMine={handleSelectMine}
      />
      <DemoModal isOpen={demoModalOpen} onClose={() => setDemoModalOpen(false)} />
      <VideoModal isOpen={videoModalOpen} onClose={() => setVideoModalOpen(false)} />
    </>
  );
}

