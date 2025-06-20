import React, { useRef } from "react";
import { Image as KonvaImage, Group } from "react-konva";
import useImage from "use-image";



const AssetImage = ({ asset, isSelected, onSelect, onChange, onContextMenu, snapToGridEnabled = false, name }) => {
  const shapeRef = useRef();
  const [image] = useImage(asset.src);

  // Simple rotation handling
  const rotation = asset.rotation || 0;
  


  return (
    <Group
      id={String(asset.id)}
      name={name}
      x={asset.x}
      y={asset.y}
      rotation={rotation}
      draggable={!asset.locked}
      onClick={onSelect}
      onTap={onSelect}
      onContextMenu={(e) => {
        e.evt.preventDefault();
        e.evt.stopPropagation();
        onContextMenu(e, asset);
      }}
      ref={shapeRef}
      onDragEnd={e => {
        if (!asset.locked) {
          const newX = e.target.x();
          const newY = e.target.y();
          onChange({ ...asset, x: newX, y: newY });
        }
      }}
    >
      {/* Main image positioned at 0,0 relative to Group */}
      <KonvaImage
        image={image}
        x={0}
        y={0}
        width={asset.width || 100}
        height={asset.height || 100}
        // Visual effects - only for locked state (selection handled by Transformer)
        stroke={asset.locked ? "#ff9800" : undefined} // Orange for locked
        strokeWidth={asset.locked ? 2 : 0}
        strokeDashArray={asset.locked ? [4, 4] : undefined}
        opacity={asset.locked ? 0.7 : 1}
        onContextMenu={(e) => {
          e.evt.preventDefault();
          e.evt.stopPropagation();
          // Let the parent Group handle the context menu
          onContextMenu(e, asset);
        }}
      />
    </Group>
  );
};

export default AssetImage;
