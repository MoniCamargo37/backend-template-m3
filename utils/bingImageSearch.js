const https = require("https");

let subscriptionKey = 'b714d22be1d240b6b440bc44d26677ce';
let host = 'api.bing.microsoft.com';
let path = '/v7.0/images/search';
let search = '';

let request_params = {
    method : 'GET',
    hostname : host,
    path : path + '?q=' + encodeURIComponent(search),
    headers : {
      'Ocp-Apim-Subscription-Key' : subscriptionKey,
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
                console.log('Lo buscado: ', search_results);
                let first_image_url = search_results.value[0].contentUrl;
                resolve(first_image_url);
            });
        });
        req.on('error', function(err) {
            reject(err);
        });
        req.end();
    });
};




module.exports = sendQuery;



