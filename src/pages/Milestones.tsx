
// Import the required modules and components
import { useState } from "react";
import { Milestone, Task } from "@/types";

const Milestones = () => {
  // Sample data as a state
  const [milestones, setMilestones] = useState<Milestone[]>([
    {
      id: "1",
      artist_id: "artist-1",
      title: "Premier Album",
      date: "2023-06-15",
      description: "Sortie de l'album 'Révélation'",
      category: "release",
      created_at: "2023-01-01T00:00:00Z",
      updated_at: "2023-01-01T00:00:00Z"
    }
  ]);

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      artist_id: "artist-1",
      milestone_id: "1",
      title: "Finaliser les mix",
      completed: true,
      created_at: "2023-01-01T00:00:00Z",
      updated_at: "2023-01-01T00:00:00Z"
    },
    {
      id: "2",
      artist_id: "artist-1",
      milestone_id: "1",
      title: "Préparer la campagne de promotion",
      completed: false,
      created_at: "2023-01-01T00:00:00Z",
      updated_at: "2023-01-01T00:00:00Z"
    }
  ]);

  // Function to add a new milestone
  const addMilestone = () => {
    const newMilestone: Milestone = {
      id: String(milestones.length + 1),
      artist_id: "artist-1",
      title: "Nouveau milestone",
      date: new Date().toISOString().split('T')[0],
      description: "Description du milestone",
      category: "release",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    setMilestones([...milestones, newMilestone]);
  };

  // Function to add a new task
  const addTask = () => {
    const newTask: Task = {
      id: String(tasks.length + 1),
      artist_id: "artist-1",
      milestone_id: "1",
      title: "Nouvelle tâche",
      completed: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    setTasks([...tasks, newTask]);
  };

  // Function to toggle task completion
  const toggleTask = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, completed: !task.completed } 
        : task
    ));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Milestones</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Vos milestones</h2>
        <button 
          onClick={addMilestone}
          className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        >
          Ajouter un milestone
        </button>
        
        <div className="space-y-4">
          {milestones.map(milestone => (
            <div key={milestone.id} className="border p-4 rounded">
              <h3 className="font-medium">{milestone.title}</h3>
              <p className="text-sm text-gray-600">Date: {milestone.date}</p>
              <p>{milestone.description}</p>
              <p className="text-sm text-gray-500">Type: {milestone.category}</p>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-2">Vos tâches</h2>
        <button 
          onClick={addTask}
          className="bg-green-500 text-white px-4 py-2 rounded mb-4"
        >
          Ajouter une tâche
        </button>
        
        <div className="space-y-2">
          {tasks.map(task => (
            <div 
              key={task.id} 
              className="flex items-center border p-3 rounded"
            >
              <input 
                type="checkbox" 
                checked={task.completed} 
                onChange={() => toggleTask(task.id)} 
                className="mr-3"
              />
              <span className={task.completed ? "line-through text-gray-400" : ""}>
                {task.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Milestones;
