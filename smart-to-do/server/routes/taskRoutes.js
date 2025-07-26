import express from 'express';
import Task from '../models/Task.js';
const router = express.Router();
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});
router.post('/', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text?.trim()) {
      return res.status(400).json({ error: 'Task text is required' });
    }
    const newTask = new Task({ text });
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch {
    res.status(500).json({ error: 'Failed to create task' });
  }
});
router.put('/:id', async (req, res) => {
  try {
    const { text, completed } = req.body;
    const update = {};
    if (text !== undefined) update.text = text;
    if (completed !== undefined) update.completed = completed;

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: update },
      { new: true }
    );

    if (!updatedTask) return res.status(404).json({ error: 'Task not found' });

    res.json(updatedTask);
  } catch {
    res.status(500).json({ error: 'Failed to update task' });
  }
});
router.delete('/:id', async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) return res.status(404).json({ error: 'Task not found' });

    res.json({ message: 'Task deleted successfully' });
  } catch {
    res.status(500).json({ error: 'Failed to delete task' });
  }
});
export default router;
