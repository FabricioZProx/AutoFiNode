const Sequelize = require('sequelize');
const sequelize = require('../configuration/database');
const uuid = require('uuid');

/**
 * Any user (Provider) configuration must go here.
 * */
const ProviderConfiguration = sequelize.define('providerConfiguration', {
    conf: {
        type: Sequelize.STRING,
        allowNull: false
    },
    storeType: {
        type: Sequelize.ENUM('FILE', 'DB', 'BOTH'),
        allowNull: false,
        defaultValue: "BOTH" //i.e. default config
    },
    fileLocator: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    }
}, {
    hooks: {
        beforeCreate(attributes, options) {
            if (!attributes.fileLocator)
                attributes.fileLocator = uuid.v1(); //In case no FileName is provider we can random generate one, better option is to create one from the provider data
        }
    }
});

module.exports = ProviderConfiguration;