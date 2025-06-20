// gridUtils.js
// Utility functions for grid math and coordinate transforms

// Viewport constants for 1920x1080 landscape
export const VIEWPORT_WIDTH = 1920;
export const VIEWPORT_HEIGHT = 1080;
export const ASPECT_RATIO = VIEWPORT_WIDTH / VIEWPORT_HEIGHT; // 16:9

// Grid system - using 32px for better division of 1920x1080
// 1920 / 32 = 60 columns, 1080 / 32 = 33.75 rows (34 rows)
const GRID_SIZE = 32;

/**
 * Snaps a value to the nearest grid line.
 * @param {number} value
 * @returns {number}
 */
export function snapToGrid(value) {
  return Math.round(value / GRID_SIZE) * GRID_SIZE;
}

/**
 * Gets grid and snap coordinates for a given (x, y) position.
 * @param {number} x
 * @param {number} y
 * @returns {{gridX: number, gridY: number, snapX: number, snapY: number}}
 */
export function getGridCoordinates(x, y) {
  return {
    gridX: Math.round(x / GRID_SIZE),
    gridY: Math.round(y / GRID_SIZE),
    snapX: snapToGrid(x),
    snapY: snapToGrid(y)
  };
}

/**
 * Calculates the viewport dimensions to fit 16:9 aspect ratio with maximum horizontal space
 * @param {number} containerWidth 
 * @param {number} containerHeight 
 * @returns {{width: number, height: number, scale: number}}
 */
export function calculateViewportDimensions(containerWidth, containerHeight) {
  // Add padding to account for border (4px) and some extra space (16px total)
  const availableWidth = containerWidth - 16;
  const availableHeight = containerHeight - 16;
  
  // Calculate scale based on available space (maximize horizontal space)
  const scaleByWidth = availableWidth / VIEWPORT_WIDTH;
  const scaleByHeight = availableHeight / VIEWPORT_HEIGHT;
  
  // Use the smaller scale to ensure it fits in both dimensions
  const scale = Math.min(scaleByWidth, scaleByHeight);
  
  return {
    width: VIEWPORT_WIDTH * scale,
    height: VIEWPORT_HEIGHT * scale,
    scale: scale
  };
}

/**
 * Gets the centered viewport position within a container
 * @param {number} containerWidth 
 * @param {number} containerHeight 
 * @param {number} viewportWidth 
 * @param {number} viewportHeight 
 * @returns {{x: number, y: number}}
 */
export function getViewportPosition(containerWidth, containerHeight, viewportWidth, viewportHeight) {
  return {
    x: (containerWidth - viewportWidth) / 2,
    y: (containerHeight - viewportHeight) / 2
  };
}

export { GRID_SIZE };
