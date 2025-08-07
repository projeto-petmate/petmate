import React, { useRef } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from '@react-three/drei';

function Loader() {
  return (
    <div style={{ 
      top: '50%', 
      left: '50%', 
      transform: 'translate(-50%, -50%)',
      color: '#666'
    }}>
      Carregando modelo 3D...
    </div>
  );
}

function Model() {
  console.log('Tentando carregar o modelo 3D...');
  const gltf = useLoader(GLTFLoader, '/models/coleira.glb', 
    undefined, 
    (xhr) => {
      console.log((xhr.loaded / xhr.total * 100) + '% carregado');
    },
    (error) => {
      console.error('Erro ao carregar o modelo:', error);
    }
  );
  console.log('Modelo 3D carregado:', gltf);
  return <primitive object={gltf.scene} scale={1.5} position={[0, 0, 0]} />;
}

function ColeiraModelo() {
  return (
    <div style={{ width: '50%', height: '500px', background: '#f5f5f5', borderRadius: '10px' }}>
      <Canvas
        camera={{ position: [0, 2, 5], fov: 45 }}
        style={{ borderRadius: '10px' }}
      >
        <ambientLight intensity={0.7} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <directionalLight position={[0, 5, 5]} intensity={1} />
        
        <Model />
        <OrbitControls 
          enableZoom={true}
          maxPolarAngle={Math.PI / 1.5}
          minPolarAngle={Math.PI / 6}
          maxDistance={2}
          minDistance={2}
        />
      </Canvas>
    </div>
  );
}

const ExportedComponent = ColeiraModelo;
export default ExportedComponent;