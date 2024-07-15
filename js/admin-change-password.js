const API_URL = 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', () => {
    if (!localStorage.getItem('adminLoggedIn')) {
        window.location.href = 'admin-login.html';
        return;
    }

    const changePasswordForm = document.getElementById('change-password-form');
    const logoutBtn = document.getElementById('logout-btn');

    changePasswordForm.addEventListener('submit', changePassword);

    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('adminLoggedIn');
        window.location.href = '../index.html';
    });
});

async function changePassword(e) {
    e.preventDefault();
    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (newPassword !== confirmPassword) {
        alert('New password and confirm password do not match.');
        return;
    }

    try {
        // Verify current password
        const adminResponse = await fetch(`${API_URL}/admin`);
        const adminData = await adminResponse.json();

        if (currentPassword !== adminData.password) {
            alert('Current password is incorrect.');
            return;
        }

        // Update password
        const response = await fetch(`${API_URL}/admin`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: newPassword })
        });

        if (response.ok) {
            alert('Password changed successfully.');
            window.location.href = 'admin-dashboard.html';
        } else {
            throw new Error('Failed to change password');
        }
    } catch (error) {
        console.error('Error changing password:', error);
        alert('Failed to change password. Please try again.');
    }
}
