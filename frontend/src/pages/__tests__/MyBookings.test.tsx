import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import { configureStore } from '@reduxjs/toolkit';
import MyBookings from '../MyBookings';
import { fetchLandingConfig } from '../../redux/slices/landingConfigSlice';

// Mock store setup
const mockStore = configureStore({
  reducer: {
    landingConfig: (state = { loading: false, error: null, config: null }) => state
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware()
});

vi.mock('../../redux/slices/landingConfigSlice', () => ({
  fetchLandingConfig: vi.fn(() => ({ type: 'landingConfig/fetchConfig' }))
}));

const renderMyBookings = () => {
  return render(
    <Provider store={mockStore}>
      <BrowserRouter>
        <IntlProvider messages={{ noBooking: 'No booking' }} locale="en">
          <MyBookings />
        </IntlProvider>
      </BrowserRouter>
    </Provider>
  );
};

describe('MyBookings Component', () => {
  it('dispatches fetchLandingConfig on mount', () => {
    renderMyBookings();
    expect(fetchLandingConfig).toHaveBeenCalledWith(1);
  });

  it('renders the Click Here button', () => {
    const { getByText } = renderMyBookings();
    expect(getByText('Click Here')).toBeInTheDocument();
  });
});
