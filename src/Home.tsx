import React from 'react';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function Home({ setCurrentPage }: { setCurrentPage: (page: string) => void }) {
  return (
    <div style={{ maxWidth: '500px', margin: '40px auto', textAlign: 'center' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '8px', fontFamily: 'Gilda-Display' }}>
        {getGreeting()}, Siena! 🌅
      </h1>
      <p style={{ color: '#888', marginBottom: '40px', fontSize: '1.1rem' }}>
        Where would you like to begin?
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {[
          { label: '🌸 Calendar', page: 'calendar' },
          { label: '💛 To Do', page: 'todo' },
          { label: '🎀 Plan', page: 'plan' },
          { label: '🌞 Accomplished', page: 'accomplished' },
          { label: '🩷 Focus Timer', page: 'timer' },
          
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
            }}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}