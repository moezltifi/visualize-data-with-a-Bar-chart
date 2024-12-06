const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

fetch(url)
  .then(response => response.json())
  .then(data => {
    const dataset = data.data;

    const width = 800;
    const height = 400;
    const padding = 50;

    const svg = d3.select("#chart-area")
                  .attr("width", width + padding * 2)
                  .attr("height", height + padding * 2);

    const xScale = d3.scaleTime()
                     .domain([new Date(d3.min(dataset, d => d[0])), new Date(d3.max(dataset, d => d[0]))])
                     .range([padding, width + padding]);

    const yScale = d3.scaleLinear()
                     .domain([0, d3.max(dataset, d => d[1])])
                     .range([height + padding, padding]);

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    svg.append("g")
       .attr("id", "x-axis")
       .attr("transform", `translate(0, ${height + padding})`)
       .call(xAxis);

    svg.append("g")
       .attr("id", "y-axis")
       .attr("transform", `translate(${padding}, 0)`)
       .call(yAxis);

    svg.selectAll(".bar")
       .data(dataset)
       .enter()
       .append("rect")
       .attr("class", "bar")
       .attr("x", d => xScale(new Date(d[0])))
       .attr("y", d => yScale(d[1]))
       .attr("width", width / dataset.length)
       .attr("height", d => height + padding - yScale(d[1]))
       .attr("data-date", d => d[0])
       .attr("data-gdp", d => d[1])
       .on("mouseover", function (event, d) {
         const tooltip = d3.select("#tooltip");
         tooltip.style("visibility", "visible")
                .style("top", `${event.pageY}px`)
                .style("left", `${event.pageX + 10}px`)
                .attr("data-date", d[0])
                .text(`Date: ${d[0]}\nGDP: ${d[1]} Billion`);
       })
       .on("mouseout", () => {
         d3.select("#tooltip").style("visibility", "hidden");
       });
  });