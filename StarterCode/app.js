// @TODO: YOUR CODE HERE!
djData = ""
d3.csv("data.csv").then(healthData=> {
    console.log(healthData);
    healthData.forEach(function(state){
        //parse data
        state.poverty = +state.poverty;
        state.abbr = state.abbr;
        state.income = +state.income;
        state.obesity= +state.obesity;
    })
    djData = healthData;
    init();
});

var svgWidth = 960;
var svgHeight = 500;
    
    var margin = {
      top: 20,
      right: 40,
      bottom: 80,
      left: 50
    };

    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;

    //start init function
function init(){
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  .attr("class", "chart");

  var chartGroup = svg.append("g")
.attr("transform", `translate(${margin.left}, ${margin.top})`);

  var chosenXAxis = "poverty";
  var Scalex = xScale(djData, chosenXAxis)
  var chosenYAxis = "obesity"
  var Scaley = yScale(djData, chosenYAxis)

  var xlabel = svg.append("g")
  xlabel.attr("transform", `translate(${width / 2}, ${height + 20})`);
  xlabel.append("text")
    .text (chosenXAxis)
    .attr("y", 26)
    

  var ylabel = svg.append("g")
  ylabel.attr("transform", `translate(-20, ${height})`);
  ylabel.append("text")
    .text (chosenYAxis)
    .attr("y", 26)
    .attr("transform", "rotate (-90)")



  x_axis_new = d3.axisBottom(Scalex).ticks(10)
  y_axis_new = d3.axisLeft(Scaley).ticks(10)

  var create_x_axis = svg.append("g")
  .classed("x-axis", true) //create class for css styling
  .attr("transform", `translate(0, ${height})`)
  .call(x_axis_new)

  var create_y_axis = svg.append("g")
  .classed("y-axis", true)
  .attr("transform", `translate(${margin.left}, ${margin.top})`)
  .call(y_axis_new)

  





  

  var circlesGroup = chartGroup.selectAll("circle")
    .data(djData)
    .enter()
    .append("circle")
    .attr("cx", d => Scalex(d[chosenXAxis]))
    .attr("cy", d => Scaley(d[chosenYAxis]))
    .attr("r", 5)
    .attr("fill", "blue")
    .attr("opacity", ".5");
  updateToolTip(chosenXAxis, circlesGroup)
  

 renderAxes(x_scale, chosenXAxis)

}
//End Init Function

// create scales
function xScale(data, chosenXAxis) {

var xLinearScale = d3.scaleLinear()
    .domain([d3.min(data, d => d[chosenXAxis]) * .8,
    d3.max(data, d => d[chosenXAxis]) * 1.2
])
    .range([0, width]);

return xLinearScale;
}

function yScale(data, chosenYAxis) {
    var yLinearScale = d3.scaleLinear()
    .domain([d3.min(data, d => d[chosenYAxis]) * .8,
    d3.max(data, d => d[chosenYAxis]) * 1.2
])
    .range([0, height]);
return yLinearScale;
}
  // Create initial axis functions

function renderAxes(newXScale, xAxis) {
var bottomAxis = d3.axisBottom(newXScale);
var leftAxis = d3.axisLeft(yLinearScale);

// append x axis
var xAxis = chartGroup.append("g")
.classed("x-axis", true)
.attr("transform", `translate(0, ${height})`)
.call(bottomAxis);

  // append y axis
  chartGroup.append("g")
    .call(leftAxis);
  
xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

return xAxis;
}

function updateToolTip(chosenXAxis, circlesGroup) {

    var label;
  
    if (chosenXAxis === "poverty") {
      label = "Poverty:";
    }
    else {
      label = "Income";
    }
  
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([40, -60])
      .html(function(d) {
        return (`${d.state}<br>${label} ${d[chosenXAxis]}`);
      });
  
    circlesGroup.call(toolTip);
  
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });
  
    return circlesGroup;
  }
