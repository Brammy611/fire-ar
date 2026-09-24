import * as THREE from "three";

export function createFireMarker({
  priority = "HIGH",
  distance = "1.2 KM",
  direction = "↗ NE",
} = {}) {
  const group = new THREE.Group();

  // =========================================
  // FIRE ICON
  // =========================================

  const fireGeometry =
    new THREE.SphereGeometry(
      0.08,
      16,
      16
    );

  const fireMaterial =
    new THREE.MeshBasicMaterial({
      color: 0xff3300,
    });

  const fire = new THREE.Mesh(
    fireGeometry,
    fireMaterial
  );

  fire.position.y = 0.4;

  group.add(fire);

  // =========================================
  // VERTICAL LINE
  // =========================================

  const lineGeometry =
    new THREE.CylinderGeometry(
      0.005,
      0.005,
      0.4,
      8
    );

  const lineMaterial =
    new THREE.MeshBasicMaterial({
      color: 0xffffff,
    });

  const line = new THREE.Mesh(
    lineGeometry,
    lineMaterial
  );

  line.position.y = 0.2;

  group.add(line);

  // =========================================
  // INFORMATION PANEL
  // =========================================

  const canvas =
    document.createElement("canvas");

  canvas.width = 512;
  canvas.height = 256;

  const context =
    canvas.getContext("2d");

  context.fillStyle =
    "rgba(0, 0, 0, 0.85)";

  context.roundRect(
    10,
    10,
    492,
    236,
    25
  );

  context.fill();

  context.fillStyle =
    "#ffffff";

  context.font =
    "bold 40px Arial";

  context.fillText(
    priority,
    35,
    65
  );

  context.font =
    "32px Arial";

  context.fillText(
    distance,
    35,
    115
  );

  context.fillText(
    direction,
    35,
    165
  );

  context.font =
    "24px Arial";

  context.fillText(
    "FIRE ALERT",
    35,
    210
  );

  const texture =
    new THREE.CanvasTexture(canvas);

  texture.needsUpdate = true;

  const panelMaterial =
    new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      side: THREE.DoubleSide,
    });

  const panelGeometry =
    new THREE.PlaneGeometry(
      0.7,
      0.35
    );

  const panel = new THREE.Mesh(
    panelGeometry,
    panelMaterial
  );

  panel.position.set(
    0,
    0.65,
    0
  );

  group.add(panel);

  // =========================================
  // MAKE PANEL FACE CAMERA
  // =========================================

  group.userData.panel = panel;

  return group;
}