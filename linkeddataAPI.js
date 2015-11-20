// "class" B of entity A == entity A is instance of B
// "parent class" B of entity A == entity A is a class and is instance of B

function conceptToDataURL(url){
	var tmp = url;
	newUrl = tmp.replace("entity/", "wiki/Special:EntityData/");
	newUrl = newUrl + ".rdf";
	return newUrl;
}

// use an RDF obj to determine if entity that it represents is a class
// if no parent classes are found, the entity is considered simply an instance
function isClassFromRDF(rdfObj){
    var rdfObjParentClasses = rdfObj.Match(null,null,"http://www.wikidata.org/prop/direct/P279",null);
    if(rdfObjParentClasses.length == 0)
      return 1; // is an instance
    else
      return 0; // is a class
}

function loadNode(graph, uri){
  var newRDF = new RDF();
  newRDF.getRDFURL(uri, function(){loadNodeComplete(graph, newRDF, uri)});
}

function loadNodeComplete(graph, rdfObj, uri){
  var rdfLabel = rdfObj.getSingleObject(null, null,"http://schema.org/name", null, "en");
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
  var newNode;
  var newLink;
  var rdfLabel;
  var existingLink = graph.getNode(uriID);
  if(existingLink){
    console.log("EXISTS EXISTS EXISTS");
    newLink = graph.addLink(fromNode, existingLink);
  } else {
    console.log("NEW NEW NEW");
    rdfLabel = rdfObj.getSingleObject(null, null,"http://schema.org/name", null, "en");
    console.log("rdfLabel: ", rdfLabel);
    newNode = graph.addNode(uriID, "instance", rdfLabel, rdfObj);
    newLink = graph.addLink(fromNode, newNode);
  }
  graph.update();
}

// acquires classes of which node is an instance
function loadClasses(graph, node){
  var nodeRDF = graph.getRDF(node);
  var nodeClasses = nodeRDF.Match(null,null,"http://www.wikidata.org/prop/direct/P31",null);
  console.log(nodeClasses);
  nodeClasses.forEach(function(curVal, idx, arr){
    loadLinkedNode(graph, conceptToDataURL(curVal.object), node);
  });
}

// acquires parent classes
function loadParentClasses(graph, node){
  var nodeRDF = graph.getRDF(node);
  var nodeParentClasses = nodeRDF.Match(null,null,"http://www.wikidata.org/prop/direct/P279",null);
  console.log(nodeParentClasses);
  nodeParentClasses.forEach(function(curVal, idx, arr){
    loadLinkedNode(graph, conceptToDataURL(curVal.object), node);
  });
}