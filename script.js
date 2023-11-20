var darkMode = false;

        function toggleDarkMode() {
            darkMode = !darkMode;
            document.body.classList.toggle('dark-mode', darkMode);
            updateTextColors();
            updateLegendStyle(); // Add this line to update the legend style
        }

        function updateTextColors() {
            var textColor = darkMode ? '#fff' : '#000';
            d3.selectAll('text')
                .style('fill', textColor);
        }

        function updateLegendStyle() {
            var legendBackgroundColor = darkMode ? '#444' : '#fff';
            var legendTextColor = darkMode ? '#fff' : '#000';

            document.getElementById('school-legend').style.backgroundColor = legendBackgroundColor;
            document.getElementById('school-legend').style.color = legendTextColor;
        }

        var svgWidthPercentage = 100;
        var svgHeightPercentage = 100;

        var width = window.innerWidth * (svgWidthPercentage / 100);
        var height = window.innerWidth * (svgHeightPercentage / 100);

        var svg = d3.select("#my_dataviz").append("svg")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("viewBox", "0 0 " + width + " " + height)
            .attr("preserveAspectRatio", "xMidYMid meet");

        var color = d3.scaleOrdinal()
                .range(['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf',
                        '#aec7e8', '#ffbb78', '#98df8a', '#ff9896', '#c5b0d5', '#c49c94', '#f7b6d2', '#c7c7c7', '#dbdb8d', '#9edae5',
                        '#393b79', '#637939', '#8c6d31', '#843c39', '#7b4173', '#5254a3', '#6b6ecf', '#9c9ede', '#637939', '#8c6d31',
                        '#bd9e39', '#8c6d31', '#e7ba52', '#843c39', '#843c39', '#843c39', '#843c39', '#843c39', '#843c39', '#843c39']);

        var simulation = d3.forceSimulation()
            .force("link", d3.forceLink().distance(150).strength(0.3).id(function (d) { return d.id; }))
            .force("charge", d3.forceManyBody())
            .force("center", d3.forceCenter(width / 2, height / 2));

        var originalGraph; // Store the original graph data

        d3.json("https://raw.githubusercontent.com/Officialshubham/graphNetwork/master/data1.json", function (error, graph) {
            if (error) throw error;

            originalGraph = graph; // Save the original graph data
            flag = false
            renderGraph(graph,flag);
        });

        function displaySchoolColors() {
            // Get unique school names
            var uniqueSchools = Array.from(new Set(originalGraph.nodes.map(node => node.school)));

            // Create HTML content for the legend
            var htmlContent = uniqueSchools.map(school => `<div><span style="background-color: ${color(school)};"></span>${school}</div>`).join('');

            // Display the legend
            document.getElementById("school-legend").innerHTML = htmlContent;
            document.getElementById("school-legend").style.display = "block";
        }

        function hideSchoolColors() {
            // Hide the legend
            document.getElementById("school-legend").style.display = "none";
        }

        function showLegend() {
            // Show the legend
            document.getElementById("school-legend").style.display = "block";
        }

        function hideLegend() {
            // Hide the legend
            document.getElementById("school-legend").style.display = "none";
        }

        function setupSimulation() {
        simulation = d3.forceSimulation()
            .force("link", d3.forceLink().distance(150).strength(0.3).id(function (d) { return d.id; }))
            .force("charge", d3.forceManyBody())
            .force("center", d3.forceCenter(width / 2, height / 2));
        }


        function renderGraph(graph,flag) {

        
            // Clear previous graph
            svg.selectAll("*").remove();

            //Setup simulation
            setupSimulation();

            // Calculate the count for each node based on the links
            var nodeCounts = {};
            graph.links.forEach(function(link) {
            nodeCounts[link.source] = (nodeCounts[link.source] || 0) + 1;
            });

    
            // function wrap(text, width) {
            //     text.each(function () {
            //         var text = d3.select(this),
            //             words = text.text().split(/\s+/).reverse(),
            //             word,
            //             line = [],
            //             lineNumber = 0,
            //             lineHeight = 1.1, // ems
            //             y = text.attr("y"),
            //             dy = parseFloat(text.attr("dy") || 0),
            //             tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");

            //         while (word = words.pop()) {
            //             line.push(word);
            //             tspan.text(line.join(" "));
            //             if (tspan.node().getComputedTextLength() > width) {
            //                 line.pop();
            //                 tspan.text(line.join(" "));
            //                 line = [word];
            //                 tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
            //             }
            //         }
            //     });
            // }


            var link = svg.append("g")
                .attr("class", "links")
                .selectAll("line")
                .data(graph.links)
                .enter().append("line")
                .attr("stroke-width", function (d) { return Math.sqrt(d.value); });

            var node = svg.append("g")
                .attr("class", "nodes")
                .selectAll("g")
                .data(graph.nodes)
                .enter().append("g");
            
            if(flag==true){
                var circles = node.append("circle")
                .attr("r", 10)
                .attr("fill", function (d) { return color(d.school); })
                .call(d3.drag()
                    .on("start", dragstarted)
                    .on("drag", dragged)
                    .on("end", dragended));
            }
            else{

                var circles = node.append("circle")
                .attr("r", function(d){return Math.sqrt(nodeCounts[d.id]) * 3})
                .attr("fill", function (d) { return color(d.school); })
                .call(d3.drag()
                    .on("start", dragstarted)
                    .on("drag", dragged)
                    .on("end", dragended));

            }

            

                var labels = node.append("text")
                .text(function (d) {
                    return d.name;
                })
                .attr('x', 15)
                .attr('y', 3);
                // .call(wrap,100);

            if(flag==true){
                // Add a label force to the simulation
                var labelForce = d3.forceManyBody().strength(-150); // You can adjust the strength as needed

                // Add the label force to the simulation
                simulation.force("label", labelForce);

                // Start the simulation
                simulation.alpha(1).restart();

            }

            node.append("title")
                .text(function (d) { return d.name; });

            simulation
                .nodes(graph.nodes)
                .on("tick", ticked);

            simulation.force("link")
                .links(graph.links);

            // Add zoom behavior
            var zoom = d3.zoom()
                .scaleExtent([1, 8])
                .on("zoom", zoomed);

            svg.call(zoom);

            function ticked() {
                link
                    .attr("x1", function (d) { return d.source.x; })
                    .attr("y1", function (d) { return d.source.y; })
                    .attr("x2", function (d) { return d.target.x; })
                    .attr("y2", function (d) { return d.target.y; });

                node
                    .attr("transform", function (d) {
                        return "translate(" + d.x + "," + d.y + ")";
                    });
            }

            function zoomed() {
                svg.selectAll(".nodes, .links")
                    .attr("transform", d3.event.transform);
            }

            // Update text colors based on dark mode
            updateTextColors();
        }


        function searchRenderGraph(graph,flag) {

            //Setup simulation
            setupSimulation();
            renderGraph(graph,flag)

        }


        function dragstarted(d) {
            if (!d3.event.active) simulation.alphaTarget(0.9).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(d) {
            d.fx = d3.event.x;
            d.fy = d3.event.y;
        }

        function dragended(d) {
            if (!d3.event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }

        function searchNodes() {
            var searchValue = document.getElementById("search").value.toLowerCase();

            // Filter nodes based on the search value
            var filteredNodes = originalGraph.nodes.filter(function (node) {
                return node.name.toLowerCase().includes(searchValue);
            });

            // Filter links based on the filtered nodes
            var filteredLinks = originalGraph.links.filter(function (link) {
                return filteredNodes.some(function (node) {
                    return node.id === link.source.id || node.id === link.target.id;
                });
            });

            // Extract unique connected nodes from the filtered links
            var connectedNodes = filteredLinks.reduce(function (acc, link) {
                acc.add(link.source.id);
                acc.add(link.target.id);
                return acc;
            }, new Set());

            // Merge the connected nodes with the filtered nodes
            var allFilteredNodes = filteredNodes.concat(Array.from(connectedNodes).map(function (id) {
                return originalGraph.nodes.find(function (node) {
                    return node.id === id;
                });
            }));

            // Create a new graph with filtered nodes and links
            var filteredGraph = {
                nodes: allFilteredNodes,
                links: filteredLinks
            };

            // Render the graph with the filtered data
            searchRenderGraph(filteredGraph,true);

            // // Update the simulation with the filtered nodes
            // simulation.nodes(allFilteredNodes);

            // // Restart the simulation
            // simulation.alpha(1).restart();
        }