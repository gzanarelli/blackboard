var ctx = document.getElementById("userCountByMonth");
var userCountByMonth = JSON.parse(ctx.dataset.usercountbymonth);

var userCountByMonthLabels = [];
var userCountByMonthData = [];
for(var i=0; i<userCountByMonth.length; i++){
  var key = userCountByMonth[i]._id.year_inscription+"-"+userCountByMonth[i]._id.month_inscription;
  userCountByMonthLabels.push(key);
  userCountByMonthData.push(userCountByMonth[i].usercount);
}

new Chart(ctx, {
    type: 'line',
    data: {
       labels: userCountByMonthLabels,
       datasets: [{

           data: userCountByMonthData,

                   borderColor: '#0fa859',

                   fill: false,

                   borderWidth: 1
       }]
    }
});

//********************************$


var ctx = document.getElementById("userGenderCountByMonth");
var userGenderCountByMonth = JSON.parse(ctx.dataset.usergendercountbymonth);

console.log(userGenderCountByMonth);

var dataAgreg = {male: 0, female: 0};
for(var i=0; i<userGenderCountByMonth.length; i++){
  dataAgreg[userGenderCountByMonth[i]._id.gender] += userGenderCountByMonth[i].usercount;
  // dataAgreg[userGenderCountByMonth[i]._id.gender]  = dataAgreg[userGenderCountByMonth[i]._id.gender]  + userGenderCountByMonth[i].usercount
}

console.log(dataAgreg);

new Chart(ctx, {
    type: 'pie',
    data: {
       labels: [ "male" , "female"],
       datasets: [{

           data: [dataAgreg.male , dataAgreg.female],

           backgroundColor: [
                '#26de81',
                '#fd9644'],

                borderColor: [
            '#0fa859',
            '#e07828'],



                   borderWidth: 1
       }]
    }
});
