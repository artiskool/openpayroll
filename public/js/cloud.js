var mySidebar;
var myToolbar;
var loginPopup;
var loginForm;
var token;

function doOnLoad() {
	mySidebar = new dhtmlXSideBar({
		parent: document.body,
		icons_path: "./img/dhtmlxSidebar/win_16x16/",
		width: 160,
		template: "icons_text",
		json: "./json/sidebar.json"
	});
	sbObj = mySidebar.attachStatusBar({text:'<div style="text-align:right;">CloudNet v1.0.0 | &copy; AntHub Corporation</div>'});
	setStatusBar("Ready");

	myToolbar = mySidebar.attachToolbar({
		icons_size: 18,
		icons_path: "./img/dhtmlxSidebar/toolbar_18/",
		json: "./json/toolbar_18.json",
		onload: function() {
			loginPopup = new dhtmlXPopup({toolbar: myToolbar, id: "login"});
			loginPopup.attachEvent("onShow", function(){
				login();return;

				if (loginForm != null)
					return;

				loginForm = loginPopup.attachForm([
					{type: "block", blockOffset: 0, width: 280, list: [
						{type: "settings", position: "label-left", labelWidth: 110, inputWidth: 130, offsetLeft: 20},
						{type: "input", label: "Username", name: "username", required: true, validate: "NotEmpty"},
						{type: "password", label: "Password", name: "password", required: true, validate: "NotEmpty"},
						{type: "checkbox", label: "Remember me", checked: true},
						{type: "button", value: "Login", offsetLeft: 164, name: "login"}
					]}
				], (dhx4.isIE6||dhx4.isIE7?280:null));
				loginForm.enableLiveValidation(true);
				loginForm.setFocusOnFirstActive();
				loginForm.attachEvent("onButtonClick", function(id){
					if (loginForm.validate()) { // success
						w1.close();
					}
					else {
					}
				});
			});
		}
	});

	myToolbar.attachEvent("onClick", function(id) {
		if("hr" == id) {
			hr_menu();
			//get_all_employees();
		} else if("payroll" == id) {
			myMenu = mySidebar.cells("dashboard").detachMenu();
			payroll_menu();
		} else if("dtr" == id) {
			myMenu = mySidebar.cells("dashboard").detachMenu();
			dtr_menu();
		}
	});

	// if (true)
	// 	login();
}

function setStatusBar(msg) {
	sbObj.setText('<div style="float:left;">' + msg + '</div><div style="text-align:right;">CloudNet v1.0.0 | &copy; AntHub Corporation</div>');
}

function login() {
	formData = [
		{type: "settings", position: "label-left", labelWidth: 100, inputWidth: 120},
		{type: "block", inputWidth: "auto", offsetTop: 12, list: [
			{type: "input", label: "Username", name: "username", value: "", required:true, validate:"NotEmpty"},
			{type: "password", label: "Password", name: "password", value: "", required:true, validate:"NotEmpty"},
			{type: "checkbox", label: "Remember me", checked: true},
			{type: "button", value: "Login", offsetLeft: 70, offsetTop: 14}
		]}
	];
	dhxWins = new dhtmlXWindows();
	w1 = dhxWins.createWindow("w1", 10, 10, 300, 200);
	w1.denyResize();
	w1.denyMove();
	w1.centerOnScreen();
	w1.setText('Authenticate');
	w1.setModal(true);
	w1.button("stick").hide();
	w1.button("help").hide();
	w1.button("park").hide();
	w1.button("minmax").hide();
	w1.button("close").hide();
	myForm = w1.attachForm(formData, true);
	myForm.enableLiveValidation(true);
	myForm.setFocusOnFirstActive();
	myForm.attachEvent("onButtonClick", function(id){
		if (myForm.validate()) { // success
			do_login(w1);
		}
		else {
		}
	});
}

function misc() {
	var myLayout;
	var myForm, formData;
	var dhxWins, w1;
	myLayout = new dhtmlXLayoutObject({
		parent: document.body,
		/*pattern: "3L"*/
		pattern: "2U"
	});
	myLayout.cells("a").hideHeader();
	myLayout.cells("b").hideHeader();

	myMenu = myLayout.attachMenu({
		icons_path: "./samples/dhtmlxMenu/common/imgs/",
		xml: "./samples/dhtmlxMenu/common/dhxmenu.xml"
	});
/*
	myRibbon = myLayout.attachRibbon({
		icons_path: "/samples/dhtmlxRibbon/common/",
		json: "/samples/dhtmlxRibbon/common/data_attached.json",
		onload: function() {
			myLayout.cells("c").setHeight(111);
		}
	});
*/
	sbObj = myLayout.attachStatusBar({text:'CloudNet v1.0<a href="" style="float:right;">Logout</label>'});

	mySidebar = myLayout.cells("a").attachSidebar({
		width: 160,
		icons_path: "./samples/dhtmlxSidebar/common/win_16x16/",
		json: "./samples/dhtmlxSidebar/common/sidebar.json"
	});

	myTabbar = myLayout.cells("b").attachTabbar({
//				parent: "tabbarObj",
//				skin: skin,
		tabs: [
			{id: "a1", text: "dhtmlxGrid", active: true},
			{id: "a2", text: "Tab 2"},
			{id: "a3", text: "Tab 3"}
		]
	});
	// attach status bar
	myTabbar.tabs("a1").attachStatusBar({
		height: 30,
		text: "<div id='pagingArea'></div>"
	});
	// init grid
	myGrid = myTabbar.tabs("a1").attachGrid();
	myGrid.setImagePath("./dhtmlx/imgs/");
	myGrid.enablePaging(true, 10, 3, "pagingArea");
	myGrid.setPagingSkin("toolbar");
	myGrid.loadXML("./samples/dhtmlxGrid/common/grid_layout.xml?etc="+new Date().getTime());
}

function payroll_menu()
{
	myMenu = mySidebar.cells("dashboard").attachURL("./module/payroll.html", true);
}

function dtr_menu()
{
	myMenu = mySidebar.cells("dashboard").attachURL("./module/dtr.html", true);
}

function hr_menu()
{
	myMenu = mySidebar.cells("dashboard").attachURL("./module/hr.html", true);
}

function removeItem(menuItemId)
{
	var data = myGrid.contextID.split("_");
	var rowId = data[0];
	var cell_index = data[1];

	switch(menuItemId) {
		case "remove":
			dhtmlx.message({
				type: "confirm",
				text: "Are you sure you want to remove this?",
				callback: function(response) {
					if(response == true) {
						window.setTimeout("myGrid.deleteRow("+rowId+");",200);
					}
				}
			});
			break;
	}
}

function do_login(w1)
{
	var user = $("input[name='username']").val();
	var pass = $("input[name='password']").val();

	jQuery(document).ready(function() {
		$.ajax({
			type: "POST",
			headers: {
				"Accept": "application/json",
				"Content-Type": "application/json",
				"Content-Type" : "application/x-www-form-urlencoded; charset=UTF-8",
				"Authorization": "Basic " + "dGVzdGNsaWVudDp0ZXN0cGFzcw=="
			},
			url: "http://localhost:8888/oauth",
			data: {
				grant_type: "password",
				username: user,
				password: pass,
				client_id: "testclient"
			},
			dataType: "json",
			success: function(response)
			 {
			 	if(response) {
			 		var getRefreshToken = get_new_access_token(response.refresh_token, w1);
			 	}
			 },
			 error: function(jqXHR)
			 {
			 	if(jqXHR.statusText == "invalid_client") {
			 		dhtmlx.alert({
				 		title: "Invalid Credentials",
						text: "Username or Password is Incorrect",
					});
			 	} else if(jqXHR.statusText == "invalid_grant") {
			 		dhtmlx.alert({
				 		title: "Invalid Grant",
						text: "The Authorization is Invalid",
					});
			 	}
			 }
		});
	});
}

function get_new_access_token(getRefreshToken, w1)
{
	$.ajax({
		type: "POST",
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json",
			"Content-Type" : "application/x-www-form-urlencoded; charset=UTF-8",
		},
		url: "http://localhost:8888/oauth",
		data: {
			grant_type: "refresh_token",
			refresh_token: getRefreshToken,
			client_id: "testclient",
			client_secret: "testpass"
		},
		dataType: "json",
		success: function(response)
		{
			token = response.access_token;
			w1.close();
		},
		error: function(jqXHR)
		{
			console.log(jqXHR);
		}

	});
}

function get_all_employees()
{
	$.ajax({
		type: "GET",
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json",
			"Content-Type" : "application/x-www-form-urlencoded; charset=UTF-8",
			"Authorization": "Bearer " + window.token,
		},
		url: "http://localhost:8888/employees",
		data: {
			
		},
		dataType: "json",
		success: function(response)
		{
			console.log(response);
		},
		error: function(jqXHR)
		{
			console.log(jqXHR);
		}
	});
}

function save_basic_information()
{
	var empid = $("input[name='employee_id']").val();
	var first_name = $("input[name='Fname']").val();
	var last_name = $("input[name='Lname']").val();
	var middle_name = $("input[name='Mname']").val();
	var birthdate = $("input[name='birthdate']").val();
	var gender = $("input[name=gender]").val();
	var marital_status = $("input[name=marital_status]").val();
	var active = $("input[name=active]").val();

	$.ajax({
		type: "POST",
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json",
			"Authorization": "Bearer " + window.token,
		},
		url: "http://localhost:8888/employees",
		data: {
		"employee_id": 5,
		"first_name": "Raymart",
		"last_name": "Obeso"
		},
		dataType: "json",
		success: function(response)
		{
			console.log(response);
		},
		error: function(jqXHR)
		{
			console.log(jqXHR);
		}
	});
}

function save_contact_details()
{
	var empid = $("input[name='employee_id']").val();
	var first_name = $("input[name='Fname']").val();
	var last_name = $("input[name='Lname']").val();
	var middle_name = $("input[name='Mname']").val();
	var birthdate = $("input[name='birthdate']").val();
	var gender = $("input[name=gender]").val();
	var marital_status = $("input[name=marital_status]").val();
	var active = $("input[name=active]").val();

	$.ajax({
		type: "POST",
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json",
			"Authorization": "Bearer " + window.token,
		},
		url: "http://localhost:8888/employees",
		data: {
		"employee_id": 5,
		"first_name": "Raymart",
		"last_name": "Obeso"
		},
		dataType: "json",
		success: function(response)
		{
			console.log(response);
		},
		error: function(jqXHR)
		{
			console.log(jqXHR);
		}
	});
}

function save_employment_details()
{
	var empid = $("input[name='employee_id']").val();
	var first_name = $("input[name='Fname']").val();
	var last_name = $("input[name='Lname']").val();
	var middle_name = $("input[name='Mname']").val();
	var birthdate = $("input[name='birthdate']").val();
	var gender = $("input[name=gender]").val();
	var marital_status = $("input[name=marital_status]").val();
	var active = $("input[name=active]").val();

	$.ajax({
		type: "POST",
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json",
			"Authorization": "Bearer " + window.token,
		},
		url: "http://localhost:8888/employees",
		data: {
		"employee_id": 5,
		"first_name": "Raymart",
		"last_name": "Obeso"
		},
		dataType: "json",
		success: function(response)
		{
			console.log(response);
		},
		error: function(jqXHR)
		{
			console.log(jqXHR);
		}
	});
}

function save_government_details()
{
	var empid = $("input[name='employee_id']").val();
	var first_name = $("input[name='Fname']").val();
	var last_name = $("input[name='Lname']").val();
	var middle_name = $("input[name='Mname']").val();
	var birthdate = $("input[name='birthdate']").val();
	var gender = $("input[name=gender]").val();
	var marital_status = $("input[name=marital_status]").val();
	var active = $("input[name=active]").val();

	$.ajax({
		type: "POST",
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json",
			"Authorization": "Bearer " + window.token,
		},
		url: "http://localhost:8888/employees",
		data: {
		"employee_id": 5,
		"first_name": "Raymart",
		"last_name": "Obeso"
		},
		dataType: "json",
		success: function(response)
		{
			console.log(response);
		},
		error: function(jqXHR)
		{
			console.log(jqXHR);
		}
	});
}

function save_School_work()
{
	var empid = $("input[name='employee_id']").val();
	var first_name = $("input[name='Fname']").val();
	var last_name = $("input[name='Lname']").val();
	var middle_name = $("input[name='Mname']").val();
	var birthdate = $("input[name='birthdate']").val();
	var gender = $("input[name=gender]").val();
	var marital_status = $("input[name=marital_status]").val();
	var active = $("input[name=active]").val();

	$.ajax({
		type: "POST",
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json",
			"Authorization": "Bearer " + window.token,
		},
		url: "http://localhost:8888/employees",
		data: {
		"employee_id": 5,
		"first_name": "Raymart",
		"last_name": "Obeso"
		},
		dataType: "json",
		success: function(response)
		{
			console.log(response);
		},
		error: function(jqXHR)
		{
			console.log(jqXHR);
		}
	});
}

function update_employee()
{
	var empid = $("input[name='employee_id']").val();
	var first_name = $("input[name='Fname']").val();
	var last_name = $("input[name='Lname']").val();
	var middle_name = $("input[name='Mname']").val();
	var birthdate = $("input[name='birthdate']").val();
	var gender = $("input[name=gender]").val();
	var marital_status = $("input[name=marital_status]").val();
	var active = $("input[name=active]").val();

	$.ajax({
		type: "POST",
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json",
			"Authorization": "Bearer " + window.token,
		},
		url: "http://localhost:8888/employees",
		data: {
		"employee_id": 5,
		"first_name": "Raymart",
		"last_name": "Obeso"
		},
		dataType: "json",
		success: function(response)
		{
			console.log(response);
		},
		error: function(jqXHR)
		{
			console.log(jqXHR);
		}
	});
}

function delete_employee()
{
	var empid = $("input[name='employee_id']").val();
	var first_name = $("input[name='Fname']").val();
	var last_name = $("input[name='Lname']").val();
	var middle_name = $("input[name='Mname']").val();
	var birthdate = $("input[name='birthdate']").val();
	var gender = $("input[name=gender]").val();
	var marital_status = $("input[name=marital_status]").val();
	var active = $("input[name=active]").val();

	$.ajax({
		type: "POST",
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json",
			"Authorization": "Bearer " + window.token,
		},
		url: "http://localhost:8888/employees",
		data: {
		"employee_id": 5,
		"first_name": "Raymart",
		"last_name": "Obeso"
		},
		dataType: "json",
		success: function(response)
		{
			console.log(response);
		},
		error: function(jqXHR)
		{
			console.log(jqXHR);
		}
	});
}