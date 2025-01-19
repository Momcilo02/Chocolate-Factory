<template>
<div v-if="user">
    <nav class = "navbar navbar-default" role = "navigation" style="background: gray;color:white;">
         <div class = "navbar-header">
            <a @click="goToFactiories" class = "navbar-brand" href = "#">Factories</a>
         </div>
         <div>
            <button v-if="!isLoggedIn" type = "button" class = "btn btn-default navbar-btn  navbar-left" @click="goToLogin">Login</button>
            <button v-if="!isLoggedIn" type = "button" class = "btn btn-default navbar-btn  navbar-left" @click="goToRegister">Register</button>
            <button v-if="isLoggedIn && isUSerCustomer" type = "button" class = "btn btn-default navbar-btn  navbar-left" @click="goToCart">Cart</button>
            <button v-if="isLoggedIn" type = "button" class = "btn btn-default navbar-btn  navbar-left" @click="goToProfile">Profile</button>
            <button v-if="isLoggedIn" type = "button" class = "btn btn-default navbar-btn  navbar-left" @click="logout">Logout</button>
            <button v-if="isUserAdmin" type = "button" class = "btn btn-default navbar-btn  navbar-left" @click="goToAddFactory">Add Factory</button>
         </div>
    </nav>
    <h2>Your Cart:</h2>
    <div class="row">
            <div v-for="chocolate in user.cart.chocolates" :key="chocolate.id" class="col-md-3 col-sm-6">
                <div class="card card-block">
                    <img class="card-logo" src="https://static.pexels.com/photos/7096/people-woman-coffee-meeting.jpg" :alt="chocolate.name">
                    <h5 class="card-title mt-3 mb-3">{{ chocolate.name }}</h5>
                    <p class="card-text">Type: {{chocolate.type}}</p> 
                    <p class="card-text">Kind: {{chocolate.kind}}</p>
                    <p class="card-text">Price: {{chocolate.price}}$</p>
                    <p class="card-text">Weight: {{chocolate.weight}}g</p>
                    <p class="card-text">Quantity: {{chocolate.quantity}}g</p>
                    <button class="btn btn-primary btn-block" type="button" @click="editQuantityClick(chocolate)">Edit quantity</button>
                    <button class="btn btn-danger btn-block" type="button" @click="removeClick(chocolate)">Remove chocolate</button>
                </div>
            </div>
    </div>
    <button type="button" class="btn btn-primary btn-block"  @click="validateBuy()"> Make a Purchase</button>
    <div class="group col-sm-9" v-if="editingQuantity">
        <form class="form-horizontal" role="form" @submit.prevent="updateCart()">
                <h1>Enter how many chocolates you want to buy</h1>
                <div class="form-group">
                    <label>Quantity:   (must be less then {{ currentChocolate.quantity }})</label>
                    <div class="col-sm-9">
                        <input type="number" v-model="newQuantity" class="form-control col-sm-9" required>
                        <div v-if="!newQuantity && quantitySubmited" class="invalid-feedback">Quantity is required*</div>
                    </div>
                    <button type="submit" class="btn btn-primary btn-block">Edit quantity</button>
                    <button type="button" class="btn btn-secondary btn-block" @click="cancelClick">Cancel</button>
                </div>
            </form>
    </div>
</div>

</template>
<script>
import axios from 'axios';

export default{
    name: 'Cart',
    data(){
        return{
            user: null,
            factories: [],
            selected: null,
            editingQuantity: false,
            newQuantity: 0,
            currentChocolate: null,
            quantitySubmited: false,
            isUserAdmin: false,
            isUserMenager: false,
            isUserWorker: false,
            isUSerCustomer: false,
            isLoggedIn: false,
            purchase:{
                chocolates:[],
                factory: null,
                date: null,
                price: 0,
                customer: null,
                status: 'Pending'
            },
            factory: null,
            isCartEmpty: false
        }
    },
    mounted(){
        this.getUser();
        this.getFactories();
    },
    methods:{
        getUser(){
            this.user = JSON.parse(localStorage.getItem('user'));
            if(this.user.cart.chocolates.length ===0){
                this.isCartEmpty = true;
            }
            this.checkRoles();
        },
        
        checkRoles(){
            const role = JSON.parse(localStorage.getItem('userRole'));
            const user = JSON.parse(localStorage.getItem('user'));
            console.log(user);
            if(role && role === 'Administrator'){
                this.isUserAdmin = true;
            }
            if(role && role === 'Menager'){
                this.isUserMenager = true;
            }
            if(role && role === 'Worker'){
                this.isUserWorker = true;
            }
            if(role && role === 'Customer'){
                this.isUSerCustomer = true;
            }
            if(role){
                this.isLoggedIn = true;
            }
        },
        formatDate(date){
            var d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2) 
                month = '0' + month;
            if (day.length < 2) 
                day = '0' + day;

            return [year, month, day].join('-');
        },
        getFactories(){
            axios.get('http://localhost:4000/factories').then(response => {
                this.factories = response.data;
            }).catch(error => {
                console.error("greska pri ucitavanju fabrika");
            });
        },
        editQuantityClick(chocolate){
            this.newQuantity = chocolate.quantity;
            this.selected = chocolate
            const id = chocolate.factoryId;
            let factory = this.factories.find(f => f.id === id);
            if(factory){
                this.currentChocolate = factory.chocolates.find(c => c.name === chocolate.name);
            }
            this.editingQuantity = true;
        },
        validateBuy(){
            const id = this.user.cart.chocolates[0].factoryId;
            console.log(id)
            let factory = this.factories.find(f => f.id === id);
            
            if(factory){
                console.log(factory);
                this.purchase.factory = factory;
                this.purchase.customer = this.user;
                this.purchase.chocolates = this.user.cart.chocolates;
                this.purchase.date = this.formatDate(new Date())
                this.applyCustomerSale();
            }
        },
        applyCustomerSale(){
            if(this.user.customerType ==='Silver'){
                this.user.cart.price = this.user.cart.price * 0.96;
            }else if(this.user.customerType ==='Gold'){
                this.user.cart.price = this.user.cart.price * 0.92;
            }
            this.purchase.price = this.user.cart.price;
            this.makePurchese();
        },
        makePurchese(){
            axios.post('http://localhost:4000/purchases', this.purchase).then(response =>{
                this.user.cart.chocolates = [];
                this.user.cart.price = 0;
                this.user.points += Math.round((this.purchase.price/1000) *133);
                console.log("napravio porudzbinu")
                this.updateCustomerType();
                this.updateFactoryStock();
            })
        },
        updateCustomerType(){
            if(this.user.points > 2000){
                this.user.customerType = 'Gold';
            }else  if(this.user.points > 1000){
                this.user.customerType = 'Silver';
            }
            this.updateUser();
        },
        updateFactoryStock(){
            this.purchase.chocolates.forEach((chocolate) =>{
                var i =  this.purchase.factory.chocolates.findIndex(c => c.name === chocolate.name);
                if(i!==-1){
                    this.purchase.factory.chocolates[i].quantity -= chocolate.quantity;
                }
            });
            axios.put(`http://localhost:4000/factories/${this.purchase.factory.id}`, this.purchase.factory).then(responce => {
                console.log("izmenio stock fabrike")                
            }).catch(error =>{
                console.error("Error while updationg a factory", error);
            })
        },
        
        removeClick(chocolate){
            const i = this.user.cart.chocolates.findIndex(c => c.name === chocolate.name);
            if(i!==-1){
                this.user.cart.price -= this.user.cart.chocolates[i].price * this.user.cart.chocolates[i].quantity;
                this.user.cart.chocolates.splice(i, 1);
                this.updateUser();
            }
        },
        confirmClick(){
            this.quantitySubmited = true;
            if(this.newQuantity && this.newQuantity >0 && this.newQuantity <= this.currentChocolate.quantity){
                this.updateCart();
            }
        },
        updateCart(){
            const i = this.user.cart.chocolates.findIndex(c => c.name === this.selected.name);
            if(i!==-1){
                this.user.cart.price -= this.user.cart.chocolates[i].price * this.user.cart.chocolates[i].quantity;
                this.user.cart.chocolates[i].quantity = this.newQuantity;
                console.log(this.user.cart.chocolates[i].quantity)
                this.user.cart.price += this.user.cart.chocolates[i].price * this.user.cart.chocolates[i].quantity;
                this.editingQuantity = false;
                this.updateUser();
            }
        },
        updateUser(){
            axios.put(`http://localhost:4000/users/${this.user.username}`, this.user).then(responce =>{
                localStorage.setItem('user', JSON.stringify(this.user));
            }).catch(error =>{
                console.error("Greska pri updejtu usera", error);
            })
        },
        cancelClick(){
            this.editingQuantity = false;
            this.currentChocolate = null;
            this.quantitySubmited = false;
        },
        goToProfile(){
            const user = JSON.parse(localStorage.getItem('user'));
            if(user){
                this.$router.push({name: 'UserInfo', params:{id:user.username}});
            }
        },
        goToAddFactory(){
            this.$router.push({name: 'AddFactory'});
        },
        goToLogin(){
            this.$router.push({name: 'Login'});
        },
        goToRegister(){
            this.$router.push({name: 'Register'});
        },
        goToCart(){
            this.$router.push({name: 'Cart'})
        },
        goToFactiories(){
            this.$router.push({name: 'Factories'})
        },
        logout(){
            this.isUserAdmin = false;
            this.isUserMenager = false;
            this.isUserWorker = false;
            this.isLoggedIn = false;
            localStorage.clear();
            this.$router.push({name: 'Factories'});
        }
    }
}

</script>
<style>
</style>