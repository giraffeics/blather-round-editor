var pw_div;
var passwords = [];

function uuidv4() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}

function DataJetObject()
{
	this.fields = [
		{t: "S", v: "", n: "Password"},
		{t: "S", v: "", n: "Category"},
		{t: "S", v: "", n: "Subcategory"},
		{t: "S", v: "", n: "Difficulty"},
		{t: "S", v: "", n: "ForbiddenWords"},
		{t: "S", v: "", n: "AlternateSpellings"}
	];
}

function PasswordEntry(name)
{
	this.alternateSpellings = [];
	this.category = "thing";
	this.difficulty = "medium";
	this.forbiddenWords = [];
	this.password = name;
	this.id = uuidv4();
	this.subcategory = "";
	this.tailoredWords = [];
	this.us = false;
}

function generateDataJetObject(password)
{
	rDataJetObject = new DataJetObject;
	
	for(i in rDataJetObject.fields)
	{
		var fName = rDataJetObject.fields[i].n;
		fName = fName[0].toLowerCase() + fName.substring(1);
		
		if(Array.isArray(password[fName]))
			rDataJetObject.fields[i].v = password[fName].join("|");
		else
			rDataJetObject.fields[i].v = password[fName];
	}
	
	return rDataJetObject;
}

function savePasswordsAsZip(passwords, filename)
{
	var pwJetObject = {};
	pwJetObject.content = passwords;
	
	var zip = new JSZip();
	
	zip.file("BlankyBlankPasswords.jet", JSON.stringify(pwJetObject, null, 1));
	
	var pw_folder = zip.folder("BlankyBlankPasswords");
	for(i in passwords)
	{
		var cur_folder = pw_folder.folder(passwords[i].id);
		cur_folder.file("data.jet", JSON.stringify(generateDataJetObject(passwords[i]), null, 1));
	}
	
	zip.generateAsync({type:"blob"})
	.then(function(content) {
		saveAs(content, filename);
	});
}

function initPasswordEditor()
{
	pw_div = document.getElementById("pw_editor");
	pw_div.in_name = document.getElementById("pw_name");
	pw_div.in_category = document.getElementById("pw_category");
	pw_div.in_difficulty = document.getElementById("pw_difficulty");
	pw_div.in_alternate = document.getElementById("pw_alternate");
	pw_div.m_password = null;
	
	pw_div.openPassword = function(password)
	{
		this.m_password = password;
		this.in_name.value = password.password;
		this.in_category.value = password.category;
		this.in_difficulty.value = password.difficulty;
		this.in_alternate.value = "";
		for(i in password.alternateSpellings)
			this.in_alternate.value += password.alternateSpellings[i] + "\n";
	}
	
	pw_div.savePassword = function()
	{
		this.m_password.password = this.in_name.value;
		this.m_password.category = this.in_category.value;
		this.m_password.difficulty = this.in_difficulty.value;
		this.m_password.alternateSpellings = this.in_alternate.value.split("\n");
	}
	
	pw_div.openPassword(passwords[0]);
}