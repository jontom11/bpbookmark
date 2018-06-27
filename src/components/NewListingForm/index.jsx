import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './styles.scss';

class NewListingForm extends Component {
  constructor() {
    super();
    this.state = {
      title: 'NAME',
      url: '',
      showError: false
    };
  }

  handleSubmit(event) {
    event.preventDefault();
    const title = this.state.title;
    const url = this.state.url;
    console.log('this.props:', this.props);

    //no promise necessary when editing listings
    if (this.props.edit) {
      return this.props.onSubmit(title, url);
    } else {
      return this.props.onSubmit(title, url).then(() => {
        return this.setState({ title: '', url: '', showError: false });
      }).catch(() => {
        return this.setState({ showError: true });
      });
    }
  }

  onChangeName(data) {
    this.setState({
      title: data.title,
      url: data.url
    });
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  //editDialog prop holds App index state.listings
  renderValue() {
    return this.props.editDialog ? this.props.editDialog : this.state;
  }

  render() {
    return(
      <div className={this.props.className}>
        <form
          className={styles.newListing}
          onSubmit={(event) => this.handleSubmit(event)}
        >
          <fieldset>
            <input
              type="text"
              placeholder="Name"
              name="title"
              value={this.renderValue().title}
              onChange={(event) => this.handleInputChange(event)}
              aria-label="Name"
              aria-required="true"
            />
            <input
              type="url"
              placeholder="URL"
              name="url"
              value={this.renderValue().url}
              onChange={(event) => this.handleInputChange(event)}
              aria-label="URL"
              aria-required="true"
            />
          </fieldset>
          <button className={styles.create}>Enter</button>
        </form>
      </div>
    );
  }
}

NewListingForm.propTypes = {
  className: PropTypes.string,
  onSubmit: PropTypes.func,
  edit: PropTypes.bool,
  editDialog: PropTypes.object
};

export default NewListingForm;
