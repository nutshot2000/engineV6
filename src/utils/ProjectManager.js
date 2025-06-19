// ProjectManager.js - Handles saving/loading projects with large data support

class ProjectManager {
  constructor() {
    this.currentProject = null;
    this.autoSaveInterval = null;
  }

  // Save project to localStorage (with compression for large data)
  saveProject(projectData, projectName = 'untitled') {
    try {
      const project = {
        name: projectName,
        version: '1.0',
        timestamp: Date.now(),
        assets: projectData.assets || [],
        canvasAssets: projectData.canvasAssets || [],
        shapes: projectData.shapes || [],
        settings: projectData.settings || {}
      };

      console.log('Saving project data:', {
        name: projectName,
        assetsCount: project.assets.length,
        canvasAssetsCount: project.canvasAssets.length,
        shapesCount: project.shapes.length
      });

      // Try to stringify first to check for circular references
      const jsonString = JSON.stringify(project);
      console.log('JSON string length:', jsonString.length);
      
      // Compress data for large projects
      const compressed = this.compressData(jsonString);
      console.log('Compressed data length:', compressed.length);
      
      // Save to localStorage
      localStorage.setItem(`project_${projectName}`, compressed);
      localStorage.setItem('lastProject', projectName);
      
      this.currentProject = projectName;
      console.log(`Project "${projectName}" saved successfully`);
      return true;
    } catch (error) {
      console.error('Failed to save project:', error);
      console.error('Error details:', error.message);
      
      // Try to save without compression as fallback
      try {
        console.log('Attempting to save without compression...');
        const project = {
          name: projectName,
          version: '1.0',
          timestamp: Date.now(),
          assets: projectData.assets || [],
          canvasAssets: projectData.canvasAssets || [],
          shapes: projectData.shapes || [],
          settings: projectData.settings || {}
        };
        
        localStorage.setItem(`project_${projectName}`, JSON.stringify(project));
        localStorage.setItem('lastProject', projectName);
        
        this.currentProject = projectName;
        console.log(`Project "${projectName}" saved successfully (uncompressed)`);
        return true;
      } catch (fallbackError) {
        console.error('Fallback save also failed:', fallbackError);
        return false;
      }
    }
  }

  // Load project from localStorage
  loadProject(projectName) {
    try {
      const data = localStorage.getItem(`project_${projectName}`);
      if (!data) {
        throw new Error('Project not found');
      }

      let project;
      
      // Try to load as compressed data first
      try {
        const decompressed = this.decompressData(data);
        project = JSON.parse(decompressed);
        console.log('Loaded compressed project');
      } catch (decompressError) {
        // If decompression fails, try loading as uncompressed JSON
        console.log('Decompression failed, trying uncompressed...');
        project = JSON.parse(data);
        console.log('Loaded uncompressed project');
      }
      
      this.currentProject = projectName;
      console.log(`Project "${projectName}" loaded successfully`);
      return project;
    } catch (error) {
      console.error('Failed to load project:', error);
      return null;
    }
  }  // Export project as downloadable file
  exportProject(projectData, projectName = 'project') {
    try {
      const project = {
        name: projectName,
        version: '1.0',
        timestamp: Date.now(),
        assets: projectData.assets || [],
        canvasAssets: projectData.canvasAssets || [],
        shapes: projectData.shapes || [],
        settings: projectData.settings || {}
      };

      const blob = new Blob([JSON.stringify(project, null, 2)], {
        type: 'application/json'
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${projectName}.json`;
      a.click();
      
      URL.revokeObjectURL(url);
      return true;
    } catch (error) {
      console.error('Failed to export project:', error);
      return false;
    }
  }

  // Import project from file
  importProject(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const project = JSON.parse(e.target.result);
          resolve(project);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsText(file);
    });
  }  // List all saved projects
  listProjects() {
    const projects = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith('project_')) {
        const projectName = key.replace('project_', '');
        projects.push(projectName);
      }
    }
    return projects;
  }

  // Delete a project
  deleteProject(projectName) {
    try {
      localStorage.removeItem(`project_${projectName}`);
      if (this.currentProject === projectName) {
        this.currentProject = null;
      }
      return true;
    } catch (error) {
      console.error('Failed to delete project:', error);
      return false;
    }
  }

  // Auto-save functionality
  enableAutoSave(saveCallback, interval = 30000) { // 30 seconds
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
    }
    
    this.autoSaveInterval = setInterval(() => {
      if (this.currentProject) {
        const projectData = saveCallback();
        this.saveProject(projectData, this.currentProject);
      }
    }, interval);
  }

  disableAutoSave() {
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
      this.autoSaveInterval = null;
    }
  }  // Simple compression for large data
  compressData(data) {
    // Basic compression - can be enhanced with libraries like pako for gzip
    return btoa(encodeURIComponent(data));
  }

  decompressData(compressed) {
    return decodeURIComponent(atob(compressed));
  }

  // Get storage usage info
  getStorageInfo() {
    let totalSize = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        totalSize += localStorage[key].length;
      }
    }
    
    return {
      used: totalSize,
      usedMB: (totalSize / 1024 / 1024).toFixed(2),
      available: 10 * 1024 * 1024 - totalSize, // ~10MB typical limit
      availableMB: ((10 * 1024 * 1024 - totalSize) / 1024 / 1024).toFixed(2)
    };
  }
}

const projectManagerInstance = new ProjectManager();
export default projectManagerInstance;