var xlsx = require('node-xlsx').default;
var fs = require('fs');
var htmlData = require('./document.js');
var config = require('./config.js');


let XLSX = {
   foodFee: 0,
   taxFee: 0,
   finalData: [[ '员工 ID', '姓名', '部门名称', '打卡时间', '进/出', '加班误餐费', '交通费', '合计' ]]
}

XLSX.init =  function () {
    htmlData.init().then(function(data){
        this.finalFileName = XLSX.getMonth() + "费用报销表.xlsx";
        setTimeout(() => {
            for(let item of data) { 
                let filePath = config.path+ item.name + '.' + config.extension;
                let res = XLSX.readFile(filePath);
                if (item.taxi != res.taxi || item.food != res.food || data.all != res.all) {
                    console.log(item.name, ' TAXI ', res.taxi, ' FOOD ', res.food, ' ALL ', res.all);
                }
            }
            XLSX.addExtral();

            fs.writeFileSync(this.finalFileName, xlsx.build([{
                name: 'sheet1',
                data: this.finalData
            }]), {'flag':'w'});
        }, 2000);
    });
}
XLSX.readFile = function (filePath) {
    var thisTaxFee = 0;
    var thisFoodFee = 0;
    var data = xlsx.parse(filePath);
    data = data[0].data;
    for (var i = 0; i < data.length; i++) {
      if(data[i].length && data[i][3] && data[i][3] !== '' && data[i][3] !== '打卡时间'){
        this.finalData.push(data[i]);
        thisFoodFee = thisFoodFee + (data[i][5]?data[i][5]:0);
        thisTaxFee = thisTaxFee + (data[i][6]?data[i][6]:0);
      }
    };
    this.foodFee = this.foodFee + thisFoodFee;
    this.taxFee = this.taxFee + thisTaxFee;
    return {
        taxi: thisTaxFee,
        food: thisFoodFee,
        all: thisFoodFee + thisTaxFee
    }
};

XLSX.getMonth = function () {
  var now = new Date();
  var result = (now.getFullYear() - 2000) + (now.getMonth().length === 1 ? now.getMonth() : '0'+now.getMonth());
  return result;
}
XLSX.addExtral = function () {
    console.log('');
    console.log('( 用户产品三组 (28) ) -- 本月汇总：', (this.foodFee + this.taxFee) ,' ，打车：', this.taxFee, '，餐补：', this.foodFee);
    this.finalData.push([ , , , , , , , ])
    this.finalData.push([ , , , , , , , ])
    this.finalData.push([ , , , , , , '报销金额:', this.foodFee + this.taxFee ])
    this.finalData.push([ , , , , , , '餐饮发票:', this.foodFee ])
    this.finalData.push([ , , , , , , '交通费发票:', this.taxFee ])
}
module.exports = XLSX;