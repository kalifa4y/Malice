import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { ThemeConfig } from '../../types';

interface BackgroundCanvasProps {
  currentTheme: ThemeConfig;
}

export const BackgroundCanvas: React.FC<BackgroundCanvasProps> = ({ currentTheme }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Check if WebGL is supported
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
      console.warn('WebGL not supported, falling back to CSS background');
      return;
    }

    const container = containerRef.current;
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(new THREE.Color(currentTheme.colors.bg).getHex(), 0.035);

    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 100);
    camera.position.z = 12;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);

    // Clear previous children if any
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // Ambient & Directional Lights
    const ambientLight = new THREE.AmbientLight(
      new THREE.Color(currentTheme.colors.surface).getHex(),
      1.8
    );
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(
      new THREE.Color(currentTheme.colors.primary).getHex(),
      3,
      25
    );
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    const goldLight = new THREE.PointLight(
      new THREE.Color(currentTheme.colors.gold).getHex(),
      2.5,
      20
    );
    goldLight.position.set(-5, -3, 3);
    scene.add(goldLight);

    // 1. Group of Floating Wonderland Objects
    const objectsGroup = new THREE.Group();
    scene.add(objectsGroup);

    // Floating Playing Cards
    const cardGeometry = new THREE.BoxGeometry(0.8, 1.2, 0.02);
    const cardMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.3,
      metalness: 0.1,
    });
    const cardBorderMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(currentTheme.colors.primary).getHex(),
      roughness: 0.2,
      metalness: 0.7,
    });

    const floatingItems: {
      mesh: THREE.Object3D;
      rotSpeedX: number;
      rotSpeedY: number;
      rotSpeedZ: number;
      floatSpeed: number;
      floatOffset: number;
      initialY: number;
    }[] = [];

    // Create 12 Floating Cards
    for (let i = 0; i < 12; i++) {
      const card = new THREE.Mesh(cardGeometry, [
        cardBorderMaterial, cardBorderMaterial,
        cardBorderMaterial, cardBorderMaterial,
        cardMaterial, cardMaterial
      ]);
      const x = (Math.random() - 0.5) * 16;
      const y = (Math.random() - 0.5) * 14;
      const z = (Math.random() - 0.5) * 8 - 2;

      card.position.set(x, y, z);
      card.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);

      objectsGroup.add(card);
      floatingItems.push({
        mesh: card,
        rotSpeedX: (Math.random() - 0.5) * 0.015,
        rotSpeedY: (Math.random() - 0.5) * 0.015,
        rotSpeedZ: (Math.random() - 0.5) * 0.01,
        floatSpeed: 0.8 + Math.random() * 0.8,
        floatOffset: Math.random() * Math.PI * 2,
        initialY: y
      });
    }

    // 2. Floating Pocket Watches (Torus + Cylinder)
    const watchTorusGeo = new THREE.TorusGeometry(0.5, 0.08, 12, 24);
    const watchCenterGeo = new THREE.CylinderGeometry(0.48, 0.48, 0.05, 24);
    const goldMaterial = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.85,
      roughness: 0.25
    });
    const watchDialMaterial = new THREE.MeshStandardMaterial({
      color: 0xfaf8f5,
      metalness: 0.1,
      roughness: 0.4
    });

    for (let i = 0; i < 6; i++) {
      const watchGroup = new THREE.Group();
      const ring = new THREE.Mesh(watchTorusGeo, goldMaterial);
      const face = new THREE.Mesh(watchCenterGeo, watchDialMaterial);
      face.rotation.x = Math.PI / 2;

      watchGroup.add(ring);
      watchGroup.add(face);

      const x = (Math.random() - 0.5) * 14;
      const y = (Math.random() - 0.5) * 12;
      const z = (Math.random() - 0.5) * 6 - 1;

      watchGroup.position.set(x, y, z);
      watchGroup.scale.set(0.9, 0.9, 0.9);

      objectsGroup.add(watchGroup);
      floatingItems.push({
        mesh: watchGroup,
        rotSpeedX: (Math.random() - 0.5) * 0.01,
        rotSpeedY: (Math.random() - 0.5) * 0.02,
        rotSpeedZ: (Math.random() - 0.5) * 0.01,
        floatSpeed: 0.6 + Math.random() * 0.5,
        floatOffset: Math.random() * Math.PI * 2,
        initialY: y
      });
    }

    // 3. Floating Sweets & Chocolate Spheres
    const sweetGeo = new THREE.SphereGeometry(0.35, 16, 16);
    const rubyMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(currentTheme.colors.primary).getHex(),
      metalness: 0.3,
      roughness: 0.2,
      emissive: new THREE.Color(currentTheme.colors.primary).getHex(),
      emissiveIntensity: 0.2
    });
    const chocoMaterial = new THREE.MeshStandardMaterial({
      color: 0x3d2314,
      metalness: 0.4,
      roughness: 0.3
    });

    for (let i = 0; i < 15; i++) {
      const isRuby = Math.random() > 0.5;
      const sweet = new THREE.Mesh(sweetGeo, isRuby ? rubyMaterial : chocoMaterial);
      const x = (Math.random() - 0.5) * 16;
      const y = (Math.random() - 0.5) * 16;
      const z = (Math.random() - 0.5) * 8 - 1;

      sweet.position.set(x, y, z);
      const scale = 0.5 + Math.random() * 0.6;
      sweet.scale.set(scale, scale, scale);

      objectsGroup.add(sweet);
      floatingItems.push({
        mesh: sweet,
        rotSpeedX: (Math.random() - 0.5) * 0.02,
        rotSpeedY: (Math.random() - 0.5) * 0.02,
        rotSpeedZ: 0,
        floatSpeed: 0.9 + Math.random() * 0.6,
        floatOffset: Math.random() * Math.PI * 2,
        initialY: y
      });
    }

    // 4. Sparkles Particle System
    const particleCount = 120;
    const particlesGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 20;
      positions[i + 1] = (Math.random() - 0.5) * 20;
      positions[i + 2] = (Math.random() - 0.5) * 12;
    }

    particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: new THREE.Color(currentTheme.colors.primary).getHex(),
      size: 0.08,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    const particleSystem = new THREE.Points(particlesGeo, particleMaterial);
    scene.add(particleSystem);

    // Mouse & Scroll Parallax Listeners
    let mouseX = 0;
    let mouseY = 0;
    let scrollY = window.scrollY;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 1.2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 1.2;
    };

    const handleScroll = () => {
      scrollY = window.scrollY;
    };

    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // Gentle camera reaction to mouse & scroll
      camera.position.x += (mouseX * 2 - camera.position.x) * 0.03;
      camera.position.y += (-mouseY * 2 - scrollY * 0.003 - camera.position.y) * 0.03;
      camera.lookAt(0, -scrollY * 0.003, 0);

      // Rotate and float elements
      floatingItems.forEach((item) => {
        item.mesh.rotation.x += item.rotSpeedX;
        item.mesh.rotation.y += item.rotSpeedY;
        item.mesh.rotation.z += item.rotSpeedZ;
        item.mesh.position.y = item.initialY + Math.sin(elapsedTime * item.floatSpeed + item.floatOffset) * 0.5;
      });

      // Slowly rotate sparkles
      particleSystem.rotation.y = elapsedTime * 0.03;
      particleSystem.rotation.x = elapsedTime * 0.015;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [currentTheme]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden opacity-85 transition-opacity duration-1000"
      aria-hidden="true"
    />
  );
};
