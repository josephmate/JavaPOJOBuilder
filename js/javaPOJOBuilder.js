function Data() {
	this.className = "User";
	this.fields = [new Field("username", true, "String")];
}

function Field(name, isFinal, type) {
	this.name = name;
	this.isFinal = isFinal;
	this.type = type;
}

var data = new Data();

function capaitalizeFirstLetter(str) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

function indent(numOfIndents) {
	var output = "";
	for(var i = 0; i < numOfIndents; i++) {
		output += "    ";
	}
	return output;
}

function classHeader(className, indentSize) {
	return indent(indentSize) + "public class " + className + " {\n\n";
}

function fieldStr(field, indentSize) {
	var output = indent(indentSize) + "private ";
	if(field.isFinal) {
		output += "final ";
	}
	output += field.type + " " + field.name + ";\n\n";
	return output
}

function getterFcn(field, indentSize) {
	var output = "";
	output += indent(indentSize) + "public " + field.type + " get" + capaitalizeFirstLetter(field.name) + "() {\n";
	output += indent(indentSize + 1) + "return " + field.name + ";\n";
	output += indent(indentSize) + "}\n\n";
	return output;
}

function withFcn(field, indentSize) {
	var output = "";
	output += indent(2) + "public Builder with" + capaitalizeFirstLetter(field.name) + "(" + field.type + " " + field.name + ") {\n";
	output += indent(3) + "this." + field.name + " = " + field.name + ";\n";
	output += indent(3) + "return this;\n";
	output += indent(2) + "}\n\n";
	return output;
}

function generatePOJO() {
	var output = classHeader(data.className);

	for(var fieldIdx in data.fields) {
		output += fieldStr(data.fields[fieldIdx], 1);
	}

	// Constructor
	output += indent(1) + "private " + data.className + "(Builder builder) {\n";
	for(var fieldIdx in data.fields) {
		var field = data.fields[fieldIdx];
		output += indent(2) + "this." + field.name + " = builder." + field.name + ";\n";
	}
	output += indent(1) + "}\n\n";

	// Getters
	for(var fieldIdx in data.fields) {
		output += getterFcn(data.fields[fieldIdx], 1);
	}

	// Builder
	output += classHeader("Builder", 1);

	// Builder's fields
	for(var fieldIdx in data.fields) {
		var field = data.fields[fieldIdx];
		output += fieldStr(new Field(field.name, false, field.type), 2);
	}

	// Builder Setters
	for(var fieldIdx in data.fields) {
		output += withFcn(data.fields[fieldIdx]);
	}

	// End Builder
	output += indent(2) + "public " + data.className + " build() {\n";
	output += indent(3) + "return new " + data.className + "(this);\n";
	output += indent(2) + "}\n\n";
	output += indent(1) + "}\n\n";

	// End Class
	output += "}\n";

	return output;
}

window.onload = function() {
	var txtResult = document.getElementById('txtResult');
	txtResult.value = generatePOJO();
}
