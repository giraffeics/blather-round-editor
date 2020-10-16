var pw_div;
var passwords = [];

function generateDataJetObject(password)
{
	fields = [];
	for(const field in password)
	{
		f_entry = { t: "S", v: password[field], n: field };
		fields.push(f_entry);
	}
	dataJetObject = {fields};
	return dataJetObject;
}

function savePasswordsAsZip(passwords, filename)
{
	var pwJetObject = {};
	pwJetObject.content = passwords;
	
	var zip = new JSZip();
	
	zip.file("BlankyBlankPasswords.jet", JSON.stringify(pwJetObject));
	
	var pw_folder = zip.folder("BlankyBlankPasswords");
	for(i in passwords)
	{
		var cur_folder = pw_folder.folder(passwords[i].id);
		cur_folder.file("data.jet", JSON.stringify(generateDataJetObject(passwords[i])));
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