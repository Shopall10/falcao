document.getElementById("admin-login-form").addEventListener("submit", function(e) {
    e.preventDefault();  // Impede o envio padrão do formulário
    console.log("Formulário enviado!");  // Adicione este log

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    console.log("Username:", username);  // Adicione este log
    console.log("Password:", password);  // Adicione este log

    fetch('/admin/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Resposta do Servidor:', data);  // Adicione este log
        if (data.success) {
            window.location.href = "admin.html"; // Redireciona para a página do admin
        } else {
            document.getElementById("error-message").innerText = "Login falhou. Verifique suas credenciais.";
        }
    })
    .catch(error => {
        console.error('Erro:', error);  // Verifique o erro aqui
        document.getElementById("error-message").innerText = "Ocorreu um erro. Tente novamente mais tarde.";
    });
});
