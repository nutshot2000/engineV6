import { useEffect, useRef } from 'react';

const BouncingPhysics = ({ canvasAssets, setCanvasAssets, shapes, enabled = true }) => {
  const trailsRef = useRef({});
  const particlesRef = useRef([]);

  useEffect(() => {
    if (!enabled) return;

    // Enhanced detection - look for political figures or objects with bouncing property
    const bouncingObjects = canvasAssets.filter(asset => {
      // Check if explicitly marked for bouncing
      if (asset.bouncing || asset.physics?.bouncing) return true;
      
      // Check for political figures (expanded list)
      if (asset.src && !asset.src.startsWith('data:')) {
        const src = asset.src.toLowerCase();
        if (src.includes('bernie') || 
            src.includes('trump') ||
            src.includes('biden') ||
            src.includes('obama') ||
            src.includes('harris') ||
            src.includes('clinton') ||
            src.includes('sanders') ||
            src.includes('politician')) {
          return true;
        }
      }
      
      // Check by name (this should catch your objects!)
      if (asset.name) {
        const name = asset.name.toLowerCase();
        const found = name.includes('bernie') || 
               name.includes('trump') ||
               name.includes('biden') ||
               name.includes('obama') ||
               name.includes('harris') ||
               name.includes('clinton') ||
               name.includes('sanders');
        
        if (found) return true;
      }
      
      return false;
    });

    if (bouncingObjects.length === 0) return;

    // Initialize trails for each bouncing object
    bouncingObjects.forEach(obj => {
      if (!trailsRef.current[obj.id]) {
        trailsRef.current[obj.id] = [];
      }
    });

    // Initialize velocity for bouncing objects if they don't have it
    bouncingObjects.forEach(obj => {
      if (!obj.vx && !obj.vy) {
        obj.vx = (Math.random() - 0.5) * 12; // Even faster for epic action!
        obj.vy = (Math.random() - 0.5) * 12;
        obj.rotationSpeed = (Math.random() - 0.5) * 10; // Add rotation!
        obj.scale = 1;
        obj.scaleDirection = 1;
        obj.hue = Math.random() * 360; // Rainbow colors!
      }
    });

    // Create particle explosion effect
    const createParticles = (x, y, color) => {
      for (let i = 0; i < 15; i++) {
        particlesRef.current.push({
          x: x + Math.random() * 20 - 10,
          y: y + Math.random() * 20 - 10,
          vx: (Math.random() - 0.5) * 20,
          vy: (Math.random() - 0.5) * 20,
          life: 1,
          decay: 0.02,
          color: color,
          size: Math.random() * 8 + 2
        });
      }
    };

    const animationLoop = () => {
      // Update particles
      particlesRef.current = particlesRef.current.filter(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vx *= 0.98; // Friction
        particle.vy *= 0.98;
        particle.life -= particle.decay;
        particle.size *= 0.99;
        return particle.life > 0;
      });

      setCanvasAssets(prevAssets => 
        prevAssets.map(asset => {
          // Check if this asset should bounce (same logic as above)
          const shouldBounce = asset.bouncing || asset.physics?.bouncing || 
            (asset.src && !asset.src.startsWith('data:') && (
              asset.src.toLowerCase().includes('bernie') || 
              asset.src.toLowerCase().includes('trump') ||
              asset.src.toLowerCase().includes('biden') ||
              asset.src.toLowerCase().includes('obama') ||
              asset.src.toLowerCase().includes('harris') ||
              asset.src.toLowerCase().includes('clinton') ||
              asset.src.toLowerCase().includes('sanders')
            )) ||
            (asset.name && (
              asset.name.toLowerCase().includes('bernie') || 
              asset.name.toLowerCase().includes('trump') ||
              asset.name.toLowerCase().includes('biden') ||
              asset.name.toLowerCase().includes('obama') ||
              asset.name.toLowerCase().includes('harris') ||
              asset.name.toLowerCase().includes('clinton') ||
              asset.name.toLowerCase().includes('sanders')
            ));

          if (!shouldBounce) return asset;

          // Initialize fancy properties if not present
          let vx = asset.vx || (Math.random() - 0.5) * 12;
          let vy = asset.vy || (Math.random() - 0.5) * 12;
          let rotation = asset.rotation || 0;
          let rotationSpeed = asset.rotationSpeed || (Math.random() - 0.5) * 10;
          let scale = asset.scale || 1;
          let scaleDirection = asset.scaleDirection || 1;
          let hue = asset.hue || Math.random() * 360;

          // Update position
          let newX = asset.x + vx;
          let newY = asset.y + vy;

          // Update fancy effects
          rotation += rotationSpeed;
          hue = (hue + 2) % 360; // Rainbow cycling
          
          // Pulsing scale effect
          scale += scaleDirection * 0.01;
          if (scale > 1.3) scaleDirection = -1;
          if (scale < 0.8) scaleDirection = 1;

          // Canvas boundaries
          const canvasWidth = 1920;
          const canvasHeight = 1080;
          const objectWidth = (asset.width || 100) * scale;
          const objectHeight = (asset.height || 100) * scale;

          let bounced = false;

          // Bounce off left/right walls with EPIC effects
          if (newX <= 0) {
            newX = 0;
            vx = Math.abs(vx) * 1.1; // Speed boost on bounce!
            bounced = true;
            createParticles(newX, newY, `hsl(${hue}, 100%, 50%)`);
          } else if (newX + objectWidth >= canvasWidth) {
            newX = canvasWidth - objectWidth;
            vx = -Math.abs(vx) * 1.1; // Speed boost on bounce!
            bounced = true;
            createParticles(newX, newY, `hsl(${hue}, 100%, 50%)`);
          }

          // Bounce off top/bottom walls with EPIC effects
          if (newY <= 0) {
            newY = 0;
            vy = Math.abs(vy) * 1.1; // Speed boost on bounce!
            bounced = true;
            createParticles(newX, newY, `hsl(${hue}, 100%, 50%)`);
          } else if (newY + objectHeight >= canvasHeight) {
            newY = canvasHeight - objectHeight;
            vy = -Math.abs(vy) * 1.1; // Speed boost on bounce!
            bounced = true;
            createParticles(newX, newY, `hsl(${hue}, 100%, 50%)`);
          }

          // Speed limiter to prevent infinite acceleration
          const maxSpeed = 20;
          if (Math.abs(vx) > maxSpeed) vx = Math.sign(vx) * maxSpeed;
          if (Math.abs(vy) > maxSpeed) vy = Math.sign(vy) * maxSpeed;

          // Add trail effect
          if (trailsRef.current[asset.id]) {
            trailsRef.current[asset.id].push({ x: newX, y: newY, time: Date.now() });
            // Keep only last 20 trail points
            if (trailsRef.current[asset.id].length > 20) {
              trailsRef.current[asset.id].shift();
            }
          }

          // Check collision with boundary shapes
          shapes.forEach(shape => {
            if (shape.shapeType === 'boundary') {
              // AABB collision detection
              if (newX < shape.x + shape.width &&
                  newX + objectWidth > shape.x &&
                  newY < shape.y + shape.height &&
                  newY + objectHeight > shape.y) {
                
                // EPIC collision effect!
                createParticles(newX + objectWidth/2, newY + objectHeight/2, `hsl(${hue}, 100%, 70%)`);
                
                // Enhanced bounce with spin
                vx = -vx * 1.2;
                vy = -vy * 1.2;
                rotationSpeed += (Math.random() - 0.5) * 5;
                
                // Move object out of collision
                if (Math.abs(vx) > Math.abs(vy)) {
                  newX = vx > 0 ? shape.x - objectWidth : shape.x + shape.width;
                } else {
                  newY = vy > 0 ? shape.y - objectHeight : shape.y + shape.height;
                }
              }
            }
          });

          return {
            ...asset,
            x: newX,
            y: newY,
            vx: vx,
            vy: vy,
            rotation: rotation,
            rotationSpeed: rotationSpeed,
            scale: scale,
            scaleDirection: scaleDirection,
            hue: hue,
            // Add visual effects
            filter: `hue-rotate(${hue}deg) saturate(1.5) brightness(1.2) drop-shadow(0 0 20px hsl(${hue}, 100%, 50%))`,
            transform: `rotate(${rotation}deg) scale(${scale})`,
            transition: bounced ? 'filter 0.3s ease' : 'none'
          };
        })
      );
    };

    const intervalId = setInterval(animationLoop, 16); // ~60fps

    return () => {
      clearInterval(intervalId);
      // Clean up trails and particles
      trailsRef.current = {};
      particlesRef.current = [];
    };
  }, [canvasAssets, setCanvasAssets, shapes, enabled]);

  return null;
};

export default BouncingPhysics; 