import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const httpLink = new HttpLink({
  uri: 'https://wgxsadcplndedb5r62djxmtsuu.appsync-api.ca-central-1.amazonaws.com/graphql', // Replace with your actual endpoint
  headers: {
    'x-api-key': 'da2-bo2ui2h6mbbx3mtokqxqmk4gb4', // Replace with your actual API key
  },
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

export default client;
