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
  const [conversation, setConversation] = useState([
    {
      role: 'assistant',
      content: '👋 Hi! I\'m your AI Game Assistant.\n\n🎮 I can help you:\n• Move objects: "Move [object] to x: 100, y: 200"\n• Create objects: "Create a red square at x: 300, y: 150"\n• Add physics: "Make [object] bounce around"\n\n💡 Tips:\n• Click objects while typing to reference them\n• Click coordinates (bottom-right) to insert position'
    }
  ]);
  
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const textareaRef = useRef(null);
  const windowRef = useRef(null);

  // Handle object click to add reference
  const handleObjectClick = (objectId) => {
    const asset = canvasAssets.find(a => a.id === objectId);
    const shape = shapes.find(s => s.id === objectId);
    const object = asset || shape;
    
    if (object && textareaRef.current) {
      const objectName = object.name || objectId;
      const currentText = textareaRef.current.value;
      const newText = currentText ? `${currentText} [${objectName}]` : `[${objectName}]`;
      textareaRef.current.value = newText;
      setInput(newText);
      textareaRef.current.focus();
    }
  };

  // Add method to insert coordinates into chat
  const insertCoordinates = (coordText) => {
    const currentInput = textareaRef.current?.value || '';
    const newInput = currentInput ? `${currentInput} ${coordText}` : coordText;
    if (textareaRef.current) {
      textareaRef.current.value = newInput;
      setInput(newInput);
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(newInput.length, newInput.length);
    }
  };

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    handleObjectClick,
    insertCoordinates
  }));

  const handleSend = async () => {
    if (!input.trim() || isProcessing) return;

    const userMessage = { role: 'user', content: input.trim() };
    setConversation(prev => [...prev, userMessage]);
    setInput('');
    setIsProcessing(true);

    // Simple AI response simulation
    setTimeout(() => {
      const responses = [
        "I understand! I'll help you with that game development task.",
        "Great idea! That would make your game more interactive.",
        "I can help you implement that feature. Let me process your request.",
        "Excellent! That's a good approach for your game mechanics.",
        "I'll work on that modification for you right away."
      ];
      
      const response = {
        role: 'assistant',
        content: responses[Math.floor(Math.random() * responses.length)]
      };
      
      setConversation(prev => [...prev, response]);
      setIsProcessing(false);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Simple working drag implementation
  const handleMouseDown = (e) => {
    if (e.target.closest('button')) return; // Don't drag on buttons
    
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
    
    const handleMouseMove = (e) => {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
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

  // Generate comprehensive scene context for Cursor AI
  const generateSceneContext = () => {
    return `🎮 GAME ENGINE SCENE CONTEXT for Cursor AI

📊 Scene Overview:
- Total Objects: ${canvasAssets.length + shapes.length}
- Assets: ${canvasAssets.length}
- Shapes: ${shapes.length}
- Selected: ${selectedObjectId || 'None'}

📦 Canvas Assets:
${canvasAssets.map(asset => 
  `• ${asset.name || asset.id} - Position: (${Math.round(asset.x)}, ${Math.round(asset.y)}) - Size: ${Math.round(asset.width)}×${Math.round(asset.height)}`
).join('\n') || '(No assets)'}

🔷 Shapes:
${shapes.map(shape => 
  `• ${shape.name || shape.id} (${shape.type}) - Position: (${Math.round(shape.x)}, ${Math.round(shape.y)}) - Size: ${Math.round(shape.width)}×${Math.round(shape.height)}`
).join('\n') || '(No shapes)'}

💡 Context: I'm working on a React-based game engine with drag-and-drop functionality, physics systems, and AI integration. The scene uses a coordinate system where (0,0) is top-left.

🤖 Please help me with: `;
  };

  // Copy scene context to clipboard
  const copyToClipboard = async () => {
    try {
      const context = generateSceneContext();
      await navigator.clipboard.writeText(context);
      
      // Show brief success message
      setConversation(prev => [...prev, {
        role: 'assistant',
        content: '📋 Scene context copied to clipboard! You can now paste it into Cursor AI chat.'
      }]);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
      setConversation(prev => [...prev, {
        role: 'assistant',
        content: '❌ Failed to copy to clipboard. Please try again.'
      }]);
    }
  };

  const resetPosition = () => {
    setPosition({ x: 100, y: 100 });
  };

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
          width: '500px',
          maxHeight: '600px',
          background: '#1f1f1f',
          border: '1px solid #333',
          borderRadius: '8px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          display: 'flex',
          flexDirection: 'column',
          cursor: isDragging ? 'grabbing' : 'default',
          pointerEvents: 'auto' // Re-enable clicks for the window itself
        }}
      >
        {/* Header */}
        <div 
          className="ai-assistant-header"
          onMouseDown={handleMouseDown}
          style={{ 
            padding: '12px 16px',
            background: '#2d2d30',
            borderBottom: '1px solid #333',
            borderRadius: '8px 8px 0 0',
            cursor: 'grab',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            userSelect: 'none'
          }}
        >
          <h3 style={{ margin: 0, color: '#fff', fontSize: '14px' }}>🤖 AI Game Assistant</h3>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              onClick={copyToClipboard}
              style={{ 
                background: 'linear-gradient(135deg, #4ecdc4, #45b7d1)',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '4px 8px',
                fontSize: '10px',
                cursor: 'pointer'
              }}
            >
              📋 Copy
            </button>
            <button 
              onClick={resetPosition}
              style={{ 
                background: '#404040',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '4px 8px',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              📍
            </button>
            <button 
              onClick={onClose}
              style={{ 
                background: '#404040',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '4px 8px',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Conversation */}
        <div style={{ 
          flex: 1, 
          padding: '16px', 
          overflowY: 'auto', 
          maxHeight: '300px' 
        }}>
          {conversation.map((message, index) => (
            <div 
              key={index} 
              style={{
                marginBottom: '12px',
                padding: '12px',
                borderRadius: '8px',
                backgroundColor: message.role === 'user' ? '#404040' : '#2d4a3e',
                color: message.role === 'user' ? '#fff' : '#4ecdc4'
              }}
            >
              <div style={{ 
                fontSize: '11px', 
                opacity: 0.8, 
                marginBottom: '6px',
                fontWeight: 'bold'
              }}>
                {message.role === 'user' ? '👤 You' : '🤖 AI Assistant'}
              </div>
              <div style={{ lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
                {message.content}
              </div>
            </div>
          ))}
          
          {isProcessing && (
            <div style={{
              marginBottom: '12px',
              padding: '12px',
              borderRadius: '8px',
              backgroundColor: '#2d4a3e',
              color: '#4ecdc4'
            }}>
              <div style={{ 
                fontSize: '11px', 
                opacity: 0.8, 
                marginBottom: '6px',
                fontWeight: 'bold'
              }}>
                🤖 AI Assistant
              </div>
              <div style={{ opacity: 0.7 }}>💭 Thinking...</div>
            </div>
          )}
        </div>

        {/* Input */}
        <div style={{ 
          padding: '16px', 
          borderTop: '1px solid #333',
          background: '#1f1f1f'
        }}>
          <div style={{ position: 'relative' }}>
            <textarea
              ref={textareaRef}
              placeholder="Ask me to help with your game... (e.g., 'Move object to x: 100, y: 200')"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              rows={2}
              style={{
                width: '100%',
                padding: '12px',
                background: '#333',
                border: '1px solid #444',
                borderRadius: '6px',
                color: '#fff',
                fontSize: '14px',
                resize: 'none',
                fontFamily: 'inherit'
              }}
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || isProcessing}
              style={{
                position: 'absolute',
                right: '8px',
                bottom: '8px',
                background: input.trim() ? 'linear-gradient(135deg, #4ecdc4, #45b7d1)' : '#666',
                border: 'none',
                borderRadius: '4px',
                color: 'white',
                padding: '6px 12px',
                cursor: input.trim() ? 'pointer' : 'not-allowed',
                fontSize: '12px',
                fontWeight: 'bold'
              }}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

export default AIGameAssistant; 