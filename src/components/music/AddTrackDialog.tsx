
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
  onAddTrack: (track: MusicTrack) => void;
}

export const AddTrackDialog = ({ onAddTrack }: AddTrackDialogProps) => {
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

  const handleAddTrack = () => {
    if (!newTrack.title) {
      toast.error("Veuillez saisir un titre pour le morceau");
      return;
    }

    const track: MusicTrack = {
      id: crypto.randomUUID(),
      artist_id: "temp-artist-id", // Ceci serait remplacé par l'ID réel de l'artiste
      title: newTrack.title,
      release_date: newTrack.release_date,
      audio_url: newTrack.audio_url,
      cover_art_url: newTrack.cover_art_url,
      created_at: new Date().toISOString(),
    };

    onAddTrack(track);
    
    // Reset the form
    setNewTrack({
      title: "",
      release_date: "",
      audio_url: "",
      cover_art_url: "",
    });
  };

  return (
    <Dialog>
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
          <Button onClick={handleAddTrack}>Ajouter</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
