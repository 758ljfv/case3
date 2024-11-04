document.addEventListener('DOMContentLoaded', () => {
    // Проверяем наличие сообщения о регистрации
    const successMessage = localStorage.getItem('registrationSuccess');

    if (successMessage) {
        // Создаем элемент для отображения сообщения
        const messageDiv = document.createElement('div');
        messageDiv.className = 'alert alert-success'; // Используем bootstrap для оформления
        messageDiv.textContent = successMessage;

        // Вставляем сообщение в начало страницы
        const container = document.querySelector('#alert-container'); // Обёртка для содержимого страницы
        container.insertBefore(messageDiv, container.firstChild);

        // Удаляем сообщение из localStorage после отображения
        localStorage.removeItem('registrationSuccess');
    }

});

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token); // Сохраняем JWT в localStorage
        window.location.href = '/';
    } else {
        alert('Неверные учетные данные');
    }
});