document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('signup-form');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const phone = document.getElementById('phone').value;
        const storeOrSale = document.getElementById('store-or-sale').value;

        try {
            const response = await fetch('/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, phone, storeOrSale }),
            });

            const data = await response.json();

            if (data.success) {
                alert('Cadastro enviado para aprovação. Você será notificado quando for aprovado.');
                form.reset();
            } else {
                alert('Erro ao registrar usuário: ' + data.message);
            }
        } catch (error) {
            alert('Erro ao registrar usuário: ' + error.message);
        }
    });
});




