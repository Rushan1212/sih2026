import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar({ onOpenDemo }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Problem', href: '#problem' },
    { label: 'Platform', href: '#platform' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-[#0D0D0D]/90 backdrop-blur-md border-b border-[#242424] py-4' 
        : 'bg-transparent py-6'
    }`}>
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        
        {/* Logo (Left) */}
        <a href="#" className="flex items-center gap-2.5">
          <div className="w-6 h-6 bg-[#F5A623] flex items-center justify-center">
            <span className="w-2.5 h-2.5 bg-[#0D0D0D]"></span>
          </div>
          <span className="font-headline text-2xl tracking-wider text-white">
            COALGUARD <span className="text-[#F5A623]">AI</span>
          </span>
        </a>

        {/* 4 Nav Links (Center) */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-[#8A8A8A] hover:text-white transition-colors uppercase tracking-wider"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Request Demo CTA (Right) */}
        <div className="hidden md:block">
          <button
            onClick={onOpenDemo}
            className="px-5 py-2.5 bg-[#F5A623] text-[#0D0D0D] font-medium text-xs uppercase tracking-wider hover:bg-[#FFA826] active:scale-95 transition-all font-sans font-bold"
          >
            Request Demo
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white p-1"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0D0D0D] border-b border-[#242424] px-6 py-6 space-y-4">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base text-[#8A8A8A] hover:text-white uppercase tracking-wider"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenDemo();
              }}
              className="w-full py-3 bg-[#F5A623] text-[#0D0D0D] font-bold text-xs uppercase tracking-wider"
            >
              Request Demo
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
