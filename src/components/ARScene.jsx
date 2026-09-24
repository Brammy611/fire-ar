import { useEffect, useRef } from "react";
import * as THREE from "three";
import { ARButton } from "three/addons/webxr/ARButton.js";
import { createFireMarker } from "./FireMarker";

export default function ARScene() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;

    // SCENE
    const scene = new THREE.Scene();

    // CAMERA
    const camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.01,
      100
    );

    // RENDER
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    // WEBXR
    renderer.xr.enabled = true;
    const arButton = ARButton.createButton(renderer, {
        requiredFeatures: ["hit-test"],
    });

    document.body.appendChild(arButton);
    container.appendChild(renderer.domElement);

    // RETICLE
    const reticle = new THREE.Mesh(
      new THREE.RingGeometry(0.05, 0.07, 32),
      new THREE.MeshBasicMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
      })
    );

    reticle.rotation.x = -Math.PI / 2;
    reticle.matrixAutoUpdate = false;
    reticle.visible = false;

    scene.add(reticle);

    // HIT TEST VARIABLES
    let hitTestSource = null;
    let hitTestSourceRequested = false;

    // FIRE MARKER
    let fireMarker = null;

    // AR SESSION START
    renderer.xr.addEventListener(
      "sessionstart",
      async () => {
        console.log("AR SESSION STARTED");

        const session = renderer.xr.getSession();

        if (!session) {
          console.error("XR session tidak ditemukan");
          return;
        }

        try {
          const viewerSpace =
            await session.requestReferenceSpace("viewer");

          hitTestSource =
            await session.requestHitTestSource({
              space: viewerSpace,
            });

          hitTestSourceRequested = true;

          console.log("Hit test source ready");
        } catch (error) {
          console.error(
            "❌ Failed to create hit test source:",
            error
          );
        }
      }
    );

    // AR SESSION END
    renderer.xr.addEventListener(
      "sessionend",
      () => {
        console.log("🛑 AR SESSION ENDED");

        hitTestSource = null;
        hitTestSourceRequested = false;

        reticle.visible = false;
      }
    );

    // TAP / SELECT
    const controller = renderer.xr.getController(0);

    controller.addEventListener(
      "select",
      () => {
        if (!reticle.visible) {
          console.log(
            "Tidak ada surface yang terdeteksi"
          );

          return;
        }

        console.log("🔥 Surface selected");

        // Hapus marker lama
        if (fireMarker) {
          scene.remove(fireMarker);
        }

        // Buat marker baru
        fireMarker = createFireMarker({
          priority: "HIGH",
          distance: "1.2 KM",
          direction: "↗ NE",
        });

        // Letakkan marker pada posisi reticle
        fireMarker.position.setFromMatrixPosition(
          reticle.matrix
        );

        scene.add(fireMarker);
      }
    );

    scene.add(controller);

    // TEST LIGHT
    const ambientLight = new THREE.HemisphereLight(
      0xffffff,
      0xbbbbff,
      1
    );

    scene.add(ambientLight);

    // RENDER LOOP
    renderer.setAnimationLoop(
      (time, frame) => {
        if (frame && hitTestSource) {
          const referenceSpace =
            renderer.xr.getReferenceSpace();

          const hitTestResults =
            frame.getHitTestResults(
              hitTestSource
            );

          if (hitTestResults.length > 0) {
            const hit = hitTestResults[0];

            const pose = hit.getPose(
              referenceSpace
            );

            if (pose) {
              reticle.visible = true;

              reticle.matrix.fromArray(
                pose.transform.matrix
              );
            }
          } else {
            reticle.visible = false;
          }
        }

        renderer.render(
          scene,
          camera
        );
      }
    );

    // RESIZE
    const handleResize = () => {
      camera.aspect =
        window.innerWidth /
        window.innerHeight;

      camera.updateProjectionMatrix();

      renderer.setSize(
        window.innerWidth,
        window.innerHeight
      );
    };

    window.addEventListener(
      "resize",
      handleResize
    );

    return () => {
      window.removeEventListener(
        "resize",
        handleResize
      );

      renderer.setAnimationLoop(null);

      if (hitTestSource) {
        hitTestSource.cancel();
      }

      arButton.remove();

      renderer.dispose();

      if (
        renderer.domElement &&
        container.contains(renderer.domElement)
      ) {
        container.removeChild(
          renderer.domElement
        );
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
    />
  );
}