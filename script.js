// DOM Elements
const loader = document.getElementById('loader');
const navbar = document.getElementById('navbar');
const backToTop = document.getElementById('backToTop');
const requestForm = document.getElementById('requestForm');
const fileUpload = document.getElementById('fileUpload');
const fileInput = document.getElementById('images');
const filePreview = document.getElementById('filePreview');
const successModal = document.getElementById('successModal');
const submitBtn = document.getElementById('submitBtn');

// ========== LANGUAGE SWITCHER ==========
let currentLang = localStorage.getItem('language') || 'en';

// Language switcher buttons
const langButtons = document.querySelectorAll('.lang-btn');

// Initialize language on page load
document.addEventListener('DOMContentLoaded', () => {
    setLanguage(currentLang);
});

langButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const lang = btn.dataset.lang;
        setLanguage(lang);
    });
});

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('language', lang);
    
    // Update active button
    langButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });
    
    // Update HTML attributes
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    
    // Update all translatable elements
    updateContent();
}

function updateContent() {
    const t = translations[currentLang];
    
    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (t[key]) {
            element.textContent = t[key];
        }
    });
    
    // Update all placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        if (t[key]) {
            element.placeholder = t[key];
        }
    });
    
    // Update select options
    document.querySelectorAll('[data-i18n-option]').forEach(element => {
        const key = element.getAttribute('data-i18n-option');
        if (t[key]) {
            element.textContent = t[key];
        }
    });
}

// Pack Selection Elements
const pricingCards = document.querySelectorAll('.pricing-card');
const selectedPackBanner = document.getElementById('selectedPackBanner');
const packNotSelected = document.querySelector('.pack-not-selected');
const packSelectedInfo = document.getElementById('packSelectedInfo');
const selectedPackIcon = document.getElementById('selectedPackIcon');
const selectedPackName = document.getElementById('selectedPackName');
const selectedPackPrice = document.getElementById('selectedPackPrice');
const selectedPackInput = document.getElementById('selectedPackInput');
const selectedPriceInput = document.getElementById('selectedPriceInput');
const changePackBtn = document.getElementById('changePackBtn');

// Pack names and icons mapping
const packInfo = {
    starter: { name: 'Pack Starter', icon: 'fas fa-rocket' },
    business: { name: 'Pack Business', icon: 'fas fa-briefcase' },
    pro: { name: 'Pack Pro', icon: 'fas fa-crown' },
    custom: { name: 'Pack Sur Mesure', icon: 'fas fa-gem' }
};

let currentSelectedPack = null;

// Loader
window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hidden'), 800);
});

// Navbar & Back to Top
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    backToTop.classList.toggle('visible', window.scrollY > 500);
});

backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// ========== PACK SELECTION ==========
pricingCards.forEach(card => {
    const btn = card.querySelector('.select-pack-btn');
    if (btn) {
        btn.addEventListener('click', () => selectPack(card));
    }
    // Make entire card clickable
    card.addEventListener('click', (e) => {
        if (!e.target.closest('.select-pack-btn')) {
            selectPack(card);
        }
    });
});

function selectPack(card) {
    const packType = card.dataset.pack;
    const packPrice = card.dataset.price;
    const t = translations[currentLang];
    
    // Get pack name from translations
    const packNames = {
        'starter': t.pack_starter_name || 'Pack Starter',
        'business': t.pack_business_name || 'Pack Business',
        'pro': t.pack_pro_name || 'Pack Pro',
        'custom': t.pack_custom_name || 'Pack Custom'
    };
    
    const packName = packNames[packType];
    
    // Create WhatsApp message based on language
    let message = '';
    if (currentLang === 'ar') {
        message = `السلام عليكم 👋\n\nأنا مهتم بـ ${packName}\nالسعر: ${packPrice}\n\nأريد معلومات أكثر من فضلك.`;
    } else if (currentLang === 'fr') {
        message = `Bonjour 👋\n\nJe suis intéressé par ${packName}\nPrix: ${packPrice}\n\nJ'aimerais plus d'informations s'il vous plaît.`;
    } else {
        message = `Hello 👋\n\nI'm interested in ${packName}\nPrice: ${packPrice}\n\nI would like more information please.`;
    }
    
    // Encode message for URL
    const encodedMessage = encodeURIComponent(message);
    
    // Open WhatsApp with pre-filled message
    const whatsappURL = `https://wa.me/212644402059?text=${encodedMessage}`;
    window.open(whatsappURL, '_blank');
}

// Change pack button
if (changePackBtn) {
    changePackBtn.addEventListener('click', () => {
        // Scroll to pricing
        document.getElementById('pricing').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
}

// ========== FILE UPLOAD ==========
let uploadedFiles = [];

if (fileUpload) {
    fileUpload.addEventListener('dragover', (e) => {
        e.preventDefault();
        fileUpload.classList.add('dragover');
    });

    fileUpload.addEventListener('dragleave', () => {
        fileUpload.classList.remove('dragover');
    });

    fileUpload.addEventListener('drop', (e) => {
        e.preventDefault();
        fileUpload.classList.remove('dragover');
        handleFiles(e.dataTransfer.files);
    });
}

if (fileInput) {
    fileInput.addEventListener('change', (e) => handleFiles(e.target.files));
}

function handleFiles(files) {
    const maxFiles = 80; // Increased from 5 to 80
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'application/pdf'];
    const t = translations[currentLang];

    for (let file of files) {
        if (uploadedFiles.length >= maxFiles) {
            alert(t.alert_max_files || 'Maximum is 80 files');
            break;
        }
        if (!validTypes.includes(file.type)) {
            alert(t.alert_file_type || 'Please choose images or PDF only');
            continue;
        }
        if (file.size > 5 * 1024 * 1024) {
            alert(t.alert_file_size || 'File size must not exceed 5MB');
            continue;
        }
        uploadedFiles.push(file);
        previewFile(file);
    }
}

function previewFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        const div = document.createElement('div');
        div.className = 'file-preview-item';
        if (file.type === 'application/pdf') {
            div.innerHTML = `
                <div style="display:flex;align-items:center;justify-content:center;height:100%;background:#1a1a2e;">
                    <i class="fas fa-file-pdf" style="font-size:2rem;color:#ec4899;"></i>
                </div>
                <span class="remove-file" onclick="removeFile('${file.name}', this)"><i class="fas fa-times"></i></span>
            `;
        } else {
            div.innerHTML = `
                <img src="${e.target.result}" alt="${file.name}">
                <span class="remove-file" onclick="removeFile('${file.name}', this)"><i class="fas fa-times"></i></span>
            `;
        }
        filePreview.appendChild(div);
    };
    reader.readAsDataURL(file);
}

function removeFile(fileName, element) {
    uploadedFiles = uploadedFiles.filter(f => f.name !== fileName);
    element.parentElement.remove();
}

// ========== FORM SUBMISSION ==========
if (requestForm) {
    requestForm.addEventListener('submit', function(e) {
        const t = translations[currentLang];

        // Validate pack selection
        if (!currentSelectedPack) {
            e.preventDefault();
            alert(t.alert_select_pack || 'Please choose a package first');
            document.getElementById('pricing').scrollIntoView({ behavior: 'smooth' });
            return false;
        }

        const clientName = document.getElementById('clientName').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const businessName = document.getElementById('businessName').value.trim();
        const businessType = document.getElementById('businessType').value;

        if (!clientName || !phone || !businessName || !businessType) {
            e.preventDefault();
            alert(t.alert_required_fields || 'Please fill in all required fields');
            return false;
        }

        // Add language to hidden input
        let langInput = document.createElement('input');
        langInput.type = 'hidden';
        langInput.name = 'language';
        langInput.value = currentLang;
        requestForm.appendChild(langInput);

        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        // Let the native form submission happen
        return true;
    });
}

function resetForm() {
    requestForm.reset();
    uploadedFiles = [];
    if (filePreview) filePreview.innerHTML = '';
    
    // Reset pack selection
    pricingCards.forEach(c => c.classList.remove('selected'));
    selectedPackBanner.classList.remove('has-pack');
    packNotSelected.style.display = 'flex';
    packSelectedInfo.style.display = 'none';
    requestForm.style.display = 'none';
    currentSelectedPack = null;
}

function showSuccessModal() {
    successModal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    successModal.classList.remove('show');
    document.body.style.overflow = '';
}

successModal.addEventListener('click', (e) => {
    if (e.target === successModal) closeModal();
});

// ========== ANIMATIONS ==========
// Pricing Cards Animation
const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 100);
            cardObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });

pricingCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease, border-color 0.3s ease, box-shadow 0.3s ease';
    cardObserver.observe(card);
});

// Step Cards Animation
const stepCards = document.querySelectorAll('.step-card');
const stepObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 150);
            stepObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });

stepCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    stepObserver.observe(card);
});

// Add fadeInUp animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);

// Console
console.log('%c 🚀 NS2 - We Design Your Professional Website ', 
    'background: linear-gradient(135deg, #dc2626, #be123c); color: white; font-size: 18px; padding: 10px 20px; border-radius: 10px;');
