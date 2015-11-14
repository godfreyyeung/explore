// DOM Setup


// setup graph


var force = d3.layout.force()
    .nodes(nodes)
    .links(links)
    .charge(-400)
    .linkDistance(120)
    .size([width, height])
    .on("tick", tick);

// ad a node and then update graph
var a = {id: "a"};
nodes.push(a);
start();

/* TODO:
	// look into effects of diferring
	// terms used for classing across dbs

	// and/or differing classname
	// look into effects of :sameAs
	*/