/* ============================================
   AHAD CLOTHING & SHOPPING CENTRE
   Main JavaScript - Three.js 3D Engine, Real Images,
   3D Tilt & Glare, PKR Cart & Full Checkout
   ============================================ */

// =====================
// PKR FORMATTER
// =====================
function formatPKR(amount) {
    return 'PKR ' + Number(amount).toLocaleString('en-PK');
}

document.addEventListener('DOMContentLoaded', () => {

    // =====================
    // LOADER
    // =====================
    const loader = document.getElementById('loader');
    if (loader) {
        window.addEventListener('load', () => {
            setTimeout(() => loader.classList.add('hidden'), 1500);
        });
        setTimeout(() => loader.classList.add('hidden'), 3500);
    }

    // =====================
    // HEADER SCROLL EFFECT
    // =====================
    const header = document.getElementById('header');
    const backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        if (header) header.classList.toggle('scrolled', window.scrollY > 80);
        if (backToTop) backToTop.classList.toggle('visible', window.scrollY > 500);
    });

    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // =====================
    // MOBILE MENU
    // =====================
    const menuToggle = document.getElementById('menuToggle');
    const closeMenuBtn = document.getElementById('closeMenu');
    const mobileMenu = document.getElementById('mobileMenu');

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => mobileMenu.classList.add('open'));
    }
    if (closeMenuBtn && mobileMenu) {
        closeMenuBtn.addEventListener('click', () => mobileMenu.classList.remove('open'));
    }
    if (mobileMenu) {
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => mobileMenu.classList.remove('open'));
        });
    }

    // =====================
    // ACTIVE NAV LINK ON SCROLL
    // =====================
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY + 200;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            if (scrollY >= top && scrollY < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) link.classList.add('active');
                });
            }
        });
    });

    // =====================
    // THREE.JS INTERACTIVE 3D WEBGL HERO SCENE
    // =====================
    const canvasContainer = document.getElementById('webglCanvasContainer');
    if (canvasContainer && typeof THREE !== 'undefined') {
        const width = canvasContainer.clientWidth || 480;
        const height = canvasContainer.clientHeight || 480;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        camera.position.z = 8;

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.2;
        canvasContainer.appendChild(renderer.domElement);

        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        scene.add(ambientLight);

        const goldLight = new THREE.PointLight(0xd4af37, 3, 50);
        goldLight.position.set(5, 5, 5);
        scene.add(goldLight);

        const blueLight = new THREE.PointLight(0x4a90e2, 2, 50);
        blueLight.position.set(-5, -3, 3);
        scene.add(blueLight);

        const keyLight = new THREE.DirectionalLight(0xfff3d1, 2);
        keyLight.position.set(0, 10, 8);
        scene.add(keyLight);

        // Central 3D Jewel / Emblem (Faceted Gold Polyhedron)
        const jewelGeo = new THREE.IcosahedronGeometry(2.1, 0);
        const jewelMat = new THREE.MeshStandardMaterial({
            color: 0xd4af37,
            metalness: 0.9,
            roughness: 0.18,
            flatShading: true
        });
        const jewel = new THREE.Mesh(jewelGeo, jewelMat);
        scene.add(jewel);

        // Inner glowing wireframe core
        const coreGeo = new THREE.IcosahedronGeometry(1.6, 1);
        const coreMat = new THREE.MeshBasicMaterial({
            color: 0xffe082,
            wireframe: true,
            transparent: true,
            opacity: 0.4
        });
        const innerCore = new THREE.Mesh(coreGeo, coreMat);
        jewel.add(innerCore);

        // Orbiting Rings
        const ringGeo1 = new THREE.TorusGeometry(3.3, 0.05, 16, 100);
        const ringMat1 = new THREE.MeshStandardMaterial({
            color: 0xf0d060,
            metalness: 0.95,
            roughness: 0.1
        });
        const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
        ring1.rotation.x = Math.PI / 3;
        scene.add(ring1);

        const ringGeo2 = new THREE.TorusGeometry(3.0, 0.04, 16, 100);
        const ringMat2 = new THREE.MeshStandardMaterial({
            color: 0xd4af37,
            metalness: 0.85,
            roughness: 0.25
        });
        const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
        ring2.rotation.y = Math.PI / 4;
        scene.add(ring2);

        // Floating Stardust Particles
        const particleCount = 350;
        const particleGeo = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount * 3; i += 3) {
            const r = 3.5 + Math.random() * 3.5;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            positions[i] = r * Math.sin(phi) * Math.cos(theta);
            positions[i + 1] = r * Math.sin(phi) * Math.sin(theta);
            positions[i + 2] = r * Math.cos(phi);
        }

        particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const particleMat = new THREE.PointsMaterial({
            size: 0.065,
            color: 0xf5d77f,
            transparent: true,
            opacity: 0.85,
            blending: THREE.AdditiveBlending
        });
        const particles = new THREE.Points(particleGeo, particleMat);
        scene.add(particles);

        // Drag Interaction State
        let isDragging = false;
        let prevMousePos = { x: 0, y: 0 };
        let targetRotation = { x: 0, y: 0 };
        let currentRotation = { x: 0, y: 0 };
        let mouseXParallax = 0;
        let mouseYParallax = 0;

        canvasContainer.addEventListener('mousedown', (e) => {
            isDragging = true;
            prevMousePos = { x: e.clientX, y: e.clientY };
        });

        window.addEventListener('mouseup', () => {
            isDragging = false;
        });

        window.addEventListener('mousemove', (e) => {
            if (isDragging) {
                const deltaX = e.clientX - prevMousePos.x;
                const deltaY = e.clientY - prevMousePos.y;
                targetRotation.y += deltaX * 0.01;
                targetRotation.x += deltaY * 0.01;
                prevMousePos = { x: e.clientX, y: e.clientY };
            }

            // Parallax
            const rect = canvasContainer.getBoundingClientRect();
            mouseXParallax = ((e.clientX - rect.left) / rect.width - 0.5) * 0.5;
            mouseYParallax = ((e.clientY - rect.top) / rect.height - 0.5) * 0.5;
        });

        // Touch support
        canvasContainer.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                isDragging = true;
                prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
            }
        });

        window.addEventListener('touchend', () => { isDragging = false; });

        canvasContainer.addEventListener('touchmove', (e) => {
            if (isDragging && e.touches.length === 1) {
                const deltaX = e.touches[0].clientX - prevMousePos.x;
                const deltaY = e.touches[0].clientY - prevMousePos.y;
                targetRotation.y += deltaX * 0.01;
                targetRotation.x += deltaY * 0.01;
                prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
            }
        });

        // Resize handler
        window.addEventListener('resize', () => {
            const newW = canvasContainer.clientWidth;
            const newH = canvasContainer.clientHeight;
            if (newW && newH) {
                camera.aspect = newW / newH;
                camera.updateProjectionMatrix();
                renderer.setSize(newW, newH);
            }
        });

        // Animation Loop
        let clock = new THREE.Clock();
        function animate3D() {
            requestAnimationFrame(animate3D);
            const elapsedTime = clock.getElapsedTime();

            // Smooth damping for drag rotation
            currentRotation.x += (targetRotation.x - currentRotation.x) * 0.08;
            currentRotation.y += (targetRotation.y - currentRotation.y) * 0.08;

            // Base continuous auto-rotation
            targetRotation.y += 0.004;

            jewel.rotation.x = currentRotation.x + Math.sin(elapsedTime * 0.8) * 0.05 + mouseYParallax;
            jewel.rotation.y = currentRotation.y + mouseXParallax;
            jewel.position.y = Math.sin(elapsedTime * 1.5) * 0.18;

            ring1.rotation.z += 0.007;
            ring1.rotation.x = Math.PI / 3 + Math.sin(elapsedTime * 0.5) * 0.1;
            ring2.rotation.z -= 0.005;

            particles.rotation.y -= 0.0015;
            particles.rotation.x += 0.0008;

            // Light shimmer
            goldLight.intensity = 2.5 + Math.sin(elapsedTime * 2) * 0.5;

            renderer.render(scene, camera);
        }
        animate3D();
    }

    // =====================
    // HERO BACKGROUND PARTICLES (CSS)
    // =====================
    const particlesContainer = document.getElementById('particles');
    if (particlesContainer) {
        for (let i = 0; i < 35; i++) {
            const p = document.createElement('div');
            p.classList.add('particle');
            p.style.left = Math.random() * 100 + '%';
            p.style.animationDelay = Math.random() * 6 + 's';
            p.style.animationDuration = (4 + Math.random() * 4) + 's';
            p.style.width = (2 + Math.random() * 3) + 'px';
            p.style.height = p.style.width;
            particlesContainer.appendChild(p);
        }
    }

    // =====================
    // COUNTER STATS ANIMATION
    // =====================
    const counters = document.querySelectorAll('.stat-number');
    let countersAnimated = false;

    function animateCounters() {
        if (countersAnimated) return;
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;
            const update = () => {
                current += step;
                if (current < target) {
                    counter.textContent = Math.floor(current);
                    requestAnimationFrame(update);
                } else {
                    counter.textContent = target;
                }
            };
            update();
        });
        countersAnimated = true;
    }

    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        const heroObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) setTimeout(animateCounters, 1000);
            });
        }, { threshold: 0.3 });
        heroObserver.observe(heroSection);
    }

    // =====================
    // PRODUCT FILTERING
    // =====================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            productCards.forEach((card, index) => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.classList.remove('hidden');
                    card.style.animationDelay = (index * 0.04) + 's';
                    card.classList.add('fade-in');
                } else {
                    card.classList.add('hidden');
                    card.classList.remove('fade-in');
                }
            });
        });
    });

    // =====================
    // 3D TILT EFFECT & DYNAMIC LIGHT GLARE
    // =====================
    productCards.forEach(card => {
        const glare = card.querySelector('.card-glare');

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const percentX = x / rect.width;
            const percentY = y / rect.height;

            const rotateX = -(percentY - 0.5) * 18;
            const rotateY = (percentX - 0.5) * 18;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;

            if (glare) {
                glare.style.background = `radial-gradient(circle at ${percentX * 100}% ${percentY * 100}%, rgba(255, 255, 255, 0.28) 0%, rgba(212, 175, 55, 0.12) 35%, transparent 70%)`;
                glare.style.opacity = '1';
            }
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
            if (glare) {
                glare.style.opacity = '0';
            }
        });
    });

    // =====================
    // SHOPPING CART (With Real Images & PKR)
    // =====================
    let cart = [];
    const cartToggle = document.getElementById('cartToggle');
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    const closeCart = document.getElementById('closeCart');
    const cartItems = document.getElementById('cartItems');
    const cartFooter = document.getElementById('cartFooter');
    const cartTotal = document.getElementById('cartTotal');
    const cartCountBadges = document.querySelectorAll('.cart-count');
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');

    function openCart() {
        if (cartSidebar && cartOverlay) {
            cartSidebar.classList.add('open');
            cartOverlay.classList.add('open');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeCartFn() {
        if (cartSidebar && cartOverlay) {
            cartSidebar.classList.remove('open');
            cartOverlay.classList.remove('open');
            document.body.style.overflow = '';
        }
    }

    if (cartToggle) cartToggle.addEventListener('click', openCart);
    if (closeCart) closeCart.addEventListener('click', closeCartFn);
    if (cartOverlay) cartOverlay.addEventListener('click', closeCartFn);

    function showToast(message) {
        if (toast && toastMessage) {
            toastMessage.textContent = message;
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 3000);
        }
    }
    window.showToast = showToast;

    function updateCartCount() {
        const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
        cartCountBadges.forEach(badge => badge.textContent = totalItems);
    }

    function updateCartTotal() {
        const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
        if (cartTotal) cartTotal.textContent = formatPKR(total);
    }

    function getCartTotal() {
        return cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    }

    function renderCart() {
        if (!cartItems) return;

        if (cart.length === 0) {
            cartItems.innerHTML = `
                <div class="cart-empty">
                    <i class="fas fa-shopping-bag"></i>
                    <p>Your cart is empty</p>
                    <a href="#products" class="btn btn-outline" onclick="document.getElementById('cartSidebar').classList.remove('open'); document.getElementById('cartOverlay').classList.remove('open'); document.body.style.overflow='';">
                        <span>Explore Atelier</span>
                    </a>
                </div>`;
            if (cartFooter) cartFooter.style.display = 'none';
        } else {
            let html = '';
            cart.forEach((item, index) => {
                html += `
                    <div class="cart-item">
                        <div class="cart-item-image">
                            <img src="${item.image}" alt="${item.name}">
                        </div>
                        <div class="cart-item-details">
                            <div class="cart-item-name">${item.name}</div>
                            <div class="cart-item-price">${formatPKR(item.price)}</div>
                            <div class="cart-item-qty">
                                <button onclick="updateQty(${index}, -1)">-</button>
                                <span>${item.qty}</span>
                                <button onclick="updateQty(${index}, 1)">+</button>
                            </div>
                        </div>
                        <button class="cart-item-remove" onclick="removeFromCart(${index})">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>`;
            });
            cartItems.innerHTML = html;
            if (cartFooter) cartFooter.style.display = 'block';
        }
        updateCartCount();
        updateCartTotal();
    }

    window.updateQty = function(index, delta) {
        cart[index].qty += delta;
        if (cart[index].qty <= 0) cart.splice(index, 1);
        renderCart();
    };

    window.removeFromCart = function(index) {
        const name = cart[index].name;
        cart.splice(index, 1);
        renderCart();
        showToast(`${name} removed from cart`);
    };

    // Add to Cart Buttons
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            const name = btn.getAttribute('data-name');
            const price = parseFloat(btn.getAttribute('data-price'));
            const image = btn.getAttribute('data-image') || 'images/products/p1_suit.jpg';

            const existing = cart.find(item => item.id === id);
            if (existing) {
                existing.qty++;
            } else {
                cart.push({ id, name, price, qty: 1, image });
            }

            btn.classList.add('added');
            btn.innerHTML = '<i class="fas fa-check"></i> Added to Bag!';
            setTimeout(() => {
                btn.classList.remove('added');
                btn.innerHTML = '<i class="fas fa-shopping-bag"></i> Add to Cart';
            }, 1400);

            renderCart();
            showToast(`${name} added to your bag!`);
        });
    });

    // =====================
    // WISHLIST TOGGLE
    // =====================
    let wishlistCount = 0;
    const wishlistCountBadges = document.querySelectorAll('.wishlist-count');

    document.querySelectorAll('.wishlist-add').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            btn.classList.toggle('active');
            if (btn.classList.contains('active')) {
                btn.innerHTML = '<i class="fas fa-heart"></i>';
                wishlistCount++;
                showToast('Added to your wishlist ❤️');
            } else {
                btn.innerHTML = '<i class="far fa-heart"></i>';
                wishlistCount--;
                showToast('Removed from wishlist');
            }
            wishlistCountBadges.forEach(badge => badge.textContent = wishlistCount);
        });
    });

    // =====================
    // QUICK VIEW MODAL (High-Res 3D Image Presentation)
    // =====================
    const quickViewModal = document.getElementById('quickViewModal');
    const quickViewOverlay = document.getElementById('quickViewOverlay');
    const closeModal = document.getElementById('closeModal');
    const modalImage = document.getElementById('modalImage');
    const modalCategory = document.getElementById('modalCategory');
    const modalTitle = document.getElementById('modalTitle');
    const modalRating = document.getElementById('modalRating');
    const modalPrice = document.getElementById('modalPrice');
    let currentModalProduct = null;

    document.querySelectorAll('.quick-view').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const card = btn.closest('.product-card');
            const id = card.getAttribute('data-id');
            const name = card.getAttribute('data-name');
            const price = card.getAttribute('data-price');
            const image = card.getAttribute('data-image') || 'images/products/p1_suit.jpg';
            const category = card.querySelector('.product-category').textContent;
            const stars = card.querySelector('.stars').innerHTML;
            const ratingCount = card.querySelector('.rating-count').textContent;

            currentModalProduct = { id, name, price: parseFloat(price), image };

            if (modalImage) {
                modalImage.innerHTML = `
                    <img src="${image}" alt="${name}" class="modal-product-img">
                    <div class="card-glare" style="opacity:0.4;"></div>`;
            }
            if (modalCategory) modalCategory.textContent = category;
            if (modalTitle) modalTitle.textContent = name;
            if (modalRating) modalRating.innerHTML = `${stars} ${ratingCount}`;
            if (modalPrice) modalPrice.textContent = formatPKR(parseFloat(price));

            if (quickViewModal && quickViewOverlay) {
                quickViewModal.classList.add('open');
                quickViewOverlay.classList.add('open');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    function closeQuickView() {
        if (quickViewModal && quickViewOverlay) {
            quickViewModal.classList.remove('open');
            quickViewOverlay.classList.remove('open');
            document.body.style.overflow = '';
        }
    }

    if (closeModal) closeModal.addEventListener('click', closeQuickView);
    if (quickViewOverlay) quickViewOverlay.addEventListener('click', closeQuickView);

    // Size Selection
    document.querySelectorAll('.size-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // Quantity Control in Modal
    let modalQty = 1;
    const qtyValue = document.querySelector('.qty-value');
    const qtyMinus = document.querySelector('.qty-btn.minus');
    const qtyPlus = document.querySelector('.qty-btn.plus');

    if (qtyMinus) {
        qtyMinus.addEventListener('click', () => {
            if (modalQty > 1) { modalQty--; if (qtyValue) qtyValue.textContent = modalQty; }
        });
    }
    if (qtyPlus) {
        qtyPlus.addEventListener('click', () => {
            modalQty++;
            if (qtyValue) qtyValue.textContent = modalQty;
        });
    }

    // Modal Add To Cart
    const modalAddCartBtn = document.querySelector('.modal-add-cart');
    if (modalAddCartBtn) {
        modalAddCartBtn.addEventListener('click', () => {
            if (!currentModalProduct) return;
            const existing = cart.find(item => item.id === currentModalProduct.id);
            if (existing) {
                existing.qty += modalQty;
            } else {
                cart.push({
                    id: currentModalProduct.id,
                    name: currentModalProduct.name,
                    price: currentModalProduct.price,
                    image: currentModalProduct.image,
                    qty: modalQty
                });
            }
            renderCart();
            showToast(`${currentModalProduct.name} (x${modalQty}) added to cart!`);
            closeQuickView();
            modalQty = 1;
            if (qtyValue) qtyValue.textContent = 1;
        });
    }

    // =====================
    // CHECKOUT / PAYMENT FLOW
    // =====================
    const checkoutModal = document.getElementById('checkoutModal');
    const checkoutOverlay = document.getElementById('checkoutOverlay');
    const checkoutClose = document.getElementById('checkoutClose');
    const cardDetails = document.getElementById('cardDetails');
    const walletDetails = document.getElementById('walletDetails');
    const bankDetails = document.getElementById('bankDetails');

    function openCheckout() {
        closeCartFn();
        setTimeout(() => {
            if (checkoutModal && checkoutOverlay) {
                checkoutModal.classList.add('open');
                checkoutOverlay.classList.add('open');
                document.body.style.overflow = 'hidden';
                window.nextStep(1);
            }
        }, 300);
    }

    window.closeCheckout = function() {
        if (checkoutModal && checkoutOverlay) {
            checkoutModal.classList.remove('open');
            checkoutOverlay.classList.remove('open');
            document.body.style.overflow = '';
        }
    };

    if (checkoutClose) checkoutClose.addEventListener('click', window.closeCheckout);
    if (checkoutOverlay) checkoutOverlay.addEventListener('click', window.closeCheckout);

    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) return;
            openCheckout();
        });
    }

    // Step Navigation
    window.nextStep = function(stepNum) {
        if (stepNum === 2) {
            const name = document.getElementById('shipName').value;
            const phone = document.getElementById('shipPhone').value;
            const address = document.getElementById('shipAddress').value;
            const city = document.getElementById('shipCity').value;
            if (!name || !phone || !address || !city) {
                showToast('Please enter your Name, Phone, City, and Address');
                return;
            }
        }

        if (stepNum === 3) {
            // Build order summary with real product photography
            const summaryDiv = document.getElementById('orderSummary');
            let html = '';
            cart.forEach(item => {
                html += `
                    <div class="order-item">
                        <img src="${item.image}" alt="${item.name}" class="order-item-img">
                        <div class="order-item-info">
                            <strong>${item.name}</strong>
                            <span>Qty: ${item.qty}</span>
                        </div>
                        <span class="order-item-price">${formatPKR(item.price * item.qty)}</span>
                    </div>`;
            });
            if (summaryDiv) summaryDiv.innerHTML = html;

            const subtotal = getCartTotal();
            const shipping = subtotal >= 10000 ? 0 : 500;
            const total = subtotal + shipping;
            const subtotalEl = document.getElementById('orderSubtotal');
            const shippingEl = document.getElementById('orderShipping');
            const totalEl = document.getElementById('orderTotal');

            if (subtotalEl) subtotalEl.textContent = formatPKR(subtotal);
            if (shippingEl) shippingEl.textContent = shipping === 0 ? 'FREE (Orders > 10,000)' : formatPKR(shipping);
            if (totalEl) totalEl.textContent = formatPKR(total);
        }

        document.querySelectorAll('.checkout-step-content').forEach(s => s.style.display = 'none');
        const targetStep = document.getElementById('step' + stepNum);
        if (targetStep) targetStep.style.display = 'block';

        document.querySelectorAll('.checkout-steps .step').forEach(s => {
            const sNum = parseInt(s.getAttribute('data-step'));
            s.classList.remove('active', 'completed');
            if (sNum === stepNum) s.classList.add('active');
            else if (sNum < stepNum) s.classList.add('completed');
        });
    };

    // Payment Selection Handlers
    document.querySelectorAll('.payment-option input[name="payment"]').forEach(radio => {
        radio.addEventListener('change', () => {
            document.querySelectorAll('.payment-option').forEach(opt => opt.classList.remove('active'));
            radio.closest('.payment-option').classList.add('active');

            const val = radio.value;
            if (cardDetails) cardDetails.style.display = val === 'card' ? 'block' : 'none';
            if (walletDetails) walletDetails.style.display = (val === 'jazzcash' || val === 'easypaisa') ? 'block' : 'none';
            if (bankDetails) bankDetails.style.display = val === 'bank' ? 'block' : 'none';
        });
    });

    // Place Order
    window.placeOrder = function() {
        const orderId = 'AHAD-' + Math.floor(100000 + Math.random() * 900000);
        const orderIdEl = document.getElementById('orderId');
        if (orderIdEl) orderIdEl.textContent = orderId;

        document.querySelectorAll('.checkout-step-content').forEach(s => s.style.display = 'none');
        const successStep = document.getElementById('stepSuccess');
        if (successStep) successStep.style.display = 'flex';

        cart = [];
        renderCart();
        showToast('🎉 Order placed successfully! Tracking ID: ' + orderId);
    };

    // =====================
    // SCROLL REVEAL ANIMATIONS
    // =====================
    const revealElements = document.querySelectorAll(
        '.collection-card, .feature-card, .contact-info-card, .about-grid, .newsletter-content, .promo-content'
    );
    revealElements.forEach(el => el.classList.add('reveal'));

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('revealed');
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    revealElements.forEach(el => revealObserver.observe(el));

    // =====================
    // SMOOTH SCROLL FOR NAV LINKS
    // =====================
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
            }
        });
    });

    // =====================
    // KEYBOARD SHORTCUTS
    // =====================
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeCartFn();
            closeQuickView();
            window.closeCheckout();
            if (mobileMenu) mobileMenu.classList.remove('open');
        }
    });

    console.log('%c✨ AHAD Clothing & Shopping Centre — 3D Luxury Atelier Loaded', 'font-size:16px; font-weight:bold; color:#d4af37; background:#0a0a0a; padding:8px 16px; border-radius:6px;');
});
