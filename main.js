
 // Create RDF object
 myRDF=new RDF();

 function conceptToDataURL(url){
 	console.log("url argument:", url);
 	var tmp = url;
 	newUrl = tmp.replace("entity/", "wiki/Special:EntityData/");
 	newUrl = newUrl + ".rdf";
 	console.log("newurl:", newUrl);
 	return newUrl;
 }

 myRDF.getRDFURL('https://www.wikidata.org/wiki/Special:EntityData/Q6106.rdf',callback);

 function callback() {

   name = myRDF.getSingleObject(null, null,"http://schema.org/name", null);
  console.log("name: ");   // http://www.w3.org/2000/01/rdf-schema#label
  console.log(name);
  console.log(typeof(name[0]));
  // cities=myRDF.Match(null,null,"http://www.wikidata.org/prop/direct/P31",null);

  // console.log("cities: ");
  // console.log(cities);

  	function callback2(){
  		typesOfCities = myRDF2.Match(null,null,"http://www.wikidata.org/prop/direct/P31",null);
		console.log("type of city types 1");
		console.log(typesOfCities);
  	}

  	//myRDF2=new RDF();
	//myRDF2.getRDFURL(conceptToDataURL(cities[0].object), callback2);

}

