/* ============================================================
   CLIENT PORTAL — app.js
   ============================================================ */


/* ============================================================
   DATA
   ============================================================ */

const client = {
  name:        'Jane Doe',
  initials:    'JD',
  company:     'Doe Creative Studio',
  project:     'Brand Identity Redesign',
  status:      'in-progress', // approved | in-progress | pending | rejected
  manager:     'Alex Rivera',
  managerInit: 'AR',
  quote:       2500,
  quoteStatus: 'sent',          // approved | sent | pending
  startDate:   'March 10, 2026',
  deadline:    'May 30, 2026',
  nextMeeting: { date: 'April 25, 2026', time: '14:00' },
};

const updates = [
  { text: 'Contract signed and project officially kicked off.',     date: 'Apr 22', color: 'green'  },
  { text: 'Waiting for final approval on design concept.',          date: 'Apr 23', color: 'yellow' },
  { text: 'Quote of $2,500 has been sent for your review.',         date: 'Apr 20', color: 'blue'   },
  { text: 'We reviewed your initial request and creative brief.',   date: 'Apr 18', color: 'blue'   },
];

const documents = [
  { name: 'proposal.pdf',        size: '1.2 MB', date: 'Apr 18, 2026', icon: '📄' },
  { name: 'invoice_001.pdf',     size: '0.4 MB', date: 'Apr 20, 2026', icon: '🧾' },
  { name: 'contract_signed.pdf', size: '2.1 MB', date: 'Apr 22, 2026', icon: '📝' },
  { name: 'brand_brief.pdf',     size: '3.8 MB', date: 'Apr 15, 2026', icon: '📋' },
];

// Seed messages — self:true = current client sent it
const seedMessages = [
  {
    from: 'Alex Rivera', initials: 'AR', self: false,
    text: 'Hi Jane! Just checking in — have you had a chance to review the proposal we sent over?',
    time: 'Apr 20 · 10:32',
  },
  {
    from: 'Jane Doe', initials: 'JD', self: true,
    text: 'Yes! Really liked the approach. A couple of small questions but overall looks great.',
    time: 'Apr 20 · 11:15',
  },
  {
    from: 'Alex Rivera', initials: 'AR', self: false,
    text: 'Wonderful! Feel free to reply here or book a quick call. Contract has also been sent over for signing.',
    time: 'Apr 20 · 11:48',
  },
];


/* ============================================================
   HELPERS
   ============================================================ */

function badge(status) {
  const map = {
    'approved':    ['badge-green',  'Approved'],
    'in-progress': ['badge-blue',   'In Progress'],
    'pending':     ['badge-yellow', 'Pending'],
    'rejected':    ['badge-red',    'Rejected'],
    'sent':        ['badge-blue',   'Sent'],
  };
  const [cls, label] = map[status] || ['badge-yellow', status];
  return `<span class="badge ${cls}">${label}</span>`;
}

function currency(n) {
  return '$' + n.toLocaleString('en-US');
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function nowTime() {
  const d = new Date();
  return `Apr 23 · ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function escapeHTML(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}


/* ============================================================
   RENDER — DASHBOARD
   ============================================================ */

function renderDashboard() {
  // Greeting
  document.getElementById('greeting').innerHTML =
    `${greeting()}, <em>${client.name.split(' ')[0]}</em>. Here's your project overview.`;

  // Stat cards config
  const cards = [
    {
      label:    'Project Status',
      value:    badge(client.status),
      footer:   client.project,
      accent:   'var(--blue)',
      iconBg:   'var(--blue-bg)',
      iconClr:  'var(--blue)',
      icon:     `<svg viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                 <polyline points="22 4 12 14.01 9 11.01"/></svg>`,
    },
    {
      label:    'Quote Amount',
      value:    currency(client.quote),
      footer:   `Status: ${badge(client.quoteStatus)}`,
      accent:   'var(--green)',
      iconBg:   'var(--green-bg)',
      iconClr:  'var(--green)',
      icon:     `<svg viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"/>
                 <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
    },
    {
      label:    'Next Appointment',
      value:    client.nextMeeting.date,
      footer:   `Time: ${client.nextMeeting.time}`,
      accent:   'var(--yellow)',
      iconBg:   'var(--yellow-bg)',
      iconClr:  'var(--yellow)',
      icon:     `<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/>
                 <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
                 <line x1="3" y1="10" x2="21" y2="10"/></svg>`,
    },
  ];

  document.getElementById('stat-grid').innerHTML = cards.map(c => `
    <div class="stat-card" style="--card-accent:${c.accent}">
      <div class="stat-icon" style="background:${c.iconBg}; color:${c.iconClr}">
        ${c.icon}
      </div>
      <div class="stat-label">${c.label}</div>
      <div class="stat-value">${c.value}</div>
      <div class="stat-footer">${c.footer}</div>
    </div>
  `).join('');

  // Timeline
  document.getElementById('timeline').innerHTML = updates.map(u => `
    <div class="timeline-item">
      <div class="tl-track">
        <div class="tl-dot ${u.color}"></div>
        <div class="tl-line"></div>
      </div>
      <div class="tl-body">
        <div class="tl-text">${u.text}</div>
        <div class="tl-date">${u.date}</div>
      </div>
    </div>
  `).join('');

  // Project details rows
  const details = [
    ['Client',    client.name],
    ['Company',   client.company],
    ['Manager',   client.manager],
    ['Start Date',client.startDate],
    ['Deadline',  client.deadline],
    ['Status',    badge(client.status)],
  ];

  document.getElementById('project-details').innerHTML = details.map(([k, v]) => `
    <div class="detail-row">
      <span class="detail-key">${k}</span>
      <span class="detail-val">${v}</span>
    </div>
  `).join('');
}


/* ============================================================
   RENDER — DOCUMENTS
   ============================================================ */

function renderDocuments() {
  const dlIcon = `<svg viewBox="0 0 24 24">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>`;

  document.getElementById('doc-list').innerHTML = documents.map(d => `
    <div class="doc-item" role="button" tabindex="0"
         onclick="fakeDownload('${escapeHTML(d.name)}')"
         onkeydown="if(event.key==='Enter') fakeDownload('${escapeHTML(d.name)}')">
      <div class="doc-icon">${d.icon}</div>
      <div class="doc-info">
        <div class="doc-name">${d.name}</div>
        <div class="doc-meta">${d.size} &middot; Added ${d.date}</div>
      </div>
      <button class="doc-dl" title="Download ${d.name}"
              onclick="event.stopPropagation(); fakeDownload('${escapeHTML(d.name)}')">
        ${dlIcon}
      </button>
    </div>
  `).join('');
}

function fakeDownload(name) {
  // In a real app this would trigger a signed URL download
  const btn = event && event.currentTarget;
  const original = btn ? btn.innerHTML : '';
  if (btn) btn.innerHTML = '✓';
  setTimeout(() => { if (btn) btn.innerHTML = original; }, 1500);
}


/* ============================================================
   RENDER — MESSAGES
   ============================================================ */

function msgHTML(m) {
  return `
    <div class="msg-group ${m.self ? 'self' : ''}">
      <div class="msg-avatar-wrap">
        <div class="msg-av">${m.initials}</div>
      </div>
      <div class="msg-body">
        <div class="msg-sender">${m.from}</div>
        <div class="msg-bubble">${escapeHTML(m.text)}</div>
        <div class="msg-time">${m.time}</div>
      </div>
    </div>
  `;
}

function renderMessages() {
  const container = document.getElementById('chat-messages');

  container.innerHTML = `<div class="chat-divider">April 20, 2026</div>`;
  seedMessages.forEach(m => container.insertAdjacentHTML('beforeend', msgHTML(m)));
  container.scrollTop = container.scrollHeight;
}

function sendMessage() {
  const input = document.getElementById('chat-input');
  const text  = input.value.trim();
  if (!text) return;

  const container = document.getElementById('chat-messages');

  // Append user's message
  container.insertAdjacentHTML('beforeend', msgHTML({
    from: client.name, initials: client.initials, self: true,
    text, time: nowTime(),
  }));
  input.value = '';
  container.scrollTop = container.scrollHeight;

  // Clear badge once user has messaged
  const badge = document.getElementById('msg-badge');
  if (badge) badge.remove();

  // Show typing indicator then auto-reply
  setTimeout(() => {
    const typingId = 'typing-' + Date.now();
    container.insertAdjacentHTML('beforeend', `
      <div class="msg-group" id="${typingId}">
        <div class="msg-avatar-wrap"><div class="msg-av">${client.managerInit}</div></div>
        <div class="msg-body">
          <div class="msg-sender">${client.manager}</div>
          <div class="typing-bubble">
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
          </div>
        </div>
      </div>
    `);
    container.scrollTop = container.scrollHeight;

    setTimeout(() => {
      const typing = document.getElementById(typingId);
      if (typing) typing.remove();

      const replies = [
        'Thanks for the update! I\'ll take a look and get back to you shortly.',
        'Got it — appreciate you letting me know. I\'ll review this today.',
        'Perfect, thanks! I\'ll loop in the team and we\'ll follow up soon.',
        'Noted! We\'re on it. I\'ll send you an update by end of day.',
      ];
      const reply = replies[Math.floor(Math.random() * replies.length)];

      container.insertAdjacentHTML('beforeend', msgHTML({
        from: client.manager, initials: client.managerInit, self: false,
        text: reply, time: nowTime(),
      }));
      container.scrollTop = container.scrollHeight;
    }, 1400);
  }, 600);
}


/* ============================================================
   RENDER — SETTINGS
   ============================================================ */

function renderSettings() {
  document.getElementById('settings-panel').innerHTML = `
    <div class="panel-header">
      <span class="panel-title">Settings</span>
    </div>

    <div class="settings-section">
      <div class="settings-group-title">Account</div>
      <div class="settings-profile">
        <div class="settings-avatar">${client.initials}</div>
        <div>
          <div class="settings-profile-name">${client.name}</div>
          <div class="settings-profile-sub">${client.company}</div>
        </div>
      </div>
      <div class="settings-row">
        <div>
          <div class="settings-label">Full Name</div>
          <div class="settings-hint">${client.name}</div>
        </div>
      </div>
      <div class="settings-row">
        <div>
          <div class="settings-label">Company</div>
          <div class="settings-hint">${client.company}</div>
        </div>
      </div>
      <div class="settings-row">
        <div>
          <div class="settings-label">Account Manager</div>
          <div class="settings-hint">${client.manager}</div>
        </div>
      </div>
    </div>

    <div class="settings-section">
      <div class="settings-group-title">Notifications</div>
      <div class="settings-row">
        <div>
          <div class="settings-label">Email Notifications</div>
          <div class="settings-hint">Receive project updates by email</div>
        </div>
        <div class="toggle on" role="switch" aria-checked="true"
             onclick="this.classList.toggle('on')"></div>
      </div>
      <div class="settings-row">
        <div>
          <div class="settings-label">New Message Alerts</div>
          <div class="settings-hint">Get notified when a message is sent</div>
        </div>
        <div class="toggle on" role="switch" aria-checked="true"
             onclick="this.classList.toggle('on')"></div>
      </div>
      <div class="settings-row">
        <div>
          <div class="settings-label">Document Uploads</div>
          <div class="settings-hint">Notify when new files are shared</div>
        </div>
        <div class="toggle" role="switch" aria-checked="false"
             onclick="this.classList.toggle('on')"></div>
      </div>
    </div>

    <div class="settings-section">
      <div class="settings-group-title">Appearance</div>
      <div class="settings-row">
        <div>
          <div class="settings-label">Dark Mode</div>
          <div class="settings-hint">Currently active</div>
        </div>
        <div class="toggle on" role="switch" aria-checked="true"
             onclick="this.classList.toggle('on')"></div>
      </div>
    </div>
  `;
}


/* ============================================================
   NAVIGATION
   ============================================================ */

const VIEW_TITLES = {
  dashboard: 'Dashboard',
  documents: 'Documents',
  messages:  'Messages',
  settings:  'Settings',
};

function switchView(viewId) {
  // Highlight correct nav item
  document.querySelectorAll('.nav-item').forEach(el => {
    el.classList.toggle('active', el.dataset.view === viewId);
  });

  // Show correct section
  document.querySelectorAll('.view').forEach(el => {
    el.classList.toggle('active', el.id === `view-${viewId}`);
  });

  // Update topbar title
  document.getElementById('topbar-title').textContent = VIEW_TITLES[viewId] || viewId;

  // Scroll chat to bottom when switching to messages
  if (viewId === 'messages') {
    const msgs = document.getElementById('chat-messages');
    if (msgs) msgs.scrollTop = msgs.scrollHeight;
  }
}


/* ============================================================
   INIT
   ============================================================ */

function init() {
  // Populate client identity in sidebar / topbar
  document.getElementById('sidebar-name').textContent   = client.name;
  document.getElementById('sidebar-avatar').textContent = client.initials;
  document.getElementById('topbar-avatar').textContent  = client.initials;

  // Render all views up front
  renderDashboard();
  renderDocuments();
  renderMessages();
  renderSettings();

  // Navigation clicks
  document.querySelectorAll('.nav-item').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      switchView(el.dataset.view);
    });
  });

  // Chat — send on button click or Enter key
  const input   = document.getElementById('chat-input');
  const sendBtn = document.getElementById('chat-send');

  sendBtn.addEventListener('click', sendMessage);
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
}

document.addEventListener('DOMContentLoaded', init);
