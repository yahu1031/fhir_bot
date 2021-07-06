const fetch = require('node-fetch');

async function fetchData(client) {
    try {
        const data = await fetch(client.flutterApi).then(response => response.json());
        //  ! Checking if the fetched data is null.
        if (data != null) {
            return client.flutterData = data;
        }
        return console.log('Data fetched from API.....✔️');
    }
    catch (err) {
        return console.log('❌️' + err);
    }
}

module.exports = { fetchData };