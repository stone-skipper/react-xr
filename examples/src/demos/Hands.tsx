import { Canvas } from '@react-three/fiber'
import { Box, Environment } from '@react-three/drei'
import { Hands, XR, VRButton, Controllers, Interactive, RayGrab, RayGrabProps } from '@react-three/xr'
import React, { ComponentProps } from 'react'
import { useSpring, animated } from '@react-spring/three'

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

export function Grab(props: ComponentProps<typeof Box>) {
  const [hover, setHover] = React.useState(false)
  const [color, setColor] = React.useState(0x123456)
  const [come, setCome] = React.useState(false)
  const springs = useSpring({ position: come === true ? [0, 0.8, 0.2] : [0, 0.8, -2] })

  React.useEffect(() => {}, [come])

  return (
    <Interactive>
      {/* @ts-ignore */}
      <Box {...props} args={[0.4, 0.4, 0.4]} position={springs}>
        {/* <meshStandardMaterial color={color} /> */}
      </Box>
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

          <Grab />
          {/* <Button position={[0, 0.8, -1]} /> */}
        </XR>
      </Canvas>
    </>
  )
}
