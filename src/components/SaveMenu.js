import React, { useState, useEffect } from "react";
import IndexedDBManager from "../utils/IndexedDBManager";

function SaveMenu({ assets, canvasAssets, shapes, onLoad }) {
  const [showMenu, setShowMenu] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [savedProjects, setSavedProjects] = useState([]);
  const [storageInfo, setStorageInfo] = useState(null);

  useEffect(() => {
    updateProjectList();
    updateStorageInfo();
  }, []);

  const updateProjectList = async () => {
    const projects = await IndexedDBManager.listProjects();
    setSavedProjects(projects);
  };

  const updateStorageInfo = async () => {
    const info = await IndexedDBManager.getStorageInfo();
    setStorageInfo(info);
  };

  const handleSave = async () => {
    if (!projectName.trim()) {
      alert('Please enter a project name');
      return;
    }
    
    const projectData = {
      assets: assets || [],
      canvasAssets: canvasAssets || [],
      shapes: shapes || [],
      settings: { gridSize: 40 }
    };
    
    const success = await IndexedDBManager.saveProject(projectData, projectName);
    if (success) {
      alert(`Project "${projectName}" saved successfully!`);
      updateProjectList();
      updateStorageInfo();
    } else {
      alert('Failed to save project');
    }
  };

  const handleLoad = async (name) => {
    const project = await IndexedDBManager.loadProject(name);
    if (project) {
      onLoad(project);
      setShowMenu(false);
      alert(`Project "${name}" loaded successfully!`);
    } else {
      alert('Failed to load project');
    }
  };

  const handleExport = async () => {
    if (!projectName.trim()) {
      alert('Please enter a project name');
      return;
    }
    
    const projectData = {
      assets: assets || [],
      canvasAssets: canvasAssets || [],
      shapes: shapes || [],
      settings: { gridSize: 40 }
    };
    
    const success = await IndexedDBManager.exportProject(projectData, projectName);
    if (success) {
      alert('Project exported successfully!');
    } else {
      alert('Failed to export project');
    }
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      const project = await IndexedDBManager.importProject(file);
      onLoad(project);
      alert(`Project "${project.name}" imported successfully!`);
    } catch (error) {
      alert('Failed to import project');
      console.error(error);
    }
  };

  const handleDelete = async (name) => {
    if (window.confirm(`Delete project "${name}"?`)) {
      await IndexedDBManager.deleteProject(name);
      updateProjectList();
      updateStorageInfo();
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setShowMenu(!showMenu)}
        style={{
          background: '#007acc',
          color: 'white',
          border: 'none',
          padding: '6px 12px',
          borderRadius: '3px',
          cursor: 'pointer',
          fontSize: '12px',
          fontWeight: '500',
          height: '28px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}
      >
        💾 Save/Load
      </button>
      
      {showMenu && (
        <div style={{
          position: 'absolute',
          top: '100%',
          right: 0,
          background: '#2d2d30',
          border: '1px solid #404040',
          borderRadius: '6px',
          padding: '16px',
          minWidth: '300px',
          zIndex: 1000,
          color: '#cccccc',
          marginTop: '4px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
        }}>
          <h3 style={{ margin: '0 0 16px 0', color: '#ffffff' }}>Project Manager</h3>
          
          <div style={{ marginBottom: '16px' }}>
            <input
              type="text"
              placeholder="Project name..."
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                background: '#1e1e1e',
                border: '1px solid #404040',
                borderRadius: '4px',
                color: '#cccccc',
                fontSize: '13px'
              }}
            />
          </div>
          
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            <button onClick={handleSave} style={{ flex: 1, padding: '8px', background: '#007acc', color: 'white', border: 'none', borderRadius: '4px', fontSize: '12px' }}>
              Save
            </button>
            <button onClick={handleExport} style={{ flex: 1, padding: '8px', background: '#6b46c1', color: 'white', border: 'none', borderRadius: '4px', fontSize: '12px' }}>
              Export
            </button>
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px' }}>Import Project:</label>
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              style={{ width: '100%', fontSize: '11px', color: '#cccccc' }}
            />
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '12px' }}>Saved Projects:</h4>
            <div style={{ maxHeight: '120px', overflowY: 'auto' }}>
              {savedProjects.map((name) => (
                <div key={name} style={{ display: 'flex', alignItems: 'center', padding: '4px 0', borderBottom: '1px solid #404040' }}>
                  <span style={{ flex: 1, fontSize: '11px' }}>{name}</span>
                  <button onClick={() => handleLoad(name)} style={{ padding: '4px 8px', background: '#4ade80', color: 'white', border: 'none', borderRadius: '3px', fontSize: '10px', marginRight: '4px' }}>
                    Load
                  </button>
                  <button onClick={() => handleDelete(name)} style={{ padding: '4px 8px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '3px', fontSize: '10px' }}>
                    Del
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          {storageInfo && (
            <div style={{ fontSize: '10px', color: '#858585', borderTop: '1px solid #404040', paddingTop: '8px' }}>
              Storage: {storageInfo.usedMB}MB / 10MB used
            </div>
          )}
          
          <button
            onClick={() => setShowMenu(false)}
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              background: 'transparent',
              border: 'none',
              color: '#cccccc',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}

export default SaveMenu;