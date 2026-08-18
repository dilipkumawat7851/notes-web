import React, { useState, useRef, useEffect } from 'react';

const Dropdown = ({
  trigger,
  items = [],
  align = 'right',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    const handleEscape = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <div onClick={toggleDropdown} className="cursor-pointer inline-block">
        {trigger}
      </div>

      {isOpen && (
        <div 
          className={`absolute z-50 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-slate-800 ring-1 ring-black ring-opacity-5 dark:ring-slate-700 focus:outline-none transform opacity-100 scale-100 transition-all origin-top-right ${align === 'right' ? 'right-0' : 'left-0'}`}
          role="menu"
        >
          <div className="py-1" role="none">
            {items.map((item, idx) => {
              if (item.divider) {
                return <hr key={`divider-${idx}`} className="my-1 border-slate-200 dark:border-slate-700" />;
              }

              return (
                <button
                  key={idx}
                  onClick={(e) => {
                    if (item.onClick) item.onClick(e);
                    setIsOpen(false);
                  }}
                  className={`group flex w-full items-center px-4 py-2 text-sm ${item.danger ? 'text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50'}`}
                  role="menuitem"
                >
                  {item.icon && (
                    <span className={`mr-3 h-5 w-5 ${item.danger ? 'text-red-500' : 'text-slate-400 group-hover:text-slate-500 dark:group-hover:text-slate-300'}`}>
                      {item.icon}
                    </span>
                  )}
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
