var fs = require('fs');
delAllInFoler = (path) => {
    let files = fs.readdirSync(path);
    for (let file of files) {
        let current = path + file;
        if (fs.statSync(path + file).isDirectory()) {
            delAllInFoler(current);
        } else {
            fs.unlink(current)
        }
    }
}
module.exports = { delAllInFoler }
