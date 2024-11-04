new Vue({
    el: '#task-app',
    data: {
        user: null,
        title: '',
        description: '',
        dueDate: '',
        tasks: [],
        isEditing: false,
        editingTaskId: null
    },
    methods: {
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
        async addTask() {
            let token = localStorage.getItem('token');
            let response = await fetch('/api/tasks', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: this.title,
                    description: this.description,
                    dueDate: this.dueDate,
                    completed: false,
                }),
            });

            if (response.ok) {
                const task = await response.json();
                this.tasks.push(task);
                this.resetForm();
            } else {
                const error = await response.json();
                alert(`Ошибка: ${error.message || 'Не удалось добавить задачу'}`);
            }
        },
        async updateTask() {
            let token = localStorage.getItem('token');
            let response = await fetch(`/api/tasks/${this.editingTaskId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: this.title,
                    description: this.description,
                    dueDate: this.dueDate,
                }),
            });

            if (response.ok) {
                const updatedTask = await response.json();
                const index = this.tasks.findIndex(task => task._id === this.editingTaskId);
                this.$set(this.tasks, index, updatedTask);
                this.resetForm();
                this.isEditing = false;
            } else {
                const error = await response.json();
                alert(`Ошибка: ${error.message || 'Не удалось обновить задачу'}`);
            }
        },
        async loadTasks() {
            let token = localStorage.getItem('token');
            let response = await fetch('/api/tasks', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                this.tasks = await response.json();
            } else {
                alert('Не удалось загрузить задачи');
            }
        },
        editTask(task) {
            this.title = task.title;
            this.description = task.description;
            this.dueDate = task.dueDate;
            this.editingTaskId = task._id;
            this.isEditing = true;
        },
        cancelEdit() {
            this.resetForm();
            this.isEditing = false;
        },
        async deleteTask(taskId) {
            const token = localStorage.getItem('token');

            const response = await fetch(`/api/tasks/${taskId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                this.tasks = this.tasks.filter(task => task._id !== taskId);
            } else {
                alert('Не удалось удалить задачу');
            }
        },
        resetForm() {
            this.title = '';
            this.description = '';
            this.dueDate = '';
            this.editingTaskId = null;
        },
        formatDueDate(dueDate) {
            return new Date(dueDate).toLocaleString();
        }
    },
    async mounted() {
        await this.loadUserInfo();
        if (this.user) {
            this.loadTasks();
        }
    }
});
