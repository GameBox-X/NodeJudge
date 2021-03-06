/**
 * OUTPUT MODE
 * 0: ERROR
 * 1: WARN
 * 2: INFO
 * 3: LOG
 * 4: DEBUG
 */
/**
 * @typedef {object} CPOptions
 * @property {boolean} CB 
 * @property {boolean} CF
 */
/**
 * @typedef {object} CPOut
 * @property {string|undefined} command_base
 * @property {string|undefined} command_file
 * @property {Array|undefined} additional 
 * @property {object|undefined} keys 
 * @property {object|undefined} properties 
 */
/**
 * 
 * @param {string[]} args Arguments from command line
 * @param {CPOptions} options Options to
 * @param {String|Array|undefined} pre_comm Command before main command
 * @param {number} mode OUTPUT MODE
 * @returns {CPOut} 
 */
module.exports = function(args,options = {CB:true,CF:true},pre_comm,mode=0){
    /**
     * @type {string[]}
     */
    var my_args = args; //Saving copy
    if(pre_comm){
        if(typeof pre_comm === "string"){
            if(my_args.includes(pre_comm)){
                my_args.splice(my_args.indexOf(pre_comm),1);
                mode >= 4 && console.debug(`Element ${pre_comm} founded and deleted.`)
            }else{
                mode >= 1 && console.warn(`Element ${pre_comm} not found in command. Skipping...`);
            }
        }
        if(Array.isArray(pre_comm)){
            for(var el of pre_comm){
                if(my_args.includes(el)){
                    my_args.splice(my_args.indexOf(el),1);
                    mode >= 4 && console.debug(`Element ${el} founded and deleted.`)
                }else{
                    mode >= 1 && console.warn(`Element ${el} not found in command. Skipping...`);
                }
            }
        }else{
            mode >= 4 && console.debug(`No before command element. Continuing...`)
        }
    }
    /**
     * @type {CPOut}
     */
    var my_return = {}
    mode >= 4 && console.debug(`Forming return value. Continuing...`)
    my_return.command_base = (options.CB)? my_args.shift():undefined;
    my_return.command_file = (options.CF)? my_args.shift():undefined;
    my_return.additional = [];
    my_return.keys = {};
    my_return.properties = {};
    mode >= 4 && console.debug(`Base formed. Continuing...`)
    var current_prop = undefined;
    
    for(var el of my_args){
        if(el.startsWith("--")||el.startsWith("-")){
            if(el.indexOf("=")>=0) {
                mode >= 4 && console.debug(`Prop with =. Continuing...`)
                var elm = el.split("=");
                elm[0]= (elm[0].startsWith("--"))? elm[0].substring(2):elm[0].substring(1);
                elm[1]=utc(elm[1])
                my_return.properties[elm[0]]=elm[1];
                continue;
            }
            if(current_prop) my_return.keys[current_prop]=true;
            current_prop = (el.startsWith("--"))? el.substring(2):el.substring(1);
            mode >= 4 && console.debug(`Prop or key. Continuing...`)
        }else{
            if(current_prop){
                my_return.properties[current_prop]=el;
                current_prop = undefined;
                mode >= 4 && console.debug(`Prop. Continuing...`)
            }else{
                my_return.additional.push(el);
                mode >= 4 && console.debug(`Additional. Continuing...`)
            }
        }
    }
    mode >= 4 && console.debug(`Current prop ${current_prop}`)
    if(current_prop) my_return.keys[current_prop]=true;
    mode >= 4 && console.debug(`Exiting...`)
    return my_return;
}

/**
 * 
 * @param {string} elm element to convert
 */
function utc(elm){
    var base_type = "string";
    if(!isNaN(elm)){
        nancheck: {
            var e_checker = true;
            for(var ch in elm){
                if(elm[ch]=="."||(elm[ch]>="0"&&elm[ch]<='9')) continue;
                else if(elm[ch]=='e'&&ch>0&&e_checker) { e_checker=false; continue;}
                else if(elm[ch]=='-'&&elm[ch-1]=='e') continue;
                else break nancheck; 
            }
            base_type = "number";
        }
    }
    if(base_type==="string") return elm;
    else{
        if(elm.indexOf('e')>=1||elm.indexOf('.')>=0) return parseFloat(elm);
        else return parseInt(elm);
    }
}