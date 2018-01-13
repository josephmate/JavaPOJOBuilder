function Data() {
	this.className = "User";
	this.fields = [new Field("username", true, "String")];
}

function Field(name, isFinal, type) {
	this.name = name;
	this.isFinal = isFinal;
	this.type = type;
}

var indent = "    ";
var data = new Data();

function capaitalizeFirstLetter(str) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

function generatePOJO() {
	var output = "public class " + data.className + " {\n\n";

	for(var fieldIdx in data.fields) {
		var field = data.fields[fieldIdx];
		output += indent + "private ";
		if(field.isFinal) {
			output += "final ";
		}
		output += field.type + " " + field.name + ";\n\n";
	}

	// Constructor
	output += indent + "private " + data.className + "(Builder builder) {\n";
	for(var fieldIdx in data.fields) {
		var field = data.fields[fieldIdx];
		output += indent + indent + "this." + field.name + " = builder." + field.name + ";\n";
	}
	output += indent + "}\n\n";

	// Getters
	for(var fieldIdx in data.fields) {
		var field = data.fields[fieldIdx];
		output += indent + "public " + field.type + " get" + capaitalizeFirstLetter(field.name) + "() {\n";
		output += indent + indent + "return " + field.name + ";\n";
		output += indent + "}\n\n";
	}

	// Builder
	output += indent + "public class Builder {\n\n";

	// Builder's fields
	for(var fieldIdx in data.fields) {
		var field = data.fields[fieldIdx];
		output += indent + indent + "private " + field.type + " " + field.name + ";\n\n";
	}

	// Builder Setters
	for(var fieldIdx in data.fields) {
		var field = data.fields[fieldIdx];
		output += indent + indent + "public Builder with" + capaitalizeFirstLetter(field.name) + "(" + field.type + " " + field.name + ") {\n";
		output += indent + indent + indent + "this." + field.name + " = " + field.name + ";\n";
		output += indent + indent + indent + "return this;\n";
		output += indent + indent + "}\n\n";
	}

	// End Builder
	output += indent + indent + "public " + data.className + " build() {\n";
	output += indent + indent + indent + "return new " + data.className + "(this);\n";
	output += indent + indent + "}\n\n";
	output += indent + "}\n\n";

	// End Class
	output += "}\n";

	return output;
}

window.onload = function() {
	var txtResult = document.getElementById('txtResult');
	txtResult.value = generatePOJO();
}
