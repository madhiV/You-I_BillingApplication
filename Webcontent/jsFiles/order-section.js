$(document).ready(function() {
	setInterval(updateBillNo, 5000);
	
	//Event listeners
	$("#order-master-bill-clear-btn").click(function() {
		clearOrderMasterBillEntries();
	});

	$("#order-master-search-bar").on("input", function() {
		var itemSearchBarText = $("#order-master-search-bar").val();
		var itemList = "#order-master-search-bar-items";
		loadItemsInSearchBar(itemSearchBarText, itemList, true);
		if (itemSearchBarText.slice(-1) === '\u2063') {
			var itemName = itemSearchBarText.slice(0, -1).split("    ")[0];
			addItemToBillSection(itemName);
			$("#order-master-search-bar").val("");
			loadItemsInSearchBar("", itemList, true);
		}
	});
});
function addItemToBillSection(itemName) {
	$.ajax({
		url: "item-details",
		type: "GET",
		data: {
			itemName: itemName
		},
		success: function(data, textStatus, xhr) {
			if (xhr.readyState == 4) {
				if (xhr.status == 200) {
					addItemtoOrderBillSection(xhr.responseText);
				}
			}
		}
	});
}

function addItemtoOrderBillSection(itemJsonData) {
	var itemData = JSON.parse(itemJsonData);
	var orderTable = document.getElementById("order-master-billing-section-table");
	if (itemAddedAlready(orderTable, itemData.itemName)) {
		//Item Already Added instruction.!
		return;
	}
	//Add new row
	var rowNo = orderTable.rows.length;
	var newRow = orderTable.insertRow();

	newRow.insertCell().innerHTML = rowNo;
	newRow.insertCell().innerHTML = itemData.itemName;
	newRow.insertCell().innerHTML = createItemQuantityCell(rowNo).outerHTML;
	newRow.insertCell().innerHTML = itemData.itemPrice;
	newRow.insertCell().innerHTML = itemData.itemPrice;
	newRow.insertCell().innerHTML = createRemoveButton(rowNo);

	$('#order-master-billItem-' + rowNo).on("input", function() {
		var quantityElement = $('#order-master-billItem-' + rowNo);
		if (quantityElement.val() == '') {
			quantityElement.value = 1;
			return;
		}
		updateBillPrice(rowNo, quantityElement.val(), itemData.itemPrice);
		updateBillGrandTotal();
	});

	var buttonId = 'order-master-billItem-remove-btn-' + rowNo;
	$('#' + buttonId).on("click", function() {
		removeItemFromBill(rowNo, buttonId);
	});
	updateBillGrandTotal();

	//item quantity change -> corresponding item price change, total price change.!
	//item quantity = 0 -> item row needs to be removed, s.no's of other rows need to be changed.!
	//item quantity = '' -> set it to 1!
}

function itemAddedAlready(orderTable, itemName) {
	var itemNameColumn = 1;
	for (var i = 1; i < orderTable.rows.length; i++) {
		//Item is present in 2nd column
		if (orderTable.rows[i].cells[itemNameColumn].innerHTML === itemName) {
			return true;
		}
	}
	return false;
}

function createRemoveButton(rowNo) {
	var removeButton = document.createElement('input');
	var buttonId = 'order-master-billItem-remove-btn-' + rowNo;
	removeButton.type = 'button';
	removeButton.setAttribute("value", 'Remove');
	removeButton.id = buttonId;

	return removeButton.outerHTML;
}

function createItemQuantityCell(rowNo) {
	var quantityCell = document.createElement('input');
	quantityCell.type = 'number';
	quantityCell.setAttribute("value", 1);
	quantityCell.min = 1;
	quantityCell.id = 'order-master-billItem-' + rowNo;

	return quantityCell;
}

function removeItemFromBill(rowNo, buttonId) {
	//remove current row
	var orderTable = document.getElementById("order-master-billing-section-table");
	var currentCell = $('#' + buttonId);
	currentCell.closest('tr').remove();

	updateBillGrandTotal();
	updateBillSerialNumbers(rowNo);
}

function updateBillPrice(rowNo, quantity, itemPrice) {
	var orderTable = document.getElementById("order-master-billing-section-table");
	var amountColumn = 4;
	var amount = itemPrice * quantity;

	orderTable.rows[rowNo].cells[amountColumn].innerHTML = amount;
}

function updateBillNo() {
	$.ajax({
		url: "bill-number",
		type: "GET",
		success: function(data, textStatus, xhr) {
			if (xhr.readyState == 4) {
				if (xhr.status == 200) {
					var response = xhr.responseText;
					var billNo = JSON.parse(response).billNo;
					$("#order-master-bill-no").text(billNo);
				}
			}
		}
	});
}


function updateBillSerialNumbers(startingRowNumber) {
	var orderTable = document.getElementById("order-master-billing-section-table");
	var serialNumberColumn = 0;
	var quantityColumn = 2;


	for (var i = startingRowNumber; i < orderTable.rows.length; i++) {
		orderTable.rows[i].cells[serialNumberColumn].innerHTML = i;

		//Altering the current row's remove button id
		var oldButtonId = 'order-master-billItem-remove-btn-' + (i + 1);
		var newButtonId = 'order-master-billItem-remove-btn-' + i;
		$('#' + oldButtonId).attr('id', newButtonId);

		//Altering the current row's quantity id
		var oldQuantityInputId = 'order-master-billItem-' + (i + 1);
		var newQuantityInputId = 'order-master-billItem-' + i;
		$('#' + oldQuantityInputId).attr('id', newQuantityInputId);
	}
}

function updateBillGrandTotal() {
	var grandTotal = 0;
	var orderTable = document.getElementById("order-master-billing-section-table");
	var quantityColumn = 2;
	var itemPriceColumn = 3;

	for (var i = 1; i < orderTable.rows.length; i++) {
		var amount = orderTable.rows[i].cells[quantityColumn].firstChild.value * orderTable.rows[i].cells[itemPriceColumn].innerHTML;
		grandTotal += amount;
	}
	$("#order-master-grand-total").text(grandTotal);
}

function clearOrderMasterBillEntries() {
	var orderTable = document.getElementById("order-master-billing-section-table");
	for (var i = orderTable.rows.length - 1; i >= 1; i--) {
		orderTable.rows[i].remove();
		alert(orderTable.rows[i]);
	}
	updateBillGrandTotal();
}
