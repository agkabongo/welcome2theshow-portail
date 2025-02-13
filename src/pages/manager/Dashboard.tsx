
import { useState } from "react";
import { Users, Calendar, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ArtistOverview = {
  id: number;
  name: string;
  upcomingMilestone?: {
    title: string;
    date: string;
    category: "release" | "performance" | "award";
  };
  tasksCompleted: number;
  totalTasks: number;
  lastActivity: string;
};

const initialArtists: ArtistOverview[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    upcomingMilestone: {
      title: "Album Release",
      date: "2024-06-15",
      category: "release"
    },
    tasksCompleted: 8,
    totalTasks: 12,
    lastActivity: "2024-03-15"
  },
  {
    id: 2,
    name: "Mike Chen",
    upcomingMilestone: {
      title: "Stadium Tour",
      date: "2024-07-20",
      category: "performance"
    },
    tasksCompleted: 5,
    totalTasks: 10,
    lastActivity: "2024-03-14"
  },
];

const ManagerDashboard = () => {
  const [artists] = useState<ArtistOverview[]>(initialArtists);

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Manager Dashboard</h1>
            <p className="text-muted-foreground">
              Overview of all artists' milestones and tasks
            </p>
          </div>
          <Button className="flex items-center gap-2">
            <Users size={18} />
            Add Artist
          </Button>
        </div>

        <div className="grid gap-6">
          {artists.map((artist) => (
            <div
              key={artist.id}
              className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold">{artist.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    Last active: {new Date(artist.lastActivity).toLocaleDateString()}
                  </p>
                </div>
                <Button variant="outline" size="sm">View Details</Button>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Calendar size={16} className="text-primary" />
                    Upcoming Milestone
                  </h3>
                  {artist.upcomingMilestone ? (
                    <div>
                      <span className={cn(
                        "px-2 py-1 rounded-full text-xs mb-2 inline-block",
                        artist.upcomingMilestone.category === "release" && "bg-blue-100 text-blue-700",
                        artist.upcomingMilestone.category === "performance" && "bg-green-100 text-green-700",
                        artist.upcomingMilestone.category === "award" && "bg-purple-100 text-purple-700"
                      )}>
                        {artist.upcomingMilestone.category}
                      </span>
                      <p className="font-medium">{artist.upcomingMilestone.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(artist.upcomingMilestone.date).toLocaleDateString()}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No upcoming milestones</p>
                  )}
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <CheckCircle size={16} className="text-primary" />
                    Task Progress
                  </h3>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{
                          width: `${(artist.tasksCompleted / artist.totalTasks) * 100}%`
                        }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {artist.tasksCompleted}/{artist.totalTasks}
                    </span>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <XCircle size={16} className="text-primary" />
                    Pending Tasks
                  </h3>
                  <p className="text-2xl font-semibold">
                    {artist.totalTasks - artist.tasksCompleted}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
