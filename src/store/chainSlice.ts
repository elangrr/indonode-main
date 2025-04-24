// Update the extraReducers section with builder callback pattern
import { createSlice } from '@reduxjs/toolkit'
import { AppState } from './index'
import { HYDRATE } from 'next-redux-wrapper'
import { Chain } from '@/utils/chains'

// Type for our state
export interface ChainState {
  chain: Chain | undefined
  isFetched: boolean
}

// Initial state
const initialState: ChainState = {
  chain: undefined,
  isFetched: false,
}

// Actual Slice
export const chainSlice = createSlice({
  name: 'chain',
  initialState,
  reducers: {
    setChain(state, action) {
      state.chain = action.payload
    },
    setIsFetched(state, action) {
      state.isFetched = action.payload
    },
  },

  // Special reducer for hydrating the state using builder callback pattern
  extraReducers: (builder) => {
    builder
      .addCase(HYDRATE, (state, action) => {
        return {
          ...state,
          ...action.payload.chain,
        }
      })
  },
})

export const { setChain, setIsFetched } = chainSlice.actions

export const selectChain = (state: AppState) => state.chain.chain
export const selectIsFetched = (state: AppState) => state.chain.isFetched

export default chainSlice.reducer