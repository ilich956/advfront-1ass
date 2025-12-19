import { Trash2, GripVertical } from 'lucide-react';
import { useProjectManager } from '../context/ProjectContext';

export function Task({ task, projectId }) {
  const { deleteTask, moveTask, state } = useProjectManager();

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 flex-1">
          <GripVertical className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <h4 className="font-medium text-gray-900 break-words">{task.title}</h4>
        </div>
        <button
          onClick={() => deleteTask(projectId, task.id)}
          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded transition-colors flex-shrink-0"
          aria-label="Delete task"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      
      {task.description && (
        <p className="text-sm text-gray-600 mb-3 break-words">{task.description}</p>
      )}
      
      <div className="flex gap-1 flex-wrap">
        {state.projects
          .filter(p => p.id !== projectId)
          .map(project => (
            <button
              key={project.id}
              onClick={() => moveTask(projectId, project.id, task.id)}
              className="text-xs px-2 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded transition-colors"
            >
              Move to {project.name}
            </button>
          ))}
      </div>
    </div>
  );
}

