
document.addEventListener('DOMContentLoaded', function() {
  const ordersTable = document.getElementById('orders-table-body');
  const refreshBtn = document.getElementById('refresh-btn');
  const clearBtn = document.getElementById('clear-btn');
  const printBtn = document.getElementById('print-btn');

  // Load orders from localStorage
  function loadOrders() {
    const orders = JSON.parse(localStorage.getItem('mist_orders')) || [];
    renderOrders(orders);
  }

  // Render orders in table format
  function renderOrders(orders) {
    ordersTable.innerHTML = orders.map(order => {
      // Payment method details
      let paymentDetails = '';
      const paymentClass = order.paymentMethod === 'bKash' ? 'bkash' : 'cash';
      
      if (order.paymentMethod === 'bKash') {
        paymentDetails = `
          <div class="payment-info">
            <span class="payment-method ${paymentClass}">bKash</span>
            <div class="payment-details">
              <small>Number: ${order.bkashPhone || 'N/A'}</small><br>
              <small>TrxID: ${order.bkashTrxId || 'N/A'}</small>
            </div>
            ${order.status === 'Pending Verification' ? 
              '<span class="verification-badge warning">Pending</span>' : 
              '<span class="verification-badge success">Verified</span>'}
          </div>
        `;
      } else {
        paymentDetails = `
          <span class="payment-method ${paymentClass}">Cash</span>
          <span class="verification-badge success">N/A</span>
        `;
      }

      // Action buttons
      let actionButtons = '';
      if (order.paymentMethod === 'bKash' && order.status === 'Pending Verification') {
        actionButtons = `
          <button class="btn verify-btn" data-id="${order.id}">Verify Payment</button>
          <button class="btn complete-btn" data-id="${order.id}">✓ Complete</button>
        `;
      } else {
        actionButtons = `
          <button class="btn complete-btn" data-id="${order.id}">✓ Complete</button>
        `;
      }

      return `
      <tr>
        <td>${order.id}</td>
        <td>${order.name}</td>
        <td>${order.dept}</td>
        <td>Tower ${order.tower}, Room ${order.room}</td>
        <td>
          <ul>
            ${order.items.map(item => `
              <li>${item.quantity}x ${item.name} (${item.price * item.quantity} BDT)</li>
            `).join('')}
          </ul>
        </td>
        <td>${order.total} BDT</td>
        <td>${paymentDetails}</td>
        <td>${new Date(order.timestamp).toLocaleTimeString()}</td>
        <td class="no-print">${actionButtons}</td>
      </tr>
    `}).join('');

    // Add event listeners
    document.querySelectorAll('.complete-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        completeOrder(this.dataset.id);
      });
    });

    document.querySelectorAll('.verify-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        verifyPayment(this.dataset.id);
      });
    });
  }

  // Verify bKash payment
  function verifyPayment(orderId) {
    const orders = JSON.parse(localStorage.getItem('mist_orders')) || [];
    const orderIndex = orders.findIndex(order => order.id == orderId);
    
    if (orderIndex !== -1) {
      if (confirm(`Verify this payment?\n\nNumber: ${orders[orderIndex].bkashPhone}\nTrxID: ${orders[orderIndex].bkashTrxId}`)) {
        orders[orderIndex].status = 'Verified';
        localStorage.setItem('mist_orders', JSON.stringify(orders));
        loadOrders();
      }
    }
  }

  // Mark order as complete
  function completeOrder(orderId) {
    const orders = JSON.parse(localStorage.getItem('mist_orders')) || [];
    const updatedOrders = orders.filter(order => order.id != orderId);
    localStorage.setItem('mist_orders', JSON.stringify(updatedOrders));
    loadOrders();
  }

  // Clear all orders
  clearBtn.addEventListener('click', function() {
    if (confirm('Are you sure you want to clear ALL orders?')) {
      localStorage.removeItem('mist_orders');
      loadOrders();
    }
  });

  // Print orders
  printBtn.addEventListener('click', function() {
    window.print();
  });

  // Refresh button
  refreshBtn.addEventListener('click', loadOrders);

  // Initial load
  loadOrders();
});