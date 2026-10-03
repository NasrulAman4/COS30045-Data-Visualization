let selectedTechFilter = "all";
let selectedSizeFilter = "all";

const updateHistogram = (data) => {
    const filteredData = data.filter(tv =>{
        const matchesTech = selectedTechFilter === "all" || tv.screenTech === selectedTechFilter;
        const matchesSize = selectedSizeFilter === "all" || tv.screenSize === Number(selectedSizeFilter);
        return matchesTech && matchesSize;
    });

    const updatedBins = binGenerator(filteredData);
    const maxBinLength = d3.max(updatedBins, d => d.length) || 0;
    yScale.domain([0, maxBinLength]).nice();

    const duration = 500;
    const ease = d3.easeCubicInOut;

    d3.select("#histogram .y-axis")
        .transition()
        .duration(duration)
        .ease(ease)
        .call(d3.axisLeft(yScale));

    d3.selectAll("#histogram rect")
        .data(updatedBins)
        .transition()
        .duration(duration)
        .ease(ease)
        .attr("y", d => yScale(d.length))
        .attr("height", d => innerHeight - yScale(d.length));
};

const populateFilters = (data) => {
  d3.select("#filters_screen")
    .selectAll(".filter")
    .data(filters_screen)
    .join("button")
    .attr("class", d => `filter ${d.isActive ? "active" : ""}`)
    .text(d => d.label)
    .on("click", (e, d) => {
        console.log(`Clicked filter:`,e);
        console.log(`Clicked filter data:`,d);
        
        if (!d.isActive) {
            filters_screen.forEach(filter => filter.isActive = (filter.id === d.id));
            d3.selectAll("#filters_screen .filter")
            .classed("active", filter => filter.id === d.id);
            selectedTechFilter = d.id;
            updateHistogram(data);
            updateScatterplot(data);
        }
    });

    d3.select("#filters_size")
    .selectAll(".filter")
    .data(filters_size)
    .join("button")
    .attr("class", d => `filter ${d.isActive ? "active" : ""}`)
    .text(d => d.label)
    .on("click", (e, d) => {
        console.log(`Clicked filter:`,e);
        console.log(`Clicked filter data:`,d);
        
        if (!d.isActive) {
            filters_size.forEach(filter => filter.isActive = (filter.id === d.id));
            d3.selectAll("#filters_size .filter")
            .classed("active", filter => filter.id === d.id);
            selectedSizeFilter = d.id;
            updateHistogram(data);
            updateScatterplot(data);
        }
    });
};

const createTooltip = () => {
    const tooltip = innerChartS
    .append("g")
    .attr("class", "tooltip")
    .style("opacity", 0);

    tooltip
    .append("rect")
    .attr("width", tooltipWidth)
    .attr("height", tooltipHeight)
    .attr("rx", 3)
    .attr("ry", 3)
    .attr("fill", barColor)
    .attr("fill-opacity", 0.75);

    tooltip
    .append("text")
    .text("NA")
    .attr("x", tooltipWidth / 2)
    .attr("y", tooltipHeight / 2 + 2)
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle")
    .attr("fill", "white")
    .style("font-weight", 900);
};

const handleMouseEvents = () => {
    innerChartS
    .selectAll("circle")
    .on("mouseenter", (e, d) => {
        console.log("Mouse entered circle", d);

    d3.select(".tooltip text")
        .text(d.screenSize);
        const cx = e.target.getAttribute("cx");
        const cy = e.target.getAttribute("cy");

    d3.select(".tooltip")
        .attr("transform", `translate(${cx - 0.5 * tooltipWidth}, ${cy - 1.5 * tooltipHeight})`)
        .transition()
        .duration(200)
        .style("opacity", 1);
    })
    .on("mouseleave", (e, d) => {
        console.log("Mouse left circle", d);
        d3.select(".tooltip")
        .style("opacity", 0)
        .attr("transform", `translate(0, 500)`);
    });

}