//@ts-nocheck

import {create} from "zustand";
import { branchImages, flowerImages, fruitImages, leafImages } from '@/components/tree/resources'

const useTreeStore = create((set, get) => ({
  uid: null,
  setUid: (t: string) => set({uid: t}),
  total: 0,
  setTotal: (t: number) => set({total: t}),
  count: 0,
  setCount: (t: number) => set({count: t}),
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
