import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle, useMemo } from 'react';
import { Canvas, useLoader, useThree } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from '@react-three/drei';
import './ColeiraModelo.css';


const CameraController = forwardRef(({ posicao, fov }, ref) => {
  const { camera } = useThree();
  const loader = new GLTFLoader();
  const modelos = ['pescoco', 'cabresto', 'peitoral'];

  modelos.forEach(modelo => {
    loader.load(`/models/${modelo}.glb`,
    );
  });

  useImperativeHandle(ref, () => ({
    resetCamera: () => {
      console.log('CameraController: Resetando câmera para posição:', posicao);
      camera.position.set(...posicao);
      camera.fov = fov;
      camera.updateProjectionMatrix();
      console.log('CameraController: Câmera resetada com sucesso');
    }
  }));

  useEffect(() => {
    camera.position.set(...posicao);
    camera.fov = fov;
    camera.updateProjectionMatrix();
  }, [camera, posicao, fov]);

  return null;
});

function Model({ coleira }) {
  const modelRef = useRef();

  const getModeloArquivo = (modelo) => {
    switch (modelo) {
      case 'Pescoço':
        return 'pescoco';
      case 'Cabresto':
        return 'cabresto';
      case 'Peitoral':
        return 'peitoral';
      default:
        return 'pescoco';
    }
  };

  const modeloArquivo = getModeloArquivo(coleira.modelo || 'Pescoço');
  const modelPath = `/models/${modeloArquivo}.glb`;

  const gltf = useLoader(GLTFLoader, modelPath);

  const sceneClone = useMemo(() => {
    if (gltf && gltf.scene) {
      return gltf.scene.clone();
    }
    return null;
  }, [gltf]);

  useEffect(() => {
    if (sceneClone) {
      sceneClone.traverse((child) => {
        if (child.isMesh) {
          if (child.name === 'tecido') {
            const coresTecido = {
              'Preto': '#484848',
              'Branco': '#F5F5F5',
              'Bege': '#D2B48C',
              // 'Marrom': '#6F4E37',
              'Azul': '#054F77',
              'Vermelho': '#A52A2A',
              'Amarelo': '#FFC222'
            };
            const corTecido = coleira.corTecido && coleira.corTecido !== '' ?
              coresTecido[coleira.corTecido] : '#C0C0C0';
            child.material.color.set(corTecido);
          }

          if (child.name === 'argola') {
            const coresArgola = {
              'Dourado': '#FFD700',
              'Prata': '#C0C0C0',
              'Bronze': '#cd7f32'
            };
            const corArgola = coleira.corArgola && coleira.corArgola !== '' ?
              coresArgola[coleira.corArgola] : '#C0C0C0';
            child.material.color.set(corArgola);
          }

          if (child.name === 'presilha' || child.name === 'presilha2') {
            const coresPresilha = {
              'Preto': '#484848',
              'Branco': '#FFFFFF',
              // 'Bege': '#D2B48C',
              'Marrom': '#6F4E37',
              'Azul': '#054F77',
              'Vermelho': '#A52A2A',
              'Amarelo': '#FFC222',
            };
            const corPresilha = coleira.corPresilha && coleira.corPresilha !== '' ?
              coresPresilha[coleira.corPresilha] : '#888888';
            child.material.color.set(corPresilha);
          }

          if (child.name === 'Objeto') {
            const coresLogo = {
              'Preto': '#484848',
              'Branco': '#FFFFFF',
              'Marrom': '#6F4E37',
              'Azul': '#054F77',
              'Vermelho': '#A52A2A',
              'Amarelo': '#FFC222',
            };
            const corLogo = coleira.corLogo && coleira.corLogo !== '' ?
              coresLogo[coleira.corLogo] : '#888888';
            child.material.color.set(corLogo);
          }



        }
      });
    }
  }, [sceneClone, coleira.corTecido, coleira.corArgola, coleira.corPresilha, coleira.corLogo]);

  if (!sceneClone) {
    return null;
  }

  return <primitive ref={modelRef} object={sceneClone} scale={2.2} position={[0, 0, 0]} />;
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

const ColeiraModelo = forwardRef(({ coleira = {} }, ref) => {
  const [isReady, setIsReady] = useState(false);
  const canvasRef = useRef();
  const cameraControllerRef = useRef();

  useImperativeHandle(ref, () => ({
    captureScreenshot: () => {
      if (canvasRef.current) {
        const canvas = canvasRef.current.querySelector('canvas');
        if (canvas) {
          // Capturar como data URL (base64)
          const dataURL = canvas.toDataURL('image/png', 1.0);
          return dataURL;
        }
      }
      return null;
    },
    captureScreenshotAsBlob: () => {
      return new Promise((resolve) => {
        if (canvasRef.current) {
          const canvas = canvasRef.current.querySelector('canvas');
          if (canvas) {
            canvas.toBlob((blob) => {
              resolve(blob);
            }, 'image/png', 1.0);
          } else {
            resolve(null);
          }
        } else {
          resolve(null);
        }
      });
    },
    captureWithFixedCamera: () => {
      return new Promise((resolve) => {
        console.log('ColeiraModelo: Iniciando captureWithFixedCamera');
        
        console.log('ColeiraModelo: Verificações:', {
          canvasRefExists: !!canvasRef.current,
          cameraControllerRefExists: !!cameraControllerRef.current,
          cameraControllerHasResetMethod: !!cameraControllerRef.current?.resetCamera
        });
        
        if (canvasRef.current && cameraControllerRef.current && cameraControllerRef.current.resetCamera) {
          console.log('ColeiraModelo: Canvas e camera controller encontrados');
          
          try {
            // Reseta a câmera para posição inicial
            cameraControllerRef.current.resetCamera();
            console.log('ColeiraModelo: Camera resetada');
            
            // Aguarda um frame para a câmera se posicionar
            setTimeout(() => {
              const canvas = canvasRef.current.querySelector('canvas');
              if (canvas) {
                console.log('ColeiraModelo: Canvas encontrado, capturando...', {
                  width: canvas.width,
                  height: canvas.height
                });
                
                try {
                  const dataURL = canvas.toDataURL('image/png', 1.0);
                  console.log('ColeiraModelo: DataURL gerado', {
                    length: dataURL.length,
                    starts: dataURL.substring(0, 50) + '...'
                  });
                  resolve(dataURL);
                } catch (error) {
                  console.error('ColeiraModelo: Erro ao gerar dataURL:', error);
                  resolve(null);
                }
              } else {
                console.error('ColeiraModelo: Canvas não encontrado no DOM');
                resolve(null);
              }
            }, 200); 
          } catch (cameraError) {
            console.error('ColeiraModelo: Erro ao resetar câmera:', cameraError);
            resolve(null);
          }
        } else {
          console.error('ColeiraModelo: Recursos não disponíveis:', {
            canvasRef: !!canvasRef.current,
            cameraControllerRef: !!cameraControllerRef.current,
            resetMethod: !!cameraControllerRef.current?.resetCamera
          });
          
          console.log('ColeiraModelo: Tentando captura sem reset de câmera...');
          if (canvasRef.current) {
            const canvas = canvasRef.current.querySelector('canvas');
            if (canvas) {
              try {
                const dataURL = canvas.toDataURL('image/png', 1.0);
                console.log('ColeiraModelo: Captura fallback bem-sucedida');
                resolve(dataURL);
              } catch (error) {
                console.error('ColeiraModelo: Erro na captura fallback:', error);
                resolve(null);
              }
            } else {
              resolve(null);
            }
          } else {
            resolve(null);
          }
        }
      });
    }
  }));



  useEffect(() => {
    console.log('ColeiraModelo montado com coleira:', coleira);
    setIsReady(true);

    return () => {
      console.log('ColeiraModelo desmontado');
      setIsReady(false);
    };
  }, []);

  const getModeloArquivo = (modelo) => {
    switch (modelo) {
      case 'Pescoço':
        return 'pescoco';
      case 'Cabresto':
        return 'cabresto';
      case 'Peitoral':
        return 'peitoral';
      default:
        return 'pescoco';
    }
  };

  const getPosicaoCamera = (modelo) => {
    switch (modelo) {
      case 'Pescoço':
        return [12, 3, 5];
      case 'Cabresto':
        return [0, 7, -25];
      case 'Peitoral':
        return [-12, 4, -8];
      default:
        return [12, 3, 5];
    }
  };

  const getFovCamera = (modelo) => {
    switch (modelo) {
      case 'Pescoço':
        return 43;
      case 'Cabresto':
        return 25;
      case 'Peitoral':
        return 30;
      default:
        return 45;
    }
  };

  const getPosicaoLuzes = (modelo) => {
    switch (modelo) {
      case 'Pescoço':
        return [-70, -10, 5];
      case 'Cabresto':
        return [-15, -10, -30];
      case 'Peitoral':
        return [-80, -120, 8];
      default:
        return [-5, -2, 5];
    }
  };

  const modeloAtual = coleira.modelo || 'pescoco';

  const posicaoCamera = getPosicaoCamera(modeloAtual);
  const fovCamera = getFovCamera(modeloAtual);
  const posicaoLuzes = getPosicaoLuzes(modeloAtual);

  if (!isReady) {
    return <div className="container-modelo-3d-fixo">Carregando modelo 3D...</div>;
  }
  
  return (
    <div className="container-modelo-3d-fixo" ref={canvasRef}>
      <Canvas
        camera={{
          position: [0, 0, 0],
          fov: 45
        }}
        className="canvas-coleira"
        gl={{ preserveDrawingBuffer: true }}
      >
        {/* Controlador da câmera */}
        <CameraController ref={cameraControllerRef} posicao={posicaoCamera} fov={fovCamera} />

        <ambientLight intensity={0.7} />
        <pointLight position={[1, 19, 1]} intensity={1.5} />
        <pointLight position={posicaoLuzes} intensity={1.5} />
        <directionalLight position={[8, 8, 8]} intensity={1.5} />

        <React.Suspense fallback={<ModeloTemporario coleira={coleira} />}>
          <Model coleira={coleira} />
        </React.Suspense>

        <OrbitControls
          enableZoom={true}
          maxPolarAngle={Math.PI / 1.5}
          minPolarAngle={Math.PI / 6}
          maxDistance={5}
          minDistance={5}
        />
      </Canvas>
    </div>
  );
})
  
export default ColeiraModelo;