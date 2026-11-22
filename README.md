# PriceWise – Shop Smart. Save More. 📉💡

> **Category:** Online Price Tracker & Smart Shopping Assistant  
> **Target Market:** Indian E-Commerce (Amazon India, Flipkart, Croma, Reliance Digital, Vijay Sales, Tata CLiQ)  
> **Status:** Production-Ready Full-Stack Web Application + Chrome Extension (Manifest V3)

---

## 🌟 Executive Overview

**PriceWise** is an intelligent, consumer-first price intelligence platform built to eliminate deceptive discount schemes, verify true product variants, compare total payable prices across retailers, and notify shoppers the moment prices drop to their target budget.

Rather than relying purely on printed Maximum Retail Prices (MRPs), PriceWise analyzes true historical selling prices to classify deals into **Genuine Deals**, **Possible Fake Discounts**, or **Prices Above Average**.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 18 with Vite, TypeScript |
| **Styling** | Tailwind CSS with custom glassmorphism and modern design system |
| **Icons** | Lucide React |
| **Charts** | Recharts (Responsive Line & Area graphs with custom Indian Rupee tooltips) |
| **Backend** | Node.js with Express.js (ES Modules, TypeScript) |
| **Database & Auth** | Supabase (PostgreSQL) + Zero-Config Local Cache & Memory fallback |
| **Retailer Adapters** | Modular architecture supporting Amazon India, Flipkart, Croma, Reliance Digital, Vijay Sales, Tata CLiQ |
| **Price Monitoring** | Automated background interval polling + manual immediate check triggers |
| **Browser Extension** | Google Chrome Extension using Manifest V3 |

---

## 🚀 Key Features Breakdown

### A. Smart Product Search & Direct URL Parsing
- **Keyword & Model Search:** Search for products such as *"iPhone 16 128GB Black"*, *"Samsung Galaxy S24 Ultra 256GB"*, *"Sony WH-1000XM5"*, *"HP Pavilion 15 Ryzen 5"*.
- **Direct Product URL Search:** Paste any product link from Amazon India, Flipkart, Croma, etc.
- **Friendly Loading State:** *"Finding the best deals for you..."* with multi-store scan animations.
- **Error Handling:** Graceful error messages for invalid, unsupported, or inaccessible URLs.
- **Autocomplete & Suggestions:** Debounced query matching for instant discovery.
- **Recent Search History:** Local and server-backed search history with one-click re-run.

### B. Multi-Retailer Price Comparison (Indian Market)
Direct comparison across the 6 major Indian electronics retailers:
- **Amazon India** (`amazon.in`)
- **Flipkart** (`flipkart.com`)
- **Croma** (`croma.com`)
- **Reliance Digital** (`reliancedigital.in`)
- **Vijay Sales** (`vijaysales.com`)
- **Tata CLiQ** (`tatacliq.com`)

**Information displayed per retailer:**
- Retailer name and branded badge
- Product title & product preview image
- Current selling price vs. original MRP
- Calculated discount percentage
- Seller name, verified merchant badges, and seller rating
- Stock status & availability
- Delivery charges (Free / ₹49 / ₹99)
- Estimated delivery timeframe (e.g. *"Tomorrow by 11:00 AM"*, *"2 business days"*)
- Additional platform or handling fees (e.g. ₹5 platform fee)
- **Final Payable Price:** Total at checkout ($Price + Delivery + Fee$)
- **Lowest Verified Total Price Badge:** Highlights the genuine cheapest deal

### C. Exact Product Variant Matching Engine
Never compare non-identical configurations by mistake.
- **Specification Matrix:** Brand, Model Number, Storage Capacity (128GB vs 256GB), RAM (8GB vs 16GB), Colour, Processor/Chipset, Generation.
- **Confidence Scoring:**
  - `95–100%`: **Exact Variant Match** (Emerald Badge)
  - `80–94%`: **Likely Match, Needs Verification** (Amber Badge)
  - `<80%`: **Variant Difference Detected** (Rose Badge)
- **Interactive Variant Inspector:** Side-by-side modal displaying target product vs candidate retailer specifications with mismatch highlights.

### D. Seller Verification & Reliability Engine
- Compares actual marketplace sellers (e.g. *Appario Retail*, *RetailNet*, *Croma Direct*, *Reliance Retail*).
- Seller ratings and verified review counts.
- **Reliability Statuses:**
  - 🟢 **High confidence:** Direct platform-managed flagship fulfillment / authorized brand partner.
  - 🟡 **Moderate confidence:** Established marketplace seller with good feedback.
  - ⚪ **Insufficient information:** New merchant or low feedback telemetry.
- Ground-truth integrity: No fabricated seller ratings.

### E. Historical Price Tracking Graphs (Recharts)
- Interactive area chart with time period selectors: **7 Days**, **30 Days**, **90 Days**, **6 Months**, **1 Year**.
- Real-time custom tooltips with date, price in ₹, retailer name, and contextual event notes (e.g., *Festival Sale*, *MRP reset*).
- **Metric Cards:** Highest recorded price, Lowest recorded price, Historical average price, Current price, Previous check price, and Percentage change.
- **Dynamic Price Intelligence Summary:**
  > *"Good news! This product is currently 12% cheaper than its historical average of ₹79,900."*

### F. Fake Discount Detection Engine
- Compares current price against real historical selling prices rather than inflated manufacturer MRPs.
- **Classifications:**
  - 🟢 **Genuine Deal** (Selling well below historical average; verified true discount)
  - 🔴 **Possible Fake Discount** (Inflated MRP with price virtually identical to regular average)
  - 🟠 **Price Above Average** (Currently priced higher than typical market rate)
  - 🔵 **Normal Market Price** (Selling at everyday standard rate)
  - ⚪ **Insufficient Price History**
- Transparent numerical breakdown showing Printed MRP, 30-Day Average, Lowest Ever, and Real Savings.

### G. Custom Price Drop Alerts
- Set custom target purchase prices (e.g. Current ₹45,000 ➔ Alert at ₹40,000).
- Quick preset buttons: `-5%`, `-10%`, or `Match All-Time Low`.
- In-app notification center with real-time badges, amount saved calculation, and direct store links.
- Full Alert Management: Edit target prices, pause/resume tracking, delete alerts, view trigger history.
- Duplicate notification suppression to prevent repetitive spam.

### H. Frequent & Reliable Price Checks
- Automated scheduled interval monitoring engine (15m, 30m, 1h, 6h).
- Last checked timestamps and next scheduled cycle indicator.
- Manual **"Check Prices Now"** button for immediate multi-store scans.

### I. Chrome Browser Extension (Manifest V3)
- Fully packaged extension in `/extension` folder.
- Automatically recognizes shopping tabs on Amazon.in, Flipkart, and Croma.
- Injects a floating price comparison badge and provides quick popup comparison.

---

## 🏃 Running the Application

### 1. Unified Full-Stack Run (One Port)
The Express server is pre-configured to host both the REST API and the compiled React production frontend on port `5000`:

```bash
cd "server"
node dist/index.js
```
Open your browser to: **`http://localhost:5000`**

### 2. Development Mode (Vite Hot-Reload + API)
To run frontend and backend in development mode:

**Terminal 1 (Backend):**
```bash
cd "server"
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd "client"
npm run dev
```
Open your browser to: **`http://localhost:3000`**

---

## 🧩 Installing the Chrome Extension (Manifest V3)

1. Open Google Chrome and go to `chrome://extensions/`.
2. Toggle on **Developer mode** in the top-right corner.
3. Click the **Load unpacked** button.
4. Select the `extension` folder inside this project directory (`mini project/extension`).
5. The **PriceWise** extension will appear in your Chrome toolbar ready to assist you while browsing online stores!

---

## 🛡️ Supabase Integration

PriceWise includes Supabase client code for PostgreSQL and authentication.
- **Out of the box:** Runs with local state and memory cache with zero configuration required.
- **Connect remote Supabase:** Go to the **Settings** tab in the PriceWise web app and paste your `SUPABASE_URL` and `SUPABASE_ANON_KEY`.

---

© PriceWise Team – Shop Smart. Save More.
