import { create } from 'zustand';

export type NodeStatus = 'risk' | 'verifying' | 'actioned' | 'closed';

export interface TelemetryNode {
  id: string;
  benchLevel: number;
  position: [number, number, number];
  title: string;
  hazardCode: string;
  status: NodeStatus;
}

interface ShowcaseState {
  scrollProgress: number;
  pointer: { x: number; y: number };
  activeSection: string;
  activeWorkflowStage: number;

  // Tunnel Scrollytelling State
  currentStation: number;
  currentFrame: number;
  isTransitioning: boolean;
  loadProgress: number;
  isLoaded: boolean;

  isWebGLSupported: boolean;
  lowPowerMode: boolean;
  prefersReducedMotion: boolean;
  activeRiskNodes: TelemetryNode[];

  // Actions
  setScrollProgress: (progress: number) => void;
  setPointer: (pointer: { x: number; y: number }) => void;
  setActiveSection: (section: string) => void;
  setActiveWorkflowStage: (stage: number) => void;
  setCurrentStation: (station: number) => void;
  setCurrentFrame: (frame: number) => void;
  setIsTransitioning: (transitioning: boolean) => void;
  setLoadProgress: (progress: number) => void;
  setIsLoaded: (loaded: boolean) => void;
  setWebGLSupported: (supported: boolean) => void;
  setLowPowerMode: (lowPower: boolean) => void;
  setPrefersReducedMotion: (reduced: boolean) => void;
}

const INITIAL_NODES: TelemetryNode[] = [
  { id: 'node-1', benchLevel: 1, position: [-2.2, 0.4, 1.2], title: 'Seam XI Slope Inclinometer', hazardCode: 'CMR-38(1)', status: 'risk' },
  { id: 'node-2', benchLevel: 2, position: [1.8, -0.6, 0.8], title: 'Pit North Bench Gas Sensor (CH4)', hazardCode: 'CMR-153', status: 'risk' },
  { id: 'node-3', benchLevel: 3, position: [-0.9, -1.5, -0.6], title: 'Haul Road Dust Monitor (PM10)', hazardCode: 'ENV-09', status: 'verifying' },
  { id: 'node-4', benchLevel: 4, position: [2.5, -2.4, -1.4], title: 'Overburden Sump Level Sensor', hazardCode: 'CMR-182', status: 'risk' },
  { id: 'node-5', benchLevel: 5, position: [0.1, -3.2, -2.2], title: 'Sub-surface Seismic Micro-Sensor', hazardCode: 'CMR-42', status: 'risk' },
];

export const useShowcaseStore = create<ShowcaseState>((set) => ({
  scrollProgress: 0,
  pointer: { x: 0, y: 0 },
  activeSection: 'hero',
  activeWorkflowStage: 0,
  currentStation: 0,
  currentFrame: 1,
  isTransitioning: false,
  loadProgress: 0,
  isLoaded: false,
  isWebGLSupported: true,
  lowPowerMode: false,
  prefersReducedMotion: false,
  activeRiskNodes: INITIAL_NODES,

  setScrollProgress: (progress) => set({ scrollProgress: progress }),
  setPointer: (pointer) => set({ pointer }),
  setActiveSection: (section) => set({ activeSection: section }),
  setCurrentStation: (station) => set({ currentStation: station }),
  setCurrentFrame: (frame) => set({ currentFrame: frame }),
  setIsTransitioning: (transitioning) => set({ isTransitioning: transitioning }),
  setLoadProgress: (progress) => set({ loadProgress: progress }),
  setIsLoaded: (loaded) => set({ isLoaded: loaded }),
  
  setActiveWorkflowStage: (stage) => set((state) => {
    // Map workflow stage to node states:
    // Stage 0: Field Evidence (risk)
    // Stage 1: AI Analysis (risk)
    // Stage 2: Risk Detection (high risk)
    // Stage 3: Officer Verification (verifying - amber)
    // Stage 4: Corrective Action (actioned)
    // Stage 5: Escalation (actioned)
    // Stage 6: Closure Verification (all closed - verified green)
    const updatedNodes = state.activeRiskNodes.map((node, index) => {
      let status: NodeStatus = 'risk';
      if (stage >= 6) {
        status = 'closed';
      } else if (stage >= 4) {
        status = index <= stage - 2 ? 'closed' : 'actioned';
      } else if (stage >= 3) {
        status = index === 0 ? 'actioned' : 'verifying';
      } else if (stage >= 1) {
        status = index === 2 ? 'verifying' : 'risk';
      } else {
        status = 'risk';
      }
      return { ...node, status };
    });

    return {
      activeWorkflowStage: stage,
      activeRiskNodes: updatedNodes,
    };
  }),

  setWebGLSupported: (supported) => set({ isWebGLSupported: supported }),
  setLowPowerMode: (lowPower) => set({ lowPowerMode: lowPower }),
  setPrefersReducedMotion: (reduced) => set({ prefersReducedMotion: reduced }),
}));
