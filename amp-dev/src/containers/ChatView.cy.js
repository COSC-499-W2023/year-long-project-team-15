import React from 'react';
import { mount } from 'cypress/react';
import ChatView from './chatView';
import FriendContext from '../context/FriendContext';

describe('<ChatView />', () => {
  const mockFriend = { name: 'Test Name' };

  it('renders message when no friend is selected', () => {
    mount(
      <FriendContext.Provider value={{ selectedFriend: null }}>
        <ChatView />
      </FriendContext.Provider>
    );
    cy.contains('Please select a friend to start chatting').should('be.visible');
  });

  it('renders chat interface when a friend is selected', () => {
    mount(
      <FriendContext.Provider value={{ selectedFriend: mockFriend }}>
        <ChatView />
      </FriendContext.Provider>
    );
    cy.contains(`Chatting with: ${mockFriend.name}`).should('be.visible');
    cy.get('input').should('be.visible');
    cy.get('button').should('have.length', 2); // for send and video call icons
  });
  //more tests for later feature implementation
});
