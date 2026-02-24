import React, { useState, useEffect } from 'react';

type TaskTag = 'priority' | 'lengthy' | 'quick' | 'doLater' | null;

interface Task {
  id: number;
  name: string;
  tag: TaskTag;
  completed: boolean;
}

interface Divider {
  id: number;
  name: string;
  tasks: Task[];
}

const STORAGE_KEY = 'productivity-app-todos';

function loadDividers(): Divider[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch { return []; }
}

function saveDividers(dividers: Divider[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(dividers));
}

export default function TodoList({ onTaskComplete }: { onTaskComplete: (task: Task, dividerName: string) => void }) {
  const [dividers, setDividers] = useState<Divider[]>(loadDividers);
  const [filter, setFilter] = useState<TaskTag | 'all'>('all');
  const [newDividerName, setNewDividerName] = useState('');
  const [newTaskName, setNewTaskName] = useState('');
  const [selectedDividerId, setSelectedDividerId] = useState<number | null>(null);
  const [showAddDivider, setShowAddDivider] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [hoveredTaskId, setHoveredTaskId] = useState<number | null>(null);

  useEffect(() => {
    saveDividers(dividers);
  }, [dividers]);

  const addDivider = () => {
    if (!newDividerName.trim()) return;
    const newDivider: Divider = { id: Date.now(), name: newDividerName, tasks: [] };
    setDividers(prev => [...prev, newDivider]);
    setNewDividerName('');
    setShowAddDivider(false);
  };

  const addTask = () => {
    if (!newTaskName.trim() || selectedDividerId === null) return;
    setDividers(prev => prev.map(d =>
      d.id === selectedDividerId
        ? { ...d, tasks: [...d.tasks, { id: Date.now(), name: newTaskName, tag: null, completed: false }] }
        : d
    ));
    setNewTaskName('');
    setShowAddTask(false);
  };

  const tagTask = (dividerId: number, taskId: number, tag: TaskTag) => {
    setDividers(prev => prev.map(d =>
      d.id === dividerId
        ? { ...d, tasks: d.tasks.map(t => t.id === taskId ? { ...t, tag: t.tag === tag ? null : tag } : t) }
        : d
    ));
  };

  const completeTask = (divider: Divider, task: Task) => {
    onTaskComplete(task, divider.name);
    setDividers(prev => prev.map(d =>
      d.id === divider.id
        ? { ...d, tasks: d.tasks.filter(t => t.id !== task.id) }
        : d
    ));
  };

  const deleteTask = (dividerId: number, taskId: number) => {
    setDividers(prev => prev.map(d =>
      d.id === dividerId
        ? { ...d, tasks: d.tasks.filter(t => t.id !== taskId) }
        : d
    ));
  };

  const tagColors: Record<string, string> = {
    priority: '#F5A91B',
    lengthy: '#EDCB8E',
    quick: '#F49EBA',
    doLater: '#F26BA8',
  };

  const filteredDividers = dividers.map(d => ({
    ...d,
    tasks: filter === 'all' ? d.tasks : d.tasks.filter(t => t.tag === filter)
  }));

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', fontFamily: 'Gilda-Display' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2 style={{ margin: 0 }}>💛 To Do List</h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => { setShowAddTask(true); setSelectedDividerId(dividers[0]?.id ?? null); }} style={btnStyle('#000', '#fff')}>+ Add Task</button>
          <button onClick={() => setShowAddDivider(true)} style={btnStyle('#eee', '#000')}>+ Add Divider</button>
        </div>
      </div>

      {/* Filter Bar */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {(['all', 'priority', 'lengthy', 'quick', 'doLater'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '4px 12px', borderRadius: '20px', border: 'none', cursor: 'pointer',
            backgroundColor: filter === f ? '#F49EBA' : '#eee',
            color: filter === f ? '#fff' : '#000', fontSize: '0.85rem'
          }}>
            {f === 'doLater' ? 'Do Later' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Add Task Form */}
      {showAddTask && (
        <div style={formStyle}>
          <select
            value={selectedDividerId ?? ''}
            onChange={e => setSelectedDividerId(Number(e.target.value))}
            style={inputStyle}
          >
            {dividers.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
          <input placeholder="Task name" value={newTaskName} onChange={e => setNewTaskName(e.target.value)} style={inputStyle} onKeyDown={e => e.key === 'Enter' && addTask()} />
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={addTask} style={btnStyle('#000', '#fff')}>Add</button>
            <button onClick={() => setShowAddTask(false)} style={btnStyle('#eee', '#000')}>Cancel</button>
          </div>
        </div>
      )}

      {/* Add Divider Form */}
      {showAddDivider && (
        <div style={formStyle}>
          <input placeholder="Divider name" value={newDividerName} onChange={e => setNewDividerName(e.target.value)} style={inputStyle} onKeyDown={e => e.key === 'Enter' && addDivider()} />
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={addDivider} style={btnStyle('#000', '#fff')}>Add</button>
            <button onClick={() => setShowAddDivider(false)} style={btnStyle('#eee', '#000')}>Cancel</button>
          </div>
        </div>
      )}

      {/* Empty state */}
      {dividers.length === 0 && (
        <p style={{ color: '#bbb', textAlign: 'center', marginTop: '40px' }}>
          No dividers yet — click "+ Add Divider" to get started!
        </p>
      )}

      {/* Dividers and Tasks */}
      {filteredDividers.map(divider => (
        <div key={divider.id} style={{ marginBottom: '24px' }}>
          <div style={{ fontWeight: 'bold', fontSize: '1.1rem', borderBottom: '2px solid #eee', paddingBottom: '6px', marginBottom: '10px' }}>
            {divider.name}
          </div>
          {divider.tasks.length === 0 && <p style={{ color: '#bbb', fontSize: '0.9rem' }}>No tasks yet</p>}
          {divider.tasks.map(task => (
            <div
              key={task.id}
              onMouseEnter={() => setHoveredTaskId(task.id)}
              onMouseLeave={() => setHoveredTaskId(null)}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', borderRadius: '8px', marginBottom: '6px', backgroundColor: hoveredTaskId === task.id ? '#f0f0f0' : '#fafafa', transition: 'background-color 0.15s' }}
            >
<div
  onClick={() => completeTask(divider, task)}
  style={{
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    border: '2px solid #ccc',
    cursor: 'pointer',
    flexShrink: 0,
    backgroundColor: 'transparent',
  }}
/>              <span style={{ flex: 1 }}>{task.name}</span>
              {task.tag && (
                <span style={{ padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', backgroundColor: tagColors[task.tag], color: '#fff' }}>
                  {task.tag === 'doLater' ? 'Do Later' : task.tag}
                </span>
              )}
              <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                {(['priority', 'lengthy', 'quick', 'doLater'] as TaskTag[]).map(tag => (
                  <button key={tag} onClick={() => tagTask(divider.id, task.id, tag)} title={tag ?? ''} style={{ width: '10px', height: '10px', borderRadius: '50%', border: 'none', cursor: 'pointer', backgroundColor: tagColors[tag ?? ''], opacity: task.tag === tag ? 1 : 0.3 }} />
                ))}
                <button
                  onClick={() => deleteTask(divider.id, task.id)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999', fontSize: '0.85rem', opacity: hoveredTaskId === task.id ? 1 : 0, transition: 'opacity 0.15s', padding: '0 4px' }}
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

const btnStyle = (bg: string, color: string) => ({
  padding: '6px 14px', borderRadius: '8px', border: 'none',
  cursor: 'pointer', backgroundColor: bg, color
});

const formStyle: React.CSSProperties = {
  backgroundColor: '#f9f9f9', padding: '16px', borderRadius: '10px',
  marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px'
};

const inputStyle: React.CSSProperties = {
  padding: '8px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '1rem'
};