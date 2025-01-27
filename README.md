# UNVST Planner 🎓

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
![React](https://img.shields.io/badge/React-18+-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6?logo=typescript&logoColor=white)

A modern academic planner for university students with intuitive drag-and-drop functionality and prerequisites validation.

![App Screenshot](/screenshot.png) <!-- Add actual screenshot path -->

## Features ✨
- 📦 Drag-and-drop course scheduling
- 🔒 Automatic prerequisites validation
- 🔄 Cross-semester course movement
- 🔍 Real-time course search
- 📚 Course convalidation management
- 💾 Local storage persistence
- 📱 Responsive design

## Installation ⚙️
1. Clone the repository:
   ```bash
   git clone https://github.com/NotFabianML/unvst-planner.git

2. Install dependencies:

   ```bash
   pnpm install

3. Start development server:

   ```bash
   pnpm run dev

## Usage 🖱️
- Drag courses from "Available Subjects" to desired semesters
- Click the 🗑️ icon to return courses to available subjects
- Use the search bar to filter courses
- Click "Reset Plan" to start over

## Tech Stack 💻
- React 18 + Vite
- TypeScript
- Zustand (State management)
- @dnd-kit (Drag and Drop)
- Tailwind CSS
- Sonner (Toasts)
