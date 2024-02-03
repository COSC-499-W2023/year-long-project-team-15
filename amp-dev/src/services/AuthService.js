import Auth from '@aws-amplify/auth';

export const getAuthenticatedUserId = async () => {
    const authenticatedUser = await Auth.currentAuthenticatedUser();
    return authenticatedUser.attributes.sub;
  };

  export const getAuthenticatedUserName = async () => {
    const authenticatedUser = await Auth.currentAuthenticatedUser();
    return authenticatedUser.attributes.name;
  };

export const signOut = async () => {
  await Auth.signOut();
};