<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Voice Agent Carousel</title>
    <link href="https://fonts.googleapis.com/css2?family=Square+Peg&family=Inter:wght@400;500;600&family=Roboto+Flex:wght@600&display=swap" rel="stylesheet" media="print" onload="this.media='all'">
    <noscript><link href="https://fonts.googleapis.com/css2?family=Square+Peg&family=Inter:wght@400;500;600&family=Roboto+Flex:wght@600&display=swap" rel="stylesheet"></noscript>
    <style>
        .container { max-width: 620px; margin: 0 auto; display: flex; flex-direction: column; align-items: center; gap: 24px; padding: 20px 10px; opacity: 0; transition: opacity 0.8s ease-in-out; }
        .container.loaded { opacity: 1; }

        /* Dropdown Pill */
        .dropdown-pill { display: flex; width: 260px; margin: 0 auto; align-items: center; gap: 8px; border-radius: 12px; background: rgba(255,255,255,0.06); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.1); position: relative; cursor: pointer; z-index: 1000; transition: all 0.3s ease; }
        .dropdown-pill:hover { transform: scale(1); }
        .country-info:hover { transform: scale(1); background: rgba(255,255,255,0.1); }
        .nav-btn, .agent-nav-btn { background: rgba(255,255,255,0); border: none; border-radius: 8px; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #fff; font-size: 16px; transition: all 0.3s ease; position: relative; z-index: 1001; }
        .nav-btn:hover, .agent-nav-btn:hover { background: rgba(255,255,255,0.1); transform: scale(1.05); }
        .nav-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .nav-btn svg, .agent-nav-btn svg { width: 8px; height: 12px; transition: transform 0.3s ease; }
        .nav-btn:hover svg { transform: scale(1.1); }
        .right-arrow svg { transform: scaleX(-1); }
        .right-arrow:hover svg { transform: scaleX(-1) scale(1.1); }
        .agent-nav-btn { width: 40px; height: 40px; gap: 12px; border-radius: 29.231px; background: rgba(245,243,249,0.1); backdrop-filter: blur(6px); }
        .agent-nav-btn svg { width: 16px; height: 16px; }
        .agent-nav-btn:hover svg { transform: scale(1.1); }
        .agent-nav-btn.right-arrow svg { transform: scaleX(-1); }
        .agent-nav-btn.right-arrow:hover svg { transform: scaleX(-1) scale(1.1); }
        .country-info { flex: 1; display: flex; align-items: center; gap: 8px; justify-content: center; color: #FFEDF4; font-family: Inter; font-size: 12px; line-height: 18px; padding: 8px; border-radius: 8px; cursor: pointer; transition: background 0.3s ease; }
        .flag, .card-flag { width: 24px; height: 24px; border-radius: 2px; overflow: hidden; }
        .dropdown-item-flag { width: 18px; height: 18px; border-radius: 2px; overflow: hidden; }
        .flag img, .dropdown-item-flag img, .card-flag img { height: 100%; object-fit: cover; }

        /* Dropdown Menu */
        .dropdown-menu { position: absolute; top: 100%; left: 0; right: 0; margin-top: 4px; background: rgba(56,47,80,0.9); border-radius: 12px; z-index: 999999999; opacity: 0; visibility: hidden; transform: translateY(-10px); transition: all 0.3s ease; padding: 8px 0; box-shadow: 0 4px 12px rgba(0,0,0,0.3); max-height: 200px; overflow-y: auto; backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.1); scrollbar-width: none; }
        .dropdown-menu::-webkit-scrollbar { display: none; }
        .dropdown-menu.open { opacity: 1; visibility: visible; transform: translateY(0); }
        .dropdown-item { display: flex; align-items: center; gap: 12px; padding: 12px 16px; color: #FFEDF4; font-family: Inter; font-size: 12px; line-height: 18px; cursor: pointer; transition: background 0.3s ease; border-bottom: 1px solid rgba(255,255,255,0.1); }
        .dropdown-item:last-child { border-bottom: none; }
        .dropdown-item:hover { background: rgba(255,255,255,0.1); }
        .dropdown-item.active { background: rgba(255,255,255,0.2); }

        /* Cards Component */
        .cards-component { display: flex; justify-content: center; align-items: center; height: 256px; gap: 20px; position: relative; width: 100%; max-width: 620px; margin: 0 auto; }
        .carousel-container { position: relative; width: 620px; height: 256px; transform-style: preserve-3d; overflow: hidden; flex-shrink: 0; display: flex; justify-content: center; align-items: center; margin: 0 auto; }
        .carousel { position: relative; width: 80%; height: 100%; transform-style: preserve-3d; transition: transform 0.6s cubic-bezier(0.4,0,0.2,1); display: flex; justify-content: center; align-items: center; }
        .carousel.scrolling { transition: none; }
        .carousel.zoom { transition: transform 0.1s cubic-bezier(0.4,0,0.2,1); }
        .carousel.fast-navigation { transition: transform 0.15s cubic-bezier(0.4,0,0.2,1); }
        .card { position: absolute; display: flex; flex-direction: column; justify-content: flex-end; align-items: center; gap: 8px; border-radius: 10.165px; color: #fff; cursor: pointer; transition: all 0.6s ease-in-out; transform-style: preserve-3d; overflow: hidden; background-size: cover; background-position: top center; background-repeat: no-repeat; box-sizing: border-box; }
        .carousel.scrolling .card { transition: none; }
        .carousel.fast-navigation .card { transition: all 0.15s ease-in-out; }
        .card:hover { transform: translateZ(20px) scale(1.05); }
        .card-content { background: linear-gradient(transparent, rgba(0,0,0,0.7)); width: 100%; position: relative; z-index: 2; box-sizing: border-box; padding: 12px; }
        .card-header { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
        .card-name { font-family: "Roboto Flex"; font-size: 18px; font-weight: 600; line-height: 21px; color: #FFF; font-style: normal; letter-spacing: 0; text-shadow: 0,1px,2px,rgba(0,0,0,0.8); }
        .card-role { font-family: "Inter"; font-size: 12px; font-weight: 400; line-height: 18px; color: #FFF; font-style: normal; text-shadow: 0,1px,2px,rgba(0,0,0,0.8); margin-bottom: 8px; }
        .card-tags { display: flex; gap: 4px; }
        .card-tag { display: flex; height: 24px; padding: 0px 8px; align-items: center; border-radius: 100px; background: rgba(197, 192, 209, 0.14); color: #F1F0F5; font-family: Inter; font-size: 10px; font-weight: 500; line-height: 14px; font-style: normal; }

        /* Fast Navigation Indicator */
        .fast-navigation-indicator { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(255,255,255,0.9); color: #333; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: 500; z-index: 1000; opacity: 0; pointer-events: none; transition: opacity 0.3s ease; }
        .fast-navigation-indicator.show { opacity: 1; }

        /* Call Button */
        .call-btn { display: flex; padding: 11px 20px; justify-content: center; align-items: center; gap: 8px; border-radius: 11px; background: linear-gradient(0deg, rgba(255, 20, 20, 0.20) 0%, rgba(255, 20, 20, 0.20) 100%), linear-gradient(90deg, #FC6337 0%, #C516E1 100%); box-shadow: 0 6px 16px 0 rgba(238, 33, 122, 0.40); border: none; color: #fff; font-size: 16px; font-weight: 500; cursor: pointer; transition: all 0.3s ease; width: 155px; margin: 0 auto; position: relative; z-index: 10; }
        .call-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(238,33,122,0.5); }
        .call-btn:active { transform: translateY(0); }
        .call-btn pop { animation: buttonPop 0.3s ease; }
        .call-icon { width: 15px; height: 15px; z-index: 11; }

        @keyframes buttonPop { 0% { transform: scale(1); } 50% { transform: scale(1.05); } 100% { transform: scale(1); } }

        /* Try Now Section */
        .try-now-section { display: flex; align-items: center; justify-content: center; gap: 4px; margin-top: 16px; position: relative; right: 100px; bottom: 35px; }
        .try-now-text { color: #FFF; font-family: "Square Peg"; font-size: 28px; font-style: normal; font-weight: 400; line-height: normal; position: relative; bottom: -10px; }
        .try-now-arrow { width: 43px; height: 33px; }

        /* Loading State */
        .carousel .card { opacity: 0; transform: translate3d(0, 30px, 0) scale(0.9); transition: opacity 0.6s ease-out, transform 0.6s ease-out; }
        .carousel.loaded .card { opacity: 1; transform: translate3d(0, 0, 0) scale(1); }

        /* Responsive Design */
        @media (max-width: 640px) {
            .container { max-width: 500px; padding: 15px 10px; }
            .carousel-container { min-width: 450px; width: 100%; height: 256px; position: relative; }
            .card { width: 180px; height: 230px; }
            .card-name { font-size: 16px !important; line-height: 19px !important; }
            .card-role { font-size: 11px !important; line-height: 16px !important; }
            .card-tag { font-size: 9px !important; line-height: 13px !important; padding: 3px 6px !important; height: 20px !important; }
            .agent-nav-btn { position: absolute; top: 50%; transform: translateY(-50%); z-index: 10; min-width: 40px; min-height: 40px; touch-action: manipulation; background: rgba(245,243,249,0.1); backdrop-filter: blur(6px); }
            .agent-nav-btn#prevAgent { left: 10px; }
            .agent-nav-btn#nextAgent { right: 10px; }
        }

        @media (max-width: 480px) {
            .container { max-width: 280px; }
            .carousel-container { min-width: 450px; transform: scale(0.82); }
            .card { width: 150px; height: 190px; }
            .card-name { font-size: 14px !important; line-height: 17px !important; }
            .card-role { font-size: 10px !important; line-height: 14px !important; }
            .card-tag { font-size: 8px !important; line-height: 12px !important; padding: 2px 5px !important; height: 18px !important; }
            .agent-nav-btn { min-width: 44px; min-height: 44px; }
            .agent-nav-btn#prevAgent { left: 5px; }
            .agent-nav-btn#nextAgent { right: 5px; }
        } 

        /* Dropdown navigation button styles */
        #prevCountryBtn, #nextCountryBtn { background: rgba(255,255,255,0); border: none; border-radius: 8px; width: 38px; height: 32px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #fff; font-size: 16px; transition: all 0.3s ease; position: relative; z-index: 1001; }
        #prevCountryBtn:hover, #nextCountryBtn:hover { background: rgba(255,255,255,0); transform: scale(1.2); }
        #prevCountryBtn:disabled, #nextCountryBtn:disabled { opacity: 0.5; cursor: not-allowed; }
        #prevCountryBtn svg, #nextCountryBtn svg { width: 8px; height: 12px; transition: transform 0.3s ease; }
        #prevCountryBtn:hover svg { transform: scale(1.1); }
        #nextCountryBtn svg { transform: scaleX(-1); }
        #nextCountryBtn:hover svg { transform: scaleX(-1) scale(1.1); }
    </style>
</head>
<body>
    <div class="container" id="mainContainer">
        <div class="dropdown-pill" id="dropdownPill">
            <button class="nav-btn" id="prevCountryBtn" onclick="navigateCountry(-1)">
                <svg xmlns="http://www.w3.org/2000/svg" width="8" height="12" viewBox="0 0 8 12" fill="none">
                    <path d="M6.5 1L1.5 6L6.5 11" stroke="#A491C6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
            <div class="country-info" id="countryInfo">
                <div class="flag" id="countryFlag">
                    <img src="https://murf.ai/public-assets/countries/us-canada.svg" alt="English (US)" loading="lazy">
                </div>
                <span id="countryName">English (US)</span>
            </div>
            <button class="nav-btn right-arrow" id="nextCountryBtn" onclick="navigateCountry(1)">
                <svg xmlns="http://www.w3.org/2000/svg" width="8" height="12" viewBox="0 0 8 12" fill="none">
                    <path d="M6.5 1L1.5 6L6.5 11" stroke="#A491C6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
            <div class="dropdown-menu" id="dropdownMenu"></div>
        </div>
        <div class="cards-component">
            <div class="carousel-container" id="carouselContainer">
                <button class="agent-nav-btn" id="prevAgent">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M13.3337 7.33366H5.22033L8.94699 3.60699L8.00033 2.66699L2.66699 8.00033L8.00033 13.3337L8.94033 12.3937L5.22033 8.66699H13.3337V7.33366Z" fill="#FFEDF4"/>
                    </svg>
                </button>
                <div class="carousel" id="carousel"></div>
                <button class="agent-nav-btn right-arrow" id="nextAgent">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M13.3337 7.33366H5.22033L8.94699 3.60699L8.00033 2.66699L2.66699 8.00033L8.00033 13.3337L8.94033 12.3937L5.22033 8.66699H13.3337V7.33366Z" fill="#FFEDF4"/>
                    </svg>
                </button>
            </div>
        </div>
        <button class="call-btn" id="callBtn">
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none" class="call-icon">
                <path d="M4.16562 10.8346C0.584839 7.25381 0.675126 2.61904 0.879599 0.791039C0.931685 0.325394 1.33352 0 1.80207 0H3.14613C4.28244 0 5.39991 0.629178 5.60543 1.74675C6.12687 4.58225 4.00024 6 4.00024 6C4.00024 6 4.00024 7 6.00024 9C8.00024 11 9.00024 11 9.00024 11C9.00024 11 10.418 8.87338 13.2534 9.3948C14.371 9.60032 15.0002 10.7178 15.0002 11.8541L15.0002 13.1981C15.0002 13.6667 14.6748 14.0685 14.2092 14.1206C12.3811 14.3251 7.74639 14.4153 4.16562 10.8346Z" fill="#FFE3E9"/>
            </svg>
            Call Agent 0
        </button>
        <div class="try-now-section">
            <span class="try-now-text">Try them now!</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="43" height="33" viewBox="0 0 43 33" fill="none" class="try-now-arrow">
                <path d="M0.647109 31.4818C0.157917 31.2238 0.0815217 30.7027 0.476476 30.3177C0.87143 29.9327 1.58817 29.8297 2.07737 30.0877L1.36224 30.7847L0.647109 31.4818ZM33.5583 0.966036C34.0361 0.6348 34.7547 0.628985 35.1633 0.953051L41.822 6.23403C42.2306 6.55809 42.1745 7.08932 41.6966 7.42056C41.2188 7.7518 40.5002 7.75762 40.0916 7.43355L34.1727 2.73935L27.251 7.53743C26.7732 7.86867 26.0545 7.87448 25.6459 7.55042C25.2373 7.22635 25.2934 6.69512 25.7713 6.36388L33.5583 0.966036ZM1.36224 30.7847L2.07737 30.0877C5.2267 31.7482 12.0961 32.1497 18.6547 28.41C25.1908 24.6832 31.5601 16.734 33.1632 1.56199L34.2981 1.55281L35.4331 1.54363C33.8034 16.968 27.2805 25.5202 19.9447 29.7029C12.6315 33.8728 4.64924 33.592 0.647109 31.4818L1.36224 30.7847Z" fill="white"/>
            </svg>
        </div>
    </div>
    <script>
        const agents = [
            { index: 0, agent: "Customer Support Agent", name: "Madison", locale: "en-US", gender: "female", voice: "Amara", avatar: "madison-avatar.webp", project: "car-dealer", agentTags: ["Friendly", "Calm"], talkAbout: "Kind and professional agent assisting with orders, returns, product information, payments, and store details for the retail company KindCommerce.", flagName: "us-canada.svg", flagDisplayName: "English (US)" },
            { index: 5, agent: "Customer Support Agent", name: "George", locale: "en-UK", gender: "female", voice: "Ruby", avatar: "george-avatar.webp", project: "car-dealer", agentTags: ["Friendly", "Calm"], talkAbout: "Kind and professional agent assisting with orders, returns, product information, payments, and store details for the retail company KindCommerce.", flagName: "uk.svg", flagDisplayName: "English (UK)" },
            { index: 17, agent: "Customer Support Agent", name: "Rohan", locale: "en-IN", gender: "female", voice: "en-IN-arohi", avatar: "rohan-avatar.webp", project: "car-dealer", agentTags: ["Friendly", "Calm"], talkAbout: "Kind and professional agent assisting with orders, returns, product information, payments, and store details for the retail company KindCommerce.", flagName: "india.svg", flagDisplayName: "English (India)" },
            { index: 20, agent: "Customer Support Agent", name: "Chloe", locale: "en-AU", gender: "female", voice: "Kylie", avatar: "chloe-avatar.webp", project: "car-dealer", agentTags: ["Friendly", "Calm"], talkAbout: "Kind and professional agent assisting with orders, returns, product information, payments, and store details for the retail company KindCommerce.", flagName: "australia.svg", flagDisplayName: "English (Australia)" },
        ];

        const countries = [
            { name: "English (US)", flagName: "us-canada.svg", firstAgentIndex: 0, locale: "en-US" },
            { name: "English (UK)", flagName: "uk.svg", firstAgentIndex: 1, locale: "en-UK" },
            { name: "English (India)", flagName: "india.svg", firstAgentIndex: 2, locale: "en-IN" },
            { name: "English (Australia)", flagName: "australia.svg", firstAgentIndex: 3, locale: "en-AU" }
        ];

        let currentAgentIndex = 0, currentCountryIndex = 0, isScrolling = false, isDropdownOpen = false;
        let startX = 0, startY = 0, currentX = 0, currentY = 0, isDragging = false, dragDistance = 0, lastDragTime = 0, dragVelocity = 0;
        let lastScrollTime = 0, scrollThreshold = 100;
        const totalAgents = agents.length;

        // Performance optimization: Debounced image preloader
        function preloadCriticalImages() {
            const criticalImages = agents.slice(0, 7).map(agent => 
                `https://murf.ai/public-assets/va-avatars/${agent.avatar}`
            );
            
            criticalImages.forEach(src => {
                const img = new Image();
                img.loading = 'eager';
                img.src = src;
            });
        }

        // Lazy load remaining images
        function lazyLoadRemainingImages() {
            const remainingImages = agents.slice(7).map(agent => 
                `https://murf.ai/public-assets/va-avatars/${agent.avatar}`
            );
            
            setTimeout(() => {
                remainingImages.forEach(src => {
                    const img = new Image();
                    img.loading = 'lazy';
                    img.src = src;
                });
            }, 100);
        }

        function initCarousel() {
            const carousel = document.getElementById('carousel');
            const fragment = document.createDocumentFragment();
            
            agents.forEach((agent, index) => {
                const card = document.createElement('div');
                card.className = `card agent-${index}`;
                card.style.backgroundImage = `url('https://murf.ai/public-assets/va-avatars/${agent.avatar}')`;
                card.innerHTML = `
                    <div class="card-content">
                        <div class="card-header">
                            <div class="card-name">${agent.name}</div>
                            <div class="card-flag">
                                <img src="https://murf.ai/public-assets/countries/${agent.flagName}" alt="${agent.flagDisplayName}" loading="lazy">
                            </div>
                        </div>
                        <div class="card-role">${agent.agent}</div>
                        <div class="card-tags">${agent.agentTags.map(tag => `<div class="card-tag">${tag}</div>`).join('')}</div>
                    </div>
                `;
                card.onclick = () => navigateToAgent(index);
                fragment.appendChild(card);
            });
            
            carousel.appendChild(fragment);
            
            // Trigger fade-in animation
            requestAnimationFrame(() => {
                updateCarousel();
                updateCallButton();
                updateCountryInfo();
                
                setTimeout(() => {
                    carousel.classList.add('loaded');
                    document.getElementById('mainContainer').classList.add('loaded');
                }, 50);
            });
            
            initDropdown();
            addTouchSupport();
            addNavigationButtonTouchSupport();
            lazyLoadRemainingImages();
        }

        function initDropdown() {
            const dropdownMenu = document.getElementById('dropdownMenu');
            const dropdownPill = document.getElementById('dropdownPill');
            const countryInfo = document.getElementById('countryInfo');
            const fragment = document.createDocumentFragment();
            
            countries.forEach((country, index) => {
                const item = document.createElement('div');
                item.className = `dropdown-item${index === currentCountryIndex ? ' active' : ''}`;
                item.innerHTML = `
                    <div class="dropdown-item-flag">
                        <img src="https://murf.ai/public-assets/countries/${country.flagName}" alt="${country.name}" loading="lazy">
                    </div>
                    <div class="dropdown-item-name">${country.name}</div>
                `;
                item.onclick = () => selectCountry(index);
                fragment.appendChild(item);
            });
            
            dropdownMenu.appendChild(fragment);
            countryInfo.addEventListener('click', toggleDropdown);
            document.addEventListener('click', e => !dropdownPill.contains(e.target) && closeDropdown());
            document.getElementById('prevCountryBtn').addEventListener('click', closeDropdown);
            document.getElementById('nextCountryBtn').addEventListener('click', closeDropdown);
        }

        function toggleDropdown() {
            isDropdownOpen = !isDropdownOpen;
            document.getElementById('dropdownMenu').classList.toggle('open', isDropdownOpen);
        }

        function closeDropdown() {
            isDropdownOpen = false;
            document.getElementById('dropdownMenu').classList.remove('open');
        }

        function selectCountry(countryIndex) {
            if (countryIndex === currentCountryIndex) return closeDropdown();
            currentCountryIndex = countryIndex;
            const carousel = document.getElementById('carousel');
            carousel.classList.add('fast-navigation');
            scrollToAgent(countries[currentCountryIndex].firstAgentIndex);
            closeDropdown();
        }

        function addTouchSupport() {
            const container = document.getElementById('carouselContainer');
            container.addEventListener('touchstart', e => {
                e.preventDefault();
                startX = currentX = e.touches[0].clientX;
                startY = currentY = e.touches[0].clientY;
                isDragging = true;
                lastDragTime = Date.now();
                dragDistance = 0;
            }, { passive: false });
            container.addEventListener('touchmove', e => {
                e.preventDefault();
                if (!isDragging) return;
                currentX = e.touches[0].clientX;
                currentY = e.touches[0].clientY;
                if (Math.abs(currentX - startX) > Math.abs(currentY - startY)) dragDistance = currentX - startX;
            }, { passive: false });
            container.addEventListener('touchend', e => {
                if (!isDragging) return;
                const timeDiff = Date.now() - lastDragTime;
                dragVelocity = dragDistance / timeDiff;
                let cardsToScroll = 0;
                
                if (Math.abs(dragVelocity) > 0.5) {
                    cardsToScroll = Math.round(dragVelocity * 2);
                } else if (Math.abs(dragDistance) > 50) {
                    cardsToScroll = dragDistance > 0 ? -1 : 1;
                }
                
                if (cardsToScroll) {
                    const targetIndex = (currentAgentIndex - cardsToScroll + totalAgents) % totalAgents;
                    navigateToAgent(targetIndex);
                }
                isDragging = false;
            }, { passive: false });
            container.addEventListener('mousedown', e => {
                e.preventDefault();
                startX = currentX = e.clientX;
                startY = currentY = e.clientY;
                isDragging = true;
                lastDragTime = Date.now();
                dragDistance = 0;
            });
            container.addEventListener('mousemove', e => {
                if (!isDragging) return;
                currentX = e.clientX;
                currentY = e.clientY;
                if (Math.abs(currentX - startX) > Math.abs(currentY - startY)) dragDistance = currentX - startX;
            });
            container.addEventListener('mouseup', e => {
                if (!isDragging) return;
                const timeDiff = Date.now() - lastDragTime;
                dragVelocity = dragDistance / timeDiff;
                let cardsToScroll = 0;
                
                if (Math.abs(dragVelocity) > 0.5) {
                    cardsToScroll = Math.round(dragVelocity * 2);
                } else if (Math.abs(dragDistance) > 50) {
                    cardsToScroll = dragDistance > 0 ? -1 : 1;
                }
                
                if (cardsToScroll) {
                    const targetIndex = (currentAgentIndex - cardsToScroll + totalAgents) % totalAgents;
                    navigateToAgent(targetIndex);
                }
                isDragging = false;
            });
            container.addEventListener('mouseleave', () => isDragging && handleMouseUp());
            container.addEventListener('wheel', e => {
                e.preventDefault();
                const currentTime = Date.now();
                
                if (currentTime - lastScrollTime < 300) return;
                if (Math.abs(e.deltaY) < scrollThreshold) return;
                
                lastScrollTime = currentTime;
                const direction = e.deltaY > 0 ? 1 : -1;
                const targetIndex = (currentAgentIndex + direction + totalAgents) % totalAgents;
                navigateToAgent(targetIndex);
            }, { passive: false });
        }

        function handleMouseUp() {
            if (!isDragging) return;
            const timeDiff = Date.now() - lastDragTime;
            dragVelocity = dragDistance / timeDiff;
            let cardsToScroll = 0;
            
            if (Math.abs(dragVelocity) > 0.5) {
                cardsToScroll = Math.round(dragVelocity * 2);
            } else if (Math.abs(dragDistance) > 50) {
                cardsToScroll = dragDistance > 0 ? -1 : 1;
            }
            
            if (cardsToScroll) {
                const targetIndex = (currentAgentIndex - cardsToScroll + totalAgents) % totalAgents;
                navigateToAgent(targetIndex);
            }
            isDragging = false;
        }

        function updateCarousel() {
            const cards = document.querySelectorAll('.card');
            const totalCards = cards.length;
            
            cards.forEach((card, index) => {
                card.className = `card agent-${index}`;
                let relativeIndex = (index - currentAgentIndex + totalCards) % totalCards;
                if (relativeIndex > totalCards / 2) relativeIndex -= totalCards;
                
                const isVisible = Math.abs(relativeIndex) <= 2;
                
                const styles = [
                    { x: 0, z: 0, w: '200px', h: '256px', f: 'blur(0px)', zi: 7, s: 1, o: 1, br: '10.165px' },
                    { x: 120, z: -40, w: '200px', h: '256px', f: 'blur(1.4px)', zi: 6, s: 0.8, o: 1, br: '22px' },
                    { x: -120, z: -40, w: '200px', h: '256px', f: 'blur(1.4px)', zi: 6, s: 0.8, o: 1, br: '22px' },
                    { x: 0, z: -160, w: '200px', h: '256px', f: 'blur(0px)', zi: 1, s: 0.3, o: 0, br: '10.165px' }
                ];
                
                const styleIndex = relativeIndex === 0 ? 0 : relativeIndex === 1 ? 1 : relativeIndex === -1 ? 2 : 3;
                
                const style = styles[styleIndex];
                
                Object.assign(card.style, {
                    transform: `translate3d(${style.x}px, 0, ${style.z}px) scale(${style.s})`,
                    width: style.w,
                    height: style.h,
                    filter: style.f,
                    zIndex: style.zi,
                    opacity: isVisible ? style.o : 0,
                    borderRadius: style.br
                });
                
                card.onclick = () => navigateToAgent(index);
            });
        }

        function navigateToAgent(targetIndex) {
            if (isScrolling) return;
            
            let diff = targetIndex - currentAgentIndex;
            const half = Math.floor(totalAgents / 2);
            if (diff > half) diff -= totalAgents;
            if (diff < -half) diff += totalAgents;
            
            if (Math.abs(diff) <= 1) {
                currentAgentIndex = targetIndex;
                updateCurrentCountry();
                updateCarousel();
                updateCallButton();
                updateCountryInfo();
            } else {
                const carousel = document.getElementById('carousel');
                carousel.classList.add('fast-navigation');
                scrollToAgent(targetIndex);
            }
        }

        function scrollToAgent(targetIndex) {
            if (isScrolling) return;
            
            let diff = targetIndex - currentAgentIndex;
            const half = Math.floor(totalAgents / 2);
            if (diff > half) diff -= totalAgents;
            if (diff < -half) diff += totalAgents;
            
            const steps = Math.abs(diff);
            const direction = diff > 0 ? 1 : -1;
            const stepDuration = Math.min(150, 1000 / steps);
            
            isScrolling = true;
            let currentStep = 0;
            
            function animateStep() {
                if (currentStep >= steps) {
                    isScrolling = false;
                    currentAgentIndex = targetIndex;
                    updateCurrentCountry();
                    const carousel = document.getElementById('carousel');
                    carousel.classList.remove('scrolling', 'fast-navigation');
                    updateCarousel();
                    updateCallButton();
                    updateCountryInfo();
                    return;
                }
                
                currentAgentIndex = (currentAgentIndex + direction + totalAgents) % totalAgents;
                updateCurrentCountry();
                updateCarousel();
                currentStep++;
                setTimeout(animateStep, stepDuration);
            }
            
            animateStep();
        }

        function navigateAgent(direction) {
            if (isScrolling) return;
            navigateToAgent((currentAgentIndex + direction + totalAgents) % totalAgents);
        }

        function navigateCountry(direction) {
            if (isScrolling) return;
            closeDropdown();
            currentCountryIndex = (currentCountryIndex + direction + countries.length) % countries.length;
            const carousel = document.getElementById('carousel');
            carousel.classList.add('fast-navigation');
            scrollToAgent(countries[currentCountryIndex].firstAgentIndex);
        }

        function updateCurrentCountry() {
            const countryIndex = countries.findIndex(country => country.locale === agents[currentAgentIndex].locale);
            if (countryIndex !== -1) currentCountryIndex = countryIndex;
        }

        function updateCallButton() {
            const agent = agents[currentAgentIndex], btn = document.getElementById('callBtn');
            btn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none" class="call-icon">
                    <path d="M4.16562 10.8346C0.584839 7.25381 0.675126 2.61904 0.879599 0.791039C0.931685 0.325394 1.33352 0 1.80207 0H3.14613C4.28244 0 5.39991 0.629178 5.60543 1.74675C6.12687 4.58225 4.00024 6 4.00024 6C4.00024 6 4.00024 7 6.00024 9C8.00024 11 9.00024 11 9.00024 11C9.00024 11 10.418 8.87338 13.2534 9.3948C14.371 9.60032 15.0002 10.7178 15.0002 11.8541L15.0002 13.1981C15.0002 13.6667 14.6748 14.0685 14.2092 14.1206C12.3811 14.3251 7.74639 14.4153 4.16562 10.8346Z" fill="#FFE3E9"/>
                </svg>
                Call ${agent.name}
            `;
            btn.onclick = () => window.open(`https://dev.murf.ai/api/demo/voice-agent-text-to-speech/call?project=${agent.project}&locale=${agent.locale}&agentId=${agent.index}`, '_blank');
            btn.classList.add('pop');
            setTimeout(() => btn.classList.remove('pop'), 300);
        }

        function updateCountryInfo() {
            const country = countries[currentCountryIndex];
            document.getElementById('countryFlag').innerHTML = `<img src="https://murf.ai/public-assets/countries/${country.flagName}" alt="${country.name}" loading="lazy">`;
            document.getElementById('countryName').textContent = country.name;
            document.querySelectorAll('.dropdown-item').forEach((item, index) => item.classList.toggle('active', index === currentCountryIndex));
        }

        function addNavigationButtonTouchSupport() {
            const prevAgentBtn = document.getElementById('prevAgent');
            const nextAgentBtn = document.getElementById('nextAgent');

            prevAgentBtn.addEventListener('touchstart', e => { e.preventDefault(); e.stopPropagation(); navigateAgent(-1); }, { passive: false });
            nextAgentBtn.addEventListener('touchstart', e => { e.preventDefault(); e.stopPropagation(); navigateAgent(1); }, { passive: false });
            prevAgentBtn.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); navigateAgent(-1); });
            nextAgentBtn.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); navigateAgent(1); });
        }

        // Performance-optimized initialization
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                preloadCriticalImages();
                initCarousel();
            });
        } else {
            preloadCriticalImages();
            initCarousel();
        }

        document.addEventListener('keydown', e => {
            if (e.key === 'ArrowLeft') navigateAgent(-1);
            else if (e.key === 'ArrowRight') navigateAgent(1);
        });
    </script>
</body>
</html>
