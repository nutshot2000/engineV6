import React, { useRef, useState } from "react";
import AssetManager from "./AssetManager";

function Sidebar({ assets, setAssets, onAddToNotes }) {
  const fileInputRef = useRef(null);
  const folderInputRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);
  const [currentFolder, setCurrentFolder] = useState(null);

  const MAX_ASSET_SIZE = 10 * 1024 * 1024; // 10MB
  const SUPPORTED_TYPES = [
    'image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg+xml', 'image/bmp',
    'audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4', 'audio/x-m4a', 'audio/aac', 'audio/flac'
  ];

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => {
      if (!SUPPORTED_TYPES.includes(file.type)) {
        alert(`Unsupported file type: ${file.name}`);
        return false;
      }
      if (file.size > MAX_ASSET_SIZE) {
        alert(`File too large (max 10MB): ${file.name}`);
        return false;
      }
      return true;
    });
    if (validFiles.length === 0) return;
    setIsScanning(true);
    
    try {
      const newAssets = await Promise.all(validFiles.map(async (file) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            resolve({
              name: file.name,
              src: e.target.result,
              folder: 'uploaded',
              type: file.type,
              size: file.size,
              isAudio: file.type.startsWith('audio/') || /\.(mp3|wav|ogg|m4a|aac|flac)$/i.test(file.name)
            });
          };
          reader.readAsDataURL(file);
        });
      }));

      setAssets(prev => [...prev, ...newAssets]);
    } catch (error) {
      console.error('Error processing files:', error);
      alert('Error processing files. Please try again.');
    } finally {
      setIsScanning(false);
    }
  };

  const handleFolderSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setIsScanning(true);
    
    try {
      // Get folder path from first file
      const folderPath = files[0].webkitRelativePath.split('/')[0];
      setCurrentFolder(folderPath);

      // Filter for image and audio files
      const validFiles = files.filter(file => {
        if (!SUPPORTED_TYPES.includes(file.type)) {
          alert(`Unsupported file type: ${file.name}`);
          return false;
        }
        if (file.size > MAX_ASSET_SIZE) {
          alert(`File too large (max 10MB): ${file.name}`);
          return false;
        }
        return true;
      });

      // Create asset objects
      const newAssets = await Promise.all(validFiles.map(async (file) => {
        const relativePath = file.webkitRelativePath;
        const pathParts = relativePath.split('/');
        const folder = pathParts.length > 1 ? pathParts[pathParts.length - 2] : 'root';
        
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            resolve({
              name: file.name,
              src: e.target.result,
              folder: folder,
              path: relativePath,
              type: file.type,
              size: file.size,
              isAudio: file.type.startsWith('audio/') || /\.(mp3|wav|ogg|m4a|aac|flac)$/i.test(file.name)
            });
          };
          reader.readAsDataURL(file);
        });
      }));

      // Replace all assets with the new folder contents
      setAssets(newAssets);
      
    } catch (error) {
      console.error('Error scanning folder:', error);
      alert('Error scanning folder. Please try again.');
    } finally {
      setIsScanning(false);
    }
  };

  const handleBrowseFolder = () => {
    folderInputRef.current?.click();
  };

  const handleUploadFiles = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2 className="sidebar-title">Asset Manager</h2>
        <p className="asset-count">
          {assets.length} assets
          {currentFolder && (
            <span style={{ display: 'block', fontSize: '10px', color: '#888', marginTop: '4px' }}>
              📁 {currentFolder}
            </span>
          )}
        </p>
      </div>

      <div className="folder-controls" style={{ 
        padding: '16px', 
        borderBottom: '1px solid #333',
        background: '#1f1f1f',
        flexShrink: 0
      }}>
        <button
          onClick={handleBrowseFolder}
          disabled={isScanning}
          style={{
            width: '100%',
            padding: '10px',
            background: isScanning ? '#444' : 'linear-gradient(45deg, #4ecdc4, #45b7d1)',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: isScanning ? 'not-allowed' : 'pointer',
            fontSize: '13px',
            fontWeight: '600',
            marginBottom: '8px',
            transition: 'all 0.2s ease'
          }}
        >
          {isScanning ? '🔍 Scanning...' : '📁 Browse Asset Folder'}
        </button>
        
        <button
          onClick={handleUploadFiles}
          disabled={isScanning}
          style={{
            width: '100%',
            padding: '8px',
            background: isScanning ? '#444' : '#4a4a4d',
            color: 'white',
            border: '1px solid #5a5a5d',
            borderRadius: '4px',
            cursor: isScanning ? 'not-allowed' : 'pointer',
            fontSize: '12px',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => {
            if (!isScanning) e.target.style.background = '#5a5a5d';
          }}
          onMouseLeave={(e) => {
            if (!isScanning) e.target.style.background = '#4a4a4d';
          }}
        >
          {isScanning ? '🔍 Processing...' : '➕ Add Individual Files'}
        </button>
      </div>

      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,audio/*"
        onChange={handleFileUpload}
        style={{ display: 'none' }}
      />
      
      <input
        ref={folderInputRef}
        type="file"
        webkitdirectory=""
        directory=""
        multiple
        onChange={handleFolderSelect}
        style={{ display: 'none' }}
      />

      <AssetManager assets={assets} setAssets={setAssets} onAddToNotes={onAddToNotes} />
    </div>
  );
}

export default Sidebar;
