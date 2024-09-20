document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form');

    form.addEventListener('submit', async (e) => {
        e.preventDefault(); // Evita o envio do formulário padrão

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (data.success) {
                // Armazena o userId no localStorage
                localStorage.setItem('userId', data.userId);

                // Redireciona para o dashboard do usuário
                window.location.href = 'user-dashboard.html';
            } else {
                alert('Erro ao fazer login: ' + data.message); // Exibe o erro
            }
        } catch (error) {
            alert('Erro ao fazer login: ' + error.message); // Em caso de erro na requisição
        }
    });
});
