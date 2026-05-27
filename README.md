# 🌌 SkyPak — The Celestial Gateway for Pakistan 🇵🇰

[![React](https://img.shields.io/badge/React-19.0-blue?logo=react&logoColor=white&color=087ea4)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript&logoColor=white&color=3178c6)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-purple?logo=vite&logoColor=white&color=646cff)](https://vite.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38bdf8?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Gemini AI](https://img.shields.io/badge/Gemini_AI-Google_Gen_AI-orange?logo=google-gemini&logoColor=white&color=ea4335)](https://ai.google.dev/)

An advanced, responsive, and aesthetically stunning stargazing assistant and astronomy web suite, custom-tailored for the geographic coordinates, local time zones (PKT), and light pollution realities of Pakistan.

---

## ✨ Features

SkyPak offers a suite of highly-interactive tools powered by real-time orbital calculations and generative AI:

### 1. 🌌 Cosmic Dashboard
*   **City-Specific Metrics:** Track live coordinates, time, and sky condition metrics for major Pakistani cities (Karachi, Lahore, Islamabad, Peshawar, Quetta, Multan, Faisalabad, and Rawalpindi).
*   **Bortle Scale Integration:** Displays real-time light pollution classifications (from Low/Bortle 4 up to High/Bortle 8) helping users determine stargazing quality.
*   **Celestial Tracking:** Immediate altitude, azimuth, and visibility state of the Sun, Moon, and active planets.

### 2. 🗺️ Interactive Sky Map
*   A fluid, beautifully styled real-time rendering of constellations, bright stars, and deep-sky objects (DSOs) visible in the night sky above Pakistan at any given moment.
*   Distinguishes celestial types with distinct color codes (e.g., Nebulae in magenta, Galaxies in cyan, and Clusters in green).

### 3. 📅 Astronomy Calendar
*   **Event Predictor:** Solar & Lunar eclipses calculated with precise local start, peak, and end times.
*   **Moon Phases:** Track Moon phases (New Moon, Quarter Moon, Full Moon) with exact illumination levels.
*   **Meteor Showers:** Dynamic visibility and ZHR (Zenithal Hourly Rate) tracker for annual meteor showers like the Perseids and Geminids, automatically accounting for lunar brightness interference.

### 4. 🔭 "Can I See It?" Visibility Engine
*   Mathematical evaluation of stargazing probability for iconic constellations and deep-sky objects from your selected city.
*   Calculates real-time atmospheric altitude, azimuth, and Moon interference to deliver active ratings (`Excellent`, `Good`, `Poor`).

### 5. 🧭 Tactical Alignment Compass
*   An interactive, responsive compass designed to map astronomical azimuth and altitude onto physical vectors. Helps stargazers accurately locate targets in the sky.

### 6. 🗺️ Dark Sky Explorer
*   A curated database of pristine dark sky reserves and low-light pollution sanctuaries across Pakistan (from the coastal regions of Balochistan to the high-altitude peaks of the Karakoram).

### 7. 💬 AI Chat Assistant (SkyPak Assistant)
*   **Powered by Gemini:** Integrates `@google/genai` to offer localized stargazing advice, historical astro-knowledge, and telescope guidance.
*   **Bilingual & Context-Aware:** Fully supports English and Urdu (`اردو`). Automatically tracks your selected city, current time, and local sky conditions to provide customized stargazing plans.

---

## 🛠️ Technology Stack

*   **Frontend Library:** React 19 (Functional components, Context API, custom hooks)
*   **Language:** TypeScript (Fully typed interfaces for `AstroEvent`, `City`, `DarkSkySite`)
*   **Build Pipeline:** Vite 6 + ES Modules
*   **Styling & UI:** Tailwind CSS v4 + custom CSS effects (glassmorphism, radial stars, cosmic glow)
*   **Animations:** `motion` (Framer Motion / Motion One) for hardware-accelerated, high-fidelity micro-interactions
*   **Calculations Engine:** `astronomy-engine` (High-precision Keplerian orbital and eclipse calculations)
*   **AI SDK:** `@google/genai` (Official Google Gen AI SDK utilizing the latest Gemini models)
*   **Utility Libraries:** `date-fns` & `date-fns-tz` for timezone handling (`Asia/Karachi` time calculations)

---

## 📂 Project Structure

```bash
SkyPak/
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── ChatAssistant.tsx  # Gemini-powered chat UI (bilingual, context-aware)
│   │   ├── CityOrb.tsx        # Dynamic 3D-feeling city selector and pollution guide
│   │   ├── Nav.tsx            # Animated navigation header
│   │   └── StarField.tsx      # Procedural starry background animation
│   ├── pages/           # Feature-rich modular view components
│   │   ├── Dashboard.tsx      # Localized sky status & core statistics
│   │   ├── Calendar.tsx       # Eclipses, Moon phases, and meteor showers
│   │   ├── SkyMap.tsx         # Real-time interactive sky plotter
│   │   ├── CanISeeIt.tsx      # Visibility calculations and object lists
│   │   ├── Compass.tsx        # Celestial vector positioning tool
│   │   └── DarkSkyExplorer.tsx# Bortle guide to Pakistani stargazing sanctuaries
│   ├── services/        # Third-party integrations & computations
│   │   ├── astronomyService.ts# Core astronomical calculations (via astronomy-engine)
│   │   └── geminiService.ts   # Gemini AI API connector and system prompt
│   ├── data/            # Static databases
│   │   ├── stars.ts           # Bright star database (RA/Dec coordinates)
│   │   └── dso.ts             # Messier/Deep-sky object catalog
│   ├── App.tsx          # Application shell & Global context provider
│   ├── index.css        # Core custom animations, fonts, and dark space variables
│   ├── main.tsx         # Root mounting configuration
│   ├── types.ts         # Central TypeScript interfaces
│   └── constants.ts     # Meteorological data & geographic constants for Pakistan
├── index.html           # Document entrypoint
├── package.json         # Dependency manifest
├── tsconfig.json        # TypeScript configuration
├── vite.config.ts       # Vite compilation settings
└── .gitignore           # Version control exemptions
```

---

## 🚀 Getting Started

### Prerequisites

*   [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
*   An active Google Gemini API Key (obtained from [Google AI Studio](https://aistudio.google.com/))

### Installation

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/your-username/skypak.git
    cd skypak
    ```

2.  **Install Project Dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env.local` file in the root directory and append your Gemini API key:
    ```env
    GEMINI_API_KEY=your_actual_gemini_api_key_here
    ```

4.  **Launch the Development Server:**
    ```bash
    npm run dev
    ```
    *The application will boot on `http://localhost:3000`.*

5.  **Compile Production Build:**
    To build the highly-optimized production bundle, run:
    ```bash
    npm run build
    ```

---

## 🌌 Stargazing Regions Covered (Dark Sky Explorer)

SkyPak catalogs and guides users to several legendary stargazing spots within Pakistan's provinces:
*   **Deosai National Park** (Gilgit-Baltistan) — Bortle Class 1 (Pristine Dark Sky)
*   **Gorakh Hill** (Sindh) — Bortle Class 3 (Rural Sky)
*   **Hingol National Park** (Balochistan) — Bortle Class 2 (Typical Dark Sky)
*   **Kalash Valleys** (Khyber Pakhtunkhwa) — Bortle Class 2 (Typical Dark Sky)
*   **Cholistan Desert** (Punjab) — Bortle Class 3 (Rural Sky)

---

## 🤝 Contribution & License

Contributions, bug reports, and feature requests are welcome! Feel free to open issues or submit pull requests to enhance the stargazing experience for the Pakistani astronomy community.

*Designed with ❤️ for the dreamers, students, and stargazers of Pakistan.*
