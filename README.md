# TextCraft - Premium Text Workspace & Telemetry Analyzer

**TextCraft** is a blazing-fast, feature-dense text workspace designed for authors, editors, developers, and students. Built with **React 18 + Vite**, the application provides real-time casing transformations, offline voice-to-text dictation, customizable text-to-speech readouts, and mathematical readability diagnostics in a gorgeous, fully responsive **glassmorphic design**.

---

## ✨ Features Breakdown

### 🛠️ 1. Text Transformation Utilities
- **Standard Conversions**: Instant casing shifts to `UPPERCASE` and `lowercase`.
- **Typographical Casing**: `Title Case` (caps on every word) and `Sentence Case` (caps on sentence starts).
- **SEO & URLs**: `Slugify URL` (converts strings to clean kebab-case URL safe formats).
- **Encoding/Decoding Suite**: Fully integrated client-side **Base64** and **URL** encoders and decoders.
- **Spacing Cleaner**: Removes multiple spacing layouts in a single click.

### 🎙️ 2. Integrated Speech Center
- **Voice Dictation (Speech-to-Text)**: Standard offline microphone dictation using the Web Speech API, with active pulsing waves when listening.
- **Speech Synthesis Control Console**: Read typed text out loud with configurable voice selector models, pitch sliders, and speed/rate dials.

### 📊 3. Telemetry & Diagnostics
- **Live Counters**: Counts words, characters, non-spaced characters, lines, and paragraphs.
- **Flesch Reading Ease Index**: Runs an offline syllable-counting algorithm to assess reading difficulty levels.
- **Keyword Density Tracker**: Live weight parser analyzing terms to extract the top 5 keywords, mapped on percentage-based progress meters.
- **Draft Session Logs**: LocalStorage draft history logs saving drafts upon clearing, allowing one-click restore.

### 🎨 4. Premium Theme System & Layout
- **Glassmorphic Layout Cards**: Translucent backdrops, indigo neon borders, and shadow gradients.
- **Contrast-Aware Dark Mode**: Highly custom indigo/obsidian dark environment that respects text contrasts.
- **Enterprise Responsiveness**: Fits smoothly across viewports from compact `320px` smartphones up to wide-screen monitors.

---

## 📁 Organized Project Structure

```bash
textcraft/
├── public/                 # Static assets (logo vectors, icons, manifests)
│   ├── favicon.png         # Custom generated purple sheet branding logo
│   └── site.webmanifest
├── src/
│   ├── assets/             # Raw vector illustrations
│   │   └── logo.svg
│   ├── components/         # Reusable UI fragments
│   │   ├── Navbar.jsx      # Sticky navbar with moon/sun toggle
│   │   └── Alert.jsx       # Floating absolute-positioned toast notifications
│   ├── pages/              # Main page controllers
│   │   ├── Home.jsx        # Split-screen text analyzer dashboard
│   │   └── About.jsx       # Custom animated grid feature board
│   ├── styles/             # Modular style sheets
│   │   ├── index.css       # Core theme variables, buttons, scrollbars
│   │   └── App.css         # Animations, toast nodes, dictation waves
│   ├── App.jsx             # Core entry router and theme hooks
│   └── index.jsx           # ReactDOM application mounting hook
├── index.html              # Modular entry template link (Vite standard)
├── vite.config.js          # Fast React compilation config
└── package.json            # Vite configurations and dependencies
```

---

## 🚀 Available Development Scripts

In the project root directory, you can execute the following commands in your shell:

### `npm run dev`
Launches the hot-reloading development server.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm run build`
Compiles and bundles the entire application for production into the `dist/` directory.\
It utilizes Vite's Rollup configuration to minify assets and separate CSS files under **560ms**.

### `npm run preview`
Runs a production build preview server locally, helping you inspect bundled assets on port `3000`.

---

## 🔒 Privacy & Serverless Design
All calculations, casing encoders, syllable algorithms, voice recognition scripts, and drafts logs run **entirely client-side inside your browser sandbox**. No keystrokes, texts, or recordings are ever shared or transmitted over external networks. TextCraft is highly secure and fully private.
