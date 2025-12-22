import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { FileText, User } from "lucide-react";

interface Editor {
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  article_count: number;
}

interface EditorialDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EditorialDialog = ({ open, onOpenChange }: EditorialDialogProps) => {
  const { t } = useLanguage();
  const [editors, setEditors] = useState<Editor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open) {
      fetchEditors();
    }
  }, [open]);

  const fetchEditors = async () => {
    setLoading(true);
    try {
      // Get all editors/admins from user_roles
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role')
        .in('role', ['editor', 'admin']);

      if (rolesError) throw rolesError;

      if (!roles || roles.length === 0) {
        setEditors([]);
        setLoading(false);
        return;
      }

      const userIds = roles.map(r => r.user_id);

      // Get profiles for these users
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, display_name, avatar_url')
        .in('user_id', userIds);

      if (profilesError) throw profilesError;

      // Get article counts for each user
      const { data: articles, error: articlesError } = await supabase
        .from('articles')
        .select('created_by')
        .in('created_by', userIds)
        .eq('is_published', true);

      if (articlesError) throw articlesError;

      // Count articles per user
      const articleCounts: Record<string, number> = {};
      articles?.forEach(article => {
        if (article.created_by) {
          articleCounts[article.created_by] = (articleCounts[article.created_by] || 0) + 1;
        }
      });

      // Combine data
      const editorsData: Editor[] = userIds.map(userId => {
        const profile = profiles?.find(p => p.user_id === userId);
        return {
          user_id: userId,
          display_name: profile?.display_name || 'Editor',
          avatar_url: profile?.avatar_url || null,
          article_count: articleCounts[userId] || 0,
        };
      });

      // Sort by article count descending
      editorsData.sort((a, b) => b.article_count - a.article_count);

      setEditors(editorsData);
    } catch (error) {
      console.error('Error fetching editors:', error);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string | null) => {
    if (!name) return 'E';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-gradient-gold">{t('footer.editorial') || 'Editorial Team'}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : editors.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No editors found</p>
          ) : (
            editors.map((editor) => (
              <div
                key={editor.user_id}
                className="flex items-center gap-4 p-4 rounded-lg bg-surface-elevated hover:bg-surface-elevated/80 transition-colors"
              >
                <Avatar className="h-14 w-14 border-2 border-primary/20">
                  <AvatarImage src={editor.avatar_url || undefined} alt={editor.display_name || 'Editor'} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {getInitials(editor.display_name)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <h4 className="font-medium text-foreground">{editor.display_name}</h4>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                    <FileText className="h-4 w-4" />
                    <span>{editor.article_count} {editor.article_count === 1 ? 'article' : 'articles'}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditorialDialog;
