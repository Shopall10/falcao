document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/admin/pending-registrations');
        const data = await response.json();
        
        console.log('Dados recebidos:', data); // Adicione este log

        const tableBody = document.querySelector('#pending-users tbody');
        tableBody.innerHTML = '';

        data.forEach(registration => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${registration.name || 'N/A'}</td>
                <td>${registration.email}</td>
                <td>Pendente</td>
                <td>
                    <button class="btn approve" onclick="approveUser('${registration.email}')">Aprovar</button>
                    <button class="btn reject" onclick="rejectUser('${registration.email}')">Rejeitar</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Erro ao carregar usuários pendentes', error);
    }
});

async function approveUser(email) {
    try {
        const response = await fetch('/admin/approve-registration', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        const data = await response.json();

        console.log('Resposta da aprovação:', data); // Adicione este log

        if (data.success) {
            alert('Usuário aprovado');
            location.reload(); // Recarregar a página para atualizar a lista
        } else {
            alert('Erro ao aprovar usuário');
        }
    } catch (error) {
        console.error('Erro ao aprovar usuário', error);
    }
}

async function rejectUser(email) {
    try {
        const response = await fetch('/admin/delete-registration', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        const data = await response.json();

        console.log('Resposta da rejeição:', data); // Adicione este log

        if (data.success) {
            alert('Usuário rejeitado');
            location.reload(); // Recarregar a página para atualizar a lista
        } else {
            alert('Erro ao rejeitar usuário');
        }
    } catch (error) {
        console.error('Erro ao rejeitar usuário', error);
    }
}














// codigo para listar os usuarios com registro aceite


document.addEventListener('DOMContentLoaded', () => {
    loadApprovedUsers();
    loadPendingUsers();
    loadProducts();
});

function loadApprovedUsers() {
    fetch('/admin/approved-users')
        .then(response => response.json())
        .then(data => {
            const allUsersTableBody = document.querySelector('#all-users tbody');
            allUsersTableBody.innerHTML = ''; // Limpa a tabela antes de carregar os novos dados

            data.forEach(user => {
                const row = document.createElement('tr');

                const nameCell = document.createElement('td');
                nameCell.textContent = user.name || 'N/A';
                row.appendChild(nameCell);

                const emailCell = document.createElement('td');
                emailCell.textContent = user.email;
                row.appendChild(emailCell);

                const actionCell = document.createElement('td');
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Excluir';
                deleteButton.onclick = () => deleteUser(user.email);
                actionCell.appendChild(deleteButton);
                row.appendChild(actionCell);

                allUsersTableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Erro ao carregar usuários aprovados:', error);
        });
}

function deleteUser(email) {
    fetch('/admin/delete-user', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Usuário excluído com sucesso');
            loadApprovedUsers(); // Recarrega a lista de usuários após exclusão
        } else {
            alert('Erro ao excluir usuário');
        }
    })
    .catch(error => {
        console.error('Erro ao excluir usuário:', error);
    });
}

// Função para carregar usuários pendentes
function loadPendingUsers() {
    // Implementação semelhante a loadApprovedUsers
}

// Função para carregar produtos
function loadProducts() {
    // Implementação semelhante a loadApprovedUsers
}































