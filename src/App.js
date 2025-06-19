import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import GridCanvas from "./components/GridCanvas";
import SaveMenu from "./components/SaveMenu";
import BouncingPhysics from "./components/BouncingPhysics";
import IndexedDBManager from "./utils/IndexedDBManager";
import { getAvailableAssets } from "./utils/AssetScanner";
import "./index.css";

function App() {
  const [assets, setAssets] = useState([]);
  const [canvasAssets, setCanvasAssets] = useState([]);
  const [shapes, setShapes] = useState([]);
  const [drawingMode, setDrawingMode] = useState('select'); // 'select', 'rectangle', 'circle', 'line'
  const [currentShapeType, setCurrentShapeType] = useState('boundary'); // 'boundary', 'hitbox', 'trigger'
  const [bouncingEnabled, setBouncingEnabled] = useState(true);

  // Load available assets on startup
  useEffect(() => {
    const loadAssets = async () => {
      try {
        const availableAssets = await getAvailableAssets();
        setAssets(availableAssets);
        console.log('Loaded assets:', availableAssets);
      } catch (error) {
        console.error('Error loading assets:', error);
        // Fallback to default assets if scanning fails
        setAssets([]);
      }
    };
    
    loadAssets();
  }, []);

  const handleProjectLoad = (project) => {
    setAssets(project.assets || []);
    setCanvasAssets(project.canvasAssets || []);
    setShapes(project.shapes || []);
  };

  // Auto-save functionality
  useEffect(() => {
    const autoSave = async () => {
      const projectData = {
        assets: assets,
        canvasAssets: canvasAssets,
        shapes: shapes,
        settings: { gridSize: 40 }
      };
      
      // Only auto-save if there's actually content
      if (canvasAssets.length > 0 || shapes.length > 0) {
        const success = await IndexedDBManager.saveProject(projectData, 'autosave');
        if (success) {
          console.log('Auto-saved project to IndexedDB');
        } else {
          console.log('Auto-save failed');
        }
      }
    };

    // Auto-save every 30 seconds
    const interval = setInterval(autoSave, 30000);
    
    // Also save when the page is about to unload
    const handleBeforeUnload = () => {
      autoSave(); // Note: this might not complete before page unloads
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [assets, canvasAssets, shapes]);

  // Load autosave on startup
  useEffect(() => {
    const loadAutosave = async () => {
      const autosaveProject = await IndexedDBManager.loadProject('autosave');
      if (autosaveProject && (autosaveProject.canvasAssets?.length > 0 || autosaveProject.shapes?.length > 0)) {
        handleProjectLoad(autosaveProject);
        console.log('Loaded autosave project from IndexedDB');
      }
    };
    
    loadAutosave();
  }, []);

  // Tool selection handlers removed - using right-click only

  return (
    <div className="app-container">
      <BouncingPhysics 
        canvasAssets={canvasAssets}
        setCanvasAssets={setCanvasAssets}
        shapes={shapes}
        enabled={bouncingEnabled}
      />
      
      <div className="top-bar">
        <div className="top-bar-content">
          <h1 className="app-title">Game Engine v5</h1>
          <SaveMenu 
            assets={assets} 
            canvasAssets={canvasAssets}
            shapes={shapes}
            onLoad={handleProjectLoad} 
          />
        </div>
      </div>
      <div className="main-layout">
        <Sidebar assets={assets} setAssets={setAssets} />
        <div className="main-content">
          <div className="canvas-viewport">
            <GridCanvas 
              canvasAssets={canvasAssets}
              setCanvasAssets={setCanvasAssets}
              shapes={shapes}
              setShapes={setShapes}
              drawingMode={drawingMode}
              setDrawingMode={setDrawingMode}
              currentShapeType={currentShapeType}
              setCurrentShapeType={setCurrentShapeType}
            />
          </div>
        </div>
        <div className="tools-panel">
          <div className="tools-header">
            <h3>Tools</h3>
          </div>
          
          <div className="tool-section">
            <button 
              className={`tool-button ${drawingMode === 'select' ? 'active' : ''}`}
              onClick={() => setDrawingMode('select')}
            >
              🖱️ Select
            </button>
          </div>
          
          <div className="tool-section">
            <button 
              className={`tool-button ${bouncingEnabled ? 'active' : ''}`}
              onClick={() => setBouncingEnabled(!bouncingEnabled)}
              style={{ 
                marginTop: '8px',
                background: bouncingEnabled ? 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #ffeaa7)' : '#404040',
                backgroundSize: '400% 400%',
                animation: bouncingEnabled ? 'rainbow 2s ease infinite' : 'none',
                color: 'white',
                fontWeight: 'bold',
                textShadow: bouncingEnabled ? '0 0 10px rgba(255,255,255,0.5)' : 'none'
              }}
            >
              {bouncingEnabled ? '🎆 EPIC BOUNCING! 🎆' : '▶️ Start Bouncing'}
            </button>
            
            {bouncingEnabled && (
              <div style={{
                marginTop: '8px',
                padding: '8px',
                background: 'linear-gradient(45deg, rgba(255,107,107,0.2), rgba(78,205,196,0.2))',
                borderRadius: '4px',
                fontSize: '11px',
                color: '#fff',
                textAlign: 'center',
                animation: 'pulse 1.5s ease-in-out infinite'
              }}>
                🌈 Rainbow Colors<br/>
                💥 Particle Explosions<br/>
                ⚡ Speed Boosts<br/>
                🎯 Wall Bouncing<br/>
                🔄 Epic Rotation
              </div>
            )}
          </div>
          
          <div className="tool-section">
            <p style={{ color: '#888', fontSize: '12px', fontStyle: 'italic', margin: '16px 0' }}>
              Use right-click on canvas to add shapes
            </p>
          </div>
          
          <div className="tool-section">
            <h4>Asset Folders</h4>
            <p style={{ color: '#666', fontSize: '11px', margin: '8px 0' }}>
              AI Agent can add assets to:<br/>
              📁 public/assets/images/<br/>
              📁 public/assets/sprites/<br/>
              📁 public/assets/backgrounds/<br/>
              📁 public/assets/ui/<br/>
              📁 public/assets/temp/
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
