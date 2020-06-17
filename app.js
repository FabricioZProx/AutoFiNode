const express = require('express');
const logger = require('morgan');
const log = require('debug')('autoFi:App');
//Support for file upload: Ample use in community, simple enough for our requirements.
const fileUpload = require('express-fileupload');

///DATABASE INITIALIZATION
/*Sequelize */
const db = require('./configuration/database');

const app = express();


//Connection check
db.authenticate()
    .then(() => {
        log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

//Middleware configuration
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
/*app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));*/

//No CORS, XSF, or Auth, but a basic CORS and auth is recommended

// enable files upload
app.use(fileUpload({
    createParentPath: true
}));

const storage = require('./service/storeService');
const providerService = require('./service/providerService');

app.post('/:provName/uploadCsv', async (req, res) => {
    log(`[Provider] upload: Provider->${req.params.provName}`)
    //Usually process would better isolated in service layer(isolate business logic, but given this is a simple example, service layer will be here.

    //1 File validation
    //Could use some other forms on validation here o via middleware
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }
    try {
        //2 Check provider exits and fetch configuration
        const prov = await providerService.fetchProviderByName(req.params.provName);
        if (!prov) {
            res.status(404);
            res.send("Provider does not exits");
        }

        const file = req.files.inputCsv;

        //Store data
        const result = await storage.storeCsv(prov, file);

        res.send({
            status: 200,
            message: result
        });
    } catch (e) {
        console.error(e)
        res.send({
            status: 500,
            message: e.toString()
        });
    }

})

module.exports = app;
