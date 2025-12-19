import { createContext, useContext, useReducer, useEffect } from 'react';

export const ProjectContext = createContext(null);

const initialState = {
  projects: [
    {
      id: 'p1',
      name: 'To Do',
      tasks: []
    },
    {
      id: 'p2',
      name: 'In Progress',
      tasks: []
    },
    {
      id: 'p3',
      name: 'Done',
      tasks: []
    }
  ]
};

export const ACTIONS = {
  ADD_TASK: 'ADD_TASK',
  DELETE_TASK: 'DELETE_TASK',
  MOVE_TASK: 'MOVE_TASK',
  LOAD_STATE: 'LOAD_STATE'
};

export function projectReducer(state, action) {
  switch (action.type) {
    case ACTIONS.ADD_TASK: {
      const { projectId, task } = action.payload;
      return {
        ...state,
        projects: state.projects.map(project =>
          project.id === projectId
            ? {
                ...project,
                tasks: [...project.tasks, { ...task, id: `task-${Date.now()}` }]
              }
            : project
        )
      };
    }

    case ACTIONS.DELETE_TASK: {
      const { projectId, taskId } = action.payload;
      return {
        ...state,
        projects: state.projects.map(project =>
          project.id === projectId
            ? {
                ...project,
                tasks: project.tasks.filter(task => task.id !== taskId)
              }
            : project
        )
      };
    }

    case ACTIONS.MOVE_TASK: {
      const { fromProjectId, toProjectId, taskId } = action.payload;
      
      let taskToMove = null;
      const updatedProjects = state.projects.map(project => {
        if (project.id === fromProjectId) {
          taskToMove = project.tasks.find(task => task.id === taskId);
          return {
            ...project,
            tasks: project.tasks.filter(task => task.id !== taskId)
          };
        }
        return project;
      });

      return {
        ...state,
        projects: updatedProjects.map(project =>
          project.id === toProjectId && taskToMove
            ? {
                ...project,
                tasks: [...project.tasks, taskToMove]
              }
            : project
        )
      };
    }

    case ACTIONS.LOAD_STATE: {
      return action.payload;
    }

    default:
      return state;
  }
}

export function useProjectManager() {
  const context = useContext(ProjectContext);
  
  if (!context) {
    throw new Error('useProjectManager must be used within ProjectProvider');
  }

  const { state, dispatch } = context;

  const addTask = (projectId, taskTitle, taskDescription) => {
    if (!taskTitle.trim()) {
      return false;
    }

    const task = {
      title: taskTitle.trim(),
      description: taskDescription.trim(),
      createdAt: new Date().toISOString()
    };

    dispatch({
      type: ACTIONS.ADD_TASK,
      payload: { projectId, task }
    });

    return true;
  };

  const deleteTask = (projectId, taskId) => {
    dispatch({
      type: ACTIONS.DELETE_TASK,
      payload: { projectId, taskId }
    });
  };

  const moveTask = (fromProjectId, toProjectId, taskId) => {
    if (fromProjectId === toProjectId) {
      return;
    }

    dispatch({
      type: ACTIONS.MOVE_TASK,
      payload: { fromProjectId, toProjectId, taskId }
    });
  };

  const loadState = (savedState) => {
    dispatch({
      type: ACTIONS.LOAD_STATE,
      payload: savedState
    });
  };

  return {
    state,
    addTask,
    deleteTask,
    moveTask,
    loadState
  };
}

export function ProjectProvider({ children }) {
  const [state, dispatch] = useReducer(projectReducer, initialState);

  useEffect(() => {
    const savedState = localStorage.getItem('projectBoardState');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        dispatch({ type: ACTIONS.LOAD_STATE, payload: parsed });
      } catch (error) {
        console.error('Failed to load state from localStorage:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('projectBoardState', JSON.stringify(state));
  }, [state]);

  return (
    <ProjectContext.Provider value={{ state, dispatch }}>
      {children}
    </ProjectContext.Provider>
  );
}

