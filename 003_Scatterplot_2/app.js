var width = 500;
var height = 500;
var padding = 30;

var filteredRegionData = regionData.filter(function(d){
  return d.adultLiteracyRate !== null && d.subscribersPer100 !== null ;
  })

var yScale = d3.scaleLinear()
                .domain(d3.extent(filteredRegionData
                  , d => d.subscribersPer100))
                .range([height - padding, padding]);

var xScale = d3.scaleLinear()
                .domain(d3.extent(filteredRegionData
                  , d => d.adultLiteracyRate))
                .range([padding, width - padding]);

var xAxis = d3.axisBottom(xScale)
                .tickSize(-height + 2*padding)
                .tickSizeOuter(0)

var yAxis = d3.axisLeft(yScale)
                .tickSize(-width + 2*padding)
                .tickSizeOuter(0)

var radiusScale = d3.scaleLinear()
                      .domain(d3.extent(filteredRegionData
                        , d => d.subscribersPer100))
                      .range([2, 40])

d3.select("svg")
    .append("g")
      .attr("transform", "translate(0," + (height-padding) + ")")
      .call(xAxis);

d3.select("svg")
    .append("g")
      .attr("transform", "translate(" + padding + ",0)")
      .call(yAxis);

d3.select("svg")
    .attr("width", width)
    .attr("height", height)
  .selectAll("circle")
  .data(filteredRegionData)
  .enter()
  .append("circle")
    .attr("cx", d=> xScale(d.adultLiteracyRate))
    .attr("cy", d=> yScale(d.subscribersPer100))
    .attr("r", 5);

d3.select("svg")
    .append("text")
      .attr("x", width/2)
      .attr("y", height-padding)
      .attr("dy", "1.5em")
      .style("text-anchor", "middle")
      .text("Literacy Rate, Aged 15 and Up")

d3.select("svg")
    .append("text")
      .attr("x", width/2)
      .attr("y", padding)
      .style("text-anchor", "middle")
      .style("font-size", "1.5em")
      .text("Cellular Subscriptions vs. Literacy Rate")

d3.select("svg")
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height/2)
      .attr("y", padding)
      .attr("dy", "-1.2em")
      .style("text-anchor", "middle")
      .text("Cellular Subscribers per 100 People")