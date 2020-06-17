const Sequelize = require('sequelize');
const sequelize = require('../configuration/database');

const Product = sequelize.define('product', {
    uuid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1,
        primaryKey: true,
        unique: true
    },
    vin: {
        type: Sequelize.STRING(20), //Assuming a maximum length of 8 char for plates
        /*validate: { //TODO comment for VIN validation
            validateVin: function (value) { //Regex validation for plate: Example this case: L(IP)-P(F)-2(014)
                if (!/^[A-Z]{1,3}-[A-Z]{1,2}-[0-9]{1,4}$/i.test(value)) {
                    return false;
                }
                return true;
            }
        }*/
        allowNull: false
    },
    make: {
        type: Sequelize.STRING(60), //Would be better to use an ENUM or a db table for available values
        allowNull: false //This value could be to value to expect a empty value. Change depending on requirements
    },
    model: {
        type: Sequelize.STRING(60), //Same as previous column
    },
    mileage: {
        type: Sequelize.BIGINT
    },
    year: {
        type: Sequelize.SMALLINT,
        /* validate: {
             validateYear: function (value) {
                 let current_year = new Date().getFullYear();
                 if((value < 1920) || (value > current_year))
                 {
                     alert("Year should be in range 1920 to current year");
                     return false;
                 }
                 return true;
             }
         }*///TODO uncomment for year validation
    },
    price: {
        type: Sequelize.DECIMAL(10, 2),
    },
    zipCode: {
        type: Sequelize.STRING(20),
        validate: {
            validateZip: function (value) {
                return /(^\d{5}$)|(^\d{5}-\d{4}$)/.test(value); //Assuming USA's Zip Code
            }
        }
    }

    //Sequelize handles create and update date

});

module.exports = Product;

