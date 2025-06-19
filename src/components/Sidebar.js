import React, { useState } from "react";
import AssetManager from "./AssetManager";

function Sidebar({ assets, setAssets }) {
  const [dragOver, setDragOver] = useState(false);

  const handleFileUpload = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newAsset = { 
          name: file.name, 
          src: event.target.result 
        };
        // Update assets state directly instead of using events
        setAssets(prev => [...prev, newAsset]);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      className="sidebar"
      onDragOver={e => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={e => {
        e.preventDefault();
        setDragOver(false);
      }}
      onDrop={e => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files && e.dataTransfer.files[0];
        handleFileUpload(file);
      }}
    >
      <div className="sidebar-header">
        <h2 className="sidebar-title">Assets</h2>
        <span className="asset-count">Library</span>
      </div>
      <AssetManager assets={assets} setAssets={setAssets} />
      
      <div className="upload-section">
        <button 
          className="upload-button"
          onClick={() => document.getElementById('asset-upload').click()}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l0 10m0 0l-4-4m4 4l4-4m6 6v6a2 2 0 01-2 2H4a2 2 0 01-2-2v-6"/>
          </svg>
          Add Asset
        </button>
        <input
          id="asset-upload"
          type="file"
          accept="image/*"
          className="upload-input"
          onChange={e => {
            const file = e.target.files && e.target.files[0];
            handleFileUpload(file);
          }}
        />
        <div className={`drop-zone ${dragOver ? 'drag-over' : ''}`}>
          Drop images here or click above<br/>
          <small style={{ fontSize: '10px', opacity: '0.7' }}>
            Drag to canvas for resize/rotate handles
          </small>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
