//Width and height
var w = 1800;
var h = 800;
var padding = 100;

//Dynamic, random dataset
var dataset = [];					//Initialize empty array
//var numDataPoints = 50;				//Number of dummy data points to create
var xRange = 1500;	//Max range of new x values
var yRange = 300;	//Max range of new y values

d3.csv("http://mouseover.nl/csv/filmdeathcounts.csv", function(data) {
	data.forEach( function(d) {
		dataset.push([d.Film, d.Body_Count, d.Length_Minutes, d.IMDB_Rating]);
	});
	draw();
});

function draw() {
	//Create scale functions
	var xScale = d3.scale.linear()
						 .domain([0, d3.max(dataset, function(d) { return d[1]; })])
						 .range([padding, w - padding * 2]);

	var yScale = d3.scale.linear()
						 .domain([0, d3.max(dataset, function(d) { return d[3]; })])
						 .range([h - padding, padding]);

	var rScale = d3.scale.linear()
						 .domain([0, d3.max(dataset, function(d) { return d[3]; })])
						 .range([2, 5]);

	//Define X axis
	var xAxis = d3.svg.axis()
					  .scale(xScale)
					  .orient("bottom")
					  .ticks(10);

	//Define Y axis
	var yAxis = d3.svg.axis()
					  .scale(yScale)
					  .orient("left")
					  .ticks(5);

	//Create SVG element
	var svg = d3.select("body")
				.append("svg")
				.attr("width", w)
				.attr("height", h);

	//Create circles
	svg.selectAll("circle")
	   .data(dataset)
	   .enter()
	   .append("circle")
	   .attr("cx", function(d) {
	   		return xScale(d[1]);
	   })
	   .attr("cy", function(d) {
	   		return yScale(d[3]);
	   })
	   .attr("r", function(d) {
	   		return rScale(d[2]);
	   })
		 .on('mouseover', function(d){
			 tooltip.style('display', 'block')
			 				.style('left', (d3.event.pageX + 10) + "px")
			 			 	.style('top', (d3.event.pageY + 10) + "px")
			 				.html(d[0] + "<br>Deaths: " + d[1] + "<br>Length: " + d[2] + "<br> IMDB: " + d[3]);
		 });


	//Create labels
	svg.selectAll("text")
	   .data(dataset)
	   .enter()
	   .append("text")
	   .text(function(d) {
	   		return d[0];
	   })
	   .attr("x", function(d) {
	   		return xScale(d[1]);
	   })
	   .attr("y", function(d) {
	   		return yScale(d[3]);
	   })
	   .attr("font-family", "sans-serif")
	   .attr("font-size", "11px")
	   .attr("fill", "red");


	//Create X axis
	svg.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(0," + (h - padding) + ")")
		.call(xAxis);

	//Create Y axis
	svg.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(" + padding + ",0)")
		.call(yAxis);

	var tooltip = d3.select('body')
									.append('div')
									.attr('class', 'tooltip');
}
