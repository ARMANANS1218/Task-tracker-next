import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import TaskForm from '../components/TaskForm';
import TaskFilters from '../components/TaskFilters';
import TaskList from '../components/TaskList';
import Notification from '../components/Notification';

export default function Home() {
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ message: '', type: '' });

  
  const status = router.query.status || 'all';
  const search = router.query.search || '';

  
  const updateFilters = (newStatus, newSearch) => {
    const query = {};
    if (newStatus && newStatus !== 'all') query.status = newStatus;
    if (newSearch) query.search = newSearch;

    router.push(
      {
        pathname: '/',
        query,
      },
      undefined,
      { shallow: true }
    );
  };

  const handleStatusChange = (newStatus) => {
    updateFilters(newStatus, search);
  };

  const handleSearchChange = (newSearch) => {
    updateFilters(status, newSearch);
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
  };

  const closeNotification = () => {
    setNotification({ message: '', type: '' });
  };

  const fetchTasks = async () => {
    try {
      const params = new URLSearchParams();
      if (status && status !== 'all') params.append('status', status);
      if (search) params.append('search', search);

      const response = await fetch(`/api/tasks?${params.toString()}`);
      const data = await response.json();

      if (response.ok) {
        setTasks(data.tasks);
      } else {
        showNotification(data.error || 'Failed to fetch tasks', 'error');
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      showNotification('Network error. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  
  useEffect(() => {
    if (router.isReady) {
      fetchTasks();
    }
  }, [router.isReady, status, search]);

  const handleTaskCreated = (newTask, message) => {
    setTasks(prevTasks => [newTask, ...prevTasks]);
    showNotification(message);
  };

  const handleTaskUpdate = (updatedTask, message) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === updatedTask.id ? updatedTask : task
      )
    );
    showNotification(message);
  };

  const handleTaskDelete = (taskId, message) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    showNotification(message);
  };

  const handleError = (errorMessage) => {
    showNotification(errorMessage, 'error');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading tasks...</p>

        <style jsx>{`
          .loading-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 50vh;
            gap: 1rem;
          }

          .loading-spinner {
            width: 40px;
            height: 40px;
            border: 4px solid #f3f3f3;
            border-top: 4px solid #007bff;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Mini Task Tracker</title>
        <meta name="description" content="A simple and efficient task tracking application" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="container">
        <header className="header">
          <h1>Mini Task Tracker</h1>
          <p>Stay organized and productive with your tasks</p>
        </header>

        <main className="main">
          <TaskForm
            onTaskCreated={handleTaskCreated}
            onError={handleError}
          />

          <TaskFilters
            status={status}
            search={search}
            onStatusChange={handleStatusChange}
            onSearchChange={handleSearchChange}
          />

          <TaskList
            tasks={tasks}
            onTaskUpdate={handleTaskUpdate}
            onTaskDelete={handleTaskDelete}
            onError={handleError}
          />
        </main>
      </div>

      <Notification
        message={notification.message}
        type={notification.type}
        onClose={closeNotification}
      />

      <style jsx global>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        html {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto',
            'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans',
            'Helvetica Neue', sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        body {
          background-color: #f8f9fa;
          color: #495057;
          line-height: 1.6;
        }

        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem 1rem;
          min-height: 100vh;
        }

        .header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .header h1 {
          font-size: 2.5rem;
          color: #343a40;
          margin-bottom: 0.5rem;
        }

        .header p {
          font-size: 1.1rem;
          color: #6c757d;
        }

        .main {
          max-width: 100%;
        }

        @media (max-width: 768px) {
          .container {
            padding: 1rem 0.5rem;
          }

          .header h1 {
            font-size: 2rem;
          }

          .header {
            margin-bottom: 2rem;
          }
        }

        /* Focus styles for accessibility */
        button:focus,
        input:focus,
        textarea:focus,
        select:focus {
          outline: 2px solid #007bff;
          outline-offset: 2px;
        }

        /* Skip link for screen readers */
        .skip-link {
          position: absolute;
          top: -40px;
          left: 6px;
          background: #007bff;
          color: white;
          padding: 8px;
          text-decoration: none;
          z-index: 1000;
        }

        .skip-link:focus {
          top: 6px;
        }
      `}</style>
    </>
  );
}
