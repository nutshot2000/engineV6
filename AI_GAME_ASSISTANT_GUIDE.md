# 🤖 AI Game Assistant - Interactive Object Referencing System

## Overview

The AI Game Assistant is an innovative feature that allows you to create games using natural language while directly interacting with objects in your scene. It combines scene analysis, interactive object referencing, and AI-powered command processing.

## Key Features

### 🔍 **Scene Analysis**
- Automatically scans your entire scene when opened
- Identifies all assets (sprites/images) and shapes (boundaries, hitboxes, triggers, collision boxes)
- Provides real-time object counts and spatial analysis
- Understands object positions, types, and relationships

### 🖱️ **Interactive Object Referencing**
- **Click objects while typing** to reference them directly in your commands
- Objects are automatically tagged with readable names like `[player]`, `[boundary rectangle]`, `[hitbox]`
- Visual feedback shows which objects you've referenced
- Smart cursor positioning maintains your typing flow
- **Draggable window** ensures objects remain clickable even when assistant is open

### 💬 **Natural Language Commands**
- Type commands in plain English: *"Give [player] WASD controls"*
- Reference multiple objects: *"Make [enemy] chase [player]"*
- Ask for suggestions: *"What should I put in this empty area?"*
- Create complex interactions: *"Create a simple platformer"*

## How to Use

### 1. **Opening the AI Assistant**
- Right-click anywhere on the canvas
- Select **🤖 AI Game Assistant** from the context menu
- The assistant opens with automatic scene analysis

### 1.5. **Moving the Assistant Window**
- **Drag the header** to move the window anywhere on screen
- **🏠 Reset button** returns window to center position
- **Smart boundaries** prevent dragging off-screen
- **Visual feedback** shows dragging state with enhanced shadows

### 2. **Referencing Objects**
- Start typing your command in the text box
- **Click any object in the viewport** while typing
- The object name appears as a clickable tag: `[Object Name]`
- Continue typing to complete your command

### 3. **Example Workflow**
```
1. Type: "Give "
2. Click the player sprite → "Give [player] "
3. Continue: "Give [player] WASD controls"
4. Press Enter or click ✨ Create
```

## Supported Commands

### 🎮 **Movement & Controls**
- `"Give [object] WASD controls"`
- `"Add movement to [player]"`
- `"Make [character] move with arrow keys"`

### 👾 **AI Behaviors**
- `"Add an enemy that chases [player]"`
- `"Make [enemy] patrol between [point1] and [point2]"`
- `"Create AI that follows [target]"`

### 🏗️ **Game Mechanics**
- `"Create a simple platformer"`
- `"Add gravity to [object]"`
- `"Set up collision between [player] and [boundary]"`

### 🎨 **Scene Enhancement**
- `"What should I put in this empty area?"`
- `"Add decorations around [building]"`
- `"Create power-ups near [platform]"`

## Technical Architecture

### **Scene Data Access**
```javascript
// All objects are analyzed and accessible:
{
  totalObjects: 15,
  assets: 8,        // Sprites/images
  shapes: 7,        // Boundaries, hitboxes, etc.
  boundaries: 3,
  hitboxes: 2,
  triggers: 1,
  collisionBoxes: 1
}
```

### **Object Metadata**
Each referenced object includes:
- **Identity**: `id`, `name`, `type`, `category`
- **Transform**: `x`, `y`, `width`, `height`, `rotation`
- **State**: `locked`, `visible`, `active`
- **Behavior**: Custom properties and scripts

### **Command Processing**
1. **Parse** natural language input
2. **Extract** referenced objects from tags
3. **Analyze** spatial relationships and context
4. **Generate** appropriate game logic
5. **Execute** changes to scene objects

## Advanced Features

### 🏷️ **Object Tagging System**
- Objects are automatically given readable names
- Multiple objects can be tagged in one command
- Tagged objects are highlighted in the scene
- Clear tagged objects with the "Clear" button

### 📊 **Real-Time Scene Analysis**
- Scene statistics update automatically
- Spatial analysis for overlap detection
- Distance calculations between objects
- Area-based queries and suggestions

### 🔄 **Conversation History**
- Full conversation log with timestamps
- Referenced objects shown for each message
- Command history for repeated actions
- Context awareness across multiple commands

## Integration with Game Engine

### **Object Creation**
- Creates new assets and shapes as needed
- Integrates with existing asset management system
- Respects grid alignment and snapping
- Maintains proper z-ordering

### **Behavior Systems**
- Adds script components to objects
- Creates movement controllers
- Sets up collision detection
- Implements AI behaviors

### **Project Management**
- Changes are saved automatically
- Integrates with IndexedDB storage
- Maintains project consistency
- Supports undo/redo operations

## Best Practices

### ✅ **Effective Commands**
- Be specific about what you want
- Reference objects by clicking them
- Use descriptive language
- Ask follow-up questions for clarification

### 🎯 **Object Referencing**
- Click objects while typing for best results
- Use multiple references in complex commands
- Clear tags when starting new commands
- Reference objects by their visual position if needed

### 🚀 **Workflow Tips**
- Start with simple commands to test behavior
- Build complexity gradually
- Use the scene analysis information
- Ask the AI for suggestions when stuck

## Future Enhancements

- **Visual Scripting**: Drag-and-drop behavior creation
- **Code Generation**: Export playable game code
- **Asset Suggestions**: AI-powered asset recommendations
- **Multiplayer Support**: Collaborative AI assistance
- **Voice Commands**: Speech-to-text integration

## Troubleshooting

### Common Issues
- **Objects not referencing**: Make sure to click objects while typing
- **Commands not working**: Check that objects are properly tagged
- **Scene not updating**: Refresh the assistant to re-analyze the scene

### Performance Notes
- Scene analysis runs automatically when opened
- Large scenes (100+ objects) may take a moment to analyze
- Object referencing is optimized for real-time interaction

---

The AI Game Assistant represents a new paradigm in game development - where natural language meets visual interaction to create an intuitive, powerful game creation experience. 🎮✨ 