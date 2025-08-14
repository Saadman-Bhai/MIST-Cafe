// assets/js/personal-info.js
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('personalForm');

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (validateForm()) {
      // Store user info in sessionStorage
      const formData = {
        name: form.name.value.trim(),
        dept: form.dept.value,
        tower: form.tower.value.trim(),
        room: form.room.value.trim()
      };
      
      sessionStorage.setItem('userInfo', JSON.stringify(formData));
      window.location.href = 'place-order.html';
    }
  });

  function validateForm() {
    let isValid = true;
    
    // Name validation
    if (!form.name.value.trim()) {
      showError('name', 'Full name is required');
      isValid = false;
    } else {
      clearError('name');
    }
    
    // Department validation
    if (!form.dept.value) {
      showError('dept', 'Please select your department');
      isValid = false;
    } else {
      clearError('dept');
    }
    
    // Tower validation
    if (!form.tower.value.trim()) {
      showError('tower', 'Tower number is required');
      isValid = false;
    } else if (!/^\d+$/.test(form.tower.value.trim())) {
      showError('tower', 'Please enter a valid tower number');
      isValid = false;
    } else {
      clearError('tower');
    }
    
    // Room validation
    if (!form.room.value.trim()) {
      showError('room', 'Room number is required');
      isValid = false;
    } else if (!/^\d+$/.test(form.room.value.trim())) {
      showError('room', 'Please enter a valid room number');
      isValid = false;
    } else {
      clearError('room');
    }
    
    return isValid;
  }
});
