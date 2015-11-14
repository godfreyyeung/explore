/* graph visualization API */

// setup function

// create a node with name and uri properties

	// push node function

// connect new nodes with existing nodes

	// create a link between two nodes

// spawn classes of which node is instance of

// spawn node parent classes

// how to get a node's children?

// graph start
// call start to update graph. Important for binding appropriate behavior to
// newly entered nodes.
function start() {
  // get update selection // bind 'link' svg elems to 'links' data bound to force graph
  link = link.data(force.links(), function(d) { return d.source.id + "-" + d.target.id; });
  // access enter selection containing new nodes and define enter behavior for them
  link.enter().insert("line", ".node").attr("class", "link");
  link.exit().remove();

  // similarly for nodes
  node = node.data(force.nodes(), function(d) { return d.id;});
  node.enter().append("circle").attr("class", function(d) { return "node " + d.id; }).attr("r", 50);
  node.exit().remove();

  force.start();
}

// nodes and link data

var width = 960,
    height = 500;

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

var nodes = [],
    links = [];

var node = svg.selectAll(".node"),
    link = svg.selectAll(".link");

function tick() {
	// update node and link SVG positions to reflect that of their
	// underyling counterparts in the force layout graph
  node.attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; })

  link.attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });
}

