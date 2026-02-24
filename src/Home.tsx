import React from 'react';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function Home({ setCurrentPage }: { setCurrentPage: (page: any) => void }) {
  return (
    <div style={{ maxWidth: '500px', margin: '40px auto', textAlign: 'center' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>
        {getGreeting()}, Siena! 👋
      </h1>
      <p style={{ color: '#888', marginBottom: '40px', fontSize: '1.1rem' }}>
        Where would you like to begin?
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {[
          { label: '📅 Calendar', page: 'calendar' },
          { label: '✅ To Do List', page: 'todo' },
          { label: '🏆 Accomplished', page: 'accomplished' },
          { label: '⏱️ Focus Timer', page: 'timer' },
          { label: '📝 Plan', page: 'plan' },
        ].map(({ label, page }) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            style={{
              padding: '14px',
              fontSize: '1rem',
              border: '1px solid #eee',
              borderRadius: '10px',
              backgroundColor: '#fff',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#fff')}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )