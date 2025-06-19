# 🚀 First-Time Cursor Setup Guide

Welcome to AI-powered game development! This guide will get you from zero to creating games with AI assistance in under 10 minutes.

## 📋 Prerequisites Checklist

- [ ] **Cursor IDE** installed ([Download here](https://cursor.sh))
- [ ] **Node.js** 16+ installed ([Download here](https://nodejs.org))
- [ ] **Git** installed ([Download here](https://git-scm.com))
- [ ] Basic understanding of drag-and-drop interfaces

## 🎯 Step 1: Get the Game Engine

### Option A: Clone for Learning
```bash
git clone https://github.com/your-username/gameengine-v5.git
cd gameengine-v5
npm install
```

### Option B: Create Your Own Game Project
```bash
git clone https://github.com/your-username/gameengine-v5.git my-awesome-game
cd my-awesome-game
git remote remove origin
npm install
```

## 🎮 Step 2: Launch and Explore

```bash
npm start
```

**What you'll see:**
- Game canvas in the center
- Asset sidebar on the left
- Tools panel on the right
- Coordinate display in bottom-right

**Try these actions:**
1. **Drag an asset** from sidebar to canvas
2. **Right-click the canvas** to see context menu
3. **Right-click an object** to see object-specific options

## 🤖 Step 3: Activate AI Assistant

1. **Right-click any object** on the canvas
2. **Select "🤖 AI Game Assistant"**
3. **The AI chat window opens** - you can drag it around!

**First thing to try:**
- Type: "Help me understand this game engine"
- Click "Send"

## 📋 Step 4: Copy Scene Context to Cursor

This is where the magic happens! The game engine can generate comprehensive context for Cursor AI.

1. **Click the "📋 Copy" button** in the AI assistant header
2. **Open Cursor AI chat** (Cmd/Ctrl + L)
3. **Paste the context** - you'll see detailed scene information
4. **Add your request** after the context

### Example First Prompt for Cursor:
```
[Paste the scene context here]

I'm new to this game engine. Can you:
1. Explain what each component does
2. Show me how to add player movement controls
3. Suggest some beginner-friendly features to try
```

## 🎯 Step 5: Your First AI-Assisted Feature

Let's add player movement with AI help:

1. **Add a player sprite** to the canvas
2. **Click the sprite** while AI assistant is open (adds [sprite_name] to chat)
3. **Ask the AI**: "Add WASD movement controls to [sprite_name]"
4. **Copy the response to Cursor** for implementation

### Pro Tip: Object Referencing
- **Click objects** while typing to auto-reference them
- **Click coordinates** (bottom-right) to insert positions
- **Use specific requests**: "Make [player] move to x: 200, y: 300"

## 🛠️ Step 6: Understanding the Workflow

### The Three-Way AI Workflow:

1. **Game Engine AI Assistant**
   - Quick questions and object referencing
   - Scene analysis and context generation
   - Coordinate and object management

2. **Cursor AI Chat**
   - Complex code implementation
   - Architecture decisions
   - Debugging and optimization

3. **Visual Interface**
   - Drag-and-drop asset placement
   - Real-time testing and iteration
   - Visual feedback and refinement

### Example Workflow:
```
1. Drag assets to canvas
2. Right-click → AI Assistant
3. Click objects to reference them
4. Ask: "Make these objects interact"
5. Copy context to Cursor
6. Get implementation code
7. Test in the visual interface
8. Iterate and improve
```

## 🎮 Step 7: Common First-Time Tasks

### Task 1: Create a Simple Scene
```
1. Drag a background image to canvas
2. Add a player sprite
3. Add some boundary shapes (right-click canvas)
4. Enable "Epic Bouncing" in tools panel
5. Watch your player bounce around!
```

### Task 2: AI-Assisted Customization
```
1. Select your bouncing player
2. Ask AI: "Change the bounce speed and add rotation"
3. Copy context to Cursor for implementation
4. Apply the code changes
```

### Task 3: Save Your Project
```
1. Click "Save/Load" in top bar
2. Save as "My First Game"
3. Try loading it later
```

## 📚 Understanding the File Structure

When you're ready to dive deeper:

```
src/
├── components/
│   ├── AIGameAssistant.js    # The AI chat you're using
│   ├── GridCanvas.js         # Main game canvas
│   ├── AssetImage.js         # How objects are rendered
│   └── BouncingPhysics.js    # Physics system
├── utils/
│   ├── AssetScanner.js       # Finds your assets
│   └── IndexedDBManager.js   # Saves your projects
└── App.js                    # Main application
```

## 🎯 Step 8: Advanced AI Integration

### Custom Context Generation
The "Copy to Cursor" button generates context like this:
```
🎮 GAME ENGINE SCENE CONTEXT for Cursor AI

📊 Scene Overview:
- Total Objects: 2
- Assets: 1
- Shapes: 1

📦 Canvas Assets:
• player_sprite - Position: (150, 200) - Size: 64×64

🔷 Shapes:
• boundary_1 (boundary) - Position: (0, 400) - Size: 800×20

🤖 Please help me with: [Your request]
```

### Best Practices for Cursor Prompts:
1. **Always include scene context** (use Copy button)
2. **Be specific about objects**: Use [object_name] format
3. **Include coordinates**: "Move to x: 100, y: 200"
4. **Ask for explanations**: "Explain what this code does"
5. **Request alternatives**: "Show me 3 different ways to do this"

## 🚨 Troubleshooting

### Common Issues:

**"AI Assistant won't open"**
- Make sure you right-clicked an object (not empty canvas)
- Try refreshing the page (Ctrl+R)

**"Objects not clickable"**
- Make sure AI assistant overlay isn't blocking (it should be transparent)
- Try clicking directly on the object image

**"Copy button not working"**
- Check browser permissions for clipboard access
- Try manually selecting and copying the generated text

**"Development server won't start"**
```bash
# Kill any existing processes
npx kill-port 3000
npm start
```

## 🎓 Next Steps

### Week 1: Master the Basics
- [ ] Create 3 different scenes
- [ ] Use AI assistant for 5 different tasks
- [ ] Learn object referencing and coordinate clicking
- [ ] Save and load projects successfully

### Week 2: Dive Deeper
- [ ] Modify physics behavior with AI help
- [ ] Add custom assets to the asset folders
- [ ] Create a simple interactive game
- [ ] Share your project with others

### Week 3: Advanced Features
- [ ] Extend the AI assistant with custom commands
- [ ] Create reusable game templates
- [ ] Integrate external APIs or services
- [ ] Contribute improvements back to the engine

## 🤝 Getting Help

1. **Use the built-in AI assistant** - It's designed to help!
2. **Ask Cursor AI** - Paste scene context for detailed help
3. **Check the documentation** - Comprehensive guides included
4. **Join the community** - Share your creations and get feedback

## 🎉 You're Ready!

Congratulations! You now have:
- ✅ A working game development environment
- ✅ AI assistant integration
- ✅ Understanding of the workflow
- ✅ Tools to create amazing games

**Start creating and let the AI help you bring your ideas to life!** 🚀

---

*Remember: The best way to learn is by doing. Start with simple ideas and gradually build complexity with AI assistance.* 