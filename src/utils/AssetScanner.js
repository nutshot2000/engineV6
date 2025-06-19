/**
 * Asset Scanner Utility
 * Automatically discovers assets in the public/assets folder structure
 * Provides seamless integration with AI agents for asset management
 */

// Define the asset folder structure
const ASSET_FOLDERS = [
  'assets/images',
  'assets/sprites', 
  'assets/backgrounds',
  'assets/ui',
  'assets/temp'
];

// Common image file extensions
const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.bmp'];

/**
 * Scans a specific folder for image assets
 * @param {string} folderPath - Relative path from public/
 * @returns {Promise<Array>} Array of asset objects
 */
async function scanFolder(folderPath) {
  const assets = [];
  
  try {
    // In a real file system, we'd use fs.readdir
    // For web environment, we'll use a different approach
    // This is a placeholder that would need to be implemented based on your deployment
    
    // For now, return empty array - assets will be added manually or via upload
    return assets;
  } catch (error) {
    console.warn(`Could not scan folder ${folderPath}:`, error.message);
    return assets;
  }
}

/**
 * Gets all available assets from the predefined folder structure
 * @returns {Promise<Array>} Array of all discovered assets
 */
export async function getAvailableAssets() {
  const allAssets = [];
  
  // Scan each predefined folder
  for (const folder of ASSET_FOLDERS) {
    const folderAssets = await scanFolder(folder);
    allAssets.push(...folderAssets);
  }
  
  // Add any example assets that exist
  const exampleAssets = await getExampleAssets();
  allAssets.push(...exampleAssets);
  
  return allAssets;
}

/**
 * Gets example assets that are known to exist
 * @returns {Promise<Array>} Array of example asset objects
 */
async function getExampleAssets() {
  const exampleAssets = [
    {
      name: 'player.svg',
      src: '/assets/sprites/player.svg',
      folder: 'sprites',
      type: 'sprite'
    },
    {
      name: 'grass_field.svg', 
      src: '/assets/backgrounds/grass_field.svg',
      folder: 'backgrounds',
      type: 'background'
    },
    {
      name: 'background.png',
      src: '/assets/backgrounds/background.png',
      folder: 'backgrounds',
      type: 'background'
    },
    {
      name: 'start_button.svg',
      src: '/assets/ui/start_button.svg', 
      folder: 'ui',
      type: 'ui'
    },
    {
      name: 'example.svg',
      src: '/assets/temp/example.svg',
      folder: 'temp', 
      type: 'example'
    }
  ];
  
  // Filter to only include assets that actually exist
  const validAssets = [];
  for (const asset of exampleAssets) {
    try {
      const response = await fetch(asset.src, { method: 'HEAD' });
      if (response.ok) {
        validAssets.push(asset);
      }
    } catch (error) {
      // Asset doesn't exist, skip it
    }
  }
  
  return validAssets;
}

/**
 * AI Agent Integration Helper
 * Provides folder information for AI agents to know where to place assets
 */
export function getAssetFolderInfo() {
  return {
    folders: ASSET_FOLDERS.map(folder => ({
      path: `public/${folder}`,
      purpose: getFolderPurpose(folder)
    })),
    supportedFormats: IMAGE_EXTENSIONS,
    instructions: {
      placement: 'Place assets in the appropriate folder based on their purpose',
      naming: 'Use descriptive, lowercase names with underscores instead of spaces',
      formats: 'SVG preferred for scalability, PNG/JPG for photos'
    }
  };
}

/**
 * Gets the purpose description for a folder
 * @param {string} folder - Folder path
 * @returns {string} Purpose description
 */
function getFolderPurpose(folder) {
  const purposes = {
    'assets/images': 'General images and photos',
    'assets/sprites': 'Game characters and animated objects', 
    'assets/backgrounds': 'Scene backgrounds and environments',
    'assets/ui': 'User interface elements and buttons',
    'assets/temp': 'Temporary assets and testing'
  };
  
  return purposes[folder] || 'General purpose assets';
}

export default getAvailableAssets; 