
import { useState } from "react";
import { Upload, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const MoodBoard = () => {
  const [images, setImages] = useState<string[]>([]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === "string") {
          setImages((prev) => [...prev, result]);
          toast.success("Image added to mood board");
        }
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Mood Board</h1>
            <p className="text-muted-foreground">
              Create your visual inspiration board
            </p>
          </div>
          <label className="cursor-pointer">
            <input
              type="file"
              className="hidden"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
            />
            <Button className="flex items-center gap-2">
              <Upload size={18} />
              Add Images
            </Button>
          </label>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              className="aspect-square rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-[1.02]"
            >
              <img
                src={image}
                alt={`Mood board image ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
          <label className="cursor-pointer aspect-square rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors">
            <input
              type="file"
              className="hidden"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
            />
            <div className="text-center">
              <Plus size={24} className="mx-auto mb-2 text-gray-400" />
              <span className="text-sm text-gray-500">Add Image</span>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default MoodBoard;
