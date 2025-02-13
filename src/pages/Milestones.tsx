import { useState } from "react";
import { Award, Calendar, Plus, ListTodo } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

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
  const [newMilestone, setNewMilestone] = useState({ id: 0, title: "", date: "", description: "", category: "release" });
  const [newTask, setNewTask] = useState({ id: 0, title: "", completed: false, relatedMilestoneId: undefined });

  const addMilestone = () => {
    setMilestones(prev => [...prev, { ...newMilestone, id: Date.now() }]);
    setIsMilestoneDialogOpen(false);
    setNewMilestone({ id: 0, title: "", date: "", description: "", category: "release" });
  };

  const addTask = () => {
    setTasks(prev => [...prev, { ...newTask, id: Date.now() }]);
    setIsTaskDialogOpen(false);
    setNewTask({ id: 0, title: "", completed: false, relatedMilestoneId: undefined });
  };

  const toggleTaskCompletion = (taskId) => {
    setTasks(prev => prev.map(task => (task.id === taskId ? { ...task, completed: !task.completed } : task)));
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6 mb-8">
        {/* Tasks Column */}
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <ListTodo size={20} /> Tasks
          </h2>
          <ul>
            {tasks.map(task => (
              <li key={task.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg">
                <input type="checkbox" checked={task.completed} onChange={() => toggleTaskCompletion(task.id)} />
                <span className={cn("flex-1", task.completed && "line-through text-muted-foreground")}>{task.title}</span>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Milestones Column */}
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Calendar size={20} /> Milestones
          </h2>
          {milestones.map(milestone => (
            <div key={milestone.id} className="mb-6">
              <h3 className="text-md font-semibold">{milestone.title}</h3>
              <p className="text-muted-foreground">{new Date(milestone.date).toLocaleDateString()}</p>
              <p>{milestone.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Milestones;
