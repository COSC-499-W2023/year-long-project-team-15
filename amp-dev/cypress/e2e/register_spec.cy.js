describe('Registration', function() {
    // Step 1: setup the application state
    beforeEach(()=> {
      cy.visit('http://localhost:3000');
    })
    describe('first visit', () => {
       it ('should display login component with sign in UI visible', () => {
        cy.get('div[data-amplify-authenticator]');
        cy.get('form[data-amplify-authenticator-signin]').should('be.visible');
      })
      
      it('should allow registration and prompt for email validation', ()=> {
        cy.get('button').contains('Create Account')
          .click();
        cy.get('form[data-amplify-authenticator-signup]')
          .should('be.visible');
        cy.get('input[name="password"]').type('Password123!');
        cy.get('input[name="confirm_password"]').type('Password123!');
        cy.get('input[name="email"]').type('foo3@bar.com')  //update each time to run new test
        cy.get('input[name="name"]').type('user'+Date.now());

        cy.get('button[type="submit"]').click();
        
        cy.get('form[data-amplify-authenticator-confirmsignup]')
          .should('be.visible')
          .children()
          .should('include.text','We Emailed You');
      })
    })
  })