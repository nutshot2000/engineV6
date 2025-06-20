// GroupManager.js
// Handles group creation, management, and UI for grouped objects
import React, { useState, forwardRef, useImperativeHandle } from 'react';

const GroupManager = forwardRef(function GroupManager({
  canvasAssets,
  shapes,
  savedGroups,
  setSavedGroups,
  onSelectIds,
  aiAssistant,
  setAIAssistant,
  aiAssistantRef
}, ref) {
  const [showGroupPanel, setShowGroupPanel] = useState(false);
  const [groupDialog, setGroupDialog] = useState({
    isOpen: false,
    selectedObjects: [],
    groupName: '',
    groupDescription: ''
  });

  useImperativeHandle(ref, () => ({
    openGroupDialog: (selectedObjects) => {
      setGroupDialog({
        isOpen: true,
        selectedObjects,
        groupName: '',
        groupDescription: ''
      });
    }
  }));

  // Calculate group bounds
  const calculateGroupBounds = (objects) => {
    if (objects.length === 0) return { x: 0, y: 0, width: 0, height: 0 };
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    objects.forEach(obj => {
      const x = obj.x || 0;
      const y = obj.y || 0;
      const width = obj.width || 100;
      const height = obj.height || 100;
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x + width);
      maxY = Math.max(maxY, y + height);
    });
    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    };
  };

  // Create a new group
  const handleCreateGroup = () => {
    if (groupDialog.selectedObjects.length === 0) return;
    const newGroup = {
      id: `group_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: groupDialog.groupName || `Group ${savedGroups.length + 1}`,
      description: groupDialog.groupDescription || '',
      objectIds: groupDialog.selectedObjects.map(obj => obj.id),
      objects: groupDialog.selectedObjects,
      createdAt: new Date().toISOString(),
      bounds: calculateGroupBounds(groupDialog.selectedObjects)
    };
    setSavedGroups(prev => [...prev, newGroup]);
    setGroupDialog({ isOpen: false, selectedObjects: [], groupName: '', groupDescription: '' });
  };

  // Select a group
  const handleSelectGroup = (group) => {
    // Find current objects that still exist
    const existingObjectIds = group.objectIds.filter(id =>
      canvasAssets.some(asset => asset.id === id) ||
      shapes.some(shape => shape.id === id)
    );
    onSelectIds(existingObjectIds);
    setShowGroupPanel(false);
    // If AI assistant is open, send group info to chat
    if (aiAssistant.isOpen) {
      setAIAssistant(prev => ({
        ...prev,
        target: group,
        context: 'group'
      }));
    }
  };

  // Delete a group
  const handleDeleteGroup = (groupId) => {
    setSavedGroups(prev => prev.filter(group => group.id !== groupId));
  };

  // Send group to AI assistant
  const handleSendGroupToAI = (group) => {
    if (!aiAssistant.isOpen) {
      setAIAssistant({
        isOpen: true,
        target: group,
        context: 'group'
      });
      setTimeout(() => {
        if (aiAssistantRef && aiAssistantRef.current && aiAssistantRef.current.addGroupToChat) {
          aiAssistantRef.current.addGroupToChat(group);
        }
      }, 100);
    } else {
      if (aiAssistantRef && aiAssistantRef.current && aiAssistantRef.current.addGroupToChat) {
        aiAssistantRef.current.addGroupToChat(group);
      }
    }
  };

  return (
    <>
      {/* Groups Panel Toggle Button */}
      {savedGroups.length > 0 && (
        <button
          onClick={() => setShowGroupPanel(!showGroupPanel)}
          style={{
            position: 'absolute',
            top: 8,
            right: aiAssistant.isOpen ? 180 : 140,
            background: 'rgba(0, 0, 0, 0.8)',
            border: '1px solid #404040',
            borderRadius: 4,
            color: '#4ecdc4',
            padding: '6px 12px',
            cursor: 'pointer',
            fontSize: 12,
            fontFamily: 'monospace',
            transition: 'right 0.2s ease',
            zIndex: 1001
          }}
        >
          📦 Groups ({savedGroups.length})
        </button>
      )}

      {/* Groups Management Panel */}
      {showGroupPanel && (
        <div style={{
          position: 'absolute',
          top: 50,
          right: 8,
          background: 'rgba(0, 0, 0, 0.9)',
          border: '1px solid #404040',
          borderRadius: 8,
          padding: 16,
          minWidth: 300,
          maxWidth: 400,
          maxHeight: 400,
          overflowY: 'auto',
          color: '#cccccc',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          fontSize: 12,
          zIndex: 1000
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h4 style={{ margin: 0, color: '#fff' }}>📦 Saved Groups</h4>
            <button
              onClick={() => setShowGroupPanel(false)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#666',
                cursor: 'pointer',
                fontSize: 16
              }}
            >
              ✕
            </button>
          </div>
          {savedGroups.map(group => (
            <div key={group.id} style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid #404040',
              borderRadius: 6,
              padding: 12,
              marginBottom: 12
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div>
                  <div style={{ fontWeight: 'bold', color: '#fff', marginBottom: 4 }}>{group.name}</div>
                  <div style={{ fontSize: 11, opacity: 0.7 }}>{group.objects.length} objects</div>
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                  <button
                    onClick={() => handleSelectGroup(group)}
                    style={{ padding: '4px 8px', background: '#4ade80', color: 'white', border: 'none', borderRadius: '3px', fontSize: '10px', marginRight: '4px' }}
                  >
                    Select
                  </button>
                  <button
                    onClick={() => handleSendGroupToAI(group)}
                    style={{ padding: '4px 8px', background: '#6b46c1', color: 'white', border: 'none', borderRadius: '3px', fontSize: '10px', marginRight: '4px' }}
                  >
                    To AI
                  </button>
                  <button
                    onClick={() => handleDeleteGroup(group.id)}
                    style={{ padding: '4px 8px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '3px', fontSize: '10px' }}
                  >
                    Del
                  </button>
                </div>
              </div>
              {group.description && (
                <div style={{ fontSize: 11, opacity: 0.8, fontStyle: 'italic' }}>
                  {group.description}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Group Creation Dialog */}
      {groupDialog.isOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10001
        }}>
          <div style={{
            background: '#2d2d30',
            border: '1px solid #404040',
            borderRadius: 8,
            padding: 24,
            minWidth: 400,
            maxWidth: 500,
            color: '#cccccc',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
          }}>
            <h3 style={{ margin: '0 0 16px 0', color: '#fff' }}>🎯 Create Group</h3>
            <p style={{ margin: '0 0 16px 0', fontSize: 14, opacity: 0.8 }}>
              {groupDialog.selectedObjects.length} objects selected
            </p>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 8, fontSize: 12, fontWeight: 'bold' }}>
                Group Name:
              </label>
              <input
                type="text"
                value={groupDialog.groupName}
                onChange={(e) => setGroupDialog(prev => ({ ...prev, groupName: e.target.value }))}
                style={{
                  width: '100%',
                  padding: 8,
                  background: '#1e1e1e',
                  border: '1px solid #404040',
                  borderRadius: 4,
                  color: '#cccccc',
                  fontSize: 14
                }}
                placeholder="Enter group name..."
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 8, fontSize: 12, fontWeight: 'bold' }}>
                Description:
              </label>
              <input
                type="text"
                value={groupDialog.groupDescription}
                onChange={(e) => setGroupDialog(prev => ({ ...prev, groupDescription: e.target.value }))}
                style={{
                  width: '100%',
                  padding: 8,
                  background: '#1e1e1e',
                  border: '1px solid #404040',
                  borderRadius: 4,
                  color: '#cccccc',
                  fontSize: 14
                }}
                placeholder="Enter group description..."
              />
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button
                onClick={() => setGroupDialog({ isOpen: false, selectedObjects: [], groupName: '', groupDescription: '' })}
                style={{ padding: '8px 16px', background: '#444', color: 'white', border: 'none', borderRadius: 6, fontSize: 14 }}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateGroup}
                style={{ padding: '8px 16px', background: '#4ecdc4', color: 'white', border: 'none', borderRadius: 6, fontSize: 14 }}
              >
                Create Group
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
});

export default GroupManager;
