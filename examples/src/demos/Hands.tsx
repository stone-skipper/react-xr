import { Canvas, useLoader, useFrame } from '@react-three/fiber'
import { Box, Environment, Plane, OrbitControls, Cylinder } from '@react-three/drei'
import { Hands, XR, VRButton, Controllers, Interactive, RayGrab } from '@react-three/xr'
import React, { ComponentProps, useEffect, useRef } from 'react'
// import { useSpring, animated } from '@react-spring/three'
import * as THREE from 'three' // Import THREE for constants
import { useMotionValue, useMotionValueEvent, animate } from 'framer-motion'
export default function () {
  const [current, setCurrent] = React.useState(2)
  const currentNum = useMotionValue(current)
  const [pureNumber, setPureNumber] = React.useState(current)

  useMotionValueEvent(currentNum, 'change', (latest) => {
    console.log('currentNum changed to', latest)
    setPureNumber(latest)
  })

  useEffect(() => {
    animate(currentNum, current, { duration: 1 })

    // currentNum.set(current)
  }, [current])

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

  function Planes(props: ComponentProps<typeof Box>) {
    const textures = useLoader(THREE.TextureLoader, imageUrls)

    const [hover, setHover] = React.useState(false)
    const [color, setColor] = React.useState(0xffffff)
    const [gap, setGap] = React.useState(1)

    // function Grab(props: ComponentProps<typeof Box>) {
    //   const [hover, setHover] = React.useState(false)
    //   const [color, setColor] = React.useState(0x123456)
    //   const [come, setCome] = React.useState(false)
    //   const springs = useSpring({ position: come === true ? [0, 0.8, 0.2] : [0, 0.8, -2] })

    //   React.useEffect(() => {}, [come])

    //   return (
    //     <Interactive>
    //       <RayGrab
    //         onSelectStart={() => {
    //           setCome(true)
    //         }}
    //         onSelect={() => {
    //           setCome(true)
    //         }}
    //         onSelectEnd={() => {
    //           setCome(false)
    //         }}
    //       >
    //         <Box {...props} args={[0.6, 2, 1]} position={props.position} rotation={props.rotation}>
    //           <meshStandardMaterial wireframe={true} />
    //         </Box>
    //       </RayGrab>
    //     </Interactive>
    //   )
    // }

    const planes = []
    const interactionBoxes = []
    const numberOfPlanes = 20
    const towardTop = 10
    const maxRadius = 8

    for (let i = 0; i < numberOfPlanes; i++) {
      for (let j = 0; j < towardTop; j++) {
        for (let k = 2; k < maxRadius; k++) {
          const angle = (i / numberOfPlanes) * Math.PI * 2
          const extraRotation = k % 2 === 1 ? Math.PI / numberOfPlanes : 0
          let x = Math.cos(angle + extraRotation) * (k + 2 - currentNum.get()) * gap
          let z = Math.sin(angle + extraRotation) * (k + 2 - currentNum.get()) * gap

          const opacity = k < current ? k + 1 - currentNum.get() : 1 - (1 / (maxRadius - 2)) * (k + 2 - currentNum.get())

          // Select a random texture for each plane
          const texture = textures[(i * j * k) % textures.length]

          // Add the plane to the array with position and rotation
          planes.push(
            <Interactive>
              <Plane
                key={i}
                visible={k < current - 1 ? false : true}
                position={[x, j * 0.5, z]}
                rotation={[0, -angle + Math.PI / 2, 0]} // Adjust the rotation to face the center
                args={[0.4, 0.4]} // Size of the plane
              >
                <meshStandardMaterial
                  // @ts-ignore
                  map={texture} // Apply the texture
                  wireframe={false}
                  transparent={true}
                  opacity={opacity}
                  color={color}
                  side={THREE.DoubleSide}
                />
              </Plane>
            </Interactive>
          )

          // interactionBoxes.push(<Grab rotation={[0, -angle + Math.PI / 2, 0]} position={[grabX, 0.5, grabZ]} />)
        }
      }
    }
    return <>{planes}</>
  }

  return (
    <>
      <div
        onClick={() => {
          setCurrent(current + 1)
        }}
      >
        Click me
      </div>
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
