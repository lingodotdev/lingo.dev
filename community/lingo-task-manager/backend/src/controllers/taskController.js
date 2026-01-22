import { TaskModel } from '../models/Task.js';
import { translations } from '../middleware/i18n.js';

export const taskController = {
  getAllTasks: (req, res) => {
    const lang = req.headers['accept-language']?.split(',')[0]?.substring(0, 2) || 'en';
    const tasks = TaskModel.getAll();
    res.json({
      message: translations[lang]?.success || translations.en.success,
      data: tasks
    });
  },

  getTaskById: (req, res) => {
    const lang = req.headers['accept-language']?.split(',')[0]?.substring(0, 2) || 'en';
    const task = TaskModel.getById(req.params.id);
    
    if (!task) {
      return res.status(404).json({
        error: translations[lang]?.taskNotFound || translations.en.taskNotFound
      });
    }
    
    res.json({ data: task });
  },

  createTask: (req, res) => {
    const lang = req.headers['accept-language']?.split(',')[0]?.substring(0, 2) || 'en';
    const { title, description, priority } = req.body;
    
    if (!title) {
      return res.status(400).json({
        error: translations[lang]?.titleRequired || translations.en.titleRequired
      });
    }
    
    const task = TaskModel.create({ title, description, priority });
    res.status(201).json({
      message: translations[lang]?.taskCreated || translations.en.taskCreated,
      data: task
    });
  },

  updateTask: (req, res) => {
    const lang = req.headers['accept-language']?.split(',')[0]?.substring(0, 2) || 'en';
    const task = TaskModel.update(req.params.id, req.body);
    
    if (!task) {
      return res.status(404).json({
        error: translations[lang]?.taskNotFound || translations.en.taskNotFound
      });
    }
    
    res.json({
      message: translations[lang]?.taskUpdated || translations.en.taskUpdated,
      data: task
    });
  },

  deleteTask: (req, res) => {
    const lang = req.headers['accept-language']?.split(',')[0]?.substring(0, 2) || 'en';
    const deleted = TaskModel.delete(req.params.id);
    
    if (!deleted) {
      return res.status(404).json({
        error: translations[lang]?.taskNotFound || translations.en.taskNotFound
      });
    }
    
    res.json({
      message: translations[lang]?.taskDeleted || translations.en.taskDeleted
    });
  }
};