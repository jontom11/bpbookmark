import React, { Component } from 'react';
import client from '../../services/client';
import NewListingForm from '../NewListingForm';
import styles from './styles.scss';

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      listings: [],
      showServerError: false
    };
  }

  componentDidMount() {
    return client.getListings().then(listings => {
      return this.setState({ listings: listings, showServerError: false });
    }).catch(() => {
      return this.setState({ showServerError: true });
    });
  }

  handleSubmit(title, url) {
    let listings = this.state.listings.slice();

    return client.createListing(title, url).then(listing => {
      listings.push(listing);

      return this.setState({
        listings: listings,
        showServerError: false
      });
    });
  }

  render() {
    let listings = this.state.listings.map( (listing, index) => {
      return(
        <li key={index}>
          {listing.title} - {listing.url}
        </li>
      );
    });

    return(
      <div className={styles.container}>
        <header>
          <h1 className={styles.title}>Listings</h1>
        </header>
        <main>
          <NewListingForm
            className={styles.newListingForm}
            onSubmit={(title, url) => this.handleSubmit(title, url)}
          />

          <ul>
            {listings}
          </ul>
        </main>
      </div>
    );
  }
}
