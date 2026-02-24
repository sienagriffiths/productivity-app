import React, { useState } from 'react';
import Home from './Home';
import TodoList from './TodoList';

type Page = 'home' | 'todo' | 'calendar' | 'accomplished' | 'timer' | 'plan';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  const handleSetPage = (page: string) => {
    setCurrentPage(page as Page);
  };

  return (
    <div style={{ fontFamily: 'Gilda-Display', height: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* Tab Navigation */}
      <nav style={{ display: 'flex', gap: '8px', padding: '12px', borderBottom: '1px solid #eee', backgroundColor: '#fafafa' }}>
            {(['home', 'calendar', 'todo', 'plan', 'accomplished', 'timer'] as Page[]).map((page) => (          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            style={{
              padding: '8px 16px',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              backgroundColor: currentPage === page ? '#F26BA8' : '#eee',
              color: currentPage === page ? '#fff' : '#000',
              fontWeight: currentPage === page ? 'bold' : 'normal',
            }}
          >
            {page === 'todo' ? 'To Do' : page.charAt(0).toUpperCase() + page.slice(1)}
          </button>
        ))}
      </nav>

      {/* Page Content */}
      <main style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
        {currentPage === 'home' && <Home setCurrentPage={handleSetPage} />}
        {currentPage === 'todo' && <TodoList onTaskComplete={(_task, _divider) => { return; }} />}        
        {currentPage === 'calendar' && <h1>📅 Calendar</h1>}
        {currentPage === 'accomplished' && <h1>🏆 Accomplished</h1>}
        {currentPage === 'timer' && <h1>⏱️ Focus Timer</h1>}
        {currentPage === 'plan' && <h1>📝 Plan</h1>}
      </main>

    </div>
  );
}