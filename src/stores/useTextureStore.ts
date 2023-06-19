import {create} from "zustand";
import { branchImages, flowerImages, fruitImages, leafImages } from '@/components/tree/resources'
import useTreeStore from '@/stores/useTreeStore'
const { totalTextures, setTotalTextures } = useTreeStore()
const useTextureStore = create((set, get) => ({
  loadedTexture: (e)=> {
    console.log('loadedTexture', e)
    const count = totalTextures-1
    console.log('loadedTexture', count)
    // if(count === 0) {
    //   set({init: true})
    // } else {
    //   set({totalTextures: count})
    // }
    setTotalTextures(count)
  }
}))

export default useTextureStore
