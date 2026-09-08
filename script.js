// ==========================================
// STITCHFLOW
// ==========================================


// ==========================================
// DATA
// ==========================================

let customers =
    JSON.parse(localStorage.getItem("customers")) || [];

let measurements =
    JSON.parse(localStorage.getItem("measurements")) || [];

let orders =
    JSON.parse(localStorage.getItem("orders")) || [];


// ==========================================
// ELEMENTS
// ==========================================

const newCustomerBtn =
    document.getElementById("newCustomerBtn");

const newOrderBtn =
    document.getElementById("newOrderBtn");

const customerFormSection =
    document.getElementById("customerFormSection");

const orderFormSection =
    document.getElementById("orderFormSection");

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


// ==========================================
// INITIAL LOAD
// ==========================================

displayCustomers();
displayOrders();
updateCustomerDropdowns();
updateDashboard();


// ==========================================
// NEW CUSTOMER
// ==========================================

newCustomerBtn.addEventListener(
    "click",
    function () {

        customerForm.reset();

        document.getElementById(
            "editingCustomerId"
        ).value = "";

        document.getElementById(
            "customerFormTitle"
        ).textContent =
            "New Customer";

        document.getElementById(
            "customerSaveBtn"
        ).textContent =
            "Save Customer";


        if (
            customerFormSection.style.display ===
            "none"
        ) {

            customerFormSection.style.display =
                "block";

        } else {

            customerFormSection.style.display =
                "none";

        }

    }
);


// ==========================================
// NEW ORDER
// ==========================================

newOrderBtn.addEventListener(
    "click",
    function () {

        if (
            orderFormSection.style.display ===
            "none"
        ) {

            orderFormSection.style.display =
                "block";

        } else {

            orderFormSection.style.display =
                "none";

        }

    }
);


// ==========================================
// SAVE / UPDATE CUSTOMER
// ==========================================

customerForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const name =
            document
                .getElementById("customerName")
                .value
                .trim();


        const phone =
            document
                .getElementById("phone")
                .value
                .trim();


        const gender =
            document
                .getElementById("gender")
                .value;


        const editingId =
            document.getElementById(
                "editingCustomerId"
            ).value;


        // EDIT CUSTOMER

        if (editingId) {

            const customer =
                customers.find(
                    function (customer) {

                        return (
                            Number(customer.id) ===
                            Number(editingId)
                        );

                    }
                );


            if (customer) {

                customer.name = name;

                customer.phone = phone;

                customer.gender = gender;

                saveData();

                customerForm.reset();

                document.getElementById(
                    "editingCustomerId"
                ).value = "";


                document.getElementById(
                    "customerFormTitle"
                ).textContent =
                    "New Customer";


                document.getElementById(
                    "customerSaveBtn"
                ).textContent =
                    "Save Customer";


                customerFormSection.style.display =
                    "none";


                displayCustomers();

                updateCustomerDropdowns();

                updateDashboard();


                alert(
                    "Customer updated successfully!"
                );

            }

            return;

        }


        // NEW CUSTOMER

        const customer = {

            id: Date.now(),

            name: name,

            phone: phone,

            gender: gender

        };


        customers.push(customer);

        saveData();


        customerForm.reset();

        customerFormSection.style.display =
            "none";


        displayCustomers();

        updateCustomerDropdowns();

        updateDashboard();


        alert(
            "Customer saved successfully!"
        );

    }
);


// ==========================================
// DISPLAY CUSTOMERS
// ==========================================

function displayCustomers(
    customerData = customers
) {

    customerList.innerHTML = "";


    if (customerData.length === 0) {

        customerList.innerHTML =
            `<p class="empty-message">
                No customers found.
            </p>`;

        return;

    }


    customerData.forEach(
        function (customer) {

            const customerCard =
                document.createElement("div");


            customerCard.className =
                "customer-card";


            customerCard.innerHTML = `

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


                <div class="customer-buttons">

                    <button
                        class="edit-customer-btn"
                        data-id="${customer.id}">

                        ✏️ Edit

                    </button>


                    <button
                        class="view-details-btn"
                        data-id="${customer.id}">

                        👁️ View Details

                    </button>


                    <button
                        class="delete-customer-btn"
                        data-id="${customer.id}">

                        🗑️ Delete

                    </button>

                </div>

            `;


            customerList.appendChild(
                customerCard
            );

        }
    );

}


// ==========================================
// SEARCH CUSTOMERS
// ==========================================

customerSearch.addEventListener(
    "input",
    function () {

        const searchText =
            customerSearch.value
                .toLowerCase()
                .trim();


        const filteredCustomers =
            customers.filter(
                function (customer) {

                    return (

                        customer.name
                            .toLowerCase()
                            .includes(searchText)

                        ||

                        customer.phone
                            .includes(searchText)

                    );

                }
            );


        displayCustomers(
            filteredCustomers
        );

    }
);


// ==========================================
// CUSTOMER BUTTONS
// ==========================================

document.addEventListener(
    "click",
    function (event) {

        const customerId =
            Number(
                event.target.dataset.id
            );


        // EDIT

        if (
            event.target.classList.contains(
                "edit-customer-btn"
            )
        ) {

            editCustomer(
                customerId
            );

        }


        // VIEW DETAILS

        if (
            event.target.classList.contains(
                "view-details-btn"
            )
        ) {

            showCustomerDetails(
                customerId
            );

        }


        // DELETE

        if (
            event.target.classList.contains(
                "delete-customer-btn"
            )
        ) {

            deleteCustomer(
                customerId
            );

        }

    }
);


// ==========================================
// EDIT CUSTOMER
// ==========================================

function editCustomer(
    customerId
) {

    const customer =
        customers.find(
            function (customer) {

                return (
                    Number(customer.id) ===
                    customerId
                );

            }
        );


    if (!customer) {

        return;

    }


    document.getElementById(
        "customerName"
    ).value =
        customer.name;


    document.getElementById(
        "phone"
    ).value =
        customer.phone;


    document.getElementById(
        "gender"
    ).value =
        customer.gender;


    document.getElementById(
        "editingCustomerId"
    ).value =
        customer.id;


    document.getElementById(
        "customerFormTitle"
    ).textContent =
        "Edit Customer";


    document.getElementById(
        "customerSaveBtn"
    ).textContent =
        "Update Customer";


    customerFormSection.style.display =
        "block";


    customerFormSection.scrollIntoView({
        behavior: "smooth"
    });

}


// ==========================================
// DELETE CUSTOMER
// ==========================================

function deleteCustomer(
    customerId
) {

    const customer =
        customers.find(
            function (customer) {

                return (
                    Number(customer.id) ===
                    customerId
                );

            }
        );


    if (!customer) {

        return;

    }


    const confirmed =
        confirm(
            `Are you sure you want to delete ${customer.name}?\n\nThis will also delete all their measurements and orders.`
        );


    if (!confirmed) {

        return;

    }


    customers =
        customers.filter(
            function (customer) {

                return (
                    Number(customer.id) !==
                    customerId
                );

            }
        );


    measurements =
        measurements.filter(
            function (measurement) {

                return (
                    Number(
                        measurement.customerId
                    ) !== customerId
                );

            }
        );


    orders =
        orders.filter(
            function (order) {

                return (
                    Number(
                        order.customerId
                    ) !== customerId
                );

            }
        );


    saveData();


    displayCustomers();

    displayOrders();

    updateCustomerDropdowns();

    updateDashboard();


    document.getElementById(
        "customerDetailsSection"
    ).style.display =
        "none";


    alert(
        "Customer deleted successfully!"
    );

}


// ==========================================
// VIEW CUSTOMER DETAILS
// ==========================================

function showCustomerDetails(
    customerId
) {

    const customer =
        customers.find(
            function (customer) {

                return (
                    Number(customer.id) ===
                    customerId
                );

            }
        );


    if (!customer) {

        return;

    }


    const customerMeasurements =
        measurements.filter(
            function (measurement) {

                return (
                    Number(
                        measurement.customerId
                    ) === customerId
                );

            }
        );


    const customerOrders =
        orders.filter(
            function (order) {

                return (
                    Number(
                        order.customerId
                    ) === customerId
                );

            }
        );


    const pendingOrders =
        customerOrders.filter(
            function (order) {

                return (
                    order.status !==
                    "Delivered"
                );

            }
        );


    const pendingAmount =
        pendingOrders.reduce(
            function (total, order) {

                return (
                    total +
                    Number(order.remaining)
                );

            },
            0
        );


    let upcomingDelivery =
        "No upcoming delivery";


    if (pendingOrders.length > 0) {

        pendingOrders.sort(
            function (a, b) {

                return (
                    new Date(a.deliveryDate) -
                    new Date(b.deliveryDate)
                );

            }
        );


        upcomingDelivery =
            formatDate(
                pendingOrders[0].deliveryDate
            );

    }


    const detailsSection =
        document.getElementById(
            "customerDetailsSection"
        );


    const detailsContent =
        document.getElementById(
            "customerDetailsContent"
        );


    detailsContent.innerHTML = `

        <div class="profile-header">

            <div>

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

        </div>


        <div class="customer-summary">

            <div class="detail-summary-card">

                <span>📋</span>

                <div>

                    <small>Total Orders</small>

                    <strong>
                        ${customerOrders.length}
                    </strong>

                </div>

            </div>


            <div class="detail-summary-card">

                <span>💰</span>

                <div>

                    <small>Pending Payment</small>

                    <strong>
                        ₹${pendingAmount}
                    </strong>

                </div>

            </div>


            <div class="detail-summary-card">

                <span>📅</span>

                <div>

                    <small>Upcoming Delivery</small>

                    <strong>
                        ${upcomingDelivery}
                    </strong>

                </div>

            </div>

        </div>


        <div class="details-block">

            <h3>📏 Measurements</h3>

            ${
                customerMeasurements.length === 0

                ?

                `<p class="empty-message">
                    No measurements saved.
                </p>`

                :

                customerMeasurements
                    .map(
                        function (measurement) {

                            return `

                                <div class="measurement-card">

                                    <h4>
                                        ${measurement.garment}
                                    </h4>

                                    <div class="measurement-grid">

                                        ${
                                            Object.entries(
                                                measurement.measurements
                                            )
                                            .map(
                                                function (
                                                    entry
                                                ) {

                                                    return `

                                                        <div>

                                                            <span>
                                                                ${entry[0]}
                                                            </span>

                                                            <strong>
                                                                ${entry[1]}
                                                            </strong>

                                                        </div>

                                                    `;

                                                }
                                            )
                                            .join("")
                                        }

                                    </div>


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

                            `;

                        }
                    )
                    .join("")

            }

        </div>


        <div class="details-block">

            <h3>📋 Previous Orders</h3>

            ${
                customerOrders.length === 0

                ?

                `<p class="empty-message">
                    No orders found.
                </p>`

                :

                customerOrders
                    .map(
                        function (order) {

                            return `

                                <div class="customer-order-card">

                                    <div>

                                        <h4>
                                            ${order.garment}
                                        </h4>

                                        <p>
                                            📦 Quantity:
                                            ${order.quantity}
                                        </p>

                                        <p>
                                            📅 Delivery:
                                            ${formatDate(
                                                order.deliveryDate
                                            )}
                                        </p>

                                    </div>


                                    <div>

                                        <p>
                                            💰 Total:
                                            ₹${order.totalAmount}
                                        </p>

                                        <p>
                                            💵 Advance:
                                            ₹${order.advance}
                                        </p>

                                        <p>
                                            💳 Remaining:
                                            ₹${order.remaining}
                                        </p>

                                        <span class="detail-status">
                                            ${order.status}
                                        </span>

                                        <br><br>

                                        <button
                                            class="delete-order-btn"
                                            data-id="${order.id}">

                                            🗑️ Delete Order

                                        </button>

                                    </div>

                                </div>

                            `;

                        }
                    )
                    .join("")

            }

        </div>


        <button
            id="closeCustomerDetails"
            class="secondary-btn">

            ✖ Close Details

        </button>

    `;


    detailsSection.style.display =
        "block";


    detailsSection.scrollIntoView({
        behavior: "smooth"
    });


    document
        .getElementById(
            "closeCustomerDetails"
        )
        .addEventListener(
            "click",
            function () {

                detailsSection.style.display =
                    "none";

            }
        );

}


// ==========================================
// DELETE MEASUREMENT
// ==========================================

document.addEventListener(
    "click",
    function (event) {

        if (
            event.target.classList.contains(
                "delete-measurement-btn"
            )
        ) {

            const measurementId =
                Number(
                    event.target.dataset.id
                );


            const confirmed =
                confirm(
                    "Are you sure you want to delete this measurement?"
                );


            if (!confirmed) {

                return;

            }


            measurements =
                measurements.filter(
                    function (measurement) {

                        return (
                            Number(
                                measurement.id
                            ) !== measurementId
                        );

                    }
                );


            saveData();


            alert(
                "Measurement deleted successfully!"
            );


            const customerId =
                Number(
                    measurementCustomer.value
                );


            if (customerId) {

                showCustomerDetails(
                    customerId
                );

            }

        }

    }
);


// ==========================================
// DELETE ORDER
// ==========================================

document.addEventListener(
    "click",
    function (event) {

        if (
            event.target.classList.contains(
                "delete-order-btn"
            )
        ) {

            const orderId =
                Number(
                    event.target.dataset.id
                );


            const order =
                orders.find(
                    function (order) {

                        return (
                            Number(order.id) ===
                            orderId
                        );

                    }
                );


            if (!order) {

                return;

            }


            const confirmed =
                confirm(
                    "Are you sure you want to delete this order?"
                );


            if (!confirmed) {

                return;

            }


            const customerId =
                Number(order.customerId);


            orders =
                orders.filter(
                    function (order) {

                        return (
                            Number(order.id) !==
                            orderId
                        );

                    }
                );


            saveData();


            displayOrders();

            updateDashboard();


            alert(
                "Order deleted successfully!"
            );


            showCustomerDetails(
                customerId
            );

        }

    }
);


// ==========================================
// EDIT MEASUREMENT BUTTON
// ==========================================

document.addEventListener(
    "click",
    function (event) {

        if (
            event.target.classList.contains(
                "edit-measurement-btn"
            )
        ) {

            const measurementId =
                Number(
                    event.target.dataset.id
                );


            editMeasurement(
                measurementId
            );

        }

    }
);


// ==========================================
// EDIT MEASUREMENT
// ==========================================

function editMeasurement(
    measurementId
) {

    const measurement =
        measurements.find(
            function (item) {

                return (
                    Number(item.id) ===
                    measurementId
                );

            }
        );


    if (!measurement) {

        return;

    }


    measurementCustomer.value =
        measurement.customerId;


    garmentType.value =
        measurement.garment;


    garmentType.dispatchEvent(
        new Event("change")
    );


    setTimeout(
        function () {

            const inputs =
                measurementFields.querySelectorAll(
                    "input"
                );


            inputs.forEach(
                function (input) {

                    const field =
                        input.dataset.measurement;


                    if (
                        measurement.measurements[
                            field
                        ] !== undefined
                    ) {

                        input.value =
                            measurement.measurements[
                                field
                            ];

                    }

                }
            );


            measurementForm.dataset.editingId =
                measurement.id;


            measurementForm.scrollIntoView({
                behavior: "smooth"
            });

        },
        50
    );

}


// ==========================================
// SAVE / UPDATE MEASUREMENTS
// ==========================================

measurementForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const customerId =
            measurementCustomer.value;


        const garment =
            garmentType.value;


        const inputs =
            measurementFields.querySelectorAll(
                "input"
            );


        const measurementData = {};


        inputs.forEach(
            function (input) {

                measurementData[
                    input.dataset.measurement
                ] = input.value;

            }
        );


        const editingId =
            measurementForm.dataset.editingId;


        // UPDATE

        if (editingId) {

            const measurement =
                measurements.find(
                    function (item) {

                        return (
                            Number(item.id) ===
                            Number(editingId)
                        );

                    }
                );


            if (measurement) {

                measurement.customerId =
                    customerId;

                measurement.garment =
                    garment;

                measurement.measurements =
                    measurementData;

                saveData();


                delete measurementForm.dataset.editingId;


                measurementForm.reset();


                measurementFields.innerHTML =
                    `<p class="empty-message">
                        Select a garment
                        to enter measurements.
                    </p>`;


                alert(
                    "Measurements updated successfully!"
                );


                showCustomerDetails(
                    Number(customerId)
                );


                return;

            }

        }


        // NEW

        measurements.push({

            id: Date.now(),

            customerId: customerId,

            garment: garment,

            measurements: measurementData

        });


        saveData();


        measurementForm.reset();


        measurementFields.innerHTML =
            `<p class="empty-message">
                Select a garment
                to enter measurements.
            </p>`;


        alert(
            "Measurements saved successfully!"
        );

    }
);


// ==========================================
// UPDATE CUSTOMER DROPDOWNS
// ==========================================

function updateCustomerDropdowns() {

    measurementCustomer.innerHTML =
        `<option value="">
            Select Customer
        </option>`;


    orderCustomer.innerHTML =
        `<option value="">
            Select Customer
        </option>`;


    customers.forEach(
        function (customer) {

            const measurementOption =
                document.createElement("option");


            measurementOption.value =
                customer.id;

            measurementOption.textContent =
                customer.name;


            measurementCustomer.appendChild(
                measurementOption
            );


            const orderOption =
                document.createElement("option");


            orderOption.value =
                customer.id;

            orderOption.textContent =
                customer.name;


            orderCustomer.appendChild(
                orderOption
            );

        }
    );

}


// ==========================================
// MEASUREMENT FIELDS
// ==========================================

garmentType.addEventListener(
    "change",
    function () {

        const garment =
            garmentType.value;


        measurementFields.innerHTML = "";


        let fields = [];


        if (garment === "Shirt") {

            fields = [
                "Chest",
                "Shoulder",
                "Sleeve Length",
                "Shirt Length",
                "Neck",
                "Waist"
            ];

        }

        else if (garment === "Pant") {

            fields = [
                "Waist",
                "Hip",
                "Thigh",
                "Knee",
                "Bottom",
                "Pant Length"
            ];

        }

        else if (garment === "Kurta") {

            fields = [
                "Chest",
                "Shoulder",
                "Sleeve Length",
                "Kurta Length",
                "Neck"
            ];

        }

        else if (garment === "Blouse") {

            fields = [
                "Bust",
                "Shoulder",
                "Sleeve Length",
                "Blouse Length",
                "Waist"
            ];

        }

        else if (garment === "Kurti") {

            fields = [
                "Bust",
                "Shoulder",
                "Sleeve Length",
                "Kurti Length",
                "Waist"
            ];

        }

        else if (garment === "Dress") {

            fields = [
                "Bust",
                "Shoulder",
                "Waist",
                "Hip",
                "Sleeve Length",
                "Dress Length"
            ];

        }

        else if (garment === "Other") {

            fields = [
                "Chest / Bust",
                "Shoulder",
                "Waist",
                "Hip",
                "Length"
            ];

        }


        fields.forEach(
            function (field) {

                const label =
                    document.createElement(
                        "label"
                    );


                label.textContent =
                    field;


                const input =
                    document.createElement(
                        "input"
                    );


                input.type = "number";

                input.step = "0.1";

                input.placeholder =
                    "Enter " + field;


                input.dataset.measurement =
                    field;


                measurementFields.appendChild(
                    label
                );


                measurementFields.appendChild(
                    input
                );

            }
        );

    }
);


// ==========================================
// SAVE ORDER
// ==========================================

orderForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const customerId =
            orderCustomer.value;


        const garment =
            document
                .getElementById("orderGarment")
                .value;


        const quantity =
            Number(
                document
                    .getElementById("quantity")
                    .value
            );


        const totalAmount =
            Number(
                document
                    .getElementById("totalAmount")
                    .value
            );


        const advance =
            Number(
                document
                    .getElementById("advance")
                    .value
            );


        const deliveryDate =
            document
                .getElementById("deliveryDate")
                .value;


        const status =
            document
                .getElementById("orderStatus")
                .value;


        if (advance > totalAmount) {

            alert(
                "Advance cannot be greater than total amount."
            );

            return;

        }


        const remaining =
            totalAmount - advance;


        orders.push({

            id: Date.now(),

            customerId: customerId,

            garment: garment,

            quantity: quantity,

            totalAmount: totalAmount,

            advance: advance,

            remaining: remaining,

            deliveryDate: deliveryDate,

            status: status

        });


        saveData();


        orderForm.reset();


        orderFormSection.style.display =
            "none";


        displayOrders();

        updateDashboard();


        alert(
            "Order saved successfully!"
        );

    }
);


// ==========================================
// DISPLAY ORDERS
// ==========================================

function displayOrders() {

    const orderList =
        document.getElementById(
            "orderList"
        );


    orderList.innerHTML = "";


    if (orders.length === 0) {

        orderList.innerHTML =
            `<p class="empty-message">
                No orders yet.
            </p>`;

        return;

    }


    orders.forEach(
        function (order) {

            const customer =
                customers.find(
                    function (customer) {

                        return (
                            Number(customer.id) ===
                            Number(order.customerId)
                        );

                    }
                );


            const customerName =
                customer
                    ? customer.name
                    : "Unknown Customer";


            const orderCard =
                document.createElement(
                    "div"
                );


            orderCard.className =
                "order-card";


            orderCard.innerHTML = `

                <div class="order-header">

                    <h3>
                        ${customerName}
                    </h3>

                    <span class="order-id">
                        #${order.id}
                    </span>

                </div>


                <p>
                    👕 Garment:
                    ${order.garment}
                </p>


                <p>
                    📦 Quantity:
                    ${order.quantity}
                </p>


                <p>
                    💰 Total:
                    ₹${order.totalAmount}
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
                    ${formatDate(order.deliveryDate)}
                </p>


                <p>

                    🔄 Status:

                    <select
                        class="status-select"
                        data-id="${order.id}"
                    >

                        <option value="Received"
                            ${
                                order.status === "Received"
                                ? "selected"
                                : ""
                            }>
                            Received
                        </option>


                        <option value="Cutting"
                            ${
                                order.status === "Cutting"
                                ? "selected"
                                : ""
                            }>
                            Cutting
                        </option>


                        <option value="Stitching"
                            ${
                                order.status === "Stitching"
                                ? "selected"
                                : ""
                            }>
                            Stitching
                        </option>


                        <option value="Ready"
                            ${
                                order.status === "Ready"
                                ? "selected"
                                : ""
                            }>
                            Ready
                        </option>


                        <option value="Delivered"
                            ${
                                order.status === "Delivered"
                                ? "selected"
                                : ""
                            }>
                            Delivered
                        </option>

                    </select>

                </p>

            `;


            orderList.appendChild(
                orderCard
            );

        }
    );

}


// ==========================================
// UPDATE ORDER STATUS
// ==========================================

document.addEventListener(
    "change",
    function (event) {

        if (
            event.target.classList.contains(
                "status-select"
            )
        ) {

            const orderId =
                Number(
                    event.target.dataset.id
                );


            const order =
                orders.find(
                    function (order) {

                        return (
                            Number(order.id) ===
                            orderId
                        );

                    }
                );


            if (order) {

                order.status =
                    event.target.value;


                saveData();


                displayOrders();

                updateDashboard();

            }

        }

    }
);


// ==========================================
// UPDATE DASHBOARD
// ==========================================

function updateDashboard() {

    document.getElementById(
        "customerCount"
    ).textContent =
        customers.length;


    document.getElementById(
        "orderCount"
    ).textContent =
        orders.length;


    const readyOrders =
        orders.filter(
            function (order) {

                return (
                    order.status ===
                    "Ready"
                );

            }
        );


    document.getElementById(
        "readyCount"
    ).textContent =
        readyOrders.length;


    updateDueSoon();

}


// ==========================================
// DUE SOON
// ==========================================

function updateDueSoon() {

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


    const dueOrders =
        orders.filter(
            function (order) {

                if (
                    order.status ===
                    "Delivered"
                ) {

                    return false;

                }


                const deliveryDate =
                    new Date(
                        order.deliveryDate
                    );


                deliveryDate.setHours(
                    0,
                    0,
                    0,
                    0
                );


                return (
                    deliveryDate >= today &&
                    deliveryDate <=
                    threeDaysLater
                );

            }
        );


    document.getElementById(
        "dueSoonCount"
    ).textContent =
        dueOrders.length;


    displayDueSoonOrders(
        dueOrders
    );

}


// ==========================================
// DISPLAY DUE SOON ORDERS
// ==========================================

function displayDueSoonOrders(
    dueOrders
) {

    dueSoonList.innerHTML = "";


    if (dueOrders.length === 0) {

        dueSoonList.innerHTML =
            `<p class="empty-message">
                🎉 No orders due soon.
            </p>`;

        return;

    }


    dueOrders.sort(
        function (a, b) {

            return (
                new Date(a.deliveryDate) -
                new Date(b.deliveryDate)
            );

        }
    );


    dueOrders.forEach(
        function (order) {

            const customer =
                customers.find(
                    function (customer) {

                        return (
                            Number(customer.id) ===
                            Number(order.customerId)
                        );

                    }
                );


            const customerName =
                customer
                    ? customer.name
                    : "Unknown Customer";


            const dueCard =
                document.createElement(
                    "div"
                );


            dueCard.className =
                "due-card";


            const today =
                new Date();


            today.setHours(
                0,
                0,
                0,
                0
            );


            const deliveryDate =
                new Date(
                    order.deliveryDate
                );


            deliveryDate.setHours(
                0,
                0,
                0,
                0
            );


            let dueText =
                "Due Soon";


            if (
                deliveryDate.getTime() ===
                today.getTime()
            ) {

                dueText =
                    "Due Today 🔥";

            }

            else {

                const difference =
                    Math.ceil(
                        (
                            deliveryDate -
                            today
                        ) /
                        (1000 * 60 * 60 * 24)
                    );


                if (difference === 1) {

                    dueText =
                        "Due Tomorrow";

                }

                else {

                    dueText =
                        `Due in ${difference} days`;

                }

            }


            dueCard.innerHTML = `

                <div>

                    <h3>
                        ${customerName}
                    </h3>

                    <p>
                        👕 ${order.garment}
                    </p>

                    <p>
                        📦 Quantity:
                        ${order.quantity}
                    </p>

                </div>


                <div class="due-date">

                    <strong>
                        ${dueText}
                    </strong>

                    <p>
                        📅
                        ${formatDate(
                            order.deliveryDate
                        )}
                    </p>

                </div>

            `;


            dueSoonList.appendChild(
                dueCard
            );

        }
    );

}


// ==========================================
// FORMAT DATE
// ==========================================

function formatDate(dateString) {

    if (!dateString) {

        return "Not set";

    }


    const date =
        new Date(dateString);


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


// ==========================================
// SAVE DATA
// ==========================================

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