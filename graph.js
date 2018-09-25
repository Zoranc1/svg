let transactionsData = [
            { "name": "Tom", "store": "ACME", "state": "NY", "spend": 100 },
            { "name": "Tom", "store": "Big Co", "state": "NY", "spend": 200 },
            { "name": "Bob", "store": "ACME", "state": "FL", "spend": 150 },
            { "name": "Bob", "store": "ACME", "state": "NY", "spend": 200 },
            { "name": "Bob", "store": "Big Co", "state": "FL", "spend": 75 },
            { "name": "Bob", "store": "Big Co", "state": "NY", "spend": 50 },
            { "name": "Alice", "store": "ACME", "state": "FL", "spend": 200 },
            { "name": "Alice", "store": "Big Co", "state": "NY", "spend": 350 },
        ];
let ndx = crossfilter(transactionsData);

// let nameDim = ndx.dimension(function(){
//     return d.name;
// });
let nameDim = ndx.dimension(dc.pluck("name"));
let totalSpendPerPerson = nameDim.group().reduceSum(dc.pluck("spend"));

let spendChart = dc.barChart("#chart-goes-here");
let personColors = d3.scale.ordinal().range(["red","lemonchiffon", "blue"])

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
    .yAxis().ticks(4)
    
let stateDim = ndx.dimension(dc.pluck("state"));
let totalSpendPerState = stateDim.group().reduceSum(dc.pluck("spend"));

let stateChart = dc.pieChart("#spend-state");

stateChart
    .width(300)
    .radius(150)
    .dimension(stateDim)
    .group(totalSpendPerState)
    


dc.renderAll();



