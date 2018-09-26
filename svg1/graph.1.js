queue()
    .defer(d3.json, "transaction.json")
    .await(makeCharts);

function makeCharts(error, transactionsData){

let ndx = crossfilter(transactionsData);

// let nameDim = ndx.dimension(function(){
//     return d.name;
// });

let makeMyDay = d3.time.format("%d/%m/%Y").parse;

// console.log(makeMyDay("26/09/2018"))
transactionsData.forEach(function(d){
        d.date = makeMyDay(d.date)
})

let nameDim = ndx.dimension(dc.pluck("name"));
let totalSpendPerPerson = nameDim.group().reduceSum(dc.pluck("spend"));

let spendChart = dc.barChart("#chart-goes-here");
let personColors = d3.scale.ordinal().range(["red","green", "blue"])

spendChart
    .width(300)
    .height(150)
    .colorAccessor(function(d){
        return d.key;
    })
    .colors(personColors)
    .dimension(nameDim)
    .group(totalSpendPerPerson)
    .x(d3.scale.ordinal())
    .xUnits(dc.units.ordinal)
    .xAxisLabel("Person")
    .elasticY(true)
    .yAxis().ticks(4)
    
let storeDim = ndx.dimension(dc.pluck("store"));
let totalSpendPerStore = storeDim.group().reduceSum(dc.pluck("spend"));

let storeChart = dc.barChart("#store-chart");

storeChart
    .width(300)
    .height(150)
    .dimension(storeDim)
    .group(totalSpendPerStore)
    .x(d3.scale.ordinal())
    .xUnits(dc.units.ordinal)
    .xAxisLabel("Store")
    .elasticY(true)
    .yAxis().ticks(4)
    
let stateDim = ndx.dimension(dc.pluck("state"));
let totalSpendPerState = stateDim.group().reduceSum(dc.pluck("spend"));

let stateChart = dc.pieChart("#spend-state");

stateChart
    .width(300)
    .radius(150)
    .dimension(stateDim)
    .group(totalSpendPerState)
    
    .transitionDuration(1500)
    
let dateDim = ndx.dimension(dc.pluck("date"));
let totalSpendPerDate = dateDim.group().reduceSum(dc.pluck("spend"));

let minDate = dateDim.bottom(1)[0].date;
let maxDate = dateDim.top(1)[0].date;

// console.log(dateDim.top(1))
// console.log(dateDim.top(1)[0])
// console.log(dateDim.top(1)[0].date)

let lineSpend = dc.lineChart("#line-Chart");
lineSpend
    .width(1000)
    .height(300)
    .dimension(dateDim)
    .group(totalSpendPerDate)
    .x(d3.time.scale().domain([minDate, maxDate]))
    .xAxisLabel("Month")
    .renderHorizontalGridLines(true)
    .renderVerticalGridLines(true)
    .yAxis().ticks(8)

dc.renderAll();
}



