import { useState } from 'react';

export default function TaskList({ tasks, onTaskUpdate, onTaskDelete, onError }) {
  const [updatingTasks, setUpdatingTasks] = useState(new Set());

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const handleToggleTask = async (task) => {
    if (updatingTasks.has(task.id)) return;

    setUpdatingTasks(prev => new Set(prev).add(task.id));

    try {
      const response = await fetch(`/api/tasks?id=${task.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          done: !task.done,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        onTaskUpdate?.(data.task, data.message);
      } else {
        onError?.(data.error || 'Failed to update task');
      }
    } catch (error) {
      console.error('Error updating task:', error);
      onError?.('Network error. Please try again.');
    } finally {
      setUpdatingTasks(prev => {
        const newSet = new Set(prev);
        newSet.delete(task.id);
        return newSet;
      });
    }
  };

  const handleDeleteTask = async (task) => {
    if (updatingTasks.has(task.id)) return;

    if (!confirm(`Are you sure you want to delete "${task.title}"?`)) {
      return;
    }

    setUpdatingTasks(prev => new Set(prev).add(task.id));

    try {
      const response = await fetch(`/api/tasks?id=${task.id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        onTaskDelete?.(task.id, data.message);
      } else {
        onError?.(data.error || 'Failed to delete task');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      onError?.('Network error. Please try again.');
    } finally {
      setUpdatingTasks(prev => {
        const newSet = new Set(prev);
        newSet.delete(task.id);
        return newSet;
      });
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <p>No tasks found. Create your first task above!</p>
        <style jsx>{`
          .empty-state {
            text-align: center;
            padding: 3rem 1rem;
            color: #6c757d;
            font-size: 1.1rem;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="task-list">
      <h2>Tasks ({tasks.length})</h2>
      {tasks.map((task) => (
        <div key={task.id} className={`task-item ${task.done ? 'completed' : ''}`}>
          <div className="task-content">
            <div className="task-header">
              <h3 className="task-title">{task.title}</h3>
              <span className={`task-status ${task.done ? 'done' : 'pending'}`}>
                {task.done ? 'Completed' : 'Active'}
              </span>
            </div>
            
            {task.description && (
              <p className="task-description">{task.description}</p>
            )}
            
            <div className="task-meta">
              <span className="task-date">
                Created: {formatDate(task.createdAt)}
              </span>
            </div>
          </div>

          <div className="task-actions">
            <button
              onClick={() => handleToggleTask(task)}
              disabled={updatingTasks.has(task.id)}
              className={`toggle-button ${task.done ? 'mark-active' : 'mark-done'}`}
              aria-label={task.done ? 'Mark as active' : 'Mark as completed'}
            >
              {updatingTasks.has(task.id) 
                ? '...' 
                : task.done 
                  ? 'Mark Active' 
                  : 'Mark Done'
              }
            </button>
            
            <button
              onClick={() => handleDeleteTask(task)}
              disabled={updatingTasks.has(task.id)}
              className="delete-button"
              aria-label={`Delete task: ${task.title}`}
            >
              {updatingTasks.has(task.id) ? '...' : 'Delete'}
            </button>
          </div>
        </div>
      ))}

      <style jsx>{`
        .task-list h2 {
          margin-bottom: 1rem;
          color: #495057;
        }

        .task-item {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 1.5rem;
          margin-bottom: 1rem;
          background: white;
          border: 1px solid #e9ecef;
          border-radius: 8px;
          transition: box-shadow 0.15s ease-in-out;
        }

        .task-item:hover {
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .task-item.completed {
          opacity: 0.8;
          background: #f8f9fa;
        }

        .task-content {
          flex: 1;
          margin-right: 1rem;
        }

        .task-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.5rem;
          gap: 1rem;
        }

        .task-title {
          margin: 0;
          font-size: 1.2rem;
          color: #495057;
          flex: 1;
        }

        .task-item.completed .task-title {
          text-decoration: line-through;
          color: #6c757d;
        }

        .task-status {
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 600;
          white-space: nowrap;
        }

        .task-status.done {
          background-color: #d4edda;
          color: #155724;
        }

        .task-status.pending {
          background-color: #fff3cd;
          color: #856404;
        }

        .task-description {
          margin: 0.5rem 0;
          color: #6c757d;
          line-height: 1.5;
        }

        .task-item.completed .task-description {
          text-decoration: line-through;
        }

        .task-meta {
          font-size: 0.9rem;
          color: #6c757d;
        }

        .task-actions {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          min-width: 100px;
        }

        .toggle-button,
        .delete-button {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 4px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.15s ease-in-out;
        }

        .toggle-button:disabled,
        .delete-button:disabled {
          cursor: not-allowed;
          opacity: 0.6;
        }

        .toggle-button.mark-done {
          background-color: #28a745;
          color: white;
        }

        .toggle-button.mark-done:hover:not(:disabled) {
          background-color: #218838;
        }

        .toggle-button.mark-active {
          background-color: #ffc107;
          color: #212529;
        }

        .toggle-button.mark-active:hover:not(:disabled) {
          background-color: #e0a800;
        }

        .delete-button {
          background-color: #dc3545;
          color: white;
        }

        .delete-button:hover:not(:disabled) {
          background-color: #c82333;
        }

        .toggle-button:focus,
        .delete-button:focus {
          outline: none;
          box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.5);
        }

        @media (max-width: 768px) {
          .task-item {
            flex-direction: column;
            align-items: stretch;
          }

          .task-content {
            margin-right: 0;
            margin-bottom: 1rem;
          }

          .task-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }

          .task-actions {
            flex-direction: row;
            min-width: auto;
          }
        }
      `}</style>
    </div>
  );
}
