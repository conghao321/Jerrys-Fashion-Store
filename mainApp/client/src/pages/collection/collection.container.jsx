import React from 'react';
import {Query} from 'react-apollo';
import {gql} from 'apollo-boost';

import Spinner from '../spinner/spinner.component';
import CollectionPage from './collection.component';

const GET_COLLECTION_BY_TITLE=gql`
    query GET_COLLECTION_BY_TITLE($title:String!){
        getCollectionsByTitle(title:$title){
            id
            title
            items{
                id
                name
                price
                imageUrl
            }
        }
    }
`;

const CollectionPageContainer =({match})=>(
    <Query query={GET_COLLECTION_BY_TITLE} 
    variables={{title:match.params.collections}}>
        {({ loading, data }) => {
            if (loading) return <Spinner />;
            const { getCollectionsByTitle } = data; // Like so
            return <CollectionPage collection={getCollectionsByTitle} />;
        }}
    </Query>
);