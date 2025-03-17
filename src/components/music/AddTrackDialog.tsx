
import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { MusicTrack } from "@/types";

interface AddTrackDialogProps {
  onAddTrack: (trackData: Omit<MusicTrack, 'id' | 'artist_id' | 'created_at'>) => Promise<MusicTrack | null>;
}

export const AddTrackDialog = ({ onAddTrack }: AddTrackDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newTrack, setNewTrack] = useState({
    title: "",
    release_date: "",
    audio_url: "",
    cover_art_url: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewTrack({
      ...newTrack,
      [name]: value,
    });
  };

  const handleAddTrack = async () => {
    if (!newTrack.title) {
      toast.error("Veuillez saisir un titre pour le morceau");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const result = await onAddTrack(newTrack);
      
      if (result) {
        // Reset the form
        setNewTrack({
          title: "",
          release_date: "",
          audio_url: "",
          cover_art_url: "",
        });
        
        // Close the dialog
        setOpen(false);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <PlusCircle size={18} />
          Ajouter un morceau
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un nouveau morceau</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Titre</Label>
            <Input
              id="title"
              name="title"
              value={newTrack.title}
              onChange={handleChange}
              placeholder="Nom du morceau"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="release_date">Date de sortie</Label>
            <Input
              id="release_date"
              name="release_date"
              type="date"
              value={newTrack.release_date}
              onChange={handleChange}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="audio_url">Lien audio</Label>
            <Input
              id="audio_url"
              name="audio_url"
              value={newTrack.audio_url}
              onChange={handleChange}
              placeholder="URL du fichier audio"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="cover_art_url">Pochette</Label>
            <Input
              id="cover_art_url"
              name="cover_art_url"
              value={newTrack.cover_art_url}
              onChange={handleChange}
              placeholder="URL de l'image de couverture"
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Annuler</Button>
          </DialogClose>
          <Button onClick={handleAddTrack} disabled={isSubmitting}>
            {isSubmitting ? "Ajout en cours..." : "Ajouter"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
