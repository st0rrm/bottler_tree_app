import React, { useEffect } from 'react'
import { Plane, useTexture } from '@react-three/drei'
import { TextureLoader } from 'three'
import useTreeStore from '@/stores/useTreeStore'

const bg_200 = require("./assets/backgrounds/200.jpg");
const bg_300 = require("./assets/backgrounds/300.jpg");
const bg_400 = require("./assets/backgrounds/400.jpg");
const bg_500 = require("./assets/backgrounds/500.jpg");
const bg_600 = require("./assets/backgrounds/600.jpg");
const bg_700 = require("./assets/backgrounds/700.jpg");
const bg_800 = require("./assets/backgrounds/800.jpg");
const bg_obj = require("./assets/backgrounds/bg_objects.png");

const Background = () => {
  const textures = [
    new TextureLoader().load(bg_200),
    new TextureLoader().load(bg_300),
    new TextureLoader().load(bg_400),
    new TextureLoader().load(bg_500),
    new TextureLoader().load(bg_600),
    new TextureLoader().load(bg_700),
    new TextureLoader().load(bg_800),
    new TextureLoader().load(bg_obj),
  ]
  const {total} = useTreeStore()

  useEffect(() => {
    console.log(textures)
  }, [textures])

  return (
    <group>
      <Plane args={[10, 10]} >
        <meshBasicMaterial attach='material' map={textures[total/100-1]} />
      </Plane>
    </group>
  )
}

export default Background
