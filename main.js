var graph = graphMachine();
graph.start("body", 960, 500);
loadNode(graph, 'https://www.wikidata.org/wiki/Special:EntityData/Q6106.rdf');

/*
 TODO:
	look into effects of diferring
	terms used for classing across dbs

	and/or differing classname
	look into effects of :sameAs
*/