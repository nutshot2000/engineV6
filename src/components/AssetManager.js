import React, { useState, useRef, useEffect } from "react";

function AssetManager({ assets, setAssets, onAddToNotes }) {
  const [selectedFolder, setSelectedFolder] = useState('all');
  const [playingAudio, setPlayingAudio] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);
  const audioRef = useRef(null);

  // Group assets by folder
  const assetsByFolder = assets.reduce((acc, asset) => {
    const folder = asset.folder || 'uncategorized';
    if (!acc[folder]) {
      acc[folder] = [];
    }
    acc[folder].push(asset);
    return acc;
  }, {});

  const folders = Object.keys(assetsByFolder);
  const filteredAssets = selectedFolder === 'all' 
    ? assets 
    : assetsByFolder[selectedFolder] || [];

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('[data-sidebar-context-menu]')) {
        setContextMenu(null);
      }
    };
    
    if (contextMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [contextMenu]);

  const handlePlayAudio = (asset) => {
    if (playingAudio === asset.name) {
      // Stop current audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setPlayingAudio(null);
    } else {
      // Play new audio
      if (audioRef.current) {
        audioRef.current.pause();
      }
      audioRef.current = new Audio(asset.src);
      audioRef.current.play().catch(console.error);
      setPlayingAudio(asset.name);
      
      // Reset when audio ends
      audioRef.current.onended = () => {
        setPlayingAudio(null);
      };
    }
  };

  const handleAssetRightClick = (e, asset) => {
    e.preventDefault();
    e.stopPropagation();
    
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      asset: asset
    });
  };

  const handleContextAction = (action, asset) => {
    setContextMenu(null);
    
    switch (action) {
      case 'add-to-notes':
        if (onAddToNotes) {
          onAddToNotes(asset);
        }
        break;
      case 'rename':
        const newName = prompt('Enter new name:', asset.name.replace(/\.(png|jpg|jpeg|gif|webp|svg|bmp|mp3|wav|ogg|m4a|aac|flac)$/i, ''));
        if (newName && newName.trim()) {
          const extension = asset.name.match(/\.(png|jpg|jpeg|gif|webp|svg|bmp|mp3|wav|ogg|m4a|aac|flac)$/i)?.[0] || '';
          const updatedAsset = { ...asset, name: newName.trim() + extension };
          setAssets(prev => prev.map(a => a === asset ? updatedAsset : a));
        }
        break;
      case 'delete':
        if (window.confirm(`Delete "${asset.name}"?`)) {
          setAssets(prev => prev.filter(a => a !== asset));
        }
        break;
      default:
        break;
    }
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>
      {/* Folder Filter */}
      {folders.length > 1 && (
        <div style={{ 
          padding: '12px 16px', 
          borderBottom: '1px solid #333',
          background: '#252525',
          flexShrink: 0
        }}>
          <select
            value={selectedFolder}
            onChange={(e) => setSelectedFolder(e.target.value)}
            style={{
              width: '100%',
              padding: '6px 8px',
              background: '#333',
              color: '#fff',
              border: '1px solid #555',
              borderRadius: '4px',
              fontSize: '12px'
            }}
          >
            <option value="all">All Folders ({assets.length})</option>
            {folders.map(folder => (
              <option key={folder} value={folder}>
                📁 {folder} ({assetsByFolder[folder].length})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Assets Grid */}
      <div className="asset-grid" style={{ flex: 1, overflowY: 'auto' }}>
        {filteredAssets.length === 0 ? (
          <div style={{ 
            padding: '40px 20px', 
            textAlign: 'center', 
            color: '#666',
            fontSize: '14px'
          }}>
            {assets.length === 0 ? (
              <>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📁</div>
                <div>No assets loaded</div>
                <div style={{ fontSize: '12px', marginTop: '8px' }}>
                  Click "Browse Asset Folder" to load images
                </div>
              </>
            ) : (
              <>
                <div>No assets in {selectedFolder} folder</div>
              </>
            )}
          </div>
        ) : (
          filteredAssets.map((asset, i) => (
            <div 
              key={asset.name + i} 
              className="asset-item"
              title={asset.path || asset.name}
              onContextMenu={(e) => handleAssetRightClick(e, asset)}
            >
              {asset.isAudio ? (
                // Audio asset display
                <div
                  className="asset-preview audio-preview"
                  style={{
                    width: '60px',
                    height: '60px',
                    background: playingAudio === asset.name ? '#4ecdc4' : '#444',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    marginBottom: '6px',
                    cursor: 'pointer',
                    transition: 'background 0.2s ease',
                    position: 'relative'
                  }}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData("asset", JSON.stringify(asset));
                  }}
                  onClick={() => handlePlayAudio(asset)}
                >
                  {playingAudio === asset.name ? '⏸️' : '🎵'}
                  <div style={{
                    position: 'absolute',
                    bottom: '-2px',
                    right: '-2px',
                    background: '#007acc',
                    borderRadius: '50%',
                    width: '16px',
                    height: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '8px'
                  }}>
                    {playingAudio === asset.name ? '⏸' : '▶'}
                  </div>
                </div>
              ) : (
                // Image asset display
                <>
                  <img
                    src={asset.src}
                    alt={asset.name}
                    className="asset-preview"
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData("asset", JSON.stringify(asset));
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  {/* Fallback for broken images */}
                  <div 
                    style={{ 
                      display: 'none',
                      width: '60px',
                      height: '60px',
                      background: '#444',
                      borderRadius: '4px',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px',
                      marginBottom: '6px'
                    }}
                  >
                    🖼️
                  </div>
                </>
              )}
              <div className="asset-name">
                {asset.name.replace(/\.(png|jpg|jpeg|gif|webp|svg|bmp|mp3|wav|ogg|m4a|aac|flac)$/i, '')}
              </div>
              {asset.folder && asset.folder !== 'uploaded' && (
                <div style={{ 
                  fontSize: '9px', 
                  color: '#888', 
                  marginTop: '2px',
                  opacity: 0.7
                }}>
                  📁 {asset.folder}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Sidebar Context Menu */}
      {contextMenu && (
        <div
          data-sidebar-context-menu
          style={{
            position: 'fixed',
            left: contextMenu.x,
            top: contextMenu.y,
            background: '#2d2d30',
            border: '1px solid #404040',
            borderRadius: '4px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            zIndex: 10000,
            minWidth: '150px',
            padding: '4px 0',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            fontSize: '12px'
          }}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            style={{
              padding: '6px 12px',
              color: '#cccccc',
              cursor: 'pointer',
              transition: 'background 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#37373d';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
            }}
            onClick={() => handleContextAction('add-to-notes', contextMenu.asset)}
          >
            📝 Add to Notes
          </div>
          
          <div style={{ height: '1px', background: '#404040', margin: '4px 0' }} />
          
          <div
            style={{
              padding: '6px 12px',
              color: '#cccccc',
              cursor: 'pointer',
              transition: 'background 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#37373d';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
            }}
            onClick={() => handleContextAction('rename', contextMenu.asset)}
          >
            ✏️ Rename "{contextMenu.asset.name.replace(/\.(png|jpg|jpeg|gif|webp|svg|bmp|mp3|wav|ogg|m4a|aac|flac)$/i, '')}"
          </div>
          
          <div style={{ height: '1px', background: '#404040', margin: '4px 0' }} />
          
          <div
            style={{
              padding: '6px 12px',
              color: '#ff6b6b',
              cursor: 'pointer',
              transition: 'background 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255, 107, 107, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
            }}
            onClick={() => handleContextAction('delete', contextMenu.asset)}
          >
            🗑️ Delete
          </div>
        </div>
      )}
    </div>
  );
}

export default AssetManager;
