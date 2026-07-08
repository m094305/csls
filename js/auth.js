/**
 * CS TACTICAL HUB — Auth Module
 * Communicates with the Express backend at localhost:3000
 */

const AUTH_API = 'http://localhost:3000/api';

const AuthUI = {
    currentUser: null,

    // ── Bootstrap ─────────────────────────────────────────────────────────
    init() {
        const storedUser = sessionStorage.getItem('operator_user');
        if (storedUser) {
            try {
                this.setLoggedIn(JSON.parse(storedUser));
            } catch (e) {
                this.setLoggedOut();
            }
        } else {
            this.setLoggedOut();
        }
        this.bindEvents();
        this.handleUrlAuth();
    },

    handleUrlAuth() {
        const params = new URLSearchParams(window.location.search);
        const name = params.get('login');
        if (name) {
            const trimmedName = name.trim();
            this.login(trimmedName).then(data => {
                if (data && !data.error) {
                    this.setLoggedIn(data.user);
                    const newUrl = window.location.pathname + window.location.hash;
                    window.history.replaceState({}, document.title, newUrl);
                }
            }).catch(err => {
                console.error("Auto-login request failed:", err);
            });
        }
    },

    // ── API calls ─────────────────────────────────────────────────────────
    async _post(endpoint, body) {
        const res = await fetch(`${AUTH_API}/${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        return res.json();
    },

    login(name) { return this._post('login', { name }); },

    signup(name, hours, faceitElo, premierElo) {
        return this._post('signup', { name, hours, faceitElo, premierElo });
    },

    logout() {
        sessionStorage.removeItem('operator_user');
        this.setLoggedOut();
    },

    // ── UI state ──────────────────────────────────────────────────────────
    setLoggedIn(user) {
        this.currentUser = user;
        sessionStorage.setItem('operator_user', JSON.stringify(user));
        document.getElementById('auth-btn').style.display = 'none';
        const chip = document.getElementById('user-chip');
        chip.querySelector('.user-chip-name').textContent = user.name;
        chip.style.display = 'flex';
        // Refresh comments so new user can post
        if (typeof loadComments === 'function') loadComments();
    },

    setLoggedOut() {
        this.currentUser = null;
        document.getElementById('auth-btn').style.display = 'inline-flex';
        document.getElementById('user-chip').style.display = 'none';
        if (typeof loadComments === 'function') loadComments();
    },

    // ── Modal ─────────────────────────────────────────────────────────────
    openModal(tab = 'login') {
        document.getElementById('auth-modal').classList.add('open');
        this.switchTab(tab);
        setTimeout(() => document.getElementById('auth-name').focus(), 50);
    },

    closeModal() {
        document.getElementById('auth-modal').classList.remove('open');
        document.getElementById('auth-message').textContent = '';
        document.getElementById('auth-form').reset();
    },

    switchTab(tab) {
        const isLogin = tab === 'login';
        document.getElementById('tab-login').classList.toggle('active', isLogin);
        document.getElementById('tab-signin').classList.toggle('active', !isLogin);
        document.getElementById('auth-submit').textContent =
            isLogin ? 'LOG IN' : 'CREATE ACCOUNT';
        document.getElementById('auth-modal').dataset.mode = tab;
        document.getElementById('auth-message').textContent = '';

        // Show / hide signup stats fields
        const signupFields = document.getElementById('auth-signup-fields');
        if (signupFields) {
            signupFields.style.display = isLogin ? 'none' : 'block';
            ['auth-hours', 'auth-faceit', 'auth-premier'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.required = !isLogin;
            });
        }
    },

    showMessage(text, isError = true) {
        const el = document.getElementById('auth-message');
        el.textContent = text;
        el.className = 'auth-message ' + (isError ? 'is-error' : 'is-success');
    },

    setSubmitState(loading, mode) {
        const btn = document.getElementById('auth-submit');
        btn.disabled = loading;
        btn.textContent = loading
            ? 'CONNECTING...'
            : mode === 'login' ? 'LOG IN' : 'CREATE ACCOUNT';
    },

    // ── Events ────────────────────────────────────────────────────────────
    bindEvents() {
        document.getElementById('auth-btn')
            .addEventListener('click', () => this.openModal('login'));
        document.getElementById('auth-close')
            .addEventListener('click', () => this.closeModal());
        document.getElementById('auth-modal')
            .addEventListener('click', e => {
                if (e.target.id === 'auth-modal') this.closeModal();
            });
        document.getElementById('tab-login')
            .addEventListener('click', () => this.switchTab('login'));
        document.getElementById('tab-signin')
            .addEventListener('click', () => this.switchTab('signin'));
        document.getElementById('logout-btn')
            .addEventListener('click', () => this.logout());

        document.getElementById('auth-form')
            .addEventListener('submit', async e => {
                e.preventDefault();
                const name = document.getElementById('auth-name').value.trim();
                const mode = document.getElementById('auth-modal').dataset.mode;

                this.setSubmitState(true, mode);
                try {
                    let data;
                    if (mode === 'login') {
                        data = await this.login(name);
                    } else {
                        const hours     = parseInt(document.getElementById('auth-hours').value, 10);
                        const faceitElo = parseInt(document.getElementById('auth-faceit').value, 10);
                        const premierElo = parseInt(document.getElementById('auth-premier').value, 10);
                        if (!hours && hours !== 0) {
                            this.showMessage('In-game hours are required.', true);
                            this.setSubmitState(false, mode);
                            return;
                        }
                        if (!faceitElo) {
                            this.showMessage('Faceit Elo is required.', true);
                            this.setSubmitState(false, mode);
                            return;
                        }
                        if (!premierElo && premierElo !== 0) {
                            this.showMessage('Premier Elo is required.', true);
                            this.setSubmitState(false, mode);
                            return;
                        }
                        data = await this.signup(name, hours, faceitElo, premierElo);
                    }

                    if (data.error) {
                        this.showMessage(data.error, true);
                        this.setSubmitState(false, mode);
                    } else {
                        this.showMessage(`Welcome, ${data.user.name}!`, false);
                        setTimeout(() => {
                            this.setLoggedIn(data.user);
                            this.closeModal();
                        }, 900);
                    }
                } catch (err) {
                    this.showMessage(
                        'Cannot reach the server. Make sure the backend is running.', true
                    );
                    this.setSubmitState(false, mode);
                }
            });

        // Close on Escape key
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape') this.closeModal();
        });
    }
};

