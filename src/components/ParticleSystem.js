import React, { useEffect, useRef } from 'react';

const ParticleSystem = ({ particles, enabled = true }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    if (!enabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    // Set canvas size to match the game canvas
    canvas.width = 1920 * 0.667; // Scaled to match GridCanvas
    canvas.height = 1080 * 0.667;

    const renderParticles = () => {
      // Clear canvas with slight fade effect for trails
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Render each particle
      particles.forEach(particle => {
        if (particle.life <= 0) return;

        const x = particle.x * 0.667; // Scale to match canvas
        const y = particle.y * 0.667;
        const size = particle.size * 0.667;

        // Create gradient for glow effect
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
        gradient.addColorStop(0, particle.color);
        gradient.addColorStop(1, 'transparent');

        ctx.globalAlpha = particle.life;
        ctx.fillStyle = gradient;
        
        // Draw particle as a glowing circle
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();

        // Add sparkle effect
        if (particle.life > 0.5) {
          ctx.globalAlpha = particle.life * 0.8;
          ctx.fillStyle = 'white';
          ctx.beginPath();
          ctx.arc(x, y, size * 0.3, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      ctx.globalAlpha = 1;
      animationRef.current = requestAnimationFrame(renderParticles);
    };

    renderParticles();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [particles, enabled]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 5,
        mixBlendMode: 'screen' // Additive blending for glow effects
      }}
    />
  );
};

export default ParticleSystem; 