let windowWidth =document.documentElement["clientWidth"]

window.onresize = function(){
    location.reload()
}
queue()
    .defer(d3.csv, "salaries.csv")
    .await(makeGraph);

function makeGraph(error, transactionsData) {
    let ndx = crossfilter(transactionsData);
    
    let chartWidth =  300;
    
    if (windowWidth< 768){
        chartWidth = windowWidth
    } else {
        chartWidth = windowWidth/5
    }
    let genderDim = ndx.dimension(dc.pluck("sex"));
    let salaryByGender = genderDim.group().reduce(
        function(c, v){
            //add function,run once for each record that's added to the group
            c.count++;
            c.total += +v.salary;
            c.average = c.total / c.count;
            return c;
            
        },
        function(c,v){
            //Remove function,run once fo each record that's removed from the group
            c.count --;
            c.total -= +v.salary;
            c.average = c.total / c.count;
            return c;
        },
        function(){
            //Initiliser function,Referred to as c in add or remove function above
            return{count :0, total :0, average:0,};
        })
        
        let salaryChart = dc.barChart("#salaryByGender");
        
        salaryChart
            .width(chartWidth)
            .height(150)
            .margins({top:20, right:20, bottom :50, left:50})
            .dimension(genderDim)
            .group(salaryByGender)
            .valueAccessor(function(c){
                return c.value.average
            })
            .x(d3.scale.ordinal())
            .xUnits(dc.units.ordinal)
            .xAxisLabel("Gender")
            .yAxis().ticks(6)
            
    let rankDim = ndx.dimension(dc.pluck("rank"));
    let rankGroup = rankDim.group()
    let numberOfRank = rankDim.group().reduceSum(dc.pluck("rank"));

        let rankChart = dc.pieChart("#rankChart")
        
        rankChart
            .width(300)
            .radius(150)
            .dimension(rankDim)
            .group(rankGroup)
    
    dc.renderAll();

}
