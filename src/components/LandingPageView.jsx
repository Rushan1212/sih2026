import React, { useState, useCallback } from 'react';
import { useSmoothScroll } from '../hooks/useSmoothScroll';
import ShowcaseMagneticCursor from './showcase/ShowcaseMagneticCursor';
import ShowcaseHero from './showcase/ShowcaseHero';
import HeroToTunnelTransition from './showcase/HeroToTunnelTransition';
import TunnelScrollytelling from './tunnel/TunnelScrollytelling';
import ShowcaseTheGap from './showcase/ShowcaseTheGap';
import ShowcaseTheLoop from './showcase/ShowcaseTheLoop';
import ShowcaseUSPs from './showcase/ShowcaseUSPs';
import ShowcaseArchitecture from './showcase/ShowcaseArchitecture';
import ShowcaseOperationsRisk from './showcase/ShowcaseOperationsRisk';
import ShowcaseImpact from './showcase/ShowcaseImpact';
import ShowcaseMarqueeFooter from './showcase/ShowcaseMarqueeFooter';
import ShowcaseTelemetryModal from './showcase/ShowcaseTelemetryModal';

export default function LandingPageView({
  onNavigate,
  onExplorePlatform,
  selectedMine,
  onSelectMine,
}) {
  // Initialize Lenis smooth scroll synced to GSAP ticker and pointer tracking
  useSmoothScroll();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);

  const handleExplore = useCallback(() => {
    if (onExplorePlatform) {
      onExplorePlatform();
    } else if (onNavigate) {
      onNavigate('/dashboard');
    } else if (typeof window !== 'undefined') {
      window.location.hash = 'dashboard';
    }
  }, [onExplorePlatform, onNavigate]);

  const handleOpenVideo = useCallback(() => {
    setSelectedNode(null);
    setIsModalOpen(true);
  }, []);

  const handleNodeSelect = useCallback((node) => {
    setSelectedNode(node);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedNode(null);
  }, []);

  return (
    <main className="relative min-h-screen w-full bg-[#0d0e10] text-[#edeef0] overflow-x-clip selection:bg-[#f5a524] selection:text-[#070708]">
      {/* Subtle Texture Grain Overlay */}
      <div className="film-grain" aria-hidden="true" />

      {/* Accessible Magnetic Cursor (only on fine-pointer desktop, bypassed on touch & reduced motion) */}
      <ShowcaseMagneticCursor />

      {/* 01: HERO with Dark Isometric Diorama & Immediate Juror Comprehension */}
      <ShowcaseHero
        onExplorePlatform={handleExplore}
        onOpenVideo={handleOpenVideo}
        onNodeSelect={handleNodeSelect}
      />

      {/* 01.5: 4-LAYER PARALLAX HANDOFF INTO THE TUNNEL MOUTH (Osmo-style parallax transition) */}
      <HeroToTunnelTransition />

      {/* 02: THE PINNED 7-STATION TUNNEL SCROLLYTELLING CORE MECHANIC (Phase 1) */}
      <TunnelScrollytelling
        onExplorePlatform={handleExplore}
        onOpenVideo={handleOpenVideo}
      />

      {/* 03: THE GAP — The 5 Failures Ledger, Display Thesis Statement & In/Through/Out Flow */}
      <ShowcaseTheGap />

      {/* 03: THE LOOP — 7-Stage Closed-Loop Governance Horizontal-Scroll Sequence */}
      <ShowcaseTheLoop />

      {/* 04: FIVE USPS — Sticky-Left / Scrolling-Right Editorial Pairing */}
      <ShowcaseUSPs />

      {/* 05: HOW IT WORKS & ARCHITECTURE — 7 Steps & Enterprise Stack Blueprint */}
      <ShowcaseArchitecture />

      {/* 06: OPERATIONS & RISK MATRIX — Direct Risk ↔ Mitigation Pairing & Rollout Path */}
      <ShowcaseOperationsRisk />

      {/* 07: IMPACT — Before vs After Transformation, 5 Benefit Axes & Target KPI Hypotheses */}
      <ShowcaseImpact />

      {/* 08: MARQUEE BAND & FOOTER — Looping Kinetic Marquee & Hackathon Attribution */}
      <ShowcaseMarqueeFooter onExplorePlatform={handleExplore} />

      {/* Modal for Demo Briefing & 3D Node Inspection */}
      <ShowcaseTelemetryModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        selectedNode={selectedNode}
        onExplorePlatform={handleExplore}
      />
    </main>
  );
}
