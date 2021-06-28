class Shopping {
    constructor(item, quantity, price){
        this.item = item;
        this.quantity = quantity;
        this.price = price;
    }
}

class UI {
    addItemToList(shopping){
        const list = document.getElementById("shopping-list");

    // Create a tr element
    const row = document.createElement("tr");
    
    // Insert columns
    row.innerHTML = ` 
    <td>${shopping.item}</td>
    <td>${shopping.quantity}</td>
    <td>${shopping.price}</td>
    <td><a href="#" class="delete">X</a></td>
    `;

    list.appendChild(row);
    }
    showAlert(message, className){
        // Create div
    const div = document.createElement("div");
    // Add classes
    div.className = `alert ${className}`;
    // Add text
    div.appendChild(document.createTextNode(message));
    // Get a parent
    const container = document.querySelector(".container");
    // Get form
    const form = document.querySelector("#shopping-form");
    // Insert alert
    container.insertBefore(div, form);

    // Timeout after 3 seconds
    setTimeout(function(){
        document.querySelector(".alert").remove();
    }, 3000);
    }
    deleteItem(target){
        if(target.className === "delete"){
            target.parentElement.parentElement.remove();
        }
    }
    clearFields(){
        document.getElementById("item").value = "";
        document.getElementById("quantity").value = "";
        document.getElementById("price").value = "";
    }
}

// Local Storage Class
class Store {
   static getItems(){
    let items;
    if(localStorage.getItem('items') === null) {
         items = [];
    } else {
        items =JSON.parse(localStorage.getItem('items'));
    }
    return items;
    }
    static displayItems(){
        const items = Store.getItems();

        items.forEach(function(shopping){
            const ui = new UI;

            // Add item to UI
            ui.addItemToList(shopping);
        });
    }
    static addItem(shopping){
        const items = Store.getItems();

        items.push(shopping);

        localStorage.setItem('items', JSON.stringify(items));
    }
   static removeItem(price){
       console.log(price);
    const items = Store.getItems();

    items.forEach(function(shopping, index){
        if(shopping.price === price){
            items.splice(index, 1)
        }
    });

    localStorage.setItem('items', JSON.stringify(items));
    }
}

// DOM Load Event
document.addEventListener('DOMContentLoaded', Store.displayItems);

// Event Listeners
const submitBtn = document.getElementById("shopping-form");
submitBtn.addEventListener("submit" , function(e){
    // Get form values
    const item = document.getElementById("item").value,
          quantity = document.getElementById("quantity").value,
          price = document.getElementById("price").value;

    //   Instantiate shopping
    const shopping = new Shopping(item,quantity,price);      
    
    // Instantiate UI
    const ui = new UI();

    // Validate
    if(item === "" || quantity === "" || price === ""){
        // Show Error alert
        ui.showAlert("Please fill in all fields" , "error");
    } else {
         // Add item to list
    ui.addItemToList(shopping);

    // Add to local storage
    Store.addItem(shopping);

    // Show success
    ui.showAlert("Item Added!" , "success");

    // Clear fields after submitting
    ui.clearFields();
    }

   

    e.preventDefault();
});

// Event listener for delete
    const deleteBtn = document.getElementById("shopping-list");
    deleteBtn.addEventListener("click", function(e){

// Instantiate ui
    const ui = new UI();
// Delete item
    ui.deleteItem(e.target);

    // Remove from Local Storage
    Store.removeItem(e.target.parentElement.previousElementSibling.textContent);

    // Show delete message
    ui.showAlert("Item removed!", "success");

    e.preventDefault();
})