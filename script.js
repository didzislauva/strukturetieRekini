let items = [];

function syncSupplierIds(value) {
	document.getElementById('supplierEndpointId').value = value;
	document.getElementById('supplierCompanyId').value = 'LV' + value;
}

function syncSupplierName(value) {
	document.getElementById('supplierRegistrationName').value = value;
}

function syncCustomerIds(value) {
	document.getElementById('customerEndpointId').value = value;
	document.getElementById('customerCompanyId').value = 'LV' + value;
	document.getElementById('buyerReference').value = value;
}

function syncCustomerName(value) {
	document.getElementById('customerRegistrationName').value = value;
}

function toggleAdvanced() {
	const advancedFields = document.querySelectorAll('.advancedSection');
	advancedFields.forEach(field => {
		field.classList.toggle('hidden-locked');
	});
	const section = document.getElementById('advancedSection');
	section.classList.toggle('hidden-locked');

	if (section.classList.contains('hidden-locked')) {
		document.getElementById('unlockCheckbox').checked = false;
		toggleLock(false);
	}
}

function toggleLock(enable) {
	const inputs = document.querySelectorAll('.lockable-input');
	inputs.forEach(input => {
		input.disabled = !enable;
	});
}

function addItem() {
    items.push({
        id: items.length + 1,
        name: '',
        quantity: '1.00',
        unitCode: 'H87',
        price: '0.00',
        vatRate: '21'
    });
    renderItems();
}

function deleteItem(index) {
    items.splice(index, 1);
    renderItems();
}

function updateItem(index, field, value) {
    items[index][field] = value;
    renderItems();
}

function calculateTotals() {
	let subtotal = 0;
	let vatAmount = 0;
	items.forEach(item => {
		const quantity = parseFloat(item.quantity) || 0;
		const price = parseFloat(item.price) || 0;
		const vatRate = parseFloat(item.vatRate) || 0;
		const lineTotal = quantity * price;
		subtotal += lineTotal;
		vatAmount += lineTotal * (vatRate / 100);
	});

	const total = subtotal + vatAmount;
	const prepaidAmount = parseFloat(document.getElementById('prepaidAmount').value) || 0;
	const payableAmount = total - prepaidAmount;

	document.getElementById('subtotal').textContent = subtotal.toFixed(2);
	document.getElementById('vatAmount').textContent = vatAmount.toFixed(2);
	document.getElementById('total').textContent = total.toFixed(2);
	document.getElementById('payableAmount').textContent = payableAmount.toFixed(2);
}

function renderItems() {
    const container = document.getElementById('itemsContainer');
    container.innerHTML = items.map((item, index) => `
        <div class="item-row">
            <input type="text" value="${item.name}" onchange="updateItem(${index}, 'name', this.value)">
            <input type="number" step="0.01" value="${item.quantity}" onchange="updateItem(${index}, 'quantity', this.value)">
            <input type="text" disabled class="lockable-input" value="${item.unitCode}" onchange="updateItem(${index}, 'unitCode', this.value)">
            <input type="number" step="0.01" value="${item.price}" onchange="updateItem(${index}, 'price', this.value)">
            <input type="number" value="${item.vatRate}" onchange="updateItem(${index}, 'vatRate', this.value)">
            <div>${((parseFloat(item.quantity) || 0) * (parseFloat(item.price) || 0)).toFixed(2)}</div>
            <button class="delete-btn" onclick="deleteItem(${index})">X</button>
        </div>
    `).join('');
    calculateTotals();
}

window.addEventListener('load', (event) => {
    setTimeout(() => {
        const supplierPartyId = document.getElementById('supplierPartyId').value;
        if (supplierPartyId) syncSupplierIds(supplierPartyId);
      
        const supplierName = document.getElementById('supplierName').value;
        if (supplierName) syncSupplierName(supplierName);
		
		const customerName = document.getElementById('customerName').value;
        if (customerName) syncCustomerName(customerName);

        const customerPartyId = document.getElementById('customerPartyId').value;
        if (customerPartyId) syncCustomerIds(customerPartyId);
		
		const today = new Date().toISOString().split('T')[0];
        document.getElementById('issueDate').value = today;
		
		// Set dueDate to 14 days from today
		const dueDate = new Date();
		dueDate.setDate(dueDate.getDate() + 14);
		document.getElementById('dueDate').value = dueDate.toISOString().split('T')[0];

		// Initial update of due date label
		updateDueDateLabel();
		
    }, 100);
	
	
});

function validateFields() {
    const requiredFields = [
        { id: 'contractDocumentReference', label: 'Rēķina pamatojuma līguma numurs' },
        { id: 'supplierPartyId', label: 'Piegādātāja reģistrācijas numurs' },
		{ id: 'supplierName', label: 'Piegādātāja nosaukums' },
		{ id: 'supplierAddress', label: 'Piegādātāja adrese' },
        { id: 'customerPartyId', label: 'Pasūtītāja reģistrācijas numurs' },
		{ id: 'customerName', label: 'Pasūtītāja nosaukums' },
		{ id: 'customerAddress', label: 'Piegādātāja adrese' },
		
        { id: 'payeeAccountId', label: 'Maksājuma saņēmēja konta numurs' },
		{ id: 'payeeFinancialInstitutionId', label: 'Maksājuma saņēmēja konta numurs' },
		
		{ id: 'payerAccountId', label: 'Maksātāja konta numurs' },
		{ id: 'payerFinancialInstitutionId', label: 'Maksātāja konta numurs' }
    ];

    let isValid = true;
    let missingFields = [];

    requiredFields.forEach(field => {
        const element = document.getElementById(field.id);
        if (!element.value.trim()) {
            element.classList.add('error');
            missingFields.push(field.label);
            isValid = false;
        } else {
            element.classList.remove('error');
        }
    });

	const warningBox = document.getElementById('warningBox');
    if (!isValid) {
			warningBox.innerHTML = 'Lūdzu, aizpildiet šādus obligātos laukus:<br>' + missingFields.join('<br>');
		} else {
			warningBox.innerHTML = '';  // Clear warning if all is good
		}

    return isValid;
}

function updateDueDateLabel() {
    const issueDate = new Date(document.getElementById('issueDate').value);
    const dueDate = new Date(document.getElementById('dueDate').value);
    const diffTime = dueDate - issueDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    document.getElementById('dueDateLabel').textContent = `Apmaksas termiņš - ${diffDays} dienas`;
}

function generateXML() {
			if (!validateFields()) return;
            const getFieldValue = (id) => document.getElementById(id).value;
            
            let xml = `<?xml version="1.0" encoding="UTF-8"?>
<Invoice xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2"
        xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2"
        xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2">
    <cbc:CustomizationID>${getFieldValue('customizationId')}</cbc:CustomizationID>
    <cbc:ProfileID>${getFieldValue('profileId')}</cbc:ProfileID>
    <cbc:ID>${getFieldValue('invoiceId')}</cbc:ID>
    <cbc:IssueDate>${getFieldValue('issueDate')}</cbc:IssueDate>
    <cbc:DueDate>${getFieldValue('dueDate')}</cbc:DueDate>
    <cbc:InvoiceTypeCode>${getFieldValue('invoiceTypeCode')}</cbc:InvoiceTypeCode>
    <cbc:Note>${getFieldValue('note')}</cbc:Note>
    <cbc:DocumentCurrencyCode>${getFieldValue('documentCurrencyCode')}</cbc:DocumentCurrencyCode>
    <cbc:BuyerReference>${getFieldValue('buyerReference')}</cbc:BuyerReference>
    <cac:ContractDocumentReference>
        <cbc:ID>${getFieldValue('contractDocumentReference')}</cbc:ID>
    </cac:ContractDocumentReference>
    
    <cac:AccountingSupplierParty>
        <cac:Party>
            <cbc:EndpointID schemeID="9939">${getFieldValue('supplierEndpointId')}</cbc:EndpointID>
            <cac:PartyIdentification>
                <cbc:ID>${getFieldValue('supplierPartyId')}</cbc:ID>
            </cac:PartyIdentification>
            <cac:PartyName>
                <cbc:Name>${getFieldValue('supplierName')}</cbc:Name>
            </cac:PartyName>
            <cac:PostalAddress>
                <cac:AddressLine>
                    <cbc:Line>${getFieldValue('supplierAddress')}</cbc:Line>
                </cac:AddressLine>
                <cac:Country>
                    <cbc:IdentificationCode>${getFieldValue('supplierCountry')}</cbc:IdentificationCode>
                </cac:Country>
            </cac:PostalAddress>
            <cac:PartyTaxScheme>
                <cbc:CompanyID>${getFieldValue('supplierVatNumber')}</cbc:CompanyID>
                <cac:TaxScheme>
                    <cbc:ID>VAT</cbc:ID>
                </cac:TaxScheme>
            </cac:PartyTaxScheme>
            <cac:PartyLegalEntity>
                <cbc:RegistrationName>${getFieldValue('supplierRegistrationName')}</cbc:RegistrationName>
                <cbc:CompanyID>${getFieldValue('supplierCompanyId')}</cbc:CompanyID>
            </cac:PartyLegalEntity>
        </cac:Party>
    </cac:AccountingSupplierParty>
    
	<cac:AccountingCustomerParty>
		<cac:Party>
			<cbc:EndpointID schemeID="9939">${getFieldValue('customerEndpointId')}</cbc:EndpointID>
			<cac:PartyIdentification>
				<cbc:ID>${getFieldValue('customerPartyId')}</cbc:ID>
			</cac:PartyIdentification>
			<cac:PartyName>
				<cbc:Name>${getFieldValue('customerName')}</cbc:Name>
			</cac:PartyName>
			<cac:PostalAddress>
				<cac:AddressLine>
					<cbc:Line>${getFieldValue('customerAddress')}</cbc:Line>
				</cac:AddressLine>
				<cac:Country>
					<cbc:IdentificationCode>${getFieldValue('customerCountry')}</cbc:IdentificationCode>
				</cac:Country>
			</cac:PostalAddress>
			<cac:PartyTaxScheme>
				<cbc:CompanyID>${getFieldValue('customerVatNumber')}</cbc:CompanyID>
				<cac:TaxScheme>
					<cbc:ID>VAT</cbc:ID>
				</cac:TaxScheme>
			</cac:PartyTaxScheme>
			<cac:PartyLegalEntity>
				<cbc:RegistrationName>${getFieldValue('customerRegistrationName')}</cbc:RegistrationName>
				<cbc:CompanyID>${getFieldValue('customerCompanyId')}</cbc:CompanyID>
			</cac:PartyLegalEntity>
		</cac:Party>
	</cac:AccountingCustomerParty>

	<cac:PaymentMeans>
		<cbc:PaymentMeansCode>${getFieldValue('paymentMeansCode')}</cbc:PaymentMeansCode>
		<cac:PayeeFinancialAccount>
			<cbc:ID>${getFieldValue('payeeAccountId')}</cbc:ID>
			<cac:FinancialInstitutionBranch>
				<cbc:ID>${getFieldValue('payeeFinancialInstitutionId')}</cbc:ID>
			</cac:FinancialInstitutionBranch>
		</cac:PayeeFinancialAccount>
		<cac:PaymentMandate>
			<cac:PayerFinancialAccount>
				<cbc:ID>${getFieldValue('payerAccountId')}</cbc:ID>
				<cac:FinancialInstitutionBranch>
					<cbc:ID>${getFieldValue('payerFinancialInstitutionId')}</cbc:ID>
				</cac:FinancialInstitutionBranch>
			</cac:PayerFinancialAccount>
		</cac:PaymentMandate>
	</cac:PaymentMeans>

	<cac:TaxTotal>
		<cbc:TaxAmount currencyID="EUR">${document.getElementById('vatAmount').textContent}</cbc:TaxAmount>
		<cac:TaxSubtotal>
			<cbc:TaxableAmount currencyID="EUR">${document.getElementById('subtotal').textContent}</cbc:TaxableAmount>
			<cbc:TaxAmount currencyID="EUR">${document.getElementById('vatAmount').textContent}</cbc:TaxAmount>
			<cac:TaxCategory>
				<cbc:ID>S</cbc:ID>
				<cbc:Name>VAT 21%</cbc:Name>
				<cbc:Percent>21</cbc:Percent>
				<cac:TaxScheme>
					<cbc:ID>VAT</cbc:ID>
				</cac:TaxScheme>
			</cac:TaxCategory>
		</cac:TaxSubtotal>
	</cac:TaxTotal>

	<cac:LegalMonetaryTotal>
		<cbc:LineExtensionAmount currencyID="EUR">${document.getElementById('subtotal').textContent}</cbc:LineExtensionAmount>
		<cbc:TaxExclusiveAmount currencyID="EUR">${document.getElementById('subtotal').textContent}</cbc:TaxExclusiveAmount>
		<cbc:TaxInclusiveAmount currencyID="EUR">${document.getElementById('total').textContent}</cbc:TaxInclusiveAmount>
		<cbc:PrepaidAmount currencyID="EUR">${getFieldValue('prepaidAmount')}</cbc:PrepaidAmount>
		<cbc:PayableAmount currencyID="EUR">${document.getElementById('payableAmount').textContent}</cbc:PayableAmount>
	</cac:LegalMonetaryTotal>

	${items.map((item, index) => `
	<cac:InvoiceLine>
		<cbc:ID>${index + 1}</cbc:ID>
		<cbc:InvoicedQuantity unitCode="${item.unitCode}">${parseFloat(item.quantity).toFixed(2)}</cbc:InvoicedQuantity>
		<cbc:LineExtensionAmount currencyID="EUR">${(parseFloat(item.quantity) * parseFloat(item.price)).toFixed(2)}</cbc:LineExtensionAmount>
		<cac:AllowanceCharge>
			<cbc:ChargeIndicator>false</cbc:ChargeIndicator>
			<cbc:AllowanceChargeReason>-</cbc:AllowanceChargeReason>
			<cbc:Amount currencyID="EUR">0.00</cbc:Amount>
		</cac:AllowanceCharge>
		<cac:Item>
			<cbc:Name>${item.name}</cbc:Name>
			<cac:ClassifiedTaxCategory>
				<cbc:ID>S</cbc:ID>
				<cbc:Percent>${parseFloat(item.vatRate).toFixed(2)}</cbc:Percent>
				<cac:TaxScheme>
					<cbc:ID>VAT</cbc:ID>
				</cac:TaxScheme>
			</cac:ClassifiedTaxCategory>
		</cac:Item>
		<cac:Price>
			<cbc:PriceAmount currencyID="EUR">${parseFloat(item.price).toFixed(4)}</cbc:PriceAmount>
			<cbc:BaseQuantity>1.00</cbc:BaseQuantity>
		</cac:Price>
	</cac:InvoiceLine>
	`).join('')}

</Invoice>`;

const blob = new Blob([xml], { type: 'application/xml' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'invoice.xml';
a.click();
URL.revokeObjectURL(url);
}


addItem();
