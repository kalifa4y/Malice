import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const Confectionery3DScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    // Subtle fog for depth of field
    scene.fog = new THREE.FogExp2(0x0a070c, 0.035);

    const camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 18);

    // 2. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    containerRef.current.appendChild(renderer.domElement);

    // 3. Dynamic Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xfff0e6, 1.2);
    scene.add(ambientLight);

    const mainSpot = new THREE.SpotLight(0xffd7a0, 4, 40, Math.PI / 4, 0.4);
    mainSpot.position.set(10, 15, 15);
    scene.add(mainSpot);

    const rimLight1 = new THREE.PointLight(0xe25822, 3, 25); // Warm copper glow
    rimLight1.position.set(-12, -8, 8);
    scene.add(rimLight1);

    const rimLight2 = new THREE.PointLight(0xdc143c, 3, 25); // Crimson red glow
    rimLight2.position.set(12, 10, -5);
    scene.add(rimLight2);

    const mouseLight = new THREE.PointLight(0xffe4b5, 2, 20); // Mouse tracking light
    mouseLight.position.set(0, 0, 10);
    scene.add(mouseLight);

    // 4. Photorealistic Confectionery & Sweets Materials
    const materials = {
      darkChocolate: new THREE.MeshPhysicalMaterial({
        color: 0x2b1408,
        roughness: 0.25,
        metalness: 0.1,
        clearcoat: 0.8,
        clearcoatRoughness: 0.15,
      }),
      rubyChocolate: new THREE.MeshPhysicalMaterial({
        color: 0xdc143c,
        roughness: 0.2,
        metalness: 0.15,
        clearcoat: 0.9,
      }),
      pistachioMacaron: new THREE.MeshPhysicalMaterial({
        color: 0x88aa55,
        roughness: 0.5,
        metalness: 0.05,
        clearcoat: 0.2,
      }),
      raspberryMacaron: new THREE.MeshPhysicalMaterial({
        color: 0xcc2255,
        roughness: 0.5,
        metalness: 0.05,
        clearcoat: 0.2,
      }),
      creamFilling: new THREE.MeshStandardMaterial({
        color: 0xfffdd0,
        roughness: 0.7,
      }),
      foilGold: new THREE.MeshPhysicalMaterial({
        color: 0xffd700,
        metalness: 0.9,
        roughness: 0.15,
        clearcoat: 1.0,
      }),
      foilCopper: new THREE.MeshPhysicalMaterial({
        color: 0xe25822,
        metalness: 0.85,
        roughness: 0.2,
        clearcoat: 1.0,
      }),
      sugarCrystal: new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0.1,
        roughness: 0.05,
        transmission: 0.85,
        ior: 1.55,
      }),
      playingCard: new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.3,
      }),
    };

    // 5. Confectionery Geometries Builders

    // A. Macaron Builder
    const createMacaron = (shellMat: THREE.Material) => {
      const group = new THREE.Group();
      const topShell = new THREE.Mesh(
        new THREE.SphereGeometry(0.8, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.45),
        shellMat
      );
      topShell.position.y = 0.1;
      topShell.scale.set(1, 0.5, 1);
      group.add(topShell);

      const bottomShell = new THREE.Mesh(
        new THREE.SphereGeometry(0.8, 24, 16, 0, Math.PI * 2, Math.PI * 0.55, Math.PI * 0.45),
        shellMat
      );
      bottomShell.position.y = -0.1;
      bottomShell.scale.set(1, 0.5, 1);
      group.add(bottomShell);

      const filling = new THREE.Mesh(
        new THREE.CylinderGeometry(0.72, 0.72, 0.22, 24),
        materials.creamFilling
      );
      group.add(filling);
      return group;
    };

    // B. Wrapped Candy (Papillote)
    const createWrappedCandy = (foilMat: THREE.Material) => {
      const group = new THREE.Group();
      const body = new THREE.Mesh(
        new THREE.CapsuleGeometry(0.45, 0.7, 16, 16),
        foilMat
      );
      body.rotation.z = Math.PI / 2;
      group.add(body);

      const leftTwist = new THREE.Mesh(
        new THREE.ConeGeometry(0.4, 0.6, 12),
        foilMat
      );
      leftTwist.position.x = -0.8;
      leftTwist.rotation.z = Math.PI / 2;
      group.add(leftTwist);

      const rightTwist = new THREE.Mesh(
        new THREE.ConeGeometry(0.4, 0.6, 12),
        foilMat
      );
      rightTwist.position.x = 0.8;
      rightTwist.rotation.z = -Math.PI / 2;
      group.add(rightTwist);
      return group;
    };

    // C. Chocolate Truffle (faceted chocolate rock with gold dust)
    const createTruffle = () => {
      const group = new THREE.Group();
      const truffle = new THREE.Mesh(
        new THREE.DodecahedronGeometry(0.7, 1),
        materials.darkChocolate
      );
      group.add(truffle);
      return group;
    };

    // D. Playing Card (Wonderland cards ♠ ♣ ♥ ♦)
    const createCard = (suitSymbol: string, colorHex: number) => {
      const group = new THREE.Group();
      
      // Dynamic Canvas Texture for Card Face
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 384;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, 256, 384);
        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 8;
        ctx.strokeRect(12, 12, 232, 360);
        ctx.fillStyle = `#${colorHex.toString(16).padStart(6, '0')}`;
        ctx.font = 'bold 120px serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(suitSymbol, 128, 192);
        ctx.font = 'bold 36px sans-serif';
        ctx.fillText('A', 36, 48);
        ctx.fillText('A', 220, 336);
      }
      const cardTex = new THREE.CanvasTexture(canvas);
      const cardFaceMat = new THREE.MeshStandardMaterial({
        map: cardTex,
        roughness: 0.3,
      });

      const cardBase = new THREE.Mesh(
        new THREE.BoxGeometry(1.2, 1.8, 0.04),
        cardFaceMat
      );
      group.add(cardBase);

      // Gold border trim
      const border = new THREE.Mesh(
        new THREE.BoxGeometry(1.24, 1.84, 0.02),
        materials.foilGold
      );
      group.add(border);
      return group;
    };

    // E. Sugar Gem Crystal
    const createCrystal = () => {
      return new THREE.Mesh(
        new THREE.OctahedronGeometry(0.5, 0),
        materials.sugarCrystal
      );
    };

    // E. Golden Alice Key
    const createGoldenKey = () => {
      const group = new THREE.Group();
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.4, 0.08, 12, 24),
        materials.foilGold
      );
      group.add(ring);

      const stem = new THREE.Mesh(
        new THREE.CylinderGeometry(0.06, 0.06, 1.4, 12),
        materials.foilGold
      );
      stem.position.y = -0.8;
      group.add(stem);

      const teeth = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 0.1, 0.08),
        materials.foilGold
      );
      teeth.position.set(0.12, -1.3, 0);
      group.add(teeth);
      return group;
    };

    // 6. Create Floating Confectionery Layers (Foreground, Midground, Background)
    interface CandyItem {
      mesh: THREE.Object3D;
      initialPos: THREE.Vector3;
      rotSpeed: THREE.Vector3;
      floatSpeed: number;
      floatOffset: number;
      parallaxFactor: number;
    }

    const candyItems: CandyItem[] = [];
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // Helper to spawn items
    const spawnItem = (
      mesh: THREE.Object3D,
      x: number,
      y: number,
      z: number,
      scale = 1,
      parallaxFactor = 1.0
    ) => {
      mesh.position.set(x, y, z);
      mesh.scale.set(scale, scale, scale);
      mesh.rotation.set(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      );
      mainGroup.add(mesh);

      candyItems.push({
        mesh,
        initialPos: new THREE.Vector3(x, y, z),
        rotSpeed: new THREE.Vector3(
          (Math.random() - 0.5) * 0.015,
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.01
        ),
        floatSpeed: 0.8 + Math.random() * 0.8,
        floatOffset: Math.random() * Math.PI * 2,
        parallaxFactor,
      });
    };

    // --- Hero Section Sweets (y: 0 to 4) ---
    spawnItem(createMacaron(materials.raspberryMacaron), -6.5, 2.5, 4, 1.3, 1.4); // Foreground left macaron
    spawnItem(createWrappedCandy(materials.foilGold), 7.2, 1.8, 3.5, 1.2, 1.3); // Foreground right gold candy
    spawnItem(createTruffle(), -5.8, -2.2, 5, 1.4, 1.6); // Front left truffle
    spawnItem(createGoldenKey(), 6.5, -2.8, 4.2, 1.2, 1.5); // Front right golden key
    spawnItem(createCard('♥', 0xdc143c), -8.2, 0.2, 1, 1.1, 0.9); // Midground left card
    spawnItem(createMacaron(materials.pistachioMacaron), 8.0, -0.5, 1.5, 1.1, 1.0); // Midground right macaron

    // --- Packs Section Sweets (y: -6 to -14) ---
    spawnItem(createTruffle(), 7.0, -7.5, 3, 1.3, 1.4);
    spawnItem(createWrappedCandy(materials.foilCopper), -7.5, -9.0, 4, 1.3, 1.5);
    spawnItem(createMacaron(materials.rubyChocolate), 6.8, -11.5, 3.8, 1.2, 1.4);
    spawnItem(createCard('♣', 0xe25822), -6.2, -13.0, 2, 1.1, 1.1);
    spawnItem(createGoldenKey(), -7.8, -15.5, 4, 1.3, 1.6);

    // --- "Comment ça marche" & Unboxing Sweets (y: -18 to -26) ---
    spawnItem(createMacaron(materials.raspberryMacaron), 7.2, -19.0, 3.5, 1.3, 1.4);
    spawnItem(createTruffle(), -6.5, -21.0, 4.5, 1.4, 1.5);
    spawnItem(createWrappedCandy(materials.foilGold), 6.5, -23.5, 4, 1.2, 1.4);
    spawnItem(createCard('♠', 0x00f2fe), -7.2, -25.0, 2.5, 1.2, 1.2);

    // --- Sugar Crystals & Shimmering Dust in Background ---
    for (let i = 0; i < 35; i++) {
      const crystal = createCrystal();
      const x = (Math.random() - 0.5) * 22;
      const y = 6 - Math.random() * 34;
      const z = -2 - Math.random() * 8;
      spawnItem(crystal, x, y, z, 0.4 + Math.random() * 0.6, 0.5 + Math.random() * 0.4);
    }

    // 7. Scroll & Mouse Event Listeners
    let currentScroll = 0;
    let targetScroll = 0;
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const onScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      targetScroll = maxScroll > 0 ? (window.scrollY / maxScroll) * 28 : 0;
    };

    const onMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    // 8. Render Animation Loop with Smooth Damping & Physics
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth scroll interpolation
      currentScroll += (targetScroll - currentScroll) * 0.08;

      // Smooth mouse interpolation
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      // Update mouse light position
      mouseLight.position.x = mouseX * 8;
      mouseLight.position.y = mouseY * 6 - currentScroll * 0.3;

      // Camera subtle tilt with mouse
      camera.position.x = mouseX * 0.8;
      camera.position.y = -currentScroll + mouseY * 0.6;
      camera.lookAt(0, -currentScroll, 0);

      // Animate individual sweets & treats
      candyItems.forEach((item) => {
        // Rotation
        item.mesh.rotation.x += item.rotSpeed.x;
        item.mesh.rotation.y += item.rotSpeed.y;
        item.mesh.rotation.z += item.rotSpeed.z;

        // Floating hover sine wave
        const floatY = Math.sin(elapsedTime * item.floatSpeed + item.floatOffset) * 0.35;
        const floatX = Math.cos(elapsedTime * item.floatSpeed * 0.7 + item.floatOffset) * 0.2;

        // Parallax depth calculation
        item.mesh.position.y = item.initialPos.y + floatY;
        item.mesh.position.x = item.initialPos.x + floatX;
      });

      renderer.render(scene, camera);
    };

    animate();

    // 9. Cleanup
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animationFrameId);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden"
      style={{ opacity: 0.95 }}
    />
  );
};
