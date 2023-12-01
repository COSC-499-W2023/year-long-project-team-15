import React from 'react'
import Main from './Main'
import { BrowserRouter } from 'react-router-dom';

describe('<Main />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(
    <BrowserRouter>
      <Main />
    </BrowserRouter>
    )
  })
})