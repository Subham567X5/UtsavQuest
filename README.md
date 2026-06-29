# UtsavQuest (উৎসবকোয়েস্ট) 🎈✨

**UtsavQuest** is a premium, interactive, gamified birthday greeting and celebration platform designed to transform traditional wishes into a magical, immersive journey. It offers a multilingual experience (English & Bengali) complete with games, customizable instruments, responsive physics-based elements, interactive quizzes, and personalized wishing portals.

---

## 👑 Creator & CEO
* **Founder, CEO & Lead Developer**: **Subham Ghorai**
* **Project Name**: UtsavQuest (উৎসবকোয়েস্ট)

---

## 🌟 Key Features

### 1. ⚙️ Creator Suite & Customizer
* **Custom Link Generator**: Creators can input the recipient's name, relation (Sister, Friend, etc.), custom messages, and pick an unlock countdown time.
* **Instant Sharing**: Generates a shareable URL containing encoded URL parameters to safely transfer custom configs.
* **Polaroid Frame**: Drag and drop or upload a real photo directly into the vintage Polaroid picture slot with a gorgeous aesthetic outline.

### 2. 🇧🇩 Multilingual Support (English & Bengali)
* Full translation of all UI controls, guidelines, game steps, prompts, and titles into highly localized, poetic Bengali and English.

### 3. 🎮 Gamified Birthday Quest
Recipients play through interactive stages to unlock their Grand Birthday Scroll:
* **Stage 1 — Instrument Composer & Rhythm Pad**: Play beats with multi-instrument support (Musicbox, Piano, Flute) and toggles for automatic drum backings.
* **Stage 2 — Balloon Pop Blessing Collector**: Pop colorful floating balloons to gather sweet, heartwarming blessings and positive wishes.
* **Stage 3 — Blessing Catcher Arcade**: Move a basket left and right to catch incoming falling Hearts, Gifts, and Flowers while dodging storm clouds of Worries.
* **Stage 4 — Candle Blowing & Interactive Cake Cutting**: Blow virtual candles, slice the digital birthday cake, and experience the grand transition.

### 4. 📜 Grand Wishing Scroll & Secret Letter
* **Wax-Sealed envelope**: Recipients break a virtual wax-sealed letter to read the private customized message.
* **Trivia Quiz**: Custom 3-question trivia challenge dynamically generated based on the chosen relation.
* **Memory Wish Wall**: A gorgeous board of colorful interactive sticky notes where family and friends can pin heartwarming memories and prayers.

---

## 🛠️ Tech Stack

* **Frontend Framework**: React 18 with TypeScript
* **Build Tool**: Vite
* **Styling & Theme**: Tailwind CSS (Cosmic Twilight & Slate Palette)
* **Animations**: Framer Motion (`motion/react`)
* **Icons**: Lucide React
* **Hosting Integration**: Pre-optimized for instant deployment and persistent responsive performance on standard containers.

---

## 📁 Directory Structure

```text
├── src/
│   ├── components/            # Modular custom UI components
│   │   ├── BalloonGame.tsx    # Stage 2: Balloon popping physics
│   │   ├── BlessingCatcher.ts # Stage 3: Basket-catching arcade game
│   │   ├── CakeScreen.tsx     # Stage 4: Interactive candle blowing & cake cutting
│   │   ├── MemoryWall.tsx     # Custom interactive Sticky-Note Memory Wall
│   │   ├── SisterQuiz.tsx     # Trivia Quiz Module based on relations
│   │   ├── PolaroidUpload.tsx # Drag-and-drop vintage photograph frame
│   │   ├── DrumPad.tsx        # Stage 1: Beat-maker/composer rhythm section
│   │   ├── SecretMessageArea  # Wax-sealed envelope & letter reveal
│   │   └── UtsavQuestLogo.tsx # High-end modern branded SVG vector logo
│   ├── utils/
│   │   └── translations.ts    # Comprehensive EN/BN localization dictionaries
│   ├── App.tsx                # Central game engine, router, and UI state manager
│   ├── main.tsx               # Primary Entry Point
│   └── index.css              # Global styles & custom typography imports
├── metadata.json              # Applet metadata and permissions
└── package.json               # Package declarations and scripts
```

---

## 🚀 Getting Started

### Prerequisites
* **Node.js** (v18 or higher recommended)
* **npm**

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/utsavquest.git
   cd utsavquest
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Build for production:
   ```bash
   npm run build
   ```

---

## 🎨 Visual Identity & Styling
UtsavQuest features an **Aesthetic Cosmic Violet and Twilight Slate Theme** using deep rich gradients, sparkling particle overlays, gold accents, soft glassmorphic panels, and cursive display typography, guaranteeing a premium feel.

---

<p align="center">
  Made with 💖 by <b>Subham Ghorai</b>
</p>
