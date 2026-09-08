const Auth = {
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

        if (profile) {
            console.log('[Auth] Logged-in role:', profile.role);
        }

        return data.user;
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

    async getProfile() {
        const user = await this.getCurrentUser();

        if (!user) {
            console.error('[Auth] No authenticated user');
            return null;
        }

        const { data, error } = await supabaseClient
            .from('user_profiles')
            .select('id, full_name, role')
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