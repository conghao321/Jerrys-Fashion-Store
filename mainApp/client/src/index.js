import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import {ApolloProvider} from 'react-apollo';
import {createHttpLink} from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient,gql } from 'apollo-boost';


import { store, persistor } from './redux/store';

import './index.css';
import App from './App';

import {resolvers,typeDefs} from './graphQL/resolvers'

//link to back-end
const httpLink= createHttpLink({
  uri:'https://jerryclothinggraphql.wm.r.appspot.com/'
})

const cache= new InMemoryCache();
const client = new ApolloClient({
  link:httpLink,
  cache,
  typeDefs,
  resolvers
})

client.query({
  query:gql`{
      getCollectionsByTitle(title:"hats"){
    id
    title
    items{
      id
      name
      price
      imageUrl
    }
  }
  }`
}).then(res=>{
  console.log(res);
});

client.writeData({
  data:{
    cartHidden:false
  }
}
);

//rendering React application
ReactDOM.render(
  <ApolloProvider client={client}>
  <Provider store={store}>
    <BrowserRouter>
      <PersistGate persistor={persistor}>
        <App />
      </PersistGate>
    </BrowserRouter>
  </Provider>
  </ApolloProvider>,
  document.getElementById('root')
);
