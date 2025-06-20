// GridLines.js
// Renders the grid background for the canvas
import React from 'react';
import { Rect } from 'react-konva';
import { GRID_SIZE } from '../utils/gridUtils';

/**
 * GridLines component renders vertical and horizontal grid lines.
 * @param {number} width - Width of the grid area
 * @param {number} height - Height of the grid area
 */
const GridLines = ({ width, height }) => {
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
  return <>{lines}</>;
};

export default GridLines;
