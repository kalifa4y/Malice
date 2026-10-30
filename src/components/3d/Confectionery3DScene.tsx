import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import anime from 'animejs';
import { ThemeConfig } from '../../types';

interface Confectionery3DSceneProps {
  currentTheme?: ThemeConfig;
}

interface SceneArtifact {
  mesh: THREE.Object3D;
  basePos: THREE.Vector3;
  baseRot: THREE.Euler;
  baseScale: number;
  rotVelocity: THREE.Vector3;
  floatSpeed: number;
  floatPhase: number;
  floatAmplitude: number;
  parallaxDepth: number;
  watchMinuteHand?: THREE.Object3D;
  watchHourHand?: THREE.Object3D;
}

export const Confectionery3DScene: React.FC<Confectionery3DSceneProps> = ({ currentTheme }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const lightsRef = useRef<{
    primaryLight: THREE.PointLight;
    goldLight: THREE.PointLight;
    accentLight: THREE.PointLight;
    fog: THREE.FogExp2;
  } | null>(null);
  const artifactsRef = useRef<SceneArtifact[]>([]);

  // React to theme changes with Anime.js studio light & flourish choreography
  useEffect(() => {
    if (!currentTheme || !lightsRef.current) return;

    const primaryColor = new THREE.Color(currentTheme.colors.primary);
    const goldColor = new THREE.Color(currentTheme.colors.gold);
    const bgColor = new THREE.Color(currentTheme.colors.bg);

    const { primaryLight, goldLight, fog } = lightsRef.current;

    anime({
      targets: primaryLight.color,
      r: primaryColor.r,
      g: primaryColor.g,
      b: primaryColor.b,
      duration: 1400,
      easing: 'easeOutExpo'
    });

    anime({
      targets: goldLight.color,
      r: goldColor.r,
      g: goldColor.g,
      b: goldColor.b,
      duration: 1400,
      easing: 'easeOutExpo'
    });

    anime({
      targets: fog.color,
      r: bgColor.r,
      g: bgColor.g,
      b: bgColor.b,
      duration: 1400,
      easing: 'easeOutQuad'
    });

    // Full 360° choreographed pirouette when switching Alice's Hour so front faces stay oriented
    artifactsRef.current.forEach((item, idx) => {
      anime({
        targets: item.baseRot,
        y: item.baseRot.y + Math.PI * 2,
        duration: 1600,
        delay: idx * 55,
        easing: 'easeOutElastic(1, 0.75)'
      });
    });
  }, [currentTheme?.id]);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const isMobile = window.innerWidth < 768;

    // 1. Scene, Fog & Camera
    const scene = new THREE.Scene();
    const fog = new THREE.FogExp2(0x090b12, 0.026);
    scene.fog = fog;

    const camera = new THREE.PerspectiveCamera(
      46,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, isMobile ? 22 : 17.5);

    // 2. High-Dynamic-Range WebGL Renderer + Studio PMREM Environment
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // Studio HDRI reflections so gold, chocolate glaze and crystal shine realistically
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    const envTexture = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTexture;

    // 3. Studio Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xfff5eb, 0.65);
    scene.add(ambientLight);

    const keySpot = new THREE.SpotLight(0xfff0dd, 4.5, 50, Math.PI / 3.5, 0.55, 1.2);
    keySpot.position.set(9, 14, 16);
    scene.add(keySpot);

    const primaryLight = new THREE.PointLight(0xdc143c, 4.2, 32, 1.4);
    primaryLight.position.set(-10, 4, 9);
    scene.add(primaryLight);

    const goldLight = new THREE.PointLight(0xd4af37, 4.0, 34, 1.4);
    goldLight.position.set(10, -5, 10);
    scene.add(goldLight);

    const accentLight = new THREE.PointLight(0xffecd2, 2.5, 24, 1.5);
    accentLight.position.set(0, 2, 11);
    scene.add(accentLight);

    lightsRef.current = { primaryLight, goldLight, accentLight, fog };

    // 4. Procedural Studio Textures (Bump maps, Dial, Guilloché Cards, Soft Glow Particle)
    const createMacaronBumpTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#808080';
        ctx.fillRect(0, 0, 256, 256);
        for (let i = 0; i < 2200; i++) {
          const v = 110 + Math.floor(Math.random() * 45);
          ctx.fillStyle = `rgb(${v},${v},${v})`;
          ctx.beginPath();
          ctx.arc(
            Math.random() * 256,
            Math.random() * 256,
            0.6 + Math.random() * 1.4,
            0,
            Math.PI * 2
          );
          ctx.fill();
        }
      }
      const tex = new THREE.CanvasTexture(canvas);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      return tex;
    };

    const createWatchDialTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const grad = ctx.createRadialGradient(256, 256, 20, 256, 256, 250);
        grad.addColorStop(0, '#fffdf9');
        grad.addColorStop(0.82, '#f5ebd6');
        grad.addColorStop(1, '#d4af37');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 512, 512);

        // Outer & inner decorative rings
        ctx.strokeStyle = '#1a120b';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(256, 256, 218, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = '#b8860b';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(256, 256, 152, 0, Math.PI * 2);
        ctx.stroke();

        // Minute ticks
        for (let i = 0; i < 60; i++) {
          const angle = (i * Math.PI) / 30;
          const r1 = i % 5 === 0 ? 202 : 210;
          const r2 = 218;
          ctx.strokeStyle = '#1a120b';
          ctx.lineWidth = i % 5 === 0 ? 3.5 : 1.5;
          ctx.beginPath();
          ctx.moveTo(256 + Math.cos(angle) * r1, 256 + Math.sin(angle) * r1);
          ctx.lineTo(256 + Math.cos(angle) * r2, 256 + Math.sin(angle) * r2);
          ctx.stroke();
        }

        // Roman Numerals
        const numerals = ['XII', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'];
        ctx.fillStyle = '#1a120b';
        ctx.font = 'bold 28px Georgia, serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        numerals.forEach((num, idx) => {
          const angle = (idx * Math.PI) / 6 - Math.PI / 2;
          const r = 178;
          ctx.fillText(num, 256 + Math.cos(angle) * r, 256 + Math.sin(angle) * r);
        });

        // Brand signature on dial
        ctx.fillStyle = '#8b6508';
        ctx.font = 'italic bold 18px Georgia, serif';
        ctx.fillText('MAISON ALICE', 256, 195);
        ctx.font = '12px sans-serif';
        ctx.fillText('BAMAKO', 256, 325);
      }
      const tex = new THREE.CanvasTexture(canvas);
      tex.anisotropy = 4;
      return tex;
    };

    const createLuxuryCardTextures = (suit: string, suitColor: string, rank: string) => {
      // Front Face
      const frontCanvas = document.createElement('canvas');
      frontCanvas.width = 512;
      frontCanvas.height = 768;
      const fctx = frontCanvas.getContext('2d');
      if (fctx) {
        const bgGrad = fctx.createLinearGradient(0, 0, 512, 768);
        bgGrad.addColorStop(0, '#fcfaf2');
        bgGrad.addColorStop(1, '#efe6d5');
        fctx.fillStyle = bgGrad;
        fctx.fillRect(0, 0, 512, 768);

        // Double gold ornate frame
        fctx.strokeStyle = '#c59b27';
        fctx.lineWidth = 8;
        fctx.strokeRect(24, 24, 464, 720);
        fctx.lineWidth = 2;
        fctx.strokeRect(38, 38, 436, 692);

        // Corner ornaments
        fctx.fillStyle = suitColor;
        fctx.font = 'bold 58px Georgia, serif';
        fctx.textAlign = 'center';
        fctx.fillText(rank, 76, 102);
        fctx.font = '46px Georgia, serif';
        fctx.fillText(suit, 76, 152);

        fctx.save();
        fctx.translate(512 - 76, 768 - 102);
        fctx.rotate(Math.PI);
        fctx.font = 'bold 58px Georgia, serif';
        fctx.fillText(rank, 0, 0);
        fctx.font = '46px Georgia, serif';
        fctx.fillText(suit, 0, 50);
        fctx.restore();

        // Center royal medallion
        fctx.strokeStyle = 'rgba(197, 155, 39, 0.45)';
        fctx.lineWidth = 3;
        fctx.beginPath();
        fctx.arc(256, 384, 130, 0, Math.PI * 2);
        fctx.stroke();

        fctx.fillStyle = suitColor;
        fctx.font = '190px Georgia, serif';
        fctx.textAlign = 'center';
        fctx.textBaseline = 'middle';
        fctx.fillText(suit, 256, 390);
      }

      // Back Face
      const backCanvas = document.createElement('canvas');
      backCanvas.width = 512;
      backCanvas.height = 768;
      const bctx = backCanvas.getContext('2d');
      if (bctx) {
        bctx.fillStyle = '#120914';
        bctx.fillRect(0, 0, 512, 768);
        bctx.strokeStyle = '#d4af37';
        bctx.lineWidth = 10;
        bctx.strokeRect(26, 26, 460, 716);
        bctx.lineWidth = 2;
        bctx.strokeRect(44, 44, 424, 680);

        bctx.beginPath();
        bctx.arc(256, 384, 110, 0, Math.PI * 2);
        bctx.stroke();

        bctx.fillStyle = '#d4af37';
        bctx.font = 'italic bold 44px Georgia, serif';
        bctx.textAlign = 'center';
        bctx.textBaseline = 'middle';
        bctx.fillText('M • A', 256, 384);
      }

      return {
        front: new THREE.CanvasTexture(frontCanvas),
        back: new THREE.CanvasTexture(backCanvas)
      };
    };

    const macaronBump = createMacaronBumpTexture();
    const watchDialTex = createWatchDialTexture();

    // 5. High-Craft Confectionery & Jewellery Materials
    const materials = {
      gold24k: new THREE.MeshPhysicalMaterial({
        color: 0xffcf40,
        metalness: 0.96,
        roughness: 0.14,
        clearcoat: 0.6,
        clearcoatRoughness: 0.1,
        envMapIntensity: 2.1
      }),
      roseCopperGold: new THREE.MeshPhysicalMaterial({
        color: 0xe67e45,
        metalness: 0.9,
        roughness: 0.18,
        clearcoat: 0.7,
        envMapIntensity: 1.9
      }),
      darkChocolateGlaze: new THREE.MeshPhysicalMaterial({
        color: 0x231007,
        roughness: 0.16,
        metalness: 0.06,
        clearcoat: 0.95,
        clearcoatRoughness: 0.08,
        reflectivity: 0.9,
        envMapIntensity: 1.8
      }),
      milkPralineSwirl: new THREE.MeshPhysicalMaterial({
        color: 0x5c2c14,
        roughness: 0.24,
        metalness: 0.05,
        clearcoat: 0.75,
        clearcoatRoughness: 0.14,
        envMapIntensity: 1.5
      }),
      rubyMirrorGlaze: new THREE.MeshPhysicalMaterial({
        color: 0xb80f38,
        roughness: 0.1,
        metalness: 0.08,
        clearcoat: 1.0,
        clearcoatRoughness: 0.04,
        envMapIntensity: 2.3
      }),
      raspberryMacaronShell: new THREE.MeshPhysicalMaterial({
        color: 0xd43764,
        roughness: 0.42,
        metalness: 0.02,
        clearcoat: 0.28,
        clearcoatRoughness: 0.35,
        bumpMap: macaronBump,
        bumpScale: 0.015,
        envMapIntensity: 1.2
      }),
      pistachioMacaronShell: new THREE.MeshPhysicalMaterial({
        color: 0x8fb359,
        roughness: 0.42,
        metalness: 0.02,
        clearcoat: 0.28,
        clearcoatRoughness: 0.35,
        bumpMap: macaronBump,
        bumpScale: 0.015,
        envMapIntensity: 1.2
      }),
      vanillaGoldMacaronShell: new THREE.MeshPhysicalMaterial({
        color: 0xf7e7c4,
        roughness: 0.36,
        metalness: 0.15,
        clearcoat: 0.38,
        bumpMap: macaronBump,
        bumpScale: 0.012,
        envMapIntensity: 1.4
      }),
      ganacheCream: new THREE.MeshPhysicalMaterial({
        color: 0xfff5dc,
        roughness: 0.28,
        clearcoat: 0.5,
        envMapIntensity: 1.2
      }),
      chocolateGanacheFilling: new THREE.MeshPhysicalMaterial({
        color: 0x2e1509,
        roughness: 0.2,
        clearcoat: 0.85,
        envMapIntensity: 1.6
      }),
      crystalGlass: new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        roughness: 0.04,
        metalness: 0.05,
        transmission: 0.9,
        ior: 1.52,
        thickness: 0.5,
        envMapIntensity: 2.2
      })
    };

    // 6. Sculpted 3D Haute Confiserie & Wonderland Builders

    // Builder A: Authentic French Macaron (Domed shells + Ruffled Pied Collerette + Cream Ganache + Gold Leaf)
    const buildHauteMacaron = (
      shellMat: THREE.Material,
      fillingMat: THREE.Material,
      withGoldLeaf = true
    ) => {
      const group = new THREE.Group();

      // Lathe profile for a realistic domed macaron shell
      const shellPoints: THREE.Vector2[] = [];
      for (let i = 0; i <= 16; i++) {
        const t = i / 16;
        const r = Math.sin(t * Math.PI * 0.5) * 0.92;
        const y = Math.cos(t * Math.PI * 0.5) * 0.34 + 0.14;
        shellPoints.push(new THREE.Vector2(r, y));
      }
      shellPoints.push(new THREE.Vector2(0.95, 0.08));
      shellPoints.push(new THREE.Vector2(0, 0.08));

      const shellGeo = new THREE.LatheGeometry(shellPoints, 40);

      const topShell = new THREE.Mesh(shellGeo, shellMat);
      group.add(topShell);

      const bottomShell = new THREE.Mesh(shellGeo, shellMat);
      bottomShell.rotation.x = Math.PI;
      group.add(bottomShell);

      // Authentic ruffled pied (collerette) around both shells
      const piedRingGeo = new THREE.TorusGeometry(0.9, 0.065, 12, 36);
      const topPied = new THREE.Mesh(piedRingGeo, shellMat);
      topPied.rotation.x = Math.PI / 2;
      topPied.position.y = 0.11;
      group.add(topPied);

      const bottomPied = new THREE.Mesh(piedRingGeo, shellMat);
      bottomPied.rotation.x = Math.PI / 2;
      bottomPied.position.y = -0.11;
      group.add(bottomPied);

      // Micro-piped meringue ruffles on the pied
      const beadGeo = new THREE.SphereGeometry(0.055, 8, 8);
      for (let i = 0; i < 24; i++) {
        const angle = (i / 24) * Math.PI * 2;
        const r = 0.93 + (i % 2 === 0 ? 0.015 : -0.01);
        const beadTop = new THREE.Mesh(beadGeo, shellMat);
        beadTop.position.set(Math.cos(angle) * r, 0.11, Math.sin(angle) * r);
        beadTop.scale.set(1.2, 0.75, 1.2);
        group.add(beadTop);

        const beadBot = new THREE.Mesh(beadGeo, shellMat);
        beadBot.position.set(Math.cos(angle + 0.13) * r, -0.11, Math.sin(angle + 0.13) * r);
        beadBot.scale.set(1.2, 0.75, 1.2);
        group.add(beadBot);
      }

      // Whipped ganache center
      const ganache = new THREE.Mesh(
        new THREE.TorusGeometry(0.74, 0.13, 16, 36),
        fillingMat
      );
      ganache.rotation.x = Math.PI / 2;
      group.add(ganache);

      // 24K Gold Leaf garnish on top shell
      if (withGoldLeaf) {
        const flakeGeo = new THREE.DodecahedronGeometry(0.14, 0);
        const flake1 = new THREE.Mesh(flakeGeo, materials.gold24k);
        flake1.scale.set(1.4, 0.18, 0.9);
        flake1.position.set(0.15, 0.48, 0.1);
        flake1.rotation.set(0.15, 0.6, -0.1);
        group.add(flake1);

        const flake2 = new THREE.Mesh(flakeGeo, materials.gold24k);
        flake2.scale.set(0.8, 0.15, 0.6);
        flake2.position.set(-0.12, 0.47, -0.08);
        group.add(flake2);
      }

      return group;
    };

    // Builder B: Sculpted Ruby Mirror-Glaze Heart Bonbon with Gold Leaf
    const buildRubyHeartBonbon = () => {
      const group = new THREE.Group();
      const x = 0, y = 0;
      const heartShape = new THREE.Shape();
      heartShape.moveTo(x, y + 0.25);
      heartShape.bezierCurveTo(x, y + 0.25, x - 0.1, y, x - 0.5, y);
      heartShape.bezierCurveTo(x - 1.05, y, x - 1.05, y + 0.62, x - 1.05, y + 0.62);
      heartShape.bezierCurveTo(x - 1.05, y + 0.98, x - 0.68, y + 1.38, x, y + 1.75);
      heartShape.bezierCurveTo(x + 0.68, y + 1.38, x + 1.05, y + 0.98, x + 1.05, y + 0.62);
      heartShape.bezierCurveTo(x + 1.05, y + 0.62, x + 1.05, y, x + 0.5, y);
      heartShape.bezierCurveTo(x + 0.15, y, x, y + 0.25, x, y + 0.25);

      const extrudeSettings: THREE.ExtrudeGeometryOptions = {
        depth: 0.22,
        bevelEnabled: true,
        bevelSegments: 16,
        steps: 3,
        bevelSize: 0.26,
        bevelThickness: 0.28
      };

      const geo = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
      geo.center();

      const heartMesh = new THREE.Mesh(geo, materials.rubyMirrorGlaze);
      heartMesh.rotation.z = Math.PI;
      heartMesh.scale.set(0.68, 0.68, 0.72);
      group.add(heartMesh);

      // Gold leaf accent on the curve of the heart
      const goldAccent = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.14, 1),
        materials.gold24k
      );
      goldAccent.scale.set(1.5, 0.2, 0.9);
      goldAccent.position.set(0.28, 0.22, 0.28);
      goldAccent.rotation.set(0.4, 0.3, -0.4);
      group.add(goldAccent);

      return group;
    };

    // Builder C: Haute Chocolaterie Swirled Praline Bonbon in Golden Fluted Cup
    const buildRoyalPralineDome = () => {
      const group = new THREE.Group();

      // Golden fluted pastry cup (caissette)
      const cupGeo = new THREE.CylinderGeometry(0.78, 0.58, 0.32, 28, 1, false);
      const cup = new THREE.Mesh(cupGeo, materials.gold24k);
      cup.position.y = -0.32;
      group.add(cup);

      // Sculpted tiered ganache dome using LatheGeometry
      const domePoints: THREE.Vector2[] = [];
      for (let i = 0; i <= 24; i++) {
        const t = i / 24;
        const baseR = (1 - Math.pow(t, 1.35)) * 0.68;
        const wave = Math.sin(t * Math.PI * 5) * 0.035 * (1 - t);
        const r = Math.max(0, baseR + wave);
        const y = t * 0.78 - 0.18;
        domePoints.push(new THREE.Vector2(r, y));
      }
      const domeGeo = new THREE.LatheGeometry(domePoints, 36);
      const dome = new THREE.Mesh(domeGeo, materials.darkChocolateGlaze);
      group.add(dome);

      // Golden hazelnut pearl crown
      const pearl = new THREE.Mesh(
        new THREE.SphereGeometry(0.14, 20, 20),
        materials.gold24k
      );
      pearl.position.y = 0.62;
      group.add(pearl);

      return group;
    };

    // Builder D: Ornate Wonderland Golden Pocket Watch with Ticking Hands
    const buildGoldenPocketWatch = () => {
      const group = new THREE.Group();

      // Outer gold case
      const caseBody = new THREE.Mesh(
        new THREE.CylinderGeometry(1.12, 1.12, 0.28, 48),
        materials.gold24k
      );
      caseBody.rotation.x = Math.PI / 2;
      group.add(caseBody);

      // Bevelled gold bezel ring
      const bezel = new THREE.Mesh(
        new THREE.TorusGeometry(1.06, 0.11, 20, 48),
        materials.gold24k
      );
      bezel.position.z = 0.12;
      group.add(bezel);

      const backBezel = new THREE.Mesh(
        new THREE.TorusGeometry(1.06, 0.09, 16, 48),
        materials.gold24k
      );
      backBezel.position.z = -0.12;
      group.add(backBezel);

      // Porcelain Roman Numeral Dial
      const dial = new THREE.Mesh(
        new THREE.CircleGeometry(0.98, 48),
        new THREE.MeshStandardMaterial({
          map: watchDialTex,
          roughness: 0.25,
          metalness: 0.1
        })
      );
      dial.position.z = 0.145;
      group.add(dial);

      // Watch Hands (Animated in loop)
      const hourHandGroup = new THREE.Group();
      hourHandGroup.position.z = 0.165;
      const hourHandMesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.06, 0.48, 0.02),
        materials.gold24k
      );
      hourHandMesh.position.y = 0.18;
      hourHandGroup.add(hourHandMesh);
      hourHandGroup.rotation.z = -Math.PI / 4;
      group.add(hourHandGroup);

      const minuteHandGroup = new THREE.Group();
      minuteHandGroup.position.z = 0.175;
      const minuteHandMesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.04, 0.72, 0.02),
        materials.gold24k
      );
      minuteHandMesh.position.y = 0.28;
      minuteHandGroup.add(minuteHandMesh);
      minuteHandGroup.rotation.z = Math.PI / 3;
      group.add(minuteHandGroup);

      // Center pin
      const centerPin = new THREE.Mesh(
        new THREE.SphereGeometry(0.07, 16, 16),
        materials.gold24k
      );
      centerPin.position.z = 0.185;
      group.add(centerPin);

      // Crystal Glass Dome
      const glassLens = new THREE.Mesh(
        new THREE.SphereGeometry(1.02, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.22),
        materials.crystalGlass
      );
      glassLens.rotation.x = Math.PI / 2;
      glassLens.position.z = -0.78;
      group.add(glassLens);

      // Top Crown Winder & Bow Ring
      const stem = new THREE.Mesh(
        new THREE.CylinderGeometry(0.11, 0.11, 0.26, 20),
        materials.gold24k
      );
      stem.position.y = 1.24;
      group.add(stem);

      const crown = new THREE.Mesh(
        new THREE.CylinderGeometry(0.19, 0.16, 0.14, 20),
        materials.gold24k
      );
      crown.position.y = 1.38;
      group.add(crown);

      const bowRing = new THREE.Mesh(
        new THREE.TorusGeometry(0.28, 0.045, 16, 36),
        materials.gold24k
      );
      bowRing.position.y = 1.54;
      group.add(bowRing);

      return { group, minuteHandGroup, hourHandGroup };
    };

    // Builder E: Ornate Heart-Bow Golden Key of Alice
    const buildOrnateGoldenKey = () => {
      const group = new THREE.Group();

      // Heart-shaped bow
      const bowRing = new THREE.Mesh(
        new THREE.TorusGeometry(0.42, 0.075, 18, 40),
        materials.gold24k
      );
      bowRing.position.y = 0.95;
      group.add(bowRing);

      // Inner filigree scrolls inside key bow
      const scrollLeft = new THREE.Mesh(
        new THREE.TorusGeometry(0.16, 0.04, 12, 24),
        materials.gold24k
      );
      scrollLeft.position.set(-0.14, 0.95, 0);
      group.add(scrollLeft);

      const scrollRight = new THREE.Mesh(
        new THREE.TorusGeometry(0.16, 0.04, 12, 24),
        materials.gold24k
      );
      scrollRight.position.set(0.14, 0.95, 0);
      group.add(scrollRight);

      // Decorative collar
      const collar = new THREE.Mesh(
        new THREE.TorusGeometry(0.13, 0.055, 14, 24),
        materials.gold24k
      );
      collar.rotation.x = Math.PI / 2;
      collar.position.y = 0.48;
      group.add(collar);

      // Fluted shaft
      const shaft = new THREE.Mesh(
        new THREE.CylinderGeometry(0.068, 0.058, 1.55, 20),
        materials.gold24k
      );
      shaft.position.y = -0.32;
      group.add(shaft);

      // Ornate warded bit teeth
      const bitBase = new THREE.Mesh(
        new THREE.BoxGeometry(0.36, 0.32, 0.07),
        materials.gold24k
      );
      bitBase.position.set(0.2, -0.86, 0);
      group.add(bitBase);

      const bitCutout = new THREE.Mesh(
        new THREE.BoxGeometry(0.16, 0.08, 0.09),
        materials.roseCopperGold
      );
      bitCutout.position.set(0.28, -0.86, 0);
      group.add(bitCutout);

      return group;
    };

    // Builder F: Luxury Guilloché Playing Card
    const buildLuxuryCard = (suit: string, suitColor: string, rank: string) => {
      const textures = createLuxuryCardTextures(suit, suitColor, rank);
      const cardMaterials = [
        materials.gold24k,
        materials.gold24k,
        materials.gold24k,
        materials.gold24k,
        new THREE.MeshStandardMaterial({ map: textures.front, roughness: 0.25, metalness: 0.15 }),
        new THREE.MeshStandardMaterial({ map: textures.back, roughness: 0.3, metalness: 0.25 })
      ];

      const cardMesh = new THREE.Mesh(
        new THREE.BoxGeometry(1.25, 1.88, 0.038),
        cardMaterials
      );
      return cardMesh;
    };

    // 7. Curated Stage Composition (Framing the Left & Right Corridors)
    const artifacts: SceneArtifact[] = [];
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    const addArtifact = (
      mesh: THREE.Object3D,
      x: number,
      y: number,
      z: number,
      scale: number,
      rotX: number,
      rotY: number,
      rotZ: number,
      parallaxDepth = 1.0,
      extras?: { watchMinuteHand?: THREE.Object3D; watchHourHand?: THREE.Object3D }
    ) => {
      const responsiveX = isMobile ? x * 0.62 : x;
      const responsiveScale = isMobile ? scale * 0.78 : scale;

      mesh.position.set(responsiveX, y - 2.5, z - 4);
      mesh.rotation.set(rotX, rotY, rotZ);
      mesh.scale.set(0.01, 0.01, 0.01);
      mainGroup.add(mesh);

      artifacts.push({
        mesh,
        basePos: new THREE.Vector3(responsiveX, y, z),
        baseRot: new THREE.Euler(rotX, rotY, rotZ),
        baseScale: responsiveScale,
        rotVelocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.004,
          0.003 + Math.random() * 0.004,
          (Math.random() - 0.5) * 0.003
        ),
        floatSpeed: 0.65 + Math.random() * 0.55,
        floatPhase: Math.random() * Math.PI * 2,
        floatAmplitude: 0.24 + Math.random() * 0.18,
        parallaxDepth,
        ...extras
      });
    };

    // --- HERO STAGE (y: +3.8 to -3.8) ---
    // Top-Left: Ornate Golden Pocket Watch
    const pocketWatch = buildGoldenPocketWatch();
    addArtifact(
      pocketWatch.group,
      -6.6,
      2.6,
      2.4,
      1.15,
      0.22,
      0.48,
      -0.18,
      1.25,
      {
        watchMinuteHand: pocketWatch.minuteHandGroup,
        watchHourHand: pocketWatch.hourHandGroup
      }
    );

    // Top-Right: Sculpted Ruby Mirror-Glaze Heart Bonbon
    addArtifact(
      buildRubyHeartBonbon(),
      6.8,
      2.5,
      2.8,
      1.15,
      0.3,
      -0.5,
      0.15,
      1.3
    );

    // Mid-Left: Raspberry & Gold Leaf Haute Macaron
    addArtifact(
      buildHauteMacaron(materials.raspberryMacaronShell, materials.ganacheCream, true),
      -7.4,
      -1.2,
      3.5,
      1.25,
      0.45,
      0.3,
      0.25,
      1.4
    );

    // Mid-Right: Ornate Golden Key of Alice
    addArtifact(
      buildOrnateGoldenKey(),
      6.4,
      -2.0,
      3.2,
      1.25,
      0.28,
      -0.42,
      0.35,
      1.35
    );

    // Deep-Left & Deep-Right: Gilded Wonderland Playing Cards
    addArtifact(
      buildLuxuryCard('♥', '#dc143c', 'A'),
      -8.8,
      0.8,
      -0.8,
      1.05,
      0.15,
      0.55,
      -0.22,
      0.85
    );
    addArtifact(
      buildLuxuryCard('♠', '#1a120b', 'Q'),
      8.6,
      0.4,
      -0.6,
      1.05,
      -0.12,
      -0.52,
      0.2,
      0.85
    );

    // --- COLLECTIONS STAGE (y: -7 to -15) ---
    addArtifact(
      buildRoyalPralineDome(),
      -6.8,
      -7.8,
      3.0,
      1.3,
      0.38,
      0.25,
      -0.15,
      1.3
    );
    addArtifact(
      buildHauteMacaron(materials.pistachioMacaronShell, materials.chocolateGanacheFilling, true),
      7.1,
      -9.2,
      3.2,
      1.25,
      0.42,
      -0.3,
      -0.2,
      1.35
    );
    addArtifact(
      buildRubyHeartBonbon(),
      -6.5,
      -12.8,
      2.6,
      1.1,
      0.25,
      0.45,
      0.18,
      1.2
    );
    addArtifact(
      buildHauteMacaron(materials.vanillaGoldMacaronShell, materials.chocolateGanacheFilling, true),
      6.8,
      -14.2,
      3.0,
      1.2,
      0.35,
      -0.4,
      0.22,
      1.3
    );

    // --- EXPERIENCE & FAQ STAGE (y: -18 to -27) ---
    addArtifact(
      buildOrnateGoldenKey(),
      -6.9,
      -18.8,
      2.8,
      1.2,
      -0.2,
      0.5,
      -0.35,
      1.25
    );
    addArtifact(
      buildRoyalPralineDome(),
      6.9,
      -20.5,
      3.2,
      1.25,
      0.4,
      -0.3,
      0.15,
      1.35
    );
    addArtifact(
      buildLuxuryCard('♣', '#b8860b', 'K'),
      -7.6,
      -24.0,
      1.2,
      1.1,
      0.18,
      0.45,
      0.24,
      1.0
    );
    addArtifact(
      buildHauteMacaron(materials.raspberryMacaronShell, materials.ganacheCream, true),
      6.6,
      -25.2,
      2.8,
      1.2,
      0.4,
      -0.25,
      -0.18,
      1.25
    );

    artifactsRef.current = artifacts;

    // 8. Volumetric Gold Dust & Soft Bokeh Particles
    const createGlowParticleTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        grad.addColorStop(0, 'rgba(255, 245, 200, 1)');
        grad.addColorStop(0.35, 'rgba(212, 175, 55, 0.75)');
        grad.addColorStop(1, 'rgba(212, 175, 55, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 64, 64);
      }
      return new THREE.CanvasTexture(canvas);
    };

    const particleCount = isMobile ? 65 : 130;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 26;
      positions[i * 3 + 1] = 8 - Math.random() * 38;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10 - 1;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMat = new THREE.PointsMaterial({
      size: isMobile ? 0.34 : 0.42,
      map: createGlowParticleTexture(),
      transparent: true,
      opacity: 0.75,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    const goldDustPoints = new THREE.Points(particleGeo, particleMat);
    scene.add(goldDustPoints);

    // 9. Anime.js Entrance Choreography
    artifacts.forEach((item, idx) => {
      anime({
        targets: item.mesh.scale,
        x: item.baseScale,
        y: item.baseScale,
        z: item.baseScale,
        duration: 1800,
        delay: 120 + idx * 90,
        easing: 'easeOutElastic(1, 0.75)'
      });

      anime({
        targets: item.mesh.position,
        y: item.basePos.y,
        z: item.basePos.z,
        duration: 1600,
        delay: 100 + idx * 90,
        easing: 'easeOutExpo'
      });
    });

    // 10. Scroll & Pointer Interactive Parallax
    let currentScroll = 0;
    let targetScroll = 0;
    let pointerX = 0;
    let pointerY = 0;
    let targetPointerX = 0;
    let targetPointerY = 0;

    const onScroll = () => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      targetScroll = (window.scrollY / maxScroll) * 26;
    };

    const onMouseMove = (e: MouseEvent) => {
      targetPointerX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetPointerY = -(e.clientY / window.innerHeight - 0.5) * 2;
    };

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('resize', onResize);

    // 11. Render Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animateScene = () => {
      animationFrameId = requestAnimationFrame(animateScene);
      if (document.hidden) return;

      const elapsed = clock.getElapsedTime();

      currentScroll += (targetScroll - currentScroll) * 0.075;
      pointerX += (targetPointerX - pointerX) * 0.05;
      pointerY += (targetPointerY - pointerY) * 0.05;

      // Move accent studio light with pointer
      accentLight.position.x = pointerX * 9;
      accentLight.position.y = pointerY * 6 - currentScroll * 0.85;

      // Smooth camera trajectory
      camera.position.x = pointerX * 0.65;
      camera.position.y = -currentScroll + pointerY * 0.45;
      camera.lookAt(0, -currentScroll, 0);

      // Update sculpted artifacts with gentle studio oscillation around their photogenic 3/4 angle
      artifacts.forEach((item) => {
        item.mesh.rotation.x =
          item.baseRot.x + Math.sin(elapsed * item.floatSpeed * 0.8 + item.floatPhase) * 0.16;
        item.mesh.rotation.y =
          item.baseRot.y + Math.cos(elapsed * item.floatSpeed * 0.65 + item.floatPhase) * 0.24;
        item.mesh.rotation.z =
          item.baseRot.z + Math.sin(elapsed * item.floatSpeed * 0.5 + item.floatPhase) * 0.1;

        const floatOffsetY =
          Math.sin(elapsed * item.floatSpeed + item.floatPhase) * item.floatAmplitude;
        const floatOffsetX =
          Math.cos(elapsed * item.floatSpeed * 0.75 + item.floatPhase) * (item.floatAmplitude * 0.55);

        item.mesh.position.x = item.basePos.x + floatOffsetX + pointerX * 0.25 * item.parallaxDepth;
        item.mesh.position.y = item.basePos.y + floatOffsetY;

        if (item.watchMinuteHand && item.watchHourHand) {
          item.watchMinuteHand.rotation.z = -elapsed * 0.45;
          item.watchHourHand.rotation.z = -elapsed * 0.08 - Math.PI / 4;
        }
      });

      // Gentle upward drift of golden bokeh dust
      goldDustPoints.rotation.y = elapsed * 0.025;
      goldDustPoints.position.y = Math.sin(elapsed * 0.3) * 0.4;

      renderer.render(scene, camera);
    };

    animateScene();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animationFrameId);
      pmremGenerator.dispose();
      envTexture.dispose();
      renderer.dispose();
      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
    />
  );
};
