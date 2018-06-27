import React, { Component } from 'react';
import client from '../../services/client';
import NewListingForm from '../NewListingForm';
import styles from './styles.scss';
import FlatButton from 'material-ui/FlatButton';
import {Card, CardActions, CardHeader} from 'material-ui/Card';
import Dialog from 'material-ui/Dialog';
import IconButton from 'material-ui/IconButton';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import ImageEdit from 'material-ui/svg-icons/image/edit';

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
      selectedIndex: ''});
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

  handleEdit(index) {
    this.setState({open: true, selectedIndex: index});
  }

  //Edit Submit click will determine if title || URL changed before setting
  //state and passing data on to API
  handleEditSubmitClick(title1, url1) {
    let selectedIndex = this.state.selectedIndex;
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

    //Prevents API calls if nothing changed as client calls may be expensive
    if (dataChanged) {
      client.editListing(listId, title, url);
    }
  }

  handleDialogClose() {
    this.setState({open: false});
  }

  render() {
    let style = {
      smallIcon: {
        width: 20,
        height: 20
      }
    };

    const dialogAction = [
      <FlatButton
        key='canelButton'
        label="Cancel"
        primary={true}
        onClick={this.handleDialogClose.bind(this)}
      />
    ];

    let listings = this.state.listings.map( (listing, index) => {
      return(
        <Card className={styles.cardStyle} key={index}>
          {/*Opens tab when title || url is clicked*/}
          <CardHeader
            title={listing.title}
            subtitle={listing.url}
            onClick={()=> window.open(listing.url)}
            className={styles.cardHeaderHover}
          />
          <CardActions>
          {/*Edit and Delete icon buttons*/}
          <IconButton
            tooltipPosition="top-center"
            tooltip="Edit"
            iconStyle={style.smallIcon}
            onClick={this.handleEdit.bind(this, index)}
          >
            <ImageEdit label="Edit"/>
          </IconButton>
          <IconButton
            tooltipPosition="top-center"
            tooltip="Delete"
            iconStyle={style.smallIcon}
            onClick={this.handleDelete.bind(this, index)}
          >
            <ActionDelete label="Delete"/>
          </IconButton>
          </CardActions>
        </Card>
      );
    });

    //Edit dialog contains newListingForm that passes new input dataa
    //and a new edit prop boolean to declare this submit as an edit listing
    let dialog = (
      <Dialog
        title="Edit bookmark"
        actions={dialogAction}
        modal={false}
        open={this.state.open}
        onRequestClose={this.handleDialogClose.bind(this)}
      >
        <NewListingForm
          className={styles.newListingForm}
          onSubmit={(title, url) => this.handleEditSubmitClick(title, url)}
          edit={true}
          editDialogInput={this.state.listings[this.state.selectedIndex]}
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
