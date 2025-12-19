import { useProjectManager } from './context/ProjectContext';
import { Column } from './components/Column';
import { ProjectProvider } from './context/ProjectContext';

function App() {
  const { state } = useProjectManager();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Project Board</h1>
          <p className="text-gray-600">Manage your tasks efficiently with drag-and-drop columns</p>
        </header>

        <div className="flex gap-6 overflow-x-auto pb-4">
          {state.projects.map(project => (
            <Column key={project.id} project={project} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Root() {
  return (
    <ProjectProvider>
      <App />
    </ProjectProvider>
  );
}
