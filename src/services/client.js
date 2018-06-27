import axios from 'axios';
import serializer from './serializer';

const baseURL = 'https://clientside-api.herokuapp.com/api/v1';
const token = process.env.TOKEN;

const API = axios.create({
  baseURL: baseURL,
  headers: {
    Authorization: token
  }
});

export default {
  getListings() {
    return API.get('/listings').then(response => {
      return serializer(response.data);
    });
  },

  createListing(title, url) {
    const body = {
      data: {
        type: 'listings',
        attributes: {
          title: title,
          url: url
        }
      }
    };
    return API.post('/listings', body).then(response => {
      return serializer(response.data);
    });
  },

  deleteListing(selectedId) {
    return API.delete('/listings/' + selectedId).then(response => {
      return response.data;
    });
  },

  editListing(selectedId, title, url) {
    const body = {
      data: {
        type: 'listings',
        attributes: {
          title: title,
          url: url
        }
      }
    };
    return API.put('/listings/' + selectedId, body).then(response => {
      return serializer(response.data);
    });
  }

};
