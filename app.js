// ==================== CONFIG ====================
const STORAGE_KEY = 'promoengine_accounts';
const SESSION_KEY = 'promoengine_current';

const DEFAULT_LINKS = [
    { id: 'spotify', label: 'Spotify', url: '', icon: '🎵' },
    { id: 'apple', label: 'Apple Music', url: '', icon: '🍎' },
    { id: 'youtube', label: 'YouTube', url: '', icon: '▶️' },
    { id: 'soundcloud', label: 'SoundCloud', url: '', icon: '☁️' },
    { id: 'bandcamp', label: 'Bandcamp', url: '', icon: '💾' }
];

const FILE_CATEGORIES = {
    'promo-images': { label: 'Promo Images', folder: 'PromoEngine_PromoImages', icon: '🎨', ext: 'png' },
    'captions':     { label: 'Captions', folder: 'PromoEngine_Captions', icon: '📝', ext: 'txt' },
    'campaigns':    { label: 'Campaign Plans', folder: 'PromoEngine_CampaignPlans', icon: '📋', ext: 'md' },
    'bio-assets':   { label: 'Bio Backups', folder: 'PromoEngine_BioBackups', icon: '💾', ext: 'json' }
};

const CAMPAIGN_TEMPLATES = {
    release: {
        name: 'New Release Drop',
        desc: '7-day buildup + drop strategy',
        days: (d) => [
            { day: 1, platform: 'Instagram', type: 'Story Teaser', time: '6:00 PM', copy: `👀 Something new is coming…\n\n${d.song} drops ${d.date}.`, hashtags: '#NewMusic #Teaser #ComingSoon', cta: 'Turn on post notifications 🔊' },
            { day: 2, platform: 'TikTok / Reels', type: 'Behind the Beat', time: '12:00 PM', copy: `The making of ${d.song} 🎧\n\nThis one hit different in the studio.`, hashtags: '#BehindTheScenes #Studio #MusicProduction', cta: 'Follow for the full drop' },
            { day: 3, platform: 'Instagram / X', type: 'Pre-Save Push', time: '5:00 PM', copy: `🚨 Pre-save ${d.song} now.\n\nLink in bio. Every pre-save helps the algorithm push this to new fans.`, hashtags: '#PreSave #NewMusicFriday #IndieArtist', cta: 'Tag 2 friends who need this track' },
            { day: 4, platform: 'Instagram Story', type: 'Countdown', time: '8:00 PM', copy: `⏰ 2 days until ${d.song} is live everywhere.\n\nWho’s ready?`, hashtags: '#Countdown #NewMusic', cta: 'Reply with a 🔥 if you’re waiting' },
            { day: 5, platform: 'TikTok / Reels', type: 'Snippet / Hook', time: '11:00 AM', copy: `This hook has been stuck in my head for weeks…\n\n${d.song} drops ${d.date}.`, hashtags: '#Snippet #Viral #NewMusic', cta: 'Duet this if it hits' },
            { day: 6, platform: 'ALL PLATFORMS', type: 'RELEASE DAY', time: '9:00 AM', copy: `🚀 ${d.song} IS OUT NOW EVERYWHERE.\n\nRun it up. Stream, save, share. Let’s move.`, hashtags: '#OutNow #NewMusic #StreamNow', cta: 'Screenshot your stream & tag me' },
            { day: 7, platform: 'Instagram / X', type: 'Thank You / UGC', time: '7:00 PM', copy: `Y’all showed MAD love on ${d.song} today.\n\nKeep tagging me in your stories — I’m reposting all night.`, hashtags: '#FanLove #Repost #IndieMusic', cta: 'Drop your favorite lyric below' }
        ]
    },
    playlist: {
        name: 'Playlist Push',
        desc: '5-day curator & fan push',
        days: (d) => [
            { day: 1, platform: 'Spotify / Email', type: 'Curator Pitch', time: '10:00 AM', copy: `Just submitted ${d.song} to 10 playlist curators.\n\nPitch tip: lead with the vibe, not your bio.`, hashtags: '#PlaylistPush #Spotify', cta: 'Submit to Spotify for Artists editorials' },
            { day: 2, platform: 'Instagram Story', type: 'Playlist Request', time: '6:00 PM', copy: `What playlist should ${d.song} be on?\n\nTag the curator or drop the playlist link.`, hashtags: '#Playlist #Curator', cta: 'DM me playlists you run' },
            { day: 3, platform: 'TikTok / Reels', type: 'Playlist Vibe Check', time: '12:00 PM', copy: `POV: ${d.song} just got added to your late-night drive playlist 🌙`, hashtags: '#PlaylistVibes #LateNightDrive', cta: 'Stitch this with your reaction' },
            { day: 4, platform: 'Instagram / X', type: 'Fan Push', time: '5:00 PM', copy: `If ${d.song} is in your playlist, screenshot it and tag me.\n\nBest playlist name wins a repost.`, hashtags: '#PlaylistChallenge', cta: 'Add to your playlist & share' },
            { day: 5, platform: 'All Platforms', type: 'Results / Thanks', time: '7:00 PM', copy: `${d.song} just hit [X] playlist adds in 5 days.\n\nIndependent artists run the game. Thank you.`, hashtags: '#IndependentArtist #Playlist', cta: 'Keep sharing — it compounds' }
        ]
    },
    viral: {
        name: 'Viral Hook Challenge',
        desc: '5-day short-form blitz',
        days: (d) => [
            { day: 1, platform: 'TikTok / Reels', type: 'Hook Challenge', time: '12:00 PM', copy: `I dare you to not move when this hook drops 😤\n\n${d.song}`, hashtags: '#HookChallenge #Viral', cta: 'Use this sound & show your reaction' },
            { day: 2, platform: 'TikTok / Reels', type: 'Duet Prompt', time: '11:00 AM', copy: `Drop a verse on this beat.\n\nBest one gets pinned.`, hashtags: '#OpenVerse #Duet', cta: 'Duet this — no rules' },
            { day: 3, platform: 'TikTok / Reels', type: 'Trending Sound Flip', time: '1:00 PM', copy: `When the trending sound meets ${d.song}…`, hashtags: '#Trending #Remix', cta: 'Stitch this flip' },
            { day: 4, platform: 'Instagram Story', type: 'Poll / Engage', time: '6:00 PM', copy: `Which hits harder: the beat or the lyrics?`, hashtags: '#Poll #Engage', cta: 'Vote & share to your story' },
            { day: 5, platform: 'TikTok / Reels', type: 'UGC Repost', time: '12:00 PM', copy: `Y’all went CRAZY on this sound.\n\nHere are my favorites from this week.`, hashtags: '#UGC #Repost #Community', cta: 'Keep posting — I’m watching' }
        ]
    },
    countdown: {
        name: 'Pre-Save Countdown',
        desc: '7-day hype build to release',
        days: (d) => [
            { day: 1, platform: 'Instagram / X', type: 'Announcement', time: '5:00 PM', copy: `🗓 MARK YOUR CALENDARS\n\n${d.song} — ${d.date}`, hashtags: '#SaveTheDate', cta: 'Turn on notifications' },
            { day: 2, platform: 'Instagram Story', type: 'Mood Board', time: '8:00 PM', copy: `The vibe of ${d.song} in 3 colors:`, hashtags: '#MoodBoard #Aesthetic', cta: 'Screenshot your guess' },
            { day: 3, platform: 'TikTok / Reels', type: 'Lyric Teaser', time: '12:00 PM', copy: `“[Pull a lyric from the song]”\n\n${d.song} — ${d.date}`, hashtags: '#Lyrics #Quote', cta: 'Guess the next line in comments' },
            { day: 4, platform: 'Instagram / X', type: 'Pre-Save Reminder', time: '6:00 PM', copy: `3 days left.\n\nPre-save link in bio — it takes 5 seconds and helps more than you know.`, hashtags: '#PreSave', cta: 'Link in bio' },
            { day: 5, platform: 'TikTok / Reels', type: 'Reaction Test', time: '11:00 AM', copy: `Played ${d.song} for my [friend/mom/dog] for the first time…`, hashtags: '#Reaction #FirstListen', cta: 'Drop your predictions' },
            { day: 6, platform: 'All Platforms', type: 'Final Teaser', time: '9:00 PM', copy: `Tomorrow. Midnight. ${d.song}.\n\nSet your alarm.`, hashtags: '#MidnightRelease', cta: 'Who’s staying up?' },
            { day: 7, platform: 'All Platforms', type: 'LIVE / DROP', time: '12:01 AM', copy: `${d.song} IS LIVE.\n\nGo run it up NOW.`, hashtags: '#OutNow #NewMusic', cta: 'Stream link in bio' }
        ]
    }
};

// ==================== STATE ====================
let currentProfile = null;
let currentId = '';
let currentCampaignId = null;
let fileSystemDirectory = null;

// ==================== HELPERS ====================
function getDefaultProfile(name) {
    return {
        artistName: name || 'Your Artist Name',
        subtitle: 'Latest single streaming everywhere',
        badgeText: 'NEW MUSIC OUT NOW',
        badgeEmoji: '🔴',
        avatarEmoji: '🎵',
        links: JSON.parse(JSON.stringify(DEFAULT_LINKS)),
        campaigns: [],
        fileLibrary: []
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

function uuid(prefix = 'id') {
    return prefix + '_' + Math.random().toString(36).substr(2, 9);
}

function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function todayStamp() {
    return new Date().toISOString().split('T')[0].replace(/-/g, '');
}

function sanitizeFileName(str) {
    return str.replace(/[^a-z0-9_\-\.]/gi, '_').replace(/_+/g, '_').substring(0, 40);
}

function buildFileName(category, label, ext) {
    const cat = FILE_CATEGORIES[category] || { ext: 'txt' };
    const artist = sanitizeFileName(currentProfile?.artistName || 'Artist');
    const lbl = sanitizeFileName(label || 'file');
    const date = todayStamp();
    const count = ((currentProfile?.fileLibrary?.filter(f => f.category === category).length || 0) + 1).toString().padStart(2, '0');
    return `${cat.folder}_${count}_${artist}_${lbl}_${date}.${ext || cat.ext}`;
}

// ==================== FILE SYSTEM & LIBRARY ====================
function supportsFileSystemAccess() {
    return 'showDirectoryPicker' in window;
}

async function pickSaveDirectory() {
    try {
        fileSystemDirectory = await window.showDirectoryPicker();
        alert('Save folder set! Files will now be organized into subfolders automatically.');
        return true;
    } catch (e) {
        return false;
    }
}

async function saveFileOrganized(fileName, contentOrBlob, mimeType, category) {
    const blob = contentOrBlob instanceof Blob ? contentOrBlob : new Blob([contentOrBlob], { type: mimeType });
    
    if (fileSystemDirectory) {
        try {
            const catInfo = FILE_CATEGORIES[category] || { folder: 'PromoEngine_Files' };
            const folderHandle = await fileSystemDirectory.getDirectoryHandle(catInfo.folder, { create: true });
            const fileHandle = await folderHandle.getFileHandle(fileName, { create: true });
            const writable = await fileHandle.createWritable();
            await writable.write(blob);
            await writable.close();
            return { success: true, method: 'folder' };
        } catch (e) {
            console.log('Folder save failed, falling back to download', e);
        }
    }
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 100);
    return { success: true, method: 'download' };
}

function addToLibrary(item) {
    if (!currentProfile) return;
    if (!currentProfile.fileLibrary) currentProfile.fileLibrary = [];
    currentProfile.fileLibrary.unshift(item);
    if (currentProfile.fileLibrary.length > 60) currentProfile.fileLibrary = currentProfile.fileLibrary.slice(0, 60);
    saveCurrentProfile();
}

function removeFromLibrary(fileId) {
    if (!currentProfile?.fileLibrary) return;
    currentProfile.fileLibrary = currentProfile.fileLibrary.filter(f => f.id !== fileId);
    saveCurrentProfile();
    renderFiles();
}

function getLibrary() {
    return currentProfile?.fileLibrary || [];
}

function saveCurrentProfile() {
    const accounts = getAccounts();
    if (accounts[currentId]) {
        accounts[currentId].data = currentProfile;
        saveAccounts(accounts);
    }
}

// ==================== AUTH ====================
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
    currentCampaignId = null;
    fileSystemDirectory = null;
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

// ==================== BIO APP ====================
function loadAccount(id) {
    const accounts = getAccounts();
    if (!accounts[id]) { logout(); return; }
    currentId = id;
    currentProfile = JSON.parse(JSON.stringify(accounts[id].data));
    if (!currentProfile.campaigns) currentProfile.campaigns = [];
    if (!currentProfile.fileLibrary) currentProfile.fileLibrary = [];
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

// ==================== BIO EDITOR ====================
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

    saveCurrentProfile();

    // Auto-backup bio as JSON
    const backupName = buildFileName('bio-assets', 'BioBackup_' + todayStamp(), 'json');
    const backupContent = JSON.stringify(p, null, 2);
    addToLibrary({
        id: uuid('f'),
        name: backupName,
        displayName: `Bio Backup ${todayStamp()}`,
        category: 'bio-assets',
        created: new Date().toISOString(),
        type: 'application/json',
        size: backupContent.length
    });
    saveFileOrganized(backupName, backupContent, 'application/json', 'bio-assets');

    closeEditor();
    renderBio();
}

// ==================== CAMPAIGNS ====================
function showCampaigns() {
    renderCampaignList();
    showView('campaignsView');
}

function renderCampaignList() {
    const list = document.getElementById('campaignList');
    const empty = document.getElementById('campaignEmpty');
    const campaigns = currentProfile.campaigns || [];

    if (campaigns.length === 0) {
        list.innerHTML = '';
        empty.style.display = 'block';
        return;
    }

    empty.style.display = 'none';
    list.innerHTML = '';

    campaigns.slice().reverse().forEach(c => {
        const completed = c.days.filter(d => d.done).length;
        const total = c.days.length;
        const card = document.createElement('div');
        card.className = 'campaign-card';
        card.onclick = () => openCampaign(c.id);
        card.innerHTML = `
            <div class="campaign-card-info">
                <div class="campaign-card-title">${c.title}</div>
                <div class="campaign-card-meta">${c.type} • ${completed}/${total} done</div>
            </div>
            <span class="campaign-card-arrow">›</span>
        `;
        list.appendChild(card);
    });
}

function showCampaignBuilder() {
    document.getElementById('campaignSong').value = '';
    document.getElementById('campaignDate').value = '';
    document.getElementById('campaignType').value = 'release';
    showView('campaignBuilderView');
}

async function generateCampaign() {
    const song = document.getElementById('campaignSong').value.trim() || 'My New Track';
    const date = document.getElementById('campaignDate').value || 'soon';
    const type = document.getElementById('campaignType').value;
    const template = CAMPAIGN_TEMPLATES[type];

    const campaign = {
        id: uuid('c'),
        title: `${template.name}: ${song}`,
        type: template.name,
        song: song,
        date: date,
        created: new Date().toISOString(),
        days: template.days({ song, date }).map((d, i) => ({ ...d, id: i, done: false }))
    };

    currentProfile.campaigns.push(campaign);
    saveCurrentProfile();

    // Auto-save campaign plan as markdown
    const md = buildCampaignMarkdown(campaign);
    const mdName = buildFileName('campaigns', sanitizeFileName(campaign.title), 'md');
    addToLibrary({
        id: uuid('f'),
        name: mdName,
        displayName: campaign.title,
        category: 'campaigns',
        created: new Date().toISOString(),
        type: 'text/markdown',
        size: md.length
    });
    await saveFileOrganized(mdName, md, 'text/markdown', 'campaigns');

    openCampaign(campaign.id);
}

function buildCampaignMarkdown(c) {
    let md = `# ${c.title}\n`;
    md += `**Type:** ${c.type}  \n`;
    md += `**Song:** ${c.song}  \n`;
    md += `**Date:** ${c.date}  \n`;
    md += `**Generated:** ${new Date(c.created).toLocaleString()}  \n\n`;
    md += `---\n\n`;
    c.days.forEach(d => {
        md += `## Day ${d.day} — ${d.platform}\n`;
        md += `**Type:** ${d.type}  \n`;
        md += `**Best Time:** ${d.time}  \n\n`;
        md += `### Copy\n${d.copy}\n\n`;
        md += `### Hashtags\n${d.hashtags}\n\n`;
        md += `### CTA\n${d.cta}\n\n`;
        md += `---\n\n`;
    });
    return md;
}

function openCampaign(id) {
    currentCampaignId = id;
    const campaign = currentProfile.campaigns.find(c => c.id === id);
    if (!campaign) return;

    document.getElementById('detailTitle').textContent = campaign.title;
    document.getElementById('detailMeta').textContent = `${campaign.type} • ${campaign.song}`;

    const container = document.getElementById('campaignDays');
    container.innerHTML = '';

    campaign.days.forEach((day, idx) => {
        const div = document.createElement('div');
        div.className = 'day-card' + (day.done ? ' done' : '');
        div.innerHTML = `
            <div class="day-header">
                <div>
                    <div class="day-title">Day ${day.day} — ${day.platform}</div>
                    <div class="day-type">${day.type} • ${day.time}</div>
                </div>
                <input type="checkbox" class="day-check" ${day.done ? 'checked' : ''} onchange="toggleDay(${idx})">
            </div>
            <div class="day-copy">${escapeHtml(day.copy)}</div>
            <div class="day-hashtags">${escapeHtml(day.hashtags)}</div>
            <div class="day-cta">👉 ${escapeHtml(day.cta)}</div>
            <div class="day-actions">
                <button class="btn btn-secondary btn-small" onclick="copyDayText(${idx})">📋 Copy All</button>
                <button class="btn btn-secondary btn-small" onclick="shareDayText(${idx})">📤 Share</button>
                <button class="btn btn-secondary btn-small" onclick="saveDayCaption(${idx})">💾 Save .txt</button>
            </div>
        `;
        container.appendChild(div);
    });

    showView('campaignDetailView');
}

function toggleDay(idx) {
    const campaign = currentProfile.campaigns.find(c => c.id === currentCampaignId);
    if (!campaign) return;
    campaign.days[idx].done = !campaign.days[idx].done;
    saveCurrentProfile();
    openCampaign(currentCampaignId);
}

function deleteCampaign() {
    if (!confirm('Delete this campaign?')) return;
    currentProfile.campaigns = currentProfile.campaigns.filter(c => c.id !== currentCampaignId);
    saveCurrentProfile();
    currentCampaignId = null;
    showCampaigns();
}

function copyDayText(idx) {
    const campaign = currentProfile.campaigns.find(c => c.id === currentCampaignId);
    if (!campaign) return;
    const d = campaign.days[idx];
    const text = `${d.copy}\n\n${d.hashtags}\n\n${d.cta}`;
    navigator.clipboard.writeText(text);
}

function shareDayText(idx) {
    const campaign = currentProfile.campaigns.find(c => c.id === currentCampaignId);
    if (!campaign) return;
    const d = campaign.days[idx];
    const text = `${d.copy}\n\n${d.hashtags}`;
    if (navigator.share) {
        navigator.share({ text: text });
    } else {
        navigator.clipboard.writeText(text);
    }
}

async function saveDayCaption(idx) {
    const campaign = currentProfile.campaigns.find(c => c.id === currentCampaignId);
    if (!campaign) return;
    const d = campaign.days[idx];
    const text = `${d.copy}\n\n${d.hashtags}\n\n${d.cta}`;
    const fileName = buildFileName('captions', `Day${d.day}_${d.platform}`, 'txt');
    
    addToLibrary({
        id: uuid('f'),
        name: fileName,
        displayName: `Day ${d.day} — ${d.platform}`,
        category: 'captions',
        created: new Date().toISOString(),
        type: 'text/plain',
        size: text.length
    });
    
    await saveFileOrganized(fileName, text, 'text/plain', 'captions');
    alert('Caption saved to your organized folder!');
}

// ==================== PROMO IMAGE ====================
function openPromoImage() {
    document.getElementById('promoImageModal').classList.add('active');
    drawPromoImage();
}

function closePromoImage() {
    document.getElementById('promoImageModal').classList.remove('active');
}

function drawPromoImage() {
    const canvas = document.getElementById('promoCanvas');
    const ctx = canvas.getContext('2d');
    const size = 1080;
    canvas.width = size;
    canvas.height = size;

    const p = currentProfile;
    const title = document.getElementById('promoTitle').value.trim() || p.artistName;
    const subtitle = document.getElementById('promoSubtitle').value.trim() || 'OUT NOW';
    const accent = document.getElementById('promoAccent').value;

    // Background
    const grad = ctx.createLinearGradient(0, 0, size, size);
    grad.addColorStop(0, '#0a0a1a');
    grad.addColorStop(1, '#000000');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);

    // Accent glow
    ctx.save();
    ctx.globalAlpha = 0.15;
    const glow = ctx.createRadialGradient(size/2, size/2, 100, size/2, size/2, 600);
    glow.addColorStop(0, accent);
    glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, size, size);
    ctx.restore();

    // Top bar line
    ctx.fillStyle = accent;
    ctx.fillRect(80, 80, size - 160, 8);

    // Artist name
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 64px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(p.artistName, size/2, 280);

    // Main title
    ctx.font = 'bold 120px -apple-system, BlinkMacSystemFont, sans-serif';
    const words = title.length > 15 ? title.split(' ') : [title];
    let y = 480;
    words.forEach((word, i) => {
        if (i > 0 && title.length > 15) {
            ctx.fillText(word, size/2, y);
            y += 140;
        } else if (i === 0) {
            ctx.fillText(word, size/2, y);
        }
    });

    // Subtitle
    ctx.fillStyle = accent;
    ctx.font = 'bold 72px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText(subtitle, size/2, 780);

    // Bottom branding
    ctx.fillStyle = '#444444';
    ctx.font = '36px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText('McMakeApps', size/2, 980);

    // Bottom line
    ctx.fillStyle = accent;
    ctx.globalAlpha = 0.5;
    ctx.fillRect(80, 1020, size - 160, 4);
}

async function downloadPromoImage() {
    const canvas = document.getElementById('promoCanvas');
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
    const fileName = buildFileName('promo-images', sanitizeFileName(currentProfile.artistName) + '_Promo', 'png');
    
    addToLibrary({
        id: uuid('f'),
        name: fileName,
        displayName: `Promo Image — ${currentProfile.artistName}`,
        category: 'promo-images',
        created: new Date().toISOString(),
        type: 'image/png',
        size: blob.size
    });
    
    await saveFileOrganized(fileName, blob, 'image/png', 'promo-images');
    alert('Promo image saved to your organized folder!');
}

// ==================== FILE LIBRARY ====================
function showFiles() {
    renderFiles();
    showView('filesView');
}

function renderFiles() {
    const list = document.getElementById('fileList');
    const empty = document.getElementById('filesEmpty');
    const files = getLibrary();

    if (files.length === 0) {
        list.innerHTML = '';
        empty.style.display = 'block';
        return;
    }

    empty.style.display = 'none';
    list.innerHTML = '';

    files.forEach(f => {
        const cat = FILE_CATEGORIES[f.category] || { icon: '📄', label: 'File' };
        const size = f.size ? (f.size > 1024 ? (f.size/1024).toFixed(1) + ' KB' : f.size + ' B') : '';
        const card = document.createElement('div');
        card.className = 'file-card';
        card.innerHTML = `
            <div class="file-icon">${cat.icon}</div>
            <div class="file-info">
                <div class="file-name">${escapeHtml(f.displayName)}</div>
                <div class="file-meta">${cat.label} • ${new Date(f.created).toLocaleDateString()} ${size ? '• ' + size : ''}</div>
            </div>
            <button class="btn btn-danger btn-small" onclick="removeFromLibrary('${f.id}')" style="width:auto;">🗑</button>
        `;
        list.appendChild(card);
    });
}

// ==================== ACCOUNT LIST ====================
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

// ==================== INIT ====================
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
