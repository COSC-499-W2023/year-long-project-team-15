describe('Login Tests', function() {
    beforeEach(()=> {
        cy.visit('http://localhost:3000'); // Adjust the URL as needed
    });

    it('fails when using an invalid email format', () => {
        cy.get('.MuiTextField-root input').first().type('invalidemail');
        cy.get('.MuiTextField-root input').eq(1).type('Password123!');
        cy.get('.MuiButton-contained').contains('Login').click();
        //cy.get('form[data-amplify-authenticator-signin]').should('be.visible')
    });
/*
    it('fails with a non-registered email', () => {
        cy.get('input[name="username"]').type('nonregistered@example.com');
        cy.get('input[name="password"]').type('Password123!');
        cy.get('button[type="submit"]').click();
        cy.get('div[class="amplify-alert__body"]').should('include.text','User does not exist.');
    });

    it('fails with an incorrect password', () => {
        cy.get('input[name="username"]').type('macvibert@gmail.com');
        cy.get('input[name="password"]').type('WrongPassword!');
        cy.get('button[type="submit"]').click();
        cy.get('div[class="amplify-alert__body"]').should('include.text','Incorrect username or password.');
    });

    it('fails with an empty email field', () => {
        cy.get('input[name="password"]').type('Password123!');
        cy.get('button[type="submit"]').click();
        cy.get('form[data-amplify-authenticator-signin]').should('be.visible')
    });

    it('fails with an empty password field', () => {
        cy.get('input[name="username"]').type('validemail@example.com');
        cy.get('button[type="submit"]').click();
        cy.get('form[data-amplify-authenticator-signin]').should('be.visible')
    });

    it('fails with both fields empty', () => {
        cy.get('button[type="submit"]').click();
        cy.get('form[data-amplify-authenticator-signin]').should('be.visible')
    });
        
    it('allows a user to successfully log in', () => {
        cy.get('input[name="username"]').type('macvibert@gmail.com');
        cy.get('input[name="password"]').type('#Cammac12');
        cy.get('button[type="submit"]').click();
        cy.wait(2000)
        cy.contains('BlurVid').should('be.visible')
    });
 */   
});
