import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { IntlProvider } from 'react-intl'
import Header from '../Header'

const renderHeader = () => {
  return render(
    <BrowserRouter>
      <IntlProvider messages={{}} locale="en">
        <Header/>
      </IntlProvider>
    </BrowserRouter>
  )
}

describe('Header', () => {
  it('renders correctly', () => {
    renderHeader()
    expect(screen.getByText('Kickdrum')).toBeInTheDocument()
    expect(screen.getByText('MY BOOKINGS')).toBeInTheDocument()
  })
})
