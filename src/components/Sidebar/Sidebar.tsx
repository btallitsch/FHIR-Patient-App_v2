import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BarChart3, Settings, Menu, X } from 'lucide-react';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: 'Concept Rules', path: '/', icon: LayoutDashboard },
    { name: 'Patient Information', path: '/patient', icon: BarChart3 },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Top Bar / Header Trigger Menu */}
      <div className="md:hidden bg-gray-900 text-white flex items-center justify-between p-4 fixed top-0 left-0 right-0 z-20 h-16">
        <span className="font-bold text-lg tracking-wider">Clinical Mapper</span>
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Core Element */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-gray-900 text-gray-300 transform transition-transform duration-300 ease-in-out flex flex-col justify-between
        md:translate-x-0 md:static md:inset-auto h-screen
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Top Branding Section */}
        <div>
          <div className="h-16 flex items-center justify-between px-6 border-b border-gray-800 bg-gray-950">
            <span className="font-bold text-xl text-white tracking-wider">Clinical Mapper</span>
            <button md="hidden" onClick={() => setIsOpen(false)} className="md:hidden text-gray-400 hover:text-white">
              <X size={20} />
            </button>
          </div>

          {/* Navigation Items Segment */}
          <nav className="mt-6 px-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)} // Auto-closes navigation tray window on mobile tap
                  className={({ isActive }) => `
                    flex items-center gap-4 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-150
                    ${isActive 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'hover:bg-gray-800 hover:text-white text-gray-400'}
                  `}
                >
                  <Icon size={20} className="shrink-0" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom User Metadata Section */}
        <div className="p-4 border-t border-gray-800 bg-gray-950/50 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center font-bold text-white text-sm">
            JD
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-white truncate">John Doe</p>
            <p className="text-xs text-gray-500 truncate">john@example.com</p>
          </div>
        </div>
      </aside>

      {/* Backdrop overlay window sheet for rendering under open mobile trays */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)} 
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
        />
      )}
    </>
  );
}
