
import Auth from '@aws-amplify/auth';

export const getAuthenticatedUserId = async () => {
    const authenticatedUser = await Auth.currentAuthenticatedUser();
    return authenticatedUser.attributes.sub; 
};

export const getAuthenticatedUserName = async () => {
    const authenticatedUserName = await Auth.currentAuthenticatedUser();
    return authenticatedUserName.attributes.name; 
};

export const signOut = async () => {
    await Auth.signOut();
    
};

