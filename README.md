# Promo Engine v1.0

A zero-cost, iPhone-friendly Progressive Web App for managing your music marketing campaigns across social media platforms.

## What It Does

- **Release Management**: Store your songs with metadata (genre, mood, release date, album art)
- **Campaign Generator**: Auto-creates 30+ days of platform-specific posts around each release
- **Quick Post Creator**: Generate branded marketing images + captions on the fly
- **Queue Management**: View, filter, and execute your posting schedule
- **Link-in-Bio Builder**: Generate HTML for your social media bio landing page
- **Caption Bank**: 10 reusable marketing formulas, one tap to copy
- **Data Export/Import**: Backup and restore your entire database
- **Works Offline**: Full functionality without internet after first load

## Files Included

| File | Purpose |
|------|---------|
| `index.html` | Main app shell and UI |
| `app.js` | Complete engine - database, logic, canvas rendering |
| `manifest.json` | PWA configuration for home screen installation |
| `sw.js` | Service worker for offline caching |
| `bio-page.html` | Standalone link-in-bio page template |

## iPhone Setup (No Computer Needed)

### Step 1: Create GitHub Repository
1. Download the **GitHub** app from App Store (free)
2. Sign up / log in
3. Tap `+` â New Repository
4. Name: `promo-engine`
5. Make it **Public**
6. Check "Add a README file"
7. Tap **Create**

### Step 2: Upload Files
1. In your repo, tap "Add file" â "Upload files"
2. Upload all 5 files from this package
3. Commit with message: "Initial upload"

### Step 3: Enable Free Hosting (GitHub Pages)
1. Go to your repo's **Settings** tab
2. Scroll to **Pages** section
3. Source: Deploy from a branch
4. Branch: `main`, folder: `/ (root)`
5. Tap **Save**
6. Wait 2-3 minutes
7. Your app will be live at: `https://YOURUSERNAME.github.io/promo-engine/`

### Step 4: Add to Home Screen
1. Open **Safari**
2. Go to your live URL
3. Tap the **Share** button (square with arrow up)
4. Scroll down, tap **"Add to Home Screen"**
5. Name it **Promo Engine**
6. Tap **Add**

The app now appears on your home screen with a black icon. It opens full-screen, no Safari chrome, works offline.

## Creating App Icons

You need two icon files for the PWA to look professional:

1. Open **Canva** app (free) on your iPhone
2. Create custom size: 512 x 512 pixels
3. Design: Black background (#000000) with a white lightning bolt or music note
4. Download as PNG
5. Upload to your GitHub repo as:
   - `icon-192.png` (same image, just rename)
   - `icon-512.png` (same image, just rename)

Or use any black square image as a placeholder and replace later.

## Daily Workflow

### Morning Check
1. Open Promo Engine from home screen
2. Check "Today's Mission" on Home tab
3. See how many posts are scheduled for today

### Creating a Release
1. Go to **Releases** tab
2. Fill in: Title, Release Date, Genre, Mood
3. Tap to select album art from Photos
4. Tap "Save Release"

### Generating a Campaign
1. Go to **Create** tab
2. Select your release from dropdown
3. Tap "Generate Campaign"
4. App creates 20-30 posts across Instagram, TikTok, YouTube, Twitter
5. Automatically routes to **Queue** tab to review

### Posting Content
1. Go to **Queue** tab
2. Tap any post to open detail modal
3. Options:
   - **Copy All**: Copies caption + hashtags to clipboard
   - **Copy Caption**: Just the text
   - **Copy Tags**: Just hashtags
   - **Share**: Opens iOS native share sheet
   - **Mark as Posted**: Removes from queue, updates stats

### Quick Post (Emergency Content)
1. Go to **Home** tab
2. Enter song title, select platform and type
3. Tap "Generate Content"
4. App creates a branded image + caption instantly
5. Tap "Share" to send directly to Instagram/TikTok
6. Or "Save Image" to Photos, "Copy Caption" to clipboard

### Link-in-Bio Page
1. Go to **Tools** tab
2. Enter your artist name and streaming links
3. Tap "Update Preview" to see how it looks
4. Tap "Copy HTML Code"
5. Create a SECOND GitHub repo named `yourusername.github.io`
6. Upload an `index.html` with the copied code
7. This becomes your public bio link: `https://yourusername.github.io`

## Data Storage

All data is stored locally on your iPhone using IndexedDB (browser database). Nothing is sent to any server. Your releases, posts, and album art stay on your device.

**Important**: If you clear Safari website data, you will lose everything. Use the **Export JSON** button in Tools tab regularly to create backups.

## Platform-Specific Notes

| Platform | Best Content | Hashtag Strategy |
|----------|-------------|------------------|
| **Instagram** | Feed posts, Reels, Stories | 20-30 hashtags, mix broad and niche |
| **TikTok** | Short clips, behind scenes | #FYP #ForYou #MusicTok essential |
| **YouTube** | Shorts, full videos | #Shorts #NewMusicFriday |
| **Twitter/X** | Text + link cards | Keep hashtags minimal (2-3) |

## Troubleshooting

**App won't load offline?**
- Make sure you opened it online at least once after upload
- Service worker needs first online load to cache files

**Images not generating?**
- Canvas rendering requires the app to be loaded from a secure context (HTTPS)
- GitHub Pages provides HTTPS automatically

**Share button doesn't work?**
- iOS Share Sheet requires user interaction (tap)
- Some platforms block file sharing - use "Save Image" + "Copy Caption" as fallback

**Database seems empty after reinstall?**
- Use Import JSON to restore from your backup file
- Backups are saved to your Downloads folder

## Roadmap to Public Launch

When you're ready to monetize, this same codebase scales:

1. **Phase 2**: Add user accounts, cloud sync (Firebase free tier)
2. **Phase 3**: Add analytics dashboard (track which posts drive streams)
3. **Phase 4**: Add AI caption generation (OpenAI API)
4. **Phase 5**: True API posting (requires Meta/TikTok developer accounts)

The core architecture (IndexedDB, Canvas rendering, PWA structure) transfers directly to a production app.

## License

This is your personal project. Modify, distribute, monetize freely. Built for artists by artists.

---

**Built with**: HTML5, CSS3, JavaScript (Vanilla), IndexedDB, Canvas API, GitHub Pages
**Cost**: $0
**Requirements**: iPhone + Safari + GitHub account
