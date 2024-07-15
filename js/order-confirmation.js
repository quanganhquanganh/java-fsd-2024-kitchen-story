document.addEventListener('DOMContentLoaded', () => {
  const orderDetails = JSON.parse(localStorage.getItem('orderDetails'));
  const orderConfirmation = document.getElementById('order-confirmation');

  if (!orderDetails) {
      orderConfirmation.innerHTML = '<p>No order details found.</p>';
      return;
  }

  const orderNumber = Math.floor(Math.random() * 1000000) + 1;

  orderConfirmation.innerHTML = `
      <div class="alert alert-success" role="alert">
          Your order has been placed successfully! Order number: #${orderNumber}
      </div>
      <h3>Order Details</h3>
      <table class="table">
          <thead>
              <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Subtotal</th>
              </tr>
          </thead>
          <tbody>
              ${orderDetails.items.map(item => `
                  <tr>
                      <td>${item.name}</td>
                      <td>${item.quantity}</td>
                      <td>$${item.price.toFixed(2)}</td>
                      <td>$${(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
              `).join('')}
          </tbody>
          <tfoot>
              <tr>
                  <th colspan="3">Total</th>
                  <th>$${orderDetails.total.toFixed(2)}</th>
              </tr>
          </tfoot>
      </table>
      <h3>Shipping Information</h3>
      <p><strong>Name:</strong> ${orderDetails.shipping.name}</p>
      <p><strong>Address:</strong> ${orderDetails.shipping.address}</p>
      <p><strong>City:</strong> ${orderDetails.shipping.city}</p>
      <p><strong>ZIP Code:</strong> ${orderDetails.shipping.zip}</p>
  `;

  // Clear the cart and order details from localStorage
  localStorage.removeItem('cart');
  localStorage.removeItem('orderDetails');
});