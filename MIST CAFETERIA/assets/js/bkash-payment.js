
document.addEventListener('DOMContentLoaded', function() {
  // Get amount from URL
  const urlParams = new URLSearchParams(window.location.search);
  const amount = urlParams.get('amount');
  document.getElementById('paymentAmount').textContent = `${amount}৳`;

  // Get pending order from session storage
  const pendingOrder = JSON.parse(sessionStorage.getItem('pendingOrder'));
  if (!pendingOrder) {
    alert('No pending order found. Please start over.');
    window.location.href = 'index.html';
    return;
  }

  // Form submission
  const form = document.getElementById('bkashForm');
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Validate form
    const phone = form.phone.value.trim();
    const trxId = form.trxId.value.trim();
    
    if (!phone || !/^01\d{9}$/.test(phone)) {
      alert('Please enter a valid bKash phone number (01XXXXXXXXX)');
      return;
    }
    
    if (!trxId) {
      alert('Please enter your transaction ID');
      return;
    }

    // Add payment details to order
    pendingOrder.bkashPhone = phone;
    pendingOrder.bkashTrxId = trxId;
    
    try {
      // Save to localStorage
      const orders = JSON.parse(localStorage.getItem('mist_orders')) || [];
      pendingOrder.id = Date.now();
      pendingOrder.timestamp = new Date().toISOString();
      pendingOrder.status = 'Pending Verification';
      orders.push(pendingOrder);
      localStorage.setItem('mist_orders', JSON.stringify(orders));

      // Clear session and redirect
      sessionStorage.removeItem('pendingOrder');
      window.location.href = 'thank-you.html';
    } catch (error) {
      console.error('Error:', error);
      alert('Payment submission failed. Please contact support.');
    }
  });

  // Cancel button
  document.getElementById('cancelBtn').addEventListener('click', function() {
    window.location.href = 'confirm-payment.html';
  });
});