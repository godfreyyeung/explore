
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
  		graphVars.linkSVG = graphVars.linkSVG.data(graphVars.force.links(), function(d) { return d.source.id + "-" + d.target.id; });
  		// access enter selection containing new nodes and define enter behavior for them
  		graphVars.linkSVG.enter().insert("line", ".node").attr("class", "link");
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
      			.attr("fill", "white")
      			.text(function(d) { return d.label });;

      	nodeEnter.append("text")
     			.attr("text-anchor", "middle")
     			.attr("dy", "1em")
      			.attr("fill", "white").attr("font-size", "11px").attr("cursor", "pointer")
      			.text("Parent Classes");

      	nodeEnter.append("text")
     			.attr("text-anchor", "middle")
     			.attr("dy", "2em")
      			.attr("fill", "white").attr("font-size", "11px").attr("cursor", "pointer")
      			.text("Instance Of")
      			.on("click", function(datum, idx){ // datum == node obj with all its properties
      				loadClasses(graph, datum);
      				// 'this' within this function is the text element, as expected since it is calling object
      			});

 		graphVars.nodeSVG.exit().remove();

		graphVars.force.start();
	}

	// returns reference to new node
	graph.addNode = function(uri, type, label, rdf){
		var newNode = {id: uri, type: type, label: label, rdf: rdf}; // create new unique node object
		graphVars.nodes.push(newNode); // append reference to new obj to nodes array
		return newNode;
	}

	graph.returnRDF = function(node){
		return node.rdf;
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
