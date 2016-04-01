var graph = graphMachine();
graph.start(".svgArea");
loadNode(graph, 'https://www.wikidata.org/wiki/Special:EntityData/Q6106.rdf');

$('#add').on('click', function () {
    var $btn = $(this).button('loading')

    var uri = $("#basic-url").val();
    console.log(uri);
    console.log(typeof(uri));
    loadNode(graph, wikiToDataURL(uri));

    $btn.button('reset')
  })




/*
 TODO:
	look into effects of diferring
	terms used for classing across dbs

	and/or differing classname
	look into effects of :sameAs
*/