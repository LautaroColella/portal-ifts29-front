import { NavLink } from 'react-router-dom';
import { Home, ClipboardList, BarChart2, HelpCircle } from 'lucide-react';

const LogoSVG = ({ className }) => (
  <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="shadow" x="-10%" y="-10%" width="130%" height="130%">
        <feDropShadow dx="1" dy="2" stdDeviation="2" floodOpacity="0.4"/>
      </filter>
      <radialGradient id="grad" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#ffeb3b" />
        <stop offset="100%" stopColor="#f57f17" />
      </radialGradient>
      <linearGradient id="bevel" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="white" stopOpacity="0.5" />
        <stop offset="50%" stopColor="transparent" stopOpacity="0" />
        <stop offset="100%" stopColor="black" stopOpacity="0.3" />
      </linearGradient>
    </defs>
    
    {/* Outer border & white background */}
    <rect x="2" y="2" width="96" height="96" fill="#ffffff" stroke="#9ca3af" strokeWidth="2" rx="2" />
    
    {/* Quadrants */}
    <rect x="4" y="4" width="45" height="45" fill="#1565C0" />
    <rect x="4" y="4" width="45" height="45" fill="url(#bevel)" />
    <text x="26.5" y="38" fill="white" fontSize="38" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">I</text>

    <rect x="51" y="4" width="45" height="45" fill="#2EAD4B" />
    <rect x="51" y="4" width="45" height="45" fill="url(#bevel)" />
    <text x="73.5" y="38" fill="white" fontSize="38" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">F</text>

    <rect x="4" y="51" width="45" height="45" fill="#2EAD4B" />
    <rect x="4" y="51" width="45" height="45" fill="url(#bevel)" />
    <text x="26.5" y="85" fill="white" fontSize="38" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">T</text>

    <rect x="51" y="51" width="45" height="45" fill="#2EAD4B" />
    <rect x="51" y="51" width="45" height="45" fill="url(#bevel)" />
    <text x="73.5" y="85" fill="white" fontSize="38" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">S</text>

    {/* Center Yellow Circle */}
    <circle cx="50" cy="50" r="23" fill="url(#grad)" filter="url(#shadow)" />
    <text x="50" y="58" fill="black" fontSize="22" fontWeight="900" fontFamily="sans-serif" textAnchor="middle">29</text>
  </svg>
);

export const Sidebar = ({ isOpen }) => {
  const menuItems = [
    { icon: Home, label: 'Inicio', path: '/' },
    { icon: ClipboardList, label: 'Reclamos', path: '/reclamos' },
    { icon: BarChart2, label: 'Reportes', path: '/reportes' },
    { icon: HelpCircle, label: 'Ayuda', path: '/ayuda' }
  ];

  return (
    <aside 
      className={`bg-surface border-r border-border h-screen flex flex-col transition-all duration-300 ease-in-out shrink-0 overflow-hidden ${
        isOpen ? 'w-64' : 'w-20'
      }`}
    >
      <div className="h-full flex flex-col w-full">
        <div className={`flex items-center transition-all duration-300 ${isOpen ? 'p-6 gap-3' : 'p-4 justify-center gap-0'}`}>
          <LogoSVG className={`${isOpen ? 'w-12 h-12' : 'w-10 h-10'} shrink-0 drop-shadow-sm transition-all duration-300`} />
          <div className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${isOpen ? 'w-auto opacity-100' : 'w-0 opacity-0 hidden'}`}>
            <h1 className="font-bold text-text-main text-base leading-tight">IFTS 29</h1>
            <p className="text-xs text-text-secondary">Sistema de Reclamos</p>
          </div>
        </div>
        
        <nav className={`flex-1 py-4 space-y-2 transition-all duration-300 ${isOpen ? 'px-4' : 'px-3'}`}>
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              title={!isOpen ? item.label : undefined}
              className={({ isActive }) =>
                `flex items-center py-3 rounded-lg text-sm font-medium transition-colors ${
                  isOpen ? 'px-4 gap-3' : 'px-0 justify-center gap-0'
                } ${
                  isActive
                    ? 'bg-[var(--sidebar-active-bg)] text-[var(--sidebar-active-text)]'
                    : 'text-text-main hover:bg-background hover:text-[var(--sidebar-active-text)]'
                }`
              }
            >
              <item.icon className="w-5 h-5 shrink-0" />
              <span className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${isOpen ? 'w-auto opacity-100' : 'w-0 opacity-0 hidden'}`}>
                {item.label}
              </span>
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};
