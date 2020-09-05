var  allMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
var minYear = d3.min(birthData, d=>d.year);
var maxYear = d3.max(birthData, d=>d.year);
var width = 600;
var height = 600;

var quarterColors = ["#1f77b4", "#2ca02c", "#d62728", "#ff7f0e"]

// var months = [];

// for(var i=0; i<birthData.length; i++){
//   var month = birthData[i].month;
//   if(months.indexOf(month) === -1){
//     months.push(month);
//   }
// }

var colorScale = d3.scaleOrdinal()
                      .domain(allMonths)
                      .range(d3.schemeCategory20)

var svg = d3.select("svg")
              .attr("width", width)
              .attr("height", height)

svg
  .append("g")
    .attr("transform", "translate(" + width/2 + ","
            + height/2 + ")")
    .classed("chart", true);

svg
  .append("g")
    .attr("transform", "translate(" + width/2 + ","
            + height/2 + ")")
    .classed("inner-chart", true);

svg
  .append("text")
    .classed("title", true)
    .attr("x", width/2)
    .attr("y", 30)
    .style("font-size", "2em")
    .style("text-anchor", "middle");

d3.select("input")
    .property("min", minYear)
    .property("max", maxYear)
    .property("value", minYear)
    .on("input", () => makeGraph(+d3.event.target.value))

makeGraph(minYear);

function makeGraph(year){
  var yearData = birthData.filter(d => d.year === year);

  var arcs = d3.pie()
                  .value(d => d.births)
                  .sort((a,b) => allMonths.indexOf(a.month) > allMonths.indexOf(b.month))
                  // (yearData);

  var innerArcs = d3.pie()
                      .value(d => d.births)
                      .sort((a,b) => a.quarter - b.quarter);

  // console.log(arcs);

  var path = d3.arc()
                  .outerRadius(width/2 - 40)
                  .innerRadius(width/4)

  var innerPath = d3.arc()
                  .outerRadius(width/4)
                  .innerRadius(0)

  // console.log(path);

  // General Update Pattern
  var outer = d3.select(".chart")
                .selectAll(".arc")
                .data(arcs(yearData));

  var inner = d3.select(".inner-chart")
                .selectAll(".arc")
                .data(innerArcs(getDataByQuarter(yearData)));

  outer
    .enter()
    .append("path")
      .classed("arc", true)
      .attr("fill", d=>colorScale(d.data.month))
    .merge(outer)
      .attr("d", path);

  inner
    .enter()
    .append("path")
      .classed("arc", true)
      .attr("fill", (d, i) => quarterColors[i])
    .merge(inner)
      .attr("d", innerPath);

  d3.select(".title")
      .text("Births by months and quarter for " + year);
}

function getDataByQuarter(data){
  // create an object
  var quarterTallies = [0,1,2,3].map(n => ({quarter:n, births:0}));

  // group months into quarter, then update the creeated object above:
  for(var i=0; i<data.length; i++){
    var row = data[i];
    var quarter = Math.floor(allMonths.indexOf(row.month)/3);
    quarterTallies[quarter].births += row.births;
  }
  return quarterTallies;
}