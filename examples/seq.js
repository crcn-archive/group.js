var structr = require("structr"),
group = require("../");


var Seq = structr({


	/**
	 */

	"stepit": function(next) {
		console.log("STEP!");
		setTimeout(next, 1000);
	}
});


var SeqGroup = group(Seq).flow({"seq map":"stepit"}).create();


var seq = new SeqGroup([new Seq(), new Seq()]);

seq.stepit().step(function() {
	console.log("DONE")
})