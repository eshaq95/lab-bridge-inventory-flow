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

**Live App:** [Open in Lovable](https://lovable.dev/projects/23b68129-3f38-4add-a3d6-581417fdb8dc)

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
