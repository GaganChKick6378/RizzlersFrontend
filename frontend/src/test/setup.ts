import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

// Mock matchMedia if not available
if (!window.matchMedia) {
  window.matchMedia = vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))
}

// Mock IntlProvider default messages
vi.mock('react-intl', async () => {
  const actual = await vi.importActual('react-intl');
  return {
    ...actual,
    useIntl: () => ({
      formatMessage: ({ id }) => id,
    }),
  };
});

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})


