import { ActivityFeed } from '@/components/activity-feed';
import { ProjectCard } from '@/components/project-card';
import { mockProjects, mockActivity } from '@/lib/mock-data';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">ClawCortex</h1>
          <p className="text-sm text-muted-foreground">
            AI Agent Workspace Dashboard
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Activity Feed */}
          <div className="lg:col-span-2">
            <ActivityFeed activities={mockActivity} />
          </div>

          {/* Right: Projects */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Projects</h2>
            {mockProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
