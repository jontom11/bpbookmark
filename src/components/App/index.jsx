import React, { Component } from 'react';
import client from '../../services/client';
import NewListingForm from '../NewListingForm';
import styles from './styles.scss';
import FlatButton from 'material-ui/FlatButton';
import {Card, CardActions, CardHeader} from 'material-ui/Card';
import Dialog from 'material-ui/Dialog';
import IconButton from 'material-ui/IconButton';
import ActionHome from 'material-ui/svg-icons/action/home';

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      listings: [],
      showServerError: false,
      open: false,
      selectedIndex: ''
    };
  }

  componentDidMount() {
    return client.getListings().then(listings => {
      return this.setState({ listings: listings, showServerError: false, open: false,
      selectedIndex: '', newTitle: '', newUrl: ''});
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

  handleDelete(index) {
    let listId = this.state.listings[index].id;
    //Don't manipulate orig state, copy then delete element, then setState
    let copyListings = this.state.listings;
    delete copyListings[index];
    this.setState({
      listings: copyListings
    });

    client.deleteListing(listId);
  }

  //opens edit dialog and sets state for selectedIndex
  handleEdit(index) {
    this.setState({open: true, selectedIndex: index});
  }

  //Edit Submit click will determine if title || URL changed before setting
  //state and passing data on to API
  handleEditSubmitClick(title1, url1) {
    let selectedIndex = this.state.selectedIndex;
    // let newTitle = this.state.newTitle;
    // let newUrl = this.state.newUrl;
    let newTitle = title1;
    let newUrl = url1;

    let listId = this.state.listings[selectedIndex].id;
    let copyListings = this.state.listings;

    let title = this.state.listings[selectedIndex].title;
    let url = this.state.listings[selectedIndex].url;
    let dataChanged = false;

    if (newTitle !== title && newTitle !== '') {
        title = newTitle;
        copyListings[selectedIndex].title = newTitle;
        dataChanged = true;
      }
    if (newUrl !== url && newUrl !== '') {
      url = newUrl;
      copyListings[selectedIndex].url = newUrl;
      dataChanged = true;
    }

    this.setState({listings: copyListings});

    this.handleDialogClose();

    //Prevents API calls if nothing changed as client calls are expensive
    if (dataChanged) {
      client.editListing(listId, title, url);
    }
  }

  handleDialogClose() {
    this.setState({open: false});
  }

  getData() {
    let data = {};
    if (this.state.selectedIndex !== '') {
      data['title'] = this.state.listings[this.state.selectedIndex].title;
      data['url'] = this.state.listings[this.state.selectedIndex].url;
    }
    return data;
  }

  // create Delete listings case calling client.delete

  render() {
    const actions = [
      <FlatButton
        key={1}
        label="Cancel"
        primary={true}
        onClick={this.handleDialogClose.bind(this)}
      />
    ];

    let listings = this.state.listings.map( (listing, index) => {
      return(
        <Card className={styles.cardStyle} key={index}>
          <CardHeader
            title={listing.title}
            subtitle={listing.url}
          />
          <CardActions>
          <IconButton tooltip="SVG Icon">
                <ActionHome />
              </IconButton>
          <FlatButton label="Delete" onClick={this.handleDelete.bind(this, index)} />
          <FlatButton label="Edit" onClick={this.handleEdit.bind(this, index)}/>
          <FlatButton label="Go" onClick={ ()=> window.open(listing.url)}/>
          </CardActions>
        </Card>
      );
    });

    let dialog = (
      <Dialog
        title="Edit bookmark"
        actions={actions}
        modal={false}
        open={this.state.open}
        onRequestClose={this.handleDialogClose.bind(this)}
      >
        <NewListingForm
          className={styles.newListingForm}
          onSubmit={(title, url) => this.handleEditSubmitClick(title, url)}
          edit={true}
        />
      </Dialog>
    );

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
          <div className={styles.listingContainer} >
            {listings}
            {dialog}
          </div>
        </main>
      </div>
    );
  }
}
