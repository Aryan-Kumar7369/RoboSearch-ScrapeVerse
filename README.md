# RoboSearch India
### Hardware Procurement and Smart BOM Optimizer for Indian Makers

**Built for the Wemakedevs "Into the Scrape-Verse" Hackathon**  
*Powered by Bright Data Scraper Studio & Web Unlocker*

🌐 **Live Demo:** [https://robosearch-scrape-verse.vercel.app/](https://robosearch-scrape-verse.vercel.app/)  
📂 **GitHub Repository:** [https://github.com/Aryan-Kumar7369/RoboSearch-ScrapeVerse](https://github.com/Aryan-Kumar7369/RoboSearch-ScrapeVerse)

---

## 1. The Problem

Building robotics hardware in India usually means buying parts across multiple websites like **Robu.in, Flyrobo, ElectronicsComp, and Amazon.in**. Anyone building hardware prototypes regularly faces three problems:

1. **Frequent Stockouts & Price Jumps:** Key parts like the ESP32, Raspberry Pi, or motor drivers frequently go out of stock or have inflated prices depending on the seller.
2. **The Split-Shipping Trap:** Buying each component from the cheapest seller means paying separate shipping fees across 3 or 4 different sites, which often costs more than buying everything from one place.
3. **Broken Scrapers:** Regional e-commerce websites often change their layouts or block basic bots, causing traditional scrapers to fail constantly.

---

## 2. What RoboSearch India Does

RoboSearch India brings Indian robotics parts into a single, clean dashboard:
* **Tracks Live Prices and Stock:** Compares prices in INR, checks availability, and verifies core specs across multiple Indian distributors.
* **Smart BOM (Bill of Materials) Cart:** Calculates the true total cost of an entire parts list by comparing split orders against consolidated single-store orders to save on delivery fees.
* **Built on Resilient Scraping:** Uses Bright Data Scraper Studio with automated discovery, extraction, and self-healing features so data keeps flowing even if website layouts change.

---

## 3. How Bright Data Scraper Studio Powers the Pipeline

Instead of writing fragile custom scrapers, I split the workflow in **Bright Data Scraper Studio** into two connected stages:

```text
[User Search Query / Target Component]
                  │
                  ▼
┌────────────────────────────────────────────────────────┐
│ Stage 1: Discovery Stage (Collector)                   │
│ • Searches target distributor using query parameters   │
│ • Uses Web Unlocker to bypass anti-bot challenges       │
│ • Extracts the verified top product page link          │
└─────────────────────────┬──────────────────────────────┘
                          │ (Product URL)
                          ▼
┌────────────────────────────────────────────────────────┐
│ Stage 2: Extraction Stage (Collector)                  │
│ • Navigates directly to the target product page        │
│ • Extracts Price (INR), Stock Status, and Specs        │
│ • Formats clean JSON data ready for the frontend       │
└─────────────────────────┬──────────────────────────────┘
                          │
                          ▼
┌────────────────────────────────────────────────────────┐
│ Self-Healing Layer (`bdata scraper heal`)              │
│ • Recalibrates broken CSS selectors automatically      │
│ • Prevents pipeline downtime when site DOMs change     │
└────────────────────────────────────────────────────────┘
```

### Why Bright Data Was Used:
* **Two-Stage Workflow:** Keeps discovery search and deep-page extraction separate, which saves bandwidth and runs faster.
* **Web Unlocker:** Bypasses rate limits and bot challenges on Indian distributor platforms reliably.
* **Self-Healing Selectors:** When a store modifies its HTML structure, `bdata scraper heal` detects the shift and updates selectors without needing code changes in our app.

---

## 4. Key Features

### 1. Live Price & Stock Comparison
* Real-time pricing in INR and stock flags across Robu, Flyrobo, ElectronicsComp, and Amazon India.
* Technical specification previews (voltage, torque, clock speeds) to verify parts before ordering.

### 2. Smart Multi-Store BOM Cart
* Add a full hardware kit (Microcontroller + Motor + Sensor) to the cart.
* Compares two clear purchasing routes:
  * **Route A (Cheapest Items):** Lowest component prices combined with split shipping costs.
  * **Route B (Single Store):** All items sourced from one store to save on separate delivery fees.
* Shows exact calculated savings right on the screen.

### 3. Pipeline Health and Healing Monitor
* An on-screen status board showing active Collector IDs for each store.
* A live demo terminal showing how self-healing updates broken selectors automatically.

---

## 5. Project Structure

```text
RoboSearch-ScrapeVerse/
├── data/
│   └── components.json         # High-speed data cache of component specs and prices
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── scrape/
│   │   │   │   ├── route.js    # Triggers collector execution jobs
│   │   │   │   └── results/
│   │   │   │       └── route.js # Fetches finalized scraping results from Bright Data
│   │   │   └── heal/
│   │   │       └── route.js    # API route returning self-healing logs
│   │   ├── globals.css         # Dark theme and glassmorphism styling
│   │   ├── layout.jsx          # Root layout shell
│   │   └── page.jsx            # Main dashboard interface
│   ├── components/
│   │   ├── Navbar.jsx          # Header with system status indicator
│   │   ├── StatsOverview.jsx   # Summary metrics (active collectors, tracked stores)
│   │   ├── ProductCard.jsx     # Hardware cards with live prices and spec tabs
│   │   ├── BomOptimizer.jsx    # Interactive BOM Cart calculation widget
│   │   └── PipelineModal.jsx   # Self-healing terminal log viewer
│   └── lib/
│       ├── bomCalculator.js    # Pure math functions for cart optimization
│       └── formatters.js       # Currency and data formatting helpers
├── .env.example
├── jsconfig.json
├── tailwind.config.js
└── package.json
```

---

## 6. Local Setup

### Prerequisites
* Node.js (version 18 or above)
* npm, yarn, or pnpm

### Steps to Run

1. Clone this repository:
   ```bash
   git clone https://github.com/Aryan-Kumar7369/RoboSearch-ScrapeVerse
   cd RoboSearch-ScrapeVerse
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables (optional for pre-cached demo mode):
   ```bash
   cp .env.example .env.local
   ```
   Add your Bright Data API key in `.env.local`:
   ```env
   BRIGHT_DATA_API_KEY=your_brightdata_api_token
   ```

   Add your Bright Data Collector ID in `.env.local`:
   ```env
   BRIGHT_DATA_COLLECTOR_ID=your_brightdata_collector_id
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and visit:
   ```text
   http://localhost:3000
   ```

---

## 7. Demo Components Included

For a reliable and fast live demonstration, the application comes configured with 3 standard robotics components:
* **ESP32 NodeMCU Wi-Fi + BLE Board** (Microcontroller)
* **MG996R Metal Gear Servo Motor** (Actuator)
* **Raspberry Pi 4 Model B (4GB RAM)** (Single Board Computer)
