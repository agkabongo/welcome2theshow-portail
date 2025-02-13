import { useState } from "react";
import { Users, Calendar, CheckCircle, XCircle, Plus, Image, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Milestone = {
  id: number;
  title: string;
  date: string;
  description: string;
  category: "release" | "performance" | "award";
};

type Task = {
  id: number;
  title: string;
  completed: boolean;
  relatedMilestoneId?: number;
};

type ArtistOverview = {
  id: number;
  name: string;
  email?: string;
  genre?: string;
  upcomingMilestone?: {
    title: string;
    date: string;
    category: "release" | "performance" | "award";
  };
  tasksCompleted: number;
  totalTasks: number;
  lastActivity: string;
  tasks: Task[];
  milestones: Milestone[];
  moodboardImages: string[];
};

const initialArtists: ArtistOverview[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah@example.com",
    genre: "Pop",
    upcomingMilestone: {
      title: "Album Release",
      date: "2024-06-15",
      category: "release"
    },
    tasksCompleted: 8,
    totalTasks: 12,
    lastActivity: "2024-03-15",
    tasks: [
      { id: 1, title: "Finalize album artwork", completed: false },
      { id: 2, title: "Book studio time", completed: true },
    ],
    milestones: [
      {
        id: 1,
        title: "Album Release",
        date: "2024-06-15",
        description: "Release debut album on major platforms",
        category: "release"
      }
    ],
    moodboardImages: ["/placeholder.svg"]
  },
  {
    id: 2,
    name: "Mike Chen",
    email: "mike@example.com",
    genre: "Rock",
    upcomingMilestone: {
      title: "Stadium Tour",
      date: "2024-07-20",
      category: "performance"
    },
    tasksCompleted: 5,
    totalTasks: 10,
    lastActivity: "2024-03-14",
    tasks: [
      { id: 3, title: "Contact venue management", completed: false },
    ],
    milestones: [],
    moodboardImages: []
  },
];

const ManagerDashboard = () => {
  const [artists, setArtists] = useState<ArtistOverview[]>(initialArtists);
  const [selectedArtist, setSelectedArtist] = useState<ArtistOverview | null>(null);
  const [newArtist, setNewArtist] = useState({ name: "", email: "", genre: "" });
  const [newTask, setNewTask] = useState({ title: "" });
  const [newMilestone, setNewMilestone] = useState({
    title: "",
    date: "",
    description: "",
    category: "release" as const
  });

  const handleAddArtist = () => {
    if (!newArtist.name || !newArtist.email) {
      toast.error("Please fill in all required fields");
      return;
    }

    const artist: ArtistOverview = {
      id: artists.length + 1,
      name: newArtist.name,
      email: newArtist.email,
      genre: newArtist.genre,
      tasksCompleted: 0,
      totalTasks: 0,
      lastActivity: new Date().toISOString().split('T')[0],
      tasks: [],
      milestones: [],
      moodboardImages: []
    };

    setArtists(prev => [...prev, artist]);
    setNewArtist({ name: "", email: "", genre: "" });
    toast.success("Artist added successfully");
  };

  const handleAddTask = (artistId: number) => {
    if (!newTask.title) {
      toast.error("Please enter a task title");
      return;
    }

    setArtists(prev => prev.map(artist => {
      if (artist.id === artistId) {
        const newTaskObj = {
          id: artist.tasks.length + 1,
          title: newTask.title,
          completed: false
        };
        return {
          ...artist,
          tasks: [...artist.tasks, newTaskObj],
          totalTasks: artist.totalTasks + 1
        };
      }
      return artist;
    }));

    setNewTask({ title: "" });
    toast.success("Task added successfully");
  };

  const handleToggleTask = (artistId: number, taskId: number) => {
    setArtists(prev => prev.map(artist => {
      if (artist.id === artistId) {
        const updatedTasks = artist.tasks.map(task =>
          task.id === taskId ? { ...task, completed: !task.completed } : task
        );
        const completedCount = updatedTasks.filter(t => t.completed).length;
        return {
          ...artist,
          tasks: updatedTasks,
          tasksCompleted: completedCount
        };
      }
      return artist;
    }));
  };

  const handleAddMilestone = (artistId: number) => {
    if (!newMilestone.title || !newMilestone.date) {
      toast.error("Please fill in all required fields");
      return;
    }

    setArtists(prev => prev.map(artist => {
      if (artist.id === artistId) {
        const newMilestoneObj = {
          id: artist.milestones.length + 1,
          ...newMilestone
        };
        return {
          ...artist,
          milestones: [...artist.milestones, newMilestoneObj]
        };
      }
      return artist;
    }));

    setNewMilestone({
      title: "",
      date: "",
      description: "",
      category: "release"
    });
    toast.success("Milestone added successfully");
  };

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
          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Users size={18} />
                Add Artist
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Artist</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Artist Name *</Label>
                  <Input
                    id="name"
                    placeholder="Enter artist name"
                    value={newArtist.name}
                    onChange={(e) => setNewArtist(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter email address"
                    value={newArtist.email}
                    onChange={(e) => setNewArtist(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="genre">Genre</Label>
                  <Input
                    id="genre"
                    placeholder="Enter music genre"
                    value={newArtist.genre}
                    onChange={(e) => setNewArtist(prev => ({ ...prev, genre: e.target.value }))}
                  />
                </div>
                <Button className="w-full" onClick={handleAddArtist}>
                  Add Artist
                </Button>
              </div>
            </DialogContent>
          </Dialog>
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
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedArtist(artist)}
                    >
                      View Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl">
                    <DialogHeader>
                      <DialogTitle>Artist Details - {artist.name}</DialogTitle>
                    </DialogHeader>
                    <Tabs defaultValue="overview" className="w-full">
                      <TabsList>
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="tasks">Tasks</TabsTrigger>
                        <TabsTrigger value="milestones">Milestones</TabsTrigger>
                        <TabsTrigger value="moodboard">Mood Board</TabsTrigger>
                      </TabsList>

                      <TabsContent value="overview">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Name</Label>
                            <p className="text-lg font-medium">{artist.name}</p>
                          </div>
                          <div>
                            <Label>Email</Label>
                            <p className="text-lg">{artist.email}</p>
                          </div>
                          <div>
                            <Label>Genre</Label>
                            <p className="text-lg">{artist.genre || "Not specified"}</p>
                          </div>
                          <div>
                            <Label>Last Activity</Label>
                            <p className="text-lg">{new Date(artist.lastActivity).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="tasks">
                        <div className="space-y-4">
                          <div className="flex gap-2">
                            <Input
                              placeholder="New task title"
                              value={newTask.title}
                              onChange={(e) => setNewTask({ title: e.target.value })}
                            />
                            <Button onClick={() => handleAddTask(artist.id)}>Add Task</Button>
                          </div>
                          <div className="space-y-2">
                            {artist.tasks.map(task => (
                              <div
                                key={task.id}
                                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                              >
                                <input
                                  type="checkbox"
                                  checked={task.completed}
                                  onChange={() => handleToggleTask(artist.id, task.id)}
                                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                <span className={cn(
                                  "flex-1",
                                  task.completed && "line-through text-muted-foreground"
                                )}>
                                  {task.title}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="milestones">
                        <div className="space-y-6">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Title</Label>
                              <Input
                                value={newMilestone.title}
                                onChange={(e) => setNewMilestone(prev => ({ ...prev, title: e.target.value }))}
                                placeholder="Milestone title"
                              />
                            </div>
                            <div>
                              <Label>Date</Label>
                              <Input
                                type="date"
                                value={newMilestone.date}
                                onChange={(e) => setNewMilestone(prev => ({ ...prev, date: e.target.value }))}
                              />
                            </div>
                            <div className="col-span-2">
                              <Label>Description</Label>
                              <Input
                                value={newMilestone.description}
                                onChange={(e) => setNewMilestone(prev => ({ ...prev, description: e.target.value }))}
                                placeholder="Milestone description"
                              />
                            </div>
                            <div className="col-span-2">
                              <Button onClick={() => handleAddMilestone(artist.id)} className="w-full">
                                Add Milestone
                              </Button>
                            </div>
                          </div>

                          <div className="space-y-4">
                            {artist.milestones.map((milestone) => (
                              <div
                                key={milestone.id}
                                className="bg-gray-50 p-4 rounded-lg"
                              >
                                <div className="flex items-center gap-2 mb-2">
                                  <Calendar size={16} className="text-primary" />
                                  <span className="text-sm text-muted-foreground">
                                    {new Date(milestone.date).toLocaleDateString()}
                                  </span>
                                  <span className={cn(
                                    "px-2 py-1 rounded-full text-xs",
                                    milestone.category === "release" && "bg-blue-100 text-blue-700",
                                    milestone.category === "performance" && "bg-green-100 text-green-700",
                                    milestone.category === "award" && "bg-purple-100 text-purple-700"
                                  )}>
                                    {milestone.category}
                                  </span>
                                </div>
                                <h3 className="font-medium">{milestone.title}</h3>
                                <p className="text-sm text-muted-foreground">{milestone.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="moodboard">
                        <div className="grid grid-cols-3 gap-4">
                          {artist.moodboardImages.map((image, index) => (
                            <div
                              key={index}
                              className="aspect-square rounded-lg overflow-hidden"
                            >
                              <img
                                src={image}
                                alt={`Mood board image ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </DialogContent>
                </Dialog>
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
