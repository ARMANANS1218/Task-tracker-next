# Mini Task Tracker

A simple and efficient task tracking web application built with Next.js.

## Features

- ✅ Create tasks with title and optional description
- 🔍 Search tasks by title or description (case-insensitive)
- 📊 Filter tasks by status (All, Active, Completed)
- ✏️ Toggle task completion status
- 🗑️ Delete tasks with confirmation
- 🔗 URL query parameters persistence for filters and search
- 📱 Responsive design with mobile support
- ♿ Accessibility features (keyboard navigation, screen reader support)
- 💬 User feedback with success/error notifications
- ⚡ Real-time updates without page refresh

## Tech Stack

- **Frontend**: Next.js 14, React 18
- **Backend**: Next.js API Routes
- **Storage**: In-memory (no database required)
- **Styling**: CSS-in-JS with styled-jsx

## Getting Started

### Prerequisites

- Node.js 16.8 or later
- npm or yarn

### Installation

1. Clone the repository or extract the project files
2. Navigate to the project directory:
   ```bash
   cd mini-task-tracker
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
mini-task-tracker/
├── components/
│   ├── TaskForm.js          # Task creation form
│   ├── TaskFilters.js       # Status filter and search
│   ├── TaskList.js          # Task display and actions
│   └── Notification.js      # Success/error messages
├── pages/
│   ├── api/
│   │   └── tasks.js         # API routes for CRUD operations
│   ├── _app.js              # App component wrapper
│   └── index.js             # Main page
├── styles/
│   └── globals.css          # Global styles
├── package.json
└── next.config.js
```

## API Endpoints

### GET /api/tasks
Retrieve tasks with optional filtering
- Query parameters:
  - `status`: 'all', 'active', or 'completed'
  - `search`: search term for title/description

### POST /api/tasks
Create a new task
- Body: `{ title: string, description?: string }`

### PUT /api/tasks?id={taskId}
Update an existing task
- Body: `{ title?: string, description?: string, done?: boolean }`

### DELETE /api/tasks?id={taskId}
Delete a task

## Features in Detail

### Task Management
- Tasks have id, title, description, done status, and creation timestamp
- Title is required (max 100 characters)
- Description is optional (max 500 characters)
- Automatic validation with user-friendly error messages

### Filtering and Search
- Filter by completion status
- Case-insensitive search across title and description
- URL persistence - refresh the page and keep your filters

### User Experience
- Responsive design works on mobile and desktop
- Loading states for all async operations
- Confirmation dialogs for destructive actions
- Auto-dismissing notifications
- Keyboard accessible interface

### Data Storage
- In-memory storage (resets on server restart)
- No database setup required
- Suitable for development and demonstration

## Browser Support

- Modern browsers with ES6+ support
- Chrome, Firefox, Safari, Edge

## License

This project is open source and available under the [MIT License](LICENSE).
