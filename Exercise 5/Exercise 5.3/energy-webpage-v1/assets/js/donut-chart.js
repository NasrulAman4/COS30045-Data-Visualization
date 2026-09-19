d3.csv("./data/Data_exercise 5.3.csv", d => {
  return {
    Screensize_Category: d["Screensize_Category"],
    Count: +d["Count"] 
  };
})
.then(data => {
  console.log(data);
  console.log(data.length);
  drawDonutChart(data);
})

const drawDonutChart = (data) => {
  const width = 1000;
  const height = 500;
  const radius = Math.min(width, height) / 2 - 20;

  const color= d3.scaleOrdinal()
    .domain(data.map(d => d.Screensize_Category))
    .range(d3.schemeSet2);

    const pie = d3.pie()
    .value(d => d.Count)
    .sort(null);

  const arcGenerator = d3.arc()
    .innerRadius(radius * 0.6) //=> inner radius for donut chart
    .outerRadius(radius * 1); //=> outer radius for donut chart

    const svg = d3.select("#donut-chart")
    .append("svg")
      .attr("viewBox", `0, 0, ${width}, ${height}`)
      .style("border", "1px solid black");

    const innerChart = svg
    .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

      innerChart
      .selectAll("path")
      .data(pie(data))
      .join("path")
      .attr("d", arcGenerator)
      .attr("fill", d => color(d.data.Screensize_Category))
      .attr("stroke", "white")
      .style("stroke-width", "2px");
      
      innerChart
      .selectAll("text")
      .data(pie(data))
      .join("text")
      .text(d => d.data.Screensize_Category)
      .attr("transform", d => `translate(${arcGenerator.centroid(d)})`)
      .style("text-anchor", "middle")
      .style("font-size", 12);

}