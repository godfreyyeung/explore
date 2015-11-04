
// // Create the XHR object.
// function createCORSRequest(method, url) {
//   var xhr = new XMLHttpRequest();
//   if ("withCredentials" in xhr) {
//     // XHR for Chrome/Firefox/Opera/Safari.
//     xhr.open(method, url, true);
//   } else if (typeof XDomainRequest != "undefined") {
//     // XDomainRequest for IE.
//     xhr = new XDomainRequest();
//     xhr.open(method, url);
//   } else {
//     // CORS not supported.
//     xhr = null;
//   }
//   return xhr;
// }

// // Helper method to parse the title tag from the response.
// function getTitle(text) {
//   return text.match('<title>(.*)?</title>')[1];
// }

// // Make the actual CORS request.
// function makeCorsRequest() {
//   // All HTML5 Rocks properties support CORS.
//   var url = 'https://www.wikidata.org/wiki/Special:EntityData/Q6106.rdf';

//   var xhr = createCORSRequest('GET', url);
//   if (!xhr) {
//     alert('CORS not supported');
//     return;
//   }

//   // Response handlers.
//   xhr.onload = function() {
//     //var text = xhr.responseText;
//     //var title = getTitle(text);
//     //alert('Response from CORS request to ' + url);
//     var responseText = xhr.responseText;
//  	console.log(responseText);
//   };

//   xhr.onerror = function() {
//     alert('Woops, there was an error making the request.');
//   };

//   xhr.send();
// }

// declare foaf Namespace
 foafNS="http://xmlns.com/foaf/0.1/"

 // Create RDF object
 myRDF=new RDF()

 function conceptToDataURL(url){
 	console.log("url argument:", url);
 	var tmp = url;
 	newUrl = tmp.replace("entity/", "wiki/Special:EntityData/");
 	newUrl = newUrl + ".rdf";
 	console.log("newurl:", newUrl);
 	return newUrl;
 }

 // Get foaf rdf
 myRDF.getRDFURL('https://www.wikidata.org/wiki/Special:EntityData/Q6106.rdf',callback)

 function callback() {

  cities=myRDF.Match(null,null,"http://www.wikidata.org/prop/direct/P31",null);

  console.log("cities: ");
  console.log(cities);


  	function callback2(){
  		typesOfCities = myRDF.Match(null,null,"http://www.wikidata.org/prop/direct/P31",null);
		console.log("type of city 1");
		console.log(typesOfCities);
  	}

	myRDF.getRDFURL(conceptToDataURL(cities[0].object), callback2);

  // Return array of triples which have a foaf:name of "Jim Ley"
  //name=myRDF.Match(null,null,foafNS+"name","Jim Ley")

  // Get the object which has a subject returned previously
  // and the predicate of foaf:mbox
  //mbox=myRDF.getSingleObject(name,name[0].subject,foafNS+"mbox",null)

  // alert the mailbox
  //alert(mbox)

 }

//jQuery.get( 'https://www.wikidata.org/wiki/Special:EntityData/Q6106.rdf').done( function(){ console.log(arguments); });

// makeCorsRequest();

// /* js */

//  // declare foaf Namespace
//  foafNS="http://xmlns.com/foaf/0.1/"

//  // Create RDF object
//  myRDF=new RDF()


// var HttpClient = function() {
//     this.get = function(aUrl, aCallback) {
//         var anHttpRequest = new XMLHttpRequest();
//         anHttpRequest.onreadystatechange = function() {
//             if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
//                 aCallback(anHttpRequest.responseText);
//         }

//         anHttpRequest.open( "GET", aUrl, true );
//         anHttpRequest.send( null );
//     }
// }

// $.ajax({
//   url: "test.html",
//   cache: false
// })
//   .done(function( html ) {
//     $( "#results" ).append( html );
//   });

// aClient = new HttpClient();
// aClient.get('http://jibbering.com/foaf2.rdf', function(response) {
//     // do something with response
//     console.log(response);
// });

 // Get foaf rdf
 //myRDF.getRDFURL('http://jibbering.com/foaf2.rdf',callback) // http://jibbering.com/

 // function callback() {

 //  // Return array of triples which have a foaf:name of "Jim Ley"
 //  name=myRDF.Match(null,null,foafNS+"name","Jim Ley");

 //  // Get the object which has a subject returned previously
 //  // and the predicate of foaf:mbox
 //  mbox=myRDF.getSingleObject(name,name[0].subject,foafNS+"mbox",null);

 //  // alert the mailbox
 //  alert(mbox);

 // }