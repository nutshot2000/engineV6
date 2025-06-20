import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import GridCanvas from "./components/GridCanvas";
import SaveMenu from "./components/SaveMenu";
import ErrorBoundary from './ErrorBoundary';

import IndexedDBManager from "./utils/IndexedDBManager";
import "./index.css";

function App() {
  const [assets, setAssets] = useState([]);
  const [canvasAssets, setCanvasAssets] = useState([]);
  const [shapes, setShapes] = useState([]);
  const [drawingMode, setDrawingMode] = useState('select'); // 'select', 'rectangle', 'circle', 'line'
  const [currentShapeType, setCurrentShapeType] = useState('boundary'); // 'boundary', 'hitbox', 'trigger'
  const [sidebarNotesCallback, setSidebarNotesCallback] = useState(null);


  // Assets are now loaded via folder picker in Sidebar component

  const handleProjectLoad = (project) => {
    setAssets(project.assets || []);
    const upgradedCanvasAssets = (project.canvasAssets || []).map(asset => ({
      ...asset,
      isAsset: true
    }));
    setCanvasAssets(upgradedCanvasAssets);
    setShapes(project.shapes || []);
  };

  const handleClearScene = () => {
    if (window.confirm('Are you sure you want to clear the entire scene? This action cannot be undone.')) {
      setCanvasAssets([]);
      setShapes([]);
    }
  };

  // Auto-save functionality
  useEffect(() => {
    let autoSaveTimeout;
    let isAutoSaving = false;

    const autoSave = async () => {
      // Prevent multiple auto-saves from running simultaneously
      if (isAutoSaving) return;
      
      const projectData = {
        assets: assets,
        canvasAssets: canvasAssets,
        shapes: shapes,
        settings: { gridSize: 40 }
      };
      
      // Only auto-save if there's actually content (including custom assets)
      if (canvasAssets.length > 0 || shapes.length > 0 || assets.length > 0) {
        isAutoSaving = true;
        try {
          await IndexedDBManager.saveProject(projectData, 'autosave');
        } catch (error) {
          console.error('Auto-save failed:', error);
        } finally {
          isAutoSaving = false;
        }
      }
    };

    // Debounced auto-save - only save after 30 seconds of inactivity
    const debouncedAutoSave = () => {
      clearTimeout(autoSaveTimeout);
      autoSaveTimeout = setTimeout(autoSave, 30000);
    };

    // Trigger debounced auto-save when data changes
    debouncedAutoSave();
    
    // Also save when the page is about to unload
    const handleBeforeUnload = () => {
      autoSave(); // Note: this might not complete before page unloads
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      clearTimeout(autoSaveTimeout);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [assets, canvasAssets, shapes]);

  // Load autosave on startup
  useEffect(() => {
    const loadAutosave = async () => {
      const autosaveProject = await IndexedDBManager.loadProject('autosave');
      if (autosaveProject) {
        // Always load assets, even if there are no canvas items
        handleProjectLoad(autosaveProject);
      }
    };
    
    loadAutosave();
  }, []);

  // Tool selection handlers removed - using right-click only

  return (
    <ErrorBoundary>
      <div className="app-container">
        <div className="top-bar">
          <div className="top-bar-content">
            <h1 className="app-title">Game Engine v5</h1>
            <div className="top-bar-buttons">
              <button
                onClick={handleClearScene}
                className="top-bar-button clear-scene-button"
              >
                🗑️ Clear Scene
              </button>
              <SaveMenu 
                assets={assets} 
                canvasAssets={canvasAssets}
                shapes={shapes}
                onLoad={handleProjectLoad} 
              />
            </div>
          </div>
        </div>
        <div className="main-layout">
          <Sidebar 
            assets={assets} 
            setAssets={setAssets} 
            onAddToNotes={sidebarNotesCallback}
          />
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
                onRegisterSidebarCallback={setSidebarNotesCallback}
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
              <p style={{ color: '#888', fontSize: '12px', fontStyle: 'italic', margin: '16px 0' }}>
                Clean game engine ready for development
              </p>
            </div>
            
            <div className="tool-section">
              <p style={{ color: '#888', fontSize: '12px', fontStyle: 'italic', margin: '16px 0' }}>
                Use right-click on canvas to add shapes
              </p>
            </div>
            
            <div className="tool-section">
              <h4>Asset Management</h4>
              <p style={{ color: '#666', fontSize: '11px', margin: '8px 0' }}>
                Use "Browse Asset Folder" to load images from any directory on your computer. Assets will appear in the sidebar for drag-and-drop.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default App;
