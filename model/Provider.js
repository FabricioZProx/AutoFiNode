const Sequelize = require('sequelize');
const sequelize = require('../configuration/database');

/**
 * User equivalent, probably would store user info data.
 * */
const Provider = sequelize.define('provider', {
    email: {
        type: Sequelize.STRING(60),
        validate: {
            isEmail: true
        },
        /*allowNull: false,
        unique: true*///To keep simplicity
    },
    name: { //Would be better to have an static identification and representational name as separate.
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    }
}, {
    updatedAt: false
});

module.exports = Provider;