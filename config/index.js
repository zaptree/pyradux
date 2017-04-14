import config from './config';
import merge from 'lodash/merge';


let envConfig = require('./config.' + (process.env.SERVER_ENV || 'development'));
if(envConfig.__esModule){
	envConfig = envConfig.default;
}

const mergedConfig = merge({}, config, envConfig);

export default mergedConfig;
