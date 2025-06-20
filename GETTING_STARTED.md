# 🚀 Getting Started with Game Engine v6

*A beginner-friendly guide to get you up and running in 5 minutes*

## 📋 What You Need

Before starting, make sure you have:
- A computer (Windows, Mac, or Linux)
- Internet connection
- About 10 minutes of your time

## 🔧 Step-by-Step Setup

### Step 1: Install Node.js
1. Go to [nodejs.org](https://nodejs.org)
2. Download the **LTS version** (recommended for most users)
3. Run the installer and follow the prompts
4. ✅ **Test**: Open terminal/command prompt and type `node --version`

### Step 2: Get the Game Engine
1. Download or clone this project
2. Extract the files if you downloaded a ZIP
3. Open terminal/command prompt
4. Navigate to the `Game-engineV1` folder:
   ```bash
   cd path/to/Game-engineV1
   ```

### Step 3: Install Dependencies
```bash
npm install
```
*This downloads all the required packages (takes 1-2 minutes)*

### Step 4: Start the Engine
```bash
npm start
```
*Your browser should automatically open to `http://localhost:3000`*

## 🎮 Your First 5 Minutes

### 1. **Explore the Interface** (30 seconds)
- **Left Panel**: Asset library (drag things from here)
- **Center**: Canvas with grid (your game world)
- **Right Panel**: Tools and information

### 2. **Add Your First Asset** (1 minute)
- Click **"📁 Browse Asset Folder"** to load images from your computer
- Or look for existing assets in the left sidebar
- **Drag** any asset to the center canvas
- **Click** on it to select (you'll see handles around it)
- **Drag** to move it around - notice it snaps to the grid!

### 3. **Create Your First Shape** (1 minute)
- **Right-click** on empty canvas space
- Choose "🧱 Quick Boundary"
- **Click and drag** to create a rectangle
- **Right-click** the shape to rename it

### 4. **Try the Context Menus** (1 minute)
- **Right-click** on any object (canvas OR sidebar) for options
- Try **"📝 Add to Notes"** to collect object information
- Try renaming something
- Try changing a shape's type
- Notice the **live coordinates** in the bottom-left corner as you move your mouse!

### 5. **Save Your Work** (30 seconds)
- Click the **Save** button in the top bar
- Give your project a name
- It automatically saves every 30 seconds too!

## 🎯 What Can You Do Now?

### **Level Design**
- Create game levels by placing assets
- Add collision boundaries around walls
- Set up trigger zones for events

### **Game Planning**
- Use the Notes feature to plan your game
- Right-click objects → "Add to Notes"
- Copy information to share with others

### **Asset Organization**
- Use **"📁 Browse Asset Folder"** to load images from ANY folder on your computer
- The engine automatically scans and organizes your assets by subfolder
- Support for PNG, JPG, GIF, SVG, WebP, and audio files
- Assets persist across sessions with reliable file handling

## 🆘 Need Help?

### **Common Issues**

**❌ "npm is not recognized"**
- Node.js isn't installed properly
- Restart your terminal after installing Node.js
- Try the installer again

**❌ "Port 3000 is already in use"**
- Another app is using port 3000
- The engine will ask if you want to use a different port
- Just press 'Y' and continue

**❌ "Assets not showing"**
- Try clicking "📁 Browse Asset Folder" to load from your computer
- Make sure you selected a folder with image files
- Supported formats: PNG, JPG, JPEG, GIF, SVG, WebP, BMP, and audio files
- Check the browser console (F12) for any error messages

**❌ "Nothing happens when I right-click"**
- Make sure you're right-clicking on the canvas area
- Try clicking on different objects
- Some browsers block right-click - check your settings

### **Getting More Help**
1. Check the main README.md for detailed documentation
2. Look at the code - it's well-commented and easy to read
3. Use the Notes system to collect information for AI assistants

## 🎉 Next Steps

Once you're comfortable with the basics:

1. **Read the full README.md** for advanced features
2. **Add your own assets** to the asset folders
3. **Experiment with different shape types** (hitboxes, triggers, etc.)
4. **Try the grouping features** for complex objects
5. **Export your projects** to share with others

## 💡 Pro Tips

- **Watch the coordinates**: Live position tracking in bottom-left corner shows exactly where you are
- **Use the grid**: Objects snap to the 60px grid for perfect alignment
- **Right-click everything**: Context menus work on canvas AND sidebar assets
- **Try the AI Notepad**: Great for collecting object info to use with ChatGPT or Claude
- **Browse your own assets**: Load images from anywhere on your computer
- **Save often**: Though auto-save has you covered every 30 seconds
- **Experiment**: You can't break anything - just reload the page!
- **Use groups**: Select multiple objects and group them together

---

**Welcome to Game Engine v6! Start creating and have fun!** 🎮✨ 