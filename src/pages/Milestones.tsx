
import { useState } from "react";
import { Award, Calendar, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Milestone = {
  id: number;
  title: string;
  date: string;
  description: string;
  category: "release" | "performance" | "award";
};

const initialMilestones: Milestone[] = [
  {
    id: 1,
    title: "First Album Release",
    date: "2023-06-15",
    description: "Released debut album 'New Beginnings' on major streaming platforms",
    category: "release",
  },
  {
    id: 2,
    title: "Sold Out Show",
    date: "2023-08-20",
    description: "First sold-out performance at Madison Square Garden",
    category: "performance",
  },
  {
    id: 3,
    title: "Industry Award",
    date: "2023-12-01",
    description: "Won 'Best New Artist' at the Annual Music Awards",
    category: "award",
  },
];

const Milestones = () => {
  const [milestones, setMilestones] = useState<Milestone[]>(initialMilestones);

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Career Milestones</h1>
            <p className="text-muted-foreground">
              Track your musical journey achievements
            </p>
          </div>
          <Button className="flex items-center gap-2">
            <Plus size={18} />
            Add Milestone
          </Button>
        </div>

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
              {milestone.category === "award" && (
                <Award className="text-primary" size={24} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Milestones;
