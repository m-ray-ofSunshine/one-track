const router = require('express').Router();
require('dotenv').config();

const withAuth = require('../../utils/auth');
const axios = require('axios');

const querystring = require('querystring');

var client_id = process.env.client_id; // Your client id
var client_secret = process.env.client_secret // Your secret

const spotifyAuth = async () => {
  try {
    const res = await axios.post('https://accounts.spotify.com/api/token', querystring.stringify({ 'grant_type': 'client_credentials' }), {
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')),
      }
    })
    return res.data.access_token
  } catch (error) {
    console.log(error);
  }
  
}
 
router.post('/', async (req, res) => {
  let token = await spotifyAuth();
  
  let input = req.body.input;
  let type = req.body.type;
 const search = await axios.get('https://api.spotify.com/v1/search/?q=' + input + '&type=' + type, {
    headers: {
      'Authorization': 'Bearer ' + token
    },
  })
  res.json(search.data);
})
router.post('/toptracks', async (req, res) => {
  let token = await spotifyAuth();
  
  let id = req.body.id;
  
 const search = await axios.get('https://api.spotify.com/v1/artists/' + id + '/top-tracks?market=us', {
    headers: {
      'Authorization': 'Bearer ' + token
    },
  })
  res.json(search.data);
})

module.exports = router;
