import { useState } from "react";
import { Award, Calendar, Plus, ListTodo, Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Modal from "@/components/ui/modal";

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

const initialMilestones: Milestone[] = [
  { id: 1, title: "First Album Release", date: "2024-06-15", description: "Released debut album.", category: "release" },
  { id: 2, title: "Sold Out Show", date: "2024-08-20", description: "First sold-out performance.", category: "performance" },
  { id: 3, title: "Industry Award", date: "2024-12-01", description: "Won 'Best New Artist'.", category: "award" },
];

const initialTasks: Task[] = [
  { id: 1, title: "Finalize album artwork", completed: false, relatedMilestoneId: 1 },
  { id: 2, title: "Book studio time", completed: true, relatedMilestoneId: 1 },
  { id: 3, title: "Contact venue management", completed: false, relatedMilestoneId: 2 },
];

const Milestones = () => {
  const [milestones, setMilestones] = useState<Milestone[]>(initialMilestones);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);

  const addMilestone = () => {
    const newMilestone = { id: milestones.length + 1, title: "New Milestone", date: new Date().toISOString().split('T')[0], description: "Description", category: "release" };
    setMilestones(prev => [...prev, newMilestone]);
  };

  const updateMilestone = (updatedMilestone: Milestone) => {
    setMilestones(prev => prev.map(m => m.id === updatedMilestone.id ? updatedMilestone : m));
  };

  const deleteMilestone = (id: number) => {
    setMilestones(prev => prev.filter(m => m.id !== id));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Career Milestones</h1>
          <Button onClick={addMilestone}><Plus size={18} /> Add Milestone</Button>
        </div>
        <div className="space-y-6">
          {milestones.map(milestone => (
            <div key={milestone.id} className="bg-white p-6 rounded-lg shadow-lg relative">
              <h3 className="text-xl font-semibold">{milestone.title}</h3>
              <p className="text-sm text-muted-foreground">{milestone.description}</p>
              <p className="text-sm font-semibold"><Calendar size={14} className="inline mr-1" /> {milestone.date}</p>
              <div className="absolute top-2 right-2 flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setSelectedMilestone(milestone)}>
                  <Pencil size={16} />
                </Button>
                <Button size="sm" variant="destructive" onClick={() => deleteMilestone(milestone.id)}>
                  <Trash size={16} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {selectedMilestone && (
        <Modal title="Edit Milestone" onClose={() => setSelectedMilestone(null)}>
          <input type="text" value={selectedMilestone.title} onChange={(e) => setSelectedMilestone({ ...selectedMilestone, title: e.target.value })} className="w-full p-2 border rounded-md mb-4" />
          <Button onClick={() => { updateMilestone(selectedMilestone); setSelectedMilestone(null); }}>Save</Button>
        </Modal>
      )}
    </div>
  );
};

export default Milestones;
