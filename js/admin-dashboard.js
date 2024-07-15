const API_URL = 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', () => {
    if (!localStorage.getItem('adminLoggedIn')) {
        window.location.href = 'admin-login.html';
        return;
    }

    const logoutBtn = document.getElementById('logout-btn');
    const addItemForm = document.getElementById('add-item-form');
    const editItemForm = document.getElementById('edit-item-form');
    const foodItemsList = document.getElementById('food-items-list');

    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('adminLoggedIn');
        window.location.href = '../index.html';
    });

    addItemForm.addEventListener('submit', addItem);
    editItemForm.addEventListener('submit', editItem);

    loadFoodItems();
});

async function loadFoodItems() {
    try {
        const response = await fetch(`${API_URL}/food_items`);
        const foodItems = await response.json();
        renderFoodItems(foodItems);
    } catch (error) {
        console.error('Error loading food items:', error);
        alert('Failed to load food items. Please try again.');
    }
}

function renderFoodItems(foodItems) {
    const foodItemsList = document.getElementById('food-items-list');
    foodItemsList.innerHTML = foodItems.map(item => `
        <tr>
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td>${item.category}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="openEditModal(${item.id})">Edit</button>
                <button class="btn btn-sm btn-danger" onclick="deleteItem(${item.id})">Delete</button>
            </td>
        </tr>
    `).join('');
}

async function addItem(e) {
    e.preventDefault();
    const name = document.getElementById('item-name').value;
    const price = parseFloat(document.getElementById('item-price').value);
    const category = document.getElementById('item-category').value;

    try {
        const response = await fetch(`${API_URL}/food_items`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, price, category })
        });

        if (response.ok) {
            loadFoodItems();
            document.getElementById('add-item-form').reset();
            bootstrap.Modal.getInstance(document.getElementById('addItemModal')).hide();
        } else {
            throw new Error('Failed to add item');
        }
    } catch (error) {
        console.error('Error adding item:', error);
        alert('Failed to add item. Please try again.');
    }
}

async function openEditModal(itemId) {
    try {
        const response = await fetch(`${API_URL}/food_items/${itemId}`);
        const item = await response.json();

        document.getElementById('edit-item-id').value = item.id;
        document.getElementById('edit-item-name').value = item.name;
        document.getElementById('edit-item-price').value = item.price;
        document.getElementById('edit-item-category').value = item.category;

        const editItemModal = new bootstrap.Modal(document.getElementById('editItemModal'));
        editItemModal.show();
    } catch (error) {
        console.error('Error fetching item details:', error);
        alert('Failed to load item details. Please try again.');
    }
}

async function editItem(e) {
    e.preventDefault();
    const id = document.getElementById('edit-item-id').value;
    const name = document.getElementById('edit-item-name').value;
    const price = parseFloat(document.getElementById('edit-item-price').value);
    const category = document.getElementById('edit-item-category').value;

    try {
        const response = await fetch(`${API_URL}/food_items/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, price, category })
        });

        if (response.ok) {
            loadFoodItems();
            bootstrap.Modal.getInstance(document.getElementById('editItemModal')).hide();
        } else {
            throw new Error('Failed to update item');
        }
    } catch (error) {
        console.error('Error updating item:', error);
        alert('Failed to update item. Please try again.');
    }
}

async function deleteItem(itemId) {
    if (confirm('Are you sure you want to delete this item?')) {
        try {
            const response = await fetch(`${API_URL}/food_items/${itemId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                loadFoodItems();
            } else {
                throw new Error('Failed to delete item');
            }
        } catch (error) {
            console.error('Error deleting item:', error);
            alert('Failed to delete item. Please try again.');
        }
    }
}
