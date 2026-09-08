# FarmUnity — Decentralized Agricultural Fulfilment & Direct Trade Network

[![Java](https://img.shields.io/badge/Java-21-orange.svg)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.5-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4-purple.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)

**FarmUnity** is a direct-trade agricultural fulfilment platform engineered to connect smallholder farmers directly with large-scale institutional buyers (hostels, hospitals, canteens, and bulk processors). By replacing predatory intermediary brokers with algorithmic cooperative pooling, certified physical quality inspection, and protected escrow commitments, FarmUnity guarantees floor prices for producers and transparent bulk supply for institutions.

---

## Table of Contents
- [The Problem & The Solution](#the-problem--the-solution)
- [Four Core Pillars](#four-core-pillars)
- [17-Layer System Architecture](#17-layer-system-architecture)
- [Core Algorithms & Mathematical Models](#core-algorithms--mathematical-models)
- [Key Innovations & Engineering Safeguards](#key-innovations--engineering-safeguards)
- [User Roles & Pre-Seeded Demo Accounts](#user-roles--pre-seeded-demo-accounts)
- [Tech Stack](#tech-stack)
- [Local Installation & Setup](#local-installation--setup)
- [Directory Structure](#directory-structure)

---

## The Problem & The Solution

### The Conventional Agricultural Supply Chain
* **Fragmentation:** Smallholders produce limited individual harvests (500–2,000 kg) that cannot independently fulfil institutional wholesale orders.
* **Predatory Intermediaries:** Multiple commission brokers cut farmer margins by up to 40% while adding zero supply value.
* **Arbitrary Quality Rejections:** Middlemen visually inspect produce at delivery gates and opportunistically dock weights or prices claiming moisture defects.
* **Delayed Payments & Default Risk:** Farmers frequently wait weeks or months for payments with zero legal or financial guarantees.

### The FarmUnity Solution
* **Algorithmic Spatial Pooling:** Smallholders within a geographic radius are clustered into cohesive bulk delivery batches using a Greedy Haversine clustering algorithm.
* **Certified Quality Gates:** Independent regional coordinators physically inspect produce using digital moisture meters before pooling. Batches only aggregate lots that satisfy strict crop parameter bands (e.g., 12.0%–14.0% for Paddy).
* **Protected Financial Commitments:** Institutional buyers lock commitment deposits upfront. Funds are held in a transparent ledger and automatically released upon verified digital delivery confirmation.
* **Strict Quantity Separation:** `declaredQty` is treated solely as an unverified estimate; all financial agreements and settlements compute payouts exclusively from physical `verifiedQty`.

---

## Four Core Pillars

```
       +-------------------------------------------------------------+
       |                         FARMUNITY                           |
       +-------------------------------------------------------------+
              |                      |                      |
     [Decentralized Pooling] [Deterministic Quality] [Protected Commitments]
              |                      |                      |
      Greedy Haversine         Strict Moisture Band     Locked Escrow Deposit
      Geographic Radius         Certified Gate Check     Verified-Only Payout
              \                      |                      /
               +---------------------+---------------------+
                                     |
                       [Direct Institutional Demand]
                        Bypassing Broker Commissions
```

1. **Decentralized Pooling (Spatial Haversine Aggregation):** Dynamically aggregates smallholder harvests to satisfy large institutional demands while minimizing total collection logistics mileage.
2. **Deterministic Quality (Physical Gate Inspection):** Eliminates subjective grading. Physical lots are verified using calibrated instruments with transparent pass/fail criteria.
3. **Protected Commitments (Guaranteed Escrow Protocol):** Eliminates buyer payment defaults. Capital is escrowed before collection and released only when digital proof-of-delivery is confirmed.
4. **Direct Institutional Demand (Zero Brokerage):** Establishes an open, auditable market connecting university hostels, corporate canteens, and food processors directly to farm clusters.

---

## 17-Layer System Architecture

FarmUnity is architected across 17 end-to-end operational layers:

```
[Layer 1: Farmer Onboarding]      --> Authenticates producers & assigns trust tiers (NEW, VERIFIED, ESTABLISHED)
[Layer 2: Harvest Declaration]    --> Producer logs crop, variety, harvest date, and declared quantity
[Layer 3: Quality Gate Inspection]--> Coordinator records physical moisture & assigns certified verified quantity
[Layer 4: Buyer Demand Intake]    --> Institutions submit bulk requirement with quantity, target window & price range
[Layer 5: Spatial Clustering]     --> Greedy Haversine algorithm clusters compatible lots within collection radius
[Layer 6: Feasible Price Overlap] --> Computes overlapping price band and fair midpoint pricing
[Layer 7: Cooperative Batch Form] --> Packages clustered lots into single verifiable Cooperative Batch
[Layer 8: Multi-Party Agreement]  --> Agreement created with @Version optimistic locking; farmers vote to accept/decline
[Layer 9: Commitment Escrow]      --> Buyer funds commitment deposit to lock the agreement
[Layer 10: Logistics Dispatch]    --> Generates optimal sequential pickup routes for regional transport
[Layer 11: Farm Gate Collection]  --> Coordinator inspects and confirms produce loading at each farm stop
[Layer 12: Intermediate Milling]  --> Dispatches paddy to registered millers; tracks yield ratio (benchmark: 65%)
[Layer 13: Delivery Confirmation] --> Buyer inspects and signs off on delivery with quality rating
[Layer 14: Escrow Settlement]     --> Settlement service calculates transparent proportional farmer payouts
[Layer 15: Fund Disbursement]     --> Releases escrowed funds directly to farmer accounts based on verified quantity
[Layer 16: Trust Tier Evolution]  --> Upgrades reliability scores and tiers based on fulfilment performance
[Layer 17: Audit Trail Engine]    --> SHA-256 append-only ledger logs every state change and irreversible event
```

---

## Core Algorithms & Mathematical Models

### 1. Spatial Haversine Distance Formulation
To cluster smallholders within collection limits ($D_{\max} \le 100\text{ km}$), great-circle distances are computed:

$$\Delta\sigma = 2 \arcsin \left( \sqrt{\sin^2\left(\frac{\Delta\phi}{2}\right) + \cos\phi_1 \cos\phi_2 \sin^2\left(\frac{\Delta\lambda}{2}\right)} \right)$$

$$d = R \cdot \Delta\sigma \quad (\text{where } R = 6371\text{ km})$$

Candidate lots are filtered where $d \le D_{\max}$, sorted by farmer reliability score (descending) and distance (ascending), and allocated greedily until the buyer's bulk requirement is satisfied.

### 2. Feasible Price Overlap Model
Given farmer reserve price $P_{\text{min, farmer}}$ and buyer acceptable range $[P_{\text{min, buyer}}, P_{\text{max, buyer}}]$:

$$\text{Overlap Low} = \max(P_{\text{min, farmer}}, P_{\text{min, buyer}}), \quad \text{Overlap High} = P_{\text{max, buyer}}$$

$$\text{If } \text{Overlap Low} \le \text{Overlap High}: \quad P_{\text{suggested}} = \frac{\text{Overlap Low} + \text{Overlap High}}{2}$$

If $\text{Overlap Low} > \text{Overlap High}$, the transaction is mathematically infeasible and blocked.

### 3. Transparent Proportional Settlement
Payouts strictly use the certified physical quantity:

$$\text{Payout}_i = \text{VerifiedQty}_i \times P_{\text{agreed}}$$

$$\text{Total Settlement} = \sum_{i=1}^{n} \text{Payout}_i + \text{LogisticsFee} + \text{MillingFee}$$

---

## Key Innovations & Engineering Safeguards

* **Verified vs Declared Quantity Separation:** The system prevents any settlement calculation from accessing `declaredQty`. The database strictly isolates `declared_qty` and `verified_qty`, with `verified_qty` being immutable once set by the coordinator.
* **Optimistic Locking (`@Version`):** Prevents race conditions during multi-farmer agreement consensus. Any concurrent modification triggers a retry exception rather than corrupting state.
* **Cryptographic Audit Log:** Every irreversible operational event (verification, lock, funding, delivery sign-off, settlement) publishes an immutable `AuditEvent` with SHA-256 payload hashes.
* **Offline-First Resilience:** Coordinators in remote rural areas with poor connectivity can record quality readings and queue drafts offline using client-side **Dexie.js (IndexedDB)**, which auto-syncs when online.

---

## User Roles & Pre-Seeded Demo Accounts

The database auto-initializes with pre-configured accounts (Password for all: `password123`):

| Role | Name / Organization | Phone Number | Description |
| :--- | :--- | :--- | :--- |
| **Farmer** | Ramesh Kumar | `9876543210` | Verified smallholder producer (Hoskote, Bengaluru Rural) |
| **Farmer** | Suresh Gowda | `9876543211` | New producer (Nelamangala, Bengaluru Rural) |
| **Farmer** | Venkat Rao | `9876543212` | Established producer with 94% reliability (Devanahalli) |
| **Institutional Buyer** | Bangalore Central Hostel Network | `9876543220` | Bulk procurement buyer with pre-funded deposit balance |
| **Coordinator** | Anand Sharma | `9876543230` | Regional coordinator for quality gates & logistics |

---

## Tech Stack

### Backend
* **Runtime:** Java 21 (LTS)
* **Framework:** Spring Boot 3.2.5
* **Security:** Spring Security with stateless JWT (HMAC-SHA256) & BCrypt password hashing
* **Persistence:** Spring Data JPA / Hibernate ORM
* **Database:** Embedded H2 Database (local zero-setup) / PostgreSQL compatible
* **Database Migrations:** Flyway (`V1` baseline schema, `V2` crop configurations, `V3` seed data)
* **Documentation:** SpringDoc OpenAPI 3.0 / Swagger UI (`/swagger-ui.html`)

### Frontend
* **Runtime:** Node.js
* **Framework:** React 18 with Vite
* **Routing:** React Router v6
* **State & Data Fetching:** TanStack React Query v5 & Context API
* **Styling:** Tailwind CSS 3.4 with custom interactive animations
* **Offline Persistence:** Dexie.js (IndexedDB wrapper)
* **Icons:** Lucide React

---

## Local Installation & Setup

### Prerequisites
* **Java Development Kit (JDK) 21** or later installed and configured on your `PATH`.
* **Apache Maven 3.8+** installed (or use your IDE's embedded Maven).
* **Node.js 18+** and **npm** installed.

### 1. Run the Backend Service

```bash
# Navigate to backend directory
cd backend

# Build and run the Spring Boot service
mvn spring-boot:run
```

* Backend API will start at: **`http://localhost:8080`**
* Interactive Swagger API Docs: **`http://localhost:8080/swagger-ui.html`**
* H2 Database Console: **`http://localhost:8080/h2-console`** (`JDBC URL: jdbc:h2:mem:farmunitydb`, `Username: sa`, `Password: `)

### 2. Run the Frontend Web Application

Open a new terminal:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```

* Frontend application will open at: **`http://localhost:5173`**

---

## Directory Structure

```
farmunity/
|-- backend/
|   |-- src/main/java/com/farmunity/
|   |   |-- config/          # Security, JWT filter, OpenAPI, seed data initializer
|   |   |-- controller/      # REST API endpoints (Auth, Listings, Batches, Agreements, Settlements, etc.)
|   |   |-- dto/             # Request & Response Data Transfer Objects
|   |   |-- entity/          # JPA Entities (Farmer, Buyer, Batch, Agreement, Settlement, etc.)
|   |   |-- event/           # Audit event publication and asynchronous event listeners
|   |   |-- repository/      # Spring Data JPA repositories
|   |   |-- service/         # Business logic (Clustering, Pricing, Verification, Settlement, etc.)
|   |   `-- util/            # Haversine distance, cryptographic hashing utilities
|   |-- src/main/resources/
|   |   |-- application.yml  # Spring application configurations
|   |   `-- db/migration/    # Flyway SQL migration scripts (V1, V2, V3)
|   `-- pom.xml              # Maven dependencies & build configuration
|
|-- frontend/
|   |-- src/
|   |   |-- api/             # Axios API service clients
|   |   |-- components/      # UI components (StatusBadge, TrustBadge, Modals, Maps, Timelines)
|   |   |-- hooks/           # Custom React hooks (useAuth, useOnlineStatus, useDraftQueue)
|   |   |-- pages/           # Application views (Landing, Auth, Farmer, Buyer, Coordinator, Settlements)
|   |   |-- store/           # Dexie.js IndexedDB schema for offline caching
|   |   |-- App.jsx          # Route declarations & role guards
|   |   |-- index.css        # Tailwind directives & high-contrast styling
|   |   `-- main.jsx         # React application root
|   |-- package.json         # Node.js dependencies
|   |-- tailwind.config.js   # Tailwind theme configurations
|   `-- vite.config.js       # Vite development & build setup
|
|-- .gitignore               # Excludes node_modules, build targets, and IDE configs
`-- README.md                # Project documentation
```

---

## License

This project is licensed under the Apache License 2.0.
