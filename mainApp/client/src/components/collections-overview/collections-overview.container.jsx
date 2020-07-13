import React from 'react';
import {Query} from 'react-apollo';
import {gql} from 'apollo-boost';
import CollectionOverview from './collections-overview.component';
import Spinner from '../spinner/spinner.component';


const GET_COLLECTION=gql`
    {
        collections {
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

//After fetch data from back-end it shows data, otherwise,loading is true.
const CollectionOverviewContainer = ()=>(
    <Query query={GET_COLLECTION}>
        {
            ({loading,error,data})=>{
                console.log({loading});
                console.log({error});
                console.log({data});
                if(loading) return <Spinner/>               
                return <CollectionOverview collections={data.collections}/>
            }
        }
    </Query>
);


export default CollectionOverviewContainer;