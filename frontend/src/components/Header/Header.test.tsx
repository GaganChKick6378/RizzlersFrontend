import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { IntlProvider } from 'react-intl'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import Header from '../Header'

const mockStore = configureStore({
  reducer: {
    header: (state = { currency: { code: 'USD', symbol: '$' }, language: 'en' }) => state,
    landingConfig: (state = { config: {
      header_logo: { alt: "Logo", url: "" },
      page_title: { text: "Internet Booking Engine" }
    } }) => state
  }
});

const messages = {
  text: 'Internet Booking Engine',
  language: 'English'
};

const renderHeader = () => {
  return render(
    <Provider store={mockStore}>
      <BrowserRouter>
        <IntlProvider messages={messages} locale="en">
          <Header/>
        </IntlProvider>
      </BrowserRouter>
    </Provider>
  )
}

describe('Header', () => {
  it('renders correctly', () => {
    renderHeader()
    expect(screen.getByText('Internet Booking Engine')).toBeInTheDocument()
    expect(screen.getByText('MY BOOKINGS')).toBeInTheDocument()
  })
})
