import { useState, useEffect } from "react";
import { Camera, Loader2, Save, Mail, Lock, User as UserIcon, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Profile {
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
}

interface ProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProfileUpdate?: () => void;
}

const ProfileDialog = ({ open, onOpenChange, onProfileUpdate }: ProfileDialogProps) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [profile, setProfile] = useState<Profile>({
    display_name: '',
    bio: '',
    avatar_url: null
  });
  
  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    if (open && user) {
      fetchProfile();
    }
  }, [open, user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from('profiles')
      .select('display_name, bio, avatar_url')
      .eq('user_id', user.id)
      .maybeSingle();
    
    if (data) {
      setProfile({
        display_name: data.display_name || '',
        bio: data.bio || '',
        avatar_url: data.avatar_url
      });
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !user) return;
    
    const file = e.target.files[0];
    
    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: t('profile.error') || "Error",
        description: t('profile.fileTooLarge') || "File size must be less than 2MB",
        variant: "destructive"
      });
      return;
    }
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: t('profile.error') || "Error",
        description: t('profile.invalidFileType') || "Please upload an image file",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/avatar.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });
      
      if (uploadError) throw uploadError;
      
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);
      
      // Add cache-busting query param
      const avatarUrl = `${publicUrl}?t=${Date.now()}`;
      
      setProfile(prev => ({ ...prev, avatar_url: avatarUrl }));
      
      toast({
        title: t('profile.success') || "Success",
        description: t('profile.avatarUploaded') || "Avatar uploaded successfully"
      });
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: t('profile.error') || "Error",
        description: error.message || "Failed to upload avatar",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveAvatar = async () => {
    if (!user) return;
    
    setUploading(true);
    try {
      // Try to delete from storage (may fail if file doesn't exist, that's ok)
      await supabase.storage
        .from('avatars')
        .remove([`${user.id}/avatar.png`, `${user.id}/avatar.jpg`, `${user.id}/avatar.jpeg`, `${user.id}/avatar.webp`]);
      
      // Clear avatar URL from profile state
      setProfile(prev => ({ ...prev, avatar_url: null }));
      
      toast({
        title: t('profile.success') || "Success",
        description: t('profile.avatarRemoved') || "Avatar removed successfully"
      });
    } catch (error: any) {
      console.error('Remove error:', error);
      toast({
        title: t('profile.error') || "Error",
        description: error.message || "Failed to remove avatar",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          display_name: profile.display_name,
          bio: profile.bio?.substring(0, 100), // Limit bio to 100 chars
          avatar_url: profile.avatar_url
        }, { onConflict: 'user_id' });
      
      if (error) throw error;
      
      toast({
        title: t('profile.success') || "Success",
        description: t('profile.profileUpdated') || "Profile updated successfully"
      });
      
      onProfileUpdate?.();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Save error:', error);
      toast({
        title: t('profile.error') || "Error",
        description: error.message || "Failed to save profile",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: t('profile.error') || "Error",
        description: t('profile.passwordMismatch') || "Passwords do not match",
        variant: "destructive"
      });
      return;
    }
    
    if (newPassword.length < 6) {
      toast({
        title: t('profile.error') || "Error",
        description: t('profile.passwordTooShort') || "Password must be at least 6 characters",
        variant: "destructive"
      });
      return;
    }
    
    setChangingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) throw error;
      
      toast({
        title: t('profile.success') || "Success",
        description: t('profile.passwordChanged') || "Password changed successfully"
      });
      
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      toast({
        title: t('profile.error') || "Error",
        description: error.message || "Failed to change password",
        variant: "destructive"
      });
    } finally {
      setChangingPassword(false);
    }
  };

  const getInitials = () => {
    if (profile.display_name) {
      return profile.display_name.substring(0, 2).toUpperCase();
    }
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return "U";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-background border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {t('profile.settings') || 'Profile Settings'}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile" className="gap-2">
              <UserIcon className="h-4 w-4" />
              {t('profile.profile') || 'Profile'}
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <Lock className="h-4 w-4" />
              {t('profile.security') || 'Security'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4 mt-4">
            {/* Avatar */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <Avatar className="h-20 w-20">
                  {profile.avatar_url ? (
                    <AvatarImage src={profile.avatar_url} alt="Avatar" />
                  ) : null}
                  <AvatarFallback className="bg-primary/20 text-primary text-lg">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
                
                <label className="absolute bottom-0 right-0 p-1.5 bg-primary rounded-full cursor-pointer hover:bg-primary/90 transition-colors">
                  {uploading ? (
                    <Loader2 className="h-4 w-4 text-primary-foreground animate-spin" />
                  ) : (
                    <Camera className="h-4 w-4 text-primary-foreground" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-xs text-muted-foreground">
                  {t('profile.avatarHint') || 'Click to change avatar'}
                </p>
                {profile.avatar_url && (
                  <button
                    onClick={handleRemoveAvatar}
                    disabled={uploading}
                    className="text-xs text-destructive hover:text-destructive/80 flex items-center gap-1 transition-colors"
                  >
                    <Trash2 className="h-3 w-3" />
                    {t('profile.removeAvatar') || 'Remove'}
                  </button>
                )}
              </div>
            </div>

            {/* Display Name */}
            <div className="space-y-2">
              <Label htmlFor="displayName">{t('profile.displayName') || 'Display Name'}</Label>
              <Input
                id="displayName"
                value={profile.display_name || ''}
                onChange={(e) => setProfile(prev => ({ ...prev, display_name: e.target.value }))}
                placeholder={t('profile.displayNamePlaceholder') || 'Your name'}
                className="bg-background"
              />
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio">
                {t('profile.bio') || 'Bio'} 
                <span className="text-muted-foreground ml-2">
                  ({(profile.bio?.length || 0)}/100)
                </span>
              </Label>
              <Textarea
                id="bio"
                value={profile.bio || ''}
                onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value.substring(0, 100) }))}
                placeholder={t('profile.bioPlaceholder') || 'A few words about you...'}
                className="bg-background resize-none"
                rows={2}
                maxLength={100}
              />
            </div>

            {/* Email (read-only) */}
            <div className="space-y-2">
              <Label>{t('profile.email') || 'Email'}</Label>
              <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-md text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                {user?.email}
              </div>
            </div>

            <Button 
              onClick={handleSaveProfile} 
              disabled={loading}
              className="w-full gap-2"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {t('profile.save') || 'Save Changes'}
            </Button>
          </TabsContent>

          <TabsContent value="security" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">{t('profile.newPassword') || 'New Password'}</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-background"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t('profile.confirmPassword') || 'Confirm Password'}</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-background"
              />
            </div>

            <Button 
              onClick={handleChangePassword} 
              disabled={changingPassword || !newPassword || !confirmPassword}
              className="w-full gap-2"
            >
              {changingPassword ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Lock className="h-4 w-4" />
              )}
              {t('profile.changePassword') || 'Change Password'}
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileDialog;