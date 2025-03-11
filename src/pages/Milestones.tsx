import { useState } from "react";
import { Award, Calendar, Plus, ListTodo, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

type Task = {
  id: number;
  title: string;
  completed: boolean;
  relatedMilestoneId?: number;
};

const initialMilestones = [
  { id: 1, title: "First Album Release", date: "2024-06-15", description: "Released debut album 'New Beginnings'", category: "release" },
  { id: 2, title: "Sold Out Show", date: "2024-08-20", description: "First sold-out performance at MSG", category: "performance" },
  { id: 3, title: "Industry Award", date: "2024-12-01", description: "Won 'Best New Artist'", category: "award" },
];

const initialTasks = [
  { id: 1, title: "Finalize album artwork", completed: false, relatedMilestoneId: 1 },
  { id: 2, title: "Book studio time", completed: true, relatedMilestoneId: 1 },
  { id: 3, title: "Contact venue management", completed: false, relatedMilestoneId: 2 },
];

const Milestones = () => {
  const [milestones, setMilestones] = useState(initialMilestones);
  const [tasks, setTasks] = useState(initialTasks);
  const [isMilestoneDialogOpen, setIsMilestoneDialogOpen] = useState(false);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<typeof initialMilestones[0] | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newMilestone, setNewMilestone] = useState({ id: 0, title: "", date: "", description: "", category: "release" as const });
  const [newTask, setNewTask] = useState({ id: 0, title: "", completed: false, relatedMilestoneId: undefined });
  const { toast } = useToast();

  const getUpcomingMilestone = () => {
    const now = new Date();
    return milestones
      .filter(m => new Date(m.date) > now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
  };

  const toggleTaskCompletion = (taskId: number) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleEditMilestone = (milestone: typeof initialMilestones[0]) => {
    setEditingMilestone(milestone);
    setNewMilestone(milestone);
    setIsMilestoneDialogOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setNewTask(task);
    setIsTaskDialogOpen(true);
  };

  const addMilestone = () => {
    if (editingMilestone) {
      setMilestones(prev => prev.map(m => 
        m.id === editingMilestone.id ? { ...newMilestone, id: m.id } : m
      ));
      toast({
        title: "Milestone updated",
        description: "The milestone has been successfully updated.",
      });
    } else {
      setMilestones(prev => [...prev, { ...newMilestone, id: Date.now() }]);
      toast({
        title: "Milestone added",
        description: "New milestone has been successfully added.",
      });
    }
    setIsMilestoneDialogOpen(false);
    setNewMilestone({ id: 0, title: "", date: "", description: "", category: "release" });
    setEditingMilestone(null);
  };

  const addTask = () => {
    if (editingTask) {
      setTasks(prev => prev.map(t => 
        t.id === editingTask.id ? { ...newTask, id: t.id } : t
      ));
      toast({
        title: "Task updated",
        description: "The task has been successfully updated.",
      });
    } else {
      setTasks(prev => [...prev, { ...newTask, id: Date.now() }]);
      toast({
        title: "Task added",
        description: "New task has been successfully added.",
      });
    }
    setIsTaskDialogOpen(false);
    setNewTask({ id: 0, title: "", completed: false, relatedMilestoneId: undefined });
    setEditingTask(null);
  };

  const deleteMilestone = (id: number) => {
    setMilestones(prev => prev.filter(milestone => milestone.id !== id));
    toast({
      title: "Milestone deleted",
      description: "The milestone has been successfully deleted.",
    });
  };

  const deleteTask = (id: number) => {
    setTasks(prev => prev.filter(task => task.id !== id));
    toast({
      title: "Task deleted",
      description: "The task has been successfully deleted.",
    });
  };

  const upcomingMilestone = getUpcomingMilestone();

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Calendar size={20} className="text-primary" />
                Upcoming Milestone
              </h2>
              {upcomingMilestone ? (
                <div>
                  <div className="mb-2">
                    <span className={cn(
                      "px-2 py-1 rounded-full text-xs",
                      upcomingMilestone.category === "release" && "bg-blue-100 text-blue-700",
                      upcomingMilestone.category === "performance" && "bg-green-100 text-green-700",
                      upcomingMilestone.category === "award" && "bg-purple-100 text-purple-700"
                    )}>
                      {upcomingMilestone.category}
                    </span>
                  </div>
                  <h3 className="font-medium mb-1">{upcomingMilestone.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(upcomingMilestone.date).toLocaleDateString()}
                  </p>
                </div>
              ) : (
                <p className="text-muted-foreground">No upcoming milestones</p>
              )}
            </div>

            <div className="bg-white rounded-lg p-6 shadow-lg mt-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <ListTodo size={20} className="text-primary" />
                Tasks
              </h2>
              <div className="space-y-3">
                {tasks.map(task => (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTaskCompletion(task.id)}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className={cn(
                      "flex-1 text-sm",
                      task.completed && "line-through text-muted-foreground"
                    )}>
                      {task.title}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditTask(task)}
                      className="p-0 h-8 w-8"
                    >
                      <Pencil size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteTask(task.id)}
                      className="p-0 h-8 w-8 text-destructive hover:text-destructive"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                ))}
                <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="mt-4 w-full">
                      {editingTask ? "Update Task" : "Add Task"}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{editingTask ? "Edit Task" : "Add a New Task"}</DialogTitle>
                    </DialogHeader>
                    <Input 
                      placeholder="Task Title" 
                      value={newTask.title} 
                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} 
                    />
                    <DialogFooter>
                      <Button onClick={addTask}>
                        {editingTask ? "Update Task" : "Add Task"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-4xl font-bold mb-2">Career Milestones</h1>
                <p className="text-muted-foreground">
                  Track your musical journey achievements
                </p>
              </div>
            </div>

            <Dialog open={isMilestoneDialogOpen} onOpenChange={setIsMilestoneDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus size={18} />
                  {editingMilestone ? "Update Milestone" : "Add Milestone"}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingMilestone ? "Edit Milestone" : "Add a New Milestone"}</DialogTitle>
                </DialogHeader>
                <Input 
                  placeholder="Milestone Title" 
                  value={newMilestone.title} 
                  onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })} 
                />
                <Input 
                  type="date" 
                  value={newMilestone.date} 
                  onChange={(e) => setNewMilestone({ ...newMilestone, date: e.target.value })} 
                />
                <Textarea 
                  placeholder="Description" 
                  value={newMilestone.description} 
                  onChange={(e) => setNewMilestone({ ...newMilestone, description: e.target.value })} 
                />
                <DialogFooter>
                  <Button onClick={addMilestone}>
                    {editingMilestone ? "Update Milestone" : "Add Milestone"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <div className="space-y-6">
              {milestones.map((milestone) => (
                <div
                  key={milestone.id}
                  className="relative flex gap-4 bg-white rounded-lg p-6 shadow-lg transition-all hover:shadow-xl"
                >
                  <div className="absolute -left-2 top-6 w-4 h-4 rounded-full bg-primary" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm text-muted-foreground">
                        <Calendar size={14} className="inline mr-1" />
                        {new Date(milestone.date).toLocaleDateString()}
                      </span>
                      <span
                        className={cn(
                          "px-2 py-1 rounded-full text-xs",
                          milestone.category === "release" && "bg-blue-100 text-blue-700",
                          milestone.category === "performance" && "bg-green-100 text-green-700",
                          milestone.category === "award" && "bg-purple-100 text-purple-700"
                        )}
                      >
                        {milestone.category}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{milestone.title}</h3>
                    <p className="text-muted-foreground">{milestone.description}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditMilestone(milestone)}
                      className="p-0 h-8 w-8"
                    >
                      <Pencil size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteMilestone(milestone.id)}
                      className="p-0 h-8 w-8 text-destructive hover:text-destructive"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                  {milestone.category === "award" && (
                    <Award className="text-primary" size={24} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Milestones;
