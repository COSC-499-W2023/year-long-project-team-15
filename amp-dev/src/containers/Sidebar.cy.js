import React from 'react';
import { mount } from 'cypress/react';
import Sidebar from './Sidebar';
import FriendContext from '../context/FriendContext';

describe('<Sidebar />', () => {
  const mockFilteredFriends = [
    { id: '1', name: 'Alice' },
    { id: '2', name: 'Bob' }
  ];

  beforeEach(() => {
    mount(
      <FriendContext.Provider value={{ setSelectedFriend: cy.stub().as('setSelectedFriend') }}>
        <Sidebar testFilteredFriends={mockFilteredFriends} />
      </FriendContext.Provider>
    );
  });

  it('renders the sidebar with mocked friends list', () => {
    cy.contains('Alice').should('exist');
    cy.contains('Bob').should('exist');
  });

  it('filters friends based on search input', () => {
    cy.get('input[placeholder="Search Contacts"]').type('Alice');
    cy.contains('Alice').should('exist');
    cy.contains('Bob').should('not.exist');
  });

  it('calls setSelectedFriend when a friend is clicked', () => {
    cy.contains('Alice').click();
    cy.get('@setSelectedFriend').should('have.been.calledWith', mockFilteredFriends[0]);
  });

});
