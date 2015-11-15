function conceptToDataURL(url){
	var tmp = url;
	newUrl = tmp.replace("entity/", "wiki/Special:EntityData/");
	newUrl = newUrl + ".rdf";
	return newUrl;
}

function loadNode(graph, uri){
  var newRDF = new RDF();
  newRDF.getRDFURL(uri, function(){loadNodeComplete(graph, newRDF, uri)});
}

function loadNodeComplete(graph, rdfObj, uri){
  console.log("check ", rdfObj);
  var rdfLabel = rdfObj.getSingleObject(null, null,"http://schema.org/name", null);
  var newNode = graph.addNode(uri, "instance", rdfLabel, rdfObj);
  graph.update();
}

// acquires classes of which node is an instance
function loadClasses(graph, node){
  var nodeRDF = graph.returnRDF(node);
  var nodeClasses = nodeRDF.Match(null,null,"http://www.wikidata.org/prop/direct/P31",null);
  nodeClasses.forEach(function(curVal, idx, arr){
    loadNode(graph, conceptToDataURL(curVal.object));
  });
}