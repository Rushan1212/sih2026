import React, { useEffect, useState } from 'react';

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [trailingPos, setTrailingPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only enable on non-touch pointer devices
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const onMouseMove = (e) => {
      setPos({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      // Check if hovering over clickable elements
      const target = e.target;
      const isClickable = target.closest('button, a, input, textarea, select, [role="button"], .clickable');
      setIsHovered(!!isClickable);
    };

    const onMouseDown = () => setIsClicked(true);
    const onMouseUp = () => setIsClicked(false);
    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    let frameId;
    const updateTrailing = () => {
      setTrailingPos((prev) => ({
        x: prev.x + (pos.x - prev.x) * 0.2,
        y: prev.y + (pos.y - prev.y) * 0.2,
      }));
      frameId = requestAnimationFrame(updateTrailing);
    };
    frameId = requestAnimationFrame(updateTrailing);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      cancelAnimationFrame(frameId);
    };
  }, [pos, isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {/* Central Sharp Dot */}
      <div
        className="fixed pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 transition-transform duration-75"
        style={{
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          transform: `translate(-50%, -50%) scale(${isClicked ? 0.7 : isHovered ? 1.4 : 1})`,
        }}
      >
        <div className={`w-2 h-2 rounded-full ${isHovered ? 'bg-amber' : 'bg-safety-yellow'} shadow-[0_0_8px_#F5A623]`} />
      </div>

      {/* Outer Tactical Ring */}
      <div
        className="fixed pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 transition-[width,height,border-color,background-color] duration-150 ease-out"
        style={{
          left: `${trailingPos.x}px`,
          top: `${trailingPos.y}px`,
          width: isHovered ? '48px' : '26px',
          height: isHovered ? '48px' : '26px',
          transform: 'translate(-50%, -50%)',
          border: isHovered ? '1.5px solid rgba(245, 166, 35, 0.8)' : '1px solid rgba(245, 166, 35, 0.35)',
          backgroundColor: isHovered ? 'rgba(245, 166, 35, 0.08)' : 'transparent',
          borderRadius: '50%',
        }}
      >
        {isHovered && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="w-1.5 h-1.5 border-t border-l border-amber opacity-80 -top-0.5 -left-0.5 absolute"></span>
            <span className="w-1.5 h-1.5 border-b border-r border-amber opacity-80 -bottom-0.5 -right-0.5 absolute"></span>
          </div>
        )}
      </div>
    </>
  );
}
