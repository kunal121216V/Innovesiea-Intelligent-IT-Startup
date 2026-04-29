document.addEventListener("DOMContentLoaded", () => {
    setActiveNavigation();
    renderDynamicHighlights();
    initSolutionTabs();
    initAOSAnimations();
    initGSAPAnimations();
    enableMagneticHover();
    animateInsightCharts();
    initServiceFilters();
    handleContactForm();
});

function setActiveNavigation() {
    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    const navLinks = document.querySelectorAll(".app-nav .nav-link");

    navLinks.forEach((link) => {
        const linkPage = link.getAttribute("href");
        link.classList.toggle("active", linkPage === currentPage);
    });
}

function initAOSAnimations() {
    const revealItems = document.querySelectorAll(
        ".hero-section, .page-hero, .metric-card, .content-card, .service-card, .solution-card, .kpi-card, .chart-card, .award-panel, .mini-feature, .contact-form, .dynamic-card, .dynamic-panel"
    );

    revealItems.forEach((item, index) => {
        item.setAttribute("data-aos", index % 2 === 0 ? "fade-up" : "zoom-in-up");
        item.setAttribute("data-aos-delay", String(Math.min(index * 60, 360)));
        item.setAttribute("data-aos-duration", "850");
        item.setAttribute("data-aos-easing", "ease-out-cubic");
        item.classList.add("reveal-item");
    });

    if (window.AOS) {
        AOS.init({
            once: true,
            offset: 90,
            duration: 850,
            easing: "ease-out-cubic"
        });
        return;
    }

    if (!("IntersectionObserver" in window)) {
        revealItems.forEach((item) => item.classList.add("is-visible"));
        return;
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.16 }
    );

    revealItems.forEach((item) => observer.observe(item));
}

function initGSAPAnimations() {
    if (!window.gsap) {
        return;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
        return;
    }

    if (window.ScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);
    }

    gsap.from(".brand-mark", {
        opacity: 0,
        y: -16,
        duration: 0.7,
        ease: "power3.out"
    });

    gsap.from(".app-nav .nav-item", {
        opacity: 0,
        y: -12,
        duration: 0.55,
        stagger: 0.06,
        ease: "power3.out",
        delay: 0.08
    });

    gsap.from(".hero-section h1, .page-hero h1", {
        opacity: 0,
        y: 34,
        duration: 0.9,
        ease: "power3.out",
        delay: 0.15
    });

    gsap.from(".hero-media, .image-frame", {
        opacity: 0,
        scale: 0.94,
        y: 34,
        duration: 1,
        ease: "power3.out",
        delay: 0.22
    });

    if (!window.ScrollTrigger) {
        return;
    }

    gsap.utils.toArray(".section-pad").forEach((section) => {
        gsap.from(section, {
            scrollTrigger: {
                trigger: section,
                start: "top 82%",
                end: "bottom 35%",
                scrub: 0.7
            },
            y: 36,
            opacity: 0.88,
            ease: "none"
        });
    });

    gsap.utils.toArray(".hero-media img, .image-frame").forEach((image) => {
        gsap.to(image, {
            scrollTrigger: {
                trigger: image,
                start: "top bottom",
                end: "bottom top",
                scrub: 1
            },
            yPercent: -8,
            ease: "none"
        });
    });
}

function enableMagneticHover() {
    const hoverItems = document.querySelectorAll(
        ".btn, .metric-card, .content-card, .service-card, .solution-card, .kpi-card, .chart-card, .award-item, .mini-feature, .dynamic-card, .dynamic-panel"
    );

    hoverItems.forEach((item) => {
        item.addEventListener("mousemove", (event) => {
            const rect = item.getBoundingClientRect();
            const x = ((event.clientX - rect.left) / rect.width - 0.5) * 10;
            const y = ((event.clientY - rect.top) / rect.height - 0.5) * 10;

            item.style.setProperty("--hover-x", `${x}px`);
            item.style.setProperty("--hover-y", `${y}px`);
        });

        item.addEventListener("mouseleave", () => {
            item.style.setProperty("--hover-x", "0px");
            item.style.setProperty("--hover-y", "0px");
        });
    });
}

function animateInsightCharts() {
    const bars = document.querySelectorAll(".bar-item span");
    const customerBars = document.querySelectorAll(".customer-row strong");

    bars.forEach((bar) => {
        const finalHeight = bar.style.height;
        bar.style.setProperty("--target-height", finalHeight);
        bar.style.height = "0";
    });

    customerBars.forEach((bar) => {
        const finalWidth = bar.style.width;
        bar.style.setProperty("--target-width", finalWidth);
        bar.style.width = "0";
    });

    window.setTimeout(() => {
        bars.forEach((bar) => {
            bar.style.height = bar.style.getPropertyValue("--target-height");
        });

        customerBars.forEach((bar) => {
            bar.style.width = bar.style.getPropertyValue("--target-width");
        });
    }, 240);
}

function initServiceFilters() {
    const filterButtons = document.querySelectorAll(".filter-btn");
    const serviceItems = document.querySelectorAll(".service-item");

    if (!filterButtons.length || !serviceItems.length) {
        return;
    }

    filterButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const activeFilter = button.dataset.filter;

            filterButtons.forEach((item) => item.classList.toggle("active", item === button));

            serviceItems.forEach((item) => {
                const shouldShow = activeFilter === "all" || item.dataset.category === activeFilter;
                item.classList.toggle("is-hidden", !shouldShow);
            });
        });
    });
}

function initSolutionTabs() {
    const panel = document.querySelector("#solutionDetail");
    const tabs = document.querySelectorAll(".solution-tab");

    if (!panel || !tabs.length) {
        return;
    }

    const solutions = {
        launch: {
            title: "MVP Accelerator",
            copy: "A focused product sprint for teams who need market feedback quickly without sacrificing structure.",
            points: ["Clickable product prototype", "Core user flows and analytics", "Launch-ready cloud foundation"]
        },
        scale: {
            title: "Cloud Modernization",
            copy: "A stability and speed upgrade for products that are outgrowing their current systems.",
            points: ["Infrastructure review", "CI/CD and observability", "Security-minded access design"]
        },
        automate: {
            title: "AI Operations Layer",
            copy: "A practical automation layer that connects repetitive work, data, and internal decisions.",
            points: ["Workflow discovery", "Assistant and routing logic", "Human review controls"]
        }
    };

    const renderSolution = (key) => {
        const solution = solutions[key];

        panel.innerHTML = `
            <h3>${solution.title}</h3>
            <p>${solution.copy}</p>
            <ul>${solution.points.map((point) => `<li>${point}</li>`).join("")}</ul>
        `;
    };

    tabs.forEach((tab) => {
        tab.addEventListener("click", () => {
            tabs.forEach((item) => item.classList.toggle("active", item === tab));
            renderSolution(tab.dataset.solution);
        });
    });

    renderSolution("launch");
}

function renderDynamicHighlights() {
    const container = document.querySelector("#dynamicHighlights");

    if (!container) {
        return;
    }

    const highlights = [
        {
            icon: "bi-lightning-charge",
            title: "Discovery Sprint",
            copy: "Map goals, risks, user flows, and a build plan before the first production sprint starts."
        },
        {
            icon: "bi-kanban",
            title: "Delivery Dashboard",
            copy: "Keep scope, milestones, blockers, and release decisions visible for founders and operators."
        },
        {
            icon: "bi-shield-lock",
            title: "Security Baseline",
            copy: "Add practical access, backup, audit, and deployment safeguards while the product is still young."
        }
    ];

    container.innerHTML = highlights
        .map(
            (item) => `
                <div class="col-md-4">
                    <article class="dynamic-card">
                        <i class="bi ${item.icon}"></i>
                        <h3>${item.title}</h3>
                        <p>${item.copy}</p>
                    </article>
                </div>
            `
        )
        .join("");
}

function handleContactForm() {
    const form = document.querySelector(".contact-form");

    if (!form) {
        return;
    }

    const fields = Array.from(form.querySelectorAll("[data-rules]"));
    const messageField = form.querySelector("#projectMessage");
    const messageMeter = form.querySelector(".message-meter span");
    const alertBox = form.querySelector(".form-alert");

    const messages = {
        required: "This field is required.",
        email: "Enter a valid email address.",
        min: (min) => `Please enter at least ${min} characters.`
    };

    const getFieldValue = (field) => {
        if (field.type === "checkbox") {
            return field.checked ? "checked" : "";
        }

        return field.value.trim();
    };

    const showFieldState = (field, error) => {
        const wrapper = field.closest(".col-12, .col-md-6") || field.parentElement;
        const errorBox = wrapper.querySelector(".field-error");

        field.classList.toggle("is-invalid", Boolean(error));
        field.classList.toggle("is-valid", !error && Boolean(getFieldValue(field)));

        if (errorBox) {
            errorBox.textContent = error || "";
        }
    };

    const validateField = (field) => {
        const rules = field.dataset.rules.split("|");
        const value = getFieldValue(field);
        let error = "";

        rules.some((rule) => {
            const [name, parameter] = rule.split(":");

            if (name === "required" && !value) {
                error = messages.required;
            }

            if (name === "email" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                error = messages.email;
            }

            if (name === "min" && value.length < Number(parameter)) {
                error = messages.min(parameter);
            }

            return Boolean(error);
        });

        showFieldState(field, error);
        return !error;
    };

    const setAlert = (message, type = "success") => {
        if (!alertBox) {
            return;
        }

        alertBox.textContent = message;
        alertBox.classList.add("show");
        alertBox.classList.toggle("error", type === "error");
    };

    const updateMessageMeter = () => {
        if (!messageField || !messageMeter) {
            return;
        }

        const progress = Math.min((messageField.value.trim().length / 120) * 100, 100);
        messageMeter.style.width = `${progress}%`;
    };

    fields.forEach((field) => {
        field.addEventListener("input", () => {
            validateField(field);
            updateMessageMeter();
        });

        field.addEventListener("blur", () => validateField(field));
        field.addEventListener("change", () => validateField(field));
    });

    updateMessageMeter();

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const button = form.querySelector("button[type='submit']");
        const originalText = button.textContent;
        const isValid = fields.map((field) => validateField(field)).every(Boolean);

        if (!isValid) {
            setAlert("Please fix the highlighted fields before sending.", "error");
            const firstInvalid = form.querySelector(".is-invalid");
            firstInvalid?.focus();
            return;
        }

        button.textContent = "Sending...";
        button.disabled = true;
        form.classList.add("form-success");
        setAlert("Thanks. Your project brief is ready for the Innovesiea team.");

        window.setTimeout(() => {
            form.reset();
            fields.forEach((field) => field.classList.remove("is-valid", "is-invalid"));
            updateMessageMeter();
            button.textContent = originalText;
            button.disabled = false;
            form.classList.remove("form-success");
        }, 2200);
    });
}
