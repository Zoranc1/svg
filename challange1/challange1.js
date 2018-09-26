queue()
    .defer(d3.csv, "life_expectancy_new.csv ")
    .await(makeGraph);

function makeGraph(error, transactionsData) {
    let ndx = crossfilter(transactionsData);

    // let parseDate = d3.time.format("%d/%m/%Y").parse;

    // transactionsData.forEach(function(d) {
    //     d.year = parseDate(d.date);
    // });

    // let dateDim = ndx.dimension(dc.pluck("date"));

    // let minDate = dateDim.bottom(1)[0].date;
    // let maxDate = dateDim.top(1)[0].date;
    
    
    let countryDim = ndx.dimension(dc.pluck("country"));
    let countryGroup =countryDim.group();
    
    let countryPie = dc.pieChart("#countryPieChart")
    
    countryPie
        .width(300)
        .radius(150)
        .group(countryGroup)
        .dimension(countryDim)
        
    let femaleDim = ndx.dimension(dc.pluck("country"))
    let femaleAgeGroup = femaleDim.group().reduce(
        function(c,v){
            c.count++;
            c.total +=+v.female;
            c.average = c.total / c.count;
            return c;
        },
        function(c,v) {
            c.count--;
            c.total -= +v.female;
            c.average = c.total / c.count;
            return c;
            
        },
        function(){
            return {
                 count:0, total:0, average:0}
        })
    let femaleChart = dc.barChart("#femaleAge") 
    
    femaleChart
        .width(450)
        .height(200)
        .margins({top:20, right:30, bottom:40, left:40})
        .dimension(femaleDim)
        .group(femaleAgeGroup)
        .valueAccessor(function(c) {
                return c.value.average;
            })
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .xAxisLabel("Female")
        .yAxis().ticks(6);
    
    
     

    
    dc.renderAll();

}
