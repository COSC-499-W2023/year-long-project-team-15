import React from 'react'
import Sidebar from './Sidebar'
import FriendContext from '../context/FriendContext'
import { useContext } from 'react';

const { setSelectedFriend } = useContext(FriendContext);

describe('<Sidebar />', () => {

  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(
      <FriendContext.Provider value={{ setSelectedFriend }}>
        <Sidebar />
      </FriendContext.Provider>)
  })
})