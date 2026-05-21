document.addEventListener('DOMContentLoaded', () => {
    // --- Elements ---
    const profileCard = document.getElementById('profileCard');
    const copyBtn = document.getElementById('copyBtn');
    const copyTooltip = document.getElementById('copyTooltip');
    const qrBtn = document.getElementById('qrBtn');
    const qrModal = document.getElementById('qrModal');
    const closeQr = document.getElementById('closeQr');

    // --- Interactive 3D Card Hover / Neon Glow ---
    if (profileCard) {
        profileCard.addEventListener('mousemove', (e) => {
            const rect = profileCard.getBoundingClientRect();
            
            // Mouse position relative to card
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Calculate tilt angle (max 10 degrees)
            const cardWidth = rect.width;
            const cardHeight = rect.height;
            const centerX = cardWidth / 2;
            const centerY = cardHeight / 2;
            
            const rotateX = ((centerY - y) / centerY) * 6; // max 6deg
            const rotateY = ((x - centerX) / centerX) * 6; // max 6deg
            
            // Update custom property for glow spotlight
            profileCard.style.setProperty('--x', `${x}px`);
            profileCard.style.setProperty('--y', `${y}px`);
            
            // Apply 3D transformation
            profileCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
            
            // Smoothly change border accent dynamically based on mouse position
            const percentX = (x / cardWidth) * 100;
            profileCard.style.borderImage = `linear-gradient(${percentX}deg, #f3d193, #a67c37) 1`;
        });
        
        profileCard.addEventListener('mouseleave', () => {
            // Reset transition
            profileCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
            profileCard.style.borderImage = 'none';
            profileCard.style.borderColor = 'rgba(255, 255, 255, 0.08)';
        });
    }

    // --- Copy Link Functionality ---
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            // Fallback for local files or unsecured HTTP where navigator.clipboard might fail
            const pageUrl = window.location.href;
            
            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(pageUrl)
                    .then(() => showTooltip())
                    .catch(err => copyFallback(pageUrl));
            } else {
                copyFallback(pageUrl);
            }
        });
    }

    function copyFallback(text) {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";  // Avoid scrolling to bottom
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            document.execCommand('copy');
            showTooltip();
        } catch (err) {
            console.error('Failed to copy', err);
        }
        document.body.removeChild(textArea);
    }

    function showTooltip() {
        copyTooltip.classList.add('show');
        setTimeout(() => {
            copyTooltip.classList.remove('show');
        }, 2000);
    }

    // --- QR Code Modal ---
    if (qrBtn && qrModal && closeQr) {
        const qrImage = document.getElementById('qrImage');
        const qrLoading = document.getElementById('qrLoading');
        const qrNotice = document.getElementById('qrNotice');

        qrBtn.addEventListener('click', () => {
            qrModal.classList.add('show');
            
            // Get current page URL
            let currentUrl = window.location.href;
            
            // If the user is browsing locally via file://, provide a demo target URL (e.g. Jawad's Instagram)
            if (currentUrl.startsWith('file://')) {
                currentUrl = 'https://www.instagram.com/jawad2a008/';
                if (qrNotice) qrNotice.style.display = 'block';
            } else {
                if (qrNotice) qrNotice.style.display = 'none';
            }
            
            // Generate QR Code URL using QRServer API (luxury gold color: dfb76c, background: 08080a)
            const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&color=dfb76c&bgcolor=08080a&qzone=2&data=${encodeURIComponent(currentUrl)}`;
            
            if (qrImage && qrLoading) {
                qrImage.style.display = 'none';
                qrLoading.style.display = 'block';
                
                qrImage.src = qrApiUrl;
                
                qrImage.onload = () => {
                    qrLoading.style.display = 'none';
                    qrImage.style.display = 'block';
                };
                
                qrImage.onerror = () => {
                    qrLoading.textContent = 'خطأ في توليد رمز الـ QR';
                };
            }
        });

        closeQr.addEventListener('click', () => {
            qrModal.classList.remove('show');
        });

        // Close when clicking outside modal-content
        qrModal.addEventListener('click', (e) => {
            if (e.target === qrModal) {
                qrModal.classList.remove('show');
            }
        });
        
        // Escape key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && qrModal.classList.contains('show')) {
                qrModal.classList.remove('show');
            }
        });
    }

    // --- AI Chatbot Widget Logic ---
    const chatWidget = document.getElementById('chatWidget');
    const chatToggle = document.getElementById('chatToggle');
    const chatContainer = document.getElementById('chatContainer');
    const chatMessages = document.getElementById('chatMessages');
    const chatInput = document.getElementById('chatInput');
    const chatSendBtn = document.getElementById('chatSendBtn');
    const suggestionChips = document.querySelectorAll('.suggestion-chip');

    // Dynamic Social Links Fetch
    const getSocialLink = (platform) => {
        const linkElem = document.getElementById(`${platform}Link`);
        return linkElem ? linkElem.href : '#';
    };

    if (chatToggle && chatWidget) {
        // Open/Close toggle
        chatToggle.addEventListener('click', () => {
            chatWidget.classList.toggle('active');
            if (chatWidget.classList.contains('active')) {
                setTimeout(() => chatInput.focus(), 300);
                scrollToBottom();
            }
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && chatWidget.classList.contains('active')) {
                chatWidget.classList.remove('active');
            }
        });
    }

    // Scroll to bottom helper
    function scrollToBottom() {
        if (chatMessages) {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }

    // Escape HTML to prevent injection
    function escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, function(m) { return map[m]; });
    }

    // Bot Response Logic
    const botReplies = {
        snapchat: [
            "تفضل رابط حساب سناب شات الخاص بجواد القلعاوي لمتابعة يومياته وتفاعلاته الفورية:",
            "أهلاً بك! يمكنك إضافة جواد مباشرة على سناب شات (Snapchat) عبر هذا الرابط:",
            "يسعد جواد متابعتك له على سناب شات! اضغط هنا للانتقال إلى الحساب مباشرة:"
        ],
        instagram: [
            "لمشاهدة صور ومنشورات جواد القلعاوي وتحديثاته اليومية، تفضل بزيارة حسابه على إنستغرام:",
            "إليك رابط حساب إنستغرام (Instagram) الخاص بجواد لمتابعته والتواصل معه:",
            "يمكنك تصفح الحساب الرسمي لجواد على إنستغرام عبر هذا الزر المريح:"
        ],
        tiktok: [
            "لمشاهدة الفيديوهات والتفاعل مع جواد على تيك توك، اضغط على الرابط التالي:",
            "هذا هو الحساب الرسمي لجواد القلعاوي على منصة تيك توك (TikTok):",
            "تفضل بزيارة حساب تيك توك الخاص بجواد لمتابعة مقاطعه الجديدة من هنا:"
        ],
        facebook: [
            "تفضل برابط الملف الشخصي لجواد القلعاوي على فيسبوك للتواصل معه ومتابعة منشوراته:",
            "لزيارة صفحة جواد على فيسبوك (Facebook)، اضغط على الزر أدناه:",
            "يمكنك متابعة وتصفح منشورات جواد على فيسبوك من خلال هذا الرابط البسيط:"
        ],
        twitter: [
            "تابع أحدث التغريدات والآراء التقنية لجواد القلعاوي على منصة تويتر (X) من هنا:",
            "تفضل برابط حساب جواد الرسمي على تويتر / X لمتابعته والتفاعل معه:",
            "يمكنك تصفح حساب جواد على منصة X (تويتر سابقاً) عبر الرابط التالي:"
        ],
        bio: [
            "جواد القلعاوي هو طالب جامعي (University Student) شغوف بالتكنولوجيا والتطوير ومشارك على مختلف منصات التواصل الاجتماعي.",
            "جواد القلعاوي طالب في المرحلة الجامعية، يمتلك اهتماماً كبيراً بالتقنيات والشبكات الاجتماعية والتعلم المستمر.",
            "جواد طالب جامعي طموح ومهتم بكل ما هو جديد في عالم التقنية والشبكات الاجتماعية."
        ],
        all: [
            "إليك جميع الحسابات الرسمية لجواد القلعاوي للتواصل والمتابعة المباشرة:<br>• 👻 سناب شات<br>• 📸 إنستغرام<br>• 🎵 تيك توك<br>• 👤 فيسبوك<br>• 🐦 تويتر / X<br><br>تستطيع السؤال عن أي منصة للحصول على رابطها المباشر فورا!",
            "يسعد جواد تواصلك معه! إليك قائمة بجميع حساباته الرسمية المتوفرة:<br>• 👻 سناب شات<br>• 📸 إنستغرام<br>• 🎵 تيك توك<br>• 👤 فيسبوك<br>• 🐦 تويتر / X<br><br>اختر أي منصة تود وسأعطيك رابطها فورا.",
            "كل حسابات جواد الرسمية مجمعة هنا لسهولة الوصول إليها:<br>• 👻 سناب شات<br>• 📸 إنستغرام<br>• 🎵 تيك توك<br>• 👤 فيسبوك<br>• 🐦 تويتر / X<br><br>ما هي المنصة التي تفضل زيارتها؟"
        ],
        greetings: [
            "أهلاً بك! أنا مساعد جواد الذكي. كيف يمكنني مساعدتك اليوم؟",
            "مرحباً بك في صفحة جواد القلعاوي! أنا هنا لإرشادك وتزويدك بروابط حساباته. كيف يمكنني خدمتك؟",
            "أهلاً وسهلاً بك! سعيد بتواجدك. هل تود الحصول على رابط أحد حسابات جواد؟"
        ],
        default: [
            "سؤال رائع! لست متأكداً من الإجابة بدقة، ولكن يمكنك العثور على جميع حسابات التواصل الخاصة بجواد (سناب، إنستغرام، تيك توك، فيسبوك، وتويتر) في الصفحة والوصول إليها بضغطة زر.",
            "أهلاً بك! لم أفهم سؤالك تماماً، ولكن يمكنك دائماً استخدام أزرار الاقتراحات السريعة بالأسفل للحصول على روابط حسابات جواد.",
            "عذراً، لم أفهم استفسارك. هل تود تصفح حسابات جواد على شبكات التواصل الاجتماعي؟ اكتب اسم المنصة وسأحضر لك الرابط فوراً!"
        ]
    };

    function getRandomReply(category) {
        const replies = botReplies[category] || botReplies['default'];
        const randomIndex = Math.floor(Math.random() * replies.length);
        return replies[randomIndex];
    }

    function handleBotReply(userInput) {
        showTypingIndicator();
        
        setTimeout(() => {
            removeTypingIndicator();
            const cleanInput = userInput.trim().toLowerCase();
            
            let replyText = "";
            let linkHtml = "";
            
            if (cleanInput.includes('سناب') || cleanInput.includes('snapchat')) {
                const link = getSocialLink('snapchat');
                replyText = getRandomReply('snapchat');
                linkHtml = `<br><a href="${link}" target="_blank" class="chat-btn-link">فتح سناب شات 👻</a>`;
            } 
            else if (cleanInput.includes('إنستقرام') || cleanInput.includes('انستقرام') || cleanInput.includes('instagram') || cleanInput.includes('انستا') || cleanInput.includes('انستجرام')) {
                const link = getSocialLink('instagram');
                replyText = getRandomReply('instagram');
                linkHtml = `<br><a href="${link}" target="_blank" class="chat-btn-link">فتح إنستغرام 📸</a>`;
            } 
            else if (cleanInput.includes('تيك توك') || cleanInput.includes('تيكتوك') || cleanInput.includes('tiktok')) {
                const link = getSocialLink('tiktok');
                replyText = getRandomReply('tiktok');
                linkHtml = `<br><a href="${link}" target="_blank" class="chat-btn-link">فتح تيك توك 🎵</a>`;
            } 
            else if (cleanInput.includes('فيسبوك') || cleanInput.includes('فيس') || cleanInput.includes('facebook')) {
                const link = getSocialLink('facebook');
                replyText = getRandomReply('facebook');
                linkHtml = `<br><a href="${link}" target="_blank" class="chat-btn-link">فتح فيسبوك 👤</a>`;
            } 
            else if (cleanInput.includes('تويتر') || cleanInput.includes('منصة x') || cleanInput.includes('twitter') || cleanInput.includes('اكس') || cleanInput.includes(' x ')) {
                const link = getSocialLink('twitter');
                replyText = getRandomReply('twitter');
                linkHtml = `<br><a href="${link}" target="_blank" class="chat-btn-link">فتح تويتر / X 🐦</a>`;
            } 
            else if (cleanInput.includes('من جواد') || cleanInput.includes('من هو') || cleanInput.includes('مين جواد') || cleanInput.includes('jawad') || cleanInput.includes('bio') || cleanInput.includes('البايو')) {
                replyText = getRandomReply('bio');
            } 
            else if (cleanInput.includes('كل الحسابات') || cleanInput.includes('جميع الحسابات') || cleanInput.includes('روابط') || cleanInput.includes('روابطك') || cleanInput.includes('all')) {
                replyText = getRandomReply('all');
            } 
            else if (cleanInput.includes('مرحبا') || cleanInput.includes('هلا') || cleanInput.includes('السلام عليكم') || cleanInput.includes('سلام') || cleanInput.includes('hi') || cleanInput.includes('hello')) {
                replyText = getRandomReply('greetings');
            } 
            else {
                replyText = getRandomReply('default');
            }
            
            addBotMessage(replyText, linkHtml);
        }, 1000);
    }

    function showTypingIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'message bot-message typing-indicator-msg';
        indicator.id = 'typingIndicator';
        indicator.innerHTML = `
            <div class="message-text">
                <div class="typing-indicator-container">
                    <span class="typing-dot"></span>
                    <span class="typing-dot"></span>
                    <span class="typing-dot"></span>
                </div>
            </div>
        `;
        chatMessages.appendChild(indicator);
        scrollToBottom();
    }

    function removeTypingIndicator() {
        const indicator = document.getElementById('typingIndicator');
        if (indicator) indicator.remove();
    }

    function addUserMessage(text) {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'message user-message';
        msgDiv.innerHTML = `<div class="message-text">${escapeHtml(text)}</div>`;
        chatMessages.appendChild(msgDiv);
        scrollToBottom();
    }

    function addBotMessage(text, linkHtml = '') {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'message bot-message';
        msgDiv.innerHTML = `<div class="message-text">${text}${linkHtml}</div>`;
        chatMessages.appendChild(msgDiv);
        scrollToBottom();
    }

    // Message Sending Action
    function sendMessage() {
        const text = chatInput.value.trim();
        if (!text) return;
        
        addUserMessage(text);
        chatInput.value = '';
        handleBotReply(text);
    }

    if (chatSendBtn && chatInput) {
        chatSendBtn.addEventListener('click', sendMessage);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }

    // Suggestion Chips Click
    suggestionChips.forEach(chip => {
        chip.addEventListener('click', () => {
            const query = chip.getAttribute('data-query');
            let queryText = chip.textContent;
            
            addUserMessage(queryText);
            
            // Map query to proper bot search
            handleBotReply(query);
        });
    });

    // --- Subtle Hover Sound or Haptic Effect ---
    // (Optional) Add a very micro vibration for mobile users on clicking links
    const linkCards = document.querySelectorAll('.link-card, .action-btn');
    linkCards.forEach(card => {
        card.addEventListener('click', () => {
            if ('vibrate' in navigator) {
                navigator.vibrate(8); // Short vibration
            }
        });
    });
});
