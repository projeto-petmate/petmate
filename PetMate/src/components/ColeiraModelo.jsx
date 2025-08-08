import React, { useRef, useState } from 'react';
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

function Model({ tecidoColor, argolaColor, presilhaColor }) {
  const gltf = useLoader(GLTFLoader, '/models/coleira.glb', 
    undefined, 
    (xhr) => {
      console.log((xhr.loaded / xhr.total * 100) + '% carregado');
    },
    (error) => {
      console.error('Erro ao carregar o modelo:', error);
    }
  );
  React.useEffect(() => {
    if (gltf && gltf.scene) {
      gltf.scene.traverse((child) => {
        if (child.isMesh) {
          console.log('Mesh:', child.name, '| Material:', child.material?.name);
        }
        // Tecido
        if (child.isMesh && child.name === 'tecido') {
          child.material.color.set(tecidoColor);
        }
        // Argola
        if (child.isMesh && child.name === 'argola') {
          child.material.color.set(argolaColor);
        }
        // Presilha e Presilha2
        if (child.isMesh && (child.name === 'presilha' || child.name === 'presilha2')) {
          child.material.color.set(presilhaColor);
        }
      });
    }
  }, [gltf, tecidoColor, argolaColor, presilhaColor]);
  return <primitive object={gltf.scene} scale={2.2} position={[0, 0, 0]} />;
}

function ColeiraModelo() {
  // Tecido
  const [tecidoColor, setTecidoColor] = useState('#BDA795');
  const tecidoColors = [
    '#BDA795', // bege
    '#8B5E3C', // marrom
    '#D9CBA3', // amarelo claro
    '#A3BFD9', // azul claro
    '#D9A3A3', // rosa claro
    '#A3D9B1', // verde claro
  ];
  // Argola
  const [argolaColor, setArgolaColor] = useState('#FFFFFF');
  const argolaColors = [
    { name: 'Prata', value: '#C0C0C0' },
    { name: 'Ouro', value: '#FFD700' },
  ];
  // Presilha
  const [presilhaColor, setPresilhaColor] = useState('#C0C0C0');
  const presilhaColors = [
    { name: 'Prata', value: '#C0C0C0' },
    { name: 'Preto', value: '#222222' },
  ];
  return (
    <div style={{ width: '90%', height: '600px', background: '#BDA795', borderRadius: '16px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', margin: 'auto', marginTop: 24, boxShadow: '0 2px 16px #0002' }}>
      {/* Seletores de cor ao lado */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32, alignItems: 'center', justifyContent: 'center', marginRight: 32 }}>
        {/* Seletor de cor do tecido */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={{ fontWeight: 600, marginBottom: 6, color: '#654833' }}>Tecido</span>
          <div style={{ display: 'flex', gap: 10 }}>
            {tecidoColors.map((c) => (
              <button
                key={c}
                onClick={() => setTecidoColor(c)}
                style={{ width: 32, height: 32, borderRadius: '50%', border: c === tecidoColor ? '3px solid #333' : '2px solid #fff', background: c, cursor: 'pointer', outline: 'none', boxShadow: c === tecidoColor ? '0 0 0 2px #BDA795' : 'none', transition: 'border 0.2s, box-shadow 0.2s', }}
                aria-label={`Selecionar cor tecido ${c}`}
                title={`Tecido: ${c}`}
              />
            ))}
          </div>
        </div>
        {/* Seletor de cor da argola */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={{ fontWeight: 600, marginBottom: 6, color: '#654833' }}>Argola</span>
          <div style={{ display: 'flex', gap: 10 }}>
            {argolaColors.map((c) => (
              <button
                key={c.value}
                onClick={() => setArgolaColor(c.value)}
                style={{ width: 32, height: 32, borderRadius: '50%', border: c.value === argolaColor ? '3px solid #333' : '2px solid #fff', background: c.value, cursor: 'pointer', outline: 'none', boxShadow: c.value === argolaColor ? '0 0 0 2px #BDA795' : 'none', transition: 'border 0.2s, box-shadow 0.2s', }}
                aria-label={`Selecionar cor argola ${c.name}`}
                title={`Argola: ${c.name}`}
              />
            ))}
          </div>
        </div>
        {/* Seletor de cor da presilha */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={{ fontWeight: 600, marginBottom: 6, color: '#654833' }}>Presilha</span>
          <div style={{ display: 'flex', gap: 10 }}>
            {presilhaColors.map((c) => (
              <button
                key={c.value}
                onClick={() => setPresilhaColor(c.value)}
                style={{ width: 32, height: 32, borderRadius: '50%', border: c.value === presilhaColor ? '3px solid #333' : '2px solid #fff', background: c.value, cursor: 'pointer', outline: 'none', boxShadow: c.value === presilhaColor ? '0 0 0 2px #BDA795' : 'none', transition: 'border 0.2s, box-shadow 0.2s', }}
                aria-label={`Selecionar cor presilha ${c.name}`}
                title={`Presilha: ${c.name}`}
              />
            ))}
          </div>
        </div>
      </div>
      {/* Modelo 3D maior */}
      <div style={{ flex: 1, height: '90%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Canvas
          camera={{ position: [0, 2, 5], fov: 45 }}
          style={{ borderRadius: '16px', background: '#BDA795', width: '100%', height: '100%' }}
        >
          <ambientLight intensity={0.7} />
          <pointLight position={[10, 10, 10]} intensity={1.5} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          <directionalLight position={[0, 5, 5]} intensity={1} />
          <Model tecidoColor={tecidoColor} argolaColor={argolaColor} presilhaColor={presilhaColor} />
          <OrbitControls 
            enableZoom={true}
            maxPolarAngle={Math.PI / 1.5}
            minPolarAngle={Math.PI / 6}
            maxDistance={3}
            minDistance={3}
          />
        </Canvas>
      </div>
    </div>
  );
}

const ExportedComponent = ColeiraModelo;
export default ExportedComponent;