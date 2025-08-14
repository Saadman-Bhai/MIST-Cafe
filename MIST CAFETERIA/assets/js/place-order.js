// assets/js/place-order.js
document.addEventListener('DOMContentLoaded', function() {
  // Check if user info exists
  if (!sessionStorage.getItem('userInfo')) {
    window.location.href = 'index.html';
    return;
  }

  const menuContainer = document.getElementById('menuContainer');
  const orderItemsContainer = document.getElementById('orderItems');
  const totalAmountElement = document.getElementById('totalAmount');
  const continueBtn = document.getElementById('continueBtn');
  const deliveryCheckbox = document.getElementById('deliveryCheckbox');

  let order = {
    items: [],
    delivery: false,
    total: 0
  };

  // Load menu from JSON file
  fetch('data/menu.json')
    .then(response => response.json())
    .then(menuItems => {
      renderMenu(menuItems);
    })
    .catch(error => {
      console.error('Error loading menu:', error);
      // Fallback menu if JSON fails to load
      const fallbackMenu = [
        { id: 1, name: 'Burger', price: 60, image: 'assets/images/burger.jpg' },
        { id: 2, name: 'Sandwich', price: 70, image: 'assets/images/sandwich.jpg' },
        { id: 3, name: 'French Fries', price: 40, image: 'assets/images/fries.jpg' },
        { id: 4, name: 'Chicken Tehari', price: 50, image: 'assets/images/tehari.jpg' },
        { id: 5, name: 'Pizza Slice', price: 80, image: 'assets/images/pizza.jpg' },
        { id: 6, name: 'Chicken Roll', price: 45, image: 'assets/images/roll.jpg' }
      ];
      renderMenu(fallbackMenu);
    });

  function renderMenu(menuItems) {
    menuContainer.innerHTML = '';
    
    menuItems.forEach(item => {
      const menuItem = document.createElement('div');
      menuItem.className = 'menu-item';
      menuItem.setAttribute('data-id', item.id);
      menuItem.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="menu-item-image">
        <div class="menu-item-details">
          <h4>${item.name}</h4>
          <p>${item.price} BDT</p>
          <div class="quantity-controls">
            <button class="quantity-btn minus" data-id="${item.id}">-</button>
            <span class="quantity" data-id="${item.id}">0</span>
            <button class="quantity-btn plus" data-id="${item.id}">+</button>
          </div>
        </div>
      `;
      menuContainer.appendChild(menuItem);
    });

    // Event delegation for quantity buttons
    menuContainer.addEventListener('click', function(e) {
      const target = e.target;
      if (target.classList.contains('quantity-btn')) {
        const id = parseInt(target.getAttribute('data-id'));
        const isPlus = target.classList.contains('plus');
        updateOrder(id, isPlus);
      }
    });
  }

  // Delivery checkbox change
  deliveryCheckbox.addEventListener('change', function() {
    order.delivery = this.checked;
    calculateTotal();
    updateOrderSummary();
  });

  // Continue to payment
  continueBtn.addEventListener('click', function() {
    if (order.items.length === 0) {
      alert('Please add at least one item to your order');
      return;
    }
    
    // Store order in sessionStorage
    sessionStorage.setItem('order', JSON.stringify(order));
    window.location.href = 'confirm-payment.html';
  });

  function updateOrder(id, isPlus) {
    // Find the menu item container
    const menuItemElement = document.querySelector(`.menu-item[data-id="${id}"]`);
    const itemName = menuItemElement.querySelector('h4').textContent;
    const itemPrice = parseFloat(menuItemElement.querySelector('p').textContent.replace(' BDT', ''));
    
    // Find existing item in order
    const existingItem = order.items.find(item => item.id === id);
    
    if (isPlus) {
      if (existingItem) {
        existingItem.quantity++;
      } else {
        order.items.push({ 
          id: id,
          name: itemName,
          price: itemPrice,
          quantity: 1 
        });
      }
    } else {
      if (existingItem && existingItem.quantity > 0) {
        existingItem.quantity--;
        if (existingItem.quantity === 0) {
          order.items = order.items.filter(item => item.id !== id);
        }
      }
    }
    
    updateQuantityDisplay(id);
    calculateTotal();
    updateOrderSummary();
  }

  function updateQuantityDisplay(id) {
    const quantityElement = document.querySelector(`.quantity[data-id="${id}"]`);
    const item = order.items.find(item => item.id === id);
    quantityElement.textContent = item ? item.quantity : 0;
  }

  function calculateTotal() {
    order.total = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (order.delivery) {
      order.total += 5;
    }
  }

  function updateOrderSummary() {
    orderItemsContainer.innerHTML = '';
    
    if (order.items.length === 0) {
      orderItemsContainer.innerHTML = '<p>No items selected</p>';
      totalAmountElement.textContent = '0 BDT';
      return;
    }
    
    order.items.forEach(item => {
      if (item.quantity > 0) {
        const itemElement = document.createElement('div');
        itemElement.className = 'order-item';
        itemElement.innerHTML = `
          <span>${item.name} x${item.quantity}</span>
          <span>${item.price * item.quantity} BDT</span>
        `;
        orderItemsContainer.appendChild(itemElement);
      }
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
});

















