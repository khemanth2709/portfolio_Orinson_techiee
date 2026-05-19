document.addEventListener("DOMContentLoaded", () => {
    initPreloader();
    initCustomCursor();
    initNavbarEngine();
    initScrollAnimations();
    initProjectFilters();
    initCard3DTilt();
    initFormValidation();
    initTypewriter();
    initDepthOfFieldParallax();
});

function initPreloader() {
    const preloader = document.getElementById("preloader");
    window.addEventListener("load", () => {
        setTimeout(() => {
            preloader.style.opacity = "0";
            preloader.style.visibility = "hidden";
        }, 500);
    });
}

function initCustomCursor() {
    const cursor = document.querySelector(".custom-cursor");
    const dot = document.querySelector(".custom-cursor-dot");

    if (window.matchMedia("(pointer: coarse)").matches) return;

    document.addEventListener("mousemove", (e) => {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
        dot.style.left = `${e.clientX}px`;
        dot.style.top = `${e.clientY}px`;
    });

    const standardInteractiveNodes = document.querySelectorAll("a, button, .project-card, .filter-btn, .tick");
    standardInteractiveNodes.forEach(node => {
        node.addEventListener("mouseenter", () => {
            cursor.style.width = "40px";
            cursor.style.height = "40px";
            cursor.style.backgroundColor = "rgba(6, 182, 212, 0.08)";
            cursor.style.borderColor = "var(--secondary)";
        });
        node.addEventListener("mouseleave", () => {
            cursor.style.width = "26px";
            cursor.style.height = "26px";
            cursor.style.backgroundColor = "transparent";
            cursor.style.borderColor = "var(--primary)";
        });
    });
}

function initNavbarEngine() {
    const navbar = document.querySelector(".navbar");
    const backToTop = document.getElementById("back-to-top");
    const progressBar = document.getElementById("scroll-progress");

    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            navbar.classList.add("scrolled");
            backToTop.classList.add("visible");
        } else {
            navbar.classList.remove("scrolled");
            backToTop.classList.remove("visible");
        }

        const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        if (totalHeight > 0) {
            const currentProgress = (window.scrollY / totalHeight) * 100;
            progressBar.style.width = `${currentProgress}%`;
        }
    });

    backToTop.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}

function initScrollAnimations() {
    const revealItems = document.querySelectorAll(".scroll-reveal");

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("revealed");
                if (entry.target.id === "about") animateNumericalCounters();
                if (entry.target.id === "skills") animateProgressBars();
            }
        });
    }, {
        threshold: 0.12
    });

    revealItems.forEach(item => revealObserver.observe(item));
}

function animateNumericalCounters() {
    const counters = document.querySelectorAll(".stat-num");
    counters.forEach(counter => {
        if (counter.classList.contains("counted")) return;
        counter.classList.add("counted");

        const target = +counter.getAttribute("data-target");
        let count = 0;
        const speed = target / 35;

        const updateCount = () => {
            if (count < target) {
                count += speed;
                counter.textContent = Math.ceil(count);
                setTimeout(updateCount, 25);
            } else {
                if (target === 85) counter.textContent = "8.5+";
                else if (target === 35) counter.textContent = "Rank 35";
                else counter.textContent = target + "+";
            }
        };
        updateCount();
    });
}

function initTypewriter() {
    const phrases = ["MERN Stack Applications.", "Quantitative Trading Nodes.", "Low-Latency Frameworks."];
    let partIndex = 0;
    let txtIndex = 0;
    let isDeleting = false;
    const speed = 75;
    const targetElement = document.getElementById("typing");

    function handleTyping() {
        const currentString = phrases[partIndex];
        if (isDeleting) {
            targetElement.textContent = currentString.substring(0, txtIndex - 1);
            txtIndex--;
        } else {
            targetElement.textContent = currentString.substring(0, txtIndex + 1);
            txtIndex++;
        }

        let currentSpeed = speed;
        if (isDeleting) currentSpeed /= 2;

        if (!isDeleting && txtIndex === currentString.length) {
            currentSpeed = 1800;
            isDeleting = true;
        } else if (isDeleting && txtIndex === 0) {
            isDeleting = false;
            partIndex = (partIndex + 1) % phrases.length;
            currentSpeed = 400;
        }

        setTimeout(handleTyping, currentSpeed);
    }
    if (targetElement) handleTyping();
}

function animateProgressBars() {
    const bars = document.querySelectorAll(".progress-fill");
    bars.forEach(bar => {
        bar.style.width = bar.getAttribute("data-width");
    });

    const circles = document.querySelectorAll(".circle-fill-bar");
    circles.forEach(circle => {
        const parentContainer = circle.closest(".circle-progress");
        const basePercentage = parentContainer.getAttribute("data-percent");
        const calculatedCircumference = 220;
        const offsetPosition = calculatedCircumference - (basePercentage / 100) * calculatedCircumference;
        circle.style.strokeDashoffset = offsetPosition;
    });
}

function initProjectFilters() {
    const filterButtons = document.querySelectorAll(".filter-btn");
    const projectCards = document.querySelectorAll(".project-card");

    filterButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            filterButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const selectedFilter = btn.getAttribute("data-filter");

            projectCards.forEach(card => {
                const cardCategory = card.getAttribute("data-category");
                if (selectedFilter === "all" || cardCategory === selectedFilter) {
                    card.style.display = "block";
                    setTimeout(() => {
                        card.style.opacity = "1";
                        card.style.transform = "scale(1) translateY(0)";
                    }, 50);
                } else {
                    card.style.opacity = "0";
                    card.style.transform = "scale(0.85) translateY(15px)";
                    setTimeout(() => {
                        card.style.display = "none";
                    }, 400);
                }
            });
        });
    });
}

function initCard3DTilt() {
    const targetCards = document.querySelectorAll(".tilt");
    if (window.matchMedia("(pointer: coarse)").matches) return;

    targetCards.forEach(card => {
        card.addEventListener("mousemove", (e) => {
            const cardBoundingRect = card.getBoundingClientRect();
            const mouseXInCard = e.clientX - cardBoundingRect.left;
            const mouseYInCard = e.clientY - cardBoundingRect.top;

            const cardXCenter = cardBoundingRect.width / 2;
            const cardYCenter = cardBoundingRect.height / 2;

            const rotationYAngle = ((mouseXInCard - cardXCenter) / cardXCenter) * 10;
            const rotationXAngle = -((mouseYInCard - cardYCenter) / cardYCenter) * 10;

            card.style.transform = `perspective(1000px) rotateX(${rotationXAngle}deg) rotateY(${rotationYAngle}deg) translateY(-4px)`;
        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)";
        });
    });
}

function initFormValidation() {
    const form = document.getElementById("contact-form");
    if (!form) return;

    const fields = [{
            el: document.getElementById("name"),
            check: (v) => v.trim().length > 0
        },
        {
            el: document.getElementById("email"),
            check: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
        },
        {
            el: document.getElementById("message"),
            check: (v) => v.trim().length > 5
        }
    ];

    fields.forEach(field => {
        field.el.addEventListener("input", () => {
            if (field.check(field.el.value)) {
                field.el.parentElement.classList.remove("invalid");
            }
        });
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        let isFormValid = true;

        fields.forEach(field => {
            if (!field.check(field.el.value)) {
                field.el.parentElement.classList.add("invalid");
                isFormValid = false;
            } else {
                field.el.parentElement.classList.remove("invalid");
            }
        });

        if (isFormValid) {
            const submitBtn = form.querySelector(".submit-btn");
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<span>ROUTING DATA PACKET...</span> <i class="fas fa-circle-notch fa-spin"></i>`;

            setTimeout(() => {
                submitBtn.innerHTML = `<span>TRANSMISSION SECURED</span> <i class="fas fa-check"></i>`;
                submitBtn.style.background = "linear-gradient(135deg, #10b981, #059669)";
                form.reset();

                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = `<span>Transmit Packet</span> <i class="fas fa-paper-plane"></i>`;
                    submitBtn.style.background = "";
                }, 3000);
            }, 1200);
        }
    });
}

function initDepthOfFieldParallax() {
    const stage = document.getElementById("parallax-container");
    const layers = document.querySelectorAll(".parallax-layer");
    const slider = document.getElementById("focal-plane-slider");
    const ticks = document.querySelectorAll(".slider-ticks .tick");
    const readoutNode = document.getElementById("focal-node-id");

    const valVectorX = document.getElementById("val-vector-x");
    const valVectorY = document.getElementById("val-vector-y");
    const valFocalPlane = document.getElementById("val-focal-plane");
    const valBlurBg = document.getElementById("val-blur-bg");
    const valBlurMid = document.getElementById("val-blur-mid");
    const valBlurHero = document.getElementById("val-blur-hero");
    const terminalOutput = document.getElementById("log-terminal-output");

    const btnAutofocus = document.getElementById("btn-toggle-autofocus");
    const btnGuides = document.getElementById("btn-toggle-guides");
    const btnOverdrive = document.getElementById("btn-toggle-overdrive");

    const blurElements = {
        bg: document.getElementById("blur-element-bg"),
        mid: document.getElementById("blur-element-mid"),
        fore: document.getElementById("blur-element-fore")
    };

    let targetMouseX = 0,
        targetMouseY = 0;
    let currentMouseX = 0,
        currentMouseY = 0;

    let currentFocalPlane = 1;
    let autoFocusActive = true;
    let motionOverdrive = false;

    const focalPlaneLabels = {
        0: "FOREGROUND_BARRIER",
        1: "MERN_HERO_UNIT",
        2: "MIDGROUND_CIRCUITS",
        3: "DISTANT_VECTOR_MESH",
        4: "DEEP_COSMIC_SKY"
    };

    const baseBlurMatrix = {
        0: {
            bg: 18,
            mid: 9,
            fore: 0
        },
        1: {
            bg: 15,
            mid: 4,
            fore: 0
        },
        2: {
            bg: 8,
            mid: 0,
            fore: 10
        },
        3: {
            bg: 2,
            mid: 7,
            fore: 18
        },
        4: {
            bg: 0,
            mid: 12,
            fore: 24
        }
    };

    function appendTerminalLog(status, message) {
        if (!terminalOutput) return;
        const timeStr = new Date().toTimeString().split(' ')[0];
        const line = document.createElement("div");
        line.className = "terminal-line";
        line.innerHTML = `<span class="timestamp">[${timeStr}]</span> <span class="status-${status === 'SUCCESS' ? 'ok' : 'warn'}">${status}</span> ${message}`;
        terminalOutput.appendChild(line);
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }

    window.addEventListener("mousemove", (e) => {
        const width = window.innerWidth;
        const height = window.innerHeight;

        targetMouseX = (e.clientX - width / 2) / (width / 2);
        targetMouseY = (e.clientY - height / 2) / (height / 2);

        if (autoFocusActive && Math.abs(targetMouseY) > 0.6) {
            const calculatedPlane = Math.min(Math.max(Math.floor((targetMouseY + 1) * 2.2), 0), 4);
            if (calculatedPlane !== currentFocalPlane) {
                updateFocalInterface(calculatedPlane);
            }
        }
    });

    function updateFocalInterface(planeIndex) {
        currentFocalPlane = planeIndex;
        if (slider) slider.value = planeIndex;

        ticks.forEach(t => {
            t.classList.toggle("active", parseInt(t.getAttribute("data-index")) === planeIndex);
        });

        if (readoutNode) readoutNode.textContent = focalPlaneLabels[planeIndex];
        if (valFocalPlane) valFocalPlane.textContent = planeIndex;

        applyOpticalLensBlur(planeIndex);
    }

    function applyOpticalLensBlur(planeIndex) {
        const configuration = baseBlurMatrix[planeIndex];

        if (blurElements.bg) blurElements.bg.setAttribute("stdDeviation", configuration.bg);
        if (blurElements.mid) blurElements.mid.setAttribute("stdDeviation", configuration.mid);
        if (blurElements.fore) blurElements.fore.setAttribute("stdDeviation", configuration.fore);

        if (valBlurBg) valBlurBg.textContent = `${configuration.bg}px`;
        if (valBlurMid) valBlurMid.textContent = `${configuration.mid}px`;
        if (valBlurHero) valBlurHero.textContent = `${planeIndex === 1 ? 0 : Math.abs(planeIndex - 1) * 4}px`;

        layers.forEach(layer => {
            const index = parseInt(layer.getAttribute("data-focal-index"));
            if (index === 99) return;

            if (index === 4) layer.style.filter = "url(#dof-blur-macro-bg)";
            else if (index === 2 || index === 3) layer.style.filter = "url(#dof-blur-midground)";
            else if (index === 0) layer.style.filter = "url(#dof-blur-foreground)";
            else if (index === 1) {
                const calculatedHeroBlur = Math.abs(planeIndex - 1) * 4;
                layer.style.filter = calculatedHeroBlur === 0 ? "none" : `blur(${calculatedHeroBlur}px)`;
            }
        });
    }

    if (slider) {
        slider.addEventListener("input", (e) => {
            autoFocusActive = false;
            if (btnAutofocus) {
                btnAutofocus.textContent = "ENGAGE_AUTOFOCUS";
                btnAutofocus.classList.replace("btn-primary", "btn-secondary");
            }
            updateFocalInterface(parseInt(e.target.value));
        });
    }

    ticks.forEach(tick => {
        tick.addEventListener("click", () => {
            autoFocusActive = false;
            if (btnAutofocus) {
                btnAutofocus.textContent = "ENGAGE_AUTOFOCUS";
                btnAutofocus.classList.replace("btn-primary", "btn-secondary");
            }
            updateFocalInterface(parseInt(tick.getAttribute("data-index")));
        });
    });

    if (btnAutofocus) {
        btnAutofocus.addEventListener("click", () => {
            autoFocusActive = !autoFocusActive;
            if (autoFocusActive) {
                btnAutofocus.textContent = "SUSPEND_NODE";
                btnAutofocus.classList.replace("btn-secondary", "btn-primary");
                appendTerminalLog("SUCCESS", "Autofocus coordinate loop re-engaged perfectly.");
            } else {
                btnAutofocus.textContent = "ENGAGE_AUTOFOCUS";
                btnAutofocus.classList.replace("btn-primary", "btn-secondary");
                appendTerminalLog("WARN", "Autofocus calculation array suspended safely.");
            }
        });
    }

    if (btnGuides) {
        btnGuides.addEventListener("click", () => {
            const active = document.body.classList.toggle("visual-guides-active");
            btnGuides.textContent = active ? "SUSPEND_GUIDES" : "ENGAGE_GUIDES";
            btnGuides.classList.toggle("btn-primary", active);
            btnGuides.classList.toggle("btn-secondary", !active);
            appendTerminalLog("SUCCESS", `Focal boundary lines transformed to: ${active ? 'VISIBLE' : 'HIDDEN'}`);
        });
    }

    if (btnOverdrive) {
        btnOverdrive.addEventListener("click", () => {
            motionOverdrive = !motionOverdrive;
            btnOverdrive.textContent = motionOverdrive ? "SUSPEND_OVERDRIVE" : "ENGAGE_OVERDRIVE";
            btnOverdrive.classList.toggle("btn-primary", motionOverdrive);
            btnOverdrive.classList.toggle("btn-secondary", !motionOverdrive);
            appendTerminalLog("WARN", `Parallax motion coefficient overdrive forced to: ${motionOverdrive ? '2.5x' : '1.0x'}`);
        });
    }

    function renderLoop() {
        const interpolationFactor = 0.07;
        currentMouseX += (targetMouseX - currentMouseX) * interpolationFactor;
        currentMouseY += (targetMouseY - currentMouseY) * interpolationFactor;

        if (valVectorX) valVectorX.textContent = currentMouseX.toFixed(2);
        if (valVectorY) valVectorY.textContent = currentMouseY.toFixed(2);

        const motionCoefficient = motionOverdrive ? 2.5 : 1.0;

        layers.forEach(layer => {
            const depth = parseFloat(layer.getAttribute("data-depth"));
            if (depth === 0.0) return;

            const translateX = currentMouseX * depth * -40 * motionCoefficient;
            const translateY = currentMouseY * depth * -40 * motionCoefficient;

            layer.style.transform = `translate3d(${translateX}px, ${translateY}px, 0)`;
        });

        requestAnimationFrame(renderLoop);
    }

    updateFocalInterface(1);
    renderLoop();
}