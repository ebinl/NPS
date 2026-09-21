/**
 * NPS HOPEFARM - AI CHATBOT & WHATSAPP ENQUIRY ENGINE
 * Powered by Free AI API + NPS Hopefarm Knowledge Base + Direct WhatsApp Integration
 */

const NPS_WHATSAPP_NUMBER = "919900025002"; // Official school admissions WhatsApp number (+91 99000 25002)

const CHAT_SYSTEM_PROMPT = `
You are the official AI Admissions & Academic Assistant for National Public School (NPS) Hopefarm, Whitefield, Bengaluru.
Affiliation: Central Board of Secondary Education (CBSE), New Delhi.
Campus: 5-acre sprawling green campus at No. 141, Channasandra Grama, Bidarahalli Hobli, Near Isha Misty Green Villas, Bengaluru – 560049.
Legacy: 65+ years of the prestigious National Public School Group founded by Dr. K. P. Gopalkrishna.
Current Admissions: Academic Session 2026-27 for Pre-KG (Montessori) up to Grade VIII (expanding up to Grade XII).
Class strength: Optimal ratio of 30-32 students per class.
School timings: Pre-Primary (8:30 AM to 12:30 PM), Grade I to VIII (7:55 AM to 3:00 PM).
Infrastructure: Smart digital classrooms, 5000+ title Library & Media Centre, Physics/Chemistry/Biology/Cyber labs, Basketball, Badminton, Cricket, Football, Cafeteria (hygienic vegetarian food only), Wellness centre with nurse and counsellor, 500-seat Auditorium, GPS-tracked bus transport covering Hopefarm and East Bangalore.
Admissions process: 1) Online registration, 2) Document verification, 3) Interaction/assessment, 4) Offer & fee payment. Fee details are communicated directly to shortlisted parents.
Contact: +91 99000 25002 / +91 99000 31002 | info@npshopefarm.com.

Tone: Courteous, professional, warm, corporate, and helpful. Always offer to connect parents with the admissions desk on WhatsApp.
Keep responses concise (2 to 4 sentences).
`;

class NPSChatbot {
  constructor() {
    this.messages = [];
    this.isOpen = false;
    this.customApiKey = localStorage.getItem('nps_ai_api_key') || '';
    this.initElements();
    this.initEvents();
    this.renderWelcome();
  }

  initElements() {
    this.launcher = document.getElementById('ai-chatbot-launcher');
    this.window = document.getElementById('ai-chatbot-window');
    this.toggleBtn = document.getElementById('chatbot-toggle-btn');
    this.closeBtn = document.getElementById('chat-close-btn');
    this.settingsBtn = document.getElementById('chat-settings-btn');
    this.settingsModal = document.getElementById('chat-settings-modal');
    this.saveSettingsBtn = document.getElementById('chat-save-settings-btn');
    this.closeSettingsBtn = document.getElementById('chat-close-settings-btn');
    this.apiKeyInput = document.getElementById('chat-api-key-input');
    this.messagesContainer = document.getElementById('chat-messages');
    this.input = document.getElementById('chat-input');
    this.sendBtn = document.getElementById('chat-send-btn');
    this.suggestions = document.querySelectorAll('.suggestion-pill');

    if (this.apiKeyInput && this.customApiKey) {
      this.apiKeyInput.value = this.customApiKey;
    }
  }

  initEvents() {
    if (this.toggleBtn) {
      this.toggleBtn.addEventListener('click', () => this.toggleChat());
    }
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.closeChat());
    }
    if (this.settingsBtn) {
      this.settingsBtn.addEventListener('click', () => this.openSettings());
    }
    if (this.closeSettingsBtn) {
      this.closeSettingsBtn.addEventListener('click', () => this.closeSettings());
    }
    if (this.saveSettingsBtn) {
      this.saveSettingsBtn.addEventListener('click', () => this.saveSettings());
    }

    if (this.sendBtn) {
      this.sendBtn.addEventListener('click', () => this.handleUserSend());
    }

    if (this.input) {
      this.input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.handleUserSend();
        }
      });
    }

    this.suggestions.forEach(pill => {
      pill.addEventListener('click', () => {
        const text = pill.getAttribute('data-query') || pill.textContent.trim();
        if (text.includes("WhatsApp")) {
          this.openWhatsAppDirect();
        } else {
          this.sendUserMessage(text);
        }
      });
    });
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.window.classList.add('open');
      if (this.input) setTimeout(() => this.input.focus(), 300);
    } else {
      this.window.classList.remove('open');
    }
  }

  closeChat() {
    this.isOpen = false;
    this.window.classList.remove('open');
  }

  openSettings() {
    this.settingsModal.classList.add('open');
  }

  closeSettings() {
    this.settingsModal.classList.remove('open');
  }

  saveSettings() {
    const key = this.apiKeyInput.value.trim();
    this.customApiKey = key;
    localStorage.setItem('nps_ai_api_key', key);
    this.closeSettings();
    this.addBotMessage("API Key settings saved! Connected to custom AI endpoint.");
  }

  renderWelcome() {
    const welcomeHtml = `
      Hello! Welcome to <strong>National Public School (NPS) Hopefarm</strong>.
      <br><br>
      I am your AI Admissions Assistant. How may I assist you today regarding our <strong>2026-27 CBSE Admissions</strong>, campus facilities, or academics?
      ${this.getWhatsAppCardHtml("Inquire Directly with Admissions")}
    `;
    this.addBotMessage(welcomeHtml);
  }

  async handleUserSend() {
    const text = this.input.value.trim();
    if (!text) return;
    this.input.value = '';
    await this.sendUserMessage(text);
  }

  async sendUserMessage(text) {
    this.addUserMessage(text);
    this.showTyping();

    try {
      const botResponse = await this.fetchAIResponse(text);
      this.hideTyping();
      this.addBotMessage(botResponse);
    } catch (err) {
      console.warn("AI API fallback triggered:", err);
      this.hideTyping();
      const fallbackResponse = this.getLocalFallbackResponse(text);
      this.addBotMessage(fallbackResponse);
    }
  }

  async fetchAIResponse(userText) {
    // If user provided custom Google Gemini API Key
    if (this.customApiKey && this.customApiKey.startsWith("AIza")) {
      return await this.callGeminiAPI(userText);
    }

    // Default: High-speed free Pollinations AI endpoint (Zero API Key required)
    const prompt = encodeURIComponent(`${CHAT_SYSTEM_PROMPT}\nUser Question: ${userText}`);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 9000);

    const response = await fetch(`https://text.pollinations.ai/${prompt}?model=mistral`, {
      method: 'GET',
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Pollinations HTTP ${response.status}`);
    }

    let answer = await response.text();
    // Clean markdown bold or headers if needed
    answer = answer.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    answer = answer.replace(/\n/g, '<br>');

    // Append WhatsApp action prompt
    answer += this.getWhatsAppCardHtml(userText);
    return answer;
  }

  async callGeminiAPI(userText) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.customApiKey}`;
    const payload = {
      contents: [
        {
          role: "user",
          parts: [
            { text: `${CHAT_SYSTEM_PROMPT}\n\nUser Question: ${userText}` }
          ]
        }
      ]
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error("Gemini API error");
    const data = await res.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Thank you for reaching out.";
    return reply.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>') + this.getWhatsAppCardHtml(userText);
  }

  getLocalFallbackResponse(query) {
    const q = query.toLowerCase();
    let reply = "";

    if (q.includes("fee") || q.includes("cost") || q.includes("structure")) {
      reply = "The fee structure at NPS Hopefarm is confidential and specific to the campus. It is communicated directly to shortlisted parents at the time of the admission offer, payable securely via the parent portal.";
    } else if (q.includes("timing") || q.includes("hours") || q.includes("time")) {
      reply = "Pre-Primary (Montessori/LKG/UKG) runs from approximately 8:30 AM to 12:30 PM. Grade I and above runs from 7:55 AM to 3:00 PM, including breaks for lunch and co-curriculars.";
    } else if (q.includes("transport") || q.includes("bus") || q.includes("route")) {
      reply = "Yes, NPS Hopefarm provides GPS-enabled bus transport covering Whitefield, Hopefarm, and key residential areas of East Bangalore with mandatory adult supervision and real-time tracking.";
    } else if (q.includes("admission") || q.includes("apply") || q.includes("register") || q.includes("eligibility")) {
      reply = "Admissions for Academic Session 2026-27 are open for Pre-KG (Montessori) up to Grade VIII. The process includes online registration, document verification, and an interaction/assessment session.";
    } else if (q.includes("board") || q.includes("cbse") || q.includes("affiliation")) {
      reply = "NPS Hopefarm is affiliated with the Central Board of Secondary Education (CBSE), New Delhi, providing an inquiry-based, rigorous academic foundation.";
    } else if (q.includes("ratio") || q.includes("class size") || q.includes("students")) {
      reply = "We maintain an optimal class strength of 30 to 32 students per section to guarantee personalized attention. Pre-Primary classrooms have two teachers or a teacher with an assistant.";
    } else if (q.includes("location") || q.includes("address") || q.includes("where")) {
      reply = "NPS Hopefarm is located at No. 141, Channasandra Grama, Bidarahalli Hobli, Near Isha Misty Green Villas, Bengaluru – 560049. You can visit between 8:30 AM and 3:30 PM.";
    } else {
      reply = "Thank you for inquiring with NPS Hopefarm. Our team is happy to assist you with admissions, curriculum details, campus visits, or eligibility for 2026-27.";
    }

    return reply + this.getWhatsAppCardHtml(query);
  }

  getWhatsAppCardHtml(querySnippet) {
    const encodedMsg = encodeURIComponent(
      `Hello NPS Hopefarm Admissions Team,\n\nI am inquiring about Admissions 2026-27 through your website AI Assistant.\n• Topic: ${querySnippet.replace(/<[^>]*>/g, '').slice(0, 100)}\n\nPlease guide me regarding the admission procedure, fee details, and campus tour.\n\nThank you!`
    );
    const waUrl = `https://api.whatsapp.com/send?phone=${NPS_WHATSAPP_NUMBER}&text=${encodedMsg}`;

    return `
      <div class="chat-whatsapp-card">
        <div class="whatsapp-card-title">
          <svg style="width:16px;height:16px;fill:#25D366;" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766 0-3.18-2.586-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.174.086.275.072.376-.044.101-.116.433-.506.549-.68.116-.173.231-.145.39-.086s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824z"/></svg>
          <span>Connect with Admissions Desk</span>
        </div>
        <div class="whatsapp-card-desc">
          Get direct, priority assistance via WhatsApp at <strong>+91 99000 25002</strong>.
        </div>
        <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="chat-whatsapp-btn">
          <svg style="width:16px;height:16px;fill:currentColor;" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766 0-3.18-2.586-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.174.086.275.072.376-.044.101-.116.433-.506.549-.68.116-.173.231-.145.39-.086s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824z"/></svg>
          <span>Chat on WhatsApp (+91 99000 25002)</span>
        </a>
      </div>
    `;
  }

  openWhatsAppDirect() {
    const text = encodeURIComponent(
      "Hello National Public School (NPS) Hopefarm Admissions Team,\n\nI am contacting you from the website to enquire about Admissions for Academic Session 2026-27.\n\nKindly share the admission brochure and appointment details for a campus visit.\nThank you!"
    );
    window.open(`https://api.whatsapp.com/send?phone=${NPS_WHATSAPP_NUMBER}&text=${text}`, '_blank');
  }

  addUserMessage(text) {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'chat-message user';
    msgDiv.innerHTML = `
      <div class="chat-msg-bubble">${text}</div>
    `;
    this.messagesContainer.appendChild(msgDiv);
    this.scrollToBottom();
  }

  addBotMessage(html) {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'chat-message bot';
    msgDiv.innerHTML = `
      <div class="chat-msg-avatar">NPS</div>
      <div class="chat-msg-bubble">${html}</div>
    `;
    this.messagesContainer.appendChild(msgDiv);
    this.scrollToBottom();
  }

  showTyping() {
    this.typingDiv = document.createElement('div');
    this.typingDiv.className = 'chat-message bot typing-indicator-msg';
    this.typingDiv.innerHTML = `
      <div class="chat-msg-avatar">NPS</div>
      <div class="chat-msg-bubble">
        <div class="typing-dots">
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
        </div>
      </div>
    `;
    this.messagesContainer.appendChild(this.typingDiv);
    this.scrollToBottom();
  }

  hideTyping() {
    if (this.typingDiv) {
      this.typingDiv.remove();
      this.typingDiv = null;
    }
  }

  scrollToBottom() {
    if (this.messagesContainer) {
      this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.npsChatbot = new NPSChatbot();
});
