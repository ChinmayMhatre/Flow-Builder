# Visual Flow Builder

A modern, lightweight visual flow builder built with React, TypeScript, and Vite. This application allows users to construct node-based logical flows (similar to tools like Zapier or n8n) and instantly exports them to a strict, validated JSON schema.

## Features

* **Interactive Canvas:** Built on top of `@xyflow/react`, allowing seamless drag-and-drop, panning, and zooming.
* **Real-time Synchronization:** Every edit on the canvas or in the properties sidebar instantly updates the underlying global store (`zustand`) and the JSON output.
* **Live JSON Preview:** View the generated schema formatted in real-time. Includes a 1-click "Copy JSON" utility.
* **Robust Validation Engine:** 
  * Warns if a Start Node is missing or has no outgoing connections.
  * Highlights completely disconnected nodes.
  * Enforces required fields (like Descriptions).
  * Automatically catches exact nodes causing errors with visually prominent red borders and a floating error banner.
* **Bonus Implementations:**
  * **JSON Import:** Completely replaces the canvas state by parsing and validating an array of raw JSON node objects.
  * **Delete Key:** Quickly remove nodes or edges simply by selecting them and pressing `Backspace` or `Delete`.
  * **Dynamic Edge Conditions:** Edit transition strings natively in the right-side properties panel.

## Tech Stack & Design Choices

* **React + Vite + TypeScript:** Chosen for extremely fast local development and strict type-safety across the node data models and UI components.
* **`@xyflow/react` (React Flow):** The industry standard abstract library for node-routing mathematics. Writing canvas panning/edge-drawing math from scratch is error-prone; React Flow allowed us to focus purely on the business logic and UI.
* **Zustand:** Selected over Redux or Context API for its minimal boilerplate and direct, high-performance integration with React Flow's state requirements (`onNodesChange`, `onEdgesChange`).
* **Tailwind CSS + Lucide Icons:** Used to rapidly achieve the "Clean and Modern" UI expectation. The interface utilizes glass-morphism panels, soft shadows, and clean typography to feel premium.

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
