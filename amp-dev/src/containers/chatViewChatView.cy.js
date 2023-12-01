import React from 'react'
import ChatView from './chatView'

describe('<ChatView />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(
      <FriendContext.Provider value={{ setSelectedFriend }}>
        <ChatView />    
      </FriendContext.Provider>)
  })
})