var xlsx = require('node-xlsx').default;
var fs = require('fs');

var readFile = function (fileName, user) {
    function fillSpace (v) {
        v = v + '';
        while(v.length < 7){
            v = v + ' ';
        }
        return v;
    }
    var thisTaxFee = 0;
    var thisFoodFee = 0;
    var data = xlsx.parse(__dirname+'/bx/'+fileName);
    data = data[0].data;
    for (var i = 0; i < data.length; i++) {
      if(data[i].length && data[i][3] && data[i][3] !== '' && data[i][3] !== '打卡时间'){
        finalData.push(data[i]);
        thisFoodFee = thisFoodFee + (data[i][5]?data[i][5]:0);
        thisTaxFee = thisTaxFee + (data[i][6]?data[i][6]:0);
      }
    };
    console.log( user, '  ', fillSpace(thisTaxFee), fillSpace(thisFoodFee), (thisFoodFee + thisTaxFee));
    foodFee = foodFee + thisFoodFee;
    taxFee = taxFee + thisTaxFee;
};

var getMonth = function () {
  var now = new Date();
  var result = (now.getFullYear() - 2000) + (now.getMonth().length === 1 ? now.getMonth() : '0'+now.getMonth());
  return result;
}
var addExtral = function () {
  console.log('( 用户产品三组 ('+ users.length +') ) -- 本月汇总：', (foodFee + taxFee) ,' ，打车：', taxFee, '，餐补：', foodFee);
  finalData.push([ , , , , , , , ])
  finalData.push([ , , , , , , , ])
  finalData.push([ , , , , , , '报销金额:', foodFee + taxFee ])
  finalData.push([ , , , , , , '餐饮发票:', foodFee ])
  finalData.push([ , , , , , , '交通费发票:', taxFee ])
}

const users = [ '李享','李思瑾','蔡旭光','陈鋆','邓丹梅', '丁姗姗', '涂佳伟', '嵇雪莲','林炎祥','李本志', '李继先', '李茜', '李莹莹', '秦增福', '盛陈灵', '施霞', '宋秀娟', '杨明战', '杨佩芬', '袁友芳', '张扬' ,'王小保', '夏九将', '张明龙', '张秀男', '郑其'];

var finalData = [[ '员工 ID', '姓名', '部门名称', '打卡时间', '进/出', '加班误餐费', '交通费', '合计' ]];
var finalFileName = getMonth() + "费用报销表.xlsx";
var taxFee = 0;
var foodFee = 0;
var fileArr = fs.readdirSync('./bx/');
// var nameReg = new RegExp("^" + getMonth() + "费用报销表-[\\S]*(\.xlsx)$");
console.log("姓  名    taxi    food    all");
for (var k = 0; k < users.length; k++) {
  for (let i in fileArr){
    if (fileArr[i].indexOf(users[k]) !== -1) {
      var user = users[k];
      if (user.length == 2) { user = '  ' + user ;};
      readFile(fileArr[i], user)
    }
  }
}
addExtral();
var buffer = xlsx.build([
  {
      name:'sheet1',
      data:finalData
  }]);
console.log(finalFileName)
fs.writeFileSync(finalFileName, buffer, {'flag':'w'});