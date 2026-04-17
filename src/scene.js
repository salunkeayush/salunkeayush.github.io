import * as THREE from 'three'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js'

export function createScene(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.VSMShadowMap
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 0.9
  renderer.outputColorSpace = THREE.SRGBColorSpace

  // Room environment for PBR reflections on glossy/metal surfaces
  const pmrem = new THREE.PMREMGenerator(renderer)
  const envTexture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
  const scene = new THREE.Scene()
  scene.environment = envTexture
  scene.environmentIntensity = 0.6
  scene.background = new THREE.Color(0x080810)
  scene.fog = new THREE.FogExp2(0x080810, 0.035)

  const camera = new THREE.PerspectiveCamera(62, window.innerWidth / window.innerHeight, 0.1, 60)
  camera.position.set(0, 3, 8)
  camera.lookAt(0, 0, 0)

  // ── Lighting ────────────────────────────────────────────────────────────────

  // Very dim ambient — room should feel lit by local lights
  scene.add(new THREE.AmbientLight(0x0a0a18, 3))

  // Weak overhead fill (simulates faint ceiling diffuse)
  const overhead = new THREE.DirectionalLight(0x1a1a2e, 0.6)
  overhead.position.set(0, 8, 2)
  overhead.castShadow = true
  overhead.shadow.mapSize.set(2048, 2048)
  overhead.shadow.camera.near = 1
  overhead.shadow.camera.far = 30
  overhead.shadow.camera.left = -10
  overhead.shadow.camera.right = 10
  overhead.shadow.camera.top = 10
  overhead.shadow.camera.bottom = -10
  overhead.shadow.bias = -0.002
  overhead.shadow.radius = 8
  scene.add(overhead)

  // Desk lamp warm glow
  const deskLamp = new THREE.PointLight(0xffc87a, 8, 5, 2)
  deskLamp.position.set(-0.6, 2.1, -2)
  scene.add(deskLamp)

  // Shelf under-cabinet warm LED strip
  const shelfLed = new THREE.PointLight(0xffb347, 5, 8, 2)
  shelfLed.position.set(4, 2.8, -5.5)
  scene.add(shelfLed)

  // Floor lamp
  const floorLampLight = new THREE.PointLight(0xffeedd, 6, 7, 2)
  floorLampLight.position.set(-5, 3.2, 1.5)
  scene.add(floorLampLight)

  // Subtle blue backlight (window/moonlight from right)
  const backlight = new THREE.DirectionalLight(0x334488, 0.4)
  backlight.position.set(7, 4, 0)
  scene.add(backlight)

  // ── Floor: dark wood ────────────────────────────────────────────────────────
  const floorMat = new THREE.MeshStandardMaterial({ color: 0x3a2210, roughness: 0.75, metalness: 0.02 })
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(16, 16), floorMat)
  floor.rotation.x = -Math.PI / 2
  floor.receiveShadow = true
  scene.add(floor)

  // Plank lines
  const plankMat = new THREE.MeshBasicMaterial({ color: 0x2a1a0a })
  for (let i = -7; i <= 7; i += 0.65) {
    const p = new THREE.Mesh(new THREE.PlaneGeometry(16, 0.012), plankMat)
    p.rotation.x = -Math.PI / 2
    p.position.set(0, 0.001, i)
    scene.add(p)
  }

  // ── Walls: near-black with slight warm undertone ────────────────────────────
  const wallMat = new THREE.MeshStandardMaterial({ color: 0x111114, roughness: 0.95 })

  const backWall = new THREE.Mesh(new THREE.PlaneGeometry(16, 10), wallMat)
  backWall.position.set(0, 5, -8)
  backWall.receiveShadow = true
  scene.add(backWall)

  const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(16, 10), wallMat)
  leftWall.rotation.y = Math.PI / 2
  leftWall.position.set(-8, 5, 0)
  leftWall.receiveShadow = true
  scene.add(leftWall)

  const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(16, 10), wallMat)
  rightWall.rotation.y = -Math.PI / 2
  rightWall.position.set(8, 5, 0)
  rightWall.receiveShadow = true
  scene.add(rightWall)

  const ceilMat = new THREE.MeshStandardMaterial({ color: 0x0d0d12, roughness: 1 })
  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(16, 16), ceilMat)
  ceil.rotation.x = Math.PI / 2
  ceil.position.y = 8
  scene.add(ceil)

  // ── Wood slat accent panel on left wall ─────────────────────────────────────
  const slatWood = new THREE.MeshStandardMaterial({ color: 0x5a3418, roughness: 0.65, metalness: 0.02 })
  const slatDark = new THREE.MeshStandardMaterial({ color: 0x1a0e06, roughness: 0.9 })

  // Panel backing
  const slatBacking = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), new THREE.MeshStandardMaterial({ color: 0x2a1a08, roughness: 0.9 }))
  slatBacking.rotation.y = Math.PI / 2
  slatBacking.position.set(-7.9, 3.5, 1.5)
  scene.add(slatBacking)

  for (let i = -2.2; i <= 2.2; i += 0.28) {
    const slat = new THREE.Mesh(new THREE.BoxGeometry(0.06, 5, 0.12), slatWood)
    slat.position.set(-7.85, 3.5, 1.5 + i)
    slat.castShadow = true
    scene.add(slat)
    // Gap filler
    const gap = new THREE.Mesh(new THREE.BoxGeometry(0.04, 5, 0.04), slatDark)
    gap.position.set(-7.87, 3.5, 1.5 + i + 0.14)
    scene.add(gap)
  }

  // ── Rug under desk ──────────────────────────────────────────────────────────
  const rugColors = [0x2a2a44, 0xcc8822, 0x888888, 0xffffff, 0x334466, 0xcc6622]
  const rugSize = 3.6
  const tiles = 6
  const tileSize = rugSize / tiles
  for (let r = 0; r < tiles; r++) {
    for (let c = 0; c < tiles; c++) {
      const color = rugColors[(r * 3 + c * 2 + (r % 2)) % rugColors.length]
      const tile = new THREE.Mesh(
        new THREE.PlaneGeometry(tileSize - 0.04, tileSize - 0.04),
        new THREE.MeshStandardMaterial({ color, roughness: 0.98 })
      )
      tile.rotation.x = -Math.PI / 2
      tile.position.set(
        -rugSize / 2 + tileSize * c + tileSize / 2 - 0.5,
        0.003,
        -rugSize / 2 + tileSize * r + tileSize / 2 - 1.5
      )
      scene.add(tile)
    }
  }

  // ── Post-processing ─────────────────────────────────────────────────────────
  const composer = new EffectComposer(renderer)
  composer.addPass(new RenderPass(scene, camera))

  // Bloom for warm light glow
  const bloom = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    0.4,   // strength
    0.5,   // radius
    0.82   // threshold — only bright spots bloom
  )
  composer.addPass(bloom)
  composer.addPass(new OutputPass())

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    composer.setSize(window.innerWidth, window.innerHeight)
  })

  return { scene, camera, renderer, composer }
}
