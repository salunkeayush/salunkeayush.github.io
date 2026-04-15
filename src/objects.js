import * as THREE from 'three'

const PROXIMITY_RADIUS = 2.5

// Material helpers
function woodMat(color = 0x8b5e3c) {
  return new THREE.MeshStandardMaterial({ color, roughness: 0.7, metalness: 0.05 })
}
function metalMat(color = 0x888888) {
  return new THREE.MeshStandardMaterial({ color, roughness: 0.3, metalness: 0.8 })
}
function plasticMat(color = 0x333333) {
  return new THREE.MeshStandardMaterial({ color, roughness: 0.6, metalness: 0.1 })
}
function whiteMat(roughness = 0.85) {
  return new THREE.MeshStandardMaterial({ color: 0xf8f5f0, roughness })
}

function shadow(mesh) { mesh.castShadow = true; mesh.receiveShadow = true; return mesh }
function box(w, h, d, mat) { return shadow(new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat)) }

// ── DESK + MONITOR (Experience) ──────────────────────────────────────────────
function makeDesk(scene) {
  const g = new THREE.Group()

  // Desk surface — light oak
  const top = box(2.4, 0.07, 1.1, woodMat(0xc8a060))
  top.position.y = 0.82

  // Desk modesty panel (front face)
  const panel = box(2.3, 0.65, 0.04, woodMat(0xb89050))
  panel.position.set(0, 0.48, 0.53)

  // Side panels
  ;[-1.16, 1.16].forEach(x => {
    const side = box(0.04, 0.72, 1.1, woodMat(0xb89050))
    side.position.set(x, 0.48, 0)
    g.add(side)
  })

  // Metal legs
  ;[[-1.0, -0.42], [1.0, -0.42], [-1.0, 0.42], [1.0, 0.42]].forEach(([x, z]) => {
    const leg = box(0.05, 0.78, 0.05, metalMat(0xaaaaaa))
    leg.position.set(x, 0.39, z)
    g.add(leg)
  })
  // Leg crossbar
  const bar = box(1.96, 0.04, 0.04, metalMat(0xaaaaaa))
  bar.position.set(0, 0.1, 0)
  g.add(bar)

  // Monitor stand base
  const standBase = box(0.42, 0.03, 0.32, metalMat(0x666666))
  standBase.position.set(0, 0.87, -0.2)

  // Monitor neck
  const neck = box(0.06, 0.32, 0.06, metalMat(0x777777))
  neck.position.set(0, 1.03, -0.22)

  // Monitor bezel
  const bezel = box(1.35, 0.84, 0.07, plasticMat(0x222222))
  bezel.position.set(0, 1.46, -0.22)

  // Screen (glowing)
  const screen = new THREE.Mesh(
    new THREE.PlaneGeometry(1.22, 0.72),
    new THREE.MeshStandardMaterial({ color: 0x1a2a4a, emissive: 0x3355aa, emissiveIntensity: 0.5, roughness: 0.2 })
  )
  screen.position.set(0, 1.46, -0.18)
  g.add(screen)

  // Keyboard
  const kbd = box(0.85, 0.025, 0.3, plasticMat(0xddddcc))
  kbd.position.set(0, 0.86, 0.2)

  // Mouse
  const mouse = box(0.09, 0.025, 0.13, plasticMat(0xccccbb))
  mouse.position.set(0.56, 0.86, 0.18)

  // Desk organiser cup
  const cup = shadow(new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.06, 0.18, 10), plasticMat(0x4466aa)))
  cup.position.set(-0.85, 0.94, -0.05)

  // Mug
  const mug = shadow(new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.05, 0.12, 10), plasticMat(0xeeddcc)))
  mug.position.set(0.82, 0.9, -0.1)

  // Small plant
  const pot = shadow(new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.055, 0.1, 8), plasticMat(0x886644)))
  pot.position.set(-0.6, 0.9, 0.3)
  const plant = shadow(new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), new THREE.MeshStandardMaterial({ color: 0x3a8040, roughness: 0.9 })))
  plant.position.set(-0.6, 1.02, 0.3)

  g.add(top, panel, standBase, neck, bezel, kbd, mouse, cup, mug, pot, plant)
  g.position.set(0, 0, -2)
  scene.add(g)
  return { mesh: g, key: 'experience', position: new THREE.Vector3(0, 1.2, -2), label: 'Experience' }
}

// ── BOOKSHELF (Skills) ────────────────────────────────────────────────────────
function makeBookshelf(scene) {
  const g = new THREE.Group()

  const shelfWood = woodMat(0x6b3a1f)

  // Side panels
  ;[-1.05, 1.05].forEach(x => {
    const side = box(0.06, 3.4, 0.36, woodMat(0x5a3015))
    side.position.set(x, 1.7, 0)
    g.add(side)
  })

  // Back panel
  const back = box(2.04, 3.4, 0.03, woodMat(0x5a3015))
  back.position.set(0, 1.7, -0.165)
  g.add(back)

  // Top + bottom panels
  ;[3.38, 0.03].forEach(y => {
    const panel = box(2.16, 0.06, 0.36, shelfWood)
    panel.position.y = y
    g.add(panel)
  })

  // Shelves
  const shelfYs = [0.85, 1.65, 2.45]
  shelfYs.forEach(y => {
    const shelf = box(2.04, 0.05, 0.36, shelfWood)
    shelf.position.y = y
    g.add(shelf)
  })

  // Books — varied heights, realistic colors
  const bookData = [
    [0x2244aa, 0.13], [0xaa3322, 0.14], [0x226633, 0.12], [0x885522, 0.15],
    [0x334488, 0.13], [0x663344, 0.14], [0xaa8822, 0.11], [0x225544, 0.15],
    [0x882244, 0.12], [0x446622, 0.14], [0x223366, 0.13], [0x994422, 0.14],
    [0x228866, 0.12], [0x664488, 0.15], [0x886633, 0.13],
  ]
  const shelfBottoms = [0.88, 1.68, 2.48]
  shelfBottoms.forEach((baseY, si) => {
    let x = -0.9
    let bi = si * 5
    while (x < 0.88 && bi < bookData.length) {
      const [color, w] = bookData[bi]
      const h = 0.42 + Math.random() * 0.28
      const book = shadow(new THREE.Mesh(
        new THREE.BoxGeometry(w, h, 0.26),
        new THREE.MeshStandardMaterial({ color, roughness: 0.85 })
      ))
      book.position.set(x + w / 2, baseY + h / 2, 0)
      g.add(book)
      x += w + 0.01
      bi++
    }
  })

  // Small decorative items on top shelf
  const plant2 = shadow(new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 8), new THREE.MeshStandardMaterial({ color: 0x2a6030, roughness: 0.9 })))
  plant2.position.set(0.7, 3.56, 0.04)
  const pot2 = shadow(new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.045, 0.1, 8), plasticMat(0x8b6040)))
  pot2.position.set(0.7, 3.46, 0.04)
  g.add(plant2, pot2)

  g.position.set(-5, 0, -5)
  scene.add(g)
  return { mesh: g, key: 'skills', position: new THREE.Vector3(-5, 1.5, -5), label: 'Skills' }
}

// ── WHITEBOARD (Projects) ─────────────────────────────────────────────────────
function makeWhiteboard(scene) {
  const g = new THREE.Group()

  // Wall mount bracket
  const bracket = box(2.9, 0.08, 0.12, metalMat(0x999999))
  bracket.position.set(0, -1.0, 0.06)

  // Frame
  const frame = box(2.9, 2.0, 0.06, metalMat(0x888888))

  // White board surface
  const board = new THREE.Mesh(
    new THREE.PlaneGeometry(2.72, 1.82),
    new THREE.MeshStandardMaterial({ color: 0xfafaf8, roughness: 0.9, metalness: 0 })
  )
  board.position.z = 0.04

  // Marker tray
  const tray = box(2.7, 0.06, 0.12, metalMat(0x999999))
  tray.position.set(0, -0.95, 0.06)

  // Markers on tray
  ;[[-0.5, 0x2244cc], [0, 0x222222], [0.5, 0xcc2222]].forEach(([x, color]) => {
    const marker = shadow(new THREE.Mesh(
      new THREE.CylinderGeometry(0.018, 0.018, 0.22, 8),
      new THREE.MeshStandardMaterial({ color, roughness: 0.5 })
    ))
    marker.rotation.z = Math.PI / 2
    marker.position.set(x, -0.94, 0.12)
    g.add(marker)
  })

  // Writing on board (horizontal lines like text)
  const inkMat = new THREE.MeshBasicMaterial({ color: 0x334488 })
  ;[0.5, 0.2, -0.1, -0.4].forEach((y, i) => {
    const line = new THREE.Mesh(new THREE.PlaneGeometry(0.6 + (i % 2) * 0.4, 0.025), inkMat)
    line.position.set(-0.5 + (i % 3) * 0.3, y, 0.042)
    g.add(line)
  })
  // Diagram circle
  const circle = new THREE.Mesh(
    new THREE.RingGeometry(0.18, 0.21, 16),
    new THREE.MeshBasicMaterial({ color: 0x2266cc, side: THREE.DoubleSide })
  )
  circle.position.set(0.7, 0.35, 0.042)
  g.add(circle)

  g.add(frame, board, tray, bracket)
  g.position.set(0, 2.8, -6.92)
  scene.add(g)
  return { mesh: g, key: 'projects', position: new THREE.Vector3(0, 2.8, -6.9), label: 'Projects' }
}

// ── DIPLOMAS (Education) ──────────────────────────────────────────────────────
function makeDiplomas(scene) {
  const g = new THREE.Group()

  ;[
    { x: -0.72, title: 'SCU' },
    { x: 0.72, title: 'VIT' },
  ].forEach(({ x }) => {
    // Gold frame
    const frame = box(1.1, 0.88, 0.04, new THREE.MeshStandardMaterial({ color: 0xc8a020, roughness: 0.4, metalness: 0.7 }))
    frame.position.set(x, 0, 0)

    // Parchment inside
    const parchment = new THREE.Mesh(
      new THREE.PlaneGeometry(0.96, 0.74),
      new THREE.MeshStandardMaterial({ color: 0xf5eec8, roughness: 0.95 })
    )
    parchment.position.set(x, 0, 0.03)

    // Horizontal text lines on parchment
    const textMat = new THREE.MeshBasicMaterial({ color: 0x333322 })
    ;[0.18, 0.04, -0.1].forEach(ly => {
      const line = new THREE.Mesh(new THREE.PlaneGeometry(0.55 - Math.abs(ly) * 0.5, 0.02), textMat)
      line.position.set(x, ly, 0.031)
      g.add(line)
    })

    // Seal
    const seal = shadow(new THREE.Mesh(
      new THREE.CircleGeometry(0.09, 16),
      new THREE.MeshStandardMaterial({ color: 0xdd4422, roughness: 0.6, metalness: 0.3 })
    ))
    seal.position.set(x, -0.23, 0.031)

    g.add(frame, parchment, seal)
  })

  // Wall nail/mount points
  ;[-0.72, 0.72].forEach(x => {
    const nail = shadow(new THREE.Mesh(
      new THREE.SphereGeometry(0.015, 6, 6),
      metalMat(0x888888)
    ))
    nail.position.set(x, 0.47, 0.04)
    g.add(nail)
  })

  g.position.set(5, 2.5, -6.65)
  scene.add(g)
  return { mesh: g, key: 'education', position: new THREE.Vector3(5, 2.5, -6.65), label: 'Education' }
}

// ── TROPHY (Impact) ───────────────────────────────────────────────────────────
function makeTrophy(scene) {
  const g = new THREE.Group()

  // Wooden plinth
  const plinth = box(0.5, 0.06, 0.5, woodMat(0x7a4a20))
  plinth.position.y = 0.03

  // Marble base
  const base = box(0.38, 0.08, 0.38, new THREE.MeshStandardMaterial({ color: 0xe8e0d8, roughness: 0.4, metalness: 0.1 }))
  base.position.y = 0.1

  // Stem
  const stem = shadow(new THREE.Mesh(
    new THREE.CylinderGeometry(0.04, 0.07, 0.28, 10),
    metalMat(0xd4aa30)
  ))
  stem.position.y = 0.28

  // Cup
  const cup = shadow(new THREE.Mesh(
    new THREE.CylinderGeometry(0.2, 0.08, 0.42, 14),
    new THREE.MeshStandardMaterial({ color: 0xd4a820, roughness: 0.25, metalness: 0.85 })
  ))
  cup.position.y = 0.58

  // Rim
  const rim = shadow(new THREE.Mesh(
    new THREE.TorusGeometry(0.2, 0.025, 8, 18),
    new THREE.MeshStandardMaterial({ color: 0xe8c030, roughness: 0.2, metalness: 0.9 })
  ))
  rim.rotation.x = Math.PI / 2
  rim.position.y = 0.79

  // Handles
  ;[-1, 1].forEach(side => {
    const handle = shadow(new THREE.Mesh(
      new THREE.TorusGeometry(0.09, 0.022, 6, 10, Math.PI),
      new THREE.MeshStandardMaterial({ color: 0xd4a820, roughness: 0.25, metalness: 0.85 })
    ))
    handle.rotation.z = Math.PI / 2
    handle.rotation.y = side > 0 ? 0 : Math.PI
    handle.position.set(side * 0.28, 0.58, 0)
    g.add(handle)
  })

  // Engraving plate on plinth
  const plate = shadow(new THREE.Mesh(
    new THREE.BoxGeometry(0.28, 0.07, 0.02),
    new THREE.MeshStandardMaterial({ color: 0xd4aa30, roughness: 0.3, metalness: 0.7 })
  ))
  plate.position.set(0, 0.11, 0.2)
  g.add(plate)

  g.add(plinth, base, stem, cup, rim)
  g.position.set(5, 0.8, 4)
  scene.add(g)
  return { mesh: g, key: 'impact', position: new THREE.Vector3(5, 1.0, 4), label: 'Impact' }
}

// ── PHONE ON DESK (Contact) ───────────────────────────────────────────────────
function makePhone(scene) {
  const g = new THREE.Group()

  // Small side table / pedestal
  const tableTop = box(0.65, 0.05, 0.45, woodMat(0xb89050))
  tableTop.position.y = 0
  ;[[-0.27, -0.17], [0.27, -0.17], [-0.27, 0.17], [0.27, 0.17]].forEach(([x, z]) => {
    const leg = box(0.04, 0.55, 0.04, metalMat(0xaaaaaa))
    leg.position.set(x, -0.3, z)
    g.add(leg)
  })

  // Phone body — slim modern smartphone
  const body = shadow(new THREE.Mesh(
    new THREE.BoxGeometry(0.28, 0.58, 0.025),
    new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.15, metalness: 0.9 })
  ))
  body.position.set(0, 0.32, 0)
  body.rotation.x = -0.15

  // Screen
  const phoneScreen = new THREE.Mesh(
    new THREE.PlaneGeometry(0.24, 0.52),
    new THREE.MeshStandardMaterial({ color: 0x1a1a2a, emissive: 0x4488ff, emissiveIntensity: 0.3, roughness: 0.1 })
  )
  phoneScreen.position.set(0, 0.32, 0.014)
  phoneScreen.rotation.x = -0.15

  // Camera bump
  const cam = shadow(new THREE.Mesh(
    new THREE.CylinderGeometry(0.022, 0.022, 0.015, 10),
    metalMat(0x333333)
  ))
  cam.rotation.x = Math.PI / 2 - 0.15
  cam.position.set(0.07, 0.56, -0.006)

  // Charging cable
  const cable = new THREE.Mesh(
    new THREE.CylinderGeometry(0.006, 0.006, 0.3, 6),
    new THREE.MeshStandardMaterial({ color: 0x444444, roughness: 0.8 })
  )
  cable.rotation.z = Math.PI / 2
  cable.position.set(-0.22, 0.04, -0.01)

  g.add(tableTop, body, phoneScreen, cam, cable)
  g.position.set(0, 0.83, 4.5)
  scene.add(g)
  return { mesh: g, key: 'contact', position: new THREE.Vector3(0, 1.1, 4.5), label: 'Contact' }
}

export function createObjects(scene) {
  return [makeDesk(scene), makeBookshelf(scene), makeWhiteboard(scene),
          makeDiplomas(scene), makeTrophy(scene), makePhone(scene)]
}

export function checkProximity(charPos, objects) {
  for (const obj of objects) {
    if (charPos.distanceTo(obj.position) < PROXIMITY_RADIUS) return obj
  }
  return null
}
