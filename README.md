# LabInventoryBridge

**Modern inventory and transaction tracking system for laboratory environments.**  
Built to digitize and automate manual Excel-based processes with barcode support, real-time stock management, and integrated analytics.

---

## Project Overview

LabInventoryBridge is a full-stack web application that helps labs manage:

- Inventory levels with minimum stock alerts
- Barcode-based tracking for reagens, equipment and supplies
- Transaction history (in/out movements) linked to stock changes
- Supplier and category metadata
- Tableau dashboards for analytics (stock health, usage trends, alerts)

Deployed using [Lovable](https://lovable.dev/projects/23b68129-3f38-4add-a3d6-581417fdb8dc) with auto-publishing and CI/CD enabled.

---

## Tech Stack

- **Frontend:** React 18, Vite, TypeScript  
- **Styling:** Tailwind CSS, shadcn/ui components  
- **Database:** Supabase (PostgreSQL)  
- **State Management:** React Query  
- **Routing:** React Router  
- **Icons:** Lucide React  
- **Charts:** Recharts  
- **Analytics:** Tableau (external dashboard via Supabase connector)  

---

## Project Access

- **Live App:** [Open in Lovable](https://lovable.dev/projects/23b68129-3f38-4add-a3d6-581417fdb8dc)
- **GitHub Repo:** _Private during development_

---

## 📊 Dashboard Preview

This project integrates with **Tableau** to visualize inventory status, low stock alerts, and supplier breakdowns in real time.

> Example: "Low Stock", "Stock by Category", "Recent Transactions"

![Tableau Dashboard Screenshot](https://github.com/eshaq95/LabInventoryBridge/assets/your-screenshot-id-here)  
*(Replace with actual screenshot URL or path)*

---

## Working with this Codebase

### Option 1: Edit in Lovable

1. Open [Lovable Project](https://lovable.dev/projects/23b68129-3f38-4add-a3d6-581417fdb8dc)
2. Make changes using the prompt-based UI
3. All changes will be committed automatically

### Option 2: Local Development (recommended for advanced customization)

```sh
# Clone the repository
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Start local dev server
npm run dev
```

Requires Node.js & npm. [Install via nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Option 3: GitHub Codespaces

- Click "Code" > "Codespaces" > "New codespace"
- Develop inside your browser with full dev environment

---

## Deployment & Domain

- **Deploy:** Use “Share → Publish” inside Lovable UI
- **Custom Domain:** Go to Project > Settings > Domains  
  [How to configure](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

---

## License

MIT – open source and extendable for lab-scale or commercial use.
