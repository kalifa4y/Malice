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
  chronoRing?: THREE.Object3D;
}

export const Confectionery3DScene: React.FC<Confectionery3DSceneProps> = ({ currentTheme }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const lightsRef = useRef<{
    primaryLight: THREE.PointLight;
    goldLight: THREE.PointLight;
    accentLight: THREE.PointLight;
    fog: THREE.FogExp2;
    potionMaterial?: THREE.MeshPhysicalMaterial;
  } | null>(null);
  const artifactsRef = useRef<SceneArtifact[]>([]);

  // React to Underland Realm changes with Anime.js studio light & flourish choreography
  useEffect(() => {
    if (!currentTheme || !lightsRef.current) return;

    const primaryColor = new THREE.Color(currentTheme.colors.primary);
    const goldColor = new THREE.Color(currentTheme.colors.gold);
    const bgColor = new THREE.Color(currentTheme.colors.bg);

    const { primaryLight, goldLight, fog, potionMaterial } = lightsRef.current;

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

    if (potionMaterial) {
      anime({
        targets: potionMaterial.color,
        r: primaryColor.r,
        g: primaryColor.g,
        b: primaryColor.b,
        duration: 1400,
        easing: 'easeOutExpo'
      });
      anime({
        targets: potionMaterial.emissive,
        r: primaryColor.r * 0.45,
        g: primaryColor.g * 0.45,
        b: primaryColor.b * 0.45,
        duration: 1400,
        easing: 'easeOutExpo'
      });
    }

    // Full 360° choreographed pirouette when switching Underland Realm so front faces stay oriented
    artifactsRef.current.forEach((item, idx) => {
      anime({
        targets: item.baseRot,
        y: item.baseRot.y + Math.PI * 2,
        duration: 1650,
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
    const fog = new THREE.FogExp2(0x061318, 0.025);
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
    renderer.toneMappingExposure = 1.28;
    container.appendChild(renderer.domElement);

    // Studio HDRI reflections so gold, chocolate glaze and crystal shine realistically
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    const envTexture = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTexture;

    // 3. Studio Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xfff5eb, 0.68);
    scene.add(ambientLight);

    const keySpot = new THREE.SpotLight(0xfff0dd, 4.6, 50, Math.PI / 3.5, 0.55, 1.2);
    keySpot.position.set(9, 14, 16);
    scene.add(keySpot);

    const primaryLight = new THREE.PointLight(0x18b8a6, 4.4, 34, 1.4);
    primaryLight.position.set(-10, 4, 9);
    scene.add(primaryLight);

    const goldLight = new THREE.PointLight(0xe59a38, 4.2, 34, 1.4);
    goldLight.position.set(10, -5, 10);
    scene.add(goldLight);

    const accentLight = new THREE.PointLight(0xffecd2, 2.6, 24, 1.5);
    accentLight.position.set(0, 2, 11);
    scene.add(accentLight);

    // 4. Procedural Studio Textures (Bump maps, Dial, 10/6 Hat Tag, Bois-Moi Tag, Guilloché Cards)
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

    const createHatter106TagTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 192;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const grad = ctx.createLinearGradient(0, 0, 256, 192);
        grad.addColorStop(0, '#fdf6e2');
        grad.addColorStop(1, '#e3cfa6');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 256, 192);

        ctx.strokeStyle = '#3a2312';
        ctx.lineWidth = 6;
        ctx.strokeRect(10, 10, 236, 172);

        ctx.fillStyle = '#1f1108';
        ctx.font = 'italic bold 20px Georgia, serif';
        ctx.textAlign = 'center';
        ctx.fillText('In this style', 128, 48);

        ctx.font = 'bold 74px Georgia, serif';
        ctx.fillText('10/6', 128, 132);
      }
      return new THREE.CanvasTexture(canvas);
    };

    const createDrinkMeTagTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 140;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#fcf3dc';
        ctx.fillRect(0, 0, 256, 140);
        ctx.strokeStyle = '#b8860b';
        ctx.lineWidth = 5;
        ctx.strokeRect(8, 8, 240, 124);
        ctx.fillStyle = '#7a1c2e';
        ctx.font = 'italic bold 36px Georgia, serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('BOIS-MOI', 128, 72);
      }
      return new THREE.CanvasTexture(canvas);
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
        ctx.fillText('MERVEILLES', 256, 195);
        ctx.font = '13px Georgia, serif';
        ctx.fillText('MAISON ALICE', 256, 325);
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
        bctx.font = 'italic bold 40px Georgia, serif';
        bctx.textAlign = 'center';
        bctx.textBaseline = 'middle';
        bctx.fillText('10 / 6', 256, 384);
      }

      return {
        front: new THREE.CanvasTexture(frontCanvas),
        back: new THREE.CanvasTexture(backCanvas)
      };
    };

    const macaronBump = createMacaronBumpTexture();
    const watchDialTex = createWatchDialTexture();
    const hatterTagTex = createHatter106TagTexture();
    const drinkMeTagTex = createDrinkMeTagTexture();

    // 5. High-Craft Underland & Confectionery Materials
    const potionLiquidMat = new THREE.MeshPhysicalMaterial({
      color: 0xd93870,
      emissive: 0x6b1435,
      emissiveIntensity: 0.75,
      roughness: 0.12,
      metalness: 0.15,
      clearcoat: 1.0,
      envMapIntensity: 2.4
    });

    lightsRef.current = { primaryLight, goldLight, accentLight, fog, potionMaterial: potionLiquidMat };

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
        color: 0xe07828,
        metalness: 0.85,
        roughness: 0.2,
        clearcoat: 0.75,
        envMapIntensity: 1.9
      }),
      hatPeacockVelvet: new THREE.MeshPhysicalMaterial({
        color: 0x0f2d34,
        roughness: 0.62,
        metalness: 0.08,
        sheen: 1.0,
        sheenRoughness: 0.45,
        sheenColor: new THREE.Color(0x25b8a8),
        bumpMap: macaronBump,
        bumpScale: 0.008,
        envMapIntensity: 1.3
      }),
      hatCopperRibbon: new THREE.MeshPhysicalMaterial({
        color: 0xd96b27,
        roughness: 0.32,
        metalness: 0.25,
        clearcoat: 0.55,
        envMapIntensity: 1.6
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
        color: 0x22b5a3,
        roughness: 0.42,
        metalness: 0.05,
        clearcoat: 0.32,
        clearcoatRoughness: 0.35,
        bumpMap: macaronBump,
        bumpScale: 0.015,
        envMapIntensity: 1.3
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
        color: 0xdff6ff,
        roughness: 0.05,
        metalness: 0.08,
        transparent: true,
        opacity: 0.34,
        clearcoat: 1.0,
        clearcoatRoughness: 0.04,
        envMapIntensity: 2.5
      }),
      corkMat: new THREE.MeshStandardMaterial({
        color: 0xb5834c,
        roughness: 0.85,
        metalness: 0.02
      })
    };

    // 6. Sculpted 3D Underland & Haute Confiserie Builders

    // Builder 1: Johnny Depp's Mad Hatter (Tarrant Hightopp) 10/6 Top Hat with Copper Sash & Hatpins
    const buildMadHatterTopHat106 = () => {
      const group = new THREE.Group();

      // Flared asymmetric-style Victorian top hat crown via LatheGeometry
      const crownPoints: THREE.Vector2[] = [];
      crownPoints.push(new THREE.Vector2(0.01, -0.68));
      crownPoints.push(new THREE.Vector2(0.68, -0.68));
      for (let i = 0; i <= 20; i++) {
        const t = i / 20;
        const r = 0.66 + Math.pow(t, 1.45) * 0.28 + Math.sin(t * Math.PI) * 0.03;
        const y = -0.68 + t * 1.52;
        crownPoints.push(new THREE.Vector2(r, y));
      }
      crownPoints.push(new THREE.Vector2(0.01, 0.86));

      const crownGeo = new THREE.LatheGeometry(crownPoints, 44);
      const crown = new THREE.Mesh(crownGeo, materials.hatPeacockVelvet);
      group.add(crown);

      //Curved Victorian Brim
      const brimGeo = new THREE.CylinderGeometry(1.36, 1.38, 0.08, 44);
      const brim = new THREE.Mesh(brimGeo, materials.hatPeacockVelvet);
      brim.position.y = -0.66;
      group.add(brim);

      const brimCurl = new THREE.Mesh(
        new THREE.TorusGeometry(1.34, 0.075, 16, 48),
        materials.hatPeacockVelvet
      );
      brimCurl.rotation.x = Math.PI / 2;
      brimCurl.position.y = -0.63;
      group.add(brimCurl);

      // Burnt-Copper Silk Ribbon Band around base of crown
      const ribbon = new THREE.Mesh(
        new THREE.CylinderGeometry(0.73, 0.70, 0.34, 40),
        materials.hatCopperRibbon
      );
      ribbon.position.y = -0.46;
      group.add(ribbon);

      // Gold buckle on front-left of ribbon
      const buckle = new THREE.Mesh(
        new THREE.TorusGeometry(0.16, 0.032, 12, 24),
        materials.gold24k
      );
      buckle.position.set(-0.28, -0.45, 0.68);
      buckle.rotation.y = -0.35;
      group.add(buckle);

      // Iconic "In this style 10/6" Parchment Card tucked into the band
      const tagMat = new THREE.MeshStandardMaterial({
        map: hatterTagTex,
        roughness: 0.35,
        metalness: 0.05,
        side: THREE.DoubleSide
      });
      const tagCard = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.52, 0.025), tagMat);
      tagCard.position.set(0.42, -0.16, 0.62);
      tagCard.rotation.set(-0.12, 0.48, -0.18);
      group.add(tagCard);

      // Tarrant Hightopp's Hatpins sticking out diagonally
      const pinShaft1 = new THREE.Mesh(
        new THREE.CylinderGeometry(0.015, 0.01, 1.05, 12),
        materials.gold24k
      );
      pinShaft1.position.set(-0.55, 0.05, 0.42);
      pinShaft1.rotation.set(0.25, 0.1, 0.58);
      group.add(pinShaft1);

      const pinHead1 = new THREE.Mesh(
        new THREE.SphereGeometry(0.09, 18, 18),
        materials.gold24k
      );
      pinHead1.position.set(-0.83, 0.48, 0.54);
      group.add(pinHead1);

      const pinShaft2 = new THREE.Mesh(
        new THREE.CylinderGeometry(0.014, 0.01, 0.9, 12),
        materials.gold24k
      );
      pinShaft2.position.set(-0.48, -0.04, 0.48);
      pinShaft2.rotation.set(0.15, 0.18, 0.78);
      group.add(pinShaft2);

      const pinHead2 = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.085, 1),
        materials.rubyMirrorGlaze
      );
      pinHead2.position.set(-0.79, 0.27, 0.56);
      group.add(pinHead2);

      return group;
    };

    // Builder 2: "Pishsalver" ("Bois-Moi" / Drink Me) Enchanted Apothecary Potion Bottle
    const buildPishsalverPotionBottle = () => {
      const group = new THREE.Group();

      // Crystal apothecary flask profile
      const flaskPoints: THREE.Vector2[] = [
        new THREE.Vector2(0.01, -0.9),
        new THREE.Vector2(0.58, -0.9),
        new THREE.Vector2(0.72, -0.55),
        new THREE.Vector2(0.68, 0.05),
        new THREE.Vector2(0.26, 0.42),
        new THREE.Vector2(0.24, 0.85),
        new THREE.Vector2(0.34, 0.92),
        new THREE.Vector2(0.22, 0.95)
      ];
      const flaskGeo = new THREE.LatheGeometry(flaskPoints, 28);
      const flask = new THREE.Mesh(flaskGeo, materials.crystalGlass);
      group.add(flask);

      // Glowing Pishsalver Elixir inside
      const liquidPoints: THREE.Vector2[] = [
        new THREE.Vector2(0.01, -0.82),
        new THREE.Vector2(0.52, -0.82),
        new THREE.Vector2(0.63, -0.52),
        new THREE.Vector2(0.59, -0.05),
        new THREE.Vector2(0.01, -0.05)
      ];
      const liquidGeo = new THREE.LatheGeometry(liquidPoints, 28);
      const liquid = new THREE.Mesh(liquidGeo, potionLiquidMat);
      group.add(liquid);

      // Cork Stopper & Gold Collar
      const cork = new THREE.Mesh(
        new THREE.CylinderGeometry(0.21, 0.16, 0.34, 20),
        materials.corkMat
      );
      cork.position.y = 1.02;
      group.add(cork);

      const goldCollar = new THREE.Mesh(
        new THREE.TorusGeometry(0.26, 0.045, 14, 28),
        materials.gold24k
      );
      goldCollar.rotation.x = Math.PI / 2;
      goldCollar.position.y = 0.62;
      group.add(goldCollar);

      // Hanging "BOIS-MOI" Parchment Tag on Front
      const tagMesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.76, 0.42, 0.025),
        new THREE.MeshStandardMaterial({
          map: drinkMeTagTex,
          roughness: 0.3,
          metalness: 0.08
        })
      );
      tagMesh.position.set(0.18, 0.18, 0.68);
      tagMesh.rotation.set(-0.08, 0.22, -0.14);
      group.add(tagMesh);

      return group;
    };

    // Builder 3: Authentic French Macaron (Domed shells + Ruffled Pied Collerette + Cream Ganache + Gold Leaf)
    const buildHauteMacaron = (
      shellMat: THREE.Material,
      fillingMat: THREE.Material,
      withGoldLeaf = true
    ) => {
      const group = new THREE.Group();

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

      const piedRingGeo = new THREE.TorusGeometry(0.9, 0.065, 12, 36);
      const topPied = new THREE.Mesh(piedRingGeo, shellMat);
      topPied.rotation.x = Math.PI / 2;
      topPied.position.y = 0.11;
      group.add(topPied);

      const bottomPied = new THREE.Mesh(piedRingGeo, shellMat);
      bottomPied.rotation.x = Math.PI / 2;
      bottomPied.position.y = -0.11;
      group.add(bottomPied);

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

      const ganache = new THREE.Mesh(
        new THREE.TorusGeometry(0.74, 0.13, 16, 36),
        fillingMat
      );
      ganache.rotation.x = Math.PI / 2;
      group.add(ganache);

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

    // Builder 4: Sculpted Ruby Mirror-Glaze Heart of Salazen Grum with Gold Crown
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

      const goldCrown = new THREE.Mesh(
        new THREE.TorusGeometry(0.22, 0.045, 14, 28),
        materials.gold24k
      );
      goldCrown.rotation.x = Math.PI / 2;
      goldCrown.position.set(0, 0.62, 0.05);
      group.add(goldCrown);

      return group;
    };

    // Builder 5: "Upelkuchen" ("Mange-Moi") Swirled Praline Dome in Golden Fluted Cup
    const buildRoyalPralineDome = () => {
      const group = new THREE.Group();

      const cupGeo = new THREE.CylinderGeometry(0.78, 0.58, 0.32, 28, 1, false);
      const cup = new THREE.Mesh(cupGeo, materials.gold24k);
      cup.position.y = -0.32;
      group.add(cup);

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

      const pearl = new THREE.Mesh(
        new THREE.SphereGeometry(0.14, 20, 20),
        materials.gold24k
      );
      pearl.position.y = 0.62;
      group.add(pearl);

      return group;
    };

    // Builder 6: Chronosphere & Golden Pocket Watch of McTwisp
    const buildChronospherePocketWatch = () => {
      const group = new THREE.Group();

      const caseBody = new THREE.Mesh(
        new THREE.CylinderGeometry(1.08, 1.08, 0.26, 48),
        materials.gold24k
      );
      caseBody.rotation.x = Math.PI / 2;
      group.add(caseBody);

      const bezel = new THREE.Mesh(
        new THREE.TorusGeometry(1.04, 0.1, 20, 48),
        materials.gold24k
      );
      bezel.position.z = 0.12;
      group.add(bezel);

      // Outer Chronosphere Armillary Gyroscope Ring (Alice Through the Looking Glass)
      const chronoRing = new THREE.Mesh(
        new THREE.TorusGeometry(1.36, 0.04, 16, 56),
        materials.roseCopperGold
      );
      chronoRing.rotation.set(0.35, 0.25, 0);
      group.add(chronoRing);

      // Porcelain Roman Numeral Dial
      const dial = new THREE.Mesh(
        new THREE.CircleGeometry(0.95, 48),
        new THREE.MeshStandardMaterial({
          map: watchDialTex,
          roughness: 0.25,
          metalness: 0.1
        })
      );
      dial.position.z = 0.145;
      group.add(dial);

      // Watch Hands
      const hourHandGroup = new THREE.Group();
      hourHandGroup.position.z = 0.165;
      const hourHandMesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.06, 0.46, 0.02),
        materials.gold24k
      );
      hourHandMesh.position.y = 0.18;
      hourHandGroup.add(hourHandMesh);
      hourHandGroup.rotation.z = -Math.PI / 4;
      group.add(hourHandGroup);

      const minuteHandGroup = new THREE.Group();
      minuteHandGroup.position.z = 0.175;
      const minuteHandMesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.04, 0.68, 0.02),
        materials.gold24k
      );
      minuteHandMesh.position.y = 0.26;
      minuteHandGroup.add(minuteHandMesh);
      minuteHandGroup.rotation.z = Math.PI / 3;
      group.add(minuteHandGroup);

      const centerPin = new THREE.Mesh(
        new THREE.SphereGeometry(0.07, 16, 16),
        materials.gold24k
      );
      centerPin.position.z = 0.185;
      group.add(centerPin);

      const stem = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.1, 0.26, 20),
        materials.gold24k
      );
      stem.position.y = 1.24;
      group.add(stem);

      const bowRing = new THREE.Mesh(
        new THREE.TorusGeometry(0.26, 0.042, 16, 36),
        materials.gold24k
      );
      bowRing.position.y = 1.48;
      group.add(bowRing);

      return { group, minuteHandGroup, hourHandGroup, chronoRing };
    };

    // Builder 7: Ornate Heart-Bow Golden Key of Underland
    const buildOrnateGoldenKey = () => {
      const group = new THREE.Group();

      const bowRing = new THREE.Mesh(
        new THREE.TorusGeometry(0.42, 0.075, 18, 40),
        materials.gold24k
      );
      bowRing.position.y = 0.95;
      group.add(bowRing);

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

      const collar = new THREE.Mesh(
        new THREE.TorusGeometry(0.13, 0.055, 14, 24),
        materials.gold24k
      );
      collar.rotation.x = Math.PI / 2;
      collar.position.y = 0.48;
      group.add(collar);

      const shaft = new THREE.Mesh(
        new THREE.CylinderGeometry(0.068, 0.058, 1.55, 20),
        materials.gold24k
      );
      shaft.position.y = -0.32;
      group.add(shaft);

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

    // Builder 8: Luxury Guilloché Playing Card
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

    // 7. Curated Underland Stage Composition (Framing the Left & Right Corridors)
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
      extras?: {
        watchMinuteHand?: THREE.Object3D;
        watchHourHand?: THREE.Object3D;
        chronoRing?: THREE.Object3D;
      }
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
    // Top-Left: Johnny Depp's Mad Hatter (Tarrant Hightopp) 10/6 Top Hat!
    addArtifact(
      buildMadHatterTopHat106(),
      -6.5,
      2.5,
      2.6,
      1.18,
      0.22,
      0.38,
      -0.16,
      1.3
    );

    // Top-Right: Chronosphere & Golden Pocket Watch of McTwisp
    const chronoWatch = buildChronospherePocketWatch();
    addArtifact(
      chronoWatch.group,
      6.7,
      2.5,
      2.5,
      1.12,
      0.2,
      -0.46,
      0.14,
      1.28,
      {
        watchMinuteHand: chronoWatch.minuteHandGroup,
        watchHourHand: chronoWatch.hourHandGroup,
        chronoRing: chronoWatch.chronoRing
      }
    );

    // Mid-Left: "Pishsalver" ("BOIS-MOI") Crystal Potion Flask
    addArtifact(
      buildPishsalverPotionBottle(),
      -7.1,
      -1.5,
      3.4,
      1.18,
      0.18,
      0.32,
      0.15,
      1.38
    );

    // Mid-Right: Sculpted Ruby Mirror-Glaze Heart of Salazen Grum + Key
    addArtifact(
      buildRubyHeartBonbon(),
      6.6,
      -1.7,
      3.2,
      1.16,
      0.28,
      -0.44,
      0.18,
      1.35
    );

    // Deep-Left & Deep-Right: Gilded Underland Playing Cards & Key
    addArtifact(
      buildLuxuryCard('♥', '#dc1e35', 'Q'),
      -8.8,
      0.7,
      -0.8,
      1.04,
      0.15,
      0.52,
      -0.2,
      0.85
    );
    addArtifact(
      buildOrnateGoldenKey(),
      8.8,
      -0.3,
      0.5,
      1.05,
      0.22,
      -0.48,
      0.42,
      0.95
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
      buildMadHatterTopHat106(),
      -6.6,
      -12.8,
      2.5,
      1.08,
      0.24,
      0.42,
      0.14,
      1.2
    );
    addArtifact(
      buildPishsalverPotionBottle(),
      6.8,
      -14.2,
      3.0,
      1.15,
      0.2,
      -0.36,
      -0.16,
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
      buildLuxuryCard('♠', '#18b8a6', 'A'),
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

    // 8. Bioluminescent Underland Spores & Gold Dust Particles
    const createGlowParticleTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        grad.addColorStop(0, 'rgba(255, 248, 220, 1)');
        grad.addColorStop(0.35, 'rgba(229, 154, 56, 0.8)');
        grad.addColorStop(1, 'rgba(24, 184, 166, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 64, 64);
      }
      return new THREE.CanvasTexture(canvas);
    };

    const particleCount = isMobile ? 70 : 145;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 26;
      positions[i * 3 + 1] = 8 - Math.random() * 38;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10 - 1;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMat = new THREE.PointsMaterial({
      size: isMobile ? 0.36 : 0.45,
      map: createGlowParticleTexture(),
      transparent: true,
      opacity: 0.8,
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
          item.baseRot.x + Math.sin(elapsed * item.floatSpeed * 0.8 + item.floatPhase) * 0.15;
        item.mesh.rotation.y =
          item.baseRot.y + Math.cos(elapsed * item.floatSpeed * 0.65 + item.floatPhase) * 0.24;
        item.mesh.rotation.z =
          item.baseRot.z + Math.sin(elapsed * item.floatSpeed * 0.5 + item.floatPhase) * 0.09;

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
        if (item.chronoRing) {
          item.chronoRing.rotation.z = elapsed * 0.35;
          item.chronoRing.rotation.x = 0.35 + Math.sin(elapsed * 0.6) * 0.2;
        }
      });

      // Gentle upward drift of bioluminescent Underland spores
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
