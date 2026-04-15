import * as THREE from 'three'

export function createScene(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.1

  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0xd6e4f0)
  scene.fog = new THREE.Fog(0xd6e4f0, 20, 40)

  const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 100)
  camera.position.set(0, 3, 8)
  camera.lookAt(0, 0, 0)

  // --- Lighting: bright office daylight ---

  // Sky hemisphere: daylight sky above / warm floor bounce below
  scene.add(new THREE.HemisphereLight(0xc8dff5, 0xe8d5b0, 1.8))

  // Bright ambient fill
  scene.add(new THREE.AmbientLight(0xfff8f0, 2.0))

  // Main sun/window directional light
  const sun = new THREE.DirectionalLight(0xfff5e0, 3.5)
  sun.position.set(6, 10, 4)
  sun.castShadow = true
  sun.shadow.mapSize.set(2048, 2048)
  sun.shadow.camera.near = 0.1
  sun.shadow.camera.far = 50
  sun.shadow.camera.left = -12
  sun.shadow.camera.right = 12
  sun.shadow.camera.top = 12
  sun.shadow.camera.bottom = -12
  sun.shadow.bias = -0.001
  sun.shadow.radius = 3
  scene.add(sun)

  // Soft fill from opposite side (bounce light)
  const fill = new THREE.DirectionalLight(0xe0eeff, 1.2)
  fill.position.set(-4, 6, -2)
  scene.add(fill)

  // Overhead office ceiling lights (strip lights)
  ;[[-3, 0], [3, 0], [0, -3]].forEach(([x, z]) => {
    const strip = new THREE.PointLight(0xfff8ee, 1.5, 8)
    strip.position.set(x, 7.5, z)
    scene.add(strip)
  })

  // --- Floor: warm wood planks ---
  const floorMat = new THREE.MeshStandardMaterial({
    color: 0xc8a060,
    roughness: 0.6,
    metalness: 0.05,
  })
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(14, 14), floorMat)
  floor.rotation.x = -Math.PI / 2
  floor.receiveShadow = true
  scene.add(floor)

  // Floor plank lines
  const plankMat = new THREE.MeshBasicMaterial({ color: 0xaa8844 })
  for (let i = -6; i <= 6; i += 0.7) {
    const plank = new THREE.Mesh(new THREE.PlaneGeometry(14, 0.015), plankMat)
    plank.rotation.x = -Math.PI / 2
    plank.position.set(0, 0.001, i)
    scene.add(plank)
  }

  // --- Walls: cream/off-white ---
  const wallColor = 0xf2ede4
  const wallMat = new THREE.MeshStandardMaterial({ color: wallColor, roughness: 0.9 })

  const backWall = new THREE.Mesh(new THREE.PlaneGeometry(14, 10), wallMat)
  backWall.position.set(0, 5, -7)
  backWall.receiveShadow = true
  scene.add(backWall)

  const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(14, 10), wallMat)
  leftWall.rotation.y = Math.PI / 2
  leftWall.position.set(-7, 5, 0)
  leftWall.receiveShadow = true
  scene.add(leftWall)

  const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(14, 10), wallMat)
  rightWall.rotation.y = -Math.PI / 2
  rightWall.position.set(7, 5, 0)
  rightWall.receiveShadow = true
  scene.add(rightWall)

  // Ceiling
  const ceilMat = new THREE.MeshStandardMaterial({ color: 0xfafafa, roughness: 1 })
  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(14, 14), ceilMat)
  ceil.rotation.x = Math.PI / 2
  ceil.position.y = 8
  scene.add(ceil)

  // Baseboard trim
  const baseboardMat = new THREE.MeshStandardMaterial({ color: 0xe8ddd0, roughness: 0.8 })
  ;[
    { pos: [0, 0.05, -6.98], rot: [0, 0, 0], w: 14 },
    { pos: [-6.98, 0.05, 0], rot: [0, Math.PI / 2, 0], w: 14 },
    { pos: [6.98, 0.05, 0], rot: [0, -Math.PI / 2, 0], w: 14 },
  ].forEach(({ pos, rot, w }) => {
    const board = new THREE.Mesh(new THREE.BoxGeometry(w, 0.12, 0.04), baseboardMat)
    board.position.set(...pos)
    board.rotation.set(...rot)
    scene.add(board)
  })

  // Window on right wall — emissive bright rectangle
  const windowGlass = new THREE.Mesh(
    new THREE.PlaneGeometry(3.5, 3),
    new THREE.MeshStandardMaterial({ color: 0xd0e8ff, emissive: 0xd0e8ff, emissiveIntensity: 0.6, roughness: 0.1 })
  )
  windowGlass.rotation.y = -Math.PI / 2
  windowGlass.position.set(6.95, 3.5, -2)
  scene.add(windowGlass)

  // Window frame
  const frameMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 })
  ;[
    [0, 1.55, 0.08, 3.6],   // top
    [0, -1.55, 0.08, 3.6],  // bottom
    [-1.8, 0, 3.2, 0.08],   // left
    [1.8, 0, 3.2, 0.08],    // right
    [0, 0, 3.2, 0.08],      // middle vertical
  ].forEach(([x, y, h, w]) => {
    const bar = new THREE.Mesh(new THREE.BoxGeometry(0.06, h, 0.06), frameMat)
    bar.rotation.y = -Math.PI / 2
    bar.position.set(6.92, 3.5 + y, -2 + x)
    scene.add(bar)
  })

  // Ceiling light strip geometry
  const lightStripMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xfff8ee, emissiveIntensity: 0.8 })
  ;[[-3, 0], [3, 0], [0, -3]].forEach(([x, z]) => {
    const strip = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.04, 1.4), lightStripMat)
    strip.position.set(x, 7.96, z)
    scene.add(strip)
  })

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  })

  return { scene, camera, renderer }
}
