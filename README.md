# SportyNova 1.0

Premium 3D Neon responsive Live TV & Sports streaming web app.

## Included
- Responsive mobile-first interface with neon 3D hero design
- Separate Live TV and Live Sports tabs
- Search and category filter
- HLS/M3U8 playback using hls.js, native HLS where available
- MPEG-DASH/MPD playback using dash.js
- 2 configurable TV server buttons and 4 configurable sports server buttons
- Landscape-friendly player layout
- JSON-based content configuration

## Add your own authorized streams
Edit:
- `data/channels.json` for TV channels
- `data/matches.json` for sports events

Each item contains a `servers` array. Example:
```json
{
  "name": "Example Channel",
  "category": "News",
  "logo": "https://example.com/logo.png",
  "status": "LIVE",
  "servers": [
    {"name": "Server 1", "url": "https://your-authorized-host/stream.m3u8"},
    {"name": "Server 2", "url": ""}
  ]
}
```
Only use streams you own or are authorized to distribute. Some hosts block browser playback unless they permit cross-origin (CORS) requests. This app does not bypass access controls, DRM, referrer restrictions, or geo-restrictions.

## Publish with GitHub Pages
1. Create a new public repository named `SportyNova-1.0` (or another name).
2. Upload all files and folders from this ZIP. `index.html` must be at the repository root.
3. Open repository **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select branch **main** and folder **/(root)**, then Save.
6. Wait for GitHub Pages to publish; open the URL shown in Settings → Pages.

## Update from mobile
When changing JSON, keep valid JSON syntax (double quotes, commas, square brackets). Commit changes after editing.
