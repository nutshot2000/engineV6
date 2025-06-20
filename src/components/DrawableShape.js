// DrawableShape.js
// Renders and manages individual shapes (rectangle, circle, etc.) for the grid canvas
import React, { useRef } from 'react';
import { Group, Rect, Circle, Text } from 'react-konva';

/**
 * DrawableShape component for rendering and interacting with shapes.
 * @param {object} shape - Shape data (type, position, size, etc.)
 * @param {boolean} isSelected - Whether the shape is selected
 * @param {function} onSelect - Handler for selection
 * @param {function} onChange - Handler for shape changes
 * @param {function} onContextMenu - Handler for right-click/context menu
 * @param {string} name - Optional name for the shape group
 */
function DrawableShape({ shape, isSelected, onSelect, onChange, onContextMenu, name }) {
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
          const newX = e.target.x();
          const newY = e.target.y();
          onChange({
            ...shape,
            x: newX,
            y: newY,
          });
        }
      },
    };

    const typeStyles = {
      boundary: { stroke: '#ff6b6b', strokeWidth: 2, fill: 'rgba(255, 107, 107, 0.1)' },
      hitbox: { stroke: '#4ecdc4', strokeWidth: 2, fill: 'rgba(78, 205, 196, 0.1)' },
      trigger: { stroke: '#ffe66d', strokeWidth: 2, fill: 'rgba(255, 230, 109, 0.1)' },
      collision: { stroke: '#ff9500', strokeWidth: 2, fill: 'rgba(255, 149, 0, 0.1)' },
    };
    const style = typeStyles[shape.shapeType] || typeStyles.boundary;

    if (shape.isPreview) {
      return {
        ...baseProps,
        stroke: style.stroke,
        strokeWidth: 2,
        fill: style.fill.replace('0.1', '0.2'),
        strokeDashArray: [8, 4],
        draggable: false,
        listening: false,
      };
    }
    if (shape.locked) {
      return {
        ...baseProps,
        ...style,
        strokeDashArray: shape.shapeType === 'trigger' ? [5, 5] : [2, 2],
        opacity: 0.7,
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
        id={String(shape.id)}
        name={name}
        ref={shapeRef}
        x={shape.x}
        y={shape.y}
        draggable={!shape.locked && !shape.isPreview}
        onClick={onSelect}
        onTap={onSelect}
        onContextMenu={(e) => {
          e.evt.preventDefault();
          e.evt.stopPropagation();
          onContextMenu(e, shape);
        }}
        onDragEnd={(e) => {
          if (!shape.locked) {
            const newX = e.target.x();
            const newY = e.target.y();
            onChange({
              ...shape,
              x: newX,
              y: newY,
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
          onContextMenu={(e) => {
            e.evt.preventDefault();
            e.evt.stopPropagation();
            onContextMenu(e, shape);
          }}
        />
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
    return (
      <Group
        id={String(shape.id)}
        name={name}
        ref={shapeRef}
        x={shape.x}
        y={shape.y}
        draggable={!shape.locked && !shape.isPreview}
        onClick={onSelect}
        onTap={onSelect}
        onContextMenu={(e) => {
          e.evt.preventDefault();
          e.evt.stopPropagation();
          onContextMenu(e, shape);
        }}
        onDragEnd={(e) => {
          if (!shape.locked) {
            const newX = e.target.x();
            const newY = e.target.y();
            onChange({
              ...shape,
              x: newX,
              y: newY,
            });
          }
        }}
      >
        <Circle
          x={shape.radius}
          y={shape.radius}
          radius={shape.radius}
          stroke={shapeProps.stroke}
          strokeWidth={shapeProps.strokeWidth}
          fill={shapeProps.fill}
          strokeDashArray={shapeProps.strokeDashArray}
          opacity={shapeProps.opacity}
          onContextMenu={(e) => {
            e.evt.preventDefault();
            e.evt.stopPropagation();
            onContextMenu(e, shape);
          }}
        />
        {shape.name && !shape.isPreview && (
          <Text
            x={shape.radius - (shape.name.length * 5)}
            y={shape.radius - 12}
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

export default DrawableShape;
