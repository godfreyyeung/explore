
function graphMachine(){

	var graph = {};

	var graphVars = {};

	// initiate, set up graph whose SVG canvas is within parentDomNode
	// and has size width*height
	graph.start = function(parentDomNode, width, height){

		graphVars.svg = d3.select(parentDomNode).append("svg")
		    .attr("width", width)
		    .attr("height", height);

		graphVars.nodes = [];
		graphVars.links = [];

		graphVars.nodeSVG = graphVars.svg.selectAll(".node");
		graphVars.linkSVG = graphVars.svg.selectAll(".link");

		graphVars.force = d3.layout.force()
		    .nodes(graphVars.nodes)
		    .links(graphVars.links)
		    .charge(-400)
		    .linkDistance(120)
		    .size([width, height])
		    .on("tick", tick);

		graphVars.force.drag().on("dragstart", fixNodePosition);

		// create an arrowhead definition
		graphVars.svg.append("defs").selectAll("marker")
		    .data(["arrowHeadId"])
		  .enter().append("marker")
		    .attr("id", function(d) { return d; })
		    .attr("viewBox", "0 -5 10 10")
		    .attr("refX", 65) // really just need to adjust this in order to accomodate node radius 50
		    .attr("refY", 0)
		    .attr("markerWidth", 6)
		    .attr("markerHeight", 6)
		    .attr("orient", "auto")
		  .append("path")
		    .attr("d", "M0,-5L10,0L0,5")
		    .style("stroke", "black")
		    .style("opacity", "1");
	}

	function fixNodePosition(d){
          d3.select(this).classed("fixed", d.fixed = true);
	}

	function tick() {
		// update node and link SVG positions to reflect that of their
		// underyling counterparts in the force layout graph
		graphVars.nodeSVG.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
		// graphVars.nodeSVG.attr("cx", function(d) { return d.x; })
		//     .attr("cy", function(d) { return d.y; })

		graphVars.linkSVG.attr("x1", function(d) { return d.source.x; })
		    .attr("y1", function(d) { return d.source.y; })
		    .attr("x2", function(d) { return d.target.x; })
		    .attr("y2", function(d) { return d.target.y; });
	}


	// called following every node addition or removal
	// binds appropriate behavior to newly entered nodes
	graph.update = function(){
  		// get update selection // bind 'link' svg elems to 'links' data bound to force graph
  		// Docs: "The key function returns a string which is used to join a datum with its
  		// corresponding element, based on the previously-bound data."
  		// Assuming using this key function the first time that data is bound to links is okay
  		// because the first time sets
  		graphVars.linkSVG = graphVars.linkSVG.data(graphVars.force.links(), function(d) { return d.source.id + "-" + d.target.id; });
  		// access enter selection containing new nodes and define enter behavior for them
  		graphVars.linkSVG.enter().insert("line", ".node").attr("class", "link")
  		.style("marker-end",  "url(#arrowHeadId)"); // Modified line ; // ".node" not ".circle"
  		graphVars.linkSVG.exit().remove();

 		// similarly for nodes
 		graphVars.nodeSVG = graphVars.nodeSVG.data(graphVars.force.nodes(), function(d) { return d.id;});
 		var nodeEnter = graphVars.nodeSVG.enter()
 			.append("g")
 				.attr("class", "node")
 				.call(graphVars.force.drag);
 				// don't append circle/text here so that nodeEnter receives selection of "g"s,
 				// not circles or text

 		nodeEnter.append("circle")
 				.attr("class", function(d) { return "circle " + d.type; }).attr("r", 50)

 		nodeEnter.append("text")
 				.attr("class", "label")
     			.attr("text-anchor", "middle")
      			.attr("dy", "-.5em") // need to set dy else wrap() complains of dy="Nan"?
      			.attr("fill", "white")
      			.attr("stroke", "black")
      			.attr("stroke-width", ".5")
      			.text(function(d) { return d.label });
				//.call(wrap, 70); // first arg passed to wrap is the selected obj calling wrap, in which case it is <text>

      	nodeEnter.append("text")
     			.attr("text-anchor", "middle")
     			.attr("dy", "1.5em")
      			.attr("fill", "white").attr("font-size", "11px").attr("cursor", "pointer")
      			.text("Parent Classes")
      			.on("click", function(datum, idx){ // datum == node obj with all its properties
      				loadParentClasses(graph, datum);
      				// 'this' within this function is the text element, as expected since it is calling object
      			});

      	nodeEnter.append("text")
     			.attr("text-anchor", "middle")
     			.attr("dy", "2.5em")
      			.attr("fill", "white").attr("font-size", "11px").attr("cursor", "pointer")
      			.text("Instance Of")
      			.on("click", function(datum, idx){ // datum == node obj with all its properties
      				loadClasses(graph, datum);
      				// 'this' within this function is the text element, as expected since it is calling object
      			});

      	nodeEnter.append("text")
     			.attr("text-anchor", "middle")
     			.attr("dx", "2.5em")
     			.attr("dy", "-2.5em")
      			.attr("fill", "white").attr("font-size", "11px").attr("cursor", "pointer")
      			.text("X")
      			.on("click", function(datum, idx){ // datum == node obj with all its properties
      				graph.removeNode(datum);
      				// 'this' within this function is the text element, as expected since it is calling object
      			});

 		graphVars.nodeSVG.exit().remove();

		graphVars.force.start();
	}

	// returns reference to new node
	graph.addNode = function(nodeId, type, label, rdf){ // notice parameter naming agnostic of usage by other api
		var newNode = {id: nodeId, type: type, label: label, rdf: rdf}; // create new unique node object
		graphVars.nodes.push(newNode); // append reference to new obj to nodes array
		return newNode;
	}

	graph.getRDF = function(node){
		return node.rdf;
	}

	graph.getNode = function(uriId){
		for(var i = 0; i < graphVars.nodes.length; i++){
			if(graphVars.nodes[i].id == uriId){
				return graphVars.nodes[i];
			}
		}
		return null;
	}

	function removeRelatedLinks(node){
		for(var i = 0; i < graphVars.links.length; i++){
			if(graphVars.links[i].source == node || graphVars.links[i].target == node 
				|| graphVars.links[i].source.id == node.id || graphVars.links[i].target.id == node.id){
				graphVars.links.splice(i, 1);
			}
		}
	}

	graph.removeNode = function(node){
		var nodeIdx = graphVars.nodes.indexOf(node);
		console.log("has index:", nodeIdx);
		graphVars.nodes.splice(nodeIdx, 1);
		console.log(graphVars.links);
		removeRelatedLinks(node);
		console.log(graphVars.links);
		graph.update();
	}

	// create link from node1 to node2
	graph.addLink = function(node1, node2){
		var newLink = {source: node1, target: node2};
		graphVars.links.push(newLink);
		return newLink;
	}

	/* misc utils */
	function wrap(text, width) {
	  text.each(function() {
	    var text = d3.select(this),
	        words = text.text().split(/\s+/).reverse(),
	        word,
	        line = [],
	        lineNumber = 0,
	        lineHeight = 1.1, // ems
	        y = text.attr("y"),
	        dy = parseFloat(text.attr("dy")),
	        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
	    while (word = words.pop()) {
	      line.push(word);
	      tspan.text(line.join(" "));
	      if (tspan.node().getComputedTextLength() > width) {
	        line.pop();
	        tspan.text(line.join(" "));
	        line = [word];
	        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
	      }
	    }
	  });
	}

	return graph;
}


// nodes and link data



/* graph visualization API */

// setup function

// create a node with name and uri properties

	// push node function

// connect new nodes with existing nodes

	// create a link between two nodes

// spawn classes of which node is instance of

// spawn node parent classes

// how to get a node's children?
