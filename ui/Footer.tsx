'use client';

import { OrbitControls } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useMemo, useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import * as THREE from 'three';
import { Group, Object3D, Mesh } from 'three';

export default function Footer() {
  return (
    <footer className="text-quaternary mx-auto max-w-2xl border-t border-dashed border-gray-200 px-8 py-12 pb-24 pt-4 text-sm dark:border-gray-200 dark:text-gray-600">
      <FooterGraphic />
      <p className="flex flex-col gap-2">
        © {new Date().getFullYear()} Rahul Chakraborty
        <span>
          Personal website WIP • Built with Claude & Cursor using Next.js & TailwindCSS • This website was cloned from an open-source template. (
          <a
            href="https://github.com/cristicretu/cretu.dev" // Update this with your GitHub repository URL
            rel="noopener noreferrer"
            target="_blank"
          >
            Source
          </a>
          )
        </span>
      </p>
    </footer>
  );
}

// Particle flare emitter
function ParticleFlares() {
  const flareRef = useRef<Group>(null);
  const { theme } = useTheme();
  
  // Create flare particles - moved before any conditional returns
  const flareParticles = useMemo(() => {
    // Create 30 tiny flare particles
    const particles = [];
    const flareCount = 30;
    
    for (let i = 0; i < flareCount; i++) {
      // Random position around the sphere
      const angle = Math.random() * Math.PI * 2;
      const radius = 0.925 + Math.random() * 0.275; // Midpoint between original (1+0.3) and reduced (0.85+0.25)
      
      // Position on sphere surface
      const x = Math.cos(angle) * radius * Math.sin(Math.random() * Math.PI);
      const y = Math.sin(angle) * radius * Math.sin(Math.random() * Math.PI);
      const z = Math.cos(Math.random() * Math.PI) * radius;
      
      // Random size and lifetime
      const size = 0.0175 + Math.random() * 0.0275; // Midpoint between original (0.02+0.03) and reduced (0.015+0.025)
      const lifetime = 1 + Math.random() * 2;
      const speed = 0.175 + Math.random() * 0.275; // Midpoint between original (0.2+0.3) and reduced (0.15+0.25)
      
      particles.push({ 
        position: new THREE.Vector3(x, y, z), 
        size, 
        lifetime, 
        speed, 
        startTime: Math.random() * 5 
      });
    }
    
    return particles;
  }, []);
  
  // Only use the animation frame hook when in dark mode
  useFrame(({ clock }) => {
    if (!flareRef.current || theme !== 'dark') return;
    
    const time = clock.getElapsedTime();
    const children = flareRef.current.children as Mesh[];
    
    // Animate each flare
    for (let i = 0; i < children.length; i++) {
      const flare = children[i];
      const data = flareParticles[i];
      
      // Cycle through lifetime
      const cycleTime = (time + data.startTime) % data.lifetime;
      const normalizedTime = cycleTime / data.lifetime;
      
      // Pulsating size
      flare.scale.set(
        data.size * (0.5 + 0.5 * Math.sin(normalizedTime * Math.PI)),
        data.size * (0.5 + 0.5 * Math.sin(normalizedTime * Math.PI)),
        data.size * (0.5 + 0.5 * Math.sin(normalizedTime * Math.PI))
      );
      
      // Flare movement - slight outward motion
      const moveRadius = 1 + normalizedTime * data.speed;
      const pos = flare.position;
      const len = Math.sqrt(pos.x * pos.x + pos.y * pos.y + pos.z * pos.z);
      flare.position.set(
        (pos.x / len) * moveRadius,
        (pos.y / len) * moveRadius,
        (pos.z / len) * moveRadius
      );
      
      // Opacity
      if (flare.material instanceof THREE.Material) {
        (flare.material as THREE.MeshBasicMaterial).opacity = Math.sin(normalizedTime * Math.PI);
      }
    }
  });
  
  // Only show flares in dark mode, but return after all hooks
  if (theme !== 'dark') {
    return null;
  }
  
  return (
    <group ref={flareRef}>
      {flareParticles.map((particle, i) => (
        <mesh key={i} position={particle.position}>
          <circleGeometry args={[particle.size, 8]} />
          <meshBasicMaterial 
            color={new THREE.Color(1, 0.3, 0.2)} 
            transparent
            opacity={0.8}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}

function PixelatedSphere() {
  const sphereRef = useRef();
  const { theme } = useTheme();
  
  // Create particles with different colors based on theme
  const particles = useMemo(() => {
    const geometry = new THREE.IcosahedronGeometry(0.9, 4); // Midpoint between original 1.0 and reduced 0.8
    const positions = geometry.attributes.position;
    const colors = [];
    
    // Store indices of red particles for flare emission
    const redParticleIndices = [];
    
    for (let i = 0; i < positions.count; i++) {
      // In dark mode, add red, orange and green particles
      if (theme === 'dark') {
        // Randomly assign colors - 60% gray, 15% orange, 15% leaf-green, 10% red
        const rand = Math.random();
        if (rand < 0.6) {
          colors.push(0.6, 0.6, 0.6); // Gray
        } else if (rand < 0.75) {
          colors.push(1.0, 0.5, 0.0); // Orange
        } else if (rand < 0.9) {
          colors.push(0.2, 0.8, 0.2); // Leaf-green (was yellow)
        } else {
          colors.push(1.0, 0.2, 0.2); // Red
          redParticleIndices.push(i);
        }
      } else {
        // Light mode - darker gray (was 0.6, now 0.3 for more contrast)
        colors.push(0.3, 0.3, 0.3);
      }
    }
    
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    return geometry;
  }, [theme]);

  useFrame(({ clock }: { clock: any }) => {
    if (sphereRef.current) {
      (sphereRef.current as any).rotation.y = clock.getElapsedTime() * 1.2;
      (sphereRef.current as any).rotation.z = clock.getElapsedTime() * 0.7;
    }
  });

  return (
    <group>
      <points ref={sphereRef as any}>
        <primitive object={particles} />
        <pointsMaterial 
          vertexColors 
          size={theme === 'light' ? 0.0625 : 0.045} // Midpoint between original (0.07/0.05) and reduced (0.055/0.04)
          sizeAttenuation={true}
        />
      </points>
      <ParticleFlares />
    </group>
  );
}

function Birds() {
  const groupRef = useRef();
  const { theme } = useTheme();

  // Create colors for birds in dark mode
  const birdColors = useMemo(() => {
    const colors = [];
    const birdCount = 48;
    
    for (let i = 0; i < birdCount; i++) {
      if (theme === 'dark') {
        // Assign colors with similar distribution to the sphere particles
        const rand = Math.random();
        if (rand < 0.6) {
          colors.push(new THREE.Color(0.6, 0.6, 0.6)); // Gray
        } else if (rand < 0.75) {
          colors.push(new THREE.Color(1.0, 0.5, 0.0)); // Orange
        } else if (rand < 0.9) {
          colors.push(new THREE.Color(0.2, 0.8, 0.2)); // Leaf-green (was yellow)
        } else {
          colors.push(new THREE.Color(1.0, 0.2, 0.2)); // Red
        }
      } else {
        // Light mode - all gray
        colors.push(new THREE.Color(0.3, 0.3, 0.3));
      }
    }
    
    return colors;
  }, [theme]);

  useFrame(({ clock }: { clock: any }) => {
    if (!groupRef.current) return;
    const elapsedTime = clock.getElapsedTime();
    (groupRef.current as any).children.forEach(
      (
        bird: { position: { x: number; y: number; z: number } },
        index: number,
      ) => {
        const angle = (elapsedTime + index * 0.2) % (2 * Math.PI);
        const radius = 2.05 + Math.random() * 0.0001; // Midpoint between original 2.3 and reduced 1.8
        bird.position.x =
          radius * Math.cos(angle) - Math.sin(elapsedTime * 0.5 + index);
        bird.position.y =
          radius * Math.sin(angle) * Math.sin(elapsedTime * 0.5 + index);
        bird.position.z = radius * Math.cos(elapsedTime * 0.5 + index);
      },
    );
  });

  const birds = [...Array(48)].map((_, i) => {
    const size = i % 2 === 0 ? 0.0275 : 0.045; // Midpoint between original (0.03/0.05) and reduced (0.025/0.04)
    return (
      <mesh key={i} position={[1, 0, 0]}>
        <planeGeometry args={[size, size]} />
        <meshBasicMaterial color={birdColors[i]} />
      </mesh>
    );
  });

  return <group ref={groupRef as any}>{birds}</group>;
}

function FooterGraphic() {
  // We need the mounted check to prevent hydration issues
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
    return <div className="h-60 w-full py-8" />; // Placeholder while client-side rendering
  }
  
  return (
    <div className="py-8 w-full">
      <Canvas 
        style={{ height: '240px' }} 
        camera={{ 
          fov: 42.5, // Midpoint between original 40 and reduced 45
          position: [0, 0, 6.25] // Midpoint between original 5 and reduced 7.5
        }} 
        gl={{ antialias: false }}
      >
        <PixelatedSphere />
        <Birds />
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  );
}
