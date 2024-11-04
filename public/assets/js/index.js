new Vue({
    el: '#app',
    data: {
        user: null,
        tasks: [] // Массив задач
    },
    methods: {
        // Форматирует дату для отображения
        formatDueDate(dueDate) {
            return new Date(dueDate).toLocaleString();
        },

        // Проверяет, просрочена ли задача
        isOverdue(dueDate) {
            const now = new Date();
            const due = new Date(dueDate);
            return due < now; // true, если дата выполнения задачи раньше текущей даты
        },
        async loadUserInfo() {
            const token = localStorage.getItem('token');
            if (!token) {
                window.location.href = '/auth/login';
                return;
            }
            try {
                const response = await fetch('/api/auth/me', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.ok) {
                    this.user = await response.json();
                } else {
                    window.location.href = '/auth/login';
                }
            } catch (error) {
                console.error('Ошибка при запросе данных пользователя:', error);
                window.location.href = '/auth/login';
            }
        },
        logout() {
            localStorage.removeItem('token');
            this.user = null;
            window.location.href = '/auth/login';
        },

        // Загружает задачи с сервера
        async loadTasks() {
            const token = localStorage.getItem('token');
            if (!token) {
                window.location.href = '/login.html'; // Редирект на страницу логина, если нет токена
                return;
            }

            try {
                const response = await fetch('/api/tasks', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.ok) {
                    this.tasks = await response.json();
                } else {
                    alert('Не удалось загрузить задачи');
                }
            } catch (error) {
                console.error('Ошибка при загрузке задач:', error);
            }
        }
    },
    async mounted() {
        await this.loadUserInfo();
        if (this.user) {
            this.loadTasks();
        }
    }
});
