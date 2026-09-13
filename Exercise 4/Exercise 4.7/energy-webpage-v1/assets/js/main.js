const svg = d3.select(".responsive-svg-container")
    .append("svg")
      .attr("viewBox", "0 0 700 500")
      .style("border", "1px solid black");


d3.csv("./data/tvBrandCount.csv", d => {
  return {
    brand: d.brand,
    count: +d.count //=> converts to number
  };
})
.then(data => {
  console.log(data);
  console.log(data.length);
  console.log(d3.max(data, d => d.count));
  console.log(d3.min(data, d => d.count));
  console.log(d3.extent(data, d => d.count)); //=> array with min and max;
  data.sort((a, b) => b.count - a.count);
  drawBarChart(data);
  });

  const drawBarChart = data => {
  
  const xScale = d3.scaleLinear()
  .domain([0, 1100])
  .range([0, 500]);

  const yScale = d3.scaleBand()
 .domain(data.map(d => d.brand))
 .range([0, 500])
 .padding(0.1);

  //const barHeight = 20;
  //const barSpacing = 5;

  const barAndLabel = svg
  .selectAll("g")
  .data(data)
  .join("g")
  .attr("transform", d => `translate(0, ${yScale(d.brand)})`);

  barAndLabel
  .append("rect")
  .attr("x", 120)
   .attr("y", 0)
   .attr("width", d => xScale(d.count))
   .attr("height", yScale.bandwidth())
   .attr("fill", "blue");


   barAndLabel
  .append("text")
  .text(d => d.brand)
  .attr("x", 110)
  .attr("y", 12)
  .attr("text-anchor", "end")
  .style("font-size", "13px");

      barAndLabel
    .append("text")
    .text(d => d.count)
    .attr("x", d => 120 + xScale(d.count) + 4)
    .attr("y", 12)
    .style("font-size", "11px");



 };