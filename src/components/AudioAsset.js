import React, { useRef, useState } from "react";
import { Group, Rect, Text } from "react-konva";

const AudioAsset = ({ asset, isSelected, onSelect, onChange, onContextMenu, name }) => {
  const shapeRef = useRef();
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const handlePlay = () => {
    if (isPlaying) {
      // Stop audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setIsPlaying(false);
    } else {
      // Play audio
      if (audioRef.current) {
        audioRef.current.pause();
      }
      audioRef.current = new Audio(asset.src);
      audioRef.current.play().catch(console.error);
      setIsPlaying(true);
      
      // Reset when audio ends
      audioRef.current.onended = () => {
        setIsPlaying(false);
      };
    }
  };

  const width = asset.width || 120;
  const height = asset.height || 60;

  return (
    <Group
      id={String(asset.id)}
      name={name}
      x={asset.x}
      y={asset.y}
      rotation={asset.rotation || 0}
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
      {/* Audio visualization background */}
      <Rect
        x={0}
        y={0}
        width={width}
        height={height}
        fill={isPlaying ? "rgba(78, 205, 196, 0.2)" : "rgba(68, 68, 68, 0.8)"}
        stroke={isPlaying ? "#4ecdc4" : "#666"}
        strokeWidth={2}
        cornerRadius={8}
        onContextMenu={(e) => {
          e.evt.preventDefault();
          e.evt.stopPropagation();
          onContextMenu(e, asset);
        }}
      />
      
      {/* Play button */}
      <Rect
        x={10}
        y={height / 2 - 15}
        width={30}
        height={30}
        fill={isPlaying ? "#ff6b6b" : "#4ecdc4"}
        cornerRadius={15}
        onClick={handlePlay}
        onTap={handlePlay}
        onContextMenu={(e) => {
          e.evt.preventDefault();
          e.evt.stopPropagation();
          onContextMenu(e, asset);
        }}
      />
      
      {/* Play/Pause icon */}
      <Text
        x={isPlaying ? 20 : 22}
        y={height / 2 - 8}
        text={isPlaying ? "⏸" : "▶"}
        fontSize={16}
        fill="white"
        listening={false}
      />
      
      {/* Audio file name */}
      <Text
        x={50}
        y={height / 2 - 12}
        text={asset.name.replace(/\.(mp3|wav|ogg|m4a|aac|flac)$/i, '')}
        fontSize={12}
        fill="white"
        width={width - 60}
        ellipsis={true}
        listening={false}
      />
      
      {/* Audio icon */}
      <Text
        x={width - 25}
        y={height / 2 - 8}
        text="🎵"
        fontSize={16}
        listening={false}
      />
      
      {/* Locked indicator */}
      {asset.locked && (
        <Text
          x={width - 20}
          y={5}
          text="🔒"
          fontSize={12}
          fill="#ff9800"
          listening={false}
        />
      )}
    </Group>
  );
};

export default AudioAsset; 