// pages/api/tasks.js

let tasks = {
    pending: [],
    ongoing: [],
    completed: []
  };
  
  export default function handler(req, res) {
    if (req.method === 'GET') {
      // Fetch all tasks
      res.status(200).json(tasks);
    } else if (req.method === 'POST') {
      try {
        const { pending, ongoing, completed } = req.body;
  
        // Update tasks
        tasks = { pending, ongoing, completed };
  
        res.status(200).json({ message: 'Tasks updated successfully', tasks });
      } catch (error) {
        res.status(400).json({ message: 'Invalid request body' });
      }
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  }
  