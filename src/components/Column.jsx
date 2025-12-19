import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useProjectManager } from '../context/ProjectContext';
import { Task } from './Task';

export function Column({ project }) {
  const { addTask } = useProjectManager();
  const [isAdding, setIsAdding] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');

  const handleAddTask = () => {
    if (addTask(project.id, newTaskTitle, newTaskDescription)) {
      setNewTaskTitle('');
      setNewTaskDescription('');
      setIsAdding(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddTask();
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4 min-w-[300px] flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg text-gray-800">{project.name}</h3>
        <span className="bg-gray-200 text-gray-700 text-xs font-semibold px-2 py-1 rounded-full">
          {project.tasks.length}
        </span>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto mb-3">
        {project.tasks.map(task => (
          <Task key={task.id} task={task} projectId={project.id} />
        ))}
        
        {project.tasks.length === 0 && !isAdding && (
          <div className="text-center py-8 text-gray-400 text-sm">
            No tasks yet. Add one below!
          </div>
        )}
      </div>

      {isAdding ? (
        <div className="bg-white p-3 rounded-lg border-2 border-blue-300 shadow-sm">
          <input
            type="text"
            placeholder="Task title..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full px-2 py-1 mb-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
          <textarea
            placeholder="Description (optional)..."
            value={newTaskDescription}
            onChange={(e) => setNewTaskDescription(e.target.value)}
            className="w-full px-2 py-1 mb-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows="2"
          />
          <div className="flex gap-2">
            <button
              onClick={handleAddTask}
              className="flex-1 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors text-sm font-medium"
            >
              Add Task
            </button>
            <button
              onClick={() => {
                setIsAdding(false);
                setNewTaskTitle('');
                setNewTaskDescription('');
              }}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="w-full flex items-center justify-center gap-2 p-3 bg-white hover:bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg transition-colors text-gray-600 hover:text-gray-800"
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium">Add Task</span>
        </button>
      )}
    </div>
  );
}

