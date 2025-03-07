"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const TaskTracker = () => {
  const [tasks, setTasks] = useState({ pending: [], ongoing: [], completed: [] });
  const [newTask, setNewTask] = useState('');
  const [timer, setTimer] = useState(0);
  const [running, setRunning] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [completionTime, setCompletionTime] = useState(0);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(0);

  useEffect(() => {
    const fetchTasks = async () => {
      const res = await fetch('/api/tasks');
      const data = await res.json();
      setTasks(data);
    };
    fetchTasks();
  }, []);

  const addTask = () => {
    if (newTask.trim()) {
      const updatedTasks = { ...tasks, pending: [...tasks.pending, newTask] };
      setTasks(updatedTasks);
      setNewTask('');
    }
  };

  const moveTask = (task, from, to) => {
    const updatedTasks = {
      ...tasks,
      [from]: tasks[from].filter((t) => t !== task),
      [to]: [...tasks[to], task],
    };
    setTasks(updatedTasks);

    if (from === 'ongoing' && to === 'completed') {
      clearInterval(intervalRef.current);
      setRunning(false);
      setCompletionTime(timer);
      setOpenSnackbar(true);
      setTimer(0);
    } else if (from === 'pending' && to === 'ongoing') {
      startTimer();
    }
  };

  const startTimer = () => {
    startTimeRef.current = Date.now() - timer * 1000;
    intervalRef.current = setInterval(() => {
      setTimer(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);
    setRunning(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  // Animation Variants for Chibi Cat
  const catVariants = {
    idle: { scale: 1, rotate: 0 },
    running: { scale: [1, 1.05, 1], transition: { repeat: Infinity, duration: 1 } },
   
  };

  // Animation Variants for Task Card Bounce
  const cardVariants = {
    initial: { y: 0, rotate: 0 },
    move: { y: [-10, 0], rotate: [2, -2, 0], transition: { duration: 0.5 } },
  };

  return (
    <div className="bg-amber-100 w-screen min-h-screen p-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {['pending', 'ongoing', 'completed'].map((status) => (
            <div key={status} className="bg-white rounded-xl shadow-lg p-4">
              <h2 className="text-xl font-bold mb-4 capitalize text-black">{status}</h2>
              <div className="flex flex-col gap-3 text-black">
                {tasks[status]?.map((task, index) => (
                  <motion.div
                    key={index}
                    variants={cardVariants}
                    initial="initial"
                    animate="move"
                    className="flex justify-between items-center p-3 border border-black rounded-lg"
                  >
                    <span>{task}</span>
                    {status !== 'completed' && (
                      <button
                        className={`px-3 py-1 rounded-full text-black ${status === 'pending' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-green-500 hover:bg-green-600'
                          }`}
                        onClick={() => moveTask(task, status, status === 'pending' ? 'ongoing' : 'completed')}
                      >
                        {status === 'pending' ? 'Start' : 'Complete'}
                      </button>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex gap-4">
          <input
            type="text"
            placeholder="Add a new task"
            className="w-full p-3 shadow-lg border text-black border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <button
            className="px-4 py-2 shadow-lg bg-amber-500 text-white rounded-lg hover:bg-amber-600"
            onClick={addTask}
          >
            Add Task
          </button>
        </div>

        <div className="mt-6 flex items-center gap-4">
          {/* Chibi Cat Animation */}
          <motion.div
            variants={catVariants}
            initial="idle"
            animate={running ? 'running' : tasks.completed.length > 0 ? 'completed' : 'idle'}
            className="w-20 h-20 bg-cover p-4"
            style={{ backgroundImage: "url('/cat-placeholder.jpg')" }}
          />
          <h3 className="text-5xl text-black">Timer: {timer}s</h3>
        </div>
      </div>


      {openSnackbar && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white p-4 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in">
          <span>Hurray! You completed the task in {completionTime} seconds.</span>
          <button className="text-white font-bold" onClick={handleCloseSnackbar}>
            ×
          </button>
        </div>
      )}
    </div>
  );
};

export default TaskTracker;