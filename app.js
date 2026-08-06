// ==================== CONFIG ====================
const STORAGE_KEY = 'promoengine_accounts';
const SESSION_KEY = 'promoengine_current';

const CONTENT_TYPES = [
    { id: 'song', label: 'Song / Track', icon: '🎵', article: 'a' },
    { id: 'album', label: 'Album / EP', icon: '💿', article: 'an' },
    { id: 'video', label: 'Video', icon: '🎬', article: 'a' },
    { id: 'playlist', label: 'Playlist', icon: '📋', article: 'a' },
    { id: 'channel', label: 'Channel / Account', icon: '👤', article: 'a' },
    { id: 'page', label: 'Link Page / Bio', icon: '🔗', article: 'a' }
];

const PLATFORMS = [
    { id: 'spotify', label: 'Spotify', pattern: /open\.spotify\.com|spotify\.com/ },
    { id: 'apple', label: 'Apple Music', pattern: /music\.apple\.com/ },
    { id: 'youtube', label: 'YouTube', pattern: /youtube\.com|youtu\.be/ },
    { id: 'soundcloud', label: 'SoundCloud', pattern: /soundcloud\.com/ },
    { id: 'bandcamp', label: 'Bandcamp', pattern: /bandcamp\.com/ },
    { id: 'instagram', label: 'Instagram', pattern: /instagram\.com/ },
    { id: 'tiktok', label: 'TikTok', pattern: /tiktok\.com/ },
    { id: 'twitter', label: 'X / Twitter', pattern: /twitter\.com|x\.com/ },
    { id: 'other', label: 'Other', pattern: /.*/ }
];

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

const CAMPAIGN_GOALS = {
    awareness:   { label: 'Awareness', desc: 'Get discovered by new fans', icon: '👁' },
    engagement:  { label: 'Engagement', desc: 'Comments, shares, duets', icon: '💬' },
    conversion:  { label: 'Conversion', desc: 'Streams, follows, saves', icon: '🎯' },
    retention:   { label: 'Retention', desc: 'Keep fans coming back', icon: '🔁' },
    crosspromo:  { label: 'Cross-Promo', desc: 'Push fans to another platform', icon: '🔀' }
};

// ==================== CAMPAIGN TEMPLATES ====================
const CAMPAIGN_TEMPLATES = {
    song: {
        awareness: (d) => [
            { day: 1, platform: 'Instagram', type: 'Story Teaser', time: '6:00 PM', copy: `👀 Something new is coming…\n\n${d.title} drops ${d.date || 'soon'}.`, hashtags: '#NewMusic #Teaser #ComingSoon', cta: 'Turn on post notifications 🔊' },
            { day: 2, platform: 'TikTok / Reels', type: 'Behind the Beat', time: '12:00 PM', copy: `The making of ${d.title} 🎧\n\nThis one hit different in the studio.`, hashtags: '#BehindTheScenes #Studio #MusicProduction', cta: 'Follow for the full drop' },
            { day: 3, platform: 'Instagram / X', type: 'Pre-Save Push', time: '5:00 PM', copy: `🚨 ${d.title} is coming.\n\n${d.url ? 'Link in bio.' : 'Every pre-save helps the algorithm push this to new fans.'}`, hashtags: '#PreSave #NewMusicFriday #IndieArtist', cta: 'Tag 2 friends who need this track' },
            { day: 4, platform: 'Instagram Story', type: 'Countdown', time: '8:00 PM', copy: `⏰ Almost here.\n\n${d.title} — ${d.date || 'soon'}.`, hashtags: '#Countdown #NewMusic', cta: 'Reply with a 🔥 if you’re waiting' },
            { day: 5, platform: 'TikTok / Reels', type: 'Snippet / Hook', time: '11:00 AM', copy: `This hook has been stuck in my head for weeks…\n\n${d.title}`, hashtags: '#Snippet #Viral #NewMusic', cta: 'Duet this if it hits' }
        ],
        engagement: (d) => [
            { day: 1, platform: 'TikTok / Reels', type: 'Hook Challenge', time: '12:00 PM', copy: `I dare you to not move when this hook drops 😤\n\n${d.title}`, hashtags: '#HookChallenge #Viral', cta: 'Use this sound & show your reaction' },
            { day: 2, platform: 'TikTok / Reels', type: 'Duet Prompt', time: '11:00 AM', copy: `Drop a verse on this beat.\n\nBest one gets pinned.`, hashtags: '#OpenVerse #Duet', cta: 'Duet this — no rules' },
            { day: 3, platform: 'Instagram Story', type: 'Poll / Engage', time: '6:00 PM', copy: `Which hits harder: the beat or the lyrics?`, hashtags: '#Poll #Engage', cta: 'Vote & share to your story' },
            { day: 4, platform: 'TikTok / Reels', type: 'Trending Sound Flip', time: '1:00 PM', copy: `When the trending sound meets ${d.title}…`, hashtags: '#Trending #Remix', cta: 'Stitch this flip' },
            { day: 5, platform: 'All Platforms', type: 'UGC Repost', time: '12:00 PM', copy: `Y’all went CRAZY on this sound.\n\nHere are my favorites from this week.`, hashtags: '#UGC #Repost #Community', cta: 'Keep posting — I’m watching' }
        ],
        conversion: (d) => [
            { day: 1, platform: 'Instagram / X', type: 'Direct Link Push', time: '5:00 PM', copy: `${d.title} is live.\n\n${d.url || 'Link in bio.'}\n\nStream it. Save it. Add it to your playlist.`, hashtags: '#OutNow #StreamNow', cta: 'Screenshot your stream & tag me' },
            { day: 2, platform: 'Instagram Story', type: 'Swipe Up / Link', time: '8:00 PM', copy: `Running it up on ${d.platform || 'streaming'} 🚀`, hashtags: '#Stream', cta: 'Tap the link — 30 seconds helps the algorithm' },
            { day: 3, platform: 'TikTok / Reels', type: 'Reaction Bait', time: '12:00 PM', copy: `POV: you just heard ${d.title} for the first time`, hashtags: '#Reaction #FirstListen', cta: 'Stream link in bio' },
            { day: 4, platform: 'Instagram / X', type: 'Playlist Push', time: '6:00 PM', copy: `Add ${d.title} to your playlist and screenshot it.\n\nBest playlist name wins a repost.`, hashtags: '#PlaylistChallenge', cta: 'Link in bio' },
            { day: 5, platform: 'All Platforms', type: 'Thank You / FOMO', time: '7:00 PM', copy: `${d.title} just hit [X] streams.\n\nIf you haven’t run it up yet, you’re missing out.`, hashtags: '#FOMO #StreamNow', cta: 'Link in bio — go now' }
        ],
        retention: (d) => [
            { day: 1, platform: 'Instagram Story', type: 'Lyric Drop', time: '6:00 PM', copy: `“[Pull a lyric from ${d.title}]”`, hashtags: '#Lyrics #Quote', cta: 'Guess the next line' },
            { day: 2, platform: 'TikTok / Reels', type: 'Acoustic / Alternate', time: '12:00 PM', copy: `${d.title} — acoustic version. Should I drop the full thing?`, hashtags: '#Acoustic #Unplugged', cta: 'Comment YES if you want it' },
            { day: 3, platform: 'Instagram / X', type: 'Fan Feature', time: '5:00 PM', copy: `Y’all have been tagging me in your ${d.title} stories.\n\nI see every single one. Keep going.`, hashtags: '#FanLove #Repost', cta: 'Tag me — I’m reposting tonight' },
            { day: 4, platform: 'TikTok / Reels', type: 'BTS / Process', time: '11:00 AM', copy: `The version of ${d.title} you never heard…`, hashtags: '#BTS #Demo', cta: 'Follow so you don’t miss drops' },
            { day: 5, platform: 'All Platforms', type: 'Next Tease', time: '7:00 PM', copy: `${d.title} was just the beginning.\n\nWait until you hear what’s next.`, hashtags: '#Teaser #ComingSoon', cta: 'Turn on notifications' }
        ],
        crosspromo: (d) => [
            { day: 1, platform: 'Instagram / X', type: 'Platform Jump', time: '5:00 PM', copy: `I just dropped something new on ${d.platform || 'my page'}.\n\nGo follow me there for the full experience.`, hashtags: '#Follow', cta: 'Link in bio' },
            { day: 2, platform: 'TikTok / Reels', type: 'Exclusive Snippet', time: '12:00 PM', copy: `This version of ${d.title} is ONLY on ${d.platform || 'my page'} 👀`, hashtags: '#Exclusive #OnlyHere', cta: 'Link in bio — don’t miss it' },
            { day: 3, platform: 'Instagram Story', type: 'Countdown to Move', time: '8:00 PM', copy: `Moving the conversation to ${d.platform || 'my page'}.\n\nSee you there.`, hashtags: '#LinkInBio', cta: 'Tap & follow' },
            { day: 4, platform: 'All Platforms', type: 'Value Prop', time: '11:00 AM', copy: `Why ${d.platform || 'my page'}? Because I drop stuff there first.\n\nAlways.`, hashtags: '#First #Exclusive', cta: 'Link in bio — join the inner circle' },
            { day: 5, platform: 'All Platforms', type: 'Results', time: '7:00 PM', copy: `Y’all moved. The numbers don’t lie.\n\n${d.platform || 'Page'} fam is growing fast.`, hashtags: '#Growth #Community', cta: 'Still not there? Link in bio' }
        ]
    },
    album: {
        awareness: (d) => [
            { day: 1, platform: 'Instagram / X', type: 'Cover Reveal', time: '6:00 PM', copy: `${d.title}\n\nThe cover. The tracklist. The vibe.\n\n${d.date || 'Coming soon'}.`, hashtags: '#AlbumReveal #Tracklist', cta: 'Save this post' },
            { day: 2, platform: 'TikTok / Reels', type: 'Track-by-Track Tease', time: '12:00 PM', copy: `Track 1 from ${d.title} — this one sets the tone.`, hashtags: '#TrackByTrack #Album', cta: 'Guess Track 2 in comments' },
            { day: 3, platform: 'Instagram Story', type: 'Mood Board', time: '8:00 PM', copy: `Three words that describe ${d.title}:`, hashtags: '#MoodBoard #Aesthetic', cta: 'Reply with YOUR three words' },
            { day: 4, platform: 'YouTube / TikTok', type: 'Trailer / Snippet', time: '5:00 PM', copy: `${d.title} — 30 seconds that will make you pre-save.`, hashtags: '#Trailer #Snippet', cta: 'Pre-save link in bio' },
            { day: 5, platform: 'All Platforms', type: 'Drop Day', time: '9:00 AM', copy: `${d.title} IS OUT NOW.\n\nEvery platform. Everywhere.`, hashtags: '#AlbumOutNow #StreamNow', cta: 'Run it up — link in bio' }
        ],
        engagement: (d) => [
            { day: 1, platform: 'Instagram / X', type: 'Favorite Track Poll', time: '5:00 PM', copy: `What’s your favorite track on ${d.title} so far?`, hashtags: '#Poll #FavoriteTrack', cta: 'Vote & debate in comments' },
            { day: 2, platform: 'TikTok / Reels', type: 'Rank Challenge', time: '12:00 PM', copy: `Rank the tracks on ${d.title} from best to worst.\n\nI’ll start.`, hashtags: '#Rank #Challenge', cta: 'Stitch your ranking' },
            { day: 3, platform: 'Instagram Story', type: 'Q&A', time: '8:00 PM', copy: `Ask me anything about ${d.title}.\n\nProduction, lyrics, meaning — go.`, hashtags: '#AMA #AskMeAnything', cta: 'Reply with your question' },
            { day: 4, platform: 'TikTok / Reels', type: 'Reaction Compilation', time: '11:00 AM', copy: `The best reactions to ${d.title} so far…`, hashtags: '#Reaction #Compilation', cta: 'Tag me in yours' },
            { day: 5, platform: 'All Platforms', type: 'Fan Art / UGC', time: '7:00 PM', copy: `The art y’all made for ${d.title} is insane.\n\nHere are my favorites.`, hashtags: '#FanArt #UGC', cta: 'Keep creating — I’m reposting' }
        ],
        conversion: (d) => [
            { day: 1, platform: 'Instagram / X', type: 'Pre-Order / Pre-Save', time: '5:00 PM', copy: `${d.title} drops ${d.date || 'soon'}.\n\nPre-save now and get early access to [bonus].`, hashtags: '#PreSave #PreOrder', cta: 'Link in bio — takes 10 seconds' },
            { day: 2, platform: 'Instagram Story', type: 'Limited Offer', time: '8:00 PM', copy: `First 100 people to save ${d.title} get [reward].`, hashtags: '#Limited #SaveNow', cta: 'Screenshot your save & DM me' },
            { day: 3, platform: 'TikTok / Reels', type: 'Value Stack', time: '12:00 PM', copy: `${d.title} isn’t just music. It’s [merch/experience/bonus] too.`, hashtags: '#Bundle #Value', cta: 'Link in bio for everything' },
            { day: 4, platform: 'All Platforms', type: 'Social Proof', time: '6:00 PM', copy: `${d.title} just hit [X] pre-saves.\n\nY’all are different. Thank you.`, hashtags: '#Grateful #Numbers', cta: 'Still haven’t? Link in bio' },
            { day: 5, platform: 'All Platforms', type: 'FOMO Close', time: '9:00 PM', copy: `Last call before ${d.title} drops.\n\nThe train is leaving.`, hashtags: '#LastChance #FOMO', cta: 'Link in bio — now or never' }
        ],
        retention: (d) => [
            { day: 1, platform: 'Instagram Story', type: 'Deep Dive', time: '6:00 PM', copy: `The story behind Track 3 on ${d.title}…`, hashtags: '#Storytime #BehindTheMusic', cta: 'Reply for more track stories' },
            { day: 2, platform: 'YouTube / TikTok', type: 'Live Performance', time: '8:00 PM', copy: `${d.title} — live and unplugged.`, hashtags: '#Live #Unplugged', cta: 'Comment which track next' },
            { day: 3, platform: 'Instagram / X', type: 'Easter Eggs', time: '5:00 PM', copy: `There are 3 easter eggs hidden in ${d.title}.\n\nNobody has found all of them yet.`, hashtags: '#EasterEgg #Hidden', cta: 'Found one? Comment the timestamp' },
            { day: 4, platform: 'TikTok / Reels', type: 'Process Reveal', time: '11:00 AM', copy: `${d.title} took [X months/years]. Here’s the timeline.`, hashtags: '#Process #Journey', cta: 'Follow for the full documentary' },
            { day: 5, platform: 'All Platforms', type: 'Community', time: '7:00 PM', copy: `${d.title} wouldn’t exist without y’all.\n\nThe next one is already cooking because of you.`, hashtags: '#Community #ThankYou', cta: 'Turn on notifications for the next drop' }
        ],
        crosspromo: (d) => [
            { day: 1, platform: 'Instagram / X', type: 'Platform Exclusive', time: '5:00 PM', copy: `The deluxe version of ${d.title} is only on ${d.platform || 'my page'}.`, hashtags: '#Deluxe #Exclusive', cta: 'Link in bio — you’re missing out' },
            { day: 2, platform: 'TikTok / Reels', type: 'Why Move', time: '12:00 PM', copy: `I post stuff on ${d.platform || 'my page'} that never makes it here.`, hashtags: '#ExclusiveContent', cta: 'Link in bio — join the real community' },
            { day: 3, platform: 'Instagram Story', type: 'Countdown', time: '8:00 PM', copy: `Something big drops on ${d.platform || 'my page'} first.\n\nAlways.`, hashtags: '#FirstLook', cta: 'Tap the link & turn on alerts' },
            { day: 4, platform: 'All Platforms', type: 'Proof', time: '11:00 AM', copy: `${d.platform || 'Page'} followers heard ${d.title} 2 weeks early.\n\nDon’t be late next time.`, hashtags: '#EarlyAccess #OGArtist', cta: 'Link in bio — never miss again' },
            { day: 5, platform: 'All Platforms', type: 'Community Migration', time: '7:00 PM', copy: `The real conversation about ${d.title} is happening on ${d.platform || 'my page'}.\n\nNot here.`, hashtags: '#RealTalk #Community', cta: 'Link in bio — pull up' }
        ]
    },
    video: {
        awareness: (d) => [
            { day: 1, platform: 'Instagram / X', type: 'Thumbnail Tease', time: '6:00 PM', copy: `New video drops ${d.date || 'soon'}.\n\nHere’s a frame you haven’t seen.`, hashtags: '#VideoDrop #Premiere', cta: 'Guess the concept in comments' },
            { day: 2, platform: 'TikTok / Reels', type: 'Behind the Scenes', time: '12:00 PM', copy: `The ${d.title} video almost didn’t happen. Here’s why…`, hashtags: '#BTS #VideoProduction', cta: 'Follow for the full story' },
            { day: 3, platform: 'YouTube / Instagram', type: 'Premiere Link', time: '5:00 PM', copy: `${d.title} premieres ${d.date || 'soon'}.\n\nSet your reminder.`, hashtags: '#Premiere #SetReminder', cta: 'Link in bio — don’t miss it' },
            { day: 4, platform: 'Instagram Story', type: 'Countdown', time: '8:00 PM', copy: `⏰ ${d.title} goes live in 24 hours.`, hashtags: '#Countdown #Premiere', cta: 'Turn on post notifications' },
            { day: 5, platform: 'All Platforms', type: 'LIVE', time: '12:00 PM', copy: `${d.title} IS LIVE NOW.\n\nGo watch. Comment. Share.`, hashtags: '#OutNow #WatchNow', cta: 'Link in bio — run it up' }
        ],
        engagement: (d) => [
            { day: 1, platform: 'YouTube / TikTok', type: 'Comment Bait', time: '12:00 PM', copy: `The part of ${d.title} that broke the internet…`, hashtags: '#ViralMoment #CommentBait', cta: 'Comment the timestamp that got you' },
            { day: 2, platform: 'Instagram / X', type: 'Poll', time: '6:00 PM', copy: `Favorite scene from ${d.title}?`, hashtags: '#Poll #FavoriteScene', cta: 'Vote & debate below' },
            { day: 3, platform: 'TikTok / Reels', type: 'Reaction Stitch', time: '11:00 AM', copy: `React to ${d.title} and I’ll feature the best ones.`, hashtags: '#Reaction #Stitch', cta: 'Use the sound & show your face' },
            { day: 4, platform: 'Instagram Story', type: 'Q&A', time: '8:00 PM', copy: `Ask me anything about the ${d.title} video.`, hashtags: '#AMA #BehindTheVideo', cta: 'Reply with your question' },
            { day: 5, platform: 'All Platforms', type: 'UGC Repost', time: '7:00 PM', copy: `The memes from ${d.title} are undefeated.`, hashtags: '#Meme #UGC', cta: 'Tag me in your favorites' }
        ],
        conversion: (d) => [
            { day: 1, platform: 'YouTube / Instagram', type: 'Direct Push', time: '5:00 PM', copy: `${d.title} is live.\n\nWatch, like, subscribe. It all helps.`, hashtags: '#WatchNow #Subscribe', cta: 'Link in bio' },
            { day: 2, platform: 'Instagram Story', type: 'Swipe Up', time: '8:00 PM', copy: `Running up the views on ${d.title}.`, hashtags: '#Views #RunItUp', cta: 'Tap the link — rewatch helps the algorithm' },
            { day: 3, platform: 'TikTok / Reels', type: 'FOMO', time: '12:00 PM', copy: `Everyone is talking about ${d.title}.\n\nHave you seen it yet?`, hashtags: '#FOMO #Trending', cta: 'Link in bio — catch up' },
            { day: 4, platform: 'All Platforms', type: 'Milestone', time: '6:00 PM', copy: `${d.title} just hit [X] views.\n\nNext milestone: [Y]. Let’s get there.`, hashtags: '#Milestone #Growth', cta: 'Link in bio — one more view' },
            { day: 5, platform: 'All Platforms', type: 'Thank You / Next', time: '9:00 PM', copy: `${d.title} went crazy because of y’all.\n\nThe next video is already filmed.`, hashtags: '#ThankYou #NextUp', cta: 'Subscribe so you don’t miss it' }
        ],
        retention: (d) => [
            { day: 1, platform: 'YouTube / TikTok', type: 'Deep Dive', time: '6:00 PM', copy: `Easter eggs in ${d.title} that you definitely missed.`, hashtags: '#EasterEgg #Breakdown', cta: 'Comment how many you caught' },
            { day: 2, platform: 'Instagram / X', type: 'Director’s Commentary', time: '8:00 PM', copy: `Why I shot ${d.title} this way. The real story.`, hashtags: '#Director #Commentary', cta: 'Reply for Part 2' },
            { day: 3, platform: 'TikTok / Reels', type: 'Alternate Cut', time: '12:00 PM', copy: `The ${d.title} scene that got cut. Should I release it?`, hashtags: '#DeletedScene #Extended', cta: 'Comment YES' },
            { day: 4, platform: 'Instagram Story', type: 'Community', time: '5:00 PM', copy: `Your theories about ${d.title} are wild. Here are my favorites.`, hashtags: '#Theory #Community', cta: 'Drop your theory — I’m reading' },
            { day: 5, platform: 'All Platforms', type: 'Next Tease', time: '7:00 PM', copy: `${d.title} was just the beginning.\n\nWait until you see what’s next.`, hashtags: '#Teaser #ComingSoon', cta: 'Turn on notifications' }
        ],
        crosspromo: (d) => [
            { day: 1, platform: 'Instagram / X', type: 'Platform Jump', time: '5:00 PM', copy: `The extended cut of ${d.title} is only on ${d.platform || 'my page'}.`, hashtags: '#ExtendedCut #Exclusive', cta: 'Link in bio' },
            { day: 2, platform: 'TikTok / Reels', type: 'Why Follow', time: '12:00 PM', copy: `I drop video extras on ${d.platform || 'my page'} that never go here.`, hashtags: '#Exclusive #Bonus', cta: 'Link in bio — join' },
            { day: 3, platform: 'Instagram Story', type: 'Early Access', time: '8:00 PM', copy: `${d.platform || 'My page'} saw ${d.title} before anyone else.`, hashtags: '#First #EarlyAccess', cta: 'Tap the link — never be late again' },
            { day: 4, platform: 'All Platforms', type: 'Proof', time: '11:00 AM', copy: `${d.platform || 'Page'} community gets the director’s cut. Always.`, hashtags: '#DirectorCut #OG', cta: 'Link in bio — pull up' },
            { day: 5, platform: 'All Platforms', type: 'Migration', time: '7:00 PM', copy: `The real ${d.title} discussion is on ${d.platform || 'my page'}.\n\nNot here.`, hashtags: '#RealTalk #Community', cta: 'Link in bio' }
        ]
    },
    playlist: {
        awareness: (d) => [
            { day: 1, platform: 'Instagram / X', type: 'Playlist Reveal', time: '6:00 PM', copy: `New playlist: ${d.title}\n\nThe vibe: [describe]\n\n${d.url ? 'Link in bio.' : ''}`, hashtags: '#Playlist #NewVibes', cta: 'Save this playlist' },
            { day: 2, platform: 'TikTok / Reels', type: 'Track Preview', time: '12:00 PM', copy: `Track 1 from ${d.title} — this sets the mood.`, hashtags: '#PlaylistPreview #VibeCheck', cta: 'Follow for the full tracklist reveal' },
            { day: 3, platform: 'Instagram Story', type: 'Mood Board', time: '8:00 PM', copy: `${d.title} in 3 colors:`, hashtags: '#MoodBoard #Aesthetic', cta: 'Screenshot your vibe' },
            { day: 4, platform: 'All Platforms', type: 'Update Push', time: '5:00 PM', copy: `Just updated ${d.title} with [X] new tracks.\n\nFresh rotation.`, hashtags: '#Updated #Fresh', cta: 'Link in bio — run it' },
            { day: 5, platform: 'All Platforms', type: 'Follow Drive', time: '9:00 AM', copy: `${d.title} is growing fast.\n\nBe part of it before it blows up.`, hashtags: '#PlaylistGrowth #BeforeItBlows', cta: 'Follow & save — link in bio' }
        ],
        engagement: (d) => [
            { day: 1, platform: 'Instagram / X', type: 'Song Request', time: '5:00 PM', copy: `What song needs to be on ${d.title}?`, hashtags: '#SongRequest #Playlist', cta: 'Drop your suggestion below' },
            { day: 2, platform: 'TikTok / Reels', type: 'Reaction', time: '12:00 PM', copy: `POV: you just discovered ${d.title} and it’s exactly what you needed.`, hashtags: '#Discovery #Vibe', cta: 'Stitch your reaction' },
            { day: 3, platform: 'Instagram Story', type: 'Poll', time: '8:00 PM', copy: `Keep Track 3 or replace it on ${d.title}?`, hashtags: '#Poll #PlaylistCurator', cta: 'Vote now' },
            { day: 4, platform: 'TikTok / Reels', type: 'UGC', time: '11:00 AM', copy: `Y’all have been sharing ${d.title} like crazy.`, hashtags: '#UGC #PlaylistShare', cta: 'Tag me in your story' },
            { day: 5, platform: 'All Platforms', type: 'Community', time: '7:00 PM', copy: `${d.title} is more than a playlist. It’s a community now.`, hashtags: '#Community #PlaylistFam', cta: 'Join — link in bio' }
        ],
        conversion: (d) => [
            { day: 1, platform: 'Instagram / X', type: 'Direct Follow', time: '5:00 PM', copy: `${d.title} — follow & save.\n\nEvery follow pushes this to more people.`, hashtags: '#Follow #Save', cta: 'Link in bio — 2 clicks' },
            { day: 2, platform: 'Instagram Story', type: 'Swipe Up', time: '8:00 PM', copy: `Running up ${d.title} numbers.`, hashtags: '#RunItUp #Playlist', cta: 'Tap the link & follow' },
            { day: 3, platform: 'TikTok / Reels', type: 'FOMO', time: '12:00 PM', copy: `Your friends are already following ${d.title}.\n\nYou’re the only one not in on it.`, hashtags: '#FOMO #JoinNow', cta: 'Link in bio — catch up' },
            { day: 4, platform: 'All Platforms', type: 'Milestone', time: '6:00 PM', copy: `${d.title} just hit [X] followers.\n\nNext stop: [Y].`, hashtags: '#Milestone #Growth', cta: 'Link in bio — be part of it' },
            { day: 5, platform: 'All Platforms', type: 'Exclusive', time: '9:00 PM', copy: `Followers of ${d.title} get early access to my next drop.`, hashtags: '#Exclusive #Perks', cta: 'Link in bio — join the inner circle' }
        ],
        retention: (d) => [
            { day: 1, platform: 'Instagram Story', type: 'Update Schedule', time: '6:00 PM', copy: `${d.title} updates every [Monday/Friday].\n\nSet your reminder.`, hashtags: '#UpdateSchedule #Fresh', cta: 'Turn on post notifications' },
            { day: 2, platform: 'TikTok / Reels', type: 'Curator Story', time: '12:00 PM', copy: `Why I made ${d.title} and why I keep updating it.`, hashtags: '#Storytime #Curator', cta: 'Follow for the journey' },
            { day: 3, platform: 'Instagram / X', type: 'Community Spotlight', time: '5:00 PM', copy: `This follower’s ${d.title} story went viral.`, hashtags: '#Spotlight #Community', cta: 'Tag me — you might be next' },
            { day: 4, platform: 'TikTok / Reels', type: 'Sneak Peek', time: '11:00 AM', copy: `Next ${d.title} update includes [artist/track].`, hashtags: '#SneakPeek #ComingSoon', cta: 'Guess the rest in comments' },
            { day: 5, platform: 'All Platforms', type: 'Thank You', time: '7:00 PM', copy: `${d.title} wouldn’t exist without the people who save & share it.`, hashtags: '#Grateful #PlaylistFam', cta: 'Keep sharing — it compounds' }
        ],
        crosspromo: (d) => [
            { day: 1, platform: 'Instagram / X', type: 'Platform Move', time: '5:00 PM', copy: `${d.title} is also on ${d.platform || 'my page'} — with bonus tracks.`, hashtags: '#Bonus #Exclusive', cta: 'Link in bio' },
            { day: 2, platform: 'TikTok / Reels', type: 'Why Follow', time: '12:00 PM', copy: `${d.platform || 'My page'} gets playlist updates 24 hours early.`, hashtags: '#EarlyAccess #Playlist', cta: 'Link in bio — never miss an update' },
            { day: 3, platform: 'Instagram Story', type: 'Proof', time: '8:00 PM', copy: `${d.platform || 'Page'} followers heard the new ${d.title} update first.`, hashtags: '#FirstListen #OG', cta: 'Tap the link & follow' },
            { day: 4, platform: 'All Platforms', type: 'Migration', time: '11:00 AM', copy: `The real ${d.title} community votes on what gets added next.\n\nOn ${d.platform || 'my page'}.`, hashtags: '#Community #Vote', cta: 'Link in bio — pull up' },
            { day: 5, platform: 'All Platforms', type: 'Results', time: '7:00 PM', copy: `${d.platform || 'Page'} followers grew ${d.title} by [X]% this month.`, hashtags: '#Growth #Community', cta: 'Still not there? Link in bio' }
        ]
    },
    channel: {
        awareness: (d) => [
            { day: 1, platform: 'Instagram / X', type: 'Intro Post', time: '6:00 PM', copy: `If you’re seeing this, you need to be following ${d.title}.\n\nHere’s why…`, hashtags: '#Follow #Discover', cta: 'Link in bio — go now' },
            { day: 2, platform: 'TikTok / Reels', type: 'Best Of', time: '12:00 PM', copy: `The best thing posted on ${d.title} this week:`, hashtags: '#BestOf #Highlight', cta: 'Follow for daily drops' },
            { day: 3, platform: 'Instagram Story', type: 'Countdown', time: '8:00 PM', copy: `Something big drops on ${d.title} ${d.date || 'soon'}.`, hashtags: '#Countdown #BigNews', cta: 'Turn on notifications' },
            { day: 4, platform: 'All Platforms', type: 'Value Prop', time: '5:00 PM', copy: `${d.title} posts [content type] that you won’t find anywhere else.`, hashtags: '#Exclusive #OnlyHere', cta: 'Follow — link in bio' },
            { day: 5, platform: 'All Platforms', type: 'Social Proof', time: '9:00 AM', copy: `${d.title} just hit [X] followers.\n\nThe wave is real.`, hashtags: '#Growth #Wave', cta: 'Join before it explodes — link in bio' }
        ],
        engagement: (d) => [
            { day: 1, platform: 'Instagram / X', type: 'Question', time: '5:00 PM', copy: `What do you want to see on ${d.title} next?`, hashtags: '#Ask #Community', cta: 'Comment below — I’m reading' },
            { day: 2, platform: 'TikTok / Reels', type: 'Challenge', time: '12:00 PM', copy: `Show me your best [related content] and I’ll feature the best on ${d.title}.`, hashtags: '#Challenge #Feature', cta: 'Use the hashtag & tag me' },
            { day: 3, platform: 'Instagram Story', type: 'Poll', time: '8:00 PM', copy: `This or that for ${d.title}?`, hashtags: '#Poll #ThisOrThat', cta: 'Vote & share' },
            { day: 4, platform: 'TikTok / Reels', type: 'Reaction', time: '11:00 AM', copy: `React to ${d.title}’s latest post and I’ll stitch the best ones.`, hashtags: '#Reaction #Stitch', cta: 'Show your face — I’m watching' },
            { day: 5, platform: 'All Platforms', type: 'Community', time: '7:00 PM', copy: `${d.title} followers are different. Here’s the proof.`, hashtags: '#Community #Different', cta: 'Tag me — you might be featured' }
        ],
        conversion: (d) => [
            { day: 1, platform: 'Instagram / X', type: 'Direct Follow', time: '5:00 PM', copy: `${d.title} — follow now.\n\nEvery follow tells the algorithm to push this harder.`, hashtags: '#Follow #Algorithm', cta: 'Link in bio — one click' },
            { day: 2, platform: 'Instagram Story', type: 'Swipe Up', time: '8:00 PM', copy: `Running up ${d.title}.`, hashtags: '#RunItUp #Follow', cta: 'Tap the link' },
            { day: 3, platform: 'TikTok / Reels', type: 'FOMO', time: '12:00 PM', copy: `Your friends already follow ${d.title}.\n\nYou’re missing the conversation.`, hashtags: '#FOMO #MissingOut', cta: 'Link in bio — catch up' },
            { day: 4, platform: 'All Platforms', type: 'Milestone', time: '6:00 PM', copy: `${d.title} just hit [X].\n\nNext stop: [Y]. Let’s get there together.`, hashtags: '#Milestone #Together', cta: 'Link in bio — be part of it' },
            { day: 5, platform: 'All Platforms', type: 'Exclusive', time: '9:00 PM', copy: `${d.title} followers get early access to everything I drop.`, hashtags: '#Perks #EarlyAccess', cta: 'Link in bio — join the inner circle' }
        ],
        retention: (d) => [
            { day: 1, platform: 'Instagram Story', type: 'Schedule', time: '6:00 PM', copy: `${d.title} drops every [day] at [time].\n\nSet your alarm.`, hashtags: '#Schedule #Consistent', cta: 'Turn on post notifications' },
            { day: 2, platform: 'TikTok / Reels', type: 'BTS', time: '12:00 PM', copy: `What goes into a ${d.title} post? More than you think.`, hashtags: '#BTS #Process', cta: 'Follow for the full breakdown' },
            { day: 3, platform: 'Instagram / X', type: 'Community Spotlight', time: '5:00 PM', copy: `This ${d.title} follower went viral because of [content].`, hashtags: '#Spotlight #Community', cta: 'Tag me — you might be next' },
            { day: 4, platform: 'TikTok / Reels', type: 'Sneak Peek', time: '11:00 AM', copy: `Next week on ${d.title}:`, hashtags: '#SneakPeek #ComingSoon', cta: 'Guess what’s coming in comments' },
            { day: 5, platform: 'All Platforms', type: 'Thank You', time: '7:00 PM', copy: `${d.title} is what it is because of y’all.\n\nThank you for showing up.`, hashtags: '#Grateful #Community', cta: 'Keep engaging — it matters' }
        ],
        crosspromo: (d) => [
            { day: 1, platform: 'Instagram / X', type: 'Platform Jump', time: '5:00 PM', copy: `${d.title} has a sister page on ${d.platform || 'another platform'}.\n\nDifferent content. Same energy.`, hashtags: '#SisterPage #MoreContent', cta: 'Link in bio — follow both' },
            { day: 2, platform: 'TikTok / Reels', type: 'Why Follow', time: '12:00 PM', copy: `${d.platform || 'My other page'} gets the content that’s too raw for here.`, hashtags: '#Raw #Unfiltered', cta: 'Link in bio — pull up' },
            { day: 3, platform: 'Instagram Story', type: 'Early Access', time: '8:00 PM', copy: `${d.platform || 'My page'} saw it first. Always.`, hashtags: '#First #Always', cta: 'Tap the link — never miss again' },
            { day: 4, platform: 'All Platforms', type: 'Proof', time: '11:00 AM', copy: `${d.platform || 'Page'} followers get the exclusive drops.\n\nEvery time.`, hashtags: '#Exclusive #EveryTime', cta: 'Link in bio — join' },
            { day: 5, platform: 'All Platforms', type: 'Migration', time: '7:00 PM', copy: `The real conversation happens on ${d.platform || 'my page'}.\n\nNot here.`, hashtags: '#RealTalk #Community', cta: 'Link in bio — pull up' }
        ]
    },
    page: {
        awareness: (d) => [
            { day: 1, platform: 'Instagram / X', type: 'Link Push', time: '6:00 PM', copy: `Everything I do lives here: ${d.title}\n\nOne link. All platforms.`, hashtags: '#LinkInBio #AllInOne', cta: 'Tap the link — explore everything' },
            { day: 2, platform: 'TikTok / Reels', type: 'Tour', time: '12:00 PM', copy: `Let me show you around ${d.title}…`, hashtags: '#Tour #Explore', cta: 'Follow the link for the full experience' },
            { day: 3, platform: 'Instagram Story', type: 'Update', time: '8:00 PM', copy: `Just updated ${d.title} with new links.\n\nFresh everything.`, hashtags: '#Updated #FreshLinks', cta: 'Tap through & check it out' },
            { day: 4, platform: 'All Platforms', type: 'Value', time: '5:00 PM', copy: `${d.title} is the fastest way to find everything I’m doing.`, hashtags: '#OneStop #Everything', cta: 'Save the link — you’ll need it' },
            { day: 5, platform: 'All Platforms', type: 'Social Proof', time: '9:00 AM', copy: `${d.title} just got [X] clicks this week.\n\nY’all are active.`, hashtags: '#Clicks #Active', cta: 'Tap the link — run it up' }
        ],
        engagement: (d) => [
            { day: 1, platform: 'Instagram / X', type: 'Feedback', time: '5:00 PM', copy: `What should I add to ${d.title}?`, hashtags: '#Feedback #BuildTogether', cta: 'Comment your ideas' },
            { day: 2, platform: 'TikTok / Reels', type: 'Reaction', time: '12:00 PM', copy: `React to ${d.title} and I’ll feature the best takes.`, hashtags: '#Reaction #Feature', cta: 'Stitch this & show your review' },
            { day: 3, platform: 'Instagram Story', type: 'Poll', time: '8:00 PM', copy: `Which link on ${d.title} do you use most?`, hashtags: '#Poll #LinkPage', cta: 'Vote & share' },
            { day: 4, platform: 'TikTok / Reels', type: 'Tutorial', time: '11:00 AM', copy: `How to get the most out of ${d.title}:`, hashtags: '#Tutorial #Tips', cta: 'Follow for more hacks' },
            { day: 5, platform: 'All Platforms', type: 'Community', time: '7:00 PM', copy: `${d.title} is more than links. It’s the hub.`, hashtags: '#Hub #Community', cta: 'Tag someone who needs this' }
        ],
        conversion: (d) => [
            { day: 1, platform: 'Instagram / X', type: 'Direct Click', time: '5:00 PM', copy: `${d.title} — one tap to everything.\n\nWhy go anywhere else?`, hashtags: '#OneTap #Everything', cta: 'Link in bio — tap now' },
            { day: 2, platform: 'Instagram Story', type: 'Swipe Up', time: '8:00 PM', copy: `Running up clicks on ${d.title}.`, hashtags: '#Clicks #RunItUp', cta: 'Tap the link' },
            { day: 3, platform: 'TikTok / Reels', type: 'FOMO', time: '12:00 PM', copy: `You’re missing drops because you don’t have ${d.title} saved.`, hashtags: '#FOMO #SaveIt', cta: 'Link in bio — fix that' },
            { day: 4, platform: 'All Platforms', type: 'Milestone', time: '6:00 PM', copy: `${d.title} just hit [X] clicks.\n\nNext: [Y].`, hashtags: '#Milestone #Growth', cta: 'Tap the link — one more click' },
            { day: 5, platform: 'All Platforms', type: 'Exclusive', time: '9:00 PM', copy: `${d.title} gets updated with exclusive links before anywhere else.`, hashtags: '#Exclusive #First', cta: 'Bookmark it — link in bio' }
        ],
        retention: (d) => [
            { day: 1, platform: 'Instagram Story', type: 'Update Alert', time: '6:00 PM', copy: `${d.title} just got refreshed.\n\nNew links. New content.`, hashtags: '#Updated #Fresh', cta: 'Check it out — link in bio' },
            { day: 2, platform: 'TikTok / Reels', type: 'BTS', time: '12:00 PM', copy: `How I organize ${d.title} — and why it matters.`, hashtags: '#BTS #Organization', cta: 'Follow for the strategy' },
            { day: 3, platform: 'Instagram / X', type: 'Community', time: '5:00 PM', copy: `This fan found something on ${d.title} that even I forgot about.`, hashtags: '#Community #Discovery', cta: 'Explore — link in bio' },
            { day: 4, platform: 'TikTok / Reels', type: 'Sneak Peek', time: '11:00 AM', copy: `Next ${d.title} update includes [new feature/link].`, hashtags: '#SneakPeek #ComingSoon', cta: 'Guess what’s coming' },
            { day: 5, platform: 'All Platforms', type: 'Thank You', time: '7:00 PM', copy: `${d.title} is the most clicked link I have.\n\nBecause of y’all.`, hashtags: '#Grateful #TopLink', cta: 'Keep sharing — it compounds' }
        ],
        crosspromo: (d) => [
            { day: 1, platform: 'Instagram / X', type: 'Platform Hub', time: '5:00 PM', copy: `${d.title} connects everything.\n\n${d.platform || 'All platforms'} in one place.`, hashtags: '#Hub #AllPlatforms', cta: 'Link in bio — bookmark it' },
            { day: 2, platform: 'TikTok / Reels', type: 'Why Save', time: '12:00 PM', copy: `I drop new links on ${d.title} before I post them anywhere.`, hashtags: '#First #Exclusive', cta: 'Save the link — never miss' },
            { day: 3, platform: 'Instagram Story', type: 'Proof', time: '8:00 PM', copy: `${d.platform || 'Page'} traffic comes from ${d.title} first.`, hashtags: '#Traffic #Source', cta: 'Tap the link — see why' },
            { day: 4, platform: 'All Platforms', type: 'Migration', time: '11:00 AM', copy: `Tired of jumping between apps? ${d.title} has everything.`, hashtags: '#OneLink #Everything', cta: 'Link in bio — simplify' },
            { day: 5, platform: 'All Platforms', type: 'Results', time: '7:00 PM', copy: `${d.title} just became my #1 traffic source.\n\nBecause y’all trust it.`, hashtags: '#NumberOne #Trust', cta: 'Still haven’t saved it? Link in bio' }
        ]
    }
};

// ==================== STATE ====================
let currentProfile = null;
let currentId = '';
let currentCampaignId = null;
let currentContentId = null;
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
        contentLibrary: [],
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

function detectPlatform(url) {
    if (!url) return 'other';
    for (const p of PLATFORMS) {
        if (p.pattern.test(url)) return p.id;
    }
    return 'other';
}

function detectContentType(url) {
    if (!url) return 'song';
    if (/track|song|single/i.test(url)) return 'song';
    if (/album|ep/i.test(url)) return 'album';
    if (/playlist/i.test(url)) return 'playlist';
    if (/channel|@|user\/|c\//i.test(url)) return 'channel';
    if (/watch|video|v=/i.test(url)) return 'video';
    return 'song';
}

function buildFileName(category, label, ext) {
    const cat = FILE_CATEGORIES[category] || { ext: 'txt' };
    const artist = sanitizeFileName(currentProfile?.artistName || 'Artist');
    const lbl = sanitizeFileName(label || 'file');
    const date = todayStamp();
    const count = ((currentProfile?.fileLibrary?.filter(f => f.category === category).length || 0) + 1).toString().padStart(2, '0');
    return `${cat.folder}_${count}_${artist}_${lbl}_${date}.${ext || cat.ext}`;
}

// ==================== FILE SYSTEM ====================
function supportsFileSystemAccess() {
    return 'showDirectoryPicker' in window;
}

async function pickSaveDirectory() {
    try {
        fileSystemDirectory = await window.showDirectoryPicker();
        alert('Save folder set! Files will be organized into subfolders automatically.');
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
    currentContentId = null;
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
    if (!currentProfile.contentLibrary) currentProfile.contentLibrary = [];
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

// ==================== CONTENT LIBRARY ====================
function showContentLibrary() {
    renderContentLibrary();
    showView('contentLibraryView');
}

function renderContentLibrary() {
    const list = document.getElementById('contentList');
    const empty = document.getElementById('contentEmpty');
    const items = currentProfile.contentLibrary || [];

    if (items.length === 0) {
        list.innerHTML = '';
        empty.style.display = 'block';
        return;
    }

    empty.style.display = 'none';
    list.innerHTML = '';

    items.slice().reverse().forEach(item => {
        const typeInfo = CONTENT_TYPES.find(t => t.id === item.type) || CONTENT_TYPES[0];
        const platInfo = PLATFORMS.find(p => p.id === item.platform) || PLATFORMS[PLATFORMS.length - 1];
        const card = document.createElement('div');
        card.className = 'content-card';
        card.innerHTML = `
            <div class="content-icon">${typeInfo.icon}</div>
            <div class="content-info" onclick="promoteContent('${item.id}')">
                <div class="content-title">${escapeHtml(item.title)}</div>
                <div class="content-meta">${typeInfo.label} • ${platInfo.label}</div>
            </div>
            <button class="btn btn-danger btn-small" onclick="deleteContent('${item.id}')" style="width:auto;">🗑</button>
        `;
        list.appendChild(card);
    });
}

function showAddContent() {
    document.getElementById('contentTitle').value = '';
    document.getElementById('contentUrl').value = '';
    document.getElementById('contentTypeSelect').value = 'song';
    document.getElementById('contentPlatformSelect').value = 'spotify';
    document.getElementById('contentNotes').value = '';
    showView('addContentView');
}

function parseContentUrl() {
    const url = document.getElementById('contentUrl').value.trim();
    if (!url) return;
    
    const platform = detectPlatform(url);
    const type = detectContentType(url);
    
    document.getElementById('contentPlatformSelect').value = platform;
    document.getElementById('contentTypeSelect').value = type;
    
    // Try to extract title from URL
    let title = '';
    try {
        const urlObj = new URL(normalizeUrl(url));
        const pathParts = urlObj.pathname.split('/').filter(Boolean);
        const lastPart = pathParts[pathParts.length - 1] || '';
        title = decodeURIComponent(lastPart).replace(/-/g, ' ').replace(/_/g, ' ');
        title = title.replace(/\b\w/g, l => l.toUpperCase());
    } catch (e) {}
    
    if (title && !document.getElementById('contentTitle').value.trim()) {
        document.getElementById('contentTitle').value = title;
    }
}

function saveContent() {
    const title = document.getElementById('contentTitle').value.trim();
    const url = normalizeUrl(document.getElementById('contentUrl').value.trim());
    const type = document.getElementById('contentTypeSelect').value;
    const platform = document.getElementById('contentPlatformSelect').value;
    const notes = document.getElementById('contentNotes').value.trim();

    if (!title || !url) {
        alert('Title and URL are required');
        return;
    }

    const item = {
        id: uuid('cnt'),
        title: title,
        url: url,
        type: type,
        platform: platform,
        notes: notes,
        created: new Date().toISOString()
    };

    if (!currentProfile.contentLibrary) currentProfile.contentLibrary = [];
    currentProfile.contentLibrary.push(item);
    saveCurrentProfile();

    const manifestName = buildFileName('bio-assets', 'Content_' + sanitizeFileName(title), 'json');
    const manifestContent = JSON.stringify(item, null, 2);
    addToLibrary({
        id: uuid('f'),
        name: manifestName,
        displayName: `Content: ${title}`,
        category: 'bio-assets',
        created: new Date().toISOString(),
        type: 'application/json',
        size: manifestContent.length
    });
    saveFileOrganized(manifestName, manifestContent, 'application/json', 'bio-assets');

    showContentLibrary();
}

function deleteContent(id) {
    if (!confirm('Delete this content from your library?')) return;
    currentProfile.contentLibrary = currentProfile.contentLibrary.filter(c => c.id !== id);
    saveCurrentProfile();
    renderContentLibrary();
}

function promoteContent(id) {
    currentContentId = id;
    const item = currentProfile.contentLibrary.find(c => c.id === id);
    if (!item) return;

    document.getElementById('campaignContentTitle').textContent = item.title;
    document.getElementById('campaignContentType').textContent = CONTENT_TYPES.find(t => t.id === item.type)?.label || item.type;
    document.getElementById('campaignContentUrl').textContent = item.url;
    document.getElementById('campaignGoal').value = 'awareness';
    
    renderGoalDescriptions();
    showView('promoteContentView');
}

function renderGoalDescriptions() {
    const container = document.getElementById('goalDescriptions');
    container.innerHTML = '';
    Object.entries(CAMPAIGN_GOALS).forEach(([key, goal]) => {
        const div = document.createElement('div');
        div.className = 'goal-card';
        div.innerHTML = `
            <div class="goal-icon">${goal.icon}</div>
            <div class="goal-info">
                <div class="goal-name">${goal.label}</div>
                <div class="goal-desc">${goal.desc}</div>
            </div>
        `;
        div.onclick = () => {
            document.getElementById('campaignGoal').value = key;
            document.querySelectorAll('.goal-card').forEach(c => c.classList.remove('selected'));
            div.classList.add('selected');
        };
        if (key === 'awareness') div.classList.add('selected');
        container.appendChild(div);
    });
}

function generateContentCampaign() {
    const item = currentProfile.contentLibrary.find(c => c.id === currentContentId);
    if (!item) return;

    const goal = document.getElementById('campaignGoal').value;
    const templateSet = CAMPAIGN_TEMPLATES[item.type];
    
    if (!templateSet || !templateSet[goal]) {
        alert('Campaign template not found for this type/goal. Using generic fallback.');
        return;
    }

    const days = templateSet[goal]({
        title: item.title,
        url: item.url,
        platform: PLATFORMS.find(p => p.id === item.platform)?.label || item.platform,
        date: document.getElementById('campaignDate').value || 'soon',
        notes: item.notes
    });

    const campaign = {
        id: uuid('c'),
        title: `${item.title} — ${CAMPAIGN_GOALS[goal].label}`,
        type: CAMPAIGN_GOALS[goal].label,
        contentType: item.type,
        contentId: item.id,
        goal: goal,
        song: item.title,
        date: document.getElementById('campaignDate').value || 'soon',
        created: new Date().toISOString(),
        days: days.map((d, i) => ({ ...d, id: i, done: false }))
    };

    currentProfile.campaigns.push(campaign);
    saveCurrentProfile();

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
    saveFileOrganized(mdName, md, 'text/markdown', 'campaigns');

    openCampaign(campaign.id);
}

function buildCampaignMarkdown(c) {
    let md = `# ${c.title}\n`;
    md += `**Goal:** ${c.type}  \n`;
    md += `**Content:** ${c.song}  \n`;
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
                <div class="campaign-card-title">${escapeHtml(c.title)}</div>
                <div class="campaign-card-meta">${c.type} • ${completed}/${total} done</div>
            </div>
            <span class="campaign-card-arrow">›</span>
        `;
        list.appendChild(card);
    });
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

    const grad = ctx.createLinearGradient(0, 0, size, size);
    grad.addColorStop(0, '#0a0a1a');
    grad.addColorStop(1, '#000000');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);

    ctx.save();
    ctx.globalAlpha = 0.15;
    const glow = ctx.createRadialGradient(size/2, size/2, 100, size/2, size/2, 600);
    glow.addColorStop(0, accent);
    glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, size, size);
    ctx.restore();

    ctx.fillStyle = accent;
    ctx.fillRect(80, 80, size - 160, 8);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 64px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(p.artistName, size/2, 280);

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

    ctx.fillStyle = accent;
    ctx.font = 'bold 72px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText(subtitle, size/2, 780);

    ctx.fillStyle = '#444444';
    ctx.font = '36px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText('McMakeApps', size/2, 980);

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
