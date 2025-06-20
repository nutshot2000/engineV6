import React, { useRef, useState, useEffect } from "react";
import { Stage, Layer, Rect, Transformer } from "react-konva";
import AssetImage from "./AssetImage";
import AudioAsset from "./AudioAsset";
import AIGameAssistant from "./AIGameAssistant";
import ParticleSystem from "./ParticleSystem";
import Konva from "konva";
import { 
  GRID_SIZE, 
  VIEWPORT_WIDTH, 
  VIEWPORT_HEIGHT, 
  getGridCoordinates, 
  calculateViewportDimensions, 
  getViewportPosition 
} from '../utils/gridUtils';
import GridLines from './GridLines';
import DrawableShape from './DrawableShape';
import ContextMenu from './ContextMenu';
import GroupManager from './GroupManager';

function GridCanvas({ canvasAssets, setCanvasAssets, shapes, setShapes, drawingMode, setDrawingMode, currentShapeType, setCurrentShapeType, onRegisterSidebarCallback }) {
  const stageRef = useRef(null);
  const transformerRef = useRef(null);
  const aiAssistantRef = useRef(null);
  const groupManagerRef = useRef(null);
  const containerRef = useRef(null);
  
  const [contextMenu, setContextMenu] = useState(null);
  const [aiAssistant, setAIAssistant] = useState({
    isOpen: false,
    target: null,
    context: null
  });
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectionBox, setSelectionBox] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    visible: false,
    startX: 0,
    startY: 0,
  });
  const [drawStart, setDrawStart] = useState({ x: 0, y: 0 });

  const [isDrawing, setIsDrawing] = useState(false);
  const [newShape, setNewShape] = useState(null);
  const [mousePos, setMousePos] = useState({ 
    x: 0, 
    y: 0, 
    gridX: 0, 
    gridY: 0, 
    snapX: 0, 
    snapY: 0 
  });
  const [viewportDimensions, setViewportDimensions] = useState({ width: 0, height: 0, scale: 1 });
  const [viewportPosition, setViewportPosition] = useState({ x: 0, y: 0 });

  const [savedGroups, setSavedGroups] = useState([]);

  // Handle viewport scaling and positioning for perfect 16:9 aspect ratio
  useEffect(() => {
    const updateViewport = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const containerWidth = rect.width;
        const containerHeight = rect.height;
        
        // Calculate viewport dimensions to maximize horizontal space while maintaining 16:9
        const dimensions = calculateViewportDimensions(containerWidth, containerHeight);
        const position = getViewportPosition(containerWidth, containerHeight, dimensions.width, dimensions.height);
        
        setViewportDimensions(dimensions);
        setViewportPosition(position);
      }
    };

    // Initial calculation
    updateViewport();

    // Update on window resize
    window.addEventListener('resize', updateViewport);
    return () => window.removeEventListener('resize', updateViewport);
  }, []);

  // Register sidebar callback for adding assets to notes
  useEffect(() => {
    if (onRegisterSidebarCallback) {
      const handleSidebarAddToNotes = (asset) => {
        // Open AI notepad if not already open
        if (!aiAssistant.isOpen) {
          setAIAssistant({
            isOpen: true,
            target: asset,
            context: 'sidebar-asset'
          });
        }
        
        // Add asset info to notepad
        setTimeout(() => {
          if (aiAssistantRef.current) {
            aiAssistantRef.current.addObjectToChat({
              ...asset,
              isAsset: true,
              source: 'sidebar'
            });
          }
        }, 100);
      };
      
      onRegisterSidebarCallback(() => handleSidebarAddToNotes);
    }
  }, [aiAssistant.isOpen, onRegisterSidebarCallback]);

  // Connect selected objects to transformer
  useEffect(() => {
    if (transformerRef.current && stageRef.current) {
      const selectedNodes = selectedIds.map(id => {
        let node = stageRef.current.findOne('#' + id);
        // If we can't find by ID, try finding by name
        if (!node) {
          node = stageRef.current.findOne('.draggable').find(n => n.id() === id);
        }
        return node;
      }).filter(Boolean);
      
      // Clear transformer first to prevent positioning issues
      transformerRef.current.nodes([]);
      
      if (selectedNodes.length > 0) {
        // Set nodes and force immediate update
        transformerRef.current.nodes(selectedNodes);
        transformerRef.current.forceUpdate();
        
        // Additional fix: ensure the transformer recalculates bounds
        setTimeout(() => {
          if (transformerRef.current && transformerRef.current.nodes().length > 0) {
            transformerRef.current.forceUpdate();
            transformerRef.current.getLayer()?.batchDraw();
          }
        }, 10);
      }
      
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [selectedIds]);

  const handleCanvasClick = (e) => {
    // Close context menu if open
    setContextMenu(null);
    
    // if we are drawing a selection, do nothing
    if (selectionBox.visible) {
      return;
    }

    // if click on empty area (stage) - clear selections unless holding shift/ctrl
    if (e.target === e.target.getStage()) {
      const metaPressed = e.evt.shiftKey || e.evt.ctrlKey;
      if (!metaPressed) {
        setSelectedIds([]);
      }
      return;
    }

    // Check if we clicked on a selectable object (either by 'draggable' name or by having a matching ID)
    let targetId = e.target.id();
    let selectableElement = e.target;
    
    // If the clicked element doesn't have an ID, check its parent (for KonvaImage inside Group)
    if (!targetId && e.target.getParent) {
      const parent = e.target.getParent();
      if (parent && parent.id) {
        targetId = parent.id();
        selectableElement = parent;
      }
    }
    
    const hasSelectableId = targetId && (
      canvasAssets.some(asset => asset.id === targetId) || 
      shapes.some(shape => shape.id === targetId)
    );
    
    if (!selectableElement.hasName('draggable') && !hasSelectableId) {
      // Clicked on something that's not selectable (like background) - clear selections
      const metaPressed = e.evt.shiftKey || e.evt.ctrlKey;
      if (!metaPressed) {
        setSelectedIds([]);
      }
      return;
    }

    // We clicked on a selectable object - handle selection
    const objectId = targetId;
    const metaPressed = e.evt.shiftKey || e.evt.ctrlKey;
    const isSelected = selectedIds.includes(objectId);

    if (!metaPressed && !isSelected) {
      // if no key pressed and the node is not selected
      // select just one
      setSelectedIds([objectId]);
    } else if (metaPressed && isSelected) {
      // if we pressed keys and node was selected
      // we need to remove it from selection
      const ids = selectedIds.slice();
      ids.splice(ids.indexOf(objectId), 1);
      setSelectedIds(ids);
    } else if (metaPressed && !isSelected) {
      // add the node to selection
      setSelectedIds([...selectedIds, objectId]);
    }
  };

  // Handle context menu actions
  const handleContextAction = (action, target, position) => {
    // Close the context menu first to prevent it getting stuck
    setContextMenu(null);
    
    // Detect target type
    const isAsset = target && target.hasOwnProperty('src');
    const isShape = target && target.hasOwnProperty('shapeType');
    
    switch (action) {
      case 'toggle-lock':
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
        }
        setSelectedIds([]);
        break;
        
      // Group selection mode
      case 'group-select':
        setDrawingMode('group-select');
        setSelectedIds([]);

        break;
        
      // Canvas right-click actions - Start drawing mode
      case 'add-rectangle': {
        setDrawingMode('rectangle');
        setCurrentShapeType(currentShapeType || 'boundary');
        setIsDrawing(true);
        setDrawStart(position);
        setSelectedIds([]);
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
        setNewShape(rectPreview);
        setContextMenu(null);
        break;
      }
      case 'add-circle': {
        setDrawingMode('circle');
        setCurrentShapeType(currentShapeType || 'boundary');
        setIsDrawing(true);
        setDrawStart(position);
        setSelectedIds([]);
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
        setNewShape(circlePreview);
        setContextMenu(null);
        break;
      }
      
      case 'add-boundary':
        const newBoundary = {
          id: `shape_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
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
          id: `shape_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
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
          id: `shape_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
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
          id: `shape_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
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
        break;
        
      case 'open-ai-assistant':
        if (target) {
          // Select the target object
          setSelectedIds([target.id]);
          
          // Open AI Assistant and send object info
          if (!aiAssistant.isOpen) {
            setAIAssistant({
              isOpen: true,
              target: target,
              context: target.isAsset ? 'asset' : 'shape'
            });
            // Wait for AI Assistant to open, then send object info
            setTimeout(() => {
              if (aiAssistantRef.current) {
                aiAssistantRef.current.addObjectToChat(target);
              }
            }, 100);
          } else {
            // AI Assistant is already open, just send object info
            if (aiAssistantRef.current) {
              aiAssistantRef.current.addObjectToChat(target);
            }
          }
        } else {
          // No target (canvas click), just open AI Assistant
          setAIAssistant({
            isOpen: true,
            target: null,
            context: 'canvas'
          });
        }
        break;
        
      case 'paste-asset':
        // Placeholder for future asset pasting
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
        
      case 'rename-asset':
        const newAssetName = prompt(`Enter new name for ${target.name || 'Asset'}:`, target.name || 'Asset');
        if (newAssetName !== null && newAssetName.trim() !== '') {
          setCanvasAssets(prev => 
            prev.map(asset => 
              asset.id === target.id 
                ? { ...asset, name: newAssetName.trim() }
                : asset
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
  
  // Handle drag over - CRITICAL for allowing drops
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Set the drop effect to indicate this is a valid drop zone
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'copy';
    }
  };
  
  // Handle drop from sidebar - Create proper assets
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Allow asset dropping in select mode
    if (drawingMode !== 'select') {
      return;
    }
    
    if (!stageRef.current) {
      console.error('GridCanvas: Stage ref not available for drop operation');
      return;
    }
    
    try {
    stageRef.current.setPointersPositions(e);
    } catch (error) {
      console.error('GridCanvas: Error setting pointer position:', error);
      return;
    }
    
    const data = e.dataTransfer.getData("asset");
    if (!data) {
      return;
    }
    
    let asset;
    try {
      asset = JSON.parse(data);
    } catch (error) {
      console.error('GridCanvas: Invalid asset data in drop operation:', error);
      return;
    }
    
    const pos = stageRef.current.getPointerPosition();
    if (!pos) {
      
      return;
    }
    
          const gridData = getGridCoordinates(pos.x, pos.y);
    
    const newAsset = {
        ...asset,
      x: gridData.snapX, // Use grid-aligned position
      y: gridData.snapY, // Use grid-aligned position
      width: 200, // Larger default size for backgrounds
      height: 200,
        rotation: 0,
      id: `asset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      locked: false,
      isAsset: true
    };
    
    
    setCanvasAssets((prev) => [...prev, newAsset]);
  };

  // Handle canvas right-click
  const handleCanvasRightClick = (e) => {
    e.evt.preventDefault();
    
    // If we're clicking on anything other than the Stage itself, don't show canvas menu
    // This prevents the canvas menu from appearing when right-clicking on objects
    const stage = e.target.getStage();
    if (e.target !== stage) {
      // This is a right-click on an object, let the object handlers deal with it
      return;
    }
    
    const pos = stage.getPointerPosition();
    const gridData = getGridCoordinates(pos.x, pos.y);
    
    const snappedPos = {
      x: gridData.snapX,
      y: gridData.snapY,
      pixelX: Math.round(pos.x),
      pixelY: Math.round(pos.y)
    };
    
    // Only show canvas menu when clicking on empty canvas (Stage)
    setContextMenu({
      x: e.evt.clientX,
      y: e.evt.clientY,
      target: null, // Canvas menu has no target
      position: snappedPos
    });
  };

  // Handle mouse down for drawing
  const handleMouseDown = (e) => {
    // Don't interfere with drag operations - check for various drag-related conditions
    if (e.evt && (
      e.evt.dataTransfer || 
      e.evt.type === 'dragover' || 
      e.evt.type === 'drop' ||
      e.evt.buttons === 0 // No mouse button pressed (could be drag)
    )) {
      return;
    }
    
    // Also check if this is coming from a draggable element
    if (e.target && e.target.attrs && e.target.attrs.draggable) {
      return;
    }
    
    const stage = e.target.getStage();
    const pos = stage.getPointerPosition();
    
    // Convert screen coordinates to viewport coordinates
    const viewportX = (pos.x - viewportPosition.x) / viewportDimensions.scale;
    const viewportY = (pos.y - viewportPosition.y) / viewportDimensions.scale;
    
    // Clamp coordinates to viewport bounds (0-indexed, so max is WIDTH-1, HEIGHT-1)
    // Use more precise coordinate calculation to reach full 1919x1079 range
    const clampedX = Math.max(0, Math.min(VIEWPORT_WIDTH - 1, Math.floor(viewportX + 0.5)));
    const clampedY = Math.max(0, Math.min(VIEWPORT_HEIGHT - 1, Math.floor(viewportY + 0.5)));

    // Group selection logic
    if (drawingMode === 'group-select') {
      // Allow group selection on stage or background images (non-draggable elements)
      if (e.target !== stageRef.current && e.target.hasName('draggable')) {
        return;
      }
      
      setSelectionBox({
        visible: true,
        x: clampedX,
        y: clampedY,
        startX: clampedX,
        startY: clampedY,
        width: 0,
        height: 0,
      });
      return;
    }

    // Shape drawing logic
    if (drawingMode !== 'select' && !isDrawing) {
      setIsDrawing(true);
      setDrawStart({ x: clampedX, y: clampedY });
      setSelectedIds([]);
    
      let initialPreview;
      if (drawingMode === 'circle') {
        initialPreview = {
          id: 'preview',
          type: drawingMode,
          shapeType: currentShapeType || 'boundary',
          x: clampedX,
          y: clampedY,
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
          x: clampedX,
          y: clampedY,
          width: 10,
          height: 10,
          isPreview: true
        };
      }
      setNewShape(initialPreview);
    }
  };

  // Handle mouse move for drawing
  const handleMouseMove = (e) => {
    const stage = e.target.getStage();
    const pos = stage.getPointerPosition();
    
    // Convert screen coordinates to viewport coordinates
    const viewportX = (pos.x - viewportPosition.x) / viewportDimensions.scale;
    const viewportY = (pos.y - viewportPosition.y) / viewportDimensions.scale;
    
    // Clamp coordinates to viewport bounds (0-indexed, so max is WIDTH-1, HEIGHT-1)
    // Use more precise coordinate calculation to reach full 1919x1079 range
    const clampedX = Math.max(0, Math.min(VIEWPORT_WIDTH - 1, Math.floor(viewportX + 0.5)));
    const clampedY = Math.max(0, Math.min(VIEWPORT_HEIGHT - 1, Math.floor(viewportY + 0.5)));
    
    // Group selection logic
    if (drawingMode === 'group-select' && selectionBox.visible) {
      setSelectionBox(prev => ({
        ...prev,
        width: clampedX - prev.startX,
        height: clampedY - prev.startY,
      }));
      return;
    }
    
    // Update mouse position with both raw and grid-aligned coordinates
    const gridData = getGridCoordinates(clampedX, clampedY);
    setMousePos({ 
      x: clampedX, 
      y: clampedY,
      gridX: gridData.gridX,
      gridY: gridData.gridY,
      snapX: gridData.snapX,
      snapY: gridData.snapY
    });
    
    // Shape drawing logic
    if (isDrawing && drawingMode !== 'select') {
      const currentX = clampedX;
      const currentY = clampedY;
    const width = Math.abs(currentX - drawStart.x);
    const height = Math.abs(currentY - drawStart.y);
    
    let preview;
    if (drawingMode === 'circle') {
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
      setNewShape(preview);
    }
  };

  // Handle mouse up for drawing
  const handleMouseUp = (e) => {
    // Group selection logic
    if (drawingMode === 'group-select' && selectionBox.visible) {
      setSelectionBox(prev => ({ ...prev, visible: false }));
      const stage = stageRef.current;
      const box = {
        x: Math.min(selectionBox.startX, selectionBox.startX + selectionBox.width),
        y: Math.min(selectionBox.startY, selectionBox.startY + selectionBox.height),
        width: Math.abs(selectionBox.width),
        height: Math.abs(selectionBox.height),
      };
      const allNodes = stage.find('.draggable');
      
      const selected = allNodes.filter((node) => Konva.Util.haveIntersection(box, node.getClientRect()));
      
      const selectedObjectIds = selected.map((node) => node.id());
      
      setSelectedIds(selectedObjectIds);
      setDrawingMode('select'); // Stay in select mode to maintain selection
      
      // If objects were selected, show group creation dialog
      if (selectedObjectIds.length > 1) {
        const selectedObjects = [
          ...canvasAssets.filter(asset => selectedObjectIds.includes(asset.id)),
          ...shapes.filter(shape => selectedObjectIds.includes(shape.id))
        ];
        if (groupManagerRef.current && groupManagerRef.current.openGroupDialog) {
          groupManagerRef.current.openGroupDialog(selectedObjects);
        }
      } else {

      }
      return;
    }
    
    // Shape drawing logic
    if (isDrawing && drawingMode !== 'select') {
      const stage = e.target.getStage();
      const pos = stage.getPointerPosition();
      
      // Convert screen coordinates to viewport coordinates
      const viewportX = (pos.x - viewportPosition.x) / viewportDimensions.scale;
      const viewportY = (pos.y - viewportPosition.y) / viewportDimensions.scale;
      
      // Clamp coordinates to viewport bounds (0-indexed, so max is WIDTH-1, HEIGHT-1)
      // Use more precise coordinate calculation to reach full 1919x1079 range
      const clampedX = Math.max(0, Math.min(VIEWPORT_WIDTH - 1, Math.floor(viewportX + 0.5)));
      const clampedY = Math.max(0, Math.min(VIEWPORT_HEIGHT - 1, Math.floor(viewportY + 0.5)));
      
      const endPos = { x: clampedX, y: clampedY };
    const width = Math.abs(endPos.x - drawStart.x);
    const height = Math.abs(endPos.y - drawStart.y);

    if (width < 20 || height < 20) {
      setIsDrawing(false);
        setNewShape(null);
      return;
    }
      
    const shapeId = `shape_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      let finalShape;
    if (drawingMode === 'circle') {
      const radius = Math.min(width, height) / 2;
        finalShape = {
          id: shapeId, type: drawingMode, shapeType: currentShapeType || 'boundary',
          x: Math.min(drawStart.x, endPos.x), y: Math.min(drawStart.y, endPos.y),
          width: radius * 2, height: radius * 2, radius: radius, locked: false
      };
    } else {
        finalShape = {
          id: shapeId, type: drawingMode, shapeType: currentShapeType || 'boundary',
          x: Math.min(drawStart.x, endPos.x), y: Math.min(drawStart.y, endPos.y),
          width: width, height: height, locked: false
        };
      }
      setShapes((prev) => [...prev, finalShape]);
    setIsDrawing(false);
      setNewShape(null);
    }
  };

  // Handle shape context menu
  const handleShapeContextMenu = (e, shape) => {
    e.evt.preventDefault();
    e.evt.stopPropagation(); // Stop propagation to prevent Stage handler from overriding
    
    // Use the actual mouse event position instead of stage position
    const mouseX = e.evt.clientX;
    const mouseY = e.evt.clientY;
    
    setContextMenu({
      x: mouseX,
      y: mouseY,
      target: shape
    });
  };

  const handleAssetContextMenu = (e, asset) => {
    e.evt.preventDefault();
    e.evt.stopPropagation(); // Stop propagation to prevent Stage handler from overriding
    
    // Use the actual mouse event position instead of stage position
    const mouseX = e.evt.clientX;
    const mouseY = e.evt.clientY;
    
    setContextMenu({
      x: mouseX,
      y: mouseY,
      target: { ...asset, isAsset: true } // Ensure isAsset flag is set
    });
  };



  // Handle shape change
  const handleShapeChange = (updatedShape) => {
    // For single shape updates
    setShapes(shapes.map(s => (s.id === updatedShape.id ? updatedShape : s)));
  };

  const handleAssetChange = (updatedAsset) => {
    setCanvasAssets(canvasAssets.map(a => (a.id === updatedAsset.id ? updatedAsset : a)));
  };

  const handleTransformEnd = () => {
    const nodes = transformerRef.current.nodes();
    const newShapes = shapes.slice();
    const newAssets = canvasAssets.slice();

    nodes.forEach(node => {
      const id = node.id();
      const isAsset = canvasAssets.some(a => a.id === id);
      const scaleX = node.scaleX();
      const scaleY = node.scaleY();
    
    if (isAsset) {
        const index = newAssets.findIndex(a => a.id === id);
        if (index !== -1) {
          const asset = newAssets[index];
          const newWidth = Math.max(10, (asset.width || 100) * scaleX);
          const newHeight = Math.max(10, (asset.height || 100) * scaleY);
          
          newAssets[index] = {
            ...asset,
            x: node.x(),
            y: node.y(),
            width: newWidth,
            height: newHeight,
            rotation: node.rotation(),
          };
          
          // Reset scale
          node.scaleX(1);
          node.scaleY(1);
        }
      } else {
        const index = newShapes.findIndex(s => s.id === id);
        if (index !== -1) {
          const shape = newShapes[index];
          
          if (shape.type === 'circle') {
            // Handle circle resizing
            const newRadius = Math.max(5, (shape.radius || 50) * Math.max(scaleX, scaleY));
            newShapes[index] = {
              ...shape,
              x: node.x(),
              y: node.y(),
              radius: newRadius,
              width: newRadius * 2,
              height: newRadius * 2,
              rotation: node.rotation(),
            };
          } else {
            // Handle rectangle resizing
            const newWidth = Math.max(5, (shape.width || 100) * scaleX);
            const newHeight = Math.max(5, (shape.height || 100) * scaleY);
            
            newShapes[index] = {
              ...shape,
              x: node.x(),
              y: node.y(),
              width: newWidth,
              height: newHeight,
              rotation: node.rotation(),
            };
          }
          
          // Reset scale
          node.scaleX(1);
          node.scaleY(1);
        }
      }
    });

    setShapes(newShapes);
    setCanvasAssets(newAssets);
    
    // Force transformer to update after changes
    setTimeout(() => {
      if (transformerRef.current) {
        transformerRef.current.forceUpdate();
        transformerRef.current.getLayer()?.batchDraw();
      }
    }, 0);
  };

  return (
    <div
      ref={containerRef}
      className="grid-canvas"
      style={{ 
        position: 'relative', 
        background: '#1e1e1e', 
        width: '100%', 
        height: '100%',
        userSelect: 'none',
        WebkitUserDrag: 'none',
        KhtmlUserDrag: 'none',
        MozUserDrag: 'none',
        OUserDrag: 'none',
        userDrag: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
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
        viewportScale={viewportDimensions.scale}
        viewportWidth={VIEWPORT_WIDTH}
        viewportHeight={VIEWPORT_HEIGHT}
      />
      
      {/* Viewport Container - 16:9 Aspect Ratio with Maximum Horizontal Space */}
      <div
        style={{
          position: 'absolute',
          left: viewportPosition.x,
          top: viewportPosition.y,
          width: viewportDimensions.width,
          height: viewportDimensions.height,
          border: '2px solid #4ecdc4',
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 0 20px rgba(78, 205, 196, 0.3)',
          background: '#2a2a2a'
        }}
      >
        <Stage 
          width={viewportDimensions.width}
          height={viewportDimensions.height}
          scaleX={viewportDimensions.scale}
          scaleY={viewportDimensions.scale}
          ref={stageRef}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onContextMenu={handleCanvasRightClick}
          onClick={handleCanvasClick}
        >
          <Layer>
            <GridLines width={VIEWPORT_WIDTH} height={VIEWPORT_HEIGHT} />
          
          {/* Render shapes */}
          {shapes.map((shape) => {
            const isSelected = selectedIds.includes(shape.id);
            return (
              <DrawableShape
                key={shape.id}
                shape={shape}
                isSelected={isSelected}
                onSelect={() => {
                  if (!isSelected) {
                    setSelectedIds([shape.id]);
                  }
                }}
                onChange={handleShapeChange}
                onContextMenu={(e) => handleShapeContextMenu(e, shape)}
                name="draggable"
              />
            );
          })}
          
          {/* Render preview shape */}
          {newShape && (
            <DrawableShape
              key="preview"
              shape={newShape}
              isSelected={false}
              onSelect={() => {}}
              onChange={() => {}}
              onContextMenu={() => {}}
            />
          )}
          
          {/* Render assets */}
          {canvasAssets.map((asset) => {
            const isSelected = selectedIds.includes(asset.id);
            const AssetComponent = asset.isAudio ? AudioAsset : AssetImage;
            
            return (
              <AssetComponent
              key={asset.id}
              asset={asset}
                isSelected={isSelected}
                onSelect={() => {
                  if (!isSelected) {
                    setSelectedIds([asset.id]);
                  }
                }}
                onChange={handleAssetChange}
                onContextMenu={(e) => handleAssetContextMenu(e, asset)}
                name="draggable"
              />
            );
          })}

          <Transformer 
            ref={transformerRef} 
            onTransformEnd={handleTransformEnd}
            onDragEnd={handleTransformEnd}
            boundBoxFunc={(oldBox, newBox) => {
              // limit resize
              if (newBox.width < 5 || newBox.height < 5) {
                return oldBox;
              }
              return newBox;
            }}
          />

          {/* Selection box - render last so it's always visible on top */}
          {selectionBox.visible && (
            <Rect
              x={selectionBox.x}
              y={selectionBox.y}
              width={selectionBox.width}
              height={selectionBox.height}
              fill="rgba(0, 161, 255, 0.3)"
              stroke="#00a1ff"
              strokeWidth={2}
              strokeDashArray={[5, 5]}
              listening={false}
            />
          )}
        </Layer>
      </Stage>
      </div>
      
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
              Start: {Math.round(drawStart.x)}, {Math.round(drawStart.y)}
            </div>
          )}
        </div>
      )}

      {/* Combined Info Display - Fixed position at bottom center */}
      <div style={{
        position: 'fixed',
        bottom: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(0, 0, 0, 0.9)',
        color: '#fff',
        padding: '10px 20px',
        borderRadius: 8,
        fontSize: 12,
        fontFamily: 'monospace',
        border: '1px solid rgba(78, 205, 196, 0.3)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        userSelect: 'none',
        pointerEvents: 'none',
        zIndex: 1000,
        display: 'flex',
        gap: 24,
        alignItems: 'center',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)'
      }}>
        {/* Live Coordinates Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <div style={{ fontSize: 11, opacity: 0.7, fontWeight: 'bold', marginBottom: 2 }}>
            📍 LIVE COORDINATES
          </div>
          <div style={{ color: '#4ecdc4', fontSize: 11 }}>
            Pixel: {Math.round(mousePos.x)}, {Math.round(mousePos.y)}
          </div>
          <div style={{ color: '#ffd93d', fontSize: 11 }}>
            Grid: ({mousePos.gridX}, {mousePos.gridY})
          </div>
          <div style={{ color: '#ff6b6b', fontSize: 10 }}>
            Snap: {mousePos.snapX}, {mousePos.snapY}
          </div>
        </div>

        {/* Selected Object Info Section */}
        {selectedIds.length > 0 && (() => {
          const selectedId = selectedIds[0];
          const selectedAsset = canvasAssets.find(a => a.id === selectedId);
          const selectedShape = shapes.find(s => s.id === selectedId);
          const selectedObject = selectedAsset || selectedShape;
          
          if (selectedObject) {
            return (
              <>
                {/* Divider */}
                <div style={{ width: 1, height: 60, background: 'rgba(255, 255, 255, 0.2)' }}></div>
                
                {/* Selected Object Section */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <div style={{ fontSize: 11, opacity: 0.7, fontWeight: 'bold', marginBottom: 2 }}>
                    🎯 SELECTED OBJECT
                  </div>
                  <div style={{ color: '#4ecdc4', fontSize: 11 }}>
                    Pos: {Math.round(selectedObject.x || 0)}, {Math.round(selectedObject.y || 0)}
                  </div>
                  <div style={{ color: '#ffd93d', fontSize: 11 }}>
                    Size: {Math.round(selectedObject.width || 0)}×{Math.round(selectedObject.height || 0)}
                  </div>
                  {selectedObject.rotation && selectedObject.rotation !== 0 && (
                    <div style={{ color: '#ff6b6b', fontSize: 10 }}>
                      Rotation: {Math.round(selectedObject.rotation)}°
                    </div>
                  )}
                  <div style={{ color: '#a0a0a0', fontSize: 9 }}>
                    {selectedAsset ? (selectedAsset.isAudio ? 'Audio' : 'Asset') : (selectedShape?.shapeType || 'Shape')}
                  </div>
                </div>
              </>
            );
          }
          return null;
        })()}

        {/* Divider */}
        <div style={{ width: 1, height: 60, background: 'rgba(255, 255, 255, 0.2)' }}></div>

        {/* Viewport Info Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <div style={{ fontSize: 11, opacity: 0.7, fontWeight: 'bold', marginBottom: 2 }}>
            🎮 VIEWPORT INFO
          </div>
          <div style={{ color: '#4ecdc4', fontSize: 11 }}>
            Resolution: {VIEWPORT_WIDTH}x{VIEWPORT_HEIGHT}
          </div>
          <div style={{ color: '#ffd93d', fontSize: 11 }}>
            Scale: {(viewportDimensions.scale * 100).toFixed(1)}%
          </div>
          <div style={{ color: '#ff6b6b', fontSize: 10 }}>
            Grid: {GRID_SIZE}px ({Math.floor(VIEWPORT_WIDTH/GRID_SIZE)}×{Math.ceil(VIEWPORT_HEIGHT/GRID_SIZE)})
          </div>
        </div>
      </div>
      
      {/* AI Game Assistant */}
      <AIGameAssistant
        ref={aiAssistantRef}
        isOpen={aiAssistant.isOpen}
        onClose={() => setAIAssistant({ isOpen: false, target: null, context: null })}
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
        selectedObjectId={selectedIds[0]}
        onSelectObject={setSelectedIds}
      />

      {/* Group Manager */}
      <GroupManager
        ref={groupManagerRef}
        canvasAssets={canvasAssets}
        shapes={shapes}
        savedGroups={savedGroups}
        setSavedGroups={setSavedGroups}
        onSelectIds={setSelectedIds}
        aiAssistant={aiAssistant}
        setAIAssistant={setAIAssistant}
        aiAssistantRef={aiAssistantRef}
      />

      {/* AI Notepad Button - Always visible and prominent */}
      <button
        onClick={() => setAIAssistant({
          isOpen: true,
          target: null,
          context: 'manual'
        })}
        style={{
          position: 'absolute',
          top: 8,
          right: 8,
          background: aiAssistant.isOpen ? 'rgba(78, 205, 196, 0.7)' : 'rgba(78, 205, 196, 0.6)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: aiAssistant.isOpen ? '2px solid rgba(78, 205, 196, 0.8)' : '2px solid rgba(78, 205, 196, 0.5)',
          borderRadius: 8,
          color: 'white',
          padding: '12px 20px',
          cursor: 'pointer',
          fontSize: 14,
          fontWeight: 'bold',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          transition: 'all 0.2s ease',
          zIndex: 1001
        }}
        onMouseEnter={(e) => {
          if (!aiAssistant.isOpen) {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.4)';
          }
        }}
        onMouseLeave={(e) => {
          if (!aiAssistant.isOpen) {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
          }
        }}
      >
        📝 {aiAssistant.isOpen ? 'Notepad Open' : 'AI Notepad'}
      </button>
    </div>
  );
}

export default GridCanvas;
