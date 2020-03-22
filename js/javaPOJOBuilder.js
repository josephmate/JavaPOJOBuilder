function Data() {
	this.className = "User";
	this.fields = {};
	this.fields[0] = new Field("username", true, false, "String");
	this.builderSetterPrefix = "with";
}

function Field(name, isFinal, hasSetter, type) {
	this.name = name;
	this.isFinal = isFinal;
	this.hasSetter = hasSetter;
	this.type = type;
}

var data = new Data();
var lastRowAdded = 0;

function removeField(rowIdx) {
	delete data.fields[rowIdx];
	var trField = document.getElementById('trField' + rowIdx);
	trField.parentNode.removeChild(trField);
	updateResult();
}

function changeFieldName(rowIdx) {
	var field = data.fields[rowIdx];
	var txtFieldName = document.getElementById('txtFieldName' + rowIdx);
	field.name = txtFieldName.value;
	updateResult();
}

function changeFieldIsFinal(rowIdx) {
	var field = data.fields[rowIdx];
	var chkFieldIsFinal = document.getElementById('chkFieldIsFinal' + rowIdx);
	field.isFinal = chkFieldIsFinal.checked;
	updateResult();
}

function changeFieldHasSetter(rowIdx) {
	var field = data.fields[rowIdx];
	var chkFieldHasSetter = document.getElementById('chkFieldHasSetter' + rowIdx);
	field.hasSetter = chkFieldHasSetter.checked;
	updateResult();
}

function changeFieldType(rowIdx) {
	var field = data.fields[rowIdx];
	var txtFieldType = document.getElementById('txtFieldType' + rowIdx);
	field.type = txtFieldType.value;
	updateResult();
}

function addField() {
	lastRowAdded++;
	var currentRow = lastRowAdded;
	
	data.fields[lastRowAdded] = new Field("fieldName" + lastRowAdded, true, false, "String");

	var trField = document.createElement("tr");
	trField.id = "trField" + lastRowAdded;

	var tdFieldName = document.createElement("td");
	var txtFieldName = document.createElement("input");
	txtFieldName.id = "txtFieldName" + lastRowAdded;
	txtFieldName.type = "text";
	txtFieldName.value = "fieldName" + lastRowAdded;
	txtFieldName.oninput = function() {
		changeFieldName(currentRow);	
	};
	tdFieldName.appendChild(txtFieldName);
	trField.appendChild(tdFieldName);

	var tdFieldFinal = document.createElement("td");
	var chkFieldFinal = document.createElement("input");
	chkFieldFinal.id = "chkFieldIsFinal" + lastRowAdded;
	chkFieldFinal.type = "checkbox";
	chkFieldFinal.checked = true;
	chkFieldFinal.onchange = function() {
		changeFieldIsFinal(currentRow);	
	};
	tdFieldFinal.appendChild(chkFieldFinal);
	trField.appendChild(tdFieldFinal);

	var tdFieldHasSetter = document.createElement("td");
	var chkFieldHasSetter = document.createElement("input");
	chkFieldHasSetter.id = "chkFieldHasSetter" + lastRowAdded;
	chkFieldHasSetter.type = "checkbox";
	chkFieldHasSetter.checked = false;
	chkFieldHasSetter.onchange = function() {
		changeFieldHasSetter(currentRow);	
	};
	tdFieldHasSetter.appendChild(chkFieldHasSetter);
	trField.appendChild(tdFieldHasSetter);

	var tdFieldType = document.createElement("td");
	var txtFieldType = document.createElement("input");
	txtFieldType.id = "txtFieldType" + lastRowAdded;
	txtFieldType.type = "text";
	txtFieldType.value = "String";
	txtFieldType.oninput = function() {
		changeFieldType(currentRow);	
	};
	tdFieldType.appendChild(txtFieldType);
	trField.appendChild(tdFieldType);

	var tdRemoveField = document.createElement("td");
	var btnRemoveField = document.createElement("button");
	btnRemoveField.type = "button";
	btnRemoveField.value = "String";
	btnRemoveField.onclick = function() {
		removeField(currentRow);	
	};
	btnRemoveField.innerHTML = "Remove";
	tdRemoveField.appendChild(btnRemoveField);
	trField.appendChild(tdRemoveField);

	var tblFields = document.getElementById('tblFields');
	tblFields.appendChild(trField);

	updateResult();
}

function changeBuilderSetterPrefix() {
	var txtBuilderSetterPrefix = document.getElementById('txtBuilderSetterPrefix');
	data.builderSetterPrefix = txtBuilderSetterPrefix.value;

	updateResult();
}

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

function classHeader(className, indentSize, isStatic) {
	var staticClassStr = "";
	if (isStatic) {
		staticClassStr = "static ";
	}
	return indent(indentSize) + "public " + staticClassStr + "class " + className + " {\n\n";
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

function setterFcn(field, indentSize) {
	var output = "";
	output += indent(indentSize) + "public void set" + capaitalizeFirstLetter(field.name) + "(" + field.type + " " + field.name + ") {\n";
	output += indent(indentSize + 1) + "this." + field.name + " = " + field.name + ";\n";
	output += indent(indentSize) + "}\n\n";
	return output;
}

function withFcn(field, indentSize) {
	var output = "";
	output += indent(2) + "public Builder "
	output += data.builderSetterPrefix;
	output += capaitalizeFirstLetter(field.name) + "(" + field.type + " " + field.name + ") {\n";
	output += indent(3) + "this." + field.name + " = " + field.name + ";\n";
	output += indent(3) + "return this;\n";
	output += indent(2) + "}\n\n";
	return output;
}

function generatePOJO() {
	var output = classHeader(data.className, 0, false);

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

	// Getters and Setters
	for(var fieldIdx in data.fields) {
		var field = data.fields[fieldIdx];
		output += getterFcn(field, 1);
		if(field.hasSetter) {
			output += setterFcn(field, 1);
		}
	}

	// Builder
	output += classHeader("Builder", 1, true);

	// Builder's fields
	for(var fieldIdx in data.fields) {
		var field = data.fields[fieldIdx];
		output += fieldStr(new Field(field.name, false, false, field.type), 2);
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

function updateResult() {
	var txtResult = document.getElementById('txtResult');
	txtResult.value = generatePOJO();
}

window.onload = function() {
	updateResult();
}
