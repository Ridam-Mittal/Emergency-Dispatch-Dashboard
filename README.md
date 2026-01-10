# 🚨 Emergency Dispatch System Dashboard

A full-stack emergency coordination platform designed as an **internal dispatcher dashboard**. This project demonstrates how AI, geospatial queries, and real-time UI can be combined to build a realistic emergency response system.

---

# 🎯 Project Objective

The goal was to design a **dispatcher-facing dashboard** (not a public app) where operators can:

* View incoming incidents
* Understand severity (AI-powered)
* See unit locations live
* Assign the nearest available unit
* Track performance metrics

This mirrors how real emergency control rooms operate.

---

# 🧠 Key Design Decisions (WHY we built it this way)

## 1. Internal Dashboard (Not Public Reporting)

**Decision:** Incidents are not submitted by end users through UI.

**Why:**

* Assignment described a *coordination dashboard*, not a citizen portal
* Keeps scope realistic for an internal tool
* Matches real-world systems (911 control rooms)

**Implementation:**

* Incidents are added via REST API
* A data generator script simulates real reports

---

## 2. AI Severity Classification

**Decision:** AI classifies severity from text descriptions.

**Why:**

* Reduces dispatcher cognitive load
* Demonstrates real AI integration
* Aligns with assignment requirement

**How:**

* Description → OpenAI/Claude → LOW/MEDIUM/HIGH
* Stored in DB to avoid repeated calls

---

## 3. MongoDB Geospatial Queries

**Decision:** Use GeoJSON + 2dsphere index.

**Why:**

* Industry standard for location search
* Efficient nearest-unit calculation

**Result:**

* Backend finds nearest AVAILABLE unit
* Frontend only triggers dispatch

This keeps logic server-side (correct architecture).

---

## 4. One-Click Dispatch Model

**Decision:** Dispatcher clicks one button → backend decides.

**Why:**

* Avoids manual mistakes
* Real systems are automated
* Keeps UI simple

**Flow:**

1. Dispatcher clicks "Dispatch"
2. Backend calculates nearest unit
3. Assigns automatically
4. Status updates

---

## 5. Real-Time Map

**Decision:** Use Leaflet instead of Google Maps.

**Why:**

* Open source
* No API keys required
* Lightweight

**Design Choices:**

* Real map pins (not circles)
* Different colors for severity
* Vehicle icons for units

---

## 6. Auto Refresh Instead of WebSockets

**Decision:** Poll APIs every 5 seconds.

**Why:**

* Simpler implementation
* Enough for demo
* Avoids socket complexity

---

## 7. Unit Movement Simulation

**Decision:** Separate movement script.

**Why:**

* Assignment only asked for *live locations*
* Movement is visual enhancement
* Does NOT affect dispatch logic

This keeps business logic clean.

---

## 8. Tabs Design

| Tab      | Purpose              |
| -------- | -------------------- |
| Active   | Live incidents       |
| Resolved | History              |
| Units    | Resource monitoring  |
| Metrics  | Performance tracking |

This mirrors professional control room dashboards.

---

# 🏗 Architecture

Frontend → Backend → Database

* React handles UI
* Express handles business logic
* MongoDB stores geo data
* AI used only at incident creation

---

# 📊 Metrics Logic

We track:

* Total incidents
* By severity
* Avg response time
* Unit availability

**Why:**

* Helps management
* Shows system performance

---

# 📂 Project Structure

```
frontend/
  components/
  styles/
  utils/
  api/

backend/
  models/
  controllers/
  services/
  routes/
```

Separation keeps code maintainable.

---

# 🔄 System Flow

1. Incident created via API
2. AI classifies severity
3. Stored in DB
4. Dashboard auto-refreshes
5. Dispatcher assigns unit
6. Backend updates unit status
7. Metrics update

---

# 🧪 Data Simulation

We use a script to:

* Generate realistic incidents
* Random coordinates
* Auto post to API

This replaces a public reporting UI.

---


---

# 🚀 Setup

Backend

```bash
npm install
npm run dev
```

Frontend

```bash
npm install
npm run dev
```

---

