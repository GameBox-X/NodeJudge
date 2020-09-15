/**
 * The way to use my own internal modules
 * 
 * `package.json` is required
 * 
 * @param {string} req 
 * @returns {any}
 */
function advanced_require(req){
    var fs = require('fs');
    var additional_modules = __dirname+"/internal_modules/";
    if(fs.existsSync(additional_modules+req)&&fs.existsSync(additional_modules+req+"/package.json")) return require(additional_modules+req);
    return require(req)
}
//var fs = advanced_require('command_parser');