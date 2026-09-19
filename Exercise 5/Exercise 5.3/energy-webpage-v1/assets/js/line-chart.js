d3.csv("./data/ARE_Spot_Prices.csv", d => {
  return {
    Year: +d.Year,
    Average_Price: +d["Average Price"]
  };
})
.then(data => {
  console.log(data);
  console.log(data.length);
  data.sort((a, b) => a.Year - b.Year);
  drawLineChart(data);
})

const drawLineChart = (data) => {
  const margin = {top: 40, right: 170, bottom: 25, left: 40};
  const width = 1000;
  const height = 500;
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom; 
  
  const maxValue = d3.max(data, d => d.Average_Price);
  
  const svg = d3.select("#line-chart")
    .append("svg")
      .attr("viewBox", `0, 0, ${width}, ${height}`)
      .style("border", "1px solid black");
    
    const innerChart = svg
    .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

  const xScale = d3.scaleLinear()
    .domain(d3.extent(data, d => d.Year))
    .range([0, innerWidth]);

  const yScale = d3.scaleLinear()
    .domain([0, maxValue])
    .range([innerHeight, 0]);


  const bottomAxis = d3.axisBottom(xScale)
    .tickFormat(d3.format("d")); //=> convert to integer
    const leftAxis = d3.axisLeft(yScale);

  innerChart
    .append("g")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(bottomAxis)
      .selectAll("text")
      .attr("font-size", "12px");


      innerChart
      .append("text")
      .text("Average Price ($/MWh)")
      .attr("x", -margin.left)
      .attr("y", -10)
      .attr("text-anchor", "start")
      .attr("font-size", "12px");

  innerChart
    .append("g")
      .call(leftAxis);
    
      innerChart
      .selectAll(".scatter")
      .data(data)
      .join("circle")
        .attr("class", "scatter")
        .attr("cx", d => xScale(d.Year))
        .attr("cy", d => yScale(d.Average_Price))
        .attr("r", 5)
        .attr("fill", "green");

  const lineGenerator = d3.line()
    .x(d => xScale(d.Year))
    .y(d => yScale(d.Average_Price));

  const areaGenerator = d3.area()
    .x(d => xScale(d.Year))
    .y0(innerHeight)
    .y1(d => yScale(d.Average_Price));

  innerChart
    .append("path")
      .attr("d", lineGenerator(data))
      .attr("fill", "none")
      .attr("stroke", "green")
      .attr("stroke-width", 2);

  innerChart
    .append("path")
      .attr("d", areaGenerator(data))
      .attr("fill", "lightgreen")
      .attr("opacity", 0.5);
    }