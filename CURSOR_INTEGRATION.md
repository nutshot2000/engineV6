# 🤖 Cursor IDE Integration Guide

*Maximize your AI-assisted game development with Game Engine v6*

## 🎯 Why Cursor + Game Engine v6?

This game engine is specifically designed for AI-assisted development:
- **Clean, readable codebase** with zero ESLint errors that AI can understand and modify
- **Modular architecture** perfect for incremental AI improvements  
- **Well-documented components** with clear patterns for AI to follow
- **Universal asset management** that can load from any folder on your system
- **AI Notepad system** for collecting information from canvas AND sidebar to share with AI
- **Live coordinate system** for precise positioning and development feedback

## 🚀 Quick Setup for Cursor

### 1. **Open Project in Cursor**
```bash
cursor path/to/Game-engineV1
```

### 2. **Install Dependencies**
```bash
npm install
```

### 3. **Start Development Server**
```bash
npm start
```

### 4. **Configure Cursor Settings**
Create `.cursor/settings.json`:
```json
{
  "typescript.preferences.includePackageJsonAutoImports": "on",
  "editor.codeActionsOnSave": {
    "source.organizeImports": true
  },
  "files.associations": {
    "*.js": "javascriptreact"
  },
  "editor.suggest.snippetsPreventQuickSuggestions": false,
  "editor.wordBasedSuggestions": true
}
```

## ✨ **New AI-Friendly Features (v5.1)**

### **📍 Live Coordinate System**
- **Real-time feedback**: Bottom-left display shows pixel, grid, and snap coordinates
- **Context menu integration**: Right-click anywhere to see exact coordinates
- **Development aid**: Perfect for AI-assisted precise positioning
- **Grid alignment**: 60px grid system with visual feedback

### **🖱️ Universal Context Menus**
- **Canvas objects**: Right-click for rename, lock, delete, add to notes
- **Sidebar assets**: Right-click for add to notes, rename, delete
- **Smart positioning**: Menus automatically reposition to stay on screen
- **Coordinate display**: See exact position info in context menus

### **📝 Enhanced AI Notepad**
- **Universal access**: Collect info from canvas objects AND sidebar assets
- **Clean format**: Information formatted for easy AI consumption
- **Persistent**: Notes stay across sessions
- **Copy-friendly**: One-click copy to clipboard for AI tools

### **🗂️ Universal Asset Management**
- **Any folder**: Browse and load assets from anywhere on your system
- **Auto-organization**: Assets grouped by subfolder automatically
- **Reliable persistence**: Base64 encoding ensures assets survive page reloads
- **Format support**: PNG, JPG, GIF, SVG, WebP, BMP, and audio files

## 🧠 AI-Optimized Prompts

### **🎨 Asset Creation**
```
Create a [asset type] sprite for [description]. 
- The user can load assets from any folder using "Browse Asset Folder"
- Size: [dimensions]px
- Style: Match existing game art
- Format: PNG, JPG, GIF, SVG, WebP, or audio files supported
- Assets automatically persist with base64 encoding
- Right-click assets in sidebar to "Add to Notes" for AI analysis
```

### **🔧 Component Development**
```
Add a new React component for [functionality].
- Location: src/components/[ComponentName].js
- Integration: GridCanvas system
- Patterns: Follow existing component structure
- State: Use React hooks (useState, useEffect)
- Events: Integrate with Konva event system
```

### **⚡ Feature Extensions**
```
Extend the game engine with [feature].
- Maintain: Existing save/load compatibility
- Integration: Context menu system
- Performance: Optimize for canvas rendering
- Documentation: Add inline comments
```

### **🎮 Game Logic**
```
Implement [game mechanic] system.
- Architecture: Component-based design
- State: Centralized in App.js or new context
- Persistence: Extend IndexedDBManager
- UI: Add controls to appropriate panels
```

## 📁 File Structure Guide for AI

### **🎯 High-Priority Files** (AI should focus here)
```
src/
├── App.js                 # Main app - safe to modify
├── components/
│   ├── GridCanvas.js     # Canvas system - extend carefully
│   ├── Sidebar.js        # Asset management - safe to modify
│   ├── SaveMenu.js       # Project persistence - safe to modify
│   └── AIGameAssistant.js # Notes system - safe to modify
└── utils/
    ├── AssetScanner.js   # Asset discovery - extend as needed
    └── IndexedDBManager.js # Data storage - extend carefully
```

### **🔒 Protected Files** (Modify with caution)
```
src/
├── index.js              # React entry point - rarely change
├── index.css             # Global styles - extend, don't replace
└── components/
    ├── AssetImage.js     # Core asset rendering
    └── ParticleSystem.js # Effects system
```

### **✅ Safe to Modify/Add**
```
public/assets/            # Add any assets here
src/components/           # Add new components
src/utils/               # Add utility functions
```

## 🛠️ Development Patterns

### **Component Creation Pattern**
```javascript
import React, { useState, useEffect, useRef } from 'react';

function NewComponent({ prop1, prop2, onUpdate }) {
  const [state, setState] = useState(initialValue);
  const componentRef = useRef(null);

  useEffect(() => {
    // Setup and cleanup
    return () => {
      // Cleanup
    };
  }, [dependencies]);

  const handleEvent = (e) => {
    // Event handling
    onUpdate(newData);
  };

  return (
    <div ref={componentRef} className="new-component">
      {/* Component JSX */}
    </div>
  );
}

export default NewComponent;
```

### **Konva Integration Pattern**
```javascript
import { Group, Rect, Circle } from 'react-konva';

function KonvaComponent({ x, y, onSelect, onChange }) {
  return (
    <Group
      x={x}
      y={y}
      draggable
      onClick={onSelect}
      onDragEnd={(e) => {
        onChange({
          x: e.target.x(),
          y: e.target.y()
        });
      }}
    >
      <Rect width={100} height={100} fill="blue" />
    </Group>
  );
}
```

### **State Management Pattern**
```javascript
// In App.js or component
const [gameObjects, setGameObjects] = useState([]);

const addGameObject = (newObject) => {
  setGameObjects(prev => [...prev, { 
    ...newObject, 
    id: Date.now() 
  }]);
};

const updateGameObject = (id, updates) => {
  setGameObjects(prev => 
    prev.map(obj => 
      obj.id === id ? { ...obj, ...updates } : obj
    )
  );
};
```

## 🎯 Common AI Tasks

### **1. Adding New Asset Types**
**Prompt:**
```
Add support for [asset type] assets:
1. Create folder public/assets/[type]/
2. Update ASSET_FOLDERS in AssetScanner.js
3. Add drag-and-drop support in Sidebar.js
4. Test with sample assets
```

**Files to modify:**
- `src/utils/AssetScanner.js`
- `src/components/Sidebar.js`

### **2. Creating New Shape Tools**
**Prompt:**
```
Add a new shape tool for [shape type]:
1. Extend DrawableShape component in GridCanvas.js
2. Add context menu option
3. Add shape type to currentShapeType options
4. Update shape rendering and styling
```

**Files to modify:**
- `src/components/GridCanvas.js`
- `src/index.css` (for styling)

### **3. Implementing Game Mechanics**
**Prompt:**
```
Implement [mechanic] system:
1. Create new component for game logic
2. Add state management in App.js
3. Integrate with canvas event system
4. Add UI controls in tools panel
5. Extend save/load system
```

**Files to create/modify:**
- `src/components/[MechanicName].js` (new)
- `src/App.js` (modify)
- `src/utils/IndexedDBManager.js` (extend)

### **4. Adding UI Features**
**Prompt:**
```
Add [UI feature] to the interface:
1. Create component in src/components/
2. Add to App.js layout
3. Style with CSS following existing patterns
4. Integrate with existing state management
```

## 🔍 Debugging with AI

### **Common Issues and Solutions**

**Canvas Performance:**
```
Optimize canvas performance:
1. Check for memory leaks in useEffect cleanup
2. Implement object pooling for dynamic elements
3. Use Konva caching for static elements
4. Limit re-renders with React.memo
```

**State Synchronization:**
```
Fix state sync issues:
1. Check useEffect dependencies
2. Ensure proper key props on lists
3. Verify event handler references
4. Use functional state updates
```

**Asset Loading:**
```
Debug asset loading problems:
1. Check file paths in AssetScanner.js
2. Verify CORS settings for external assets
3. Add error handling to asset loading
4. Check browser network tab for failed requests
```

## 📊 AI Development Workflow

### **1. Planning Phase**
- Use the Notes system to collect requirements
- Ask AI to analyze existing code structure
- Plan component architecture with AI assistance

### **2. Development Phase**
- Start with AI-generated component scaffolds
- Iterate with AI on implementation details
- Use AI for code review and optimization

### **3. Testing Phase**
- Ask AI to generate test scenarios
- Use AI to identify edge cases
- Get AI help with debugging issues

### **4. Documentation Phase**
- Have AI generate inline documentation
- Create user-facing documentation with AI
- Update this guide with new patterns

## 🚀 Advanced AI Integration

### **Custom AI Workflows**
Create `.cursor/ai-workflows.json`:
```json
{
  "gamedev": {
    "name": "Game Development",
    "steps": [
      "Analyze existing code structure",
      "Plan component architecture", 
      "Generate component scaffolds",
      "Implement core functionality",
      "Add error handling",
      "Update documentation"
    ]
  }
}
```

### **AI Code Generation Templates**
Save common patterns as Cursor snippets for consistent AI generation.

### **Automated Testing with AI**
Use AI to generate test cases and identify potential bugs before they occur.

## 💡 Pro Tips

1. **Be Specific**: Give AI detailed context about the game engine architecture
2. **Incremental Changes**: Make small, focused changes that AI can understand
3. **Use Examples**: Reference existing components when asking for new features
4. **Test Frequently**: Run the app after each AI-generated change
5. **Document Changes**: Keep the Notes system updated with modifications

---

**Ready to supercharge your game development with AI? Let's build something amazing!** 🎮🤖 