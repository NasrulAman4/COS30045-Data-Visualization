const drawScatterplot = (data) => {
    const svg = d3.select("#scatterplot")
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`);
        innerChartS = svg
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const maxStar = d3.max(data, d => d.star);
    const maxEnergy = d3.max(data, d => d.energyConsumption);    

    xScaleS
    .domain([0, maxStar])
    .range([0, innerWidth]);

    yScaleS
    .domain([0, maxEnergy])
    .range([innerHeight, 0])
    .nice();   

    colorScale
    .domain(data.map(d => d.screenTech))
    .range(d3.schemeCategory10);

    innerChartS
    .selectAll("circle")
    .data(data)
    .join("circle")
    .attr("cx", d => xScaleS(d.star))
    .attr("cy", d => yScaleS(d.energyConsumption))
    .attr("r", 5)
    .attr("fill", d => colorScale(d.screenTech))
    .attr("opacity", 0.5);
    
    const bottomAxis = d3.axisBottom(xScaleS).ticks(maxStar);
    const leftAxis = d3.axisLeft(yScaleS);

    innerChartS
    .append("g")
    .attr("transform", `translate(0, ${innerHeight})`)
    .call(bottomAxis);
    innerChartS
    .append("g")
    .call(leftAxis);

    innerChartS
    .append("text")
    .attr("x", innerWidth / 2)
    .attr("y", innerHeight + margin.bottom - 10)
    .attr("text-anchor", "middle")
    .text("Star Rating");

    innerChartS
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -innerHeight / 2)
    .attr("y", -margin.left + 15)
    .attr("text-anchor", "middle")
    .text("Energy Consumption (kWh)");


    const legend = svg
    .append("g")
    .attr("transform", `translate(${width - 100}, ${margin.top})`);

colorScale.domain().forEach((screenTech, i) => {
    const legendRow = legend
    .append("g")
    .attr("transform", `translate(0, ${i * 20})`);

    legendRow
    .append("rect")
    .attr("width", 10)
    .attr("height", 10)
    .attr("fill", colorScale(screenTech));

    legendRow
    .append("text")
    .attr("x", 20)
    .attr("y", 10)
    .attr("text-anchor", "start")
    .style("alignment-baseline", "middle")
    .text(screenTech);

    } );


};

const updateScatterplot = (data) => {
    const filteredData = data.filter(tv => {
        const matchesTech = selectedTechFilter === "all" || tv.screenTech === selectedTechFilter;
        const matchesSize = selectedSizeFilter === "all" || tv.screenSize === selectedSizeFilter;
        return matchesTech && matchesSize;
    });

    const duration = 500;
    const ease = d3.easeCubicInOut;

    innerChartS
    .selectAll("circle")
    .data(filteredData)
    .join(
        enter => enter.append("circle")
            .attr("cx", d => xScaleS(d.star))
            .attr("cy", d => yScaleS(d.energyConsumption))
            .attr("r", 5)
            .attr("fill", d => colorScale(d.screenTech))
            .attr("opacity", 0)
            .call(enter => enter.transition().duration(duration).ease(ease).attr("opacity", 0.5)),
        update => update
            .transition()
            .duration(duration)
            .ease(ease)
            .attr("cx", d => xScaleS(d.star))
            .attr("cy", d => yScaleS(d.energyConsumption))
            .attr("fill", d => colorScale(d.screenTech))
            .attr("opacity", 0.5),
        exit => exit
            .transition()
            .duration(duration)
            .ease(ease)
            .attr("opacity", 0)
            .remove()
    );

    handleMouseEvents();
};