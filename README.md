# Visual Flow Builder

A modern, lightweight visual flow builder built with React, TypeScript, and Vite. This application allows users to construct node-based logical flows (similar to tools like Zapier or n8n) and instantly exports them to a strict, validated JSON schema.

## Deliverables Checklist (Assignment Requirements)

### 1. Canvas 
✅ Add, delete, and drag nodes around using a beautiful glass-morphism UI  
✅ Connect nodes by drawing edges between them  
✅ Show a label on each edge indicating the transition condition  
✅ Visually mark the "start" node (denoted by a green Play icon and protected from deletion)  
✅ **Bonus:** Right-click context menu to quickly add new nodes or toggle the MiniMap  

### 2. Node Sidebar
✅ Click a node to open a sliding properties panel  
✅ Edit the node's name/ID (automatically cascades changes to connected edges and enforces uniqueness)  
✅ Write and update descriptions  
✅ Manage outgoing edges — cleanly view targets and hit the "X" button to remove them  

### 3. JSON Preview
✅ Live-generated structured JSON formatted in real-time  
✅ Syntax highlighting using a sleek dark-mode IDE theme (`vscDarkPlus`)  
✅ 1-click "Copy JSON" utility floating in the corner  

### 4. Validations Engine
✅ **Basic:** Node IDs are enforced to be strictly unique across the canvas  
✅ **Basic:** Description fields are strictly required before a flow is considered valid  
✅ **Basic:** The Starting node is protected and must exist  
✅ **Basic:** Validation errors trigger prominent red alerts and inline visual feedback, not console warnings  
✅ **Bonus:** Validation explicitly warns the user about orphaned / disconnected nodes  

### 5. Extra Polish & Bonus Implementations
✅ **JSON Import:** A modal that accepts raw JSON, parses it, and perfectly reconstructs it on the canvas using the `dagre` layout engine to automatically prevent overlapping nodes.  
✅ **Delete Key:** Quickly remove nodes simply by selecting them and pressing `Backspace` or `Delete`.  
✅ **Dynamic Validation Trigger:** A dedicated "Validate" button allows users to deliberately check their work, clearing automatically once user edits begin.  
✅ **Onboarding Experience:** A beautiful pastel welcome modal explaining the canvas mechanics for first-time visitors (persisted via `localStorage`).  

---

## Tech Stack & Design Choices

* **React + Vite + TypeScript:** Chosen for extremely fast local development and absolute type-safety across the node data models, store bounds, and UI components.
* **`@xyflow/react` (React Flow):** The industry standard abstract library for node-routing mathematics. Writing canvas panning/edge-drawing math from scratch is error-prone; React Flow allowed us to focus purely on the business logic and layout UI.
* **Zustand:** Selected over Redux or Context API for its minimal boilerplate and direct, high-performance integration with React Flow's intense state change requirements (`onNodesChange`, `onEdgesChange`).
* **Tailwind CSS + Shadcn UI + Lucide Icons:** Used to rapidly achieve the requested "Clean and Modern" UI expectation. The interface utilizes glass-morphism panels, soft pastel `md` drop-shadows, and modern typography to feel incredibly premium.
* **Dagre:** Used behind the scenes exclusively during "JSON Imports" to mechanically calculate the perfect left-to-right spacing for freshly generated nodes.

---

## How to Run Locally

### Prerequisites
* Node.js (v18 or higher recommended)
* npm

### Setup Instructions

1. **Clone the repository and install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open the App:**
   Navigate your browser to `http://localhost:3000` (or whatever port Vite allocated in your terminal).

## How to Build for Production

```bash
npm run build
npm run preview
```

This will bundle the application into static files inside the `dist` folder, suitable for hosting on Vercel, Netlify, or AWS S3.
