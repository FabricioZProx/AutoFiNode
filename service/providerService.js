const log = require('debug')('autoFi:ProviderService');
const Provider = require('../model/Provider');
//const User = require('../model/User');
const ProviderConf = require('../model/ProviderConfiguration');

class ProviderService {
    async fetchProviderByName(provider) { //Could make a more general method, but this is ok for requirements
        log(`Get Provider By name -> ${provider}`)
        return Provider.findOne({where: {name: provider}, include: [ProviderConf]})
            .catch();
    }
}

module.exports = new ProviderService();//Ensures we have only one instance due to class cache