import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Trash2, Edit2, LogOut, ArrowLeft, Youtube, Music2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Podcast {
  id: string;
  title: string;
  description: string | null;
  platform: string;
  original_url: string;
  embed_url: string;
  episode_number: number | null;
  duration: string | null;
  thumbnail_url: string | null;
  published_at: string | null;
  created_at: string;
}

const convertToEmbedUrl = (url: string, platform: string): string => {
  if (platform === 'spotify') {
    // Convert Spotify URLs to embed format
    // https://open.spotify.com/episode/xxx -> https://open.spotify.com/embed/episode/xxx
    const match = url.match(/spotify\.com\/(episode|show|track)\/([a-zA-Z0-9]+)/);
    if (match) {
      return `https://open.spotify.com/embed/${match[1]}/${match[2]}?utm_source=generator&theme=0`;
    }
  } else if (platform === 'youtube') {
    // Convert YouTube URLs to embed format
    // https://www.youtube.com/watch?v=xxx -> https://www.youtube.com/embed/xxx
    // https://youtu.be/xxx -> https://www.youtube.com/embed/xxx
    let videoId = '';
    if (url.includes('youtube.com/watch')) {
      const urlParams = new URL(url).searchParams;
      videoId = urlParams.get('v') || '';
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0] || '';
    }
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }
  }
  return url;
};

const detectPlatform = (url: string): 'spotify' | 'youtube' | null => {
  if (url.includes('spotify.com')) return 'spotify';
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
  return null;
};

const Admin = () => {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPodcast, setEditingPodcast] = useState<Podcast | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    original_url: '',
    platform: 'spotify' as 'spotify' | 'youtube',
    episode_number: '',
    duration: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user, isAdmin, loading, adminLoading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    } else if (!loading && !adminLoading && user && !isAdmin) {
      toast({
        title: 'Access Denied',
        description: 'You do not have admin privileges.',
        variant: 'destructive',
      });
      navigate('/');
    }
  }, [user, isAdmin, loading, adminLoading, navigate, toast]);

  useEffect(() => {
    if (isAdmin) {
      fetchPodcasts();
    }
  }, [isAdmin]);

  const fetchPodcasts = async () => {
    const { data, error } = await supabase
      .from('podcasts')
      .select('*')
      .order('episode_number', { ascending: false });

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to load podcasts.',
        variant: 'destructive',
      });
    } else {
      setPodcasts(data || []);
    }
  };

  const handleUrlChange = (url: string) => {
    setFormData(prev => ({ ...prev, original_url: url }));
    const detected = detectPlatform(url);
    if (detected) {
      setFormData(prev => ({ ...prev, platform: detected }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const embed_url = convertToEmbedUrl(formData.original_url, formData.platform);

    const podcastData = {
      title: formData.title,
      description: formData.description || null,
      platform: formData.platform,
      original_url: formData.original_url,
      embed_url,
      episode_number: formData.episode_number ? parseInt(formData.episode_number) : null,
      duration: formData.duration || null,
      created_by: user?.id,
    };

    try {
      if (editingPodcast) {
        const { error } = await supabase
          .from('podcasts')
          .update(podcastData)
          .eq('id', editingPodcast.id);

        if (error) throw error;
        toast({ title: 'Success', description: 'Podcast updated!' });
      } else {
        const { error } = await supabase
          .from('podcasts')
          .insert([podcastData]);

        if (error) throw error;
        toast({ title: 'Success', description: 'Podcast added!' });
      }

      setIsDialogOpen(false);
      setEditingPodcast(null);
      resetForm();
      fetchPodcasts();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save podcast.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (podcast: Podcast) => {
    setEditingPodcast(podcast);
    setFormData({
      title: podcast.title,
      description: podcast.description || '',
      original_url: podcast.original_url,
      platform: podcast.platform as 'spotify' | 'youtube',
      episode_number: podcast.episode_number?.toString() || '',
      duration: podcast.duration || '',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this podcast?')) return;

    const { error } = await supabase
      .from('podcasts')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete podcast.',
        variant: 'destructive',
      });
    } else {
      toast({ title: 'Deleted', description: 'Podcast removed.' });
      fetchPodcasts();
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      original_url: '',
      platform: 'spotify',
      episode_number: '',
      duration: '',
    });
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  if (loading || adminLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Loading...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="absolute inset-0 bg-gradient-dark" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />

      <div className="relative z-10 container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <h1 className="font-display text-3xl font-bold text-gradient-gold">
                Admin Panel
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">{user?.email}</span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>

          {/* Add Podcast Button */}
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) {
              setEditingPodcast(null);
              resetForm();
            }
          }}>
            <DialogTrigger asChild>
              <Button variant="gold" className="mb-6">
                <Plus className="h-4 w-4 mr-2" />
                Add Podcast Episode
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>
                  {editingPodcast ? 'Edit Podcast' : 'Add New Podcast'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Episode Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Episode title"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="original_url">Podcast URL *</Label>
                  <Input
                    id="original_url"
                    value={formData.original_url}
                    onChange={(e) => handleUrlChange(e.target.value)}
                    placeholder="Paste Spotify or YouTube link"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Platform will be auto-detected from the URL
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="platform">Platform</Label>
                  <Select
                    value={formData.platform}
                    onValueChange={(value: 'spotify' | 'youtube') => 
                      setFormData(prev => ({ ...prev, platform: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="spotify">
                        <div className="flex items-center gap-2">
                          <Music2 className="h-4 w-4" />
                          Spotify
                        </div>
                      </SelectItem>
                      <SelectItem value="youtube">
                        <div className="flex items-center gap-2">
                          <Youtube className="h-4 w-4" />
                          YouTube
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="episode_number">Episode #</Label>
                    <Input
                      id="episode_number"
                      type="number"
                      value={formData.episode_number}
                      onChange={(e) => setFormData(prev => ({ ...prev, episode_number: e.target.value }))}
                      placeholder="1"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration</Label>
                    <Input
                      id="duration"
                      value={formData.duration}
                      onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                      placeholder="45:30"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Episode description..."
                    rows={3}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="gold"
                    disabled={isLoading}
                    className="flex-1"
                  >
                    {isLoading ? 'Saving...' : editingPodcast ? 'Update' : 'Add Podcast'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          {/* Podcasts List */}
          <div className="glass-card p-6">
            <h2 className="text-xl font-display font-semibold mb-4">
              Podcast Episodes ({podcasts.length})
            </h2>
            
            {podcasts.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No podcasts yet. Add your first episode!
              </p>
            ) : (
              <div className="space-y-4">
                {podcasts.map((podcast) => (
                  <div
                    key={podcast.id}
                    className="flex items-center gap-4 p-4 bg-surface rounded-lg border border-border/50"
                  >
                    <div className="w-12 h-12 rounded-lg bg-gradient-gold flex items-center justify-center flex-shrink-0">
                      {podcast.platform === 'youtube' ? (
                        <Youtube className="h-6 w-6 text-primary-foreground" />
                      ) : (
                        <Music2 className="h-6 w-6 text-primary-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        {podcast.episode_number && (
                          <span className="text-xs px-2 py-0.5 bg-primary/20 text-primary rounded">
                            EP {podcast.episode_number}
                          </span>
                        )}
                        <h3 className="font-medium text-foreground truncate">
                          {podcast.title}
                        </h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {podcast.platform} • {podcast.duration || 'No duration'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(podcast)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(podcast.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Admin;
