// ======================================================
// STITCHFLOW - COMPLETE SCRIPT
// ======================================================


// ======================================================
// DATA
// ======================================================

let customers =
    JSON.parse(localStorage.getItem("customers")) || [];

let measurements =
    JSON.parse(localStorage.getItem("measurements")) || [];

let orders =
    JSON.parse(localStorage.getItem("orders")) || [];


// ======================================================
// ELEMENTS
// ======================================================

const customerForm =
    document.getElementById("customerForm");

const customerList =
    document.getElementById("customerList");

const customerSearch =
    document.getElementById("customerSearch");

const measurementForm =
    document.getElementById("measurementForm");

const measurementCustomer =
    document.getElementById("measurementCustomer");

const garmentType =
    document.getElementById("garmentType");

const measurementFields =
    document.getElementById("measurementFields");

const orderForm =
    document.getElementById("orderForm");

const orderCustomer =
    document.getElementById("orderCustomer");

const dueSoonList =
    document.getElementById("dueSoonList");


// ======================================================
// PAGE HISTORY
// ======================================================

let pageHistory = ["dashboardPage"];


// ======================================================
// OPEN PAGE
// ======================================================

function openPage(pageId, addToHistory = true) {

    const pages =
        document.querySelectorAll(".page");

    pages.forEach(function (page) {

        page.classList.remove("active-page");

    });


    const selectedPage =
        document.getElementById(pageId);


    if (selectedPage) {

        selectedPage.classList.add("active-page");


        if (addToHistory) {

            const currentPage =
                pageHistory[pageHistory.length - 1];


            if (currentPage !== pageId) {

                pageHistory.push(pageId);

            }

        }

    }


    window.scrollTo(0, 0);

}


// ======================================================
// GO BACK
// ======================================================

function goBack() {

    if (pageHistory.length > 1) {

        pageHistory.pop();


        const previousPage =
            pageHistory[pageHistory.length - 1];


        openPage(previousPage, false);

    }

}


// ======================================================
// PAGE BUTTONS
// ======================================================

document.addEventListener(
    "click",
    function (event) {

        const pageButton =
            event.target.closest("[data-page]");


        if (pageButton) {

            openPage(
                pageButton.dataset.page
            );

        }

    }
);


// ======================================================
// ADD BACK ARROW TO EVERY PAGE
// ======================================================

function addBackArrows() {

    const pages =
        document.querySelectorAll(".page");


    pages.forEach(function (page) {

        if (
            page.id === "dashboardPage" ||
            page.id === "newCustomerPage"
        ) {
            return;
        }

        // Do not add another arrow if one already exists
        if (page.querySelector(".page-back-btn")) {
            return;
        }


        // Do not add arrow to dashboard
        if (page.id === "dashboardPage") {
            return;
        }


        const backButton =
            document.createElement("button");


        backButton.className =
            "page-back-btn";


        backButton.type = "button";


        backButton.innerHTML =
            "← Back";


        backButton.addEventListener(
            "click",
            function () {

                goBack();

            }
        );


        page.insertBefore(
            backButton,
            page.firstElementChild
        );

    });

}


// ======================================================
// INITIAL LOAD
// ======================================================

displayCustomers();

displayOrders();

updateCustomerDropdowns();

updateDashboard();

addBackArrows();


// ======================================================
// CUSTOMER FORM
// ======================================================

if (customerForm) {

    customerForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const name =
                document.getElementById("customerName").value.trim();


            const phone =
                document.getElementById("phone").value.trim();


            const gender =
                document.getElementById("gender").value;


            const editingId =
                document.getElementById("editingCustomerId");


            // EDIT CUSTOMER
            if (
                editingId &&
                editingId.value
            ) {

                const customer =
                    customers.find(
                        function (item) {

                            return item.id ==
                                editingId.value;

                        }
                    );


                if (customer) {

                    customer.name = name;

                    customer.phone = phone;

                    customer.gender = gender;

                }


                editingId.value = "";


                const saveButton =
                    document.getElementById(
                        "customerSaveBtn"
                    );


                if (saveButton) {

                    saveButton.textContent =
                        "Save Customer";

                }


                const title =
                    customerForm.parentElement
                        ?.querySelector("h2");


                if (title) {

                    title.textContent =
                        "👤 New Customer";

                }

            }

            // NEW CUSTOMER
            else {

                const newCustomer = {

                    id: Date.now().toString(),

                    name: name,

                    phone: phone,

                    gender: gender

                };


                customers.push(newCustomer);

            }


            saveData();


            customerForm.reset();


            displayCustomers();

            updateCustomerDropdowns();

            updateDashboard();


            openPage("customersPage");

        }
    );

}


// ======================================================
// DISPLAY CUSTOMERS
// ======================================================

function displayCustomers(
    searchText = ""
) {

    if (!customerList) {
        return;
    }


    customerList.innerHTML = "";


    const search =
        searchText.toLowerCase().trim();


    const filteredCustomers =
        customers.filter(
            function (customer) {

                return (
                    customer.name
                        .toLowerCase()
                        .includes(search)
                    ||
                    customer.phone
                        .toLowerCase()
                        .includes(search)
                );

            }
        );


    if (filteredCustomers.length === 0) {

        customerList.innerHTML =
            `
            <p class="empty-message">
                No customers found.
            </p>
            `;

        return;

    }


    filteredCustomers.forEach(
        function (customer) {

            const card =
                document.createElement("div");


            card.className =
                "customer-card";


            card.innerHTML =
                `
                <div class="customer-info">

                    <h3>
                        ${customer.name}
                    </h3>

                    <p>
                        📞 ${customer.phone}
                    </p>

                    <p>
                        👤 ${customer.gender}
                    </p>

                </div>

                <div class="customer-actions">

                    <button
                        class="edit-customer-btn"
                        data-id="${customer.id}">
                        ✏️ Edit
                    </button>

                    <button
                        class="view-details-btn"
                        data-id="${customer.id}">
                        👁️ Details
                    </button>

                    <button
                        class="delete-customer-btn"
                        data-id="${customer.id}">
                        🗑️ Delete
                    </button>

                </div>
                `;


            customerList.appendChild(card);

        }
    );

}


// ======================================================
// CUSTOMER SEARCH
// ======================================================

if (customerSearch) {

    customerSearch.addEventListener(
        "input",
        function () {

            displayCustomers(
                customerSearch.value
            );

        }
    );

}


// ======================================================
// CUSTOMER BUTTONS
// ======================================================

document.addEventListener(
    "click",
    function (event) {

        // EDIT CUSTOMER
        const editButton =
            event.target.closest(
                ".edit-customer-btn"
            );


        if (editButton) {

            editCustomer(
                editButton.dataset.id
            );

            return;

        }


        // VIEW DETAILS
        const detailsButton =
            event.target.closest(
                ".view-details-btn"
            );


        if (detailsButton) {

            showCustomerDetails(
                detailsButton.dataset.id
            );

            return;

        }


        // DELETE CUSTOMER
        const deleteButton =
            event.target.closest(
                ".delete-customer-btn"
            );


        if (deleteButton) {

            deleteCustomer(
                deleteButton.dataset.id
            );

        }

    }
);


// ======================================================
// EDIT CUSTOMER
// ======================================================

function editCustomer(customerId) {

    const customer =
        customers.find(
            function (item) {

                return item.id == customerId;

            }
        );


    if (!customer) {
        return;
    }


    document.getElementById(
        "customerName"
    ).value = customer.name;


    document.getElementById(
        "phone"
    ).value = customer.phone;


    document.getElementById(
        "gender"
    ).value = customer.gender;


    let editingId =
        document.getElementById(
            "editingCustomerId"
        );


    if (!editingId) {

        editingId =
            document.createElement("input");

        editingId.type = "hidden";

        editingId.id =
            "editingCustomerId";

        editingId.name =
            "editingCustomerId";

        customerForm.appendChild(
            editingId
        );

    }


    editingId.value =
        customer.id;


    const saveButton =
        document.getElementById(
            "customerSaveBtn"
        );


    if (saveButton) {

        saveButton.textContent =
            "Update Customer";

    }


    const title =
        customerForm.parentElement
            ?.querySelector("h2");


    if (title) {

        title.textContent =
            "✏️ Edit Customer";

    }


    openPage("newCustomerPage");

}


// ======================================================
// DELETE CUSTOMER
// ======================================================

function deleteCustomer(customerId) {

    const customer =
        customers.find(
            function (item) {

                return item.id == customerId;

            }
        );


    if (!customer) {
        return;
    }


    const confirmed =
        confirm(
            `Delete customer "${customer.name}"?\n\nThis will also delete their measurements and orders.`
        );


    if (!confirmed) {
        return;
    }


    customers =
        customers.filter(
            function (item) {

                return item.id != customerId;

            }
        );


    measurements =
        measurements.filter(
            function (item) {

                return item.customerId != customerId;

            }
        );


    orders =
        orders.filter(
            function (item) {

                return item.customerId != customerId;

            }
        );


    saveData();


    displayCustomers();

    updateCustomerDropdowns();

    displayOrders();

    updateDashboard();

}


// ======================================================
// CUSTOMER DETAILS
// ======================================================

function showCustomerDetails(customerId) {

    const customer =
        customers.find(
            function (item) {

                return item.id == customerId;

            }
        );


    if (!customer) {
        return;
    }


    const detailsContent =
        document.getElementById(
            "customerDetailsContent"
        );


    if (!detailsContent) {
        return;
    }


    const customerMeasurements =
        measurements.filter(
            function (item) {

                return item.customerId ==
                    customerId;

            }
        );


    const customerOrders =
        orders.filter(
            function (item) {

                return item.customerId ==
                    customerId;

            }
        );


    const pendingPayment =
        customerOrders.reduce(
            function (total, order) {

                return total +
                    Number(order.remaining || 0);

            },
            0
        );


    const upcomingOrders =
        customerOrders.filter(
            function (order) {

                return (
                    order.status !== "Delivered"
                    &&
                    order.deliveryDate
                );

            }
        );


    detailsContent.innerHTML =
        `
        <div class="details-block">

            <h3>
                👤 ${customer.name}
            </h3>

            <p>
                📞 ${customer.phone}
            </p>

            <p>
                Gender: ${customer.gender}
            </p>

        </div>


        <div class="details-block">

            <h3>
                📊 Summary
            </h3>

            <p>
                Total Orders:
                <strong>
                    ${customerOrders.length}
                </strong>
            </p>

            <p>
                Pending Payment:
                <strong>
                    ₹${pendingPayment}
                </strong>
            </p>

            <p>
                Upcoming Delivery:
                <strong>
                    ${upcomingOrders.length}
                </strong>
            </p>

        </div>


        <div class="details-block">

            <h3>
                📏 Measurements
            </h3>

            <div id="customerMeasurementsList">
                ${
                    customerMeasurements.length === 0
                    ?
                    `<p>No measurements saved.</p>`
                    :
                    customerMeasurements
                        .map(
                            function (measurement) {

                                return `
                                <div
                                    class="measurement-card">

                                    <h4>
                                        ${measurement.garment}
                                    </h4>

                                    <div
                                        class="measurement-grid">

                                        ${
                                            Object.keys(
                                                measurement
                                            )
                                            .filter(
                                                function (key) {

                                                    return (
                                                        key !== "id"
                                                        &&
                                                        key !== "customerId"
                                                        &&
                                                        key !== "garment"
                                                    );

                                                }
                                            )
                                            .map(
                                                function (key) {

                                                    return `
                                                    <div>

                                                        <span>
                                                            ${formatMeasurementName(key)}
                                                        </span>

                                                        <strong>
                                                            ${measurement[key]}
                                                        </strong>

                                                    </div>
                                                    `;

                                                }
                                            )
                                            .join("")
                                        }

                                    </div>


                                    <div
                                        class="measurement-actions">

                                        <button
                                            class="edit-measurement-btn"
                                            data-id="${measurement.id}">
                                            ✏️ Edit Measurements
                                        </button>

                                        <button
                                            class="delete-measurement-btn"
                                            data-id="${measurement.id}">
                                            🗑️ Delete
                                        </button>

                                    </div>

                                </div>
                                `;

                            }
                        )
                        .join("")
                }
            </div>

        </div>


        <div class="details-block">

            <h3>
                📋 Previous Orders
            </h3>

            ${
                customerOrders.length === 0
                ?
                `<p>No orders yet.</p>`
                :
                customerOrders
                    .map(
                        function (order) {

                            return `
                            <div
                                class="customer-order-card">

                                <div>

                                    <h4>
                                        ${order.garment}
                                    </h4>

                                    <p>
                                        Quantity:
                                        ${order.quantity}
                                    </p>

                                    <p>
                                        Delivery:
                                        ${formatDate(
                                            order.deliveryDate
                                        )}
                                    </p>

                                    <p>
                                        Total:
                                        ₹${order.total}
                                    </p>

                                    <p>
                                        Advance:
                                        ₹${order.advance}
                                    </p>

                                    <p>
                                        Remaining:
                                        ₹${order.remaining}
                                    </p>

                                    <span
                                        class="detail-status">

                                        ${order.status}

                                    </span>

                                </div>


                                <button
                                    class="delete-order-btn"
                                    data-id="${order.id}">
                                    🗑️ Delete
                                </button>

                            </div>
                            `;

                        }
                    )
                    .join("")
            }

        </div>
        `;


    openPage("customerDetailsPage");

}


// ======================================================
// FORMAT MEASUREMENT NAME
// ======================================================

function formatMeasurementName(name) {

    return name
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, function (letter) {
            return letter.toUpperCase();
        });

}


// ======================================================
// DELETE MEASUREMENT
// ======================================================

document.addEventListener(
    "click",
    function (event) {

        const button =
            event.target.closest(
                ".delete-measurement-btn"
            );


        if (!button) {
            return;
        }


        const measurementId =
            button.dataset.id;


        const confirmed =
            confirm(
                "Delete this measurement?"
            );


        if (!confirmed) {
            return;
        }


        const measurement =
            measurements.find(
                function (item) {

                    return item.id ==
                        measurementId;

                }
            );


        if (!measurement) {
            return;
        }


        const customerId =
            measurement.customerId;


        measurements =
            measurements.filter(
                function (item) {

                    return item.id !=
                        measurementId;

                }
            );


        saveData();


        showCustomerDetails(
            customerId
        );

    }
);


// ======================================================
// EDIT MEASUREMENT
// ======================================================

document.addEventListener(
    "click",
    function (event) {

        const button =
            event.target.closest(
                ".edit-measurement-btn"
            );


        if (!button) {
            return;
        }


        editMeasurement(
            button.dataset.id
        );

    }
);


// ======================================================
// EDIT MEASUREMENT FUNCTION
// ======================================================

function editMeasurement(
    measurementId
) {

    const measurement =
        measurements.find(
            function (item) {

                return item.id ==
                    measurementId;

            }
        );


    if (!measurement) {
        return;
    }


    updateCustomerDropdowns();


    measurementCustomer.value =
        measurement.customerId;


    garmentType.value =
        measurement.garment;


    createMeasurementFields(
        measurement.garment
    );


    Object.keys(measurement)
        .forEach(
            function (key) {

                if (
                    key === "id"
                    ||
                    key === "customerId"
                    ||
                    key === "garment"
                ) {
                    return;
                }


                const field =
                    document.getElementById(
                        key
                    );


                if (field) {

                    field.value =
                        measurement[key];

                }

            }
        );


    measurementForm.dataset.editingId =
        measurementId;


    const submitButton =
        measurementForm.querySelector(
            "button[type='submit']"
        );


    if (submitButton) {

        submitButton.textContent =
            "Update Measurements";

    }


    openPage("measurementsPage");

}


// ======================================================
// MEASUREMENT FORM
// ======================================================

if (measurementForm) {

    measurementForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const customerId =
                measurementCustomer.value;


            const garment =
                garmentType.value;


            if (!customerId || !garment) {

                alert(
                    "Please select customer and garment."
                );

                return;

            }


            const data = {

                id:
                    measurementForm.dataset.editingId
                    ||
                    Date.now().toString(),

                customerId:
                    customerId,

                garment:
                    garment

            };


            const inputs =
                measurementFields
                    ?.querySelectorAll(
                        "input"
                    )
                    ||
                    [];


            inputs.forEach(
                function (input) {

                    data[input.id] =
                        input.value;

                }
            );


            const editingId =
                measurementForm.dataset.editingId;


            if (editingId) {

                const index =
                    measurements.findIndex(
                        function (item) {

                            return item.id ==
                                editingId;

                        }
                    );


                if (index !== -1) {

                    measurements[index] =
                        data;

                }


                delete measurementForm.dataset.editingId;

            }

            else {

                measurements.push(data);

            }


            saveData();


            measurementForm.reset();


            if (measurementFields) {

                measurementFields.innerHTML = "";

            }


            const submitButton =
                measurementForm.querySelector(
                    "button[type='submit']"
                );


            if (submitButton) {

                submitButton.textContent =
                    "Save Measurements";

            }


            openPage("measurementsPage");

        }
    );

}


// ======================================================
// UPDATE CUSTOMER DROPDOWNS
// ======================================================

function updateCustomerDropdowns() {

    if (measurementCustomer) {

        measurementCustomer.innerHTML =
            `
            <option value="">
                Select Customer
            </option>
            `;


        customers.forEach(
            function (customer) {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    customer.id;


                option.textContent =
                    customer.name;


                measurementCustomer
                    .appendChild(option);

            }
        );

    }


    if (orderCustomer) {

        orderCustomer.innerHTML =
            `
            <option value="">
                Select Customer
            </option>
            `;


        customers.forEach(
            function (customer) {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    customer.id;


                option.textContent =
                    customer.name;


                orderCustomer
                    .appendChild(option);

            }
        );

    }

}


// ======================================================
// GARMENT TYPE CHANGE
// ======================================================

if (garmentType) {

    garmentType.addEventListener(
        "change",
        function () {

            createMeasurementFields(
                garmentType.value
            );

        }
    );

}


// ======================================================
// CREATE MEASUREMENT FIELDS
// ======================================================

function createMeasurementFields(
    garment
) {

    if (!measurementFields) {
        return;
    }


    measurementFields.innerHTML = "";


    let fields = [];


    if (garment === "Shirt") {

        fields = [
            "chest",
            "shoulder",
            "sleeve",
            "length",
            "waist",
            "neck"

        ];

    }

    else if (garment === "Pant") {

        fields = [
            "waist",
            "hip",
            "length",
            "thigh",
            "bottom"

        ];

    }

    else if (garment === "Kurta") {

        fields = [
            "chest",
            "shoulder",
            "sleeve",
            "length",
            "waist"

        ];

    }

    else if (garment === "Blouse") {

        fields = [
            "bust",
            "waist",
            "shoulder",
            "sleeve",
            "length"

        ];

    }

    else if (garment === "Kurti") {

        fields = [
            "bust",
            "waist",
            "shoulder",
            "sleeve",
            "length"

        ];

    }

    else if (garment === "Dress") {

        fields = [
            "bust",
            "waist",
            "hip",
            "shoulder",
            "length",
            "sleeve"

        ];

    }

    else if (garment === "Other") {

        fields = [
            "chest",
            "waist",
            "hip",
            "shoulder",
            "sleeve",
            "length"

        ];

    }


    fields.forEach(
        function (fieldName) {

            const label =
                document.createElement(
                    "label"
                );


            label.textContent =
                formatMeasurementName(
                    fieldName
                );


            const input =
                document.createElement(
                    "input"
                );


            input.type = "text";


            input.id =
                fieldName;


            input.placeholder =
                "Enter " +
                formatMeasurementName(
                    fieldName
                );


            measurementFields
                .appendChild(label);


            measurementFields
                .appendChild(input);

        }
    );

}

// ORDER FORM
if (orderForm) {
    orderForm.addEventListener(
        "submit",
        function (event) {
            event.preventDefault();

            const customerId =
                orderCustomer.value;

            const garment =
                document.getElementById(
                    "orderGarment"
                )?.value || "";

            const quantity =
                Number(
                    document.getElementById(
                        "quantity"
                    ).value
                );

            const total =
                Number(
                    document.getElementById(
                        "totalAmount"
                    ).value
                );

            const advance =
                Number(
                    document.getElementById(
                        "advance"
                    ).value
                );

            const deliveryDate =
                document.getElementById(
                    "deliveryDate"
                ).value;

            const status =
                document.getElementById(
                    "orderStatus"
                ).value;

            // Check required values
            if (
                !customerId ||
                !garment ||
                !quantity ||
                !deliveryDate
            ) {
                alert(
                    "Please fill in all required fields."
                );
                return;
            }

            // Check payment
            if (advance > total) {
                alert(
                    "Advance cannot be greater than total amount."
                );
                return;
            }

            const remaining =
                total - advance;

            const newOrder = {
                id:
                    Date.now().toString(),

                customerId:
                    customerId,

                garment:
                    garment,

                quantity:
                    quantity,

                total:
                    total,

                advance:
                    advance,

                remaining:
                    remaining,

                deliveryDate:
                    deliveryDate,

                status:
                    status
            };

            // Save order
            orders.push(newOrder);

            saveData();

            // Clear form
            orderForm.reset();

            // Refresh everything
            displayOrders();
            updateDashboard();
            updateDueSoon();

            // Go to Orders page
            openPage("ordersPage");
        }
    );
}

// ======================================================
// DISPLAY ORDERS
// ======================================================

function displayOrders() {

    const orderList =
        document.getElementById(
            "orderList"
        );


    if (!orderList) {
        return;
    }


    orderList.innerHTML = "";


    if (orders.length === 0) {

        orderList.innerHTML =
            `
            <p class="empty-message">
                No orders yet.
            </p>
            `;

        return;

    }


    orders.forEach(
        function (order) {

            const customer =
                customers.find(
                    function (item) {

                        return item.id ==
                            order.customerId;

                    }
                );


            const customerName =
                customer
                ?
                customer.name
                :
                "Unknown Customer";


            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "order-card";


            card.innerHTML =
                `
                <div class="order-header">

                    <h3>
                        ${customerName}
                    </h3>

                    <span class="order-id">
                        Order #${order.id}
                    </span>

                </div>


                <p>
                    👕 Garment:
                    ${order.garment}
                </p>

                <p>
                    🔢 Quantity:
                    ${order.quantity}
                </p>

                <p>
                    💰 Total:
                    ₹${order.total}
                </p>

                <p>
                    💵 Advance:
                    ₹${order.advance}
                </p>

                <p>
                    💳 Remaining:
                    ₹${order.remaining}
                </p>

                <p>
                    📅 Delivery:
                    ${formatDate(
                        order.deliveryDate
                    )}
                </p>


                <label>
                    Status
                </label>

                <select
                    class="status-select"
                    data-id="${order.id}">

                    <option
                        value="Received"
                        ${
                            order.status ===
                            "Received"
                            ?
                            "selected"
                            :
                            ""
                        }>
                        Received
                    </option>

                    <option
                        value="Cutting"
                        ${
                            order.status ===
                            "Cutting"
                            ?
                            "selected"
                            :
                            ""
                        }>
                        Cutting
                    </option>

                    <option
                        value="Stitching"
                        ${
                            order.status ===
                            "Stitching"
                            ?
                            "selected"
                            :
                            ""
                        }>
                        Stitching
                    </option>

                    <option
                        value="Ready"
                        ${
                            order.status ===
                            "Ready"
                            ?
                            "selected"
                            :
                            ""
                        }>
                        Ready
                    </option>

                    <option
                        value="Delivered"
                        ${
                            order.status ===
                            "Delivered"
                            ?
                            "selected"
                            :
                            ""
                        }>
                        Delivered
                    </option>

                </select>

                <br>

                <button
                    class="delete-order-btn"
                    data-id="${order.id}">
                    🗑️ Delete Order
                </button>
                `;


            orderList.appendChild(card);

        }
    );


    updateDueSoon();

}


// ======================================================
// CHANGE ORDER STATUS
// ======================================================

document.addEventListener(
    "change",
    function (event) {

        const statusSelect =
            event.target.closest(
                ".status-select"
            );


        if (!statusSelect) {
            return;
        }


        const orderId =
            statusSelect.dataset.id;


        const order =
            orders.find(
                function (item) {

                    return item.id ==
                        orderId;

                }
            );


        if (!order) {
            return;
        }


        order.status =
            statusSelect.value;


        saveData();


        updateDashboard();

        displayOrders();

        updateDueSoon();

    }
);


// ======================================================
// DELETE ORDER
// ======================================================

document.addEventListener(
    "click",
    function (event) {

        const button =
            event.target.closest(
                ".delete-order-btn"
            );


        if (!button) {
            return;
        }


        const orderId =
            button.dataset.id;


        const confirmed =
            confirm(
                "Delete this order?"
            );


        if (!confirmed) {
            return;
        }


        const order =
            orders.find(
                function (item) {

                    return item.id ==
                        orderId;

                }
            );


        if (!order) {
            return;
        }


        const customerId =
            order.customerId;


        orders =
            orders.filter(
                function (item) {

                    return item.id !=
                        orderId;

                }
            );


        saveData();


        displayOrders();

        updateDashboard();

        updateDueSoon();


        const customerDetailsPage =
            document.getElementById(
                "customerDetailsPage"
            );


        if (
            customerDetailsPage &&
            customerDetailsPage.classList.contains(
                "active-page"
            )
        ) {

            showCustomerDetails(
                customerId
            );

        }

    }
);


// ======================================================
// DASHBOARD
// ======================================================

function updateDashboard() {

    const customerCount =
        document.getElementById(
            "customerCount"
        );


    const orderCount =
        document.getElementById(
            "orderCount"
        );


    const readyCount =
        document.getElementById(
            "readyCount"
        );


    const dueCount =
        document.getElementById(
            "dueCount"
        );


    if (customerCount) {

        customerCount.textContent =
            customers.length;

    }


    if (orderCount) {

        orderCount.textContent =
            orders.length;

    }


    if (readyCount) {

        readyCount.textContent =
            orders.filter(
                function (order) {

                    return order.status ===
                        "Ready";

                }
            ).length;

    }


    const dueSoonOrders =
        getDueSoonOrders();


    if (dueCount) {

        dueCount.textContent =
            dueSoonOrders.length;

    }

}


// ======================================================
// DUE SOON
// ======================================================

function getDueSoonOrders() {

    const today =
        new Date();


    today.setHours(
        0,
        0,
        0,
        0
    );


    const threeDaysLater =
        new Date(today);


    threeDaysLater.setDate(
        today.getDate() + 3
    );


    return orders.filter(
        function (order) {

            if (
                order.status ===
                "Delivered"
            ) {

                return false;

            }


            if (!order.deliveryDate) {

                return false;

            }


            const delivery =
                new Date(
                    order.deliveryDate
                );


            delivery.setHours(
                0,
                0,
                0,
                0
            );


            return (
                delivery >= today
                &&
                delivery <=
                    threeDaysLater
            );

        }
    );

}


// ======================================================
// UPDATE DUE SOON
// ======================================================

function updateDueSoon() {

    const list =
        document.getElementById(
            "dueSoonList"
        );


    if (!list) {
        return;
    }


    list.innerHTML = "";


    const dueOrders =
        getDueSoonOrders();


    if (dueOrders.length === 0) {

        list.innerHTML =
            `
            <p class="empty-message">
                No orders due soon.
            </p>
            `;

        return;

    }


    dueOrders.forEach(
        function (order) {

            const customer =
                customers.find(
                    function (item) {

                        return item.id ==
                            order.customerId;

                    }
                );


            const customerName =
                customer
                ?
                customer.name
                :
                "Unknown Customer";


            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "due-card";


            card.innerHTML =
                `
                <div>

                    <h3>
                        ${customerName}
                    </h3>

                    <p>
                        👕 ${order.garment}
                    </p>

                    <p>
                        🔢 Quantity:
                        ${order.quantity}
                    </p>

                    <p>
                        📅
                        ${formatDate(
                            order.deliveryDate
                        )}
                    </p>

                </div>

                <strong>
                    ${getDueText(
                        order.deliveryDate
                    )}
                </strong>
                `;


            list.appendChild(card);

        }
    );

}


// ======================================================
// DUE TEXT
// ======================================================

function getDueText(dateString) {

    const today =
        new Date();


    today.setHours(
        0,
        0,
        0,
        0
    );


    const delivery =
        new Date(dateString);


    delivery.setHours(
        0,
        0,
        0,
        0
    );


    const difference =
        Math.round(
            (
                delivery - today
            )
            /
            (
                1000 *
                60 *
                60 *
                24
            )
        );


    if (difference === 0) {

        return "Due Today";

    }


    if (difference === 1) {

        return "Due Tomorrow";

    }


    return `Due in ${difference} days`;

}


// ======================================================
// DATE FORMAT
// ======================================================

function formatDate(dateString) {

    if (!dateString) {
        return "-";
    }


    const date =
        new Date(dateString);


    if (isNaN(date.getTime())) {
        return dateString;
    }


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        }
    );

}


// ======================================================
// SAVE DATA
// ======================================================

function saveData() {

    localStorage.setItem(
        "customers",
        JSON.stringify(customers)
    );


    localStorage.setItem(
        "measurements",
        JSON.stringify(measurements)
    );


    localStorage.setItem(
        "orders",
        JSON.stringify(orders)
    );

}


// ======================================================
// MAKE SURE BACK ARROWS EXIST
// ======================================================

setTimeout(
    function () {

        addBackArrows();

    },
    100
);