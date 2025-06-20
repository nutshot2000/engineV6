// gridUtils.js
// Utility functions for grid math and coordinate transforms

const GRID_SIZE = 60;

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

export { GRID_SIZE };
