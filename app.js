// ============================================
// PROMO ENGINE v1.0 - Complete Marketing App
// ============================================

const PromoEngine = {
    DB_NAME: 'PromoEngineDB',
    DB_VERSION: 2,
    db: null,
    currentFilter: 'all',

    // ============================================
    // INITIALIZATION
    // ============================================

    async init() {
        try {
            this.db = await this.openDB();
            this.setupNavigation();
            this.setupEventListeners();
            this.setDefaultDate();
            this.loadHome();
            this.registerServiceWorker();
            console.log('Promo Engine initialized');
        } catch (err) {
            console.error('Init failed:', err);
            this.showToast('Failed to start app. Reload.');
        }
    },

    openDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);

            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                if (!db.objectStoreNames.contains('releases')) {
                    const relStore = db.createObjectStore('releases', { keyPath: 'id', autoIncrement: true });
                    relStore.createIndex('date', 'date', { unique: false });
                }

                if (!db.objectStoreNames.contains('posts')) {
                    const postStore = db.createObjectStore('posts', { keyPath: 'id', autoIncrement: true });
                    postStore.createIndex('date', 'date', { unique: false });
                    postStore.createIndex('status', 'status', { unique: false });
                    postStore.createIndex('releaseId', 'releaseId', { unique: false });
                    postStore.createIndex('platform', 'platform', { unique: false });
                }

                if (!db.objectStoreNames.contains('settings')) {
                    db.createObjectStore('settings', { keyPath: 'key' });
                }
            };
        });
    },

    registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('sw.js').catch(err => {
                console.log('SW registration failed:', err);
            });
        }
    },

    // ============================================
    // NAVIGATION
    // ============================================

    setupNavigation() {
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const screen = e.target.dataset.screen;
                this.showScreen(screen);
            });
        });
    },

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));

        document.getElementById('screen-' + screenId).classList.add('active');
        document.querySelector('[data-screen="' + screenId + '"]').classList.add('active');

        if (screenId === 'home') this.loadHome();
        if (screenId === 'releases') this.loadReleases();
        if (screenId === 'queue') { this.currentFilter = 'all'; this.loadQueue(); }
        if (screenId === 'create') this.loadCreate();
        if (screenId === 'tools') this.loadTools();
    },

    // ============================================
    // UTILITIES
    // ============================================

    showToast(message, duration) {
        duration = duration || 2500;
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), duration);
    },

    fmtDate(d) {
        if (!d) return 'No date';
        return new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    },

    fmtShortDate(d) {
        if (!d) return '';
        return new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    },

    todayStr() {
        return new Date().toISOString().split('T')[0];
    },

    setDefaultDate() {
        const dateInputs = document.querySelectorAll('input[type="date"]');
        dateInputs.forEach(function(input) {
            if (!input.value) input.value = PromoEngine.todayStr();
        });
    },

    // ============================================
    // HOME SCREEN
    // ============================================

    async loadHome() {
        const today = this.todayStr();

        const releases = await this.getAll('releases');
        const posts = await this.getAll('posts');
        const pending = posts.filter(function(p) { return p.status === 'pending'; });
        const todayPosts = pending.filter(function(p) { return p.date === today; });

        document.getElementById('stat-releases').textContent = releases.length;
        document.getElementById('stat-pending').textContent = pending.length;

        const statsEl = document.getElementById('today-stats');
        if (todayPosts.length === 0) {
            statsEl.innerHTML = 'No posts scheduled for <strong>' + this.fmtShortDate(today) + '</strong>. You are clear to create or check your queue.';
        } else {
            const platforms = [];
            todayPosts.forEach(function(p) {
                if (platforms.indexOf(p.platform) === -1) platforms.push(p.platform);
            });
            statsEl.innerHTML = '<strong>' + todayPosts.length + ' post' + (todayPosts.length > 1 ? 's' : '') + '</strong> ready for today across ' + platforms.join(', ') + '.';
        }
    },

    // ============================================
    // RELEASES
    // ============================================

    async saveRelease() {
        const title = document.getElementById('rel-title').value.trim();
        const date = document.getElementById('rel-date').value;
        const genre = document.getElementById('rel-genre').value.trim() || 'Music';
        const mood = document.getElementById('rel-mood').value.trim() || 'Vibes';
        const fileInput = document.getElementById('rel-art');

        if (!title || !date) {
            this.showToast('Title and release date required');
            return;
        }

        const release = {
            title: title,
            date: date,
            genre: genre,
            mood: mood,
            artData: null,
            created: Date.now()
        };

        if (fileInput.files && fileInput.files[0]) {
            release.artData = await this.readFile(fileInput.files[0]);
        }

        await this.add('releases', release);
        this.showToast('Release saved: ' + title);

        document.getElementById('rel-title').value = '';
        document.getElementById('rel-date').value = this.todayStr();
        document.getElementById('rel-genre').value = '';
        document.getElementById('rel-mood').value = '';
        document.getElementById('upload-text').textContent = 'Tap to select album art';
        fileInput.value = '';

        this.loadReleases();
    },

    async loadReleases() {
        const releases = await this.getAll('releases');
        const list = document.getElementById('releases-list');

        if (releases.length === 0) {
            list.innerHTML = '<div class="empty-state"><div class="empty-state-icon">&#128190;</div><div>No releases yet</div><div style="font-size:14px; margin-top:8px;">Add your first release above</div></div>';
            return;
        }

        list.innerHTML = releases.slice().reverse().map(function(r) {
            return '<div class="card" style="position:relative;">' +
                '<div style="display:flex; gap:16px; align-items:center;">' +
                (r.artData ? '<img src="' + r.artData + '" style="width:80px;height:80px;border-radius:12px;object-fit:cover;" onclick="PromoEngine.viewImage(&quot;' + r.artData + '&quot;)">' : '<div style="width:80px;height:80px;border-radius:12px;background:#333;display:flex;align-items:center;justify-content:center;font-size:32px;">&#127925;</div>') +
                '<div style="flex:1;">' +
                '<h3 style="margin-bottom:4px;">' + PromoEngine.escapeHtml(r.title) + '</h3>' +
                '<div style="color:#8e8e93; font-size:14px;">' + PromoEngine.fmtDate(r.date) + ' &bull; ' + PromoEngine.escapeHtml(r.genre) + ' &bull; ' + PromoEngine.escapeHtml(r.mood) + '</div>' +
                '</div></div>' +
                '<div style="display:flex; gap:8px; margin-top:12px;">' +
                '<button class="btn btn-secondary" style="flex:1; margin-bottom:0; font-size:14px; padding:10px;" onclick="PromoEngine.generateCampaignForRelease(' + r.id + ')">Generate Campaign</button>' +
                '<button class="btn btn-danger" style="width:auto; margin-bottom:0; font-size:14px; padding:10px 14px;" onclick="PromoEngine.deleteRelease(' + r.id + ')">&#128465;</button>' +
                '</div></div>';
        }).join('');
    },

    async deleteRelease(id) {
        if (!confirm('Delete this release and all its campaign posts?')) return;

        const posts = await this.getAllByIndex('posts', 'releaseId', id);
        for (const post of posts) {
            await this.delete('posts', post.id);
        }
        await this.delete('releases', id);

        this.showToast('Release deleted');
        this.loadReleases();
    },

    viewImage(src) {
        const modal = document.createElement('div');
        modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.9);z-index:300;display:flex;align-items:center;justify-content:center;padding:20px;';
        modal.innerHTML = '<img src="' + src + '" style="max-width:100%;max-height:80vh;border-radius:12px;" onclick="this.parentElement.remove()">';
        document.body.appendChild(modal);
    },

    // ============================================
    // CAMPAIGN GENERATOR
    // ============================================

    async loadCreate() {
        const releases = await this.getAll('releases');
        const sel = document.getElementById('camp-release');

        if (releases.length === 0) {
            sel.innerHTML = '<option>No releases yet - add one first</option>';
            return;
        }

        sel.innerHTML = releases.map(function(r) {
            return '<option value="' + r.id + '">' + PromoEngine.escapeHtml(r.title) + ' (' + PromoEngine.fmtShortDate(r.date) + ')</option>';
        }).join('');
    },

    async generateCampaign() {
        const releaseId = parseInt(document.getElementById('camp-release').value);
        if (!releaseId) { this.showToast('Select a release first'); return; }

        const release = await this.get('releases', releaseId);
        if (!release) { this.showToast('Release not found'); return; }

        const posts = this.buildCampaign(release);
        for (const post of posts) {
            await this.add('posts', post);
        }

        this.showToast(posts.length + ' posts generated');
        this.showScreen('queue');
    },

    async generateCampaignForRelease(releaseId) {
        const release = await this.get('releases', releaseId);
        if (!release) return;

        const posts = this.buildCampaign(release);
        for (const post of posts) {
            await this.add('posts', post);
        }

        this.showToast(posts.length + ' posts generated for ' + release.title);
        this.showScreen('queue');
    },

    buildCampaign(release) {
        const posts = [];
        const releaseDate = new Date(release.date + 'T00:00:00');
        const genreTag = release.genre.replace(/\s+/g, '');
        const baseHashtags = '#' + genreTag + ' #' + release.mood.replace(/\s+/g, '') + ' #NewMusic #IndieArtist #ProducerLife';

        const templates = [
            { type: 'teaser', text: "Something's coming. " + release.title + ". Are you ready?" },
            { type: 'behind', text: "Late night studio session. " + release.title + " took way too many tries to get right. Worth it?" },
            { type: 'lyric', text: "Locked in a feeling I can't explain - " + release.title },
            { type: 'countdown', text: release.title + ". " + this.fmtShortDate(release.date) + ". Mark it." },
            { type: 'reminder', text: release.title + " is out now everywhere. Link in bio. Run it up." },
            { type: 'gratitude', text: "Y'all pushed " + release.title + " past my expectations. Thank you. What's your favorite part?" },
            { type: 'playlist', text: "If you're making a " + release.mood.toLowerCase() + " playlist, " + release.title + " belongs on it." },
            { type: 'milestone', text: release.title + " just hit a new milestone. Couldn't do this without you." },
            { type: 'question', text: "What mood does " + release.title + " put you in? I'm curious." },
            { type: 'process', text: "The beat for " + release.title + " started as a voice memo at 3 AM. Now look at it." }
        ];

        const platforms = ['instagram', 'tiktok', 'youtube', 'twitter'];

        for (let i = -14; i <= 30; i++) {
            const postDate = new Date(releaseDate);
            postDate.setDate(postDate.getDate() + i);
            const dateStr = postDate.toISOString().split('T')[0];

            const tmpl = templates[Math.abs(i) % templates.length];
            const platform = platforms[Math.abs(i) % platforms.length];

            if (i % 2 !== 0 && i !== 0 && i !== -1) continue;

            let caption = tmpl.text;
            let hashtags = baseHashtags;

            if (platform === 'twitter') {
                hashtags = '#NewMusic #' + genreTag;
                caption = caption.substring(0, 220);
            }
            if (platform === 'tiktok') hashtags += ' #FYP #Viral #MusicTok #ForYou';
            if (platform === 'instagram') hashtags += ' #InstaMusic #MusicProducer #ArtistOnInstagram';
            if (platform === 'youtube') hashtags += ' #Shorts #MusicShorts #NewMusicFriday';

            posts.push({
                releaseId: release.id,
                platform: platform,
                type: tmpl.type,
                caption: caption,
                hashtags: hashtags,
                date: dateStr,
                status: 'pending',
                created: Date.now()
            });
        }

        return posts;
    },

    async saveManualPost() {
        const platform = document.getElementById('manual-platform').value;
        const date = document.getElementById('manual-date').value;
        const caption = document.getElementById('manual-caption').value.trim();
        const hashtags = document.getElementById('manual-hashtags').value.trim();

        if (!date || !caption) {
            this.showToast('Date and caption required');
            return;
        }

        await this.add('posts', {
            releaseId: null,
            platform: platform,
            type: 'manual',
            caption: caption,
            hashtags: hashtags || '#NewMusic',
            date: date,
            status: 'pending',
            created: Date.now()
        });

        this.showToast('Post added to queue');
        document.getElementById('manual-caption').value = '';
        document.getElementById('manual-hashtags').value = '';
    },

    // ============================================
    // QUEUE
    // ============================================

    async loadQueue() {
        const today = this.todayStr();
        let posts = await this.getAll('posts');
        posts = posts.filter(function(p) { return p.status === 'pending'; });
        posts.sort(function(a, b) { return a.date.localeCompare(b.date); });

        if (this.currentFilter === 'today') {
            posts = posts.filter(function(p) { return p.date === today; });
        } else if (this.currentFilter !== 'all') {
            posts = posts.filter(function(p) { return p.platform === PromoEngine.currentFilter; });
        }

        const list = document.getElementById('queue-list');

        if (posts.length === 0) {
            const msg = this.currentFilter === 'all' ? 'Generate a campaign or add a manual post' : 'Try a different filter';
            list.innerHTML = '<div class="empty-state"><div class="empty-state-icon">&#128203;</div><div>No posts here</div><div style="font-size:14px; margin-top:8px;">' + msg + '</div></div>';
            return;
        }

        list.innerHTML = posts.map(function(p) {
            return '<div class="post-item" onclick="PromoEngine.openPost(' + p.id + ')">' +
                '<div class="post-header">' +
                '<span class="post-platform">' + p.platform + '</span>' +
                '<span class="post-date">' + PromoEngine.fmtShortDate(p.date) + (p.date === today ? ' &bull; TODAY' : '') + '</span>' +
                '</div>' +
                '<div class="post-content">' + PromoEngine.escapeHtml(p.caption) + '</div>' +
                '<div class="post-hashtags">' + PromoEngine.escapeHtml(p.hashtags) + '</div>' +
                '<div style="margin-top:10px; font-size:13px; color:#8e8e93;">' +
                '<span class="status-badge status-' + p.status + '"></span>' +
                p.type +
                '</div></div>';
        }).join('');
    },

    filterQueue(filter) {
        this.currentFilter = filter;
        this.loadQueue();
    },

    async openPost(id) {
        const post = await this.get('posts', id);
        if (!post) return;

        const modal = document.getElementById('post-modal');
        const body = document.getElementById('modal-body');
        const title = document.getElementById('modal-title');

        title.textContent = post.platform.toUpperCase() + ' - ' + this.fmtShortDate(post.date);

        const fullText = post.caption + '\n\n' + post.hashtags;

        body.innerHTML = '<div style="background:#2c2c2e; border-radius:12px; padding:16px; margin-bottom:16px; font-size:15px; line-height:1.5;">' +
            PromoEngine.escapeHtml(post.caption) + '<br><br>' +
            '<span style="color:#0A84FF;">' + PromoEngine.escapeHtml(post.hashtags) + '</span></div>' +
            '<div class="action-grid">' +
            '<button class="action-btn" onclick="PromoEngine.copyTextFromModal(0); PromoEngine.closeModal();">&#128203; Copy All</button>' +
            '<button class="action-btn" onclick="PromoEngine.copyTextFromModal(1); PromoEngine.closeModal();">&#128221; Copy Caption</button>' +
            '<button class="action-btn" onclick="PromoEngine.copyTextFromModal(2); PromoEngine.closeModal();">#ï¸â£ Copy Tags</button>' +
            '<button class="action-btn" onclick="PromoEngine.shareTextFromModal(); PromoEngine.closeModal();">&#128229; Share</button>' +
            '</div>' +
            '<button class="btn btn-success" style="margin-top:12px; margin-bottom:0;" onclick="PromoEngine.markPosted(' + post.id + ')">&#9989; Mark as Posted</button>' +
            '<button class="btn btn-danger" style="margin-top:8px; margin-bottom:0;" onclick="PromoEngine.deletePost(' + post.id + ')">&#128465; Delete Post</button>';

        modal.dataset.caption = post.caption;
        modal.dataset.hashtags = post.hashtags;
        modal.dataset.full = fullText;
        modal.classList.add('active');
    },

    copyTextFromModal(type) {
        const modal = document.getElementById('post-modal');
        if (type === 0) this.copyText(modal.dataset.full);
        if (type === 1) this.copyText(modal.dataset.caption);
        if (type === 2) this.copyText(modal.dataset.hashtags);
    },

    shareTextFromModal() {
        const modal = document.getElementById('post-modal');
        this.shareText(modal.dataset.full);
    },

    closeModal() {
        document.getElementById('post-modal').classList.remove('active');
    },

    async markPosted(id) {
        await this.update('posts', id, { status: 'posted' });
        this.showToast('Marked as posted');
        this.closeModal();
        this.loadQueue();
        this.loadHome();
    },

    async deletePost(id) {
        if (!confirm('Delete this post?')) return;
        await this.delete('posts', id);
        this.showToast('Post deleted');
        this.closeModal();
        this.loadQueue();
        this.loadHome();
    },

    // ============================================
    // QUICK POST GENERATOR
    // ============================================

    async generateQuickPost() {
        const title = document.getElementById('quick-title').value.trim() || 'New Track';
        const platform = document.getElementById('quick-platform').value;
        const type = document.getElementById('quick-type').value;

        const captions = {
            teaser: title + " - 15 seconds that took 3 weeks. Worth it?",
            lyric: "Locked in a feeling I can't explain - " + title,
            countdown: title + ". Soon. Very soon.",
            reminder: title + " is out now. Link in bio. Run it up.",
            gratitude: "Every stream of " + title + " means more than you know. Thank you."
        };

        const hashtags = {
            instagram: '#NewMusic #IndieArtist #ProducerLife #NowPlaying #MusicProducer',
            tiktok: '#NewMusic #FYP #MusicTok #Viral #IndieArtist #ForYouPage',
            youtube: '#NewMusic #Shorts #IndieArtist #MusicVideo #NewMusicFriday',
            twitter: '#NewMusic #IndieArtist #NowPlaying'
        };

        const caption = captions[type] || captions.teaser;
        const tagSet = hashtags[platform] || hashtags.instagram;

        document.getElementById('quick-caption').innerHTML = '<strong>' + this.escapeHtml(caption) + '</strong><br><br><span style="color:#0A84FF;">' + this.escapeHtml(tagSet) + '</span>';

        const canvas = document.getElementById('quick-canvas');
        const dataUrl = await this.renderCanvas(title, type, canvas);

        const img = document.getElementById('quick-preview');
        img.src = dataUrl;
        img.classList.add('visible');
        img.dataset.url = dataUrl;

        document.getElementById('quick-actions').style.display = 'block';

        this.showToast('Content ready!');
    },

    renderCanvas(title, type, canvas) {
        return new Promise(function(resolve) {
            const ctx = canvas.getContext('2d');
            const isStory = type === 'teaser' || type === 'countdown';
            canvas.width = 1080;
            canvas.height = isStory ? 1920 : 1350;

            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            const colors = {
                teaser: ['#0f0f23', '#1a1a3e', '#0a0a1a'],
                lyric: ['#1a0a1a', '#2d1b2d', '#0f050f'],
                countdown: ['#0a1a0f', '#1b2d1b', '#050f0a'],
                reminder: ['#1a1a0a', '#2d2d1b', '#0f0f05'],
                gratitude: ['#0a0f1a', '#1b1f2d', '#05070f']
            };
            const c = colors[type] || colors.teaser;
            gradient.addColorStop(0, c[0]);
            gradient.addColorStop(0.5, c[1]);
            gradient.addColorStop(1, c[2]);
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            for (let i = 0; i < 8000; i++) {
                ctx.fillStyle = 'rgba(255,255,255,' + (Math.random() * 0.02) + ')';
                ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 2, 2);
            }

            ctx.strokeStyle = 'rgba(255,255,255,0.08)';
            ctx.lineWidth = 3;
            ctx.strokeRect(50, 50, canvas.width - 100, canvas.height - 100);

            ctx.fillStyle = 'rgba(255,255,255,0.4)';
            ctx.font = '600 28px -apple-system, BlinkMacSystemFont, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(type.toUpperCase(), canvas.width / 2, 120);

            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 80px -apple-system, BlinkMacSystemFont, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            const words = title.split(' ');
            let line = '';
            let lines = [];
            for (let j = 0; j < words.length; j++) {
                const test = line + words[j] + ' ';
                if (ctx.measureText(test).width > canvas.width - 200 && line !== '') {
                    lines.push(line);
                    line = words[j] + ' ';
                } else {
                    line = test;
                }
            }
            lines.push(line);

            const startY = canvas.height / 2 - ((lines.length - 1) * 55);
            for (let k = 0; k < lines.length; k++) {
                ctx.fillText(lines[k].trim(), canvas.width / 2, startY + (k * 110));
            }

            ctx.font = '400 34px -apple-system, BlinkMacSystemFont, sans-serif';
            ctx.fillStyle = 'rgba(255,255,255,0.5)';
            const subtitles = {
                teaser: 'OUT NOW - LINK IN BIO',
                lyric: 'STREAM EVERYWHERE',
                countdown: 'MARK THE DATE',
                reminder: "DON'T SLEEP ON THIS",
                gratitude: 'THANK YOU FOR LISTENING'
            };
            ctx.fillText(subtitles[type] || 'OUT NOW - LINK IN BIO', canvas.width / 2, canvas.height / 2 + (lines.length * 55) + 50);

            ctx.font = '500 22px -apple-system, BlinkMacSystemFont, sans-serif';
            ctx.fillStyle = 'rgba(255,255,255,0.25)';
            ctx.fillText('PROMO ENGINE', canvas.width / 2, canvas.height - 90);

            resolve(canvas.toDataURL('image/png'));
        });
    },

    async shareQuickPost() {
        const img = document.getElementById('quick-preview');
        const caption = document.getElementById('quick-caption').innerText;

        if (!img.dataset.url) return;

        try {
            const response = await fetch(img.dataset.url);
            const blob = await response.blob();
            const file = new File([blob], 'promo.png', { type: 'image/png' });

            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({ files: [file], title: 'New Post', text: caption });
            } else {
                this.showToast('Direct share not supported. Save image and copy caption.');
            }
        } catch (err) {
            this.showToast('Share cancelled or failed');
        }
    },

    async saveQuickImage() {
        const img = document.getElementById('quick-preview');
        if (!img.dataset.url) return;

        const a = document.createElement('a');
        a.href = img.dataset.url;
        a.download = 'promo-' + Date.now() + '.png';
        a.click();
        this.showToast('Image saved to downloads');
    },

    copyQuickCaption() {
        const text = document.getElementById('quick-caption').innerText;
        this.copyText(text);
    },

    // ============================================
    // TOOLS
    // ============================================

    loadTools() {
        this.loadCaptionBank();
        this.updateBioPreview();
    },

    updateBioPreview() {
        const preview = document.getElementById('bio-preview');
        preview.style.display = 'block';

        const name = document.getElementById('bio-name').value || 'Your Artist Name';
        document.getElementById('bio-display-name').textContent = name;

        const links = {
            spotify: document.getElementById('bio-spotify').value,
            apple: document.getElementById('bio-apple').value,
            youtube: document.getElementById('bio-youtube').value,
            soundcloud: document.getElementById('bio-soundcloud').value
        };

        const setLink = function(id, url, label) {
            const el = document.getElementById('bio-link-' + id);
            if (url) {
                el.href = url;
                el.style.display = 'block';
                el.textContent = label;
            } else {
                el.style.display = 'none';
            }
        };

        setLink('spotify', links.spotify, 'Spotify');
        setLink('apple', links.apple, 'Apple Music');
        setLink('youtube', links.youtube, 'YouTube');
        setLink('soundcloud', links.soundcloud, 'SoundCloud');
    },

    copyBioHTML() {
        const name = document.getElementById('bio-name').value || 'Artist';
        const spotify = document.getElementById('bio-spotify').value;
        const apple = document.getElementById('bio-apple').value;
        const youtube = document.getElementById('bio-youtube').value;
        const soundcloud = document.getElementById('bio-soundcloud').value;

        const html = '<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n<title>' + this.escapeHtml(name) + '</title>\n<style>\n*{margin:0;padding:0;box-sizing:border-box}\nbody{background:#000;color:#fff;font-family:-apple-system,BlinkMacSystemFont,sans-serif;text-align:center;padding:2rem 1rem;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center}\n.avatar{width:120px;height:120px;border-radius:50%;background:linear-gradient(135deg,#333,#111);margin-bottom:1.5rem;display:flex;align-items:center;justify-content:center;font-size:48px}\nh1{font-size:24px;margin-bottom:0.5rem}\np{color:#888;margin-bottom:2rem;font-size:15px}\na{display:block;background:#1c1c1e;color:#fff;padding:16px;margin:8px auto;max-width:400px;width:100%;border-radius:12px;text-decoration:none;font-weight:600;font-size:16px;transition:all 0.2s;border:1px solid #333}\na:hover{background:#2c2c2e}\n.footer{margin-top:2rem;color:#444;font-size:12px}\n</style>\n</head>\n<body>\n<div class="avatar">&#127925;</div>\n<h1>' + this.escapeHtml(name) + '</h1>\n<p>New music out now</p>\n' +
        (spotify ? '<a href="' + this.escapeHtml(spotify) + '" target="_blank">&#127925; Spotify</a>\n' : '') +
        (apple ? '<a href="' + this.escapeHtml(apple) + '" target="_blank">&#127822; Apple Music</a>\n' : '') +
        (youtube ? '<a href="' + this.escapeHtml(youtube) + '" target="_blank">&#9654; YouTube</a>\n' : '') +
        (soundcloud ? '<a href="' + this.escapeHtml(soundcloud) + '" target="_blank">&#9729; SoundCloud</a>\n' : '') +
        '<div class="footer">Made with Promo Engine</div>\n</body>\n</html>';

        this.copyText(html);
        this.showToast('HTML copied! Paste into your GitHub Pages repo.');
    },

    loadCaptionBank() {
        const bank = [
            { title: 'Mystery Drop', text: "Something new is coming. I've never released anything like this." },
            { title: 'Studio Grind', text: "3 AM. Coffee cold. Track finally sounds right. This is the one." },
            { title: 'Fan Question', text: "What song of mine hits hardest for you? I'm making the setlist." },
            { title: 'Behind the Sound', text: "That sound at 0:47? It's a fork hitting a wine glass pitched down 3 octaves." },
            { title: 'Gratitude', text: "Every stream, every share, every comment - I see them all. Thank you." },
            { title: 'Playlist Pitch', text: "If your playlist needs something fresh, I got you. Link in bio." },
            { title: 'Process', text: "Started as a voice memo. Now it's a whole thing. Trust the process." },
            { title: 'Vulnerability', text: "This one was hard to write. But it was harder not to." },
            { title: 'Energy', text: "Run this back at full volume. Your speakers will thank you." },
            { title: 'Community', text: "We hit a milestone. Small number to some, everything to me." }
        ];

        document.getElementById('caption-bank').innerHTML = bank.map(function(c) {
            return '<div class="post-item" onclick="PromoEngine.copyText(&quot;' + PromoEngine.escapeJs(c.text) + '&quot;)">' +
                '<div style="font-weight:700; margin-bottom:6px; color:#0A84FF;">' + PromoEngine.escapeHtml(c.title) + '</div>' +
                '<div style="font-size:14px; color:#ccc;">' + PromoEngine.escapeHtml(c.text) + '</div></div>';
        }).join('');
    },

    // ============================================
    // DATA EXPORT / IMPORT
    // ============================================

    async exportData() {
        const releases = await this.getAll('releases');
        const posts = await this.getAll('posts');
        const data = { releases: releases, posts: posts, exported: new Date().toISOString(), version: '1.0' };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'promo-engine-backup-' + this.todayStr() + '.json';
        a.click();
        this.showToast('Backup downloaded');
    },

    async importData(input) {
        if (!input.files || !input.files[0]) return;

        try {
            const text = await input.files[0].text();
            const data = JSON.parse(text);

            if (!data.releases || !data.posts) {
                this.showToast('Invalid backup file');
                return;
            }

            if (!confirm('This will replace all current data. Continue?')) return;

            const allReleases = await this.getAll('releases');
            const allPosts = await this.getAll('posts');
            for (const r of allReleases) await this.delete('releases', r.id);
            for (const p of allPosts) await this.delete('posts', p.id);

            for (const r of data.releases) {
                delete r.id;
                await this.add('releases', r);
            }
            for (const p of data.posts) {
                delete p.id;
                await this.add('posts', p);
            }

            this.showToast('Data restored!');
            this.loadHome();
        } catch (err) {
            this.showToast('Import failed: ' + err.message);
        }
        input.value = '';
    },

    async resetAll() {
        if (!confirm('DELETE EVERYTHING? This cannot be undone.')) return;
        if (!confirm('Seriously. All releases, all posts, all campaigns. Gone.')) return;

        const releases = await this.getAll('releases');
        const posts = await this.getAll('posts');
        for (const r of releases) await this.delete('releases', r.id);
        for (const p of posts) await this.delete('posts', p.id);

        this.showToast('All data cleared');
        this.loadHome();
    },

    // ============================================
    // DATABASE HELPERS
    // ============================================

    get(storeName, id) {
        return new Promise(function(resolve, reject) {
            const tx = PromoEngine.db.transaction(storeName, 'readonly');
            const request = tx.objectStore(storeName).get(id);
            request.onsuccess = function() { resolve(request.result); };
            request.onerror = function() { reject(request.error); };
        });
    },

    getAll(storeName) {
        return new Promise(function(resolve, reject) {
            const tx = PromoEngine.db.transaction(storeName, 'readonly');
            const request = tx.objectStore(storeName).getAll();
            request.onsuccess = function() { resolve(request.result); };
            request.onerror = function() { reject(request.error); };
        });
    },

    getAllByIndex(storeName, indexName, value) {
        return new Promise(function(resolve, reject) {
            const tx = PromoEngine.db.transaction(storeName, 'readonly');
            const request = tx.objectStore(storeName).index(indexName).getAll(value);
            request.onsuccess = function() { resolve(request.result); };
            request.onerror = function() { reject(request.error); };
        });
    },

    add(storeName, data) {
        return new Promise(function(resolve, reject) {
            const tx = PromoEngine.db.transaction(storeName, 'readwrite');
            const request = tx.objectStore(storeName).add(data);
            request.onsuccess = function() { resolve(request.result); };
            request.onerror = function() { reject(request.error); };
        });
    },

    update(storeName, id, changes) {
        return new Promise(function(resolve, reject) {
            const tx = PromoEngine.db.transaction(storeName, 'readwrite');
            const store = tx.objectStore(storeName);
            const getReq = store.get(id);
            getReq.onsuccess = function() {
                const data = Object.assign({}, getReq.result, changes);
                const putReq = store.put(data);
                putReq.onsuccess = function() { resolve(); };
                putReq.onerror = function() { reject(putReq.error); };
            };
        });
    },

    delete(storeName, id) {
        return new Promise(function(resolve, reject) {
            const tx = PromoEngine.db.transaction(storeName, 'readwrite');
            const request = tx.objectStore(storeName).delete(id);
            request.onsuccess = function() { resolve(); };
            request.onerror = function() { reject(request.error); };
        });
    },

    // ============================================
    // UTILITIES
    // ============================================

    readFile(file) {
        return new Promise(function(resolve) {
            const reader = new FileReader();
            reader.onload = function(e) { resolve(e.target.result); };
            reader.readAsDataURL(file);
        });
    },

    copyText(text) {
        navigator.clipboard.writeText(text).then(function() {
            PromoEngine.showToast('Copied to clipboard');
        }).catch(function() {
            const ta = document.createElement('textarea');
            ta.value = text;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            PromoEngine.showToast('Copied to clipboard');
        });
    },

    shareText(text) {
        if (navigator.share) {
            navigator.share({ title: 'New Post', text: text }).catch(function() {});
        } else {
            this.copyText(text);
        }
    },

    escapeHtml(str) {
        if (!str) return '';
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    },

    escapeJs(str) {
        if (!str) return '';
        return str.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/"/g, '\\"').replace(/\n/g, '\\n');
    },

    setupEventListeners() {
        const fileInput = document.getElementById('rel-art');
        if (fileInput) {
            fileInput.addEventListener('change', function() {
                const text = document.getElementById('upload-text');
                if (this.files && this.files[0]) {
                    text.innerHTML = 'Selected: ' + this.files[0].name;
                }
            });
        }

        const quickType = document.getElementById('quick-type');
        if (quickType) {
            quickType.addEventListener('change', function() {
                const lyricInput = document.getElementById('quick-lyric');
                if (lyricInput) lyricInput.style.display = this.value === 'lyric' ? 'block' : 'none';
            });
        }
    }
};

// ============================================
// GLOBAL ALIAS for inline onclick handlers
// ============================================
const app = PromoEngine;

// ============================================
// BOOT
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    PromoEngine.init();
});
