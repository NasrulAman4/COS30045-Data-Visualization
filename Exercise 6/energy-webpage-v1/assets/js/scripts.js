document.addEventListener('DOMContentLoaded', () => {
  // 1. Dynamic Footer Year
  const yearSpan = document.getElementById('current-year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // 2. Accordion Functionality for FAQ Section
  const accordionHeaders = document.querySelectorAll('.accordion-header');

  accordionHeaders.forEach((header) => {
    header.addEventListener('click', () => {
      const parentItem = header.parentElement;

      // Close all other items (Single open behavior)
      document.querySelectorAll('.accordion-item').forEach((item) => {
        if (item !== parentItem) {
          item.classList.remove('active');
        }
      });

      // Toggle current item
      parentItem.classList.toggle('active');
    });
  });
});

// ==========================================
// Interactive Appliance Energy Calculator
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  const calculatorForm = document.getElementById('energy-calculator');
  
  // If the calculator form doesn't exist on this page, stop running the script
  if (!calculatorForm) return;

  calculatorForm.addEventListener('submit', function(event) {
    // Prevent the form from refreshing the page
    event.preventDefault();

    // 1. Read DOM elements
    const wattsInput = document.getElementById('calc-watts').value;
    const hoursInput = document.getElementById('calc-hours').value;
    const priceInput = document.getElementById('calc-price').value;
    
    const errorContainer = document.getElementById('calc-error');
    const resultsPanel = document.getElementById('calc-results');

    // Convert inputs to floating-point numbers
    const watts = parseFloat(wattsInput);
    const hours = parseFloat(hoursInput);
    const price = parseFloat(priceInput);

    // Reset UI states
    errorContainer.style.display = 'none';
    errorContainer.textContent = '';
    resultsPanel.style.display = 'none';

    // 2. Input Validation
    // Check if values are numbers, greater than 0, and hours don't exceed 24
    if (isNaN(watts) || watts <= 0) {
      showError('Please enter a valid power wattage greater than 0.');
      return;
    }
    if (isNaN(hours) || hours <= 0 || hours > 24) {
      showError('Please enter valid daily hours between 0.1 and 24.');
      return;
    }
    if (isNaN(price) || price <= 0) {
      showError('Please enter a valid electricity price greater than 0.');
      return;
    }

    // 3. Calculation Logic
    // kWh Formula: (Watts * Hours) / 1000
    const dailyKwh = (watts * hours) / 1000;
    const yearlyKwh = dailyKwh * 365;
    
    // Cost Formula: kWh * (Price in cents / 100 to get dollars)
    const yearlyCost = yearlyKwh * (price / 100);

    // 4. Update existing DOM elements
    document.getElementById('res-daily-kwh').textContent = dailyKwh.toFixed(2) + ' kWh';
    document.getElementById('res-yearly-kwh').textContent = yearlyKwh.toFixed(2) + ' kWh';
    document.getElementById('res-yearly-cost').textContent = '$' + yearlyCost.toFixed(2);

    // Show the results panel
    resultsPanel.style.display = 'block';
  });

  // Helper function to display errors gracefully
  function showError(message) {
    const errorContainer = document.getElementById('calc-error');
    errorContainer.textContent = message;
    errorContainer.style.display = 'block';
  }
});