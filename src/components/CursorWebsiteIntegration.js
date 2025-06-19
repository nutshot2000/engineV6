import React, { useState } from 'react';

const CursorWebsiteIntegration = ({ projectData, canvasAssets, shapes }) => {
  const [exportType, setExportType] = useState('context');

  // Generate code that users can copy to their own projects
  const generateGameCode = () => {
    const gameCode = `
// Game created with GameMaker - Generated Code
const gameConfig = {
  canvas: {
    width: 800,
    height: 600,
    backgroundColor: '#2a2a2a'
  },
  
  assets: [
    ${canvasAssets.map(asset => `
    {
      id: '${asset.id}',
      name: '${asset.name}',
      x: ${asset.x},
      y: ${asset.y},
      width: ${asset.width},
      height: ${asset.height},
      rotation: ${asset.rotation || 0},
      src: '${asset.src}'
    }`).join(',')}
  ],
  
  shapes: [
    ${shapes.map(shape => `
    {
      id: '${shape.id}',
      type: '${shape.type}',
      shapeType: '${shape.shapeType}',
      x: ${shape.x},
      y: ${shape.y},
      width: ${shape.width},
      height: ${shape.height}
    }`).join(',')}
  ]
};

// Basic game loop (extend this with Cursor AI)
class Game {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.assets = gameConfig.assets;
    this.shapes = gameConfig.shapes;
    this.init();
  }
  
  init() {
    this.canvas.width = gameConfig.canvas.width;
    this.canvas.height = gameConfig.canvas.height;
    this.gameLoop();
  }
  
  gameLoop() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Render assets
    this.assets.forEach(asset => {
      // TODO: Load and render images
      this.ctx.fillStyle = '#4CAF50';
      this.ctx.fillRect(asset.x, asset.y, asset.width, asset.height);
    });
    
    // Render shapes
    this.shapes.forEach(shape => {
      this.ctx.strokeStyle = '#FF5722';
      this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
    });
    
    requestAnimationFrame(() => this.gameLoop());
  }
}

// Start game
const game = new Game();

// Next steps with Cursor AI:
// 1. Add player movement controls
// 2. Implement collision detection
// 3. Add game mechanics (scoring, enemies, etc.)
// 4. Add sound effects and animations
`;

    return gameCode;
  };

  // Generate Cursor AI context for advanced help
  const generateCursorContext = () => {
    return `
🎮 GAME PROJECT CONTEXT for Cursor AI

I created a game using a visual game maker and need help extending it with code.

📊 Current Game State:
- Canvas: 800x600 pixels
- Assets: ${canvasAssets.length} objects placed
- Shapes: ${shapes.length} collision/boundary objects
- Engine: HTML5 Canvas with JavaScript

📦 Game Objects:
${canvasAssets.map(asset => 
  `• ${asset.name} - Position: (${asset.x}, ${asset.y}) - Size: ${asset.width}x${asset.height}`
).join('\n')}

🔷 Game Shapes:
${shapes.map(shape => 
  `• ${shape.shapeType} ${shape.type} - Position: (${shape.x}, ${shape.y}) - Size: ${shape.width}x${shape.height}`
).join('\n')}

💻 Generated Base Code:
\`\`\`javascript
${generateGameCode()}
\`\`\`

🤖 What I need help with:
[Describe what you want to add - player controls, enemies, scoring, etc.]

Please help me extend this game with the features I need!
`;
  };

  // Generate complete project for download
  const generateProjectExport = () => {
    const htmlFile = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Game - Created with GameMaker</title>
    <style>
        body {
            margin: 0;
            padding: 20px;
            background: #1a1a1a;
            color: white;
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }
        #gameCanvas {
            border: 2px solid #333;
            background: #2a2a2a;
        }
        .game-container {
            text-align: center;
        }
        .instructions {
            margin-top: 20px;
            opacity: 0.7;
        }
    </style>
</head>
<body>
    <div class="game-container">
        <h1>🎮 My Game</h1>
        <canvas id="gameCanvas"></canvas>
        <div class="instructions">
            <p>Game created with GameMaker • Enhanced with Cursor AI</p>
            <p>Use arrow keys to move (when implemented)</p>
        </div>
    </div>
    
    <script>
        ${generateGameCode()}
    </script>
</body>
</html>`;

    return {
      'index.html': htmlFile,
      'README.md': `
# My Game

Created with GameMaker and enhanced with Cursor AI.

## How to Run
1. Open index.html in a web browser
2. Or serve with a local server: \`python -m http.server 8000\`

## Next Steps with Cursor AI
1. Open this project in Cursor IDE
2. Use Cursor AI to add features:
   - Player movement controls
   - Collision detection
   - Game mechanics
   - Sound effects
   - Animations

## Current Features
- Visual game objects positioned as designed
- Basic rendering loop
- Collision shapes for game logic

Extend this foundation with Cursor AI assistance!
`,
      'game.js': generateGameCode()
    };
  };

  const handleExport = () => {
    switch (exportType) {
      case 'context':
        navigator.clipboard.writeText(generateCursorContext());
        alert('🤖 Cursor AI context copied! Paste into Cursor AI chat for help.');
        break;
        
      case 'code':
        navigator.clipboard.writeText(generateGameCode());
        alert('💻 Game code copied! Paste into your HTML file.');
        break;
        
      case 'project':
        // In a real implementation, this would create a zip file
        const files = generateProjectExport();
        console.log('Project files generated:', files);
        alert('📁 Project files generated! Check console for files to download.');
        break;
        
      default:
        break;
    }
  };

  return (
    <div className="cursor-website-integration">
      <div className="integration-header">
        <h3>🤖 Cursor AI Integration</h3>
        <p>Export your game for advanced development with Cursor AI</p>
      </div>

      <div className="export-options">
        <div className="export-option">
          <input 
            type="radio" 
            id="context" 
            name="exportType" 
            value="context"
            checked={exportType === 'context'}
            onChange={(e) => setExportType(e.target.value)}
          />
          <label htmlFor="context">
            <strong>📋 Copy Context</strong>
            <br />
            <small>Get context to paste into Cursor AI chat for help</small>
          </label>
        </div>

        <div className="export-option">
          <input 
            type="radio" 
            id="code" 
            name="exportType" 
            value="code"
            checked={exportType === 'code'}
            onChange={(e) => setExportType(e.target.value)}
          />
          <label htmlFor="code">
            <strong>💻 Copy Code</strong>
            <br />
            <small>Get JavaScript code to use in your own project</small>
          </label>
        </div>

        <div className="export-option">
          <input 
            type="radio" 
            id="project" 
            name="exportType" 
            value="project"
            checked={exportType === 'project'}
            onChange={(e) => setExportType(e.target.value)}
          />
          <label htmlFor="project">
            <strong>📁 Export Project</strong>
            <br />
            <small>Download complete project to open in Cursor IDE</small>
          </label>
        </div>
      </div>

      <button className="export-button" onClick={handleExport}>
        {exportType === 'context' && '📋 Copy for Cursor AI'}
        {exportType === 'code' && '💻 Copy Game Code'}
        {exportType === 'project' && '📁 Export Full Project'}
      </button>

      <div className="workflow-explanation">
        <h4>🔄 Website + Cursor Workflow:</h4>
        <ol>
          <li><strong>Create visually</strong> - Use this website for rapid prototyping</li>
          <li><strong>Export foundation</strong> - Get generated code as starting point</li>
          <li><strong>Enhance with Cursor</strong> - Use Cursor AI for advanced features</li>
          <li><strong>Deploy anywhere</strong> - Host your finished game anywhere</li>
        </ol>
      </div>

      <div className="cursor-tips">
        <h4>💡 Cursor AI Tips:</h4>
        <ul>
          <li>Paste the context first, then ask for specific features</li>
          <li>Ask for "Add WASD movement controls to the player"</li>
          <li>Request "Implement collision detection with boundaries"</li>
          <li>Get help with "Add enemy AI and pathfinding"</li>
        </ul>
      </div>
    </div>
  );
};

export default CursorWebsiteIntegration; 