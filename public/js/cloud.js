var mySidebar;
var myToolbar;
var loginPopup;
var loginForm;
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
			hr();
		}
	});

	if (true)
		login();
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
			if(do_login() == 1) {
				w1.close();
			}
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

function hr()
{
	myContext = new dhtmlXMenuObject();
	myContext.renderAsContextMenu();
	myContext.attachEvent("onClick",removeItem);
	myContext.loadStruct("./json/hr_context-menu.json", "json");

	myMenu = mySidebar.cells("dashboard").attachMenu({
		json: "./json/hr_menu.json",
		icons_path: "./img/dhtmlxSidebar/toolbar_18/",
	});

	myGrid = mySidebar.cells("dashboard").attachGrid();
	myGrid.load("./json/hr_grid.json", "json");
	myGrid.enableContextMenu(myContext);
	myGrid.init();

	myGrid.attachEvent("onRowDblClicked", function(rowId, cell_index) {
		hr_201File();
	});

	myMenu.attachEvent("onClick", function(id) {
		if("201_new" == id) {
			hr_201File();
		}
	});
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
				text: "Are you sure you wan to remove this?",
				callback: function(response) {
					if(response == true) {
						window.setTimeout("myGrid.deleteRow("+rowId+");",200);
					}
				}
			});
			break;
	}
}

function hr_201File()
{
	dhxWins = new dhtmlXWindows();
	w1 = dhxWins.createWindow({
		id: "w1",
		width: 810,
		height: 480,
		move: false,
		center: true,
		resize: false,
		caption: 'Add New 201 File'
	});
	w1.button("minmax").hide();

	myTabbar = w1.attachTabbar({
		tabs: [
			{id: "t1", text: "Basic Information", active: true},
			{id: "t2", text: "Contact Details"},
			{id: "t3", text: "Employment Details"},
			{id: "t4", text: "Goverment Details"},
			{id: "t5", text: "School and Work History"},
		]
	});

	formData = [
		{ type: "fieldset", label: "Basic Information", list: [
		{ type:"block", width: 743, list: [
			{type: "label", label: "<img src='./img/64x64-logo.png' />"},
			{ type: "newcolumn" },
			{type: "upload", name: "myFiles", offsetLeft: 320, inputWidth: 330, url: "php/dhtmlxform_item_upload.php", _swfLogs: "enabled", swfPath: "uploader.swf", swfUrl: "php/dhtmlxform_item_upload.php"},
		]},
		{ type:"block", width: 743, list: [
			{type: "input", name: "employee_id", label: "Employee No.", inputWidth: 300, position: "label-top", required:true, validate:"NotEmpty"},
			{ type: "newcolumn" },
			{type: "input", name: "Fname", offsetLeft: 85, label: "First Name", inputWidth: 300, position: "label-top", required:true, validate:"NotEmpty"},
		]},
		{ type:"block", width: 743, list: [
			{type: "input", name: "Lname", label: "Last Name", inputWidth: 300, position: "label-top", required:true, validate:"NotEmpty"},
			{ type: "newcolumn" },
			{type: "input", name: "Mname", offsetLeft: 85, label: "Middle Name", inputWidth: 300, position: "label-top"},
		]},
		{ type:"block", width: 743, list: [
			{type: "calendar", name: "birthdate", label: "Birthdate", inputWidth: 300, position: "label-top" },
			{ type: "newcolumn" },
			{type: "input", name: "gender", offsetLeft: 85, label: "Gender", inputWidth: 300, position: "label-top" },
		]},
		{ type:"block", width: 743, list: [
			{type: "input", name: "marital_status", label: "Marital Status", inputWidth: 300, position: "label-top" },
			{ type: "newcolumn" },
			{type: "select", name: "active", offsetLeft: 85, label: "Active", inputWidth: 300, position: "label-top" },
		]},

		]}, //end basic information
		{ type: "button", value: "Submit", name: "basic_button", className: "btnSub"}
	];

	contact_details = [
		{ type: "fieldset", label: "Contact Details", list: [
		{ type:"block", width: 743, list: [
			{type: "input", name: "email", label: "Email", inputWidth: 300, position: "label-top" },
			{ type: "newcolumn" },
			{type: "input", name: "phone_no", offsetLeft: 85, label: "Phone No.", inputWidth: 300, position: "label-top" },
		]},
		{ type:"block", width: 743, list: [
			{type: "input", name: "mobile_no", label: "Mobile No.", inputWidth: 300, position: "label-top" },
			{ type: "newcolumn" },
			{type: "input", name: "address1", offsetLeft: 85, label: "Address Line 1", inputWidth: 300, position: "label-top" },
		]},
		{ type:"block", width: 743, list: [
			{type: "input", name: "address2", label: "Address Line 2", inputWidth: 302, position: "label-top" },
			{ type: "newcolumn" },
			{type: "select", name: "city", offsetLeft: 85, label: "City", inputWidth: 302, position: "label-top" },
		]},
		{ type:"block", width: 743, list: [
			{type: "select", name: "province", label: "Province", inputWidth: 302, position: "label-top" },
			{ type: "newcolumn" },
			{type: "select", name: "country", offsetLeft: 88, label: "Country", inputWidth: 302, position: "label-top" },
		]},
		]},// end Contact details
		{ type: "button", value: "Submit", className: "btnSub" }
	];

	employment_details = [
		{ type: "fieldset", label: "Employment Details", list: [
		{ type:"block", width: 743, list: [
			{type: "select", name: "employment_type", label: "Employment Type", inputWidth: 300, position: "label-top" },
			{ type: "newcolumn" },
			{type: "select", name: "department", offsetLeft: 85, label: "Department", inputWidth: 300, position: "label-top" },
		]},
		{ type:"block", width: 743, list: [
			{type: "select", name: "position", label: "Position", inputWidth: 300, position: "label-top" },
			{ type: "newcolumn" },
			{type: "select", name: "rank", offsetLeft: 85, label: "Rank", inputWidth: 300, position: "label-top" },
		]},
		{ type:"block", width: 743, list: [
			{type: "calendar", name: "date_hired", label: "Date Hired", inputWidth: 302, position: "label-top" },
			{ type: "newcolumn" },
			{type: "calendar", name: "date_ended", offsetLeft: 80, label: "Date Ended", inputWidth: 302, position: "label-top" },
		]},

		]},// end Employment details
		{ type: "button", value: "Submit", className: "btnSub" }
	];

	government_details = [
		{ type: "fieldset", label: "Government Details", list: [
		{ type:"block", width: 743, list: [
			{type: "input", name: "sss_no", label: "SSS Number", inputWidth: 300, position: "label-top" },
			{ type: "newcolumn" },
			{type: "input", name: "bir_no", offsetLeft: 85, label: "BIR Number", inputWidth: 300, position: "label-top" },
		]},
		{ type:"block", width: 743, list: [
			{type: "input", name: "taxID", label: "Tax Identification No.", inputWidth: 300, position: "label-top" },
			{ type: "newcolumn" },
			{type: "input", name: "philheath_no", offsetLeft: 85, label: "Philhealth Number", inputWidth: 300, position: "label-top" },
		]},
		{ type:"block", width: 743, list: [
			{type: "input", name: "hdmf_no", label: "HDMF Number", inputWidth: 300, position: "label-top" },
		]},
		]}, // end government fieldset
		{ type: "button", value: "Submit", className: "btnSub" }
	];

	school_work = [
		{ type: "fieldset", label: "School & Work History", list: [
		{ type:"block", width: 743, list: [
			{type: "input", name: "ETD", label: "Education/Transcripts/Diplomas", inputWidth: 300, position: "label-top" },
			{ type: "newcolumn" },
			{type: "input", name: "PA", offsetLeft: 85, label: "Performance Assessments", inputWidth: 300, position: "label-top" },
		]},
		{ type:"block", width: 743, list: [
			{type: "input", name: "clearance", label: "Clearances", inputWidth: 300, position: "label-top" },
			{ type: "newcolumn" },
			{type: "input", name: "correct_action", offsetLeft: 85, label: "Corrective actions", inputWidth: 300, position: "label-top" },
		]},
		{ type:"block", width: 743, list: [
			{type: "input", name: "work_history", label: "Work History", inputWidth: 300, position: "label-top" },
			{ type: "newcolumn" },
			{type: "input", name: "PEI", offsetLeft: 85, label: "Post Employment Information", inputWidth: 300, position: "label-top" },
		]},
		]}, // end school & work fieldset
		{ type: "button", value: "Submit", className: "btnSub" }
	];

	myTabbar.tabs("t1").attachForm(formData, true);
	myTabbar.tabs("t2").attachForm(contact_details, true);
	myTabbar.tabs("t3").attachForm(employment_details, true);
	myTabbar.tabs("t4").attachForm(government_details, true);
	myTabbar.tabs("t5").attachForm(school_work, true);
}

function do_login()
{
	var user = $("input[name='username']").val();
	var pass = $("input[name='password']").val();
	
	$.ajax({
		type: "POST",
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json",
			'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8',
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
		 	console.log(response);
		 	return 1;
		 },
		 error: function(jqXHR, textStatus)
		 {
		 	if(jqXHR.statusText == "invalid_client") {
		 		dhtmlx.alert({
			 		title: "Invalid Credentials",
					text: "Username or Password is Incorrect",
				});
		 	}
		 	return 0;
		 }
	});
}