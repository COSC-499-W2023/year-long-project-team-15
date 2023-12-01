import React from 'react'
import Account from './Account'

describe('<Account />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<Account />)
  })
})