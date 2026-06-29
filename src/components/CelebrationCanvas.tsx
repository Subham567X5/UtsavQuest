import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
  type: 'petal' | 'star' | 'heart' | 'confetti';
  opacity: number;
}

const COLORS = {
  rose: ['#fda4af', '#f43f5e', '#ec4899', '#f472b6'], // pink/rose colors
  marigold: ['#fbbf24', '#f59e0b', '#f97316', '#fb7185'], // orange/amber petals
  gold: ['#fef08a', '#eab308', '#ca8a04', '#facc15'], // stars
  confetti: ['#3b82f6', '#10b981', '#a78bfa', '#ec4899', '#f59e0b', '#06b6d4']
};

export default function CelebrationCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];

    const handleResize = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    // Create a particle
    const createParticle = (isInitial = false): Particle => {
      const types: ('petal' | 'star' | 'heart' | 'confetti')[] = ['petal', 'star', 'heart', 'confetti'];
      const type = types[Math.floor(Math.random() * types.length)];
      
      let color = '#fff';
      if (type === 'petal') {
        const pool = Math.random() > 0.5 ? COLORS.rose : COLORS.marigold;
        color = pool[Math.floor(Math.random() * pool.length)];
      } else if (type === 'star') {
        color = COLORS.gold[Math.floor(Math.random() * COLORS.gold.length)];
      } else if (type === 'heart') {
        color = COLORS.rose[Math.floor(Math.random() * COLORS.rose.length)];
      } else {
        color = COLORS.confetti[Math.floor(Math.random() * COLORS.confetti.length)];
      }

      return {
        x: Math.random() * canvas.width,
        y: isInitial ? Math.random() * canvas.height : -20,
        size: Math.random() * 8 + 5,
        speedY: Math.random() * 1.5 + 1.0,
        speedX: Math.random() * 1.2 - 0.6,
        rotation: Math.random() * 360,
        rotationSpeed: Math.random() * 2 - 1,
        color,
        type,
        opacity: Math.random() * 0.5 + 0.5
      };
    };

    // Initialize particles
    for (let i = 0; i < 70; i++) {
      particles.push(createParticle(true));
    }

    // Drawing loops
    const drawPetal = (p: Particle) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.beginPath();
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.opacity;
      
      // Draw a rose petal curved path
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-p.size, -p.size / 2, -p.size, p.size, 0, p.size);
      ctx.bezierCurveTo(p.size, p.size, p.size, -p.size / 2, 0, 0);
      
      ctx.fill();
      ctx.restore();
    };

    const drawStar = (p: Particle) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.beginPath();
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.opacity;
      
      const spikes = 5;
      const outerRadius = p.size / 2;
      const innerRadius = p.size / 4;
      let rot = (Math.PI / 2) * 3;
      let cx = 0;
      let cy = 0;
      const step = Math.PI / spikes;

      ctx.moveTo(0, -outerRadius);
      for (let i = 0; i < spikes; i++) {
        cx = Math.cos(rot) * outerRadius;
        cy = Math.sin(rot) * outerRadius;
        ctx.lineTo(cx, cy);
        rot += step;

        cx = Math.cos(rot) * innerRadius;
        cy = Math.sin(rot) * innerRadius;
        ctx.lineTo(cx, cy);
        rot += step;
      }
      ctx.lineTo(0, -outerRadius);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    const drawHeart = (p: Particle) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.beginPath();
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.opacity;
      
      const width = p.size;
      const height = p.size;
      ctx.moveTo(0, height / 4);
      ctx.bezierCurveTo(-width / 2, -height / 2, -width, height / 3, 0, height);
      ctx.bezierCurveTo(width, height / 3, width / 2, -height / 2, 0, height / 4);
      
      ctx.fill();
      ctx.restore();
    };

    const drawConfetti = (p: Particle) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.opacity;
      ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      ctx.restore();
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Add a couple particles to maintain density
      if (particles.length < 80 && Math.random() < 0.1) {
        particles.push(createParticle());
      }

      particles.forEach((p, index) => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.rotation += p.rotationSpeed;

        // Oscillate horizontal speed slightly
        p.speedX += Math.sin(p.y / 30) * 0.05;

        // Draw depending on type
        if (p.type === 'petal') {
          drawPetal(p);
        } else if (p.type === 'star') {
          drawStar(p);
        } else if (p.type === 'heart') {
          drawHeart(p);
        } else {
          drawConfetti(p);
        }

        // Reset particle if it leaves screen
        if (p.y > canvas.height + 20 || p.x < -20 || p.x > canvas.width + 20) {
          particles[index] = createParticle();
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full pointer-events-none z-10" 
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
