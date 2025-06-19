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

  // Simple rotation handling
  const rotation = asset.rotation || 0;
  


  return (
    <Group>
      {/* Main image */}
      <KonvaImage
        image={image}
        x={asset.x}
        y={asset.y}
        width={asset.width || 100}
        height={asset.height || 100}
        rotation={rotation}
        draggable={!asset.locked} // Always draggable unless locked
        onClick={onSelect}
        onTap={onSelect}
        onContextMenu={(e) => {
          e.evt.preventDefault();
          onContextMenu(e, asset);
        }}
        ref={shapeRef}
        onDragEnd={e => {
          if (!asset.locked) {
            onChange({ ...asset, x: e.target.x(), y: e.target.y() });
          }
        }}
        onTransformEnd={e => {
          if (!asset.locked) {
            const node = shapeRef.current;
            const scaleX = node.scaleX();
            const scaleY = node.scaleY();
            const rotation = node.rotation();
            
            const newWidth = Math.max(10, (asset.width || 100) * scaleX);
            const newHeight = Math.max(10, (asset.height || 100) * scaleY);
            
                          onChange({
              ...asset,
              x: node.x(),
              y: node.y(),
              width: newWidth,
              height: newHeight,
              rotation: rotation
            });
            
            // Reset transform
            node.scaleX(1);
            node.scaleY(1);
          }
        }}
        // Visual effects
        stroke={
          asset.locked 
            ? "#ff9800" // Orange for locked
            : isSelected 
              ? "#007acc" // Blue for selected
              : undefined
        }
        strokeWidth={asset.locked || isSelected ? 2 : 0}
        strokeDashArray={asset.locked ? [4, 4] : undefined}
        opacity={asset.locked ? 0.7 : 1}
      />
      
      {/* Enhanced transformer for selected objects */}
      {isSelected && !asset.locked && (
        <Transformer
          ref={trRef}
          rotateEnabled={true}
          enabledAnchors={[
            "top-left", "top-center", "top-right",
            "middle-left", "middle-right", 
            "bottom-left", "bottom-center", "bottom-right"
          ]}
          borderStroke="#007acc"
          borderStrokeWidth={2}
          anchorStroke="#007acc"
          anchorFill="#ffffff"
          anchorSize={8}
          boundBoxFunc={(oldBox, newBox) => {
            // Minimum size constraints
            if (newBox.width < 10) newBox.width = 10;
            if (newBox.height < 10) newBox.height = 10;
            return newBox;
          }}
        />
      )}

    </Group>
  );
};

export default AssetImage;
