import React, { useRef, useState } from "react";
import { Stage, Layer, Rect, Circle, Text, Group } from "react-konva";
import AssetImage from "./AssetImage";
import AIGameAssistant from "./AIGameAssistant";
import ParticleSystem from "./ParticleSystem";

const GRID_SIZE = 40;

function drawGrid(width, height) {
  const lines = [];
  const cols = Math.ceil(width / GRID_SIZE) + 1;
  const rows = Math.ceil(height / GRID_SIZE) + 1;
  
  for (let i = 0; i < cols; i++) {
    lines.push(
      <Rect
        key={`v${i}`}
        x={i * GRID_SIZE}
        y={0}
        width={1}
        height={height}
        fill="#444"
      />
    );
  }
  for (let j = 0; j < rows; j++) {
    lines.push(
      <Rect
        key={`h${j}`}
        x={0}
        y={j * GRID_SIZE}
        width={width}
        height={1}
        fill="#444"
      />
    );
  }
  return lines;
}

// Context Menu Component
function ContextMenu({ x, y, target, onClose, onAction, mousePos, currentShapeType }) {
  // Different menu items based on whether we clicked on an object or empty canvas
  const menuItems = target ? (
    // Check if target is a shape (has shapeType) or an asset
    target.shapeType ? [
      // Shape-specific menu
      {
        label: `✏️ Rename "${target.name || 'Shape'}"`,
        action: 'rename-shape'
      },
      { label: '---', action: 'divider' },
      {
        label: '🎨 Change Box Type',
        action: 'submenu-header',
        disabled: true
      },
      {
        label: `🧱 ${target.shapeType === 'boundary' ? '✓' : ''} Boundary`,
        action: 'change-type-boundary',
        selected: target.shapeType === 'boundary'
      },
      {
        label: `🎯 ${target.shapeType === 'hitbox' ? '✓' : ''} Hit Box`,
        action: 'change-type-hitbox',
        selected: target.shapeType === 'hitbox'
      },
      {
        label: `⚡ ${target.shapeType === 'trigger' ? '✓' : ''} Trigger`,
        action: 'change-type-trigger',
        selected: target.shapeType === 'trigger'
      },
      {
        label: `💥 ${target.shapeType === 'collision' ? '✓' : ''} Collision Box`,
        action: 'change-type-collision',
        selected: target.shapeType === 'collision'
      },
      { label: '---', action: 'divider' },
      {
        label: target.locked ? '🔓 Unlock' : '🔒 Lock',
        action: 'toggle-lock'
      },
      { label: '---', action: 'divider' },
      {
        label: '⬆️ Bring Forward',
        action: 'bring-forward'
      },
      {
        label: '⬇️ Send Backward',
        action: 'send-backward'
      },
      { label: '---', action: 'divider' },
      {
        label: '🗑️ Delete',
        action: 'delete',
        danger: true
      }
    ] : [
      // Asset-specific menu (existing functionality)
      {
        label: target.locked ? '🔓 Unlock' : '🔒 Lock',
        action: 'toggle-lock'
      },
      { label: '---', action: 'divider' },
      {
        label: '⬆️ Bring Forward',
        action: 'bring-forward'
      },
      {
        label: '⬇️ Send Backward',
        action: 'send-backward'
      },
      { label: '---', action: 'divider' },
      {
        label: '🗑️ Delete',
        action: 'delete',
        danger: true
      }
    ]
  ) : [
    // Canvas/blank area menu
    {
      label: `➕ Draw Rectangle (${currentShapeType || 'boundary'})`,
      action: 'add-rectangle'
    },
    {
      label: `⭕ Draw Circle (${currentShapeType || 'boundary'})`,
      action: 'add-circle'
    },
    { label: '---', action: 'divider' },
    {
      label: '🧱 Quick Boundary',
      action: 'add-boundary'
    },
    {
      label: '🎯 Quick Hit Box',
      action: 'add-hitbox'
    },
    {
      label: '⚡ Quick Trigger',
      action: 'add-trigger'
    },
    {
      label: '💥 Quick Collision Box',
      action: 'add-collision'
    },
    { label: '---', action: 'divider' },
    {
      label: '📁 Paste Asset',
      action: 'paste-asset',
      disabled: true // For future implementation
    },
    {
      label: '🎮 Add Game Object',
      action: 'add-game-object'
    },
    { label: '---', action: 'divider' },
    {
      label: '🤖 AI Game Assistant',
      action: 'open-ai-assistant'
    },
    { label: '---', action: 'divider' },
    {
      label: `📍 Position: ${mousePos?.x || 0}, ${mousePos?.y || 0}`,
      action: 'show-position',
      disabled: true
    }
  ];

  return (
    <div
      style={{
        position: 'fixed',
        left: x,
        top: y,
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
      onClick={(e) => e.stopPropagation()}
    >
      {menuItems.map((item, index) => {
        if (item.action === 'divider') {
          return (
            <div
              key={index}
              style={{
                height: '1px',
                background: '#404040',
                margin: '4px 0'
              }}
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
                console.log('Context menu item clicked:', item.action, target);
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

// Shape component for drawn shapes
function DrawableShape({ shape, isSelected, onSelect, onChange, onContextMenu }) {
  const shapeRef = useRef();

  const getShapeProps = () => {
    const baseProps = {
      x: shape.x,
      y: shape.y,
      draggable: !shape.locked && !shape.isPreview,
      onClick: onSelect,
      onTap: onSelect,
      onContextMenu: (e) => {
        e.evt.preventDefault();
        onContextMenu(e, shape);
      },
      onDragEnd: (e) => {
        if (!shape.locked) {
          onChange({
            ...shape,
            x: e.target.x(),
            y: e.target.y(),
          });
        }
      },
      onTransformEnd: (e) => {
        if (!shape.locked) {
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          node.scaleX(1);
          node.scaleY(1);

          onChange({
            ...shape,
            x: node.x(),
            y: node.y(),
            width: Math.max(5, shape.width * scaleX),
            height: Math.max(5, shape.height * scaleY),
          });
        }
      },
    };

    // Shape-specific styling based on type
    const typeStyles = {
      boundary: { stroke: '#ff6b6b', strokeWidth: 2, fill: 'rgba(255, 107, 107, 0.1)' },
      hitbox: { stroke: '#4ecdc4', strokeWidth: 2, fill: 'rgba(78, 205, 196, 0.1)' },
      trigger: { stroke: '#ffe66d', strokeWidth: 2, fill: 'rgba(255, 230, 109, 0.1)' },
      collision: { stroke: '#ff9500', strokeWidth: 2, fill: 'rgba(255, 149, 0, 0.1)' },
    };

    const style = typeStyles[shape.shapeType] || typeStyles.boundary;
    
    // Preview styling - clear visual feedback
    if (shape.isPreview) {
      return {
        ...baseProps,
        stroke: style.stroke,
        strokeWidth: 2,
        fill: style.fill.replace('0.1', '0.2'), // More visible
        strokeDashArray: [8, 4], // Clearer dashed pattern
        draggable: false, // Not draggable
        listening: false, // Don't interfere with mouse events
      };
    }

    // Locked styling
    if (shape.locked) {
      return {
        ...baseProps,
        ...style,
        strokeDashArray: shape.shapeType === 'trigger' ? [5, 5] : [2, 2], // Dashed when locked
        opacity: 0.7, // Slightly faded when locked
      };
    }

    return {
      ...baseProps,
      ...style,
      strokeDashArray: shape.shapeType === 'trigger' ? [5, 5] : null,
    };
  };

  const shapeProps = getShapeProps();
  
  if (shape.type === 'rectangle') {
    return (
      <Group
        ref={shapeRef}
        x={shape.x}
        y={shape.y}
        draggable={!shape.locked && !shape.isPreview}
        onClick={onSelect}
        onTap={onSelect}
        onContextMenu={(e) => {
          e.evt.preventDefault();
          onContextMenu(e, shape);
        }}
        onDragEnd={(e) => {
          if (!shape.locked) {
            onChange({
              ...shape,
              x: e.target.x(),
              y: e.target.y(),
            });
          }
        }}
        onTransformEnd={(e) => {
          if (!shape.locked) {
            const node = shapeRef.current;
            const scaleX = node.scaleX();
            const scaleY = node.scaleY();

            node.scaleX(1);
            node.scaleY(1);

            onChange({
              ...shape,
              x: node.x(),
              y: node.y(),
              width: Math.max(5, shape.width * scaleX),
              height: Math.max(5, shape.height * scaleY),
            });
          }
        }}
      >
        <Rect
          x={0}
          y={0}
          width={shape.width}
          height={shape.height}
          stroke={shapeProps.stroke}
          strokeWidth={shapeProps.strokeWidth}
          fill={shapeProps.fill}
          strokeDashArray={shapeProps.strokeDashArray}
          opacity={shapeProps.opacity}
        />
        {/* Text label for the shape */}
        {shape.name && !shape.isPreview && (
          <Text
            x={8}
            y={8}
            text={shape.name}
            fontSize={20}
            fontFamily="Arial, sans-serif"
            fontStyle="bold"
            fill="#ffffff"
            stroke="#000000"
            strokeWidth={1.5}
            listening={false}
            perfectDrawEnabled={false}
          />
        )}
      </Group>
    );
  } else if (shape.type === 'circle') {
    // Calculate center position for circle
    const centerX = shape.x + shape.radius;
    const centerY = shape.y + shape.radius;
    
    return (
      <Group
        ref={shapeRef}
        x={centerX}
        y={centerY}
        draggable={!shape.locked && !shape.isPreview}
        onClick={onSelect}
        onTap={onSelect}
        onContextMenu={(e) => {
          e.evt.preventDefault();
          onContextMenu(e, shape);
        }}
        onDragEnd={(e) => {
          if (!shape.locked) {
            onChange({
              ...shape,
              x: e.target.x() - shape.radius,
              y: e.target.y() - shape.radius,
            });
          }
        }}
        onTransformEnd={(e) => {
          if (!shape.locked) {
            const node = shapeRef.current;
            const scaleX = node.scaleX();
            const scaleY = node.scaleY();

            node.scaleX(1);
            node.scaleY(1);

            const newRadius = Math.max(5, shape.radius * Math.max(scaleX, scaleY));
            onChange({
              ...shape,
              x: node.x() - newRadius,
              y: node.y() - newRadius,
              radius: newRadius,
              width: newRadius * 2,
              height: newRadius * 2,
            });
          }
        }}
      >
        <Circle
          x={0}
          y={0}
          radius={shape.radius}
          stroke={shapeProps.stroke}
          strokeWidth={shapeProps.strokeWidth}
          fill={shapeProps.fill}
          strokeDashArray={shapeProps.strokeDashArray}
          opacity={shapeProps.opacity}
        />
        {/* Text label for the shape */}
        {shape.name && !shape.isPreview && (
          <Text
            x={-(shape.name.length * 5)}
            y={-12}
            text={shape.name}
            fontSize={20}
            fontFamily="Arial, sans-serif"
            fontStyle="bold"
            fill="#ffffff"
            stroke="#000000"
            strokeWidth={1.5}
            listening={false}
            perfectDrawEnabled={false}
          />
        )}
      </Group>
    );

  }

  return null;
}

function GridCanvas({ canvasAssets, setCanvasAssets, shapes, setShapes, drawingMode, setDrawingMode, currentShapeType, setCurrentShapeType }) {
  const stageRef = useRef();
  const [selectedId, setSelectedId] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  const [mouseCoords, setMouseCoords] = useState({ x: 0, y: 0 });
  const [showCopyNotification, setShowCopyNotification] = useState(false);
  
  // Drawing state
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawStart, setDrawStart] = useState({ x: 0, y: 0 });
  const [previewShape, setPreviewShape] = useState(null);
  
  const aiAssistantRef = useRef();

  // Handle context menu actions
  const handleContextAction = (action, target, position) => {
    // Detect target type
    const isAsset = target && target.hasOwnProperty('src');
    const isShape = target && target.hasOwnProperty('shapeType');
    
    console.log('Context action:', action, 'target:', target, 'isAsset:', isAsset, 'isShape:', isShape);
    
    switch (action) {
      case 'toggle-lock':
        console.log('Toggle lock called for:', target);
        if (isAsset) {
          setCanvasAssets(prev => 
            prev.map(asset => 
              asset.id === target.id 
                ? { ...asset, locked: !asset.locked }
                : asset
            )
          );
        } else if (isShape) {
          setShapes(prev => 
            prev.map(shape => 
              shape.id === target.id 
                ? { ...shape, locked: !shape.locked }
                : shape
            )
          );
        } else {
          console.log('Warning: Unknown target type for lock toggle:', target);
        }
        break;
        
      case 'bring-forward':
        if (isAsset) {
          setCanvasAssets(prev => {
            const index = prev.findIndex(asset => asset.id === target.id);
            if (index < prev.length - 1) {
              const newAssets = [...prev];
              [newAssets[index], newAssets[index + 1]] = [newAssets[index + 1], newAssets[index]];
              return newAssets;
            }
            return prev;
          });
        } else if (isShape) {
          setShapes(prev => {
            const index = prev.findIndex(shape => shape.id === target.id);
            if (index < prev.length - 1) {
              const newShapes = [...prev];
              [newShapes[index], newShapes[index + 1]] = [newShapes[index + 1], newShapes[index]];
              return newShapes;
            }
            return prev;
          });
        }
        break;
        
      case 'send-backward':
        if (isAsset) {
          setCanvasAssets(prev => {
            const index = prev.findIndex(asset => asset.id === target.id);
            if (index > 0) {
              const newAssets = [...prev];
              [newAssets[index], newAssets[index - 1]] = [newAssets[index - 1], newAssets[index]];
              return newAssets;
            }
            return prev;
          });
        } else if (isShape) {
          setShapes(prev => {
            const index = prev.findIndex(shape => shape.id === target.id);
            if (index > 0) {
              const newShapes = [...prev];
              [newShapes[index], newShapes[index - 1]] = [newShapes[index - 1], newShapes[index]];
              return newShapes;
            }
            return prev;
          });
        }
        break;
        
      case 'delete':
        if (isAsset) {
          setCanvasAssets(prev => prev.filter(asset => asset.id !== target.id));
        } else if (isShape) {
          setShapes(prev => prev.filter(shape => shape.id !== target.id));
        } else {
          console.log('Warning: Unknown target type for delete:', target);
        }
        setSelectedId(null);
        break;
        
      // Canvas right-click actions - Start drawing mode
      case 'add-rectangle': {
        setDrawingMode('rectangle');
        setCurrentShapeType(currentShapeType || 'boundary');
        setIsDrawing(true);
        setDrawStart(position);
        setSelectedId(null);
        // Show initial preview
        const rectPreview = {
          id: 'preview',
          type: 'rectangle',
          shapeType: currentShapeType || 'boundary',
          x: position.x,
          y: position.y,
          width: 10,
          height: 10,
          isPreview: true
        };
        setPreviewShape(rectPreview);
        setContextMenu(null);
        break;
      }
      case 'add-circle': {
        setDrawingMode('circle');
        setCurrentShapeType(currentShapeType || 'boundary');
        setIsDrawing(true);
        setDrawStart(position);
        setSelectedId(null);
        // Show initial preview
        const circlePreview = {
          id: 'preview',
          type: 'circle',
          shapeType: currentShapeType || 'boundary',
          x: position.x,
          y: position.y,
          width: 10,
          height: 10,
          radius: 5,
          isPreview: true
        };
        setPreviewShape(circlePreview);
        setContextMenu(null);
        break;
      }
      
      case 'add-boundary':
        const newBoundary = {
          id: Date.now() + Math.random(),
          type: 'rectangle',
          shapeType: 'boundary',
          x: position?.x || 0,
          y: position?.y || 0,
          width: GRID_SIZE * 4,
          height: GRID_SIZE,
          locked: false
        };
        setShapes(prev => [...prev, newBoundary]);
        break;
        
      case 'add-hitbox':
        const newHitbox = {
          id: Date.now() + Math.random(),
          type: 'rectangle',
          shapeType: 'hitbox',
          x: position?.x || 0,
          y: position?.y || 0,
          width: GRID_SIZE * 2,
          height: GRID_SIZE * 2,
          locked: false
        };
        setShapes(prev => [...prev, newHitbox]);
        break;
        
      case 'add-trigger':
        const newTrigger = {
          id: Date.now() + Math.random(),
          type: 'rectangle',
          shapeType: 'trigger',
          x: position?.x || 0,
          y: position?.y || 0,
          width: GRID_SIZE * 3,
          height: GRID_SIZE * 3,
          locked: false
        };
        setShapes(prev => [...prev, newTrigger]);
        break;
        
      case 'add-collision':
        const newCollision = {
          id: Date.now() + Math.random(),
          type: 'rectangle',
          shapeType: 'collision',
          x: position?.x || 0,
          y: position?.y || 0,
          width: GRID_SIZE * 2.5,
          height: GRID_SIZE * 2.5,
          locked: false
        };
        setShapes(prev => [...prev, newCollision]);
        break;
        
      case 'add-game-object':
        // Placeholder for future game object creation
        console.log('Add game object at:', position);
        break;
        
      case 'open-ai-assistant':
        setAiAssistantOpen(true);
        break;
        
      case 'paste-asset':
        // Placeholder for future asset pasting
        console.log('Paste asset at:', position);
        break;
        
      // Shape-specific actions
      case 'rename-shape':
        const newName = prompt(`Enter new name for ${target.name || 'Shape'}:`, target.name || 'Shape');
        if (newName !== null && newName.trim() !== '') {
          setShapes(prev => 
            prev.map(shape => 
              shape.id === target.id 
                ? { ...shape, name: newName.trim() }
                : shape
            )
          );
        }
        break;
        
      case 'change-type-boundary':
        setShapes(prev => 
          prev.map(shape => 
            shape.id === target.id 
              ? { ...shape, shapeType: 'boundary' }
              : shape
          )
        );
        break;
        
      case 'change-type-hitbox':
        setShapes(prev => 
          prev.map(shape => 
            shape.id === target.id 
              ? { ...shape, shapeType: 'hitbox' }
              : shape
          )
        );
        break;
        
      case 'change-type-trigger':
        setShapes(prev => 
          prev.map(shape => 
            shape.id === target.id 
              ? { ...shape, shapeType: 'trigger' }
              : shape
          )
        );
        break;
        
      case 'change-type-collision':
        setShapes(prev => 
          prev.map(shape => 
            shape.id === target.id 
              ? { ...shape, shapeType: 'collision' }
              : shape
          )
        );
        break;
        
      default:
        // No action needed for unknown actions
        break;
    }
  };
  
  // Handle drop from sidebar - Create proper assets
  const handleDrop = (e) => {
    e.preventDefault();
    if (drawingMode !== 'select') return; // Only allow asset dropping in select mode
    
    stageRef.current.setPointersPositions(e);
    const data = e.dataTransfer.getData("asset");
    if (!data) return;
    
    let asset;
    try {
      asset = JSON.parse(data);
    } catch {
      return;
    }
    
    const pos = stageRef.current.getPointerPosition();
    const actualX = pos.x / 0.667;
    const actualY = pos.y / 0.667;
    
    const newAsset = {
        ...asset,
      x: actualX,
      y: actualY,
      width: 200, // Larger default size for backgrounds
      height: 200,
        rotation: 0,
      id: Date.now() + Math.random(),
      locked: false
    };
    
    setCanvasAssets((prev) => [...prev, newAsset]);
  };

  // Handle canvas right-click
  const handleCanvasRightClick = (e) => {
    e.evt.preventDefault();
    
    // Only show canvas menu if clicking on empty stage (not on objects)
    if (e.target !== e.target.getStage()) return;
    
    const stage = e.target.getStage();
    const pos = stage.getPointerPosition();
    
    // Convert to actual canvas coordinates
    const actualX = pos.x / 0.667;
    const actualY = pos.y / 0.667;
    const snappedPos = {
      x: Math.round(actualX),
      y: Math.round(actualY)
    };
    
    setContextMenu({
      x: pos.x + stage.container().getBoundingClientRect().left,
      y: pos.y + stage.container().getBoundingClientRect().top,
      target: null, // No target = canvas menu
      position: snappedPos
    });
  };

  // Handle mouse down for drawing
  const handleMouseDown = (e) => {
    // Only start drawing if we're in a drawing mode and not already drawing
    if (drawingMode === 'select' || isDrawing) return;
    
    const stage = e.target.getStage();
    const pos = stage.getPointerPosition();
    const actualX = pos.x / 0.667;
    const actualY = pos.y / 0.667;
    
    // Use raw coordinates for drawing
    setIsDrawing(true);
    setDrawStart({ x: actualX, y: actualY });
    setSelectedId(null);
    
    // Show initial preview dot/shape at click position
    let initialPreview;
    if (drawingMode === 'circle') {
      initialPreview = {
        id: 'preview',
        type: drawingMode,
        shapeType: currentShapeType || 'boundary',
        x: actualX,
        y: actualY,
        width: 10,
        height: 10,
        radius: 5,
        isPreview: true
      };
    } else {
      initialPreview = {
        id: 'preview',
        type: drawingMode,
        shapeType: currentShapeType || 'boundary',
        x: actualX,
        y: actualY,
        width: 10,
        height: 10,
        isPreview: true
      };
    }
    setPreviewShape(initialPreview);
  };

  // Handle mouse move for drawing
  const handleMouseMove = (e) => {
    const stage = e.target.getStage();
    const pos = stage.getPointerPosition();
    const actualX = pos.x / 0.667;
    const actualY = pos.y / 0.667;
    
    // Update mouse coordinates for copying
    setMouseCoords({ x: Math.round(actualX), y: Math.round(actualY) });
    
    if (!isDrawing || drawingMode === 'select') {
      return;
    }
    
    // Use raw coordinates for preview
    const currentX = actualX;
    const currentY = actualY;
    const width = Math.abs(currentX - drawStart.x);
    const height = Math.abs(currentY - drawStart.y);
    
    let preview;
    if (drawingMode === 'circle') {
      // For circles, calculate radius from the distance to mouse
      const radius = Math.max(Math.min(width, height) / 2, 5);
      preview = {
        id: 'preview',
        type: drawingMode,
        shapeType: currentShapeType || 'boundary',
        x: Math.min(drawStart.x, currentX),
        y: Math.min(drawStart.y, currentY),
        width: radius * 2,
        height: radius * 2,
        radius: radius,
        isPreview: true
      };
    } else {
      preview = {
        id: 'preview',
        type: drawingMode,
        shapeType: currentShapeType || 'boundary',
        x: Math.min(drawStart.x, currentX),
        y: Math.min(drawStart.y, currentY),
        width: Math.max(width, 10),
        height: Math.max(height, 10),
        isPreview: true
      };
    }
    setPreviewShape(preview);
  };

  // Handle mouse up for drawing
  const handleMouseUp = (e) => {
    if (!isDrawing || drawingMode === 'select') return;
    const stage = e.target.getStage();
    const pos = stage.getPointerPosition();
    const actualPos = {
      x: pos.x / 0.667,
      y: pos.y / 0.667
    };
    // Use raw coordinates for end position
    const endPos = {
      x: actualPos.x,
      y: actualPos.y
    };
    const width = Math.abs(endPos.x - drawStart.x);
    const height = Math.abs(endPos.y - drawStart.y);
    if (width < 20 || height < 20) {
      setIsDrawing(false);
      setPreviewShape(null);
      return;
    }
    const shapeId = `shape_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    let newShape;
    if (drawingMode === 'circle') {
      const radius = Math.min(width, height) / 2;
      newShape = {
        id: shapeId,
        type: drawingMode,
        shapeType: currentShapeType || 'boundary',
        x: Math.min(drawStart.x, endPos.x),
        y: Math.min(drawStart.y, endPos.y),
        width: radius * 2,
        height: radius * 2,
        radius: radius,
        locked: false
      };
    } else {
      newShape = {
        id: shapeId,
        type: drawingMode,
        shapeType: currentShapeType || 'boundary',
        x: Math.min(drawStart.x, endPos.x),
        y: Math.min(drawStart.y, endPos.y),
        width: width,
        height: height,
        locked: false
      };
    }
    setShapes((prev) => [...prev, newShape]);
    setIsDrawing(false);
    setPreviewShape(null);
  };

  // Handle shape context menu
  const handleShapeContextMenu = (e, shape) => {
    e.evt.preventDefault();
    const stage = e.target.getStage();
    const pos = stage.getPointerPosition();
    
    setContextMenu({
      x: pos.x + stage.container().getBoundingClientRect().left,
      y: pos.y + stage.container().getBoundingClientRect().top,
      target: shape
    });
  };



  // Handle shape selection
  const handleShapeSelect = (shapeId) => {
    setSelectedId(shapeId);
    // If AI assistant is open, let it handle the object click
    if (aiAssistantOpen && aiAssistantRef.current) {
      aiAssistantRef.current.handleObjectClick(shapeId);
    }
  };

  // Handle shape change
  const handleShapeChange = (updatedShape) => {
    // Check if it's an asset or a shape
    const isAsset = canvasAssets.find(asset => asset.id === updatedShape.id);
    const isShape = shapes.find(shape => shape.id === updatedShape.id);
    
    if (isAsset) {
      setCanvasAssets((prev) =>
        prev.map((asset) => (asset.id === updatedShape.id ? updatedShape : asset))
      );
    } else if (isShape) {
      setShapes((prev) =>
        prev.map((shape) => (shape.id === updatedShape.id ? updatedShape : shape))
      );
    }
  };

  // Handle coordinate click to copy or insert into AI chat
  const handleCoordinateClick = async () => {
    const coordText = `x: ${mouseCoords.x}, y: ${mouseCoords.y}`;
    
    // If AI assistant is open, insert coordinates into chat
    if (aiAssistantOpen && aiAssistantRef.current) {
      aiAssistantRef.current.insertCoordinates(coordText);
      setShowCopyNotification(true);
      setTimeout(() => setShowCopyNotification(false), 2000);
      return;
    }
    
    // Otherwise, copy to clipboard
    try {
      await navigator.clipboard.writeText(coordText);
      setShowCopyNotification(true);
      setTimeout(() => setShowCopyNotification(false), 2000);
    } catch (err) {
      console.log('Fallback: Could not copy to clipboard');
    }
  };

  return (
    <div
      className="grid-canvas"
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      onClick={() => setContextMenu(null)} // Close context menu on click
      style={{ position: 'relative' }}
    >
      {/* Epic Particle System Overlay */}
      <ParticleSystem 
        particles={canvasAssets.reduce((acc, asset) => {
          if (asset.particles) {
            acc.push(...asset.particles);
          }
          return acc;
        }, [])}
        enabled={true}
      />
      
      <Stage 
        width={1920} 
        height={1080} 
        scaleX={0.667}
        scaleY={0.667}
        ref={stageRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onContextMenu={handleCanvasRightClick}
      >
        <Layer>
          {drawGrid(1920, 1080)}
          
          {/* Render shapes */}
          {shapes.map((shape) => {
            return (
              <DrawableShape
                key={shape.id}
                shape={shape}
                isSelected={selectedId === shape.id}
                onSelect={() => handleShapeSelect(shape.id)}
                onChange={handleShapeChange}
                onContextMenu={handleShapeContextMenu}
              />
            );
          })}
          
          {/* Render preview shape */}
          {previewShape && (
            <DrawableShape
              key="preview"
              shape={previewShape}
              isSelected={false}
              onSelect={() => {}}
              onChange={() => {}}
              onContextMenu={() => {}}
            />
          )}
          
          {/* Render assets */}
          {canvasAssets.map((asset) => (
            <AssetImage
              key={asset.id}
              asset={asset}
              isSelected={selectedId === asset.id}
              onSelect={() => handleShapeSelect(asset.id)}
              onChange={handleShapeChange}
              onContextMenu={handleShapeContextMenu}
            />
          ))}
        </Layer>
      </Stage>
      
      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          target={contextMenu.target}
          mousePos={contextMenu.position}
          currentShapeType={currentShapeType}
          onClose={() => setContextMenu(null)}
          onAction={(action, target) => handleContextAction(action, target, contextMenu.position)}
        />
      )}
      
      {/* Clickable coordinates display */}
      <div 
        onClick={handleCoordinateClick}
        style={{
          position: 'absolute',
          bottom: 4,
          right: 8,
          background: 'rgba(0, 0, 0, 0.7)',
          color: aiAssistantOpen ? '#45b7d1' : '#4ecdc4',
          padding: '4px 8px',
          borderRadius: 4,
          fontSize: 11,
          fontFamily: 'monospace',
          cursor: 'pointer',
          border: `1px solid ${aiAssistantOpen ? 'rgba(69, 183, 209, 0.5)' : 'rgba(78, 205, 196, 0.3)'}`,
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => {
          const color = aiAssistantOpen ? '#45b7d1' : '#4ecdc4';
          e.target.style.background = `rgba(${aiAssistantOpen ? '69, 183, 209' : '78, 205, 196'}, 0.2)`;
          e.target.style.borderColor = color;
        }}
        onMouseLeave={(e) => {
          e.target.style.background = 'rgba(0, 0, 0, 0.7)';
          e.target.style.borderColor = aiAssistantOpen ? 'rgba(69, 183, 209, 0.5)' : 'rgba(78, 205, 196, 0.3)';
        }}
        title={aiAssistantOpen ? "Click to insert coordinates into AI chat" : "Click to copy coordinates"}
      >
        📍 {mouseCoords.x}, {mouseCoords.y} | Mode: {drawingMode || 'select'}
      </div>

      {/* Copy/Insert notification */}
      {showCopyNotification && (
        <div style={{
          position: 'absolute',
          bottom: 40,
          right: 8,
          background: aiAssistantOpen ? 'rgba(69, 183, 209, 0.9)' : 'rgba(78, 205, 196, 0.9)',
          color: 'white',
          padding: '4px 8px',
          borderRadius: 4,
          fontSize: 10,
          fontWeight: 'bold',
          animation: 'fadeIn 0.3s ease'
        }}>
          {aiAssistantOpen ? '💬 Inserted into chat:' : '📋 Copied:'} x: {mouseCoords.x}, y: {mouseCoords.y}
        </div>
      )}
      
      {/* Drawing mode indicator */}
      {drawingMode !== 'select' && (
        <div style={{
          position: 'absolute',
          top: 8,
          left: 8,
          background: 'rgba(0, 0, 0, 0.8)',
          color: '#fff',
          padding: '4px 8px',
          borderRadius: 3,
          fontSize: 11,
          fontFamily: 'monospace'
        }}>
          Drawing: {drawingMode} ({currentShapeType})
          {isDrawing && (
            <div style={{ fontSize: 9, opacity: 0.7, marginTop: 2 }}>
              Start: {drawStart.x}, {drawStart.y}
            </div>
          )}
        </div>
      )}
      
      {/* AI Game Assistant */}
      <AIGameAssistant
        ref={aiAssistantRef}
        isOpen={aiAssistantOpen}
        onClose={() => setAiAssistantOpen(false)}
        canvasAssets={canvasAssets}
        shapes={shapes}
        onUpdateProject={(updatedData) => {
          if (updatedData.canvasAssets) setCanvasAssets(updatedData.canvasAssets);
          if (updatedData.shapes) setShapes(updatedData.shapes);
        }}
        onCreateAsset={(asset) => setCanvasAssets(prev => [...prev, asset])}
        onModifyObject={(objectId, changes) => {
          // Check if it's an asset or shape and update accordingly
          const asset = canvasAssets.find(a => a.id === objectId);
          if (asset) {
            setCanvasAssets(prev => 
              prev.map(a => a.id === objectId ? { ...a, ...changes } : a)
            );
          } else {
            setShapes(prev => 
              prev.map(s => s.id === objectId ? { ...s, ...changes } : s)
            );
          }
        }}
        selectedObjectId={selectedId}
        onSelectObject={setSelectedId}
      />
    </div>
  );
}

export default GridCanvas;
