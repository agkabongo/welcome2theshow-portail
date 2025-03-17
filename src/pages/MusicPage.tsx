
import { useState } from "react";
import { PlusCircle, Music, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

const MusicPage = () => {
  const [tracks, setTracks] = useState<MusicTrack[]>([]);
  const [newTrack, setNewTrack] = useState({
    title: "",
    release_date: "",
    audio_url: "",
    cover_art_url: "",
  });

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

    setTracks([...tracks, track]);
    setNewTrack({
      title: "",
      release_date: "",
      audio_url: "",
      cover_art_url: "",
    });
    toast.success("Morceau ajouté avec succès");
  };

  const handleDeleteTrack = (id: string) => {
    setTracks(tracks.filter((track) => track.id !== id));
    toast.success("Morceau supprimé avec succès");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewTrack({
      ...newTrack,
      [name]: value,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Ma Musique</h1>
            <p className="text-muted-foreground">
              Gérez vos morceaux et partagez votre musique
            </p>
          </div>

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
        </div>

        {tracks.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <Music className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">Aucun morceau</h3>
            <p className="text-muted-foreground mt-2">
              Commencez par ajouter votre premier morceau
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {tracks.map((track) => (
              <Card key={track.id} className="overflow-hidden">
                <CardHeader className="pb-0">
                  <CardTitle className="text-xl">{track.title}</CardTitle>
                  <CardDescription>
                    {track.release_date ? new Date(track.release_date).toLocaleDateString() : "Date non définie"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  {track.cover_art_url && (
                    <div className="aspect-square mb-4 bg-muted rounded-md overflow-hidden">
                      <img
                        src={track.cover_art_url}
                        alt={`Cover art for ${track.title}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  {track.audio_url && (
                    <audio controls className="w-full mt-2">
                      <source src={track.audio_url} />
                      Votre navigateur ne supporte pas la lecture audio
                    </audio>
                  )}
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteTrack(track.id)}
                  >
                    <Trash size={16} className="mr-2" />
                    Supprimer
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MusicPage;
