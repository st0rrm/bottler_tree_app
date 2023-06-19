import {create} from "zustand";
import { branchImages, flowerImages, fruitImages, leafImages } from '@/components/tree/resources'

const useTreeStore = create((set, get) => ({
  totalTextures: branchImages.length + flowerImages.length + fruitImages.length + leafImages.length,
  texturesLoaded: 0,
  allTexturesLoaded: false,
  loadedTexture: () => {
    const total = get().totalTextures
    const loaded = get().texturesLoaded + 1
    set({texturesLoaded: loaded})
    if(loaded===total){
      set({allTexturesLoaded: true})
    }
  },
  initThree: false,
  setInitThree: (t: boolean) => set({initThree: t}),
}))

export default useTreeStore
