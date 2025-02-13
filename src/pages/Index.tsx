
import { Link } from "react-router-dom";
import { Image, Music } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-50">
      <div className="w-full max-w-4xl px-4 animate-fade-in">
        <h1 className="text-5xl font-bold text-center mb-8">
          <span className="text-primary">Create</span> Your Artist Journey
        </h1>
        <p className="text-xl text-center text-muted-foreground mb-12">
          Design your vision. Track your progress. Share your story.
        </p>
        
        <div className="grid md:grid-cols-2 gap-8 mt-8">
          <Link
            to="/moodboard"
            className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-lg transition-all hover:shadow-xl"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Image className="w-12 h-12 mb-4 text-primary" />
            <h2 className="text-2xl font-semibold mb-2">Mood Board</h2>
            <p className="text-muted-foreground">
              Create visual inspiration boards for your next project or album
            </p>
          </Link>

          <Link
            to="/milestones"
            className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-lg transition-all hover:shadow-xl"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Music className="w-12 h-12 mb-4 text-primary" />
            <h2 className="text-2xl font-semibold mb-2">Career Milestones</h2>
            <p className="text-muted-foreground">
              Document and celebrate your musical journey achievements
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
