// IndexedDBManager.js - Handles large project saves using IndexedDB

class IndexedDBManager {
  constructor() {
    this.dbName = 'GameEngineProjects';
    this.dbVersion = 1;
    this.storeName = 'projects';
    this.db = null;
  }

  // Initialize the database
  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, { keyPath: 'name' });
          store.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
    });
  }

  // Save project to IndexedDB
  async saveProject(projectData, projectName = 'untitled') {
    try {
      if (!this.db) await this.init();
      
      const project = {
        name: projectName,
        version: '1.0',
        timestamp: Date.now(),
        assets: projectData.assets || [],
        canvasAssets: projectData.canvasAssets || [],
        shapes: projectData.shapes || [],
        settings: projectData.settings || {}
      };

      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      
      await new Promise((resolve, reject) => {
        const request = store.put(project);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });

      return true;
    } catch (error) {
      console.error('Failed to save project to IndexedDB:', error);
      return false;
    }
  }

  // Load project from IndexedDB
  async loadProject(projectName) {
    try {
      if (!this.db) await this.init();
      
      const transaction = this.db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      
      const project = await new Promise((resolve, reject) => {
        const request = store.get(projectName);
        request.onsuccess = () => {
          if (request.result) {
            resolve(request.result);
          } else {
            resolve(null);
          }
        };
        request.onerror = () => reject(request.error);
      });

      return project;
    } catch (error) {
      console.error('Failed to load project from IndexedDB:', error);
      return null;
    }
  }

  // List all projects
  async listProjects() {
    try {
      if (!this.db) await this.init();
      
      const transaction = this.db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      
      const projects = await new Promise((resolve, reject) => {
        const request = store.getAllKeys();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });

      return projects;
    } catch (error) {
      console.error('Failed to list projects from IndexedDB:', error);
      return [];
    }
  }

  // Delete a project
  async deleteProject(projectName) {
    try {
      if (!this.db) await this.init();
      
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      
      await new Promise((resolve, reject) => {
        const request = store.delete(projectName);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });

      return true;
    } catch (error) {
      console.error('Failed to delete project from IndexedDB:', error);
      return false;
    }
  }

  // Export project as downloadable file
  async exportProject(projectData, projectName = 'project') {
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
  async importProject(file) {
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
  }

  // Get storage usage info (estimated)
  async getStorageInfo() {
    try {
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        const estimate = await navigator.storage.estimate();
        return {
          used: estimate.usage || 0,
          usedMB: ((estimate.usage || 0) / 1024 / 1024).toFixed(2),
          available: estimate.quota || 0,
          availableMB: ((estimate.quota || 0) / 1024 / 1024).toFixed(2)
        };
      } else {
        return {
          used: 0,
          usedMB: '0.00',
          available: 1000 * 1024 * 1024, // Estimate 1GB
          availableMB: '1000.00'
        };
      }
    } catch (error) {
      console.error('Failed to get storage info:', error);
      return {
        used: 0,
        usedMB: '0.00',
        available: 0,
        availableMB: '0.00'
      };
    }
  }
}

const indexedDBManager = new IndexedDBManager();
export default indexedDBManager; 