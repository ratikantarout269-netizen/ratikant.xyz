// Scroll Effect on Navbar
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Smooth reveal elements on scroll (Optional Enhancement)
document.addEventListener("DOMContentLoaded", () => {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Get all sections and cards to animate
    const elementsToAnimate = document.querySelectorAll('.about-card, .skill-tag, .project-card, .section-title');
    
    elementsToAnimate.forEach(el => {
        el.style.opacity = "0";
        el.style.transform = "translateY(30px)";
        el.style.transition = "all 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)";
        observer.observe(el);
    });
});

// Chatbot Logic — wrapped in DOMContentLoaded so all elements exist
document.addEventListener('DOMContentLoaded', () => {
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotClose = document.getElementById('chatbot-close');
    const chatbotWindow = document.getElementById('chatbot-window');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotSend = document.getElementById('chatbot-send');
    const chatbotMessages = document.getElementById('chatbot-messages');

    let chatHistory = [
        {
            role: "user",
            parts: [{ text: "You are an AI assistant built into Ratikant Rout's portfolio website. You must be helpful, extremely concise, and polite. Only answer with 1 to 2 sentences max. You know that he is a talented B.Tech CSE student (2024-2028), among the top 5% of his batch, and creates stunning web apps using HTML, CSS, React, and Node." }]
        },
        {
            role: "model",
            parts: [{ text: "Got it! I am ready to help visitors learn more about Ratikant concisely." }]
        }
    ];

    chatbotToggle.addEventListener('click', () => {
        chatbotWindow.classList.toggle('active');
    });

    chatbotClose.addEventListener('click', () => {
        chatbotWindow.classList.remove('active');
    });

    function addMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('chat-msg', sender === 'user' ? 'user-msg' : 'bot-msg');
        msgDiv.innerHTML = text.replace(/\n/g, '<br>');
        chatbotMessages.appendChild(msgDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    async function handleChat() {
        const text = chatbotInput.value.trim();
        if (!text) return;

        addMessage(text, 'user');
        chatbotInput.value = '';

        chatHistory.push({ role: "user", parts: [{ text }] });

        const loadingId = 'loading-' + Date.now();
        const loadingDiv = document.createElement('div');
        loadingDiv.id = loadingId;
        loadingDiv.classList.add('chat-msg', 'bot-msg');
        loadingDiv.innerHTML = '<i class="bx bx-dots-horizontal-rounded bx-burst"></i>';
        chatbotMessages.appendChild(loadingDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

        try {
            const apiKey = "AIzaSyCQ3aJZUzIX10HovFVdgnLon_2Fpx9TmhI";
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: chatHistory })
            });

            const data = await response.json();
            document.getElementById(loadingId).remove();

            if (data.candidates && data.candidates.length > 0) {
                const botReply = data.candidates[0].content.parts[0].text;
                addMessage(botReply, 'model');
                chatHistory.push({ role: "model", parts: [{ text: botReply }] });
            } else {
                addMessage('Sorry, I encountered an error. Try again.', 'model');
            }
        } catch (err) {
            if (document.getElementById(loadingId)) document.getElementById(loadingId).remove();
            addMessage('Connection error. Please try again.', 'model');
            console.error(err);
        }
    }

    chatbotSend.addEventListener('click', handleChat);
    chatbotInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleChat();
    });
});

// EmailJS Form Integration
const contactForm = document.getElementById('contact-form');
const submitBtn = document.getElementById('submit-btn');

// EmailJS Contact Form
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');

    if (contactForm) {
        // Always block default form submit FIRST — prevents page refresh
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const originalText = submitBtn.innerText;
            submitBtn.innerText = 'Sending...';

            try {
                emailjs.init({ publicKey: "MticGpahh4_zAb7Wg" });

                emailjs.sendForm('service_mdcgfqs', 'template_l2ho9xr', this)
                    .then(() => {
                        submitBtn.innerText = 'Sent Successfully!';
                        contactForm.reset();
                        setTimeout(() => submitBtn.innerText = originalText, 3000);
                    }, (error) => {
                        submitBtn.innerText = 'Error! Try again.';
                        console.error("EmailJS FAILED:", error);
                        setTimeout(() => submitBtn.innerText = originalText, 3000);
                    });
            } catch (err) {
                submitBtn.innerText = 'Service unavailable.';
                console.error("EmailJS not loaded:", err);
                setTimeout(() => submitBtn.innerText = originalText, 3000);
            }
        });
    }
});
