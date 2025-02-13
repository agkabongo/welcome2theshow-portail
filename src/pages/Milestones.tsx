import { useState } from "react";
import { Award, Calendar, Plus, ListTodo } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

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
  {
    id: 1,
    title: "First Album Release",
    date: "2024-06-15",
    description: "Released debut album 'New Beginnings' on major streaming platforms",
    category: "release",
  },
  {
    id: 2,
    title: "Sold Out Show",
    date: "2024-08-20",
    description: "First sold-out performance at Madison Square Garden",
    category: "performance",
  },
  {
    id: 3,
    title: "Industry Award",
    date: "2024-12-01",
    description: "Won 'Best New Artist' at the Annual Music Awards",
    category: "award",
  },
];

const Milestones = () => {
  const [milestones, setMilestones] = useState<Milestone[]>(initialMilestones);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newMilestone, setNewMilestone] = useState<Milestone>({
    id: 0,
    title: "",
    date: "",
    description: "",
    category: "release",
  });

  const addMilestone = () => {
    setMilestones(prev => [...prev, { ...newMilestone, id: milestones.length + 1 }]);
    setIsDialogOpen(false);
    setNewMilestone({ id: 0, title: "", date: "", description: "", category: "release" });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Career Milestones</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button><Plus size={18} /> Add Milestone</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add a New Milestone</DialogTitle>
              </DialogHeader>
              <Input placeholder="Title" value={newMilestone.title} onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })} />
              <Input type="date" value={newMilestone.date} onChange={(e) => setNewMilestone({ ...newMilestone, date: e.target.value })} />
              <Textarea placeholder="Description" value={newMilestone.description} onChange={(e) => setNewMilestone({ ...newMilestone, description: e.target.value })} />
              <select className="border p-2 rounded-md" value={newMilestone.category} onChange={(e) => setNewMilestone({ ...newMilestone, category: e.target.value as Milestone["category"] })}>
                <option value="release">Release</option>
                <option value="performance">Performance</option>
                <option value="award">Award</option>
              </select>
              <DialogFooter>
                <Button onClick={addMilestone}>Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-6">
          {milestones.map(milestone => (
            <div key={milestone.id} className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold">{milestone.title}</h3>
              <p className="text-sm text-muted-foreground">{milestone.description}</p>
              <p className="text-sm font-semibold">
                <Calendar size={14} className="inline mr-1" /> {milestone.date}
              </p>
              <span className={cn(
                "px-2 py-1 rounded-full text-xs",
                milestone.category === "release" && "bg-blue-100 text-blue-700",
                milestone.category === "performance" && "bg-green-100 text-green-700",
                milestone.category === "award" && "bg-purple-100 text-purple-700"
              )}>
                {milestone.category}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Milestones;
