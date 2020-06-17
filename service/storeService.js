const log = require('debug')('autoFi:StoreService');
const fs = require('fs');
const {parse} = require('fast-csv');
const Product = require('../model/Product')

const baseDir = __dirname + '/../store/';

class StoreService {

    storeCsv(prov, file) {
        log(`[StoreCsv] storing type->${file.name}`)
        const provConf = prov.providerConfiguration;
        //Validation of data structure could be used here, to check if data in column comply to what is expected
        //Using csv-parser we can check if columns comply, or if there is enough columns, will really depend on what is expected from the input data
        //This could depending on client requirements
        if (provConf.storeType === 'FILE' || provConf.storeType === 'BOTH') {
            return this.storeInFile(provConf, file);
        }

        if (provConf.storeType === 'DB' || provConf.storeType === 'BOTH') {
            return this.storeInDB(provConf, file);
        }
    }

    storeInFile(prov, file) {//Could have use fs-Extra for simple create if not exits
        const fileName = baseDir + prov.fileLocator;
        //1 Check if file exits for the given provider
        try {
            if (!fs.existsSync(fileName)) { //If it doesn't exits create
                //Create if does not exits
                file.mv(fileName, (err) => {
                    if (err) throw err;
                    console.log('File was created successfully.');
                });
            } else { //Append if exits
                const data = file.data.toString('ascii');
                fs.appendFile(fileName, data, (err) => {
                    if (err) throw err;
                    console.log('File was updated successfully.');
                })
            }
        } catch (err) {
            console.error(err)
            if (err) throw err;
        }

        return 'STORED OK'
    }

    storeInDB(provConf, file) {
        const conf = JSON.parse(provConf.conf); //Depending on DB we could use JSON support to extract directly de entry we look for. MSSQL has no native support for JSON
        const headers = conf.layout;

        const data = file.data.toString('ascii');

        const results = [];

        //Prepare data as an array of entries, then save as bulk
        return (function () {
            return new Promise((resolve, reject) => {
                const stream = parse({headers: headers, objectMode: true})
                    .on('error', error => {
                        console.error(error);
                        if (error) throw error;
                    })
                    .on('data', (row) => {
                        //Price column is not numeric.. it has the following format $123, will convert to int
                        if (row.price !== null && row.price.charAt(0) === '$') //Could use regex for any symbol that the client may use
                            row.price = row.price.substr(1);
                        results.push(row);
                    })
                    .on('end', (rowCount) => {
                        console.log(`Parsed ${rowCount} rows`);

                        Product.bulkCreate(results);
                        resolve(`Stored ${results.length} rows`);
                        //return `Stored ${results.length} rows`;
                    });
                stream.write(data);
                stream.end();
            });
        })();


        /*const stream = parse({ headers: headers, objectMode: true })
            .on('error', error => console.error(error))
            .on('data', (row) => {
                //Price column is not numeric.. it has the following format $123, will convert to int
                if(row.price !== null && row.price.charAt(0) === '$') //Could use regex for any symbol that the client may use
                    row.price = row.price.substr(1);
                results.push(row);
            })
            .on('end', (rowCount) => {
                console.log(`Parsed ${rowCount} rows`);

                Product.bulkCreate(results);
                return `Stored ${results.length} rows`;
            });
        stream.write(data);
        stream.end();*/
    }
}

module.exports = new StoreService();