const Auth = {
    roleDashboards: {
        asha_anm: 'index5.html',
        doctor: 'doctor.html',
        technician: 'technician.html',
        patient: 'patient.html'
    },

    async login(email, password) {
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            console.error('[Auth] Login failed:', error.message);
            return null;
        }

        console.log('[Auth] Login successful:', data.user.email);

        const profile = await this.getProfile();
        this.lastProfile = profile;

        if (profile) {
            console.log('[Auth] Logged-in role:', profile.role);
        }

        return data.user;
    },

    async signup(email, password, profile) {
        const { data, error } = await supabaseClient.auth.signUp({ email, password });

        if (error || !data.user) {
            console.error('[Auth] Signup failed:', error ? error.message : 'No user returned');
            return { user: null, profile: null, error: error || new Error('No user returned from signup') };
        }

        const profilePayload = {
            id: data.user.id,
            full_name: profile.full_name,
            role: profile.role
        };
        if (profile.role === 'patient') {
            profilePayload.patient_id = profile.patient_id;
        }

        // No profile-creation trigger is documented in this repository. A session is
        // required for the client-side insert to remain subject to RLS.
        if (!data.session) {
            return { user: data.user, profile: null, error: null, confirmationRequired: true };
        }

        const { data: createdProfile, error: profileError } = await supabaseClient
            .from('user_profiles')
            .insert(profilePayload)
            .select('id, full_name, role, patient_id')
            .single();

        if (profileError) {
            console.error('[Auth] Profile creation failed:', profileError.message);
            return { user: data.user, profile: null, error: profileError };
        }

        this.lastProfile = createdProfile;
        return { user: data.user, profile: createdProfile, error: null, confirmationRequired: false };
    },

    getDashboardForRole(role) {
        return this.roleDashboards[role] || null;
    },

    async loginAndRedirect(email, password) {
        const user = await this.login(email, password);

        if (!user) {
            return false;
        }

        const profile = this.lastProfile || await this.getProfile();
        const dashboard = profile && this.getDashboardForRole(profile.role);

        if (!dashboard) {
            console.error('[Auth] No supported dashboard for role:', profile ? profile.role : 'no profile');
            alert('Your account does not have a supported role profile.');
            await this.logout();
            return null;
        }

        window.location.href = dashboard;
        return true;
    },

    async logout() {
        const { error } = await supabaseClient.auth.signOut();

        if (error) {
            console.error('[Auth] Logout failed:', error.message);
            return;
        }

        console.log('[Auth] Logged out');
        window.location.href = 'index2.html';
    },

    async getCurrentUser() {
        const {
            data: { user }
        } = await supabaseClient.auth.getUser();

        return user;
    },

    async requireAuth() {
      const user = await this.getCurrentUser();

      if (!user) {
         window.location.href = 'index2.html';
         return null;
        }

     return user;
    },

    async requireRole(expectedRole) {
        const user = await this.getCurrentUser();
        if (!user) {
            window.location.href = 'index2.html';
            return null;
        }

        const profile = await this.getProfile();

        if (!profile || profile.role !== expectedRole) {
            console.warn('[Auth] Access denied. Expected role:', expectedRole, 'Actual role:', profile ? profile.role : 'no profile');
            window.location.href = 'index2.html';
            return null;
        }

        return { user, profile };
    },

    async getProfile() {
        const user = await this.getCurrentUser();

        if (!user) {
            console.error('[Auth] No authenticated user');
            return null;
        }

        const { data, error } = await supabaseClient
            .from('user_profiles')
            .select('id, full_name, role, patient_id')
            .eq('id', user.id)
            .single();

        if (error) {
            console.error('[Auth] Profile lookup failed:', error.message);
            return null;
        }

        console.log('[Auth] User profile:', data);

        return data;
    }
};

window.Auth = Auth;

document.addEventListener('DOMContentLoaded', async () => {
  const authScreen = document.getElementById('auth-screen');

  if (!authScreen) return;

  const user = await Auth.getCurrentUser();

  if (user) {
    authScreen.style.display = 'none';
    console.log('[Auth] Existing session detected:', user.email);
  }
});


// Login button
document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.getElementById('auth-login-btn');

    // Not every page has a login button (e.g. index5.html, the Health
    // Worker dashboard) — that's expected, not an error, so we just
    // skip wiring it up here without cluttering the console.
    if (!loginButton) {
        return;
    }

    loginButton.addEventListener('click', async () => {
        const email = document.getElementById('auth-email').value.trim();
        const password = document.getElementById('auth-password').value;

        if (!email || !password) {
            alert('Please enter your email and password.');
            return;
        }

        loginButton.disabled = true;
        loginButton.textContent = 'Signing in...';

        const user = await Auth.login(email, password);

        if (user) {
            const authScreen = document.getElementById('auth-screen');

            if (authScreen) {
                authScreen.style.display = 'none';
            }
        } else {
            loginButton.disabled = false;
            loginButton.textContent = 'Sign In';

            alert('Login failed. Please check your email and password.');
        }
    });
});
