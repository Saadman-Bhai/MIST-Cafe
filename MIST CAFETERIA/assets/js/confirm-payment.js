
document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const confirmOrderBtn = document.getElementById('confirmOrderBtn');
  const orderItemsContainer = document.getElementById('confirmOrderItems');
  const totalAmountElement = document.getElementById('confirmTotalAmount');
  const deliveryDetails = document.getElementById('deliveryDetails');

  // Load order data from session storage
  const userInfo = JSON.parse(sessionStorage.getItem('userInfo')) || {};
  const order = JSON.parse(sessionStorage.getItem('order')) || { items: [] };

  // Display order summary with consistent BDT format
  function displayOrderSummary() {
    orderItemsContainer.innerHTML = '';
    
    if (order.items.length === 0) {
      orderItemsContainer.innerHTML = '<p>No items in order</p>';
      return;
    }
    
    order.items.forEach(item => {
      const itemElement = document.createElement('div');
      itemElement.className = 'order-item';
      itemElement.innerHTML = `
        <span>${item.quantity}x ${item.name} (${item.price} BDT)</span>
        <span>${item.price * item.quantity} BDT</span>
      `;
      orderItemsContainer.appendChild(itemElement);
    });
    
    if (order.delivery) {
      const deliveryElement = document.createElement('div');
      deliveryElement.className = 'order-item';
      deliveryElement.innerHTML = `
        <span>Delivery Fee</span>
        <span>5 BDT</span>
      `;
      orderItemsContainer.appendChild(deliveryElement);
    }
    
    totalAmountElement.textContent = `${order.total} BDT`;
  }

  // Display delivery information
  function displayDeliveryInfo() {
    deliveryDetails.innerHTML = `
      <p><strong>Name:</strong> ${userInfo.name || 'Not provided'}</p>
      <p><strong>Department:</strong> ${userInfo.dept || 'Not provided'}</p>
      <p><strong>Location:</strong> Tower ${userInfo.tower || '--'}, Room ${userInfo.room || '--'}</p>
      <p><strong>Delivery Type:</strong> ${order.delivery ? 'Classroom Delivery (+5 BDT)' : 'Cafeteria Pickup'}</p>
    `;
  }

  // Save order to localStorage with proper formatting
  function saveOrder(orderData) {
    try {
      const orders = JSON.parse(localStorage.getItem('mist_orders')) || [];
      
      const newOrder = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        name: orderData.name,
        dept: orderData.dept,
        tower: orderData.tower,
        room: orderData.room,
        items: orderData.items.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          displayPrice: `${item.price} BDT`,
          displayTotal: `${item.price * item.quantity} BDT`
        })),
        delivery: orderData.delivery,
        total: orderData.total,
        displayTotal: `${orderData.total} BDT`,
        paymentMethod: orderData.paymentMethod,
        bkashNumber: orderData.bkashNumber,
        bkashTrxID: orderData.bkashTrxID,
        status: 'Pending'
      };

      orders.push(newOrder);
      localStorage.setItem('mist_orders', JSON.stringify(orders));
      return true;
    } catch (error) {
      console.error('Error saving order:', error);
      return false;
    }
  }

  // Handle order confirmation
  confirmOrderBtn.addEventListener('click', function(e) {
    e.preventDefault();
    
    const paymentMethod = document.querySelector('input[name="payment"]:checked');
    if (!paymentMethod) {
      alert('Please select a payment method');
      return;
    }

    const orderData = {
      ...userInfo,
      items: order.items,
      delivery: order.delivery,
      total: order.total,
      paymentMethod: paymentMethod.value
    };

    confirmOrderBtn.disabled = true;
    confirmOrderBtn.textContent = 'Processing...';

    if (paymentMethod.value === 'bKash') {
      // Store the order data temporarily
      sessionStorage.setItem('pendingOrder', JSON.stringify(orderData));
      // Redirect to bkash payment page
      window.location.href = `bkash-payment.html?amount=${order.total}`;
    } else {
      // For cash payment, save directly
      if (saveOrder(orderData)) {
        sessionStorage.removeItem('userInfo');
        sessionStorage.removeItem('order');
        window.location.href = 'thank-you.html';
      } else {
        alert(
          'Order received! Please show this to staff:\n\n' +
          `Name: ${userInfo.name}\n` +
          `Items: ${order.items.map(i => `${i.quantity}x ${i.name} (${i.price} BDT)`).join('\n')}\n` +
          `Total: ${order.total} BDT`
        );
        confirmOrderBtn.disabled = false;
        confirmOrderBtn.textContent = 'Confirm Order';
      }
    }
  });

  // Initialize page
  displayOrderSummary();
  displayDeliveryInfo();
});














