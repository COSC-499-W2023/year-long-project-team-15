import { mount } from '@cypress/react';
import { BrowserRouter } from 'react-router-dom';
import Header from './Header';
import { useNavigate } from 'react-router-dom';

describe('<Header />', () => {
  it('renders', () => {
    // Create a stub for `useNavigate`
    const navigateStub = cy.stub().as('navigateStub');

    // Use `cy.stub` to replace `useNavigate`
    cy.stub(useNavigate, 'useNavigate').returns(navigateStub);

    // Mount the component with BrowserRouter
    mount(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );

    // Now you can test the behavior of `useNavigate` using `navigateStub`
    // For example, check if `navigate` has been called
    // cy.get('@navigateStub')
    //   .should('have.been.called');
  });
});
