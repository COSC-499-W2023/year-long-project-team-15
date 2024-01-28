import React from 'react'
import Account from './Account'
import { BrowserRouter } from 'react-router-dom';

describe('<Account />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(
    <BrowserRouter>
      <Account />
    </BrowserRouter>)
  })
})