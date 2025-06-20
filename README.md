# 🎮 Game Engine v5

A modern, browser-based 2D game engine built with React and Konva. Perfect for rapid prototyping, level design, and game development with AI-powered assistance.

![Game Engine v5](https://img.shields.io/badge/Version-5.0-blue) ![React](https://img.shields.io/badge/React-19.1.0-61dafb) ![Konva](https://img.shields.io/badge/Konva-9.3.20-orange) ![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

### 🎯 **Core Engine Capabilities**
- **Visual Level Editor**: Drag-and-drop interface for rapid scene creation
- **Advanced Grid System**: 60px grid with live coordinate tracking and snap-to-grid positioning
- **Live Coordinate Display**: Real-time pixel, grid, and snap coordinates in bottom-left corner
- **Universal Asset Management**: Browse any folder on your system + organized asset library with real-time preview
- **Shape Tools**: Create boundaries, hitboxes, triggers, and collision boxes with visual feedback
- **Object Manipulation**: Select, move, resize, rotate, rename, and delete objects with transform handles
- **Smart Context Menus**: Right-click anywhere (canvas OR sidebar) for context-sensitive actions
- **Project Persistence**: Auto-save with IndexedDB storage and reliable file handling
- **Export/Import**: Save and load complete projects with asset persistence

### 🤖 **AI Integration Ready**
- **Cursor IDE Integration**: Optimized for AI-assisted development with comprehensive documentation
- **Universal Asset Scanning**: Automatic discovery of assets from any folder on your system
- **AI Notepad System**: Collect object information from canvas AND sidebar for AI analysis
- **Clean Codebase**: Well-documented, AI-readable code structure with no lint errors
- **Modular Architecture**: Easy to extend with AI-generated components and features

### 🎨 **User Experience**
- **Modern Dark Theme**: Professional interface optimized for long sessions
- **Responsive Design**: Works on various screen sizes
- **Keyboard Shortcuts**: Efficient workflow with hotkeys
- **Visual Feedback**: Hover effects, selection indicators, transform handles
- **Error Handling**: Graceful error recovery and user feedback

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1. **Clone or Download** the project
2. **Navigate** to the Game-engineV1 directory
3. **Install dependencies**:
```bash
npm install
   ```
4. **Start the development server**:
   ```bash
npm start
   ```
5. **Open** your browser to `http://localhost:3000`

### First Launch
The engine will automatically:
- Initialize the grid system
- Load any existing autosave data
- Scan for available assets
- Set up the workspace

## 📖 User Guide

### 🎮 **Basic Usage**

#### **Adding Assets to Your Scene**
1. **Browse Asset Folder** to load images from any directory on your computer
2. **Drag assets** from the sidebar to the canvas
3. Assets automatically snap to the 60px grid with visual feedback
4. **Right-click** assets (in sidebar OR on canvas) for options (add to notes, rename, lock, delete, etc.)

#### **Creating Shapes**
1. **Right-click** on empty canvas space
2. Choose from shape options:
   - **🧱 Boundary**: Solid walls and barriers
   - **🎯 Hit Box**: Character interaction zones  
   - **⚡ Trigger**: Event activation areas
   - **💥 Collision Box**: Physics collision detection
3. **Click and drag** to size your shape
4. **Right-click** shapes to change type or properties

#### **Object Manipulation**
- **Select**: Click on any object
- **Move**: Drag selected objects
- **Resize**: Drag corner handles
- **Rotate**: Use rotation handle
- **Multi-select**: Hold Ctrl/Cmd and click multiple objects
- **Group**: Right-click selection → "Create Group"

#### **Context Menus**
Right-click anywhere for context-sensitive options:
- **On Canvas Objects**: Rename, lock, layer control, delete, add to notes
- **On Sidebar Assets**: Add to notes, rename, delete
- **On Canvas**: Add shapes, create groups, access coordinate info, open notes
- **Smart Positioning**: Menus automatically adjust to stay on-screen
- **Live Coordinates**: See exact pixel and grid coordinates in context menus

### 💾 **Project Management**
- **Auto-save**: Projects save automatically every 30 seconds
- **Manual Save**: Use the save button in the top bar
- **Load Projects**: Access saved projects from the save menu
- **Export**: Download projects as JSON files
- **Clear Scene**: Reset the entire canvas (with confirmation)

### 📝 **AI Notepad System**
1. **Right-click** any object (canvas OR sidebar) → "Add to Notes"
2. **Click the AI Notepad button** in the top-right corner for manual access
3. Use the **Notes window** to collect object information in a clean, copyable format
4. **Copy to Clipboard** for use with external AI tools like ChatGPT or Claude
5. **Drag and resize** the notes window as needed
6. **Clear notes** or keep them persistent across sessions

### 📍 **Live Coordinate System**
- **Bottom-left display** shows real-time coordinates as you move your mouse
- **Pixel coordinates** for exact positioning
- **Grid coordinates** showing which grid cell you're in  
- **Snap coordinates** showing where objects will align to
- **Context menu coordinates** for precise placement and reference

## 🆕 **Recent Updates & Improvements**

### **v5.1 - Enhanced User Experience**
- ✅ **Live Coordinate Display**: Real-time position tracking in bottom-left corner
- ✅ **Sidebar Context Menus**: Right-click assets in sidebar for "Add to Notes", rename, delete
- ✅ **Universal Asset Loading**: Browse and load assets from any folder on your system
- ✅ **Smart Context Menu Positioning**: Menus automatically reposition to stay on screen
- ✅ **Memory Leak Fixes**: Improved performance with proper event cleanup
- ✅ **Asset Persistence**: Reliable file handling with base64 encoding for custom assets
- ✅ **Enhanced Grid System**: 60px grid with visual feedback and coordinate integration
- ✅ **Code Quality**: Zero ESLint errors, clean codebase ready for AI development

### **Key Bug Fixes**
- 🐛 Fixed grid coordinate system alignment issues
- 🐛 Fixed context menus getting "stuck" on screen
- 🐛 Fixed drag-and-drop interference with sidebar
- 🐛 Fixed double transform handles on objects
- 🐛 Fixed object positioning "jumping" during transforms
- 🐛 Fixed asset thumbnails disappearing after folder changes
- 🐛 Fixed right-click functionality on background images

## 🤖 Cursor IDE Integration Guide

### **Setup for AI Development**

#### **1. Workspace Configuration**
```json
// .cursor/settings.json
{
  "typescript.preferences.includePackageJsonAutoImports": "on",
  "editor.codeActionsOnSave": {
    "source.organizeImports": true
  },
  "files.associations": {
    "*.js": "javascriptreact"
  }
}
```

#### **2. AI Assistant Prompts**
Use these optimized prompts for game development:

**For Asset Creation:**
```
Create a new sprite asset for [description]. Save it to public/assets/sprites/ and update the asset scanner. The image should be [dimensions] and follow the existing art style.
```

**For Component Development:**
```
Add a new game component that [functionality]. It should integrate with the existing GridCanvas system and follow the established patterns in src/components/.
```

**For Feature Extensions:**
```
Extend the game engine with [feature]. Maintain compatibility with the existing save/load system and ensure proper integration with the context menu system.
```

#### **3. Recommended File Structure for AI**
```
src/
├── components/          # React components (AI can modify)
│   ├── GridCanvas.js   # Main canvas component
│   ├── Sidebar.js      # Asset management
│   ├── SaveMenu.js     # Project persistence
│   └── AIGameAssistant.js # Notes system
├── utils/              # Utility functions (AI can extend)
│   ├── AssetScanner.js # Asset discovery
│   └── IndexedDBManager.js # Data persistence
└── App.js              # Main application (AI can modify)

public/assets/          # Asset folders (AI can add files)
├── sprites/           # Character and object sprites
├── backgrounds/       # Background images
├── ui/               # User interface elements
└── temp/             # Temporary/test assets
```

#### **4. AI Development Patterns**
- **Component Structure**: Follow existing React patterns
- **State Management**: Use React hooks (useState, useEffect)
- **Event Handling**: Integrate with Konva event system
- **Asset Integration**: Use the AssetScanner utility
- **Persistence**: Extend IndexedDBManager for new data types

### **Common AI Tasks**

#### **Adding New Asset Types**
1. Add files to appropriate `public/assets/` folder
2. Update `AssetScanner.js` if needed
3. Test drag-and-drop functionality

#### **Creating New Shape Types**
1. Extend the shape creation system in `GridCanvas.js`
2. Add new context menu options
3. Update the shape rendering logic

#### **Adding Game Logic**
1. Create new components in `src/components/`
2. Integrate with the main canvas system
3. Add save/load support if needed

## 🛠️ Development

### **Project Structure**
```
Game-engineV1/
├── public/
│   ├── assets/              # Game assets organized by type
│   │   ├── sprites/         # Character and object sprites
│   │   ├── backgrounds/     # Background images
│   │   ├── ui/             # UI elements
│   │   └── temp/           # Temporary assets
│   └── index.html          # Main HTML file
├── src/
│   ├── components/         # React components
│   ├── utils/             # Utility functions
│   ├── App.js             # Main application
│   ├── App.css            # Component styles
│   └── index.css          # Global styles
├── package.json           # Dependencies and scripts
└── README.md             # This file
```

### **Key Dependencies**
- **React 19.1.0**: Modern React with latest features
- **Konva 9.3.20**: 2D canvas library for graphics
- **react-konva 19.0.6**: React bindings for Konva
- **use-image 1.1.4**: Image loading utility

### **Available Scripts**
```bash
npm start      # Start development server
npm build      # Create production build
npm test       # Run test suite
npm eject      # Eject from Create React App (not recommended)
```

### **Building for Production**
```bash
npm run build
```
Creates optimized production build in the `build/` folder.

## 🎯 Use Cases

### **Game Development**
- **Level Design**: Create game levels with visual tools
- **Collision Detection**: Set up hitboxes and collision boundaries
- **Trigger Systems**: Define interactive areas and events
- **Asset Organization**: Manage sprites and backgrounds efficiently

### **Prototyping**
- **Rapid Iteration**: Quickly test game concepts
- **Visual Mockups**: Create interactive prototypes
- **Gameplay Testing**: Test mechanics without coding

### **Education**
- **Game Design Learning**: Visual tool for understanding game structure
- **Programming Education**: Well-documented codebase for learning
- **AI Integration**: Perfect for learning AI-assisted development

## 🔧 Customization

### **Adding New Asset Types**
1. Create folder in `public/assets/`
2. Update `ASSET_FOLDERS` in `AssetScanner.js`
3. Add file type support if needed

### **Custom Shape Types**
1. Extend `DrawableShape` component
2. Add shape type to context menus
3. Update save/load logic

### **UI Themes**
1. Modify CSS variables in `index.css`
2. Update color schemes in component styles
3. Maintain accessibility standards

## 🐛 Troubleshooting

### **Common Issues**

#### **Assets Not Loading**
- Ensure assets are in the correct `public/assets/` folders
- Check file permissions and naming conventions
- Refresh the browser to reload asset cache

#### **Canvas Performance**
- Limit the number of objects on screen
- Use object pooling for dynamic elements
- Consider using Konva's caching features

#### **Save/Load Issues**
- Check browser's IndexedDB support
- Clear browser storage if corrupted
- Ensure sufficient storage space

#### **Context Menu Problems**
- Right-click functionality may be browser-dependent
- Check for conflicting browser extensions
- Ensure JavaScript is enabled

### **Browser Compatibility**
- **Chrome**: Full support (recommended)
- **Firefox**: Full support
- **Safari**: Full support (macOS/iOS)
- **Edge**: Full support

## 📄 License

MIT License - feel free to use this engine for personal or commercial projects.

## 🤝 Contributing

This engine is designed to be extended and customized. Whether you're adding features manually or using AI assistance, the codebase is structured to be easily understood and modified.

### **Getting Help**
- Check the inline code documentation
- Use the Notes system to collect information for AI assistants
- The codebase follows React best practices for easy understanding

---

**Ready to build your game? Start the engine and let your creativity flow!** 🚀
