import * as THREE from 'three'

const PROXIMITY_RADIUS = 2.5

// ── Material helpers ──────────────────────────────────────────────────────────
function woodMat(color = 0x2a1a0c) {
  return new THREE.MeshStandardMaterial({ color, roughness: 0.72, metalness: 0.05 })
}
function metalMat(color = 0x444444) {
  return new THREE.MeshStandardMaterial({ color, roughness: 0.28, metalness: 0.88 })
}
function plasticMat(color = 0x1a1a1a) {
  return new THREE.MeshStandardMaterial({ color, roughness: 0.55, metalness: 0.08 })
}
function fabricMat(color = 0x1e1e24) {
  return new THREE.MeshStandardMaterial({ color, roughness: 0.95, metalness: 0 })
}

function shadow(mesh) { mesh.castShadow = true; mesh.receiveShadow = true; return mesh }
function box(w, h, d, mat) { return shadow(new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat)) }

// ── DESK + MONITOR (Experience) ───────────────────────────────────────────────
function makeDesk(scene) {
  const g = new THREE.Group()

  // Desk surface — dark walnut
  const top = box(2.4, 0.07, 1.1, woodMat(0x2a1a0c))
  top.position.y = 0.82

  // Front modesty panel
  const panel = box(2.3, 0.65, 0.04, woodMat(0x1e120a))
  panel.position.set(0, 0.48, 0.53)

  // Side panels
  ;[-1.16, 1.16].forEach(x => {
    const side = box(0.04, 0.72, 1.1, woodMat(0x1e120a))
    side.position.set(x, 0.48, 0)
    g.add(side)
  })

  // Hairpin legs — matte black
  ;[[-1.0, -0.42], [1.0, -0.42], [-1.0, 0.42], [1.0, 0.42]].forEach(([x, z]) => {
    const leg = box(0.042, 0.8, 0.042, metalMat(0x1a1a1a))
    leg.position.set(x, 0.4, z)
    g.add(leg)
  })

  // Monitor stand base
  const standBase = box(0.38, 0.03, 0.28, metalMat(0x2a2a2a))
  standBase.position.set(0, 0.87, -0.22)

  // Monitor neck
  const neck = box(0.055, 0.3, 0.055, metalMat(0x2a2a2a))
  neck.position.set(0, 1.02, -0.24)

  // Monitor bezel — near black
  const bezel = box(1.32, 0.82, 0.07, plasticMat(0x080808))
  bezel.position.set(0, 1.43, -0.24)

  // Screen glow
  const screen = new THREE.Mesh(
    new THREE.PlaneGeometry(1.18, 0.68),
    new THREE.MeshStandardMaterial({ color: 0x0a1520, emissive: 0x1e3a6a, emissiveIntensity: 0.7, roughness: 0.08 })
  )
  screen.position.set(0, 1.43, -0.20)
  g.add(screen)

  // Keyboard
  const kbd = box(0.82, 0.022, 0.28, plasticMat(0x0e0e0e))
  kbd.position.set(0, 0.862, 0.18)

  // Mouse
  const mouse = box(0.085, 0.022, 0.12, plasticMat(0x0e0e0e))
  mouse.position.set(0.54, 0.862, 0.16)

  // Desk organiser cup
  const organiser = shadow(new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.15, 10), plasticMat(0x181820)))
  organiser.position.set(-0.82, 0.927, -0.05)

  // Mug
  const mug = shadow(new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.042, 0.1, 10), woodMat(0x2a1a0c)))
  mug.position.set(0.78, 0.892, -0.1)

  // Small desk plant
  const pot = shadow(new THREE.Mesh(new THREE.CylinderGeometry(0.058, 0.046, 0.088, 8), plasticMat(0x2a1a0a)))
  pot.position.set(-0.55, 0.882, 0.28)
  const plant = shadow(new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), new THREE.MeshStandardMaterial({ color: 0x1c4820, roughness: 0.9 })))
  plant.position.set(-0.55, 0.972, 0.28)

  // Notebook
  const notebook = box(0.25, 0.016, 0.19, new THREE.MeshStandardMaterial({ color: 0x121018, roughness: 0.9 }))
  notebook.position.set(-0.28, 0.863, 0.28)
  notebook.rotation.y = 0.28

  g.add(top, panel, standBase, neck, bezel, kbd, mouse, organiser, mug, pot, plant, notebook)
  g.position.set(0, 0, -2)
  scene.add(g)
  return { mesh: g, key: 'experience', position: new THREE.Vector3(0, 1.2, -2), label: 'Experience' }
}

// ── PHONE ON DESK (Contact) ───────────────────────────────────────────────────
function makePhone(scene) {
  const g = new THREE.Group()

  // Wireless charging pad
  const pad = box(0.34, 0.01, 0.22, plasticMat(0x0c0c0c))
  pad.position.y = 0.826

  // Phone body — slim dark metallic
  const body = shadow(new THREE.Mesh(
    new THREE.BoxGeometry(0.27, 0.55, 0.022),
    new THREE.MeshStandardMaterial({ color: 0x080808, roughness: 0.1, metalness: 0.96 })
  ))
  body.position.set(0, 0.838, 0)
  body.rotation.x = -0.1

  // Screen — blue glow
  const phoneScreen = new THREE.Mesh(
    new THREE.PlaneGeometry(0.23, 0.5),
    new THREE.MeshStandardMaterial({ color: 0x060c18, emissive: 0x2255ee, emissiveIntensity: 0.45, roughness: 0.06 })
  )
  phoneScreen.position.set(0, 0.839, 0.012)
  phoneScreen.rotation.x = -0.1

  // Camera bump
  const camModule = box(0.075, 0.055, 0.01, metalMat(0x181818))
  camModule.position.set(0.07, 0.862, -0.012)

  g.add(pad, body, phoneScreen, camModule)
  // Right side of desk surface, angled toward camera
  g.position.set(0.72, 0, -1.78)
  scene.add(g)
  return { mesh: g, key: 'contact', position: new THREE.Vector3(0.72, 1.0, -1.78), label: 'Contact' }
}

// ── OFFICE CHAIR (decorative) ─────────────────────────────────────────────────
function makeChair(scene) {
  const g = new THREE.Group()
  const fabric = fabricMat(0x14141c)
  const darkMetal = metalMat(0x151515)

  // Seat cushion
  const seat = box(0.62, 0.1, 0.6, fabric)
  seat.position.y = 0.52
  ;[-0.3, 0.3].forEach(x => {
    const side = box(0.038, 0.055, 0.6, darkMetal)
    side.position.set(x, 0.472, 0)
    g.add(side)
  })

  // Backrest
  const backrest = box(0.62, 0.72, 0.08, fabric)
  backrest.position.set(0, 1.0, -0.26)
  const lumbar = box(0.5, 0.2, 0.04, fabricMat(0x101018))
  lumbar.position.set(0, 0.78, -0.265)
  const backFrame = box(0.64, 0.76, 0.04, darkMetal)
  backFrame.position.set(0, 1.0, -0.3)

  // Headrest
  const headrest = box(0.42, 0.26, 0.08, fabric)
  headrest.position.set(0, 1.44, -0.26)

  // Armrests
  ;[-0.34, 0.34].forEach(x => {
    const post = box(0.038, 0.36, 0.038, darkMetal)
    post.position.set(x, 0.66, -0.04)
    const pad = box(0.11, 0.028, 0.28, plasticMat(0x1a1a1a))
    pad.position.set(x, 0.85, -0.02)
    g.add(post, pad)
  })

  // Gas cylinder
  const cyl = shadow(new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.038, 0.36, 10), metalMat(0x2a2a2a)))
  cyl.position.y = 0.22

  // 5-star base
  for (let i = 0; i < 5; i++) {
    const angle = (i / 5) * Math.PI * 2
    const spoke = shadow(new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.032, 0.05), darkMetal))
    spoke.position.set(Math.cos(angle) * 0.17, 0.04, Math.sin(angle) * 0.17)
    spoke.rotation.y = angle
    g.add(spoke)
    const wheel = shadow(new THREE.Mesh(new THREE.CylinderGeometry(0.034, 0.034, 0.042, 8), plasticMat(0x0e0e0e)))
    wheel.rotation.z = Math.PI / 2
    wheel.position.set(Math.cos(angle) * 0.36, 0.038, Math.sin(angle) * 0.36)
    g.add(wheel)
  }

  g.add(seat, backrest, lumbar, backFrame, headrest, cyl)
  g.position.set(0, 0, -0.55)
  g.rotation.y = Math.PI
  scene.add(g)
}

// ── BOOKSHELF (Skills) ────────────────────────────────────────────────────────
function makeBookshelf(scene) {
  const g = new THREE.Group()
  const shelfWood = woodMat(0x1e0e05)

  ;[-1.05, 1.05].forEach(x => {
    const side = box(0.06, 3.4, 0.36, woodMat(0x180b04))
    side.position.set(x, 1.7, 0)
    g.add(side)
  })

  const back = box(2.04, 3.4, 0.03, woodMat(0x100804))
  back.position.set(0, 1.7, -0.165)
  g.add(back)

  ;[3.38, 0.03].forEach(y => {
    g.add(box(2.16, 0.06, 0.36, shelfWood))
    g.children[g.children.length - 1].position.y = y
  })

  ;[0.85, 1.65, 2.45].forEach(y => {
    const shelf = box(2.04, 0.05, 0.36, shelfWood)
    shelf.position.y = y
    g.add(shelf)
  })

  // Books — muted dark hues
  const bookData = [
    [0x1a2a5a, 0.13], [0x5a1a12, 0.14], [0x1a3a22, 0.12], [0x4a2a10, 0.15],
    [0x1a2244, 0.13], [0x3a1a24, 0.14], [0x5a4a10, 0.11], [0x102a2c, 0.15],
    [0x481222, 0.12], [0x223318, 0.14], [0x102030, 0.13], [0x4a2210, 0.14],
    [0x104430, 0.12], [0x321444, 0.15], [0x443318, 0.13],
  ]
  ;[0.88, 1.68, 2.48].forEach((baseY, si) => {
    let x = -0.9
    let bi = si * 5
    while (x < 0.88 && bi < bookData.length) {
      const [color, w] = bookData[bi]
      const h = 0.38 + (bi % 4) * 0.07
      const book = shadow(new THREE.Mesh(
        new THREE.BoxGeometry(w, h, 0.26),
        new THREE.MeshStandardMaterial({ color, roughness: 0.88 })
      ))
      book.position.set(x + w / 2, baseY + h / 2, 0)
      g.add(book)
      x += w + 0.01
      bi++
    }
  })

  // Top shelf plant
  const pot2 = shadow(new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.04, 0.09, 8), plasticMat(0x2a1a0a)))
  pot2.position.set(0.7, 3.46, 0.04)
  const plant2 = shadow(new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 8), new THREE.MeshStandardMaterial({ color: 0x1a4020, roughness: 0.9 })))
  plant2.position.set(0.7, 3.56, 0.04)
  g.add(pot2, plant2)

  g.position.set(-5, 0, -5)
  scene.add(g)
  return { mesh: g, key: 'skills', position: new THREE.Vector3(-5, 1.5, -5), label: 'Skills' }
}

// ── WHITEBOARD (Projects) ─────────────────────────────────────────────────────
function makeWhiteboard(scene) {
  const g = new THREE.Group()

  const frame = box(2.9, 2.0, 0.06, metalMat(0x222222))
  const board = new THREE.Mesh(
    new THREE.PlaneGeometry(2.72, 1.82),
    new THREE.MeshStandardMaterial({ color: 0xeeeae4, roughness: 0.92 })
  )
  board.position.z = 0.04

  const tray = box(2.7, 0.06, 0.12, metalMat(0x2a2a2a))
  tray.position.set(0, -0.95, 0.06)
  const bracket = box(2.9, 0.08, 0.12, metalMat(0x222222))
  bracket.position.set(0, -1.0, 0.06)

  ;[[-0.5, 0x1a33aa], [0, 0x080808], [0.5, 0xaa1a1a]].forEach(([x, color]) => {
    const marker = shadow(new THREE.Mesh(
      new THREE.CylinderGeometry(0.018, 0.018, 0.22, 8),
      new THREE.MeshStandardMaterial({ color, roughness: 0.5 })
    ))
    marker.rotation.z = Math.PI / 2
    marker.position.set(x, -0.94, 0.12)
    g.add(marker)
  })

  const inkMat = new THREE.MeshBasicMaterial({ color: 0x1a2255 })
  ;[0.5, 0.2, -0.1, -0.4].forEach((y, i) => {
    const line = new THREE.Mesh(new THREE.PlaneGeometry(0.6 + (i % 2) * 0.4, 0.022), inkMat)
    line.position.set(-0.5 + (i % 3) * 0.3, y, 0.042)
    g.add(line)
  })
  const circle = new THREE.Mesh(
    new THREE.RingGeometry(0.18, 0.21, 16),
    new THREE.MeshBasicMaterial({ color: 0x1a44aa, side: THREE.DoubleSide })
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

  ;[{ x: -0.72 }, { x: 0.72 }].forEach(({ x }) => {
    const frame = box(1.1, 0.88, 0.04, new THREE.MeshStandardMaterial({ color: 0x7a5a08, roughness: 0.32, metalness: 0.78 }))
    frame.position.set(x, 0, 0)

    const parchment = new THREE.Mesh(
      new THREE.PlaneGeometry(0.96, 0.74),
      new THREE.MeshStandardMaterial({ color: 0xede4b8, roughness: 0.95 })
    )
    parchment.position.set(x, 0, 0.03)

    const textMat = new THREE.MeshBasicMaterial({ color: 0x1e1a0a })
    ;[0.18, 0.04, -0.1].forEach(ly => {
      const line = new THREE.Mesh(new THREE.PlaneGeometry(0.55 - Math.abs(ly) * 0.5, 0.018), textMat)
      line.position.set(x, ly, 0.031)
      g.add(line)
    })

    const seal = shadow(new THREE.Mesh(
      new THREE.CircleGeometry(0.09, 16),
      new THREE.MeshStandardMaterial({ color: 0x991a00, roughness: 0.52, metalness: 0.38 })
    ))
    seal.position.set(x, -0.23, 0.031)

    g.add(frame, parchment, seal)
  })

  ;[-0.72, 0.72].forEach(x => {
    const nail = shadow(new THREE.Mesh(new THREE.SphereGeometry(0.014, 6, 6), metalMat(0x555555)))
    nail.position.set(x, 0.47, 0.04)
    g.add(nail)
  })

  g.position.set(5, 2.5, -6.65)
  scene.add(g)
  return { mesh: g, key: 'education', position: new THREE.Vector3(5, 2.5, -6.65), label: 'Education' }
}

// ── TROPHY CABINET (Impact) ────────────────────────────────────────────────────
function makeTrophyCabinet(scene) {
  const g = new THREE.Group()
  const cabinetWood = woodMat(0x1a0c05)
  const darkMetal = metalMat(0x1e1e1e)

  // Cabinet body
  const cabinetBack = box(1.6, 2.4, 0.04, woodMat(0x110804))
  cabinetBack.position.set(0, 1.2, -0.32)

  ;[-0.78, 0.78].forEach(x => {
    const side = box(0.04, 2.4, 0.64, cabinetWood)
    side.position.set(x, 1.2, 0)
    g.add(side)
  })

  const topPanel = box(1.64, 0.06, 0.68, cabinetWood)
  topPanel.position.set(0, 2.43, 0)
  const bottomPanel = box(1.64, 0.06, 0.68, cabinetWood)
  bottomPanel.position.set(0, 0.03, 0)
  const basePanel = box(1.8, 0.1, 0.82, woodMat(0x0e0804))
  basePanel.position.set(0, 0.05, 0.06)

  // Interior shelves
  ;[0.78, 1.54].forEach(y => {
    const shelf = box(1.52, 0.04, 0.6, cabinetWood)
    shelf.position.set(0, y, 0)
    g.add(shelf)
  })

  // Glass front doors
  ;[-0.39, 0.39].forEach(x => {
    const glass = new THREE.Mesh(
      new THREE.BoxGeometry(0.74, 2.32, 0.022),
      new THREE.MeshStandardMaterial({ color: 0x88aacc, roughness: 0.04, metalness: 0.05, transparent: true, opacity: 0.2 })
    )
    glass.position.set(x, 1.2, 0.32)
    const doorFrame = box(0.76, 2.34, 0.028, darkMetal)
    doorFrame.position.set(x, 1.2, 0.31)
    g.add(glass, doorFrame)
  })

  // Door handles
  ;[-0.06, 0.06].forEach(x => {
    const handle = shadow(new THREE.Mesh(new THREE.CylinderGeometry(0.011, 0.011, 0.09, 8), metalMat(0x887744)))
    handle.rotation.z = Math.PI / 2
    handle.position.set(x, 1.2, 0.345)
    g.add(handle)
  })

  // Bottom shelf — trophy
  const tStem = shadow(new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.038, 0.18, 8), metalMat(0xaa7a1a)))
  tStem.position.set(-0.28, 0.94, 0)
  const tCup = shadow(new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.04, 0.22, 10), new THREE.MeshStandardMaterial({ color: 0xcc9900, roughness: 0.18, metalness: 0.9 })))
  tCup.position.set(-0.28, 1.14, 0)
  const tRim = shadow(new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.014, 6, 12), metalMat(0xdd9900)))
  tRim.rotation.x = Math.PI / 2
  tRim.position.set(-0.28, 1.26, 0)

  // Plaque
  const plaque = box(0.27, 0.18, 0.028, new THREE.MeshStandardMaterial({ color: 0x7a5808, roughness: 0.38, metalness: 0.65 }))
  plaque.position.set(0.28, 0.97, 0.05)

  // Middle shelf — framed award + medal
  const frame2 = box(0.28, 0.2, 0.028, new THREE.MeshStandardMaterial({ color: 0x888866, roughness: 0.38, metalness: 0.72 }))
  frame2.position.set(-0.26, 1.72, 0.05)
  const medal = shadow(new THREE.Mesh(new THREE.CylinderGeometry(0.072, 0.072, 0.014, 14), new THREE.MeshStandardMaterial({ color: 0xcc8800, roughness: 0.18, metalness: 0.92 })))
  medal.rotation.x = Math.PI / 2
  medal.position.set(0.3, 1.72, 0.05)

  g.add(cabinetBack, topPanel, bottomPanel, basePanel, tStem, tCup, tRim, plaque, frame2, medal)
  g.position.set(5.5, 0, 1.5)
  g.rotation.y = -Math.PI / 2
  scene.add(g)
  return { mesh: g, key: 'impact', position: new THREE.Vector3(5.5, 1.2, 1.5), label: 'Impact' }
}

// ── FLOOR LAMP (decorative) ───────────────────────────────────────────────────
function makeFloorLamp(scene) {
  const g = new THREE.Group()
  const pole = shadow(new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.024, 1.8, 8), metalMat(0x181818)))
  pole.position.y = 0.9
  const base = shadow(new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.22, 0.055, 12), metalMat(0x101010)))
  base.position.y = 0.028
  const shade = shadow(new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.17, 0.32, 12, 1, true), new THREE.MeshStandardMaterial({ color: 0x261808, roughness: 0.85, side: THREE.DoubleSide })))
  shade.position.y = 1.94
  const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.042, 8, 8), new THREE.MeshStandardMaterial({ color: 0xffddaa, emissive: 0xffcc88, emissiveIntensity: 1.8, roughness: 0.3 }))
  bulb.position.y = 1.8
  g.add(pole, base, shade, bulb)
  g.position.set(-5, 0, 1.5)
  scene.add(g)
}

// ── LARGE PLANT (decorative) ──────────────────────────────────────────────────
function makePlant(scene) {
  const g = new THREE.Group()
  const pot = shadow(new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.16, 0.38, 10), plasticMat(0x1e0e06)))
  pot.position.y = 0.19
  const soil = shadow(new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.025, 10), new THREE.MeshStandardMaterial({ color: 0x080604, roughness: 1 })))
  soil.position.y = 0.4
  ;[[0, 0.72, 0], [-0.14, 0.6, 0.1], [0.15, 0.62, -0.1], [0, 0.58, -0.14], [0.1, 0.78, 0.08]].forEach(([x, y, z], i) => {
    const leaf = shadow(new THREE.Mesh(new THREE.SphereGeometry(0.16 + (i % 3) * 0.04, 7, 7), new THREE.MeshStandardMaterial({ color: 0x163814, roughness: 0.92 })))
    leaf.position.set(x, y, z)
    g.add(leaf)
  })
  const stem = shadow(new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.024, 0.2, 6), woodMat(0x140e04)))
  stem.position.y = 0.52
  g.add(pot, soil, stem)
  g.position.set(-6.5, 0, 2.5)
  scene.add(g)
}

// ── SOFA (decorative) ─────────────────────────────────────────────────────────
function makeSofa(scene) {
  const g = new THREE.Group()
  const sof = fabricMat(0x181820)
  const dark = fabricMat(0x10101a)

  const seatBase = box(2.2, 0.2, 0.82, sof)
  seatBase.position.y = 0.34
  ;[-0.7, 0, 0.7].forEach(x => {
    const cush = box(0.64, 0.11, 0.74, dark)
    cush.position.set(x, 0.5, 0.02)
    g.add(cush)
  })
  const back = box(2.2, 0.68, 0.18, sof)
  back.position.set(0, 0.74, -0.34)
  ;[-0.7, 0, 0.7].forEach(x => {
    const bcush = box(0.63, 0.56, 0.1, dark)
    bcush.position.set(x, 0.74, -0.28)
    g.add(bcush)
  })
  ;[-1.06, 1.06].forEach(x => {
    const arm = box(0.14, 0.62, 0.82, sof)
    arm.position.set(x, 0.37, 0)
    g.add(arm)
  })
  ;[[-0.96, -0.34], [0.96, -0.34], [-0.96, 0.34], [0.96, 0.34]].forEach(([x, z]) => {
    const leg = box(0.1, 0.09, 0.1, woodMat(0x0e0e08))
    leg.position.set(x, 0.045, z)
    g.add(leg)
  })
  g.add(seatBase, back)
  g.position.set(-4.5, 0, 2.5)
  g.rotation.y = Math.PI / 6
  scene.add(g)
}

export function createObjects(scene) {
  makeChair(scene)
  makeFloorLamp(scene)
  makePlant(scene)
  makeSofa(scene)
  return [
    makeDesk(scene),
    makeBookshelf(scene),
    makeWhiteboard(scene),
    makeDiplomas(scene),
    makeTrophyCabinet(scene),
    makePhone(scene),
  ]
}

export function checkProximity(charPos, objects) {
  for (const obj of objects) {
    if (charPos.distanceTo(obj.position) < PROXIMITY_RADIUS) return obj
  }
  return null
}
