const https = require("https");
const { createCanvas, loadImage } = require('canvas');

let subscriptionKey = process.env.BING_IMAGE_KEY;
let host = 'api.bing.microsoft.com';
let path = '/v7.0/images/search';
let search = '';
let countryCode = 'ES';

let request_params = {
    method : 'GET',
    hostname : host,
    path: `${path}?q=${encodeURIComponent(search)}&mkt=es-${countryCode}&license=public&size=small`,
    headers : {
      'Ocp-Apim-Subscription-Key' : subscriptionKey,
    }
};

const doesImageExist = async (url) => {
    const canvas = createCanvas(1, 1);
    const context = canvas.getContext('2d');
    try {
      const data = await loadImage(url);
      context.drawImage(data, 0, 0);
      return true;
    } catch (error) {
      return false;
    }
  };
  
const sendQuery = async (textToSearch) => {
    request_params = {
        method : 'GET',
        hostname : host,
        path : path + '?q=' + encodeURIComponent(textToSearch),
        headers : {'Ocp-Apim-Subscription-Key' : subscriptionKey,
        }
    };
    return new Promise ((resolve, reject) => {
        let req = https.request(request_params, (response) => {
            let body = '';
            response.on('data', function(chunk) {
                body += chunk;
            });
            response.on('end', function() {
                let search_results = JSON.parse(body);
                if(search_results.error){
                    return error.code;
                } 
                let indexImage = -1;
                do{ 
                    indexImage++;
                }while(!doesImageExist(search_results.value[indexImage].contentUrl));
                resolve(search_results.value[indexImage].contentUrl);
            });
        });
        req.on('error', function(err) {
            reject(err);
        });
        req.end();
    });
};

module.exports = sendQuery;