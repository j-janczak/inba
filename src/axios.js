const axios = require('axios').default,
  config = require('./config.json');

module.exports = {
  post: (path, data) => {
    return new Promise((resolve, reject) => {
      axios.post(config.apiURL + path, data)
        .then(result => {
          if (!result.data.success) throw result.data.error;
          else resolve(result.data.data); 
        })
        .catch(e => { reject(e); });
    });
  },
  get: (path, data) => {
    return new Promise((resolve, reject) => {
      axios.get(config.apiURL + path, data)
        .then(result => { 
          if (!result.data.success) throw result.data.error;
          else resolve(result.data.data); 
        })
        .catch(e => { reject(e); });
    });
  }
};