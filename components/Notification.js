import { useEffect, useState } from 'react';

export default function Notification({ message, type, onClose }) {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000); // Auto-close after 5 sec

      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className={`notification ${type}`}>
      <span className="notification-message">{message}</span>
      <button
        onClick={onClose}
        className="notification-close"
        aria-label="Close notification"
      >
        ×
      </button>

      <style jsx>{`
        .notification {
          position: fixed;
          top: 20px;
          right: 20px;
          padding: 1rem 1.5rem;
          border-radius: 4px;
          display: flex;
          align-items: center;
          gap: 1rem;
          max-width: 400px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          z-index: 1000;
          animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .notification.success {
          background-color: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }

        .notification.error {
          background-color: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }

        .notification-message {
          flex: 1;
          font-weight: 500;
        }

        .notification-close {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: inherit;
          opacity: 0.7;
          line-height: 1;
          padding: 0;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .notification-close:hover {
          opacity: 1;
        }

        .notification-close:focus {
          outline: none;
          opacity: 1;
        }

        @media (max-width: 768px) {
          .notification {
            left: 20px;
            right: 20px;
            max-width: none;
          }
        }
      `}</style>
    </div>
  );
}
