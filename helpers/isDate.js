const moment = require('moment'); 

const isDate = (value ,{ req , location , path }) => {
    if (value) {
        if (!moment(value).isValid()) {
            return false;
        }
    }
    return true;
}

module.exports = {
    isDate    
}