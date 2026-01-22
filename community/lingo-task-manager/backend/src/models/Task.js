let tasks = [];
let nextId = 1;

export class Task {
  constructor(title, description, priority = 'medium') {
    this.id = String(nextId++);
    this.title = title;
    this.description = description;
    this.priority = priority;
    this.completed = false;
    this.createdAt = new Date().toISOString();
  }
}

export const TaskModel = {
  getAll: () => tasks,
  
  getById: (id) => tasks.find(task => task.id === id),
  
  create: (taskData) => {
    const task = new Task(taskData.title, taskData.description, taskData.priority);
    tasks.push(task);
    return task;
  },
  
  update: (id, updates) => {
    const index = tasks.findIndex(task => task.id === id);
    if (index === -1) return null;
    tasks[index] = { ...tasks[index], ...updates };
    return tasks[index];
  },
  
  delete: (id) => {
    const index = tasks.findIndex(task => task.id === id);
    if (index === -1) return false;
    tasks.splice(index, 1);
    return true;
  }
};