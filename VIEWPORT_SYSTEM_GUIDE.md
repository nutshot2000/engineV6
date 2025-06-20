# 🎮 Game Engine v6 - Viewport System Guide for AI Assistant

## 📐 **Viewport Specifications**

### **Core Dimensions**
- **Viewport Size**: 1920x1080 pixels (16:9 aspect ratio)
- **Grid System**: 32px grid cells
- **Grid Layout**: 60 columns × 33.75 rows (34 effective rows)
- **Coordinate System**: (0,0) at top-left, (1920,1080) at bottom-right

### **Visual Layout**
- **Bordered Viewport**: Teal border (#4ecdc4) with rounded corners
- **Centered Display**: Maximizes horizontal space while maintaining 16:9 ratio
- **Responsive Scaling**: Automatically scales to fit available screen space
- **Grid Overlay**: 32px spacing with visual grid lines

## 🎯 **Starting a New Game Project**

### **1. Background Setup**
```javascript
// Perfect for 1920x1080 backgrounds
// Place background images in: public/assets/backgrounds/
// Recommended formats: PNG, JPG, SVG
// Exact dimensions: 1920x1080 for pixel-perfect fit
```

### **2. Coordinate Reference Points**
- **Center**: (960, 540)
- **Top-Left**: (0, 0)
- **Top-Right**: (1920, 0)
- **Bottom-Left**: (0, 1080)
- **Bottom-Right**: (1920, 1080)

### **3. Common Game Element Positions**

#### **Player Starting Positions**
- **Center Screen**: (960, 540)
- **Bottom Center**: (960, 900) - good for platformers
- **Left Side**: (200, 540) - side-scrollers
- **Custom**: Any (x, y) within 0-1920, 0-1080

#### **UI Element Zones**
- **HUD Area**: Top 100px (y: 0-100)
- **Game Area**: Middle section (y: 100-980)
- **Controls/Info**: Bottom 100px (y: 980-1080)

### **4. Collision Box Guidelines**

#### **Boundary Boxes** (Red)
```javascript
// Screen boundaries
{ x: 0, y: 0, width: 1920, height: 1080 }

// Platform boundaries
{ x: 300, y: 800, width: 600, height: 32 }
```

#### **Hit Boxes** (Teal)
```javascript
// Player hit box (typical)
{ x: playerX-16, y: playerY-24, width: 32, height: 48 }

// Enemy hit box
{ x: enemyX-20, y: enemyY-20, width: 40, height: 40 }
```

#### **Trigger Zones** (Yellow)
```javascript
// Door/portal trigger
{ x: 1800, y: 400, width: 120, height: 200 }

// Collectible trigger
{ x: itemX-24, y: itemY-24, width: 48, height: 48 }
```

#### **Collision Boxes** (Orange)
```javascript
// Wall collision
{ x: 0, y: 0, width: 32, height: 1080 }

// Platform collision
{ x: 400, y: 600, width: 400, height: 32 }
```

## 🎨 **Asset Guidelines**

### **Sprite Sizing**
- **Characters**: 32x32, 48x48, or 64x64 pixels
- **Tiles**: 32x32 pixels (matches grid)
- **Backgrounds**: 1920x1080 pixels
- **UI Elements**: Multiples of 32px when possible

### **Asset Positioning**
- **Grid Snapping**: Use grid coordinates for precise placement
- **Pixel Coordinates**: For fine-tuned positioning
- **Center Registration**: Most sprites use center-point positioning

## 🎮 **Game Types & Layouts**

### **Platformer Games**
```javascript
// Typical setup
- Background: Full 1920x1080 landscape
- Player start: (200, 900)
- Platforms: y-coordinates 600, 800, 1000
- Boundaries: Floor at y: 1040, walls at x: 0 and x: 1920
```

### **Top-Down Games**
```javascript
// Typical setup
- Background: Full 1920x1080 map view
- Player start: (960, 540) - center
- Boundaries: Full screen perimeter
- Objects: Distributed across full area
```

### **Side-Scrolling Games**
```javascript
// Typical setup
- Background: Repeating or wide landscape
- Player start: (300, 700)
- Camera follow: Player x-position
- Boundaries: Top/bottom only
```

## 🔧 **Technical Integration**

### **Mouse Coordinates**
- **Screen to Viewport**: Automatically converted
- **Grid Snapping**: Available via snapToGrid() function
- **Live Display**: Shows pixel, grid, and snap coordinates

### **Asset Dragging**
- **Automatic Conversion**: Screen coordinates → viewport coordinates
- **Boundary Clamping**: Keeps assets within 0-1920, 0-1080
- **Grid Alignment**: Optional snap-to-grid functionality

### **Shape Drawing**
- **All shapes**: Use viewport coordinate system
- **Collision detection**: Based on viewport coordinates
- **Export/Import**: Saves in viewport coordinate format

## 📝 **AI Assistant Guidelines**

### **When Helping with Game Setup**
1. **Always reference 1920x1080 dimensions**
2. **Use grid-friendly coordinates** (multiples of 32)
3. **Consider 16:9 aspect ratio** for layouts
4. **Suggest appropriate collision box sizes**
5. **Recommend proper asset dimensions**

### **Common Questions & Answers**
- **"How big should my player be?"** → 32x48 or 48x64 pixels typically
- **"Where should I place platforms?"** → Use y-coordinates like 600, 800, 1000
- **"What size background do I need?"** → Exactly 1920x1080 for perfect fit
- **"How do I center something?"** → Use x: 960, y: 540

### **Best Practices**
- **Start with background** before adding game objects
- **Use collision boxes** for all interactive elements
- **Test boundaries** to ensure proper game area containment
- **Consider UI space** when positioning gameplay elements
- **Use grid system** for consistent spacing and alignment

## 🚀 **Quick Start Template**

```javascript
// New Game Checklist:
1. Add 1920x1080 background image
2. Place player sprite at starting position
3. Add boundary boxes around game area
4. Create platform collision boxes
5. Add trigger zones for interactions
6. Test coordinate system with live display
7. Adjust positions using grid snapping
```

---

*This guide ensures the AI Game Assistant can provide accurate, viewport-aware assistance for game development in the new 1920x1080 coordinate system.* 