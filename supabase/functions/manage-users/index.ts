import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    // Create admin client with service role key
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Get the authorization header to verify the caller is an admin
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'No authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Get the user from the JWT token
    const token = authHeader.replace('Bearer ', '');
    const { data: { user: callerUser }, error: authError } = await supabaseAdmin.auth.getUser(token);
    
    if (authError || !callerUser) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Verify caller is an admin
    const { data: callerRole } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', callerUser.id)
      .eq('role', 'admin')
      .maybeSingle();

    if (!callerRole) {
      return new Response(JSON.stringify({ error: 'Unauthorized: Admin access required' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const { action, userId, role } = await req.json();
    console.log(`User management action: ${action} for user ${userId}`);

    switch (action) {
      case 'list': {
        // Get all users from auth.users
        const { data: authUsers, error: usersError } = await supabaseAdmin.auth.admin.listUsers();
        
        if (usersError) {
          console.error('Error listing users:', usersError);
          throw usersError;
        }

        // Get all user roles
        const { data: roles, error: rolesError } = await supabaseAdmin
          .from('user_roles')
          .select('user_id, role');

        if (rolesError) {
          console.error('Error fetching roles:', rolesError);
        }

        // Map roles to users
        const roleMap = new Map(roles?.map(r => [r.user_id, r.role]) || []);
        
        const users = authUsers.users.map(u => ({
          id: u.id,
          email: u.email,
          created_at: u.created_at,
          role: roleMap.get(u.id) || null,
          banned_until: (u as any).banned_until || null
        }));

        return new Response(JSON.stringify({ users }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      case 'setRole': {
        if (!userId) {
          throw new Error('User ID required');
        }

        // First, delete existing role
        await supabaseAdmin
          .from('user_roles')
          .delete()
          .eq('user_id', userId);

        // If role is provided, insert new role
        if (role) {
          const { error: insertError } = await supabaseAdmin
            .from('user_roles')
            .insert({ user_id: userId, role });

          if (insertError) {
            console.error('Error inserting role:', insertError);
            throw insertError;
          }
        }

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      case 'delete': {
        if (!userId) {
          throw new Error('User ID required');
        }

        // Prevent deleting yourself
        if (userId === callerUser.id) {
          throw new Error('Cannot delete your own account');
        }

        const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);
        
        if (deleteError) {
          console.error('Error deleting user:', deleteError);
          throw deleteError;
        }

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      case 'ban': {
        if (!userId) {
          throw new Error('User ID required');
        }

        // Prevent banning yourself
        if (userId === callerUser.id) {
          throw new Error('Cannot ban your own account');
        }

        // Ban for 100 years (effectively permanent)
        const banUntil = new Date();
        banUntil.setFullYear(banUntil.getFullYear() + 100);

        const { error: banError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
          ban_duration: '876000h' // ~100 years in hours
        });

        if (banError) {
          console.error('Error banning user:', banError);
          throw banError;
        }

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      case 'unban': {
        if (!userId) {
          throw new Error('User ID required');
        }

        const { error: unbanError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
          ban_duration: 'none'
        });

        if (unbanError) {
          console.error('Error unbanning user:', unbanError);
          throw unbanError;
        }

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      default:
        throw new Error(`Unknown action: ${action}`);
    }
  } catch (error: any) {
    console.error('Error in manage-users function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});