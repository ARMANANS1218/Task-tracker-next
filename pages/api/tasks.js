
let tasks = [];
let nextId = 1;


function createTask(title, description = '') {
  const task = {
    id: nextId++,
    title: title.trim(),
    description: description.trim(),
    done: false,
    createdAt: new Date().toISOString()
  };
  tasks.push(task);
  return task;
}

function getAllTasks() {
  return tasks;
}

function getTaskById(id) {
  return tasks.find(task => task.id === parseInt(id));
}

function updateTask(id, updates) {
  const taskIndex = tasks.findIndex(task => task.id === parseInt(id));
  if (taskIndex === -1) return null;
  
  tasks[taskIndex] = { ...tasks[taskIndex], ...updates };
  return tasks[taskIndex];
}

function deleteTask(id) {
  const taskIndex = tasks.findIndex(task => task.id === parseInt(id));
  if (taskIndex === -1) return false;
  
  tasks.splice(taskIndex, 1);
  return true;
}

function validateTask(title, description = '') {
  const errors = [];
  
  if (!title || title.trim().length === 0) {
    errors.push('Title is required');
  } else if (title.trim().length > 100) {
    errors.push('Title must be 100 characters or less');
  }
  
  if (description && description.trim().length > 500) {
    errors.push('Description must be 500 characters or less');
  }
  
  return errors;
}

export default function handler(req, res) {
  const { method } = req;

  try {
    switch (method) {
      case 'GET':
        return handleGet(req, res);
      case 'POST':
        return handlePost(req, res);
      case 'PUT':
        return handlePut(req, res);
      case 'DELETE':
        return handleDelete(req, res);
      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

function handleGet(req, res) {
  const { status, search } = req.query;
  let filteredTasks = getAllTasks();

 
  if (status && status !== 'all') {
    if (status === 'active') {
      filteredTasks = filteredTasks.filter(task => !task.done);
    } else if (status === 'completed') {
      filteredTasks = filteredTasks.filter(task => task.done);
    }
  }

  
  if (search && search.trim()) {
    const searchTerm = search.trim().toLowerCase();
    filteredTasks = filteredTasks.filter(task =>
      task.title.toLowerCase().includes(searchTerm) ||
      task.description.toLowerCase().includes(searchTerm)
    );
  }

  
  filteredTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return res.status(200).json({ tasks: filteredTasks });
}

function handlePost(req, res) {
  const { title, description } = req.body;

  const validationErrors = validateTask(title, description);
  if (validationErrors.length > 0) {
    return res.status(400).json({ error: validationErrors.join(', ') });
  }

  const newTask = createTask(title, description);
  return res.status(201).json({ task: newTask, message: 'Task created successfully' });
}

function handlePut(req, res) {
  const { id } = req.query;
  const { title, description, done } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'Task ID is required' });
  }

  const task = getTaskById(id);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }


  if (title !== undefined || description !== undefined) {
    const validationErrors = validateTask(
      title !== undefined ? title : task.title,
      description !== undefined ? description : task.description
    );
    if (validationErrors.length > 0) {
      return res.status(400).json({ error: validationErrors.join(', ') });
    }
  }

  const updates = {};
  if (title !== undefined) updates.title = title.trim();
  if (description !== undefined) updates.description = description.trim();
  if (done !== undefined) updates.done = Boolean(done);

  const updatedTask = updateTask(id, updates);
  return res.status(200).json({ 
    task: updatedTask, 
    message: 'Task updated successfully' 
  });
}

function handleDelete(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Task ID is required' });
  }

  const deleted = deleteTask(id);
  if (!deleted) {
    return res.status(404).json({ error: 'Task not found' });
  }

  return res.status(200).json({ message: 'Task deleted successfully' });
}
