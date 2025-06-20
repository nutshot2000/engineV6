import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react';

const AIGameAssistant = forwardRef(({ 
  isOpen, 
  onClose, 
  canvasAssets, 
  shapes, 
  onUpdateProject, 
  onCreateAsset, 
  onModifyObject,
  selectedObjectId,
  onSelectObject 
}, ref) => {
  const [notepadContent, setNotepadContent] = useState('');
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  
  const textareaRef = useRef(null);
  const windowRef = useRef(null);

  // Handle object click to add reference
  const handleObjectClick = (objectId) => {
    const asset = (canvasAssets || []).find(a => a.id === objectId);
    const shape = (shapes || []).find(s => s.id === objectId);
    const object = asset || shape;
    
    if (object && textareaRef.current) {
      const objectName = object.name || objectId;
      const currentText = notepadContent;
      const newText = currentText ? `${currentText} [${objectName}]` : `[${objectName}]`;
      setNotepadContent(newText);
      textareaRef.current.focus();
    }
  };

  // Add method to insert coordinates into notepad
  const insertCoordinates = (coordText) => {
    const currentText = notepadContent;
    const newText = currentText ? `${currentText} ${coordText}` : coordText;
    setNotepadContent(newText);
    if (textareaRef.current) {
      textareaRef.current.focus();
      // Set cursor to end
      setTimeout(() => {
        textareaRef.current.setSelectionRange(newText.length, newText.length);
      }, 0);
    }
  };

  // Add method to add group information to notepad
  const addGroupToChat = (group) => {
    if (!group || !group.objects) {
      console.error('AIGameAssistant: Invalid group data provided');
      return;
    }

    const groupInfo = `📦 Group: "${group.name || 'Unnamed'}"
📝 ${group.description || 'No description'}
🔢 Objects: ${group.objects.length}
📍 Bounds: x: ${Math.round(group.bounds?.x || 0)}, y: ${Math.round(group.bounds?.y || 0)}, size: ${Math.round(group.bounds?.width || 0)}×${Math.round(group.bounds?.height || 0)}

${(group.objects || []).map((obj, index) => {
  const asset = (canvasAssets || []).find(a => a.id === obj.id);
  const shape = (shapes || []).find(s => s.id === obj.id);
  const object = asset || shape;
  
  if (!object) return `${index + 1}. [MISSING] ${obj.id}`;
  
  const isAsset = object.isAsset || asset;
  const metadata = [];
  
  // Basic info
  metadata.push(`(${Math.round(object.x || 0)}, ${Math.round(object.y || 0)})`);
  metadata.push(`${Math.round(object.width || 0)}×${Math.round(object.height || 0)}`);
  
  // Transformation
  if (object.rotation && object.rotation !== 0) {
    metadata.push(`${Math.round(object.rotation)}°`);
  }
  if (object.scaleX && object.scaleX !== 1) {
    metadata.push(`scale: ${object.scaleX.toFixed(2)}`);
  }
  if (object.locked) {
    metadata.push(`locked`);
  }
  
  // Type-specific info with audio support
  let typeInfo;
  if (isAsset) {
    if (object.isAudio) {
      typeInfo = 'audio';
    } else {
      typeInfo = object.src ? object.src.split('/').pop() : 'image';
    }
  } else {
    typeInfo = object.shapeType || object.type || 'shape';
  }
  
  return `${index + 1}. ${object.name || object.id} [${typeInfo}] ${metadata.join(' ')}`;
}).join('\n')}

`;
    
    const currentText = notepadContent;
    const newText = currentText ? `${currentText}\n${groupInfo}` : groupInfo;
    setNotepadContent(newText);
  };

  // Add method to add individual object information to notepad
  const addObjectToChat = (object) => {
    if (!object) {
      console.error('AIGameAssistant: Invalid object data provided');
      return;
    }

    const isAsset = object.isAsset || (canvasAssets || []).find(a => a.id === object.id);
    const metadata = [];
    
    // Basic info
    metadata.push(`(${Math.round(object.x || 0)}, ${Math.round(object.y || 0)})`);
    metadata.push(`${Math.round(object.width || 0)}×${Math.round(object.height || 0)}`);
    
    // Transformation
    if (object.rotation && object.rotation !== 0) {
      metadata.push(`${Math.round(object.rotation)}°`);
    }
    if (object.scaleX && object.scaleX !== 1) {
      metadata.push(`scale: ${object.scaleX.toFixed(2)}`);
    }
    if (object.locked) {
      metadata.push(`locked`);
    }
    
    // Type-specific info with enhanced audio support
    let typeInfo;
    let audioInfo = '';
    
    if (isAsset) {
      if (object.isAudio) {
        // Enhanced audio asset information
        typeInfo = 'audio';
        const fileExtension = object.name ? object.name.split('.').pop().toLowerCase() : 'unknown';
        const fileSize = object.size ? `${Math.round(object.size / 1024)}KB` : '';
        const audioFormat = object.type || `audio/${fileExtension}`;
        
        audioInfo = `\n  🎵 Format: ${audioFormat}`;
        if (fileSize) audioInfo += `\n  📁 Size: ${fileSize}`;
        if (object.folder) audioInfo += `\n  📂 Folder: ${object.folder}`;
        audioInfo += `\n  🎮 Usage: Background music, sound effects, UI sounds`;
      } else {
        // Regular image asset
        typeInfo = object.src ? object.src.split('/').pop() : 'image';
      }
    } else {
      // Shape object
      typeInfo = object.shapeType || object.type || 'shape';
    }

    const objectInfo = `🎯 ${object.name || object.id} [${typeInfo}] ${metadata.join(' ')}${audioInfo}
`;
    
    const currentText = notepadContent;
    const newText = currentText ? `${currentText}\n${objectInfo}` : objectInfo;
    setNotepadContent(newText);
  };

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    handleObjectClick,
    insertCoordinates,
    addGroupToChat,
    addObjectToChat
  }));

  // Copy notepad content to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(notepadContent);
      setShowCopiedMessage(true);
      setTimeout(() => setShowCopiedMessage(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  // Clear notepad content
  const clearNotepad = () => {
    setNotepadContent('');
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  // Simple working drag implementation with proper cleanup
  const handleMouseDown = (e) => {
    if (e.target.closest('button')) return; // Don't drag on buttons
    
    setIsDragging(true);
    const startDrag = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
    
    const handleMouseMove = (e) => {
      setPosition({
        x: e.clientX - startDrag.x,
        y: e.clientY - startDrag.y
      });
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Cleanup event listeners on unmount
  React.useEffect(() => {
    return () => {
      // Clean up any remaining event listeners
      document.removeEventListener('mousemove', () => {});
      document.removeEventListener('mouseup', () => {});
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div 
      className="ai-assistant-overlay"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'transparent', // Remove the dark overlay
        zIndex: 1000,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        pointerEvents: 'none' // Allow clicks to pass through
      }}
    >
      <div 
        ref={windowRef}
        className="ai-assistant-window"
        style={{
          position: 'absolute',
          left: position.x,
          top: position.y,
          width: '400px',
          height: '300px',
          background: 'rgba(31, 31, 31, 0.3)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          border: '1px solid rgba(51, 51, 51, 0.5)',
          borderRadius: '8px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
          display: 'flex',
          flexDirection: 'column',
          cursor: isDragging ? 'grabbing' : 'default',
          pointerEvents: 'auto',
          resize: 'both',
          overflow: 'hidden',
          minWidth: '300px',
          minHeight: '200px'
        }}
      >
        {/* Header */}
        <div 
          className="ai-assistant-header"
          onMouseDown={handleMouseDown}
          style={{ 
            padding: '12px 16px',
            background: 'rgba(45, 45, 48, 0.6)',
            borderBottom: '1px solid rgba(51, 51, 51, 0.5)',
            borderRadius: '8px 8px 0 0',
            cursor: 'grab',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            userSelect: 'none'
          }}
        >
          <h3 style={{ margin: 0, color: '#fff', fontSize: '13px' }}>📝 Game Notes</h3>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              onClick={copyToClipboard}
              style={{ 
                background: '#4ecdc4',
                color: 'white',
                border: 'none',
                borderRadius: '3px',
                padding: '3px 8px',
                fontSize: '10px',
                cursor: 'pointer'
              }}
            >
              📋 Copy
            </button>
            <button 
              onClick={clearNotepad}
              style={{ 
                background: '#ff9800',
                color: 'white',
                border: 'none',
                borderRadius: '3px',
                padding: '3px 8px',
                fontSize: '10px',
                cursor: 'pointer'
              }}
            >
              🗑️ Clear
            </button>
            <button 
              onClick={onClose}
              style={{ 
                background: '#d32f2f',
                color: 'white',
                border: 'none',
                borderRadius: '3px',
                padding: '3px 8px',
                fontSize: '10px',
                cursor: 'pointer'
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Notepad Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <textarea
            ref={textareaRef}
            value={notepadContent}
            onChange={(e) => setNotepadContent(e.target.value)}
            placeholder="Click objects to add them here, or type your own notes...

Right-click objects → 'AI Game Assistant' to add detailed info
Click coordinates (bottom-right) to insert positions
Use this as your notepad for Cursor AI"
            style={{
              flex: 1,
              padding: '12px',
              background: 'rgba(31, 31, 31, 0.2)',
              backdropFilter: 'blur(3px)',
              WebkitBackdropFilter: 'blur(3px)',
              border: 'none',
              color: '#fff',
              fontSize: '12px',
              fontFamily: 'Monaco, Consolas, "Courier New", monospace',
              resize: 'none',
              outline: 'none',
              lineHeight: '1.4'
            }}
          />
        </div>

        {/* Footer */}
        <div style={{ 
          padding: '6px 12px',
          background: 'rgba(45, 45, 48, 0.5)',
          borderTop: '1px solid rgba(51, 51, 51, 0.5)',
          fontSize: '10px',
          color: '#888',
          textAlign: 'center'
        }}>
          {showCopiedMessage ? (
            <span style={{ color: '#4ecdc4' }}>✅ Copied to clipboard!</span>
          ) : (
            'Drag to move • Resize from corner • Copy to paste in Cursor'
          )}
        </div>
      </div>
    </div>
  );
});

export default AIGameAssistant; 