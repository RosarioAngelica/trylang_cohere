document.addEventListener("DOMContentLoaded", function () {
    // Modal elements
    const packageModal = document.getElementById("packageModal");
    const addPackageModal = document.getElementById("addPackageModal");
    const editPackageModal = document.getElementById("editPackageModal");
    const successModal = document.getElementById("successModal");
    
    // Close buttons
    const closePackageModal = document.querySelector("#packageModal .close");
    const closeAddModal = document.getElementById("closeAddModal");
    const closeEditModal = document.getElementById("closeEditModal");
    const cancelAddPackage = document.getElementById("cancelAddPackage");
    const cancelEditPackage = document.getElementById("cancelEditPackage");
    const successOkBtn = document.getElementById("successOkBtn");
    
    // Buttons
    const addPackageBtn = document.getElementById("addPackageBtn");
    
    // Forms
    const addPackageForm = document.getElementById("addPackageForm");
    const editPackageForm = document.getElementById("editPackageForm");
    
    // Packages container
    const packagesContainer = document.getElementById("packagesContainer");

    // Package data storage with enhanced data structure
    const packages = {
        "Baptism Package": {
            name: "Baptism Package",
            price: "15000.00",
            images: [
                "../assets/baptismal1.jpg",
                "../assets/baptismal2.jpg",
                "../assets/baptismal3.jpg"
            ]
        },
        "Debut Package": {
            name: "Debut Package",
            price: "25000.00",
            images: [
                "../assets/debut1.jpg",
                "../assets/debut2.jpg",
                "../assets/debut3.jpg"
            ]
        },
        "Wedding Package": {
            name: "Wedding Package",
            description: "Make your dream wedding come true",
            price: "50000.00",
            images: [
                "../assets/wedding1.jpg",
                "../assets/wedding2.jpg",
                "../assets/wedding3.jpg"
            ]
        },
        "Kiddie Package": {
            name: "Kiddie Package",
            price: "12000.00",
            images: [
                "../assets/kiddie1.jpg",
                "../assets/kiddie2.jpg",
                "../assets/kiddie3.jpg"
            ]
        }
    };

    // Function to format price display
    function formatPrice(price) {
        return `₱${parseFloat(price).toLocaleString('en-PH', {minimumFractionDigits: 2})}`;
    }

    // Function to open package view modal
    function openPackageModal(packageName) {
        if (!packages[packageName]) {
            console.error("Package not found:", packageName);
            return;
        }

        const packageData = packages[packageName];
        document.getElementById("modalTitle").textContent = packageData.name;
        document.getElementById("modalPrice").textContent = formatPrice(packageData.price);
        
        document.getElementById("modalImg1").src = packageData.images[0];
        document.getElementById("modalImg2").src = packageData.images[1];
        document.getElementById("modalImg3").src = packageData.images[2];

        packageModal.style.display = "flex";
    }

    // Function to open edit package modal
    function openEditPackageModal(packageName) {
        if (!packages[packageName]) {
            console.error("Package not found:", packageName);
            return;
        }

        const packageData = packages[packageName];
        
        // Populate edit form
        document.getElementById("editPackageId").value = packageName;
        document.getElementById("editPackageName").value = packageData.name;
        document.getElementById("editPackagePrice").value = packageData.price;
        
        // Show current main image
        document.getElementById("currentMainImage").src = packageData.images[0];
        
        editPackageModal.style.display = "flex";
    }

    // Function to show success modal
    function showSuccessModal(message) {
        document.getElementById("successMessage").textContent = message;
        successModal.style.display = "flex";
    }

    // Function to create new package card
    function createPackageCard(packageData) {
        const packageCard = document.createElement('div');
        packageCard.className = 'package-card';
        packageCard.setAttribute('data-package', packageData.name);
        
        packageCard.innerHTML = `
            <img src="${packageData.images[0]}" alt="${packageData.name}">
            <h3>${packageData.name}</h3>
            <div class="package-details">
                <p class="package-price">${formatPrice(packageData.price)}</p>
            </div>
            <div class="buttons">
                <button class="btn view-package">View Package</button>
                <button class="btn edit-btn">Edit</button>
                <button class="btn delete-btn">Delete</button>
            </div>
        `;
        
        return packageCard;
    }

    // Function to update package card display
    function updatePackageCard(packageCard, packageData) {
        packageCard.querySelector('img').src = packageData.images[0];
        packageCard.querySelector('h3').textContent = packageData.name;
        packageCard.querySelector('.package-price').textContent = formatPrice(packageData.price);
        packageCard.setAttribute('data-package', packageData.name);
    }

    // Add package button click
    addPackageBtn.addEventListener("click", function() {
        addPackageModal.style.display = "flex";
    });

    // Close modals
    closePackageModal.addEventListener("click", function() {
        packageModal.style.display = "none";
    });

    closeAddModal.addEventListener("click", function() {
        addPackageModal.style.display = "none";
        addPackageForm.reset();
    });

    closeEditModal.addEventListener("click", function() {
        editPackageModal.style.display = "none";
        editPackageForm.reset();
    });

    cancelAddPackage.addEventListener("click", function() {
        addPackageModal.style.display = "none";
        addPackageForm.reset();
    });

    cancelEditPackage.addEventListener("click", function() {
        editPackageModal.style.display = "none";
        editPackageForm.reset();
    });

    successOkBtn.addEventListener("click", function() {
        successModal.style.display = "none";
    });

    // Close modals when clicking outside
    window.addEventListener("click", function(event) {
        if (event.target === packageModal) {
            packageModal.style.display = "none";
        }
        if (event.target === addPackageModal) {
            addPackageModal.style.display = "none";
            addPackageForm.reset();
        }
        if (event.target === editPackageModal) {
            editPackageModal.style.display = "none";
            editPackageForm.reset();
        }
        if (event.target === successModal) {
            successModal.style.display = "none";
        }
    });

    // Add package form submission
    addPackageForm.addEventListener("submit", function(e) {
        e.preventDefault();
        
        const formData = new FormData(addPackageForm);
        const packageName = formData.get('packageName');
        const packagePrice = formData.get('packagePrice');
        const mainImageFile = formData.get('packageImage');
        
        // Validate required fields
        if (!packageName || !packagePrice || !mainImageFile) {
            alert('Please fill in all required fields and select a main image.');
            return;
        }

        // Check if package name already exists
        if (packages[packageName]) {
            alert('A package with this name already exists. Please choose a different name.');
            return;
        }
        
        // Create file reader for main image
        const reader = new FileReader();
        reader.onload = function(e) {
            const packageData = {
                name: packageName,
                description: packageDescription,
                price: packagePrice,
                images: [e.target.result, e.target.result, e.target.result]
            };
            
            // Handle additional images if provided
            const imageFiles = [
                formData.get('packageImage1'),
                formData.get('packageImage2'),
                formData.get('packageImage3')
            ];
            
            let imagesProcessed = 0;
            const validImageFiles = imageFiles.filter(file => file && file.size > 0);
            
            if (validImageFiles.length > 0) {
                validImageFiles.forEach((file, index) => {
                    const imgReader = new FileReader();
                    imgReader.onload = function(event) {
                        packageData.images[index + 1] = event.target.result;
                        imagesProcessed++;
                        
                        if (imagesProcessed === validImageFiles.length) {
                            // All images processed, finalize package creation
                            finalizePackageCreation(packageData);
                        }
                    };
                    imgReader.readAsDataURL(file);
                });
            } else {
                // No additional images, finalize immediately
                finalizePackageCreation(packageData);
            }
            
            function finalizePackageCreation(packageData) {
                // Add package to packages object
                packages[packageName] = packageData;
                
                // Create and add new package card
                const newPackageCard = createPackageCard(packageData);
                packagesContainer.appendChild(newPackageCard);
                
                // Attach event listeners to new package card
                attachPackageEventListeners(newPackageCard);
                
                // Close modal and show success
                addPackageModal.style.display = "none";
                addPackageForm.reset();
                showSuccessModal(`Package "${packageName}" has been added successfully!`);
            }
        };
        
        reader.readAsDataURL(mainImageFile);
    });

    // Edit package form submission
    editPackageForm.addEventListener("submit", function(e) {
        e.preventDefault();
        
        const formData = new FormData(editPackageForm);
        const originalPackageName = formData.get('editPackageId');
        const newPackageName = formData.get('editPackageName');
        const packageDescription = formData.get('editPackageDescription') || '';
        const packagePrice = formData.get('editPackagePrice');
        const mainImageFile = formData.get('editPackageImage');
        
        // Validate required fields
        if (!newPackageName || !packagePrice) {
            alert('Please fill in all required fields.');
            return;
        }

        // Check if new package name already exists (and it's different from original)
        if (newPackageName !== originalPackageName && packages[newPackageName]) {
            alert('A package with this name already exists. Please choose a different name.');
            return;
        }

        // Get original package data
        const originalPackageData = packages[originalPackageName];
        
        // Create updated package data
        const updatedPackageData = {
            name: newPackageName,
            description: packageDescription,
            price: packagePrice,
            images: [...originalPackageData.images] // Copy original images
        };

        // Function to finalize the update
        function finalizePackageUpdate() {
            // Update packages object
            if (newPackageName !== originalPackageName) {
                delete packages[originalPackageName];
            }
            packages[newPackageName] = updatedPackageData;
            
            // Find and update the package card
            const packageCard = document.querySelector(`[data-package="${originalPackageName}"]`);
            if (packageCard) {
                updatePackageCard(packageCard, updatedPackageData);
            }
            
            // Close modal and show success
            editPackageModal.style.display = "none";
            editPackageForm.reset();
            showSuccessModal(`Package "${newPackageName}" has been updated successfully!`);
        }

        // Handle main image update if provided
        if (mainImageFile && mainImageFile.size > 0) {
            const reader = new FileReader();
            reader.onload = function(e) {
                updatedPackageData.images[0] = e.target.result;
                
                // Handle additional images
                handleAdditionalImagesUpdate(formData, updatedPackageData, finalizePackageUpdate);
            };
            reader.readAsDataURL(mainImageFile);
        } else {
            // No main image update, handle additional images
            handleAdditionalImagesUpdate(formData, updatedPackageData, finalizePackageUpdate);
        }
    });

    // Function to handle additional images update
    function handleAdditionalImagesUpdate(formData, packageData, callback) {
        const imageFiles = [
            formData.get('editPackageImage1'),
            formData.get('editPackageImage2'),
            formData.get('editPackageImage3')
        ];
        
        let imagesProcessed = 0;
        const validImageFiles = imageFiles.filter(file => file && file.size > 0);
        
        if (validImageFiles.length > 0) {
            imageFiles.forEach((file, index) => {
                if (file && file.size > 0) {
                    const imgReader = new FileReader();
                    imgReader.onload = function(event) {
                        packageData.images[index + 1] = event.target.result;
                        imagesProcessed++;
                        
                        if (imagesProcessed === validImageFiles.length) {
                            callback();
                        }
                    };
                    imgReader.readAsDataURL(file);
                }
            });
        } else {
            callback();
        }
    }

    // Function to attach event listeners to package cards
    function attachPackageEventListeners(packageCard) {
        const viewBtn = packageCard.querySelector('.view-package');
        const editBtn = packageCard.querySelector('.edit-btn');
        const deleteBtn = packageCard.querySelector('.delete-btn');
        
        viewBtn.addEventListener('click', function() {
            const packageName = packageCard.dataset.package;
            openPackageModal(packageName);
        });
        
        editBtn.addEventListener('click', function() {
            const packageName = packageCard.dataset.package;
            openEditPackageModal(packageName);
        });
        
        deleteBtn.addEventListener('click', function() {
            const packageName = packageCard.dataset.package;
            if (confirm(`Are you sure you want to delete the "${packageName}"?`)) {
                packageCard.remove();
                delete packages[packageName];
                showSuccessModal(`Package "${packageName}" has been deleted successfully!`);
            }
        });
    }

    // Attach event listeners to existing package cards
    document.querySelectorAll(".package-card").forEach(function(packageCard) {
        attachPackageEventListeners(packageCard);
    });

    // Form validation
    const packageNameInput = document.getElementById('packageName');
    const packagePriceInput = document.getElementById('packagePrice');
    const editPackageNameInput = document.getElementById('editPackageName');
    const editPackagePriceInput = document.getElementById('editPackagePrice');
    
    // Add package form validation
    packageNameInput.addEventListener('input', function() {
        // Remove any special characters except spaces and hyphens
        this.value = this.value.replace(/[^a-zA-Z0-9\s\-]/g, '');
    });
    
    packagePriceInput.addEventListener('input', function() {
        // Ensure price is positive
        if (this.value < 0) {
            this.value = 0;
        }
    });

    // Edit package form validation
    editPackageNameInput.addEventListener('input', function() {
        // Remove any special characters except spaces and hyphens
        this.value = this.value.replace(/[^a-zA-Z0-9\s\-]/g, '');
    });
    
    editPackagePriceInput.addEventListener('input', function() {
        // Ensure price is positive
        if (this.value < 0) {
            this.value = 0;
        }
    });

    // File input validation for all file inputs
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach(input => {
        input.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                // Check file size (max 5MB)
                if (file.size > 5 * 1024 * 1024) {
                    alert('File size should not exceed 5MB');
                    this.value = '';
                    return;
                }
                
                // Check file type
                if (!file.type.startsWith('image/')) {
                    alert('Please select a valid image file');
                    this.value = '';
                    return;
                }
            }
        });
    });

    // Initialize package data with existing cards
    function initializeExistingPackages() {
        document.querySelectorAll(".package-card").forEach(function(packageCard) {
            const packageName = packageCard.dataset.package;
            const description = packageCard.querySelector('.package-description')?.textContent || '';
            const priceText = packageCard.querySelector('.package-price')?.textContent || '₱0.00';
            const price = priceText.replace(/[₱,]/g, '');
            
            if (packages[packageName]) {
                packages[packageName].description = description;
                packages[packageName].price = price;
            }
        });
    }

    // Initialize existing packages
    initializeExistingPackages();

    console.log('Admin Homepage loaded successfully with full functionality!');
    console.log('Available packages:', Object.keys(packages));
});