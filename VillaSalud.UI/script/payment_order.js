document.addEventListener('DOMContentLoaded', function () {
    // DOM elements
    const orderForm = document.getElementById('orderForm');
    const paymentInstructions = document.getElementById('paymentInstructions');
    const generateOrderBtn = document.getElementById('generateOrder');
    const backButton = document.getElementById('backButton');
    const submitReceiptBtn = document.getElementById('submitReceipt');
    const receiptForm = document.getElementById('receiptForm');
    const successMessage = document.getElementById('successMessage');
    const loader = document.querySelector('.loader');

    // Form inputs
    const fullNameInput = document.getElementById('fullName');
    const emailInput = document.getElementById('email');
    const orderAmountInput = document.getElementById('orderAmount');
    const downpaymentTypeSelect = document.getElementById('downpaymentType');
    const paymentMethodSelect = document.getElementById('paymentMethod');
    const receiptUpload = document.getElementById('receiptUpload');

    // Error messages
    const fullNameError = document.getElementById('fullNameError');
    const emailError = document.getElementById('emailError');
    const orderAmountError = document.getElementById('orderAmountError');
    const receiptError = document.getElementById('receiptError');

    // Display elements
    const totalAmountSpan = document.getElementById('totalAmount');
    const downpaymentAmountSpan = document.getElementById('downpaymentAmount');
    const paymentBadge = document.getElementById('paymentBadge');
    const customerNameSpan = document.getElementById('customerName');
    const paymentAmountSpans = document.querySelectorAll('.payment-amount');
    const customerNameSpans = document.querySelectorAll('.customer-name');
    const referenceNumberSpan = document.getElementById('referenceNumber');
    const referenceNumberSpans = document.querySelectorAll('.reference-number');

    const gcashInstructions = document.getElementById('gcashInstructions');
    const bankInstructions = document.getElementById('bankInstructions');

    // Generate a unique order reference number
    function generateReferenceNumber() {
        const timestamp = new Date().getTime().toString().slice(-6);
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        return 'ORD-' + timestamp + '-' + random;
    }

    // Validate email format
    function isValidEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email.toLowerCase());
    }

    // Validate the form
    function validateForm() {
        let isValid = true;

        // Validate full name
        if (fullNameInput.value.trim() === '') {
            fullNameError.style.display = 'block';
            fullNameInput.classList.add('error');
            isValid = false;
        } else {
            fullNameError.style.display = 'none';
            fullNameInput.classList.remove('error');
        }

        // Validate email
        if (!isValidEmail(emailInput.value.trim())) {
            emailError.style.display = 'block';
            emailInput.classList.add('error');
            isValid = false;
        } else {
            emailError.style.display = 'none';
            emailInput.classList.remove('error');
        }

        // Validate order amount
        const amount = parseFloat(orderAmountInput.value);
        if (isNaN(amount) || amount < 100) {
            orderAmountError.style.display = 'block';
            orderAmountInput.classList.add('error');
            isValid = false;
        } else {
            orderAmountError.style.display = 'none';
            orderAmountInput.classList.remove('error');
        }

        return isValid;
    }

    // Calculate downpayment amount based on the selected option
    function calculateDownpayment(orderAmount) {
        const downpaymentType = downpaymentTypeSelect.value;
        let downpayment = 0;
        let badgeText = '';

        switch (downpaymentType) {
            case 'half':
                downpayment = orderAmount * 0.5;
                badgeText = '50% PAYMENT';
                break;
            case 'thirty':
                downpayment = orderAmount * 0.3;
                badgeText = '30% PAYMENT';
                break;
            default:
                downpayment = orderAmount;
                badgeText = 'FULL PAYMENT';
        }

        paymentBadge.textContent = badgeText;
        return downpayment;
    }

    // Update payment instructions and order summary
    function updateOrderDetails() {
        const fullName = fullNameInput.value.trim();
        const orderAmount = parseFloat(orderAmountInput.value);
        const downpaymentAmount = calculateDownpayment(orderAmount);

        // Update the payment summary
        totalAmountSpan.textContent = orderAmount.toFixed(2);
        downpaymentAmountSpan.textContent = downpaymentAmount.toFixed(2);
        
        // Update all payment amount references
        paymentAmountSpans.forEach(span => {
            span.textContent = downpaymentAmount.toFixed(2);
        });

        // Update customer name
        customerNameSpan.textContent = fullName;
        customerNameSpans.forEach(span => {
            span.textContent = fullName;
        });

        // Select the appropriate payment instructions
        if (paymentMethodSelect.value === 'gcash') {
            gcashInstructions.style.display = 'block';
            bankInstructions.style.display = 'none';
        } else {
            gcashInstructions.style.display = 'none';
            bankInstructions.style.display = 'block';
        }

        // Generate a new reference number
        const referenceNumber = generateReferenceNumber();
        referenceNumberSpan.textContent = referenceNumber;
        referenceNumberSpans.forEach(span => {
            span.textContent = referenceNumber;
        });
    }

    // Reset form validation styling
    function resetFormStyles() {
        fullNameError.style.display = 'none';
        emailError.style.display = 'none';
        orderAmountError.style.display = 'none';
        receiptError.style.display = 'none';
        
        fullNameInput.classList.remove('error');
        emailInput.classList.remove('error');
        orderAmountInput.classList.remove('error');
    }

    // Show the receipt upload loading animation
    function showLoader() {
        loader.style.display = 'block';
        submitReceiptBtn.disabled = true;
    }

    // Hide the receipt upload loading animation
    function hideLoader() {
        loader.style.display = 'none';
        submitReceiptBtn.disabled = false;
    }

    // Event Listeners
    
    // Handle payment order generation
    generateOrderBtn.addEventListener('click', function () {
        resetFormStyles();
        
        if (validateForm()) {
            orderForm.style.display = 'none';
            paymentInstructions.style.display = 'block';
            updateOrderDetails();
            
            // Scroll to top of payment instructions
            window.scrollTo({
                top: paymentInstructions.offsetTop - 20,
                behavior: 'smooth'
            });
        }
    });

    // Live update of payment instructions when payment method changes
    paymentMethodSelect.addEventListener('change', function() {
        if (paymentInstructions.style.display === 'block') {
            updateOrderDetails();
        }
    });

    // Live update of payment amounts when downpayment type changes
    downpaymentTypeSelect.addEventListener('change', function() {
        if (paymentInstructions.style.display === 'block') {
            updateOrderDetails();
        }
    });

    // Handle going back to the order form
    backButton.addEventListener('click', function () {
        orderForm.style.display = 'block';
        paymentInstructions.style.display = 'none';
        successMessage.style.display = 'none';
        
        // Reset file input
        receiptUpload.value = '';
        receiptError.style.display = 'none';
    });

    // Handle receipt submission
    receiptForm.addEventListener('submit', function (e) {
        e.preventDefault();

        if (receiptUpload.files.length === 0) {
            receiptError.style.display = 'block';
            return;
        }

        // Hide error message
        receiptError.style.display = 'none';
        
        // Show loading animation
        showLoader();
        
        // Simulate receipt submission with a delay
        setTimeout(function() {
            hideLoader();
            
            // Show success message
            successMessage.style.display = 'block';
            
            // Hide the form
            receiptForm.style.display = 'none';
            
            // Scroll to success message
            window.scrollTo({
                top: successMessage.offsetTop - 20,
                behavior: 'smooth'
            });
        }, 1500);
    });
    
    // Input validation on blur
    fullNameInput.addEventListener('blur', function() {
        if (fullNameInput.value.trim() === '') {
            fullNameError.style.display = 'block';
            fullNameInput.classList.add('error');
        } else {
            fullNameError.style.display = 'none';
            fullNameInput.classList.remove('error');
        }
    });
    
    emailInput.addEventListener('blur', function() {
        if (!isValidEmail(emailInput.value.trim())) {
            emailError.style.display = 'block';
            emailInput.classList.add('error');
        } else {
            emailError.style.display = 'none';
            emailInput.classList.remove('error');
        }
    });
    
    orderAmountInput.addEventListener('blur', function() {
        const amount = parseFloat(orderAmountInput.value);
        if (isNaN(amount) || amount < 100) {
            orderAmountError.style.display = 'block';
            orderAmountInput.classList.add('error');
        } else {
            orderAmountError.style.display = 'none';
            orderAmountInput.classList.remove('error');
        }
    });
});