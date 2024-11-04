new Vue({
    el: '#header',
    data: {
        user: null
    },
    methods: {
        async loadUserInfo() {
            const token = localStorage.getItem('token');
            if (!token) {
                window.location.href = '/login.html';
                return;
            }
            try {
                const response = await fetch('/api/auth/me', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.ok) {
                    this.user = await response.json();
                } else {
                    window.location.href = '/login.html';
                }
            } catch (error) {
                console.error('Ошибка при запросе данных пользователя:', error);
                window.location.href = '/login.html';
            }
        },
        logout() {
            localStorage.removeItem('token');
            this.user = null;
            window.location.href = '/login.html';
        }
    },
    async mounted() {
        await this.loadUserInfo();
    }
});
