import { NavLink, Link } from 'react-router-dom';
import { useCampaignStore } from '@/store/campaignStore';
import { useState, useRef, useEffect } from 'react';

const navItems = [
  { to: '/', label: 'Dashboard' },
  { to: '/combat', label: 'Combat' },
  { to: '/bestiary', label: 'Bestiary' },
  { to: '/characters', label: 'Characters' },
  { to: '/classes', label: 'Classes & Subclasses' },
  { to: '/spells', label: 'Spell Library' },
  { to: '/origins', label: 'Backgrounds / Species / Feats' },
  { to: '/map', label: 'Map' },
  { to: '/allies', label: 'Allies & Summons' },
  { to: '/encounters', label: 'Encounters' },
  { to: '/rules', label: 'Rules lookup' },
];

export function Sidebar() {
  const { campaigns, active_campaign_id, setActiveCampaign, createCampaign } =
    useCampaignStore();
  const activeCampaign = campaigns.find((c) => c.id === active_campaign_id);

  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <aside className="bg-bg-secondary border-r border-border-tertiary p-3 flex flex-col gap-1 min-w-[200px] w-[200px]">
      {/* Campaign switcher */}
      <div className="relative" ref={ref}>
        <button
          onClick={() => setOpen(!open)}
          className="w-full text-left bg-bg-primary mb-4"
          style={{
            padding: '10px 8px',
            border: '0.5px solid var(--color-border-tertiary)',
            borderRadius: 'var(--border-radius-md)',
          }}
        >
          <div className="text-[11px] text-text-tertiary mb-0.5">Campaign</div>
          <div className="flex justify-between items-center">
            <span className="text-[13px] font-medium truncate">
              {activeCampaign?.name ?? 'No campaign'}
            </span>
            <span className="text-text-secondary text-[10px]">▼</span>
          </div>
        </button>

        {open && (
          <div
            className="absolute z-50 left-0 right-0 mt-1 bg-bg-primary shadow-lg"
            style={{
              border: '0.5px solid var(--color-border-secondary)',
              borderRadius: 'var(--border-radius-md)',
            }}
          >
            {campaigns.length === 0 ? (
              <div className="p-3 text-[12px] text-text-tertiary">
                No campaigns yet.
              </div>
            ) : (
              campaigns.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setActiveCampaign(c.id);
                    setOpen(false);
                  }}
                  className="w-full text-left text-[13px] hover:bg-bg-secondary"
                  style={{
                    padding: '8px 10px',
                    background:
                      c.id === active_campaign_id
                        ? 'var(--color-background-info)'
                        : 'transparent',
                    border: 'none',
                  }}
                >
                  {c.name}
                </button>
              ))
            )}
            <button
              onClick={() => {
                const name = prompt('Campaign name?');
                if (name) {
                  createCampaign(name);
                  setOpen(false);
                }
              }}
              className="w-full text-left text-[12px] text-text-info"
              style={{
                padding: '8px 10px',
                borderTop: '0.5px solid var(--color-border-tertiary)',
                background: 'transparent',
                border: 'none',
                borderTopWidth: '0.5px',
                borderTopStyle: 'solid',
                borderTopColor: 'var(--color-border-tertiary)',
              }}
            >
              + New campaign
            </button>
          </div>
        )}
      </div>

      {/* Nav */}
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/'}
          className={({ isActive }) =>
            `block text-[13px] no-underline ${
              isActive ? 'font-medium' : 'text-text-secondary'
            }`
          }
          style={({ isActive }) => ({
            padding: '8px 10px',
            borderRadius: 'var(--border-radius-md)',
            color: isActive ? 'var(--color-text-primary)' : undefined,
            background: isActive ? 'var(--color-background-primary)' : 'transparent',
            border: isActive ? '0.5px solid var(--color-border-secondary)' : '0.5px solid transparent',
          })}
        >
          {item.label}
        </NavLink>
      ))}

      {/* Settings (bottom) */}
      <div className="mt-auto pt-4 border-t border-border-tertiary">
        <Link
          to="/settings"
          className="block text-[13px] text-text-secondary no-underline"
          style={{
            padding: '8px 10px',
            borderRadius: 'var(--border-radius-md)',
          }}
        >
          Settings
        </Link>
      </div>
    </aside>
  );
}
