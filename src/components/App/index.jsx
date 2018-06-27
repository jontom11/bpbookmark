import React, { Component } from 'react';
import client from '../../services/client';
import NewListingForm from '../NewListingForm';
import styles from './styles.scss';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import {Card, CardActions, CardHeader} from 'material-ui/Card';
import Dialog from 'material-ui/Dialog';

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      listings: [],
      showServerError: false,
      open: false,
      selectedIndex: '',
      newTitle: '',
      newUrl: ''
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
  handleEditSubmitClick() {
    let selectedIndex = this.state.selectedIndex;
    let newTitle = this.state.newTitle;
    let newUrl = this.state.newUrl;

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

  handleTitleChange(e) {
    this.setState({newTitle: e.target.value});
  }

  handleUrlChange(e) {
    this.setState({newUrl: e.target.value});
  }

  handleDialogClose() {
    this.setState({open: false});
  }

  // create Delete listings case calling client.delete

  render() {
    const actions = [
      <FlatButton
        key={1}
        label="Cancel"
        primary={true}
        onClick={this.handleDialogClose.bind(this)}
      />,
      <FlatButton
        key={2}
        label="Submit"
        primary={true}
        onClick={this.handleEditSubmitClick.bind(this)}
      />,
    ];

    let listings = this.state.listings.map( (listing, index) => {
      return(
        <Card className={styles.cardStyle} key={index}>
          <CardHeader
            title={listing.title}
            subtitle={listing.url}
          />
          <CardActions>
          <FlatButton label="Delete" onClick={this.handleDelete.bind(this, index)} />
          <FlatButton label="Edit" onClick={this.handleEdit.bind(this, index)}/>
          </CardActions>
        </Card>
      );
    });

    let dialog = (
      <Dialog
        title="Edit Title and URL"
        actions={actions}
        modal={false}
        open={this.state.open}
        onRequestClose={this.handleDialogClose.bind(this)}
      >
        <TextField
          id='newTitleInput'
          floatingLabelText="Title:"
          defaultValue={this.state.listings[this.state.selectedIndex]}
          fullWidth={true}
          onChange = {this.handleTitleChange.bind(this)}
        />
        <TextField
          id='newUrlInput'
          floatingLabelText="Url:"
          fullWidth={true}
          onChange = {this.handleUrlChange.bind(this)}
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
