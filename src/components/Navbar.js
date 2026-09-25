import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { HiMenuAlt3, HiOutlineX } from 'react-icons/hi';
import { SketchPicker } from 'react-color';
import logo from '../assets/logo.png';

const links = [
  ['Rate Calculator', '/rate_calculator'],
  ['Data Search', '/data_search'],
  ['Interlock Calculator', '/box_rate'],
  ['Interlock Data', '/box_search'],
  ['Universal Calculator', '/box_universal'],
  ['Universal Data', '/box_universal_search'],
  ['Corrugated Calculator', '/corrugated_calculator'],
  ['Corrugated Data', '/corrugated_data'],
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [navbarColor, setNavbarColor] = useState('#fde68a');
  const [showColorPicker, setShowColorPicker] = useState(false);

  useEffect(() => {
    const savedColor = localStorage.getItem('navbarColor');
    if (savedColor) setNavbarColor(savedColor);
  }, []);
  useEffect(() => { localStorage.setItem('navbarColor', navbarColor); }, [navbarColor]);
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={isOpen}
        style={{ backgroundColor: navbarColor }}
        className="fixed -left-10 top-1/2 z-[80] flex h-28 w-11 -translate-y-1/2 flex-col items-center justify-center gap-3 rounded-r-xl border-y border-r border-black/15 shadow-lg transition-[left] duration-300 hover:left-0 focus-visible:left-0 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        <img className="h-7 w-7 object-contain" alt="" src={logo} />
        <span className="h-px w-6 bg-black/20" />
        {isOpen ? <HiOutlineX className="h-5 w-5 text-gray-900" /> : <HiMenuAlt3 className="h-5 w-5 text-gray-900" />}
      </button>

      <header className="fixed inset-x-0 top-0 z-50 flex h-16 items-center justify-between border-b border-white/10 bg-slate-800 px-4 shadow-md sm:px-6">
        <Link to="/" onClick={() => setIsOpen(false)} className="flex h-full w-fit items-center gap-3 text-xl font-bold leading-none text-white">
          <img className="h-10 w-10 shrink-0 object-contain" alt="Smart Rate logo" src={logo} />
          <span className="whitespace-nowrap">Smart Rate</span>
        </Link>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Open navigation menu"
          className="flex items-center gap-2 rounded-lg border border-white/20 px-3 py-2 text-sm font-semibold text-white transition-colors hover:border-white/35 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-amber-300"
        >
          <HiMenuAlt3 className="h-5 w-5" />
          <span>Menu</span>
        </button>
      </header>

      <button
        type="button"
        aria-label="Close navigation menu"
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 z-[60] bg-black/50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
      />

      <aside
        aria-hidden={!isOpen}
        style={{ backgroundColor: navbarColor }}
        className={`fixed left-0 top-1/2 z-[70] flex h-[90vh] max-h-[96vh] w-72 max-w-[85vw] -translate-y-1/2 flex-col rounded-r-xl shadow-2xl transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center justify-center border-b border-black/10 px-5 py-4">
          <img className="h-10 w-10 object-contain" alt="Smart Rate logo" src={logo} />
        </div>
        <nav aria-label="Main navigation" className="flex-1 overflow-y-auto px-3 py-4">
          <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-widest text-gray-700/80">Menu</p>
          {links.map(([label, to]) => (
            <Link key={to} to={to} onClick={() => setIsOpen(false)} tabIndex={isOpen ? 0 : -1} className="mb-1 block rounded-lg px-3 py-2.5 font-semibold text-gray-900 transition-colors hover:bg-black/10 focus:bg-black/10 focus:outline-none">
              {label}
            </Link>
          ))}
        </nav>
        <div className="relative border-t border-black/10 p-4">
          <div className="flex items-center justify-between">
            <button onClick={() => setShowColorPicker((show) => !show)} className="rounded-md px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-black/10">Navbar color</button>
            <button onClick={() => window.close()} className="rounded-md px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-black/10">Close app</button>
          </div>
          {showColorPicker && <div className="absolute bottom-full left-3 z-[90] mb-2"><SketchPicker color={navbarColor} onChangeComplete={(color) => setNavbarColor(color.hex)} /></div>}
        </div>
      </aside>
    </>
  );
};

export default Navbar;
