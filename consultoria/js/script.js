let wakeLock = null;

async function requestWakeLock() {
    if (!("wakeLock" in navigator)) return;
    try {
        wakeLock = await navigator.wakeLock.request("screen");
        wakeLock.addEventListener("release", () => requestWakeLock());
    } catch (err) {}
}

document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") requestWakeLock();
});

requestWakeLock();

document.addEventListener('DOMContentLoaded', () => {
    const teamMembers = [
        {
            name: "Equipe Completa",
            role: "",
            bio: [],
            image: "assets/img/TODOS.png",
            isFullTeam: true,
            social: { linkedin: "", github: "", twitter: "" }
        },
        {
            name: "Diego Prado de Moraes",
            role: "Consultor de Negócios",
            bio: [
                "ATENDIMENTO AOS FRANQUEADOS",
                "VISITAS NAS LOJAS",
                "PICC"
            ],
            image: "assets/img/DIEGO.jpg",
            social: { linkedin: "#", github: "", twitter: "" }
        },
        {
            name: "Matheus Fuzaro",
            role: "Gerente da Consultoria",
            bio: [],
            image: "assets/img/MATHEUS.jpg",
            social: { linkedin: "#", github: "", twitter: "" }
        },
        {
            name: "Marcio Rubia",
            role: "Consultor de Negócios",
            bio: [
                "ATENDIMENTO AOS FRANQUEADOS",
                "VISITAS NAS LOJAS",
                "PICC"
            ],
            image: "assets/img/MARCIO.jpg",
            social: { linkedin: "#", github: "", twitter: "" }
        },
        {
            name: "Maria Medicci",
            role: "Analista Pleno de Dados Comerciais",
            bio: [
                "SUPORTE À CONSULTORIA",
                "SULTS"
            ],
            image: "assets/img/MARIA.jpg",
            social: { linkedin: "#", github: "", twitter: "" }
        },
        {
            name: "Marco Robert",
            role: "Consultor de Negócios",
            bio: [
                "ATENDIMENTO AOS FRANQUEADOS",
                "VISITAS NAS LOJAS"
            ],
            image: "assets/img/MARQUNHOS.jpg",
            social: { linkedin: "#", github: "", twitter: "" }
        },
        {
            name: "Marina Brigatto",
            role: "Consultor de Negócios",
            bio: [
                "ATENDIMENTO AOS FRANQUEADOS",
                "VISITAS NAS LOJAS"
            ],
            image: "assets/img/MARINA.jpg",
            social: { linkedin: "#", github: "", twitter: "" }
        }
    ];

    const carousel = document.getElementById('carousel');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const carouselIndicators = document.getElementById('carousel-indicators');

    let currentIndex = 0;
    let autoplayInterval;

    function createMemberCard(member) {
        const card = document.createElement('div');

        if (member.isFullTeam) {
            card.classList.add(
                'team-member-card', 'bg-white', 'rounded-lg', 'shadow-xl',
                'p-0', 'text-center', 'flex-shrink-0', 'w-full'
            );

            card.innerHTML = `
                <div class="full-team-card">
                    <img src="${member.image}" class="full-team-photo">
                </div>
            `;

            return card;
        }

        card.classList.add(
            'team-member-card', 'bg-white', 'rounded-lg', 'shadow-xl',
            'p-8', 'text-center', 'transform', 'scale-90', 'opacity-50',
            'flex-shrink-0', 'w-full', 'max-w-md', 'mx-auto'
        );

        const assignmentsHtml = member.bio
            .map((assignment, idx) => `<span class="assignment-item" style="animation-delay:${50 * idx}ms;">${assignment}</span>`)
            .join('');

        const photoClass = member.image.includes('MARCIO') ? 'profile-photo photo-marcio' : 'profile-photo';

        card.innerHTML = `
            <div class="photo-wrapper">
                <img src="${member.image}" class="${photoClass}">
                <img src="assets/img/gorro.png" class="gorro">
            </div>
            <h4 class="text-2xl font-bold text-gray-800 mb-2">${member.name}</h4>
            <p class="role-text-color font-semibold mb-4 text-lg">${member.role}</p>
            <div class="assignments-list text-base mb-6">${assignmentsHtml}</div>
        `;

        return card;
    }

    function renderCarousel() {
        const activeBefore = carousel.querySelector('.team-member-card.active');
        if (activeBefore) {
            activeBefore.querySelector('.assignments-list')?.classList.remove('animate-chips');
        }

        carousel.innerHTML = '';
        carouselIndicators.innerHTML = '';

        teamMembers.forEach((member, index) => {
            const card = createMemberCard(member);
            if (index === currentIndex) card.classList.add('active');
            carousel.appendChild(card);

            const indicator = document.createElement('div');
            indicator.classList.add('carousel-indicator');
            if (index === currentIndex) indicator.classList.add('active');
            indicator.onclick = () => { goToSlide(index); resetAutoplay(); };
            carouselIndicators.appendChild(indicator);
        });

        if (carousel.children.length > 0) {
            const cardWidth = carousel.children[0].offsetWidth;
            const offset = (carousel.offsetWidth / 2) - (cardWidth / 2) - (currentIndex * cardWidth);
            carousel.style.transform = `translateX(${offset}px)`;

            carousel.addEventListener('transitionend', function handler(e) {
                if (e.target === carousel) {
                    const activeCard = carousel.querySelector('.team-member-card.active');
                    activeCard.querySelector('.assignments-list')?.classList.add('animate-chips');
                    carousel.removeEventListener('transitionend', handler);
                }
            }, { once: true });
        }
    }

    function goToSlide(index) {
        currentIndex = (index + teamMembers.length) % teamMembers.length;
        renderCarousel();
    }

    function showNextSlide() {
        goToSlide(currentIndex + 1);
    }

    function showPrevSlide() {
        goToSlide(currentIndex - 1);
    }

    function startAutoplay() {
        autoplayInterval = setInterval(showNextSlide, 13000);
    }

    function resetAutoplay() {
        clearInterval(autoplayInterval);
        startAutoplay();
    }

    nextBtn.onclick = () => { showNextSlide(); resetAutoplay(); };
    prevBtn.onclick = () => { showPrevSlide(); resetAutoplay(); };

    renderCarousel();

    setTimeout(() => {
        const initial = carousel.querySelector('.team-member-card.active');
        initial.querySelector('.assignments-list')?.classList.add('animate-chips');
    }, 100);

    startAutoplay();

    window.addEventListener('resize', () => {
        resetAutoplay();
        renderCarousel();
    });
});

setInterval(() => {
    window.scrollBy(0, 1);
    window.scrollBy(0, -1);
}, 30000);

setInterval(() => {
    const evTouch = new Event("touchstart", { bubbles: true });
    document.dispatchEvent(evTouch);
    const evMouse = new MouseEvent("mousemove", {
        clientX: 1,
        clientY: 1,
        bubbles: true
    });
    document.dispatchEvent(evMouse);
    const evKey = new KeyboardEvent("keydown", { key: "Shift", bubbles: true });
    document.dispatchEvent(evKey);
}, 45000);
