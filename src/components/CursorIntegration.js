import React, { useState, useEffect } from 'react';

const CursorIntegration = ({ 
  sceneAnalysis, 
  taggedObjects, 
  currentMessage,
  onSendToCursor,
  onCopyToClipboard 
}) => {
  const [cursorConnected, setCursorConnected] = useState(false);
  const [integrationMode, setIntegrationMode] = useState('copy'); // 'copy', 'cursor-chat', 'export'

  // Check if we're running in Cursor environment
  useEffect(() => {
    // Check for Cursor-specific APIs or environment variables
    const isCursor = window.navigator.userAgent.includes('Cursor') || 
                     window.location.hostname === 'localhost' ||
                     process.env.NODE_ENV === 'development';
    setCursorConnected(isCursor);
  }, []);

  const generateContextPrompt = () => {
    const context = `🎮 GAME ENGINE CONTEXT:

📊 Current Scene Analysis:
- Total Objects: ${sceneAnalysis?.totalObjects || 0}
- Assets (Sprites): ${sceneAnalysis?.assets || 0}
- Shapes: ${sceneAnalysis?.shapes || 0}
  - Boundaries: ${sceneAnalysis?.boundaries || 0}
  - Hitboxes: ${sceneAnalysis?.hitboxes || 0}
  - Triggers: ${sceneAnalysis?.triggers || 0}
  - Collision Boxes: ${sceneAnalysis?.collisionBoxes || 0}

🏷️ Referenced Objects:
${taggedObjects.map(obj => `- ${obj.displayName}: ${obj.description}`).join('\n')}

🎯 User Request:
${currentMessage}

📝 Please help implement this game development request. You have access to:
- React/JavaScript game engine
- Konva.js for 2D rendering
- Asset management system
- Shape/collision system
- IndexedDB for persistence

Provide code suggestions, implementation steps, or ask clarifying questions.`;

    return context;
  };

  const handleCopyToClipboard = async () => {
    const contextPrompt = generateContextPrompt();
    try {
      await navigator.clipboard.writeText(contextPrompt);
      onCopyToClipboard && onCopyToClipboard('Context copied to clipboard! Paste in Cursor chat.');
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = contextPrompt;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      onCopyToClipboard && onCopyToClipboard('Context copied to clipboard! Paste in Cursor chat.');
    }
  };

  const handleSendToCursor = () => {
    const contextPrompt = generateContextPrompt();
    
    // Try to communicate with Cursor if possible
    if (window.cursor && window.cursor.chat) {
      window.cursor.chat.send(contextPrompt);
      onSendToCursor && onSendToCursor('Sent to Cursor chat!');
    } else {
      // Fallback to copy to clipboard
      handleCopyToClipboard();
    }
  };

  const handleExportSession = () => {
    const sessionData = {
      timestamp: new Date().toISOString(),
      sceneAnalysis,
      taggedObjects,
      currentMessage,
      context: generateContextPrompt()
    };

    const blob = new Blob([JSON.stringify(sessionData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `game-context-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{
      padding: '12px',
      background: '#2d2d30',
      borderTop: '1px solid #404040',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    }}>
      {/* Integration Mode Selector */}
      <div style={{
        display: 'flex',
        gap: '4px',
        marginBottom: '8px'
      }}>
        <button
          onClick={() => setIntegrationMode('copy')}
          style={{
            padding: '4px 8px',
            background: integrationMode === 'copy' ? '#007acc' : '#404040',
            color: 'white',
            border: 'none',
            borderRadius: '3px',
            fontSize: '10px',
            cursor: 'pointer'
          }}
        >
          📋 Copy
        </button>
        <button
          onClick={() => setIntegrationMode('cursor-chat')}
          style={{
            padding: '4px 8px',
            background: integrationMode === 'cursor-chat' ? '#007acc' : '#404040',
            color: 'white',
            border: 'none',
            borderRadius: '3px',
            fontSize: '10px',
            cursor: 'pointer'
          }}
        >
          💬 Cursor Chat
        </button>
        <button
          onClick={() => setIntegrationMode('export')}
          style={{
            padding: '4px 8px',
            background: integrationMode === 'export' ? '#007acc' : '#404040',
            color: 'white',
            border: 'none',
            borderRadius: '3px',
            fontSize: '10px',
            cursor: 'pointer'
          }}
        >
          💾 Export
        </button>
      </div>

      {/* Integration Actions */}
      {integrationMode === 'copy' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <button
            onClick={handleCopyToClipboard}
            style={{
              padding: '8px 12px',
              background: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            📋 Copy Context to Cursor Chat
          </button>
          <div style={{
            fontSize: '10px',
            color: '#888',
            fontStyle: 'italic'
          }}>
            Copies scene context + your message to clipboard. Paste in Cursor chat for AI assistance.
          </div>
        </div>
      )}

      {integrationMode === 'cursor-chat' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <button
            onClick={handleSendToCursor}
            disabled={!cursorConnected}
            style={{
              padding: '8px 12px',
              background: cursorConnected ? '#007acc' : '#666',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '12px',
              cursor: cursorConnected ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            💬 Send to Cursor Chat
            {cursorConnected ? ' ✅' : ' ❌'}
          </button>
          <div style={{
            fontSize: '10px',
            color: '#888',
            fontStyle: 'italic'
          }}>
            {cursorConnected 
              ? 'Direct integration with Cursor chat detected.'
              : 'Cursor integration not available. Will copy to clipboard instead.'}
          </div>
        </div>
      )}

      {integrationMode === 'export' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <button
            onClick={handleExportSession}
            style={{
              padding: '8px 12px',
              background: '#FF9500',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            💾 Export Session Data
          </button>
          <div style={{
            fontSize: '10px',
            color: '#888',
            fontStyle: 'italic'
          }}>
            Downloads JSON file with complete context for external AI tools.
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div style={{
        display: 'flex',
        gap: '4px',
        marginTop: '4px'
      }}>
        <button
          onClick={() => {
            const quickPrompt = `Help me with game development:\n\n${currentMessage}\n\nScene has ${sceneAnalysis?.totalObjects || 0} objects.`;
            navigator.clipboard.writeText(quickPrompt);
            onCopyToClipboard && onCopyToClipboard('Quick prompt copied!');
          }}
          style={{
            padding: '4px 6px',
            background: '#333',
            color: '#ccc',
            border: '1px solid #555',
            borderRadius: '3px',
            fontSize: '9px',
            cursor: 'pointer'
          }}
        >
          Quick Copy
        </button>
        <button
          onClick={() => {
            const codePrompt = `Generate React/JavaScript code for: ${currentMessage}\n\nUsing Konva.js 2D engine with ${sceneAnalysis?.totalObjects || 0} objects in scene.`;
            navigator.clipboard.writeText(codePrompt);
            onCopyToClipboard && onCopyToClipboard('Code prompt copied!');
          }}
          style={{
            padding: '4px 6px',
            background: '#333',
            color: '#ccc',
            border: '1px solid #555',
            borderRadius: '3px',
            fontSize: '9px',
            cursor: 'pointer'
          }}
        >
          Code Request
        </button>
      </div>
    </div>
  );
};

export default CursorIntegration; 