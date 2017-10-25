
window.onload=function(){
	showTable();
	document.getElementById('frmClient').addEventListener('submit', adicionarOuAlterar);
	document.getElementById('frmClient').addEventListener('submit', showTable);
}

var idNull = null;

function adicionarOuAlterar(e){
	var nom = document.getElementById('txtName').value;
	var p = {
		name : !nom ? " ": nom, 
		birth : new Date(document.getElementById('dtpBirth').value.replace("-","/")),
		sex : document.getElementById('rdoMale').checked ? 'M' : 'F'
	}

	if(idNull == null)	
		toInput(p);
	else if(idNull > 0)
		alterar(p);
	else
		alert("Ação desconhecida");	
	
	e.preventDefault();
}

function toInput(p){	
	var users = [];	
	var idValue = 1;	

	if(localStorage.getItem('value') !== null ){
		users = JSON.parse(localStorage.getItem('value')); 
				
		if(users.length > 0)
			idValue = 	(function validateId() {	
							for(var i = 0; i < users.length; i++)
								if(users[i].Id != i+1)
									return i + 1;							
							return users[users.length - 1].Id + 1;
						})();
	}	
	
	var user = {
		Id: idValue,
		Name: p.name,
		DateBirth: p.birth.toLocaleString("pt-BR").substring(0, 10),
		Sex: p.sex
	
	};
	
	users.push(user);	
	users.sort(function(a,b) {
		return a.Id - b.Id;
	});			
	localStorage.setItem('value', JSON.stringify(users));	
	document.getElementById('frmClient').reset();	
}

function alterar(p){
	var btn = document.getElementById('btnSave');	

	users = JSON.parse(localStorage.getItem('value'));
	//substituir as informaçoes
	for(var i = 0; i < users.length; i++){
		if(users[i].Id == idNull){
			users[i].Name = p.name;
			users[i].DateBirth = p.birth.toLocaleString("pt-BR").substring(0, 10);
			users[i].Sex = p.sex;
			
			btn.value = "Cadastrar";
			idNull = null;

			localStorage.setItem('value', JSON.stringify(users));	
			document.getElementById('frmClient').reset();			
			break;
		}
	}
}

function doUpdate(idRow){	
	document.getElementById('btnSave').value = "Salvar";
	
	var txtName = document.getElementById('txtName'),
	    dtpBirth = document.getElementById('dtpBirth'),
	    rdoMale = document.getElementById('rdoMale'),
	    rdoFemale = document.getElementById('rdoFemale');

	var users = JSON.parse(localStorage.getItem('value'));
	for(var i = 0; i < users.length; i++){
		if(users[i].Id == idRow){			
			txtName.value = users[i].Name;
			dtpBirth.value = users[i].DateBirth.replace(/(\d{2})\/(\d{2})\/(\d{4})/,'$3-$2-$1'); 
			rdoMale.checked = !(rdoFemale.checked = (users[i].Sex == 'F'));
			
			showTable();
			idNull = null;
			if(idNull === null){
				var th = document.getElementById("rowTable"+i);				
				th.className = "colorUpdate";				
			}

			idNull = users[i].Id;
			break;
		}
	}
}

function deleteUser(cod){
	var users = JSON.parse(localStorage.getItem('value'));

	for(var i = 0; i < users.length; i++)
		if(users[i].Id == cod)
			users.splice(i, 1);
				
	
	localStorage.setItem('value', JSON.stringify(users));
	showTable();
	
	if(users.length == 0)
		window.localStorage.removeItem("value");
}

function showTable(){

	if(localStorage.getItem('value') === null)
		return;
	
	var users = JSON.parse(localStorage.getItem('value'));
	var tbody = document.getElementById("tableResults");

	tbody.innerHTML = '';
	
	for(var i = 0; i < users.length; i++){
		var	id = users[i].Id,
		    name = users[i].Name,
		    birth = users[i].DateBirth,
		    sex = users[i].Sex
			       
		tbody.innerHTML += '<tr id="rowTable'+i+'">'+
								'<td>'+id+'</td>'+
								'<td>'+name+'</td>'+
								'<td>'+birth+'</td>'+
								'<td>'+sex+'</td>'+
								'<td><button class="btn btn-outline-primary" onclick="doUpdate(\'' + id + '\')">Editar</button></td>'+
								'<td><button class="btn btn-outline-danger" onclick="deleteUser(\'' + id + '\')">Excluir</button></td>'+
						   '</tr>';		
	}
}
