import { useEffect, useRef } from "react";
import * as THREE from "three";
import { ARButton } from "three/addons/webxr/ARButton.js";

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

    renderer.setSize(window.innerWidth, window.innerHeight);

    // WEBXR
    renderer.xr.enabled = true;
    const arButton = ARButton.createButton(renderer, {
        requiredFeatures: ["hit-test"],
    });
    document.body.appendChild(arButton);

    container.appendChild(renderer.domElement);

    // AE SESSION EVENT
    renderer.xr.addEventListener("sessionstart", () => {
      console.log("AR SESSION STARTED");
    });

    renderer.xr.addEventListener("sessionend", () => {
      console.log("AR SESSION ENDED");
    });

    container.appendChild(renderer.domElement);
    
    // OBJECT
    const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);

    const material = new THREE.MeshBasicMaterial({
      color: 0xff0000,
    });

    const cube = new THREE.Mesh(
      geometry,
      material
    );

    cube.position.set(0, 0, -1);

    scene.add(cube);

    // ANIMATION
    renderer.setAnimationLoop(() => {
      cube.rotation.y += 0.01;

      renderer.render(scene, camera);
    });

    return () => {
      renderer.setAnimationLoop(null);

      if (arButton) {
        arButton.remove();
      }

      if (renderer.domElement) {
        container.removeChild(renderer.domElement);
      }

      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100vw",
        height: "100vh",
      }}
    />
  );
}