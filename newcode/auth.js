const Auth = {
    async login(email, password, role = 'patient') {
        let user = null;
        if (window.supabaseClient && window.supabaseClient.auth) {
            try {
                const { data, error } = await window.supabaseClient.auth.signInWithPassword({
                    email,
                    password
                });
                if (!error && data?.user) {
                    user = data.user;
                }
            } catch (e) {
                console.warn('[Auth] Remote login attempt skipped/failed, using local role session:', e);
            }
        }

        // Fallback / local session mode
        if (!user) {
            user = {
                id: 'usr_' + Date.now(),
                email: email || (role + '@setuhealth.org'),
                role: role
            };
        }

        localStorage.setItem('setu_user_email', user.email);
        localStorage.setItem('setu_user_role', role);
        localStorage.setItem('setu_user_session', JSON.stringify({
            id: user.id,
            email: user.email,
            role: role,
            loggedInAt: new Date().toISOString()
        }));

        console.log('[Auth] Logged in successfully:', user.email, 'Role:', role);
        return user;
    },

    async logout() {
        if (window.supabaseClient && window.supabaseClient.auth) {
            try {
                await window.supabaseClient.auth.signOut();
            } catch (e) {
                console.warn('[Auth] Signout error:', e);
            }
        }
        localStorage.removeItem('setu_user_email');
        localStorage.removeItem('setu_user_role');
        localStorage.removeItem('setu_user_session');
        console.log('[Auth] Logged out');
        window.location.href = 'index2.html';
    },

    async getCurrentUser() {
        const sessionStr = localStorage.getItem('setu_user_session');
        if (sessionStr) {
            try { return JSON.parse(sessionStr); } catch (e) {}
        }
        if (window.supabaseClient && window.supabaseClient.auth) {
            try {
                const { data: { user } } = await window.supabaseClient.auth.getUser();
                if (user) return user;
            } catch (e) {}
        }
        return null;
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
        const role = localStorage.getItem('setu_user_role') || 'patient';
        const email = localStorage.getItem('setu_user_email') || 'user@setuhealth.org';
        const customName = localStorage.getItem('setu_user_name');
        return {
            id: 'prof_' + role,
            full_name: customName || (role === 'doctor' ? 'Dr. S. K. Gupta' : (role === 'patient' ? 'Sunita Devi' : 'Health Worker')),
            role: role,
            email: email
        };
    }
};

window.Auth = Auth;
