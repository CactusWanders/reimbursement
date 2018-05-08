var xlsx = require('node-xlsx').default;
var fs = require('fs');
var htmlData = require('./document.js');
var config = require('./config.js');

let Reimbursement = {
   foodFee: 0,
   taxFee: 0,
   finalData: [config.header]
}

Reimbursement.init =  function () {
    var self = this;
    htmlData.init().then(function(data){
        this.finalFileName = config.path + Reimbursement.getMonth() + "用户三组加班报销表.xlsx";
        setTimeout(() => {
            for(let item of data) {
                let filePath = item.filePath;
                let res = Reimbursement.readFile(filePath);
                let log = '';
                if (item.taxi != res.taxi) {
                    log += ('出租费');
                } else if (item.food != res.food) {
                    log += ('餐补费');
                } else if (item.all != res.all) {
                    log += ('总额');
                }
                console.log(item.name, ' TAXI ', res.taxi, ' FOOD ', res.food, ' ALL ', res.all, log);
            }
            self.finalData.push([ ])
            self.finalData.push([ ])
            self.finalData.push([ , , , , , , '报销金额:', self.foodFee + self.taxFee ])
            self.finalData.push([ , , , , , , '餐饮发票:', self.foodFee ])
            self.finalData.push([ , , , , , , '交通费发票:', self.taxFee ])
            fs.writeFileSync(this.finalFileName, xlsx.build([{
                name: 'sheet1',
                data: self.finalData
            }]), {'flag':'w'});

            console.log('');
            console.log('( 用户产品三组 (28) ) -- 本月汇总：', (self.foodFee + self.taxFee) ,' ，打车：', self.taxFee, '，餐补：', self.foodFee);
        }, 2000);
    });
}
Reimbursement.readFile = function (filePath) {
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

Reimbursement.getMonth = function () {
  var now = new Date();
  var result = (now.getFullYear() - 2000) + (now.getMonth().length === 1 ? now.getMonth() : '0'+now.getMonth());
  return result;
}
module.exports = Reimbursement;
