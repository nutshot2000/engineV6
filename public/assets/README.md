# Assets Folder

This folder contains shared assets that can be used by both the game engine and the Cursor AI agent.

## Folder Structure
- `images/` - Image assets (PNG, JPG, GIF, etc.)
- `sprites/` - Game sprites and character assets
- `backgrounds/` - Background images
- `ui/` - User interface elements
- `temp/` - Temporary assets for testing

## Usage
- Game Engine: Assets are loaded via the AssetManager component
- AI Agent: Can access and modify assets in this folder
- All assets are served from `/assets/` in the browser

## Supported Formats
- Images: PNG, JPG, JPEG, GIF, WebP, SVG
- Max recommended size: 10MB per file (IndexedDB storage limit)

## Adding New Assets
1. Place files in appropriate subfolder
2. Assets will be automatically available in the game engine
3. Use relative paths like `/assets/images/myimage.png` 