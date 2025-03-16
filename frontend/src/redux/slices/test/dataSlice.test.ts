import { describe, it, expect } from 'vitest'
import dataReducer from '../dataSlice'

describe('dataSlice', () => {
  it('should handle initial state', () => {
    expect(dataReducer(undefined, { type: '' })).toEqual({
      students: [],
      loading: false,
      error: null
    })
  })
})
