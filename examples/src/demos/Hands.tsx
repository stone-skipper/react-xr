import { Canvas, useLoader } from '@react-three/fiber'
import { Box, Environment, Plane, OrbitControls, Cylinder } from '@react-three/drei'
import { Hands, XR, VRButton, Controllers, Interactive, RayGrab } from '@react-three/xr'
import React, { ComponentProps } from 'react'
import { useSpring, animated } from '@react-spring/three'
import * as THREE from 'three' // Import THREE for constants

export function Button(props: ComponentProps<typeof Box>) {
  const [hover, setHover] = React.useState(false)
  const [color, setColor] = React.useState(0x123456)

  return (
    <Interactive
      onSelect={() => setColor((Math.random() * 0xffffff) | 0)}
      // onHover={() => setHover(true)}
      onBlur={() => setHover(false)}
    >
      <Box {...props} args={[0.4, 0.1, 0.1]} scale={hover ? 1.5 : 1}>
        <meshStandardMaterial color={color} />
      </Box>
    </Interactive>
  )
}

function getRandomInt(min = 0, max = 10) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min) + min) // The maximum is exclusive and the minimum is inclusive
}

const imageUrls = [
  '/images/cat.jpg',
  '/images/sky.jpg',
  '/images/latte.png'
  // ... add paths for all 10 images
]

export function Planes(props: ComponentProps<typeof Box>) {
  const textures = useLoader(THREE.TextureLoader, imageUrls)

  const [hover, setHover] = React.useState(false)
  const [color, setColor] = React.useState(0xffffff)
  const [gap, setGap] = React.useState(1)

  function InteractionCylinder(props: ComponentProps<typeof Cylinder>) {
    // to use as a way to detect grab interaction
    // const [hover, setHover] = React.useState(false)
    // const [color, setColor] = React.useState(0x123456)

    return (
      <Interactive
        onSelect={() => {
          setColor((Math.random() * 0xffffff) | 0)
          if (gap === 1) {
            setGap(0.4)
          } else {
            setGap(1)
          }
        }}
        onHover={() => setHover(true)}
        onBlur={() => setHover(false)}
      >
        <Cylinder {...props} args={[1.5, 1.5, 5, 32]} scale={hover ? 1.5 : 1}>
          <meshStandardMaterial wireframe={true} color={color} />
        </Cylinder>
      </Interactive>
    )
  }
  const planes = []
  const numberOfPlanes = 20
  const towardTop = 10
  const maxRadius = 8

  for (let j = 0; j < towardTop; j++) {
    for (let i = 0; i < numberOfPlanes; i++) {
      for (let k = 2; k < maxRadius; k++) {
        const angle = (i / numberOfPlanes) * Math.PI * 2 // Angle for each plane
        const extraRotation = k % 2 === 1 ? Math.PI / numberOfPlanes : 0 // Extra rotation for odd layers based on radius size k
        const x = Math.cos(angle + extraRotation) * k * gap // X position
        const z = Math.sin(angle + extraRotation) * k * gap // Z position (assuming Y is up/down)

        // Select a random texture for each plane
        const texture = textures[Math.floor(Math.random() * textures.length)]

        // Add the plane to the array with position and rotation
        planes.push(
          <Interactive>
            <Plane
              key={i}
              position={[x, j * 0.5, z]}
              rotation={[0, -angle + Math.PI / 2, 0]} // Adjust the rotation to face the center
              args={[getRandomInt(3, 5) * 0.1, getRandomInt(3, 5) * 0.1]} // Size of the plane
            >
              <meshStandardMaterial
                // @ts-ignore
                map={texture} // Apply the texture
                wireframe={false}
                transparent={true}
                opacity={1 - (1 / (maxRadius - 2)) * k} // Set the opacity to 0.5
                color={color}
                side={THREE.DoubleSide}
              />
            </Plane>
          </Interactive>
        )
      }
    }
  }
  return (
    <>
      {planes}
      <InteractionCylinder />
    </>
  )
}

export function Grab(props: ComponentProps<typeof Box>) {
  const [hover, setHover] = React.useState(false)
  const [color, setColor] = React.useState(0x123456)
  const [come, setCome] = React.useState(false)
  const springs = useSpring({ position: come === true ? [0, 0.8, 0.2] : [0, 0.8, -2] })

  React.useEffect(() => {}, [come])

  return (
    <Interactive>
      <RayGrab
        onSelectStart={() => {
          setCome(true)
        }}
        onSelect={() => {
          setCome(true)
        }}
        onSelectEnd={() => {
          setCome(false)
        }}
      >
        <Box {...props} args={[2, 2, 0.1]} position={[0, 0.8, -1]}>
          <meshStandardMaterial wireframe={true} />
        </Box>
      </RayGrab>
    </Interactive>
  )
}

export default function () {
  return (
    <>
      <VRButton onError={(e) => console.error(e)} />
      <Canvas>
        <XR>
          <Environment preset="forest" background blur={0.2} />

          <ambientLight intensity={0.5} />
          <pointLight position={[5, 5, 5]} />
          <Hands
          // modelLeft="/hand-left.gltf"
          // modelRight="/hand-right.gltf"
          />
          {/* <RayGrab>
            <Button position={[0.5, 0.8, 0]} />
          </RayGrab>
          <RayGrab>
            <Button position={[-0.5, 0.8, 0]} />
          </RayGrab> */}
          <Planes />
          <OrbitControls />
          <Controllers
            /** Optional material props to pass to controllers' ray indicators */
            rayMaterial={{ color: 'blue' }}
            /** Whether to hide controllers' rays on blur. Default is `false` */
            hideRaysOnBlur={false}
            /**
             * Optional environment map to apply to controller models.
             * Useful for make controllers look more realistic
             * if you don't want to apply an env map globally on a scene
             */
            // envMap={Texture}
            /**
             * Optional environment map intensity to apply to controller models.
             * Useful for tweaking the env map intensity if they look too bright or dark
             */
            envMapIntensity={1}
          />

          {/* <Grab /> */}
          {/* <Button position={[0, 0.8, -1]} /> */}
        </XR>
      </Canvas>
    </>
  )
}
