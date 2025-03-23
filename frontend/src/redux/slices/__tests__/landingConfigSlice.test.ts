import { describe, it, expect, vi } from 'vitest';
import reducer, { fetchLandingConfig, setConfig } from '../landingConfigSlice';
import { defaultLandingConfig } from '@/utils/configUtils';
import axios from 'axios';

vi.mock('axios');

describe('landingConfigSlice', () => {
  const initialState = {
    config: null,
    loading: false,
    error: null
  };

  it('should handle initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle setConfig', () => {
    const mockConfig = {
      ...defaultLandingConfig,
      tenantId: 1,
      page: "landing",
      header_logo: { alt: "test", url: "test" }
    };
    const actual = reducer(initialState, setConfig(mockConfig));
    expect(actual.config).toEqual(mockConfig);
  });

  it('should handle fetchLandingConfig.pending', () => {
    const action = { type: fetchLandingConfig.pending.type };
    const state = reducer(initialState, action);
    expect(state.loading).toBe(true);
    expect(state.error).toBe(null);
  });

  it('should handle fetchLandingConfig.fulfilled', () => {
    const mockConfig = { tenantId: 1 };
    const action = { 
      type: fetchLandingConfig.fulfilled.type, 
      payload: mockConfig 
    };
    const state = reducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.config).toEqual(mockConfig);
  });
});
