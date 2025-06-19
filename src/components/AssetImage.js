import React, { useRef, useEffect } from "react";
import { Image as KonvaImage, Transformer, Group } from "react-konva";
import useImage from "use-image";

const AssetImage = ({ asset, isSelected, onSelect, onChange, onContextMenu }) => {
  const shapeRef = useRef();
  const trRef = useRef();
  const [image] = useImage(asset.src);

  useEffect(() => {
    if (isSelected && trRef.current && !asset.locked) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected, asset.locked]);

  // Calculate dynamic properties for bouncing objects
  const isBouncingObject = asset.vx || asset.vy || asset.bouncing;
  const dynamicScale = asset.scale || 1;
  const dynamicRotation = asset.rotation || 0;
  const glowIntensity = isBouncingObject ? Math.abs((asset.vx || 0) + (asset.vy || 0)) / 20 : 0;
  
  // Create trail effect for bouncing objects
  const renderTrail = () => {
    if (!isBouncingObject || !asset.trail) return null;
    
    const trailPoints = asset.trail.slice(-10); // Last 10 positions
    if (trailPoints.length < 2) return null;
    
    return trailPoints.map((point, index) => {
      const opacity = (index / trailPoints.length) * 0.5;
      const size = (index / trailPoints.length) * dynamicScale * 0.5;
      
      return (
        <KonvaImage
          key={`trail-${index}`}
          image={image}
          x={point.x}
          y={point.y}
          width={(asset.width || 100) * size}
          height={(asset.height || 100) * size}
          rotation={dynamicRotation}
          opacity={opacity}
          listening={false} // Don't interfere with interactions
        />
      );
    });
  };

  // Create particle effects
  const renderParticles = () => {
    if (!asset.particles) return null;
    
    return asset.particles.map((particle, index) => (
      <KonvaImage
        key={`particle-${index}`}
        x={particle.x}
        y={particle.y}
        width={particle.size}
        height={particle.size}
        fill={particle.color}
        opacity={particle.life}
        listening={false}
      />
    ));
  };

  return (
    <Group>
      {/* Render trail effect behind the main image */}
      {renderTrail()}
      
      {/* Render particle effects */}
      {renderParticles()}
      
      {/* Main image with epic effects */}
      <KonvaImage
        image={image}
        x={asset.x}
        y={asset.y}
        width={(asset.width || 100) * dynamicScale}
        height={(asset.height || 100) * dynamicScale}
        rotation={dynamicRotation}
        draggable={!asset.locked && !isBouncingObject} // Don't allow dragging bouncing objects
        onClick={onSelect}
        onTap={onSelect}
        onContextMenu={(e) => {
          e.evt.preventDefault();
          onContextMenu(e, asset);
        }}
        ref={shapeRef}
        onDragEnd={e => {
          if (!asset.locked && !isBouncingObject) {
            onChange({ ...asset, x: e.target.x(), y: e.target.y() });
          }
        }}
        onTransformEnd={e => {
          if (!asset.locked && !isBouncingObject) {
            const node = shapeRef.current;
            const scaleX = node.scaleX();
            const scaleY = node.scaleY();
            onChange({
              ...asset,
              x: node.x(),
              y: node.y(),
              width: Math.max(10, node.width() * scaleX),
              height: Math.max(10, node.height() * scaleY),
              rotation: node.rotation()
            });
            node.scaleX(1);
            node.scaleY(1);
          }
        }}
        // Epic visual effects
        stroke={
          asset.locked 
            ? "#ff9800" // Orange for locked
            : isSelected 
              ? "#007acc" // Blue for selected
              : isBouncingObject
                ? `hsl(${asset.hue || 0}, 100%, 50%)` // Rainbow for bouncing
                : undefined
        }
        strokeWidth={
          asset.locked || isSelected ? 2 : 
          isBouncingObject ? Math.max(2, glowIntensity * 2) : 0
        }
        strokeDashArray={asset.locked ? [4, 4] : undefined}
        opacity={asset.locked ? 0.7 : 1}
        // Add glow effect for bouncing objects
        shadowColor={isBouncingObject ? `hsl(${asset.hue || 0}, 100%, 50%)` : undefined}
        shadowBlur={isBouncingObject ? Math.max(10, glowIntensity * 10) : 0}
        shadowOpacity={isBouncingObject ? 0.8 : 0}
        shadowOffsetX={0}
        shadowOffsetY={0}
        // Add brightness and saturation effects
        filters={isBouncingObject ? [
          // Custom filter effects would go here if Konva supported them
          // For now, we'll use stroke and shadow for visual impact
        ] : undefined}
      />
      
      {/* Enhanced transformer for non-bouncing objects */}
      {isSelected && !asset.locked && !isBouncingObject && (
        <Transformer
          ref={trRef}
          rotateEnabled={true}
          enabledAnchors={[
            "top-left", "top-center", "top-right",
            "middle-left", "middle-right", 
            "bottom-left", "bottom-center", "bottom-right"
          ]}
          borderStroke="#007acc"
          borderStrokeWidth={1}
          anchorStroke="#007acc"
          anchorFill="#ffffff"
          anchorSize={6}
        />
      )}
      
      {/* Special indicator for bouncing objects */}
      {isBouncingObject && (
        <KonvaImage
          x={asset.x - 10}
          y={asset.y - 10}
          width={20}
          height={20}
          fill={`hsl(${asset.hue || 0}, 100%, 70%)`}
          opacity={0.6 + Math.sin(Date.now() / 200) * 0.3} // Pulsing effect
          listening={false}
        />
      )}
    </Group>
  );
};

export default AssetImage;
