// --- Config ---
const STORAGE_KEY = 'promoengine_accounts';
const SESSION_KEY = 'promoengine_current';

const DEFAULT_LINKS = [
    { id: 'spotify', label: 'Spotify', url: '', icon: '🎵' },
    { id: 'apple', label: 'Apple Music', url: '', icon: '🍎' },
    { id: 'youtube', label: 'YouTube', url: '', icon: '▶️' },
    { id: 'soundcloud', label: 'SoundCloud', url: '', icon: '☁️' },
    { id: 'bandcamp', label: 'Bandcamp', url: '', icon: '💾' }
];

// --- State ---
let currentProfile = null;
let currentId = '';

// --- Helpers ---
function getDefaultProfile(name) {
    return {
        artistName: name || 'Your Artist Name',
        subtitle: 'Latest single streaming everywhere',
        badgeText: 'NEW MUSIC OUT NOW',
        badgeEmoji: '🔴',
        avatarEmoji: '🎵',
        links: JSON.parse(JSON.stringify(DEFAULT_LINKS))
    };
}

function getAccounts() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
    catch { return {}; }
}

function saveAccounts(accounts) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
}

function getCurrentAccountId() {
    return localStorage.getItem(SESSION_KEY) || '';
}

function setCurrentAccountId(id) {
    if (id) localStorage.setItem(SESSION_KEY, id);
    else localStorage.removeItem(SESSION_KEY);
}

function slugify(name) {
    return name.toLowerCase().trim().replace(/\s+/g, '_').replace(/[^\w]/g, '');
}

function showView(id) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

function normalizeUrl(url) {
    if (!url) return '';
    url = url.trim();
    if (!url) return '';
    if (url.match(/^https?:\/\//i)) return url;
    if (url.startsWith('mailto:')) return url;
    return 'https://' + url;
}

// --- Auth ---
function login() {
    const nameInput = document.getElementById('artistNameInput');
    const pinInput = document.getElementById('pinInput');
    const name = nameInput.value.trim();

    if (!name) {
        nameInput.style.borderColor = 'var(--danger)';
        setTimeout(() => nameInput.style.borderColor = '', 1000);
        return;
    }

    const id = slugify(name);
    const accounts = getAccounts();

    if (!accounts[id]) {
        accounts[id] = {
            pin: pinInput.value || '',
            data: getDefaultProfile(name)
        };
        saveAccounts(accounts);
    } else {
        if (accounts[id].pin && accounts[id].pin !== pinInput.value) {
            pinInput.style.borderColor = 'var(--danger)';
            setTimeout(() => pinInput.style.borderColor = '', 1000);
            alert('Incorrect PIN');
            return;
        }
    }

    setCurrentAccountId(id);
    loadAccount(id);
}

function switchToAccount(id) {
    const accounts = getAccounts();
    if (accounts[id]) {
        setCurrentAccountId(id);
        loadAccount(id);
    }
}

function logout() {
    setCurrentAccountId('');
    currentProfile = null;
    currentId = '';
    showView('loginView');
    renderAccountList();
}

function deleteAccount() {
    if (!confirm('Delete this account and all its data? This cannot be undone.')) return;
    const accounts = getAccounts();
    delete accounts[currentId];
    saveAccounts(accounts);
    closeEditor();
    logout();
}

// --- App ---
function loadAccount(id) {
    const accounts = getAccounts();
    if (!accounts[id]) { logout(); return; }
    currentId = id;
    currentProfile = JSON.parse(JSON.stringify(accounts[id].data));
    renderBio();
    showView('appView');
}

function renderBio() {
    const p = currentProfile;
    document.getElementById('displayName').textContent = p.artistName;
    document.getElementById('displaySubtitle').textContent = p.subtitle;
    document.getElementById('displayBadgeText').textContent = p.badgeText;
    document.getElementById('displayBadgeEmoji').textContent = p.badgeEmoji;
    document.getElementById('displayAvatar').textContent = p.avatarEmoji;

    const container = document.getElementById('linksContainer');
    container.innerHTML = '';

    const hasLinks = p.links.some(l => l.url.trim() !== '');

    if (!hasLinks) {
        container.innerHTML = `
            <div class="empty-state">
                No links added yet.<br>
                Tap <strong>Edit</strong> to add your streaming links.
            </div>
        `;
        return;
    }

    p.links.forEach(link => {
        const url = normalizeUrl(link.url);

        const a = document.createElement('a');
        a.className = 'link-btn' + (url ? '' : ' disabled');
        a.rel = 'noopener noreferrer';

        if (url) {
            a.href = url;
            // Force external Safari open even in standalone PWA mode
            a.addEventListener('click', (e) => {
                e.preventDefault();
                window.open(url, '_blank');
            });
        }

        a.innerHTML = `
            <span class="link-icon">${link.icon}</span>
            <span>${link.label}</span>
        `;
        container.appendChild(a);
    });
}

// --- Editor ---
function openEditor() {
    const p = currentProfile;
    document.getElementById('editName').value = p.artistName;
    document.getElementById('editSubtitle').value = p.subtitle;
    document.getElementById('editBadgeEmoji').value = p.badgeEmoji;
    document.getElementById('editBadgeText').value = p.badgeText;
    document.getElementById('editAvatar').value = p.avatarEmoji;

    const editors = document.getElementById('linkEditors');
    editors.innerHTML = '';

    p.links.forEach((link, idx) => {
        const div = document.createElement('div');
        div.className = 'link-editor';
        div.innerHTML = `
            <div class="link-editor-header">
                <span>${link.icon}</span>
                <span>${link.label}</span>
            </div>
            <div class="form-group" style="margin-bottom:8px;">
                <label style="font-size:11px;">URL</label>
                <input type="url" class="link-url" data-idx="${idx}" value="${link.url}" placeholder="https://...">
            </div>
            <div class="row">
                <div class="form-group" style="margin-bottom:0;">
                    <label style="font-size:11px;">Label</label>
                    <input type="text" class="link-label" data-idx="${idx}" value="${link.label}">
                </div>
                <div class="form-group" style="margin-bottom:0;">
                    <label style="font-size:11px;">Icon (emoji)</label>
                    <input type="text" class="link-icon-input" data-idx="${idx}" value="${link.icon}" maxlength="4">
                </div>
            </div>
        `;
        editors.appendChild(div);
    });

    document.getElementById('editorModal').classList.add('active');
}

function closeEditor() {
    document.getElementById('editorModal').classList.remove('active');
}

function saveProfile() {
    const p = currentProfile;
    p.artistName = document.getElementById('editName').value.trim() || p.artistName;
    p.subtitle = document.getElementById('editSubtitle').value.trim();
    p.badgeEmoji = document.getElementById('editBadgeEmoji').value.trim();
    p.badgeText = document.getElementById('editBadgeText').value.trim();
    p.avatarEmoji = document.getElementById('editAvatar').value.trim();

    document.querySelectorAll('.link-url').forEach(input => {
        const idx = parseInt(input.dataset.idx);
        p.links[idx].url = normalizeUrl(input.value);
    });

    document.querySelectorAll('.link-label').forEach(input => {
        const idx = parseInt(input.dataset.idx);
        p.links[idx].label = input.value.trim() || p.links[idx].label;
    });

    document.querySelectorAll('.link-icon-input').forEach(input => {
        const idx = parseInt(input.dataset.idx);
        p.links[idx].icon = input.value.trim() || p.links[idx].icon;
    });

    const accounts = getAccounts();
    if (accounts[currentId]) {
        accounts[currentId].data = p;
        saveAccounts(accounts);
    }

    closeEditor();
    renderBio();
}

// --- Account List ---
function renderAccountList() {
    const accounts = getAccounts();
    const ids = Object.keys(accounts);
    const section = document.getElementById('savedAccountsSection');
    const list = document.getElementById('accountList');

    if (ids.length === 0) {
        section.style.display = 'none';
        return;
    }

    section.style.display = 'block';
    list.innerHTML = '';

    ids.forEach(id => {
        const acc = accounts[id];
        const card = document.createElement('div');
        card.className = 'account-card';
        card.onclick = () => switchToAccount(id);
        card.innerHTML = `
            <div class="account-info">
                <div class="account-avatar">${acc.data.avatarEmoji || '🎵'}</div>
                <div class="account-name">${acc.data.artistName}</div>
            </div>
            <span style="color:var(--text-muted); font-size:13px;">➡</span>
        `;
        list.appendChild(card);
    });
}

// --- Init ---
(function init() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js')
            .then(() => console.log('SW registered'))
            .catch(err => console.log('SW failed', err));
    }

    const savedId = getCurrentAccountId();
    if (savedId) {
        loadAccount(savedId);
    } else {
        renderAccountList();
    }
})();
