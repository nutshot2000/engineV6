# 🎮 Game Engine v5 - AI-Powered Game Development Platform

A React-based visual game development environment with integrated AI assistance for rapid prototyping and game creation.

## 🚀 Quick Start

### For New Users (First Time)
```bash
# Clone this repository as a template
git clone https://github.com/your-username/gameengine-v5.git my-game-project
cd my-game-project

# Install dependencies
npm install

# Start development
npm start
```

### For Cursor AI Users
1. **Open this project in Cursor**
2. **Right-click any object** in the game canvas → "🤖 AI Game Assistant"
3. **Click the "📋 Copy" button** to get scene context
4. **Paste into Cursor AI chat** for instant assistance

## 🎯 How to Use This Engine

### 🆕 Creating New Projects

**Option 1: Template Approach (Recommended)**
```bash
# Use this repository as a template for each new game
git clone gameengine-v5 my-new-game
cd my-new-game
git remote remove origin
git remote add origin https://github.com/your-username/my-new-game.git
```

**Option 2: Fork and Customize**
- Fork this repository
- Customize for your specific game genre
- Each game becomes a separate repository

**Option 3: Live Website Integration**
- Deploy this engine to a website
- Users create projects in browser
- Projects saved to cloud storage (Firebase, etc.)

### 🎮 Game Development Workflow

1. **Start with Assets**
   - Drag images from sidebar to canvas
   - Or use AI to generate new assets

2. **Add Interactivity**
   - Right-click objects for context menu
   - Add shapes (boundaries, hitboxes, triggers)
   - Enable physics and effects

3. **Use AI Assistant**
   - Right-click → "AI Game Assistant"
   - Click objects to reference them
   - Ask for help: "Make [object] move with WASD keys"

4. **Export & Deploy**
   - `npm run build` for production
   - Deploy to GitHub Pages, Netlify, etc.

## 🤖 Cursor AI Integration Guide

### Initial Setup Prompt for Cursor

```
🎮 GAME ENGINE v5 CONTEXT

I'm working with a React-based visual game development platform that includes:

CORE FEATURES:
- Drag & drop asset placement
- Physics system with bouncing effects
- Shape drawing tools (boundaries, hitboxes, triggers)
- Real-time coordinate system
- Auto-save to IndexedDB
- AI-assisted development workflow

ARCHITECTURE:
- React 18 with functional components
- Konva.js for 2D canvas rendering
- IndexedDB for project persistence
- Component-based asset system
- Event-driven physics engine

CURRENT PROJECT STRUCTURE:
- src/components/ - UI components
- src/utils/ - Helper utilities
- public/assets/ - Game assets (images, sprites, etc.)

HOW TO HELP:
- I'll share scene context using the "Copy to Cursor" button
- Object references appear as [objectName] in my messages
- Coordinates shown as "x: 100, y: 200" format
- I can click objects and coordinates to reference them

Please help me with game development tasks, code improvements, and feature implementations!
```

### Scene Context Format
When you click "📋 Copy", you'll get:
```
🎮 GAME ENGINE SCENE CONTEXT for Cursor AI

📊 Scene Overview:
- Total Objects: 3
- Assets: 2
- Shapes: 1
- Selected: player_sprite

📦 Canvas Assets:
• player_sprite - Position: (100, 200) - Size: 64×64
• background_grass - Position: (0, 0) - Size: 800×600

🔷 Shapes:
• boundary_wall (boundary) - Position: (400, 500) - Size: 200×20

💡 Context: React-based game engine with drag-and-drop functionality...

🤖 Please help me with: [Your request here]
```

## 📁 Project Structure

```
gameengine-v5/
├── public/
│   ├── assets/              # Game assets organized by type
│   │   ├── images/          # General images
│   │   ├── sprites/         # Character sprites
│   │   ├── backgrounds/     # Background images
│   │   ├── ui/             # UI elements
│   │   └── temp/           # Temporary/generated assets
│   └── index.html
├── src/
│   ├── components/          # React components
│   │   ├── AIGameAssistant.js    # AI chat integration
│   │   ├── GridCanvas.js         # Main game canvas
│   │   ├── AssetImage.js         # Asset rendering
│   │   ├── BouncingPhysics.js    # Physics system
│   │   └── ...
│   ├── utils/              # Utility functions
│   │   ├── AssetScanner.js      # Asset discovery
│   │   ├── IndexedDBManager.js  # Local storage
│   │   └── ProjectManager.js    # Project management
│   └── App.js              # Main application
└── README.md
```

## 🌐 Deployment Options

### 1. Static Site Hosting
```bash
npm run build
# Deploy 'build' folder to:
# - GitHub Pages
# - Netlify
# - Vercel
# - AWS S3
```

### 2. Development Server
```bash
npm start  # Local development at localhost:3000
```

### 3. Production Server
```bash
npm install -g serve
serve -s build -l 80  # Production server
```

## 🛠️ Customization for New Projects

### Game-Specific Modifications

1. **Update package.json**
   ```json
   {
     "name": "my-awesome-game",
     "description": "My game built with Game Engine v5"
   }
   ```

2. **Customize Assets**
   - Replace files in `public/assets/`
   - Update asset categories in `AssetScanner.js`

3. **Modify Physics**
   - Edit `BouncingPhysics.js` for game-specific behavior
   - Add new physics systems as needed

4. **Extend AI Assistant**
   - Add game-specific commands to `AIGameAssistant.js`
   - Create custom context generators

### Creating Game Templates

```bash
# Create specialized templates
git clone gameengine-v5 platformer-template
cd platformer-template
# Customize for platformer games
# Add platformer-specific components
# Create template-specific documentation
```

## 🎓 Learning Path

### Beginner
1. **Explore the interface** - Drag assets, draw shapes
2. **Use AI Assistant** - Ask for simple modifications
3. **Learn coordinates** - Click to copy positions
4. **Save/Load projects** - Understand persistence

### Intermediate
1. **Study component structure** - Understand React architecture
2. **Modify physics** - Customize bouncing behavior
3. **Add new assets** - Create your own sprites
4. **Extend AI prompts** - Improve context generation

### Advanced
1. **Create new components** - Build custom game mechanics
2. **Integrate external APIs** - Add multiplayer, cloud save
3. **Build game templates** - Create genre-specific versions
4. **Contribute features** - Submit pull requests

## 🔧 Technical Requirements

- **Node.js** 16+ 
- **npm** 8+
- **Modern browser** with Canvas support
- **2GB RAM** minimum
- **Cursor IDE** (recommended for AI features)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -m 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit pull request

## 📄 License

MIT License - Feel free to use for personal and commercial projects.

## 🆘 Getting Help

1. **Use the AI Assistant** - Built-in help system
2. **Check documentation** - Comprehensive guides included
3. **Join community** - Discord/GitHub discussions
4. **Submit issues** - Bug reports and feature requests

---

**Ready to build amazing games? Start with `npm start` and let the AI assistant guide you!** 🚀
