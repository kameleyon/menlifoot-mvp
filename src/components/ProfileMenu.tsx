import { useState, useEffect } from "react";
import { User, LogOut, Settings } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import ProfileDialog from "./ProfileDialog";

interface Profile {
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
}

const ProfileMenu = () => {
  const { user, signOut } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from('profiles')
      .select('display_name, bio, avatar_url')
      .eq('user_id', user.id)
      .maybeSingle();
    
    if (data) {
      setProfile(data);
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setIsMenuOpen(false);
    if (isMenuOpen) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [isMenuOpen]);

  const handleSignOut = async () => {
    await signOut();
    setIsMenuOpen(false);
    navigate('/');
  };

  const getInitials = () => {
    if (profile?.display_name) {
      return profile.display_name.substring(0, 2).toUpperCase();
    }
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return "U";
  };

  if (!user) {
    return (
      <Link to="/auth">
        <Button
          variant="ghost"
          size="sm"
          className="text-foreground/70 hover:text-primary hover:bg-primary/10 gap-1.5"
        >
          <User className="h-4 w-4" />
          <span className="hidden sm:inline">{t('nav.login') || 'Login'}</span>
        </Button>
      </Link>
    );
  }

  return (
    <>
      <div className="relative">
        <Button
          variant="ghost"
          size="sm"
          className="text-foreground/70 hover:text-primary hover:bg-primary/10 p-1"
          onClick={(e) => {
            e.stopPropagation();
            setIsMenuOpen(!isMenuOpen);
          }}
        >
          <Avatar className="h-8 w-8">
            {profile?.avatar_url ? (
              <AvatarImage src={profile.avatar_url} alt={profile.display_name || 'User'} />
            ) : null}
            <AvatarFallback className="bg-primary/20 text-primary text-xs">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
        </Button>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full right-0 mt-2 w-48 glass-card py-2 shadow-xl z-50"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-4 py-2 border-b border-border/50">
                <p className="text-sm font-medium text-foreground truncate">
                  {profile?.display_name || user.email?.split('@')[0]}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user.email}
                </p>
              </div>

              <button
                onClick={() => {
                  setIsProfileDialogOpen(true);
                  setIsMenuOpen(false);
                }}
                className="w-full px-4 py-2 text-left text-sm flex items-center gap-2 text-foreground/70 hover:text-primary hover:bg-primary/5 transition-colors"
              >
                <Settings className="h-4 w-4" />
                {t('profile.settings') || 'Profile Settings'}
              </button>

              <button
                onClick={handleSignOut}
                className="w-full px-4 py-2 text-left text-sm flex items-center gap-2 text-foreground/70 hover:text-destructive hover:bg-destructive/5 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                {t('nav.logout') || 'Sign Out'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <ProfileDialog 
        open={isProfileDialogOpen} 
        onOpenChange={setIsProfileDialogOpen}
        onProfileUpdate={fetchProfile}
      />
    </>
  );
};

export default ProfileMenu;