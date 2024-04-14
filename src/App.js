import React, { useState, useEffect } from 'react';

const ProjectBoard = () => {
  const [tasks, setTasks] = useState({
    todo: [],
    inProgress: [],
    done: []
  });

  const [selectedTask, setSelectedTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: ''
  });

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks'));
    if (storedTasks) {
      setTasks(storedTasks);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (status) => {
    setShowModal(true);
    setNewTask({ ...newTask, status });
  };

  const handleInputChange = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  const saveTask = () => {
    setTasks({ ...tasks, [newTask.status]: [...tasks[newTask.status], newTask] });
    setNewTask({ title: '', description: '', status: '' });
    setShowModal(false);
  };

  const deleteTask = (task) => {
    const updatedTasks = { ...tasks };
    const updatedStatusTasks = updatedTasks[task.status].filter(t => t.title !== task.title);
    updatedTasks[task.status] = updatedStatusTasks;
    setTasks(updatedTasks);
    setSelectedTask(null);
  };

  const updateStatus = (task, newStatus) => {
    const updatedTasks = { ...tasks };
    updatedTasks[task.status] = updatedTasks[task.status].filter(t => t.title !== task.title);
    updatedTasks[newStatus] = [...updatedTasks[newStatus], { ...task, status: newStatus }];
    setTasks(updatedTasks);
    setSelectedTask(null);
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-semibold mb-4 text-center underline mb-5">To-Do List</h1>
      <hr className='mb-5' />
      <div className="flex flex-wrap md:flex-no-wrap justify-center">
        {Object.keys(tasks).map(status => (
            <div key={status} className="w-full md:w-96 mb-8 md:mb-0 md:mr-4">
              <h2 className={status === 'todo' ? 'text-lg font-semibold mb-2 text-center text-red-600': status === 'inProgress' ? 'text-lg font-semibold mb-2 text-center text-yellow-600' : 'text-lg font-semibold mb-2 text-center  text-green-600'}>{status.toUpperCase()}</h2>
              <div className={status === 'todo' ? 'border border-gray-200 p-4 rounded mb-4 bg-red-300': status === 'inProgress' ? 'border border-gray-200 p-4 rounded mb-4 bg-yellow-300' : 'border border-gray-200 p-4 rounded mb-4 bg-green-300'}>
                {tasks[status].map((task, index) => (
                  <div key={task.title} className="border-b border-gray-200 py-2 flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{task.title}</p>
                      <p className="text-sm">{task.description}</p>
                    </div>
                    {(status === 'todo' && (
                      <div>
                        <button onClick={() => updateStatus(task, 'inProgress')} className="bg-yellow-500 text-white px-2 py-1 rounded mr-2">In Progress</button>
                        <button onClick={() => updateStatus(task, 'done')} className="bg-green-500 text-white px-2 py-1 rounded">Done</button>
                      </div>
                    )) || (status === 'inProgress' && (
                      <div>
                        <button onClick={() => updateStatus(task, 'done')} className="bg-green-500 text-white px-2 py-1 rounded">Done</button>
                      </div>
                    ))}
                    <button onClick={() => deleteTask(task)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
                  </div>
                ))}
                <button onClick={() => addTask(status)} className="mt-4 bg-blue-500 text-white px-2 py-1 rounded">New</button>
              </div>
              <p className="text-center">Tasks: {tasks[status].length}</p>
            </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-8 rounded-md">
            <h2 className="text-xl font-semibold mb-4">New Task</h2>
            <input
              type="text"
              name="title"
              value={newTask.title}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-md p-2 mb-4 w-full"
              placeholder="Title"
            />
            <textarea
              name="description"
              value={newTask.description}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-md p-2 mb-4 w-full"
              placeholder="Description"
            />
            <button onClick={saveTask} className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2">Save</button>
            <button onClick={() => setShowModal(false)} className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectBoard;
