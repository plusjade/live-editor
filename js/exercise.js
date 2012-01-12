var Exercise = { title: "Exercise Name", desc: "", problems: [] };

require([ "ace/worker/jshint" ], function( jshint ) {
	window.JSHINT = jshint;
});

$(function() {
	$("#code-tabs").tabs({
		show: function( e, ui ) {
			var editorElem = $( ui.panel ).find( ".editor" );
			
			if ( editorElem.length ) {
				var editor = editorElem.data( "editor" );
			
				if ( !editor ) {
					editor = new Editor( editorElem[0].id );
					editorElem.data( "editor", editor );
				}
			}
		}
	});
	
	$(".add-hint").live("click", function() {
		$( $("#hint-tmpl").html() )
			.appendTo( "#hints" );
	});
	
	$(".remove-hint").live("click", function() {
		$(this).parents("li").remove();
	});
	
	$(".editor-form").submit( false );
	
	insertExerciseForm( Exercise );
	makeProblem();
});

var makeProblem = function() {
	var problem = { title: "Problem #" + (Exercise.problems.length + 1), desc: "" };
	insertExerciseForm( problem );
	
	// TODO: Populate main form and sync it to object
};

var insertExerciseForm = function( testObj ) {
	$( $("#form-tmpl").html() )
		.find( "a" ).text( testObj.title ).end()
		.find( "input" ).val( testObj.title ).end()
		.appendTo( "#tests" )
		.find( "form" ).change(function( e ) {
			var elem = e.target;
			
			testObj[ elem.name ] = elem.value;
			
			if ( elem.name === "test" ) {
				$(this).parent().prev().find("a").text( elem.value );
			}
		});
	
	$( "#tests" ).accordion( "destroy" ).accordion({ active: ":last" });
};

var extractExercise = function() {
	return {
		start: $("#start-code").editorText(),
		solution: $("#finish-code").editorText(),
		validate: $("#validate-code").editorText(),
		
		hints: $("#hints textarea").map(function() {
			return $(this).val();
		}).get(),
		
		options: {
			module: $("#module").val()
		}
	};
};

jQuery.fn.editorText = function() {
	var editor = this.data("editor");
	
	return editor ?
		editor.editor.getSession().getValue().replace(/\r/g, "\n") :
		"";
};

var runCode = function( code, context ) {
	var fn = new Function( "with(__context__) {\n" + code + "\n}", "__context__" );
	
	fn( context );
};