function conceptToDataURL(url){
	console.log("url argument:", url);
	var tmp = url;
	newUrl = tmp.replace("entity/", "wiki/Special:EntityData/");
	newUrl = newUrl + ".rdf";
	console.log("newurl:", newUrl);
	return newUrl;
}


// cities=myRDF.Match(null,null,"http://www.wikidata.org/prop/direct/P31",null);

//   	function callback2(){
//   		typesOfCities = myRDF2.Match(null,null,"http://www.wikidata.org/prop/direct/P31",null);
// 		  console.log("type of city types 1");
// 		  console.log(typesOfCities);
//   	}

// myRDF2=new RDF();
// myRDF2.getRDFURL(conceptToDataURL(cities[0].object), callback2);

function loadNode(graph, uri){
  var newRDF = new RDF();
  newRDF.getRDFURL(uri, function(){loadNodeComplete(graph, newRDF, uri)});
}

function loadNodeComplete(graph, rdfObj, uri){
  console.log("check ", rdfObj);
  var rdfLabel = rdfObj.getSingleObject(null, null,"http://schema.org/name", null);
  var newNode = graph.addNode(uri, "instance", rdfLabel, rdfObj);
  graph.update();
  loadClasses(graph, newNode); //<-- oops, perhaps JS deteceted infinite loop and cut out execution,
  //preventing more class nodes from spawning?
}

// acquires classes of which node is an instance
function loadClasses(graph, node){
  var nodeRDF = graph.returnRDF(node);
  var nodeClasses = nodeRDF.Match(null,null,"http://www.wikidata.org/prop/direct/P31",null);
  nodeClasses.forEach(function(curVal, idx, arr){
    loadNode(graph, conceptToDataURL(curVal.object));
  });
}