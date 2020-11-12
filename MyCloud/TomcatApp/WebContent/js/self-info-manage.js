// Chart.js scripts
// -- Set new default font family and font color to mimic Bootstrap's default styling
syncNotification();

Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#292b2c';

$.ajax({//加载usage表
  url:GET_USAGE_URL,
  type:'post',
  dataType:"json",
  xhrFields: {
      withCredentials: true
  },
  success:function(data) {
    if(data==null) {alert('登陆已失效，请重新登陆！');window.location.href= 'login.html';return;}
    var type = 'pie';
    var usageArr = [0,0,0,0,0,0];
    for(i=0;i<5 && data[i]!=null;i++) {
      if(data[i].catagory=='video') usageArr[0] = data[i]["SUM(size)"]/capacity*100;
      if(data[i].catagory=='audio') usageArr[1] = data[i]["SUM(size)"]/capacity*100;
      if(data[i].catagory=='image') usageArr[2] = data[i]["SUM(size)"]/capacity*100;
      if(data[i].catagory=='unknown') usageArr[3] = data[i]["SUM(size)"]/capacity*100;
      if(data[i].catagory=='document') usageArr[4] = data[i]["SUM(size)"]/capacity*100;
    }
    usageArr[5] = 100-usageArr[0]-usageArr[1]-usageArr[2]-usageArr[3]-usageArr[4];
    console.log(usageArr);
    var chartData = [['视频','音乐','图片','其他','文档','未使用'],usageArr,['#007bff', '#dc3545', '#ffc107', '#28a745','#CD00CD', '#B0C4DE']];
    createNewChart(type,chartData);
  },
  error:function(XMLHttpRequest, textStatus, errorThrown) {
      alert('A Serious Err Ocured ! [sync path]');
      window.location.href= LOGIN_URL;
  },
});

$.ajax({//加载我的信息
  url:GET_MYINFO_URL,
  type:'post',
  dataType:"json",
  xhrFields: {
      withCredentials: true
  },
  success:function(data) {
    console.log(data);
    renderMyInfoPanel(data);
  },
  error:function(XMLHttpRequest, textStatus, errorThrown) {
      alert('A Serious Err Ocured ! [sync path]');
      window.location.href= LOGIN_URL;
  },
});
// onload

function renderMyInfoPanel(data) {
  document.getElementById('select_age').value=data.age;
  renderTags(data.tag);
  if(data.gender=='male') document.getElementById("customRadioInline1").checked=true;
  if(data.gender=='female') document.getElementById("customRadioInline2").checked=true;
  document.getElementById('qq').value = data.qq;
  document.getElementById('tel').value = data.tel;
  document.getElementById('self_intruction').value = data.self_intruction;
}

function renderTags(str) {
  console.log('ready to render tags: ',str);
}

function createNewChart(type,chartData){
    switch(type){
        case 'pie':
            createNewPieChart(chartData);
            break;
        case '':
            break;
        default:
            break;
    }
}
// -- Pie Chart
function createNewPieChart(chartData){//labels data backgroundColor
    var ctx = document.getElementById("usagePieChart");
    var myChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: chartData[0],
            datasets: [{
                data: chartData[1],
                backgroundColor: chartData[2],
            }],
        },
    });
}
