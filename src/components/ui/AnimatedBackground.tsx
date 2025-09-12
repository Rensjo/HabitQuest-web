import { useEffect, useRef } from 'react';
import { useTheme } from '../../hooks/useTheme.tsx';

interface AnimatedBackgroundProps {
  className?: string;
}

export function AnimatedBackground({ className = '' }: AnimatedBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { gradientColors, theme } = useTheme();
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Gradient animation state
    let time = 0;
    const gradientSections = gradientColors.length;
    
    const animate = () => {
      time += 0.005;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Create multiple moving gradients
      for (let i = 0; i < 3; i++) {
        const gradient = ctx.createRadialGradient(
          canvas.width * (0.3 + 0.4 * Math.sin(time + i * Math.PI * 0.7)),
          canvas.height * (0.3 + 0.4 * Math.cos(time * 0.8 + i * Math.PI * 0.5)),
          0,
          canvas.width * (0.3 + 0.4 * Math.sin(time + i * Math.PI * 0.7)),
          canvas.height * (0.3 + 0.4 * Math.cos(time * 0.8 + i * Math.PI * 0.5)),
          Math.min(canvas.width, canvas.height) * (0.6 + 0.2 * Math.sin(time * 0.6 + i))
        );
        
        const colorIndex = i % gradientSections;
        const nextColorIndex = (i + 1) % gradientSections;
        
        gradient.addColorStop(0, `${gradientColors[colorIndex]}33`);
        gradient.addColorStop(0.5, `${gradientColors[nextColorIndex]}22`);
        gradient.addColorStop(1, `${gradientColors[colorIndex]}11`);
        
        ctx.globalCompositeOperation = i === 0 ? 'source-over' : 'multiply';
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      
      // Add subtle particles
      ctx.globalCompositeOperation = 'lighten';
      for (let i = 0; i < 30; i++) {
        const x = canvas.width * (0.1 + 0.8 * Math.sin(time * 0.3 + i * 0.2));
        const y = canvas.height * (0.1 + 0.8 * Math.cos(time * 0.4 + i * 0.3));
        const radius = 1 + Math.sin(time * 2 + i) * 0.5;
        
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = theme === 'dark' ? '#ffffff22' : '#00000011';
        ctx.fill();
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gradientColors, theme]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 -z-10 ${className}`}
      style={{ 
        background: theme === 'dark' 
          ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)'
          : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)'
      }}
    />
  );
}
