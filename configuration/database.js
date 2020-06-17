const log = require('debug')('autoFi:database');
const Sequelize = require('sequelize');

const sequelize = new Sequelize('sqlite::memory:');

/*
const sequelize = new Sequelize('autofi', 'user_iot', 'user_iot',{
    dialect: 'mssql',
    host: 'localhost'
});
*/

module.exports = sequelize;


//Model
const Provider = require('../model/Provider');
const Product = require('../model/Product');
const ProviderConf = require('../model/ProviderConfiguration');
//const User = require('../model/User');//TODO delete USER


//Association
Provider.config = Provider.hasOne(ProviderConf);
ProviderConf.Provider = ProviderConf.belongsTo(Provider);

/*sequelize.sync({force: true}) //TODO change before PROD. Should use ENV or configuration service
    .then(log('Database sync successful!'));*/

//Will create 2 Providers and configurations to work with. This is not a regular procedure
//Conf.layout must set the headers in the expected order
(async () => {
    await sequelize.sync({force: true})
        .then(() => {
            Provider.create({
                email: "provider1@test.com",
                name: "PROVONE",
                providerConfiguration: {
                    conf: '{"layout": ["vin","model","make","mileage","year","price","zipCode"]}',
                    storeType: "FILE",
                    fileLocator: 'provider1.csv'
                }
            }, {
                include: [{
                    association: Provider.config
                }]
            }).then(prov1 =>
                console.log('!!--->' + JSON.stringify(prov1))
            ).catch(error => {
                console.log('Errro1: ' + error)
            });
        })
        .then(() => {
            Provider.create({
                email: "provider2@test.com",
                name: "PROVTWO",
                providerConfiguration: {
                    conf: '{"layout": ["vin","model","make","mileage","year","price","zipCode"]}',
                    storeType: "DB",
                    fileLocator: 'provider2.csv'
                }
            }, {
                include: [{
                    association: Provider.config
                }]
            }).then(prov2 =>
                console.log('!!!-->' + JSON.stringify(prov2))
            );
        });
})();

