import React from 'react';
import { mount } from 'cypress/react';
import { BrowserRouter } from 'react-router-dom';
import Header from './Header';
import Auth from '@aws-amplify/auth';

describe('<Header />', () => {
  // Mock Auth.currentAuthenticatedUser
  const mockAuthenticatedUser = {
    attributes: {
      name: 'Test User'
    }
  };

  beforeEach(() => {
    cy.stub(Auth, 'currentAuthenticatedUser').resolves(mockAuthenticatedUser);

    mount(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
  });

  it('renders the header', () => {
    cy.get('nav.navbar').should('exist');
    cy.get('a.nav-link').contains('Test User');
  });

  it('navigates to account page on account icon click', () => {
    // Assuming there's a way to simulate navigation
    cy.get('[id=account]').click();
    // Add assertions for navigation if possible
  });

  it('navigates to home on main logo click', () => {
    // Assuming there's a way to simulate navigation
    cy.get('button').contains('BlurVid').click();
    // Add assertions for navigation if possible
  });
});
