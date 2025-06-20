// ContextMenu.js
// Handles right-click/context menu logic for canvas, shapes, and assets
import React, { useRef, useState, useEffect } from 'react';

/**
 * ContextMenu component for context-sensitive actions.
 * @param {number} x - X position for the menu
 * @param {number} y - Y position for the menu
 * @param {object|null} target - Target object (shape, asset, or null for canvas)
 * @param {function} onClose - Handler to close the menu
 * @param {function} onAction - Handler for menu actions
 * @param {object} mousePos - Mouse position info
 * @param {string} currentShapeType - Current shape type for drawing
 */
function ContextMenu({ x, y, target, onClose, onAction, mousePos, currentShapeType }) {
  const [menuPosition, setMenuPosition] = useState({ x, y });
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (e.target.closest('[data-context-menu]')) return;
      onClose();
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  useEffect(() => {
    if (menuRef.current) {
      const menuRect = menuRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      let adjustedX = x;
      let adjustedY = y;
      if (x + menuRect.width > viewportWidth) {
        adjustedX = viewportWidth - menuRect.width - 10;
      }
      if (y + menuRect.height > viewportHeight) {
        adjustedY = y - menuRect.height;
        if (adjustedY < 10) adjustedY = 10;
      }
      if (adjustedX !== x || adjustedY !== y) {
        setMenuPosition({ x: adjustedX, y: adjustedY });
      }
    }
  }, [x, y]);

  const canvasActions = [
    { label: '---', action: 'divider' },
    { label: '🔎 Select & Group', action: 'group-select' },
    { label: '---', action: 'divider' },
    { label: `➕ Draw Rectangle (${currentShapeType || 'boundary'})`, action: 'add-rectangle' },
    { label: `⭕ Draw Circle (${currentShapeType || 'boundary'})`, action: 'add-circle' },
    { label: '---', action: 'divider' },
    { label: '🧱 Quick Boundary', action: 'add-boundary' },
    { label: '🎯 Quick Hit Box', action: 'add-hitbox' },
    { label: '⚡ Quick Trigger', action: 'add-trigger' },
    { label: '💥 Quick Collision Box', action: 'add-collision' }
  ];

  const menuItems = target ? (
    target.isAsset ? [
      { label: `✏️ Rename "${target.name || 'Asset'}"`, action: 'rename-asset' },
      { label: '---', action: 'divider' },
      { label: '📝 Add to Notes', action: 'open-ai-assistant' },
      { label: target.locked ? '🔓 Unlock' : '🔒 Lock', action: 'toggle-lock' },
      { label: '---', action: 'divider' },
      { label: '⬆️ Bring Forward', action: 'bring-forward' },
      { label: '⬇️ Send Backward', action: 'send-backward' },
      { label: '---', action: 'divider' },
      { label: '🗑️ Delete', action: 'delete', danger: true },
      ...canvasActions
    ] : [
      { label: `✏️ Rename "${target.name || 'Shape'}"`, action: 'rename-shape' },
      { label: '---', action: 'divider' },
      { label: '🎨 Change Box Type', action: 'submenu-header', disabled: true },
      { label: `🧱 ${target.shapeType === 'boundary' ? '✓' : ''} Boundary`, action: 'change-type-boundary', selected: target.shapeType === 'boundary' },
      { label: `🎯 ${target.shapeType === 'hitbox' ? '✓' : ''} Hit Box`, action: 'change-type-hitbox', selected: target.shapeType === 'hitbox' },
      { label: `⚡ ${target.shapeType === 'trigger' ? '✓' : ''} Trigger`, action: 'change-type-trigger', selected: target.shapeType === 'trigger' },
      { label: `💥 ${target.shapeType === 'collision' ? '✓' : ''} Collision Box`, action: 'change-type-collision', selected: target.shapeType === 'collision' },
      { label: '---', action: 'divider' },
      { label: target.locked ? '🔓 Unlock' : '🔒 Lock', action: 'toggle-lock' },
      { label: '---', action: 'divider' },
      { label: '⬆️ Bring Forward', action: 'bring-forward' },
      { label: '⬇️ Send Backward', action: 'send-backward' },
      { label: '---', action: 'divider' },
      { label: '📝 Add to Notes', action: 'open-ai-assistant' },
      { label: '---', action: 'divider' },
      { label: '🗑️ Delete', action: 'delete', danger: true },
      ...canvasActions
    ]
  ) : [
    ...canvasActions,
    { label: '---', action: 'divider' },
    { label: '📁 Paste Asset', action: 'paste-asset', disabled: true },
    { label: '🎮 Add Game Object', action: 'add-game-object' },
    { label: '---', action: 'divider' },
    { label: '📝 Game Notes', action: 'open-ai-assistant' },
    { label: '---', action: 'divider' },
    { label: `📍 Pixel: ${mousePos?.pixelX || mousePos?.x || 0}, ${mousePos?.pixelY || mousePos?.y || 0}`, action: 'show-pixel-position', disabled: true },
    { label: `🔲 Grid: (${Math.round((mousePos?.x || 0) / 60)}, ${Math.round((mousePos?.y || 0) / 60)}) → ${Math.round((mousePos?.x || 0) / 60) * 60}, ${Math.round((mousePos?.y || 0) / 60) * 60}`, action: 'show-grid-position', disabled: true }
  ];

  return (
    <div
      ref={menuRef}
      data-context-menu
      style={{
        position: 'fixed',
        left: menuPosition.x,
        top: menuPosition.y,
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
      {menuItems.map((item, index) => {
        if (item.action === 'divider') {
          return (
            <div
              key={index}
              style={{ height: '1px', background: '#404040', margin: '4px 0' }}
            />
          );
        }
        return (
          <div
            key={index}
            style={{
              padding: '6px 12px',
              color: item.disabled
                ? '#666666'
                : item.danger
                ? '#ff6b6b'
                : item.selected
                ? '#4CAF50'
                : '#cccccc',
              cursor: item.disabled ? 'default' : 'pointer',
              transition: 'background 0.15s ease',
              opacity: item.disabled ? 0.5 : 1,
              background: item.selected ? 'rgba(76, 175, 80, 0.1)' : 'transparent'
            }}
            onMouseEnter={(e) => {
              if (!item.disabled) {
                e.target.style.background = item.danger ? 'rgba(255, 107, 107, 0.1)' : '#37373d';
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
            }}
            onClick={() => {
              if (!item.disabled) {
                onAction(item.action, target);
                onClose();
              }
            }}
          >
            {item.label}
          </div>
        );
      })}
    </div>
  );
}

export default ContextMenu;
