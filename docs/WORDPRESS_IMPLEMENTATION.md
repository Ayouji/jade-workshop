# Jade — WordPress Implementation & Architecture Guide

This document outlines the exact architecture, plugin configuration, styling system, and operational guide for implementing the **Jade Creative Workshop Studio** website on WordPress, matching the **Editorial Artisanal Minimalism** design direction.

---

## 1. Technical Stack Overview

| Component | Technology / Tool | Rationale |
| :--- | :--- | :--- |
| **CMS Platform** | WordPress (6.4+) | Robust content management, native Gutenberg integration |
| **Active Theme** | **Kadence Theme** (Free / Pro) | Lightweight, performance-first, custom typography tokens |
| **Block System** | **Gutenberg + Kadence Blocks** | Fast native editing without Elementor bloat |
| **Booking Engine** | **Amelia Booking Plugin** | Dedicated event/workshop booking with capacity logic |
| **Email Delivery** | **FluentSMTP** + **Brevo (formerly Sendinblue)** | High-deliverability transactional notifications |
| **Typography** | **Newsreader** (Serif) + **Plus Jakarta Sans** (Sans) | Exact font pairing loaded locally via Kadence |
| **Hosting** | **SiteGround** / Managed LiteSpeed Host | Built-in caching, staging environments, PHP 8.2+ |
| **DNS & Security** | **Cloudflare** | SSL/TLS, edge caching, DDoS mitigation, DNS management |

---

## 2. Visual Identity & Color System (Kadence Global Palette)

Configure the Kadence Global Color Palette in `Appearance > Customize > Colors & Fonts > Colors`:

```text
Palette 1 (Terracotta / Accent):     #B85D43
Palette 2 (Terracotta Hover):        #9E4B33
Palette 3 (Charcoal Ink / Headings): #1C1B1A
Palette 4 (Muted Charcoal / Body):   #5C5854
Palette 5 (Paper Canvas / Base):     #FAF7F2
Palette 6 (Pure White / Cards):      #FFFFFF
Palette 7 (Soft Stone / Lines):      #EAE4DC
Palette 8 (Linen Hairline):          #E8E2D8
Palette 9 (Botanical Moss):          #2D4236
```

### Typography Configuration (`Customize > Colors & Fonts > Typography`)
- **Base Font (Body, Navigation, Forms, Meta):**
  - Family: `Plus Jakarta Sans`
  - Weight: `400` / `500` / `600`
- **Headings Font (H1 – H4, Display, Titles):**
  - Family: `Newsreader`
  - Style: `Normal` / `Italic`
  - Letter spacing: `-0.02em`

---

## 3. Booking Engine Setup (Amelia Configuration)

Configure Amelia via `Amelia > Events / Services`:

### 3.1 Event Configuration: Seasonal Gardening Basics
1. **Event Name:** `Seasonal Gardening Basics`
2. **Description:**
   > Learn to plant and nurture your own herbs and vegetables.
3. **Schedule / Recurring Sessions:**
   - Cadence: `Every Saturday in October`
   - Start Time: `10:00 AM`
   - End Time: `12:30 PM`
   - Duration: `2 hours 30 minutes`
4. **Capacity Logic:**
   - Max Capacity: `10 participants`
   - Min / Max per booking: `1 to 3 participants`
   - Real-time seat calculation: Enabled (shows spots remaining)
   - Overbooking behavior: Strict reject (`"Not enough seats available. Please select another session or reduce the number of participants."`)
5. **Pricing:**
   - Free community admission / configured workshop fee

### 3.2 3-Stage Booking Form Setup
- **Stage 1 (Session):** Workshop selection, date slot, time, number of tickets
- **Stage 2 (Your Details):** First name, Last name, Email address, Phone number
- **Stage 3 (Confirm & Summary):** Ticket breakdown, schedule review, Confirm button

### 3.3 Email Notification Templates (`Amelia > Notifications`)
- **Customer Confirmation Email:**
  - Subject: `Your workshop booking for Seasonal Gardening Basics is confirmed`
  - Body includes: Attendee name, Session date, Start time, Studio address, and preparation advice.
- **Host Notification Email:**
  - Dispatched directly to Jade upon each confirmed booking with attendee contact details.

---

## 4. Transactional Email Setup (FluentSMTP + Brevo)

1. Install and activate **FluentSMTP** plugin.
2. In `FluentSMTP > Settings`:
   - Connection Provider: **Brevo (Sendinblue)**
   - API Key: Insert Brevo API Key
   - From Email: `hello@yourstudio.com`
   - From Name: `Jade Studio`
3. Enable email logging to monitor delivery status.

---

## 5. Page Layout Architecture (Gutenberg + Kadence Blocks)

### Homepage (`/`)
1. **Hero Block (Kadence Row Layout):**
   - Background: `#FAF7F2`
   - Eyebrow: `CREATIVE WORKSHOPS` (`font-mono text-xs text-[#B85D43]`)
   - H1 Display: `Create something worth remembering.` (`Newsreader`, 64px)
   - Lead paragraph: `Discover hands-on creative workshops designed to help people slow down, experiment, connect, and create.`
   - CTA: Button with label `EXPLORE WORKSHOPS` linked to `#workshops`
   - Full-width hero image block: `/studio_hero.jpg`
2. **Workshops Section (`#workshops`):**
   - Eyebrow: `UPCOMING WORKSHOPS`
   - Heading: `Make time to create.`
   - Amelia Event Booking block embedded or custom editorial query loop.
3. **About Section (`#about`):**
   - Left column: Portrait image (`/jade_instructor.jpg`)
   - Right column:
     - Heading: `ABOUT JADE`
     - Confirmed bio: *"I am an experienced local hobby gardener with ten years of community project involvement."*
4. **Workshop Experience Section (`#experience`):**
   - Three editorial columns:
     - `01 LEARN`
     - `02 CREATE`
     - `03 CONNECT`
5. **Contact Section (`#contact`):**
   - Inquiry form + studio arrival notice.

---

## 6. Deployment & Performance Best Practices

1. **LiteSpeed Cache / SG Optimizer:**
   - Enable CSS/JS minification.
   - Cache preloading for dynamic pages.
2. **Cloudflare Integration:**
   - Full SSL (Strict).
   - Early Hints and Polish image optimization.
3. **Local Font Delivery:**
   - Host `Newsreader` and `Plus Jakarta Sans` locally to satisfy GDPR / privacy regulations and avoid render-blocking Google Font requests.
