import { ApolloClient, InMemoryCache, HttpLink, split } from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { SubscriptionClient } from "subscriptions-transport-ws";


// HTTP link for queries and mutations
const httpLink = new HttpLink({
  uri: 'https://wgxsadcplndedb5r62djxmtsuu.appsync-api.ca-central-1.amazonaws.com/graphql',
  headers: {
    'x-api-key': 'da2-bo2ui2h6mbbx3mtokqxqmk4gb4',
  },
});


// WebSocket link for subscriptions
const wsLink = new WebSocketLink(
  new SubscriptionClient('wss://wgxsadcplndedb5r62djxmtsuu.appsync-realtime-api.ca-central-1.amazonaws.com/graphql', {
    reconnect: true,
    connectionParams: {
      'x-api-key': 'da2-bo2ui2h6mbbx3mtokqxqmk4gb4',
    },
  })
);

// Use split to route queries/mutations and subscriptions to different links
const link = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
  },
  wsLink, // Route to WebSocketLink for subscriptions
  httpLink, // Route to HttpLink for queries/mutations
);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

export default client;
