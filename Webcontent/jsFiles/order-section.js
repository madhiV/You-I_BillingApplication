$(document).ready(function() {
	setInterval(updateBillNo, 2000000);

	//Event listeners
	$("#order-master-bill-clear-btn").click(function() {
		clearOrderMasterBillEntries();
	});

	$("#order-master-print-btn").click(function() {
		printBill();
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
	var quantityCellId = 'order-master-billItem-quantity-' + rowNo;
	var incrementButtonId = 'order-master-item-increment-btn' + rowNo;
	var decrementButtonId = 'order-master-item-decrement-btn' + rowNo;

	var quantityButtonContainer = htmlToElem('<div class="quantityButtonContainer"></div>');
	var decrementButton = htmlToElem('<button onclick="itemQuantityModifier(this, ' + rowNo + ')" class="order-quantity-btn decrement-btn" id = "' + decrementButtonId + '"> - </button>');
	var incrementButton = htmlToElem('<button onclick="itemQuantityModifier(this, ' + rowNo + ')" class="order-quantity-btn increment-btn" id = "' + incrementButtonId + '"> + </button>');
	var inputBox = htmlToElem('<input type="number" min="1" max="100" step="1" value="1" id=' + quantityCellId + " readonly>");

	quantityButtonContainer.appendChild(decrementButton);
	quantityButtonContainer.appendChild(inputBox);
	quantityButtonContainer.appendChild(incrementButton);

	return quantityButtonContainer;
}

function htmlToElem(html) {
	let temp = document.createElement('template');
	html = html.trim(); // Never return a space text node as a result
	temp.innerHTML = html;
	return temp.content.firstChild;
}

function removeItemFromBill(rowNo, buttonId) {
	//remove current row
	var orderTable = document.getElementById("order-master-billing-section-table");
	var currentCell = $('#' + buttonId);
	currentCell.closest('tr').remove();

	updateBillGrandTotal();
	updateBillSerialNumbers(rowNo);
}

function updateBillPrice(rowNo, quantity) {
	var orderTable = document.getElementById("order-master-billing-section-table");
	var quantityColumn = 2;
	var quantityCellContainer = orderTable.rows[rowNo].cells[quantityColumn].firstChild;
	var quantityElement = quantityCellContainer.children[1];
	var quantity = Number(quantityElement.value);

	var itemPrice = Number(orderTable.rows[rowNo].cells[3].innerHTML);
	var amount = quantity * itemPrice;
	var amountColumn = 4;

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
		$('#' + newButtonId).on("click", function() {
			removeItemFromBill(i, newButtonId);
		});

		//Altering the current row's quantity, increment and decrement button ids.
		var quantityCellContainer = orderTable.rows[i].cells[quantityColumn].firstChild;
		var decrementButton = quantityCellContainer.children[0];
		var quantityElement = quantityCellContainer.children[1];
		var incrementButton = quantityCellContainer.children[2];

		var newQuantityInputId = 'order-master-billItem-quantity-' + i;
		var incrementButtonId = 'order-master-item-increment-btn' + i;
		var decrementButtonId = 'order-master-item-decrement-btn' + i;


		decrementButton.id = decrementButtonId;
		quantityElement.id = newQuantityInputId;
		incrementButton.id = incrementButtonId;

		//changing onclick functionality
		var newOnclickFunction = "itemQuantityModifier(this, " + i + ")";
		decrementButton.setAttribute("onclick", newOnclickFunction);
		incrementButton.setAttribute("onclick", newOnclickFunction);
	}
}

function updateBillGrandTotal() {
	var grandTotal = 0;
	var orderTable = document.getElementById("order-master-billing-section-table");
	var quantityColumn = 2;
	var itemPriceColumn = 3;

	for (var i = 1; i < orderTable.rows.length; i++) {
		var quantityCellContainer = orderTable.rows[i].cells[quantityColumn].firstChild;
		var quantityElement = quantityCellContainer.children[1];
		var itemPriceElement = orderTable.rows[i].cells[itemPriceColumn];
		var quantity = quantityElement.value;
		var itemPrice = itemPriceElement.innerHTML;;
		var amount = quantity * itemPrice;
		grandTotal += amount;
	}
	$("#order-master-grand-total").text(grandTotal);
}

function clearOrderMasterBillEntries() {
	var orderTable = document.getElementById("order-master-billing-section-table");
	for (var i = orderTable.rows.length - 1; i >= 1; i--) {
		orderTable.rows[i].remove();
	}
	updateBillGrandTotal();
}

function printBill() {
	var originalContent = document.body.innerHTML;
	var billContent = generateBillContent();
	document.body.innerHTML = billContent;
	window.print();
	document.body.innerHTML = originalContent;
	clearOrderMasterBillEntries();
}

function generateBillContent() {
	//header
	var billContent = "<b>---------------<br>";
	billContent += "S.No          Item          Quantity          Rate<br>";
	var orderTable = document.getElementById("order-master-billing-section-table");
	for (var i = 1; i < orderTable.rows.length; i++) {
		var sNo = orderTable.rows[i].cells[0].innerHTML;
		var itemName = orderTable.rows[i].cells[1].innerHTML;
		var quantity = orderTable.rows[i].cells[2].firstChild.value;
		var rate = orderTable.rows[i].cells[3].innerHTML;

		billContent += sNo + "    ";
		billContent += itemName + "    ";
		billContent += quantity + "    ";
		billContent += rate + "    <br>";

	}
	billContent += "--------------------<br>";
	billContent += "             Grand Total " + $("#order-master-grand-total").text();
	billContent += "<br>-------------";
	return billContent;
}

function itemQuantityModifier(btn, rowNo) {
	var quantityCellId = '#order-master-billItem-quantity-' + rowNo;
	const buttonId = btn.getAttribute("id");
	var quantityCell = $(quantityCellId);

	let oldValue = Number(quantityCell.val());
	let newValue = (buttonId.includes("increment")) ? oldValue + 1 : oldValue - 1;

	if (newValue >= 1) {
		quantityCell.val(newValue);
	}

	updateBillPrice(rowNo, quantityCell.val());
	updateBillGrandTotal();
}