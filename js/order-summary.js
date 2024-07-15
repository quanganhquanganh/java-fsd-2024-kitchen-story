document.addEventListener('DOMContentLoaded', () => {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const orderSummary = document.getElementById('order-summary');
  const shippingForm = document.getElementById('shipping-form');

  function renderOrderSummary() {
      if (cart.length === 0) {
          orderSummary.innerHTML = '<p>Your cart is empty.</p>';
          return;
      }

      const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

      orderSummary.innerHTML = `
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
                  ${cart.map(item => `
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
                      <th>$${total.toFixed(2)}</th>
                  </tr>
              </tfoot>
          </table>
      `;
  }

  renderOrderSummary();

  shippingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const orderDetails = {
          items: cart,
          total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
          shipping: {
              name: document.getElementById('name').value,
              address: document.getElementById('address').value,
              city: document.getElementById('city').value,
              zip: document.getElementById('zip').value
          }
      };
      localStorage.setItem('orderDetails', JSON.stringify(orderDetails));
      window.location.href = 'order-confirmation.html';
  });
});