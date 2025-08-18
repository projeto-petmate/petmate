import React, { useRef, useEffect } from 'react';
import { Canvas, useLoader, useThree } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from '@react-three/drei';
import './ColeiraModelo.css';

function Loader() {
  return (
    <div className="loader-modelo-3d">
      Carregando modelo 3D...
    </div>
  );
}

function CameraController({ posicao, fov }) {
  const { camera } = useThree();

  useEffect(() => {
    console.log('Atualizando câmera para:', posicao, 'FOV:', fov);
    camera.position.set(...posicao);
    camera.fov = fov;
    camera.updateProjectionMatrix();
  }, [camera, posicao, fov]);

  return null;
}

function Model({ coleira }) {

  const getModeloArquivo = (modelo) => {
    switch (modelo) {
      case 'pescoco':
        return 'pescoco';
      case 'cabresto':
        return 'cabresto';
      case 'peitoral':
        return 'peitoral'; 
      default:
        return 'pescoco'; 
    }
  };

  const modeloArquivo = getModeloArquivo(coleira.modelo || 'pescoco');
  const gltf = useLoader(GLTFLoader, `/models/${modeloArquivo}.glb`,
    undefined,
    (xhr) => {
      console.log((xhr.loaded / xhr.total * 100) + '% carregado');
    },
    (error) => {
      console.error('Erro ao carregar o modelo:', error);
    }
  );

  const modelRef = useRef();

  useEffect(() => {
    if (gltf && gltf.scene) {
      console.log('Aplicando personalizações:', coleira);

      gltf.scene.traverse((child) => {
        if (child.isMesh) {
          // Aplicar cor do tecido (com cor padrão quando resetado)
          if (child.name === 'tecido') {
            const coresTecido = {
              'Preto': '#484848',
              'Branco': '#F5F5F5',
              'Bege': '#D2B48C',
              'Azul': '#48CBE0',
              'Vermelho': '#A52A2A',
              'Amarelo': '#E8DD1C'
            };
            // Se corTecido está vazio ou não definido, usa cor padrão
            const corTecido = coleira.corTecido && coleira.corTecido !== '' ?
              coresTecido[coleira.corTecido] : '#C0C0C0'; // Cor padrão
            child.material.color.set(corTecido);
          }

          // Aplicar cor da argola/medalha (com cor padrão quando resetado)
          if (child.name === 'argola') {
            const coresArgola = {
              'Dourado': '#FFD700',
              'Prata': '#C0C0C0',
              'Bronze': '#cd7f32'
            };
            // Se corArgola está vazio ou não definido, usa cor padrão
            const corArgola = coleira.corArgola && coleira.corArgola !== '' ?
              coresArgola[coleira.corArgola] : '#C0C0C0'; // Cor padrão
            child.material.color.set(corArgola);
          }

          // Aplicar cor da presilha (com cor padrão quando resetado)
          if (child.name === 'presilha' || child.name === 'presilha2') {
            const coresPresilha = {
              'Preto': '#484848',
              'Branco': '#FFFFFF',
              'Bege': '#D2B48C',
              'Azul': '#48CBE0',
              'Vermelho': '#A52A2A',
              'Amarelo': '#f5d442',
            };
            // Se corPresilha está vazio ou não definido, usa cor padrão
            const corPresilha = coleira.corPresilha && coleira.corPresilha !== '' ?
              coresPresilha[coleira.corPresilha] : '#888888'; // Cor padrão
            child.material.color.set(corPresilha);
          }

          // Aplicar cor da logo (com cor padrão quando resetado)
          if (child.name === 'Objeto') {
            const coresLogo = {
              'Preto': '#484848',
              'Branco': '#FFFFFF',
              'Bege': '#D2B48C',
            };
            const corLogo = coleira.corLogo && coleira.corLogo !== '' ?
              coresLogo[coleira.corLogo] : '#888888';
            child.material.color.set(corLogo);
          }



        }
      });
    }
  }, [gltf, coleira.corTecido, coleira.corArgola, coleira.corPresilha, coleira.corLogo,]);

  return <primitive ref={modelRef} object={gltf.scene} scale={2.2} position={[0, 0, 0]} />;
}

function ModeloTemporario({ coleira }) {
  const meshRef = useRef();
  const argolaRef = useRef();
  const presilhaRef = useRef();
  const logoRef = useRef();



  return (
    <group>
      {/* Corpo da coleira */}
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <torusGeometry args={[1.5, 0.3, 8, 20]} />
        <meshStandardMaterial color="#BDA795" />
      </mesh>

      {/* Argola/Medalha */}
      <mesh ref={argolaRef} position={[0, -2, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.1, 8]} />
        <meshStandardMaterial color="#C0C0C0" />
      </mesh>

      {/* Presilha */}
      <mesh ref={presilhaRef} position={[0, 1, 0]}>
        <boxGeometry args={[0.5, 0.3, 0.2]} />
        <meshStandardMaterial color="#888888" />
      </mesh>

      {/* Logo */}
      <mesh ref={logoRef} position={[0, 1, 0]}>
        <boxGeometry args={[0.5, 0.3, 0.2]} />
        <meshStandardMaterial color="#888888" />
      </mesh>

    </group>
  );
}

function ColeiraModelo({ coleira = {} }) {
  console.log('ColeiraModelo recebendo coleira:', coleira);

  const getModeloArquivo = (modelo) => {
    switch (modelo) {
      case 'pescoco':
        return 'pescoco';
      case 'cabresto':
        return 'cabresto';
      case 'peitoral':
        return 'peitoral';
      default:
        return 'pescoco';
    }
  };

  const getPosicaoCamera = (modelo) => {
    console.log('getPosicaoCamera recebeu:', modelo); 
    switch (modelo) {
      case 'pescoco':
        return [12, 3, 5];
      case 'cabresto':
        return [0, 7, -25];
      case 'peitoral':
        return [10, 5, 10];
      default:
        return [12, 3, 5];
    }
  };

  const getFovCamera = (modelo) => {
    console.log('getFovCamera recebeu:', modelo); 
    switch (modelo) {
      case 'pescoco':
        return 45;
      case 'cabresto':
        return 25;
      case 'peitoral':
        return 40;
      default:
        return 45;
    }
  };

  const getPosicaoLuzes = (modelo) => {
    console.log('getPosicaoLuzes recebeu:', modelo); 
    switch (modelo) {
      case 'pescoco':
        return [-70, -10, 5];
      case 'cabresto':
        return [-15, -10, -30];
      case 'peitoral':
        return [-8, -5, 8];
      default:
        return [-5, -2, 5];
    }
  };

   const modeloAtual = coleira.modelo || 'pescoco';
  console.log('Modelo atual:', modeloAtual); 

  const posicaoCamera = getPosicaoCamera(modeloAtual);
  const fovCamera = getFovCamera(modeloAtual);
  const posicaoLuzes = getPosicaoLuzes(modeloAtual);
  const modeloArquivo = getModeloArquivo(modeloAtual);

   console.log('Configurações aplicadas:', { 
    modelo: modeloAtual,
    posicaoCamera,
    fovCamera,
    posicaoLuzes,
    modeloArquivo
  });
  return (
    <div className="container-modelo-3d-fixo">
      <Canvas
        camera={{
           position: [0, 0, 10],
           fov: 45 
        }}
        className="canvas-coleira"
      >
        {/* Controlador da câmera */}
        <CameraController posicao={posicaoCamera} fov={fovCamera} />
        
        <ambientLight intensity={0.7} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <pointLight position={posicaoLuzes} intensity={0.7} />
        <directionalLight position={[0, 5, 5]} intensity={1} />

        <React.Suspense key={modeloArquivo} fallback={<ModeloTemporario coleira={coleira} />}>
          <Model coleira={coleira} />
        </React.Suspense>

        <OrbitControls
          enableZoom={true}
          maxPolarAngle={Math.PI / 1.5}
          minPolarAngle={Math.PI / 6}
          maxDistance={5}
          minDistance={3}
        />
      </Canvas>
    </div>
  );
}

export default ColeiraModelo;