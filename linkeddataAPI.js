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
  var rdfLabel = rdfObj.getSingleObject(null, null,"http://schema.org/name", null, "en");
  console.log("rdfLabel: ", rdfLabel);
  var newNode = graph.addNode(uri, "instance", rdfLabel, rdfObj);
  graph.update();
}

// load a new load into graph representing entity of 'uri' and connected to 'fromNode'
function loadLinkedNode(graph, uri, fromNode){
  var newRDF = new RDF();
  newRDF.getRDFURL(uri, function(){loadLinkedNodeComplete(graph, uri, newRDF, fromNode)});
}

// creates and adds node newNode to graph and createslink from fromNode to newNode
// newNode will have 'uri' as its id and 'rdfObj' as its stored rdf data
function loadLinkedNodeComplete(graph, uriID, rdfObj, fromNode){
  console.log("load linked node complete called");
  var rdfLabel = rdfObj.getSingleObject(null, null,"http://schema.org/name", null, "en");
  console.log("rdfLabel: ", rdfLabel);
  var newNode = graph.addNode(uriID, "instance", rdfLabel, rdfObj);
  var newLink = graph.addLink(fromNode, newNode); // why some parent nodes don't render is because they already exist
          // (there is already a node with that id)
          // but we createa  new node for them here. This confuses d3.
          // must perform check for node existence, and execute addLink based on that condition.
  graph.update();
}


// acquires classes of which node is an instance
function loadClasses(graph, node){
  var nodeRDF = graph.returnRDF(node);
  var nodeClasses = nodeRDF.Match(null,null,"http://www.wikidata.org/prop/direct/P31",null);
  nodeClasses.forEach(function(curVal, idx, arr){
    loadLinkedNode(graph, conceptToDataURL(curVal.object), node);
  });
}

// acquires parent classes
function loadParentClasses(graph, node){
  console.log("parent classes clicked");
  var nodeRDF = graph.returnRDF(node);
  var nodeParentClasses = nodeRDF.Match(null,null,"http://www.wikidata.org/prop/direct/P279",null);
  console.log(nodeParentClasses);
  nodeParentClasses.forEach(function(curVal, idx, arr){
    loadLinkedNode(graph, conceptToDataURL(curVal.object), node);
  });
}