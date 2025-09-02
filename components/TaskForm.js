import { useState } from 'react';

export default function TaskForm({ onTaskCreated, onError }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setTitle('');
        setDescription('');
        onTaskCreated?.(data.task, data.message);
      } else {
        onError?.(data.error || 'Failed to create task');
      }
    } catch (error) {
      console.error('Error creating task:', error);
      onError?.('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <div className="form-group">
        <label htmlFor="task-title" className="form-label">
          Task Title *
        </label>
        <input
          id="task-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task title..."
          maxLength={100}
          required
          disabled={isSubmitting}
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label htmlFor="task-description" className="form-label">
          Description (optional)
        </label>
        <textarea
          id="task-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter task description..."
          maxLength={500}
          rows={3}
          disabled={isSubmitting}
          className="form-textarea"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting || !title.trim()}
        className="submit-button"
      >
        {isSubmitting ? 'Creating...' : 'Create Task'}
      </button>

      <style jsx>{`
        .task-form {
          background: #f8f9fa;
          padding: 1.5rem;
          border-radius: 8px;
          border: 1px solid #e9ecef;
          margin-bottom: 2rem;
        }

        .form-group {
          margin-bottom: 1rem;
        }

        .form-label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: #495057;
        }

        .form-input,
        .form-textarea {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ced4da;
          border-radius: 4px;
          font-size: 1rem;
          transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
        }

        .form-input:focus,
        .form-textarea:focus {
          outline: none;
          border-color: #007bff;
          box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
        }

        .form-input:disabled,
        .form-textarea:disabled {
          background-color: #e9ecef;
          opacity: 1;
        }

        .form-textarea {
          resize: vertical;
          min-height: 80px;
        }

        .submit-button {
          background-color: #007bff;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 4px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.15s ease-in-out;
        }

        .submit-button:hover:not(:disabled) {
          background-color: #0056b3;
        }

        .submit-button:disabled {
          background-color: #6c757d;
          cursor: not-allowed;
        }

        .submit-button:focus {
          outline: none;
          box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.5);
        }
      `}</style>
    </form>
  );
}
