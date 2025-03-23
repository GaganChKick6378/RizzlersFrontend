import { describe, it, expect } from 'vitest';
import { applyLandingConfigDefaults, defaultLandingConfig } from '../configUtils';

describe('configUtils', () => {
  it('should return default config when input is null', () => {
    const result = applyLandingConfigDefaults(null);
    expect(result).toEqual(defaultLandingConfig);
  });

  it('should merge partial config with defaults', () => {
    const partialConfig = {
      tenantId: 2,
      page_title: { text: "Custom Title" }
    };
    const result = applyLandingConfigDefaults(partialConfig);
    expect(result.tenantId).toBe(2);
    expect(result.page_title.text).toBe("Custom Title");
    expect(result.languages).toBeDefined();
  });
});
