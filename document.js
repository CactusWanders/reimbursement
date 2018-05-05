var config = require('./config.js');
var http = require('http');
var fs = require('fs');
var cheerio = require('cheerio');
var url = require('url');
var request = require('request');
var xlsx = require('node-xlsx').default;
var XLSX = require('./Reimbursement.js');

let Document = {
    html: '',
    data: []
}

Document.init = function() {
    return new Promise(function (resolve, reject) {
        // 参数url 和 回调函数
        http.get(config.url,function(res){
            let html = '';
            res.on('data', function(data) {
                html = html + data;
            });
            res.on('end', function (res) {
                var $ = cheerio.load(html);
                var t = $('table td a');
                var data = [];
                t.each(function(i, elem) {
                    let currentTD = $(this).closest('td');
                    let href = $(this).attr('href');
                    let name = currentTD.prev('td').text();
                    let req = url.parse(config.url);
                    data.push({
                        href: href,
                        name: name,
                        taxi: currentTD.next('td').text(),
                        food: currentTD.next('td').next('td').text(),
                        all: currentTD.next('td').next('td').next('td').text()
                    });
                    let filePath = config.path + name + '.' + config.extension;

                    request(req.protocol + '//'+ req.host + href).pipe(fs.createWriteStream(filePath));
                });
                resolve(data);
            });
        }).on('error', function(d){
            reject(d);
        });
    });
    
}

Document.getData = function() {
    let promise = this.init();
    promise.then(function(data){
        return data;
    }, function (err) {
        console.log(err);
        return [err];
    });
}

/**
 * http get到的html源字符串赋值给属性html
 * @param {*} data  http response on('data') 返回的数据
 */
Document.onData = function(data) {
    this.html = this.html + data;
}

/**
 * cheerio 解析html，获取数据结构，保存文件
 * @param {*} res http response on('end') 返回的数据
 */
Document.onEnd = function (res) {
    var $ = cheerio.load(this.html);
    var t = $('table td a');
    t.each(function(i, elem) {
        let currentTD = $(this).closest('td');
        let href = $(this).attr('href');
        Document.data.push({
            href: href,
            name: currentTD.prev('td').text(),
            taxi: currentTD.next('td').text(),
            food: currentTD.next('td').next('td').text(),
            all: currentTD.next('td').next('td').next('td').text()
        });
    });
    resolve(this.data);
}
module.exports = Document;


