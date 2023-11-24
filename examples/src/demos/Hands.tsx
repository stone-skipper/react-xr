import { Canvas } from '@react-three/fiber'
import { Box } from '@react-three/drei'
import { Hands, XR, VRButton, Controllers, Interactive, RayGrab } from '@react-three/xr'
import React, { ComponentProps } from 'react'

export function Button(props: ComponentProps<typeof Box>) {
  const [hover, setHover] = React.useState(false)
  const [color, setColor] = React.useState(0x123456)

  return (
    <Interactive onSelect={() => setColor((Math.random() * 0xffffff) | 0)} onHover={() => setHover(true)} onBlur={() => setHover(false)}>
      <Box {...props} args={[0.4, 0.1, 0.1]} scale={hover ? 1.5 : 1}>
        <meshStandardMaterial color={color} />
      </Box>
    </Interactive>
  )
}

export default function () {
  return (
    <>
      <VRButton onError={(e) => console.error(e)} />
      <Canvas>
        <XR>
          <ambientLight intensity={0.5} />
          <pointLight position={[5, 5, 5]} />
          <Hands
          // modelLeft="/hand-left.gltf"
          // modelRight="/hand-right.gltf"
          />
          <RayGrab>
            <Button position={[0, 0.8, 1]} />
          </RayGrab>
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

          <Button position={[0, 0.8, -1]} />
        </XR>
      </Canvas>
    </>
  )
}
