<template>
    <div class="containter" v-if="selected">
        <nav class = "navbar navbar-default" role = "navigation" style="background: gray;color:white; width: 95%;">
            <div class = "navbar-header">
                <a @click="goToFactiories" class = "navbar-brand" href = "#">Factories</a>
            </div>
            <div>
                <button v-if="!isLoggedIn" type = "button" class = "btn btn-default navbar-btn  navbar-left" @click="goToLogin">Login</button>
                <button v-if="!isLoggedIn" type = "button" class = "btn btn-default navbar-btn  navbar-left" @click="goToRegister">Register</button>
                <button v-if="isLoggedIn" type = "button" class = "btn btn-default navbar-btn  navbar-left" @click="goToProfile">Profile</button>
                <button v-if="isLoggedIn" type = "button" class = "btn btn-default navbar-btn  navbar-left" @click="logout">Logout</button>
                <button v-if="isUserAdmin" type = "button" class = "btn btn-default navbar-btn  navbar-left" @click="goToAddFactory">Add Factory</button>
            </div>
        </nav>
        <div class="group col-sm-4">
            <h1>Factory: {{ selected.name }}</h1>
        <p><b>Work Hours: </b>{{ selected.workHours }}</p>
        <p><b>Status:</b></p>
        <p><b>Location: </b>{{ selected.location.state }}, {{ selected.location.city }} - {{ selected.location.street }}</p>
        
        <p><b>Rating: </b>{{ selected.rating }}</p>
        </div>
        
        <h1>All Registered Chocolates</h1>
        <div class="row">
            <div v-for="chocolate in filteredChocolates" :key="chocolate.id" class="col-md-3 col-sm-6">
                <div class="card card-block">
                    <img class="card-logo" :src="setChocolateImageUrl(chocolate.image)" :alt="chocolate.name">
                    <h5 class="card-title mt-3 mb-3">{{ chocolate.name }}</h5>
                    <p class="card-text">Type: {{chocolate.type}}</p> 
                    <p class="card-text">Kind: {{chocolate.kind}}</p>
                    <p class="card-text">Price: {{chocolate.price}}$</p>
                    <p class="card-text">Weight: {{chocolate.weight}}g</p>
                    <p class="card-text">Available: {{chocolate.quantity}}</p>
                    <button class="btn btn-primary btn-block" type="button" v-if="isUserBuyer" @click="purchaseClick(chocolate)">Add to cart</button>
                    <button class="btn btn-primary btn-block" type="button" v-if="isUserMenager || isUserWorker" @click="updateChocolateClick(chocolate)">Update chocolate</button>
                    <button class="btn btn-danger btn-block" type="button" v-if="isUserMenager" @click="deleteChocolate(chocolate)">Delete chocolate</button>
                </div>
                
            </div>
        </div>
        <div class="group col-sm-9" v-if="isUserBuyer && isPurchaseClicked">
            <form class="form-horizontal" role="form" @submit.prevent="validateBuy">
                <h1>Enter how many chocolates you want to buy</h1>
                <div class="form-group">
                    <label>Quantity:   (must be less then {{ addedChocolate.quantity }})</label>
                    <div class="col-sm-9">
                        <input type="number" v-model="wantedQuantity" class="form-control col-sm-9" required>
                        <div v-if="!wantedQuantity && quantitySubmited" class="invalid-feedback">Quantity is required*</div>
                        <div v-if="wantedQuantity > addedChocolate.quantity && quantitySubmited" class="invalid-feedback">Quantity too large*</div>
                    </div>
                    <button type="submit" class="btn btn-primary btn-block">Add to cart</button>
                </div>
            </form>
        </div>
        <button class="btn btn-primary btn-block" style="margin-top: 10px;" type="button" v-if="isUserMenager" @click="addChocolateClick">Add new chocolate</button>
        <div v-if="addingChocolate || updatingChocolate" class="group col-sm-9">
            
            <form class="form-horizontal" role="form" @submit.prevent="validate" v-if="isUserMenager || isUserWorker">
                <h1>{{ updatingChocolate ? 'Update Chocolate' : 'Add Chocolate' }}</h1>
                <h3 v-if="isUserWorker && updatingChocolate">Change stock for : {{addedChocolate.name}}</h3>
                <div class="form-group" v-if="isUserMenager">
                    <label>Name:</label>
                    <div class="col-sm-9">
                        <input type="text" v-model="addedChocolate.name" class="form-control col-sm-9" required>
                        <div v-if="!addedChocolate.name && submited" class="invalid-feedback">Name Is Required*</div>
                    </div>
                    
                </div>
                <div class="form-group" v-if="isUserMenager">
                    <label>Price:</label>
                    <div class="col-sm-9">
                        <input type="number" v-model="addedChocolate.price" class="form-control" required>
                        <div v-if="!addedChocolate.price && submited" class="invalid-feedback">Price Is Required*</div>
                    </div>
                    
                </div>
                <div class="form-group" v-if="isUserMenager">
                    <label>Type:</label>
                    <div class="col-sm-9">
                        <select v-model="addedChocolate.type">
                            <option value=""></option>
                            <option value="Bar">Bar</option>
                            <option value="Cooking">Cooking</option>
                            <option value="Hot">Hot Chocolate</option>
                        </select>
                        <div v-if="!addedChocolate.kind && submited" class="invalid-feedback">Type Is Required*</div>
                    </div>
                    
                </div>
                <div class="form-group" v-if="isUserMenager">
                    <label>Kind:</label>
                    <div class="col-sm-9">
                        <select v-model="addedChocolate.kind">
                            <option value=""></option>
                            <option value="Dark">Dark</option>
                            <option value="Milk">Milk</option>
                            <option value="White">White</option>
                        </select>
                        <div v-if="!addedChocolate.kind && submited" class="invalid-feedback">Kind Is Required*</div>
                    </div>
                    
                </div>
                <div class="form-group" v-if="isUserMenager">
                    <label>Weight:</label>
                    <div class="col-sm-9">
                        <input type="number" v-model="addedChocolate.weight" class="form-control" required>
                        <div v-if="!addedChocolate.weight && submited" class="invalid-feedback">Weight Is Required*</div>
                    </div>
                    
                </div>
                <div class="form-group" v-if="isUserMenager">
                    <label>Short Description:</label>
                    <div class="col-sm-9">
                        <input type="text" v-model="addedChocolate.description" class="form-control" required>
                        <div v-if="!addedChocolate.weight && submited" class="invalid-feedback">Description Is Required*</div>
                    </div>
                    
                </div>
                <div class="form-group" v-if="isUserMenager">
                    <label>Photo:</label>
                    <div class="col-sm-9">
                        <input type="file" @change="fileAdded" class="form-control">
                    </div>
                    
                </div>
                <div class="form-group" v-if="isUserMenager || isUserWorker">
                    <label>Quantity:</label>
                    <div class="col-sm-9">
                        <input type="number" v-model="addedChocolate.quantity" class="form-control">
                        <div v-if="!addedChocolate.quantity && submited" class="invalid-feedback">Quantity Is Required*</div>
                    </div>
                    
                </div>
                <button type="submit" class="btn btn-success btn-block">Confirm</button>
                <button type="button" class="btn btn-secondary btn-block" @click="cancelClicked">Cancel</button>
            </form>
            
        </div>
        <div v-if="isUserMenager" class="group col-sm-4">
            <h2>Add new Worker to a factory</h2>
            <form class="form-horizontal" role="form" @submit.prevent="validateUser">
                <div class="form-group">
                    <label for="firstName" class="col-sm-3 control-label">First Name*</label>
                    <div class="col-sm-8">
                        <input type="text" id="firstName" v-model="newUser.firstname" class="form-control" autofocus>
                    </div>
                </div>
                <div class="form-group">
                    <label for="lastName" class="col-sm-3 control-label">Last Name*</label>
                    <div class="col-sm-8">
                        <input type="text" id="lastName" v-model="newUser.lastname" class="form-control" autofocus>
                    </div>
                </div>
                <div class="form-group">
                    <label for="username" class="col-sm-3 control-label">Username*</label>
                    <div class="col-sm-8">
                        <input type="text" id="username" v-model="newUser.username" class="form-control" autofocus>
                    </div>
                </div>
                <div class="form-group">
                    <label for="password" class="col-sm-3 control-label">Password*</label>
                    <div class="col-sm-8">
                        <input type="password" id="password" v-model="newUser.password" class="form-control">
                    </div>
                </div>
                <div class="form-group">
                    <label for="password2" class="col-sm-3 control-label">Confirm Password*</label>
                    <div class="col-sm-8">
                        <input type="password" id="password2" v-model="confirmPassword" class="form-control">
                    </div>
                </div>
                <div class="form-group">
                    <label for="birthDate" class="col-sm-3 control-label">Date of Birth*</label>
                    <div class="col-sm-8">
                        <input type="date" id="birthDate" v-model="newUser.birthday" class="form-control">
                    </div>
                </div>
                <div class="form-group">
                    <label for="gender" class="col-sm-3 control-label">Gender*</label>
                    <div class="col-sm-8">
                        <select data-mdb-select-init v-model="newUser.gender" id="gender">
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                        <option value="Other">Other</option>
                  </select>
                    </div>
                    
                </div>
                 
                 <!-- /.form-group -->
                <div class="form-group">
                    <div class="col-sm-8 col-sm-offset-3">
                        <span class="help-block">*Required fields</span>
                    </div>
                </div>
                <button type="submit" class="btn btn-primary btn-block">Register New Worker</button>
            </form> <!-- /form -->
        </div>
        <div v-if="isUserMenager" class="group col-sm-9">
            <div class="filters">
                <input v-model="searchFilters.minPrice" placeholder="Enter min price" min="1" type="number" @input="sortPurcheser">
                <input v-model="searchFilters.maxPrice" placeholder="Enter max price" min="1" type="number" @input="sortPurcheser">
                <input v-model="searchFilters.minDate" placeholder="Enter start date" type="date" @input="sortPurcheser">
                <input v-model="searchFilters.maxDate" placeholder="Enter end date" type="date" @input="sortPurcheser">
                <select v-model="sortBy" @change="sortPurcheser">
                    <option value="price">Price</option>
                    <option value="date">Date</option>
                </select>

                <select v-model="sortFrom" @change="sortPurcheser">
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                </select>
                

            </div>
        </div>
        <div v-if="isUserMenager" class=" group col-sm-9">
            <h2>All Purchses</h2>
            <table class="table">
                <thead>
                <tr>
                    <th scope="col">Customer Username</th>
                    <th scope="col">Price:</th>
                    <th scope="col">Date</th>
                    <th scope="col">Status </th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="purchase in filteredPurchases" :key="purchase.id">
                    <td>{{ purchase.customer.username }}</td>
                    <td>{{ purchase.price }}</td>
                    <td>{{ purchase.date }}</td>
                    <td>
                        <p v-if="purchase.status !== 'Pending'">{{ purchase.status }}</p>
                        <button v-if="purchase.status ==='Pending'" class="btn btn-primary btn-block" @click="approvePurchase(purchase)">Approve</button>
                        <button v-if="purchase.status ==='Pending'" class="btn btn-danger btn-block" @click="denyPurchase(purchase)">Deny</button>
                    </td>
                    
                </tr>
                </tbody>
            </table>
            
        </div>
        <div class=" group col-sm-7">
            <h2>All Comments:</h2>
            <div class="container my-5 py-5">
                <div class="row d-flex justify-content-left">
                <div class="col-md-12 col-lg-10">

                        <div class="d-flex flex-start card" v-for="comment in comments" :key="comment.id">
                            <div>
                            <h5 class="fw-bold mb-1">User:{{ comment.user.username }}</h5>
                            <div class="d-flex align-items-center mb-3">
                                <p class="mb-0">
                                    Grade: {{ comment.review }}
                                    <span class="badge bg-primary" v-if="comment.status === 'Pending'">Pending</span>
                                    <span class="badge bg-danger" v-if="comment.status === 'Denied'">Denied</span>
                                    <span class="badge bg-success" v-if="comment.status === 'Approved'">Approved</span>
                                </p>
                                <button type="button" class="btn btn-block btn-primary"v-if="this.isUserMenager && comment.status ==='Pending'" @click="approveComment(comment)">Approve</button>
                                <button type="button" class="btn btn-block btn-danger"v-if="this.isUserMenager && comment.status ==='Pending'" @click="denyComment(comment)">Deny</button>
                            </div>
                            <p class="mb-0">
                            {{ comment.text }}
                            </p>
                            </div>
                        </div>

                </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import { error } from 'jquery';

export default{
    name: 'Details',
    data(){
        return{
            selected: null,
            addingChocolate: false,
            updatingChocolate: false,
            addedChocolate: {
                name: '',
                price: '',
                type: '',
                kind: '',
                weight: '',
                description: '',
                image: '',
                status: '',
                quantity: 0,
                factoryId: ''
            },
            submited: false,
            isUserWorker: false,
            isUserMenager: false,
            isUserBuyer: false,
            isOwner: false,
            newUser: {
                username:'',
                password:'',
                firstname:'',
                lastname:'',
                birthday:'',
                gender:'',
                role: 'Worker',
                purchases: [],
                cart: [],
                factory: null,
                points: 0,
                customerType: null,
                blocked: false
            },
            confirmPassword: '',
            isPurchaseClicked: false,
            wantedQuantity: 0,
            quantitySubmited: false,
            userCart: null,
            currentUser: null,
            isLoggedIn: false,
            purchases: [],
            filteredPurchases: [],
            selectedPur:null,
            comments: [],
            selectedComment: null,
            filteredChocolates: [],
            searchFilters: {
                factoryName: '',
                minPrice: 0,
                maxPrice: 0,
                minDate: null,
                maxDate: null
            },
            sortBy: 'factoryName',
            sortFrom: 'asc'
        };
    },
    mounted(){
        this.getFactory();
    },
    methods:{
        getFactory(){
            const selectedId = this.$route.params.id;
            axios.get(`http://localhost:4000/factories/${selectedId}`).then(responce => {
                this.selected = responce.data;
                this.checkUserRoles();
                this.getPurchases();
            }).catch(error => {
                console.error("Error geting factory by id", error);
            });
        },
        getPurchases(){
            axios.get('http://localhost:4000/purchases').then(responce=>{
                this.purchases = responce.data;
                this.sortPurcheser();
            }).catch(error => {
                console.error("Error geting purcheses", error);
            })
        },
        
        approvePurchase(purchase){
            this.selectedPur = purchase;
            this.selectedPur.status = 'Approved';
            console.log(this.selectedPur.id);
            axios.put(`http://localhost:4000/purchases/${this.selectedPur.id}`, this.selectedPur).then(responce =>{
                
            }).catch(error=>{
                console.error("Greska pri izmeni kupovine", error);
            })
        },
        denyPurchase(purchase){
            this.selectedPur = purchase;
            this.selectedPur.status = 'Denied';
            this.selectedPur.chocolates.forEach(chocolate => {
                const i = this.selected.chocolates.findIndex(c => c.name === chocolate.name);
                this.selected.chocolates[i].quantity +=chocolate.quantity;
            });
            axios.put(`http://localhost:4000/purchases/${this.selectedPur.id}`, this.selectedPur).then(responce =>{
                
            }).catch(error=>{
                console.error("Greska pri izmeni kupovine", error);
            });
            this.refreshFactory();
        },
        purchaseClick(chocolate){
            this.addedChocolate = chocolate
            this.isPurchaseClicked = true;
            this.currentUser =JSON.parse(localStorage.getItem('user'));
            console.log(this.addedChocolate.name)
            
            const i = this.currentUser.cart.chocolates.findIndex(c => c.name === this.addedChocolate.name)
            if(i!==-1){
                this.wantedQuantity = this.currentUser.cart.chocolates[i].quantity;
                console.log(this.wantedQuantity)
            }
        },
        validateBuy(){
            this.quantitySubmited = true;
            if(this.wantedQuantity <= this.addedChocolate.quantity){
                this.currentUser =JSON.parse(localStorage.getItem('user'));
                this.quantitySubmited = false;
                var kol = this.addedChocolate.quantity;
                this.addedChocolate.quantity = this.wantedQuantity;
                const i = this.currentUser.cart.chocolates.findIndex(c => c.name === this.addedChocolate.name)
                if(i!==-1){
                    console.log(this.currentUser.cart.chocolates[i].quantity);
                    this.currentUser.cart.price = this.currentUser.cart.price - this.currentUser.cart.chocolates[i].price * this.currentUser.cart.chocolates[i].quantity;
                    this.currentUser.cart.chocolates[i] = this.addedChocolate
                }else{
                    this.currentUser.cart.chocolates.push(this.addedChocolate);
                }
                this.isPurchaseClicked = false;
                this.currentUser.cart.price += this.addedChocolate.quantity * this.addedChocolate.price;
                this.updateUser();
                //dodaj kod za kupovinu
                //u cartu cuvas kolicinu zeljene cokolade, a u fabrici cuvas stanje
                
            }
        },
        updateUser(){
            axios.put(`http://localhost:4000/users/${this.currentUser.username}`, this.currentUser).then(responce =>{
                localStorage.setItem('user', JSON.stringify(this.currentUser));
                location.reload()
            }).catch(error =>{
                console.error("Greska pri updejtu usera", error);
            })
        },
        sortPurcheser(){
            var all = this.purchases.filter(p => p.factory.id === this.selected.id);
            
            if(this.searchFilters.minPrice){
                all =all.filter(p => p.price >= this.searchFilters.minPrice);
            }
            if(this.searchFilters.maxPrice){
                all =all.filter(p => p.price <= this.searchFilters.maxPrice);
            }
            if(this.searchFilters.minDate){
                all =all.filter(p => p.date >= this.searchFilters.minDate );
            }
            if(this.searchFilters.maxDate){
                all =all.filter(p => p.date <= this.searchFilters.maxDate );
            }

            all =all.slice().sort((a,b) =>{
                let sortLike = 0;
                if(this.sortBy === 'price'){
                    sortLike = a.price - b.price;
                }else if(this.sortBy === 'date'){
                    sortLike = new Date(a.date) - new Date(a.date)
                }

                if(this.sortFrom === 'desc'){
                    sortLike = sortLike * (-1)
                }
                return sortLike;
            });

            this.filteredPurchases = all;
        },
        validateUser(){
          this.submitedUser = true;
            if(this.newUser.username && this.newUser.password && this.newUser.firstname && this.newUser.lastname && this.newUser.birthday && this.newUser.gender && this.newUser.password === this.confirmPassword){
                this.newUser.factory = this.selected
                axios.post('http://localhost:4000/users/register',this.newUser).then(response => {
                    console.log("usp reg", response);
                    this.resetUser();
                }).catch(error => {
                    console.error("Greska pri registraciji", error)
                });

            }
        },
        resetUser(){
            this.newUser = {
                username:'',
                password:'',
                firstname:'',
                lastname:'',
                birthday:'',
                gender:'',
                role: 'Worker',
                purchases: [],
                cart: [],
                factory: null,
                points: 0,
                customerType: null
            };
            this.confirmPassword = '';
        },
        getComments(){
            axios.get('http://localhost:4000/comments').then(responce =>{
                this.comments = responce.data;
                let all = this.comments;
                all = all.filter(c => c.factory.id === this.selected.id)
                this.comments = all;
                if(this.isUserBuyer){
                    this.comments = this.comments.filter(c => c.status === 'Approved');
                }
            }).catch(error =>{
                console.error("error geting comments");
            })
        },
        approveComment(comment){
            this.selectedComment = comment;
            this.selectedComment.status = 'Approved';
            axios.put(`http://localhost:4000/comments/${this.selectedComment.id}`, this.selectedComment).then(response =>{
                console.log("izmeni komentar");
                this.getComments();
            })
        },
        denyComment(comment){
            this.selectedComment = comment;
            this.selectedComment.status = 'Denied';
            axios.put(`http://localhost:4000/comments/${this.selectedComment.id}`, this.selectedComment).then(response =>{
                console.log("izmeni komentar");
                this.getComments();
            }) 
        },
        checkUserRoles(){
            const user = JSON.parse(localStorage.getItem('user'));
            if(user && user.role === 'Menager'){
                if(this.selected){
                    if(this.selected.name === user.factory.name){
                        this.isUserMenager = true;
                    }
                }
                //this.isUserMenager = true;
            }
            let all = this.selected.chocolates;
            if(user && user.role === 'Worker' && this.selected.name === user.factory.name){
                if(this.selected){
                    if(this.selected.name === user.factory.name){
                        this.isUserWorker = true;
                    }
                }
            }
            if(user && user.role === 'Customer'){
                this.isUserBuyer = true;
                all = all.filter(c => c.quantity > 0)
            }
            if(user){
                this.currentUser = JSON.parse(localStorage.getItem('user'));
                this.isLoggedIn = true;
            }
            this.filteredChocolates = all;
            this.getComments();
        },
        addChocolateClick(){
            this.addingChocolate = true;
            this.updatingChocolate = false;
        },
        updateChocolateClick(chocolate){
            this.addedChocolate = {...chocolate};
            this.addingChocolate = false;
            this.updatingChocolate = true;
        },
        fileAdded(event){
            const filepath = event.target.files[0];
            this.addedChocolate.image = filepath ? filepath.name : '';
        },
        cancelClicked(){
            this.addingChocolate = false;
            this.updatingChocolate = false;
            this.defaultChocolate();
        },
        defaultChocolate(){
            this.addedChocolate = {
                name: '',
                price: '',
                type: '',
                kind: '',
                weight: '',
                description: '',
                image: '',
                status: '',
                quantity: 0,
                factoryId: ''
            };
            this.submited = false;
        },
        validate(){
            this.submited = true;
            if(this.addedChocolate.name && this.addedChocolate.weight && this.addedChocolate.type && this.addedChocolate.kind && this.addedChocolate.description && this.addedChocolate.price){
                if(this.updatingChocolate){
                    this.updateChocolateData();
                }else{
                    this.addNewChocolate();
                }
            }
        },
        addNewChocolate(){
            this.addedChocolate.factoryId = this.selected.id;
            this.selected.chocolates.push(this.addedChocolate);
            this.refreshFactory();
        },
        refreshFactory(){
            axios.put(`http://localhost:4000/factories/${this.selected.id}`, this.selected).then(responce => {
                this.getFactory();
                this.defaultChocolate();
                this.addingChocolate = false;
                this.updatingChocolate = false;
                
            }).catch(error =>{
                console.error("Error while updationg a factory", error);
            })
        },
        updateChocolateData(){
            const i = this.selected.chocolates.findIndex(chocolate => chocolate.name === this.addedChocolate.name);
            if(i!== -1){
                this.selected.chocolates.splice(i, 1, this.addedChocolate);
                this.refreshFactory();
            }
        },
        deleteChocolate(deleted){
            console.log(deleted.name);
            const i = this.selected.chocolates.findIndex(chocolate => chocolate.name === deleted.name);
            if(i !== -1){
                this.selected.chocolates.splice(i, 1);
                this.refreshFactory();
            }
        },
        setChocolateImageUrl(filepath){
            const imgs = import.meta.glob('../assets/*.{jpg,png,jpeg}');
            const imgName = filepath.split('/').pop();
            for(const path in imgs){
                if(path.includes(imgName)){
                    return path.replace('../assets', '/src/assets');
                }
            }
            console.error("Error while loading a picture for chocolate");
            return '/src/assets/chocolate-default.jpg';
        },
        goToProfile(){
            const user = JSON.parse(localStorage.getItem('user'));
            if(user){
                this.$router.push({name: 'UserInfo', params:{id:user.username}});
            }
        },
        goToCart(){
            this.$router.push({name: 'Cart'})
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
        },
        
    }
}

</script>
<style>

.card-logo{
    height:150px;
    width:100%;
}
img{
  height:150px;
  width:100%;
}

div [class^="col-"]{
  padding-left:5px;
  padding-right:5px;
}
.card{
  transition:0.5s;
  cursor:pointer;
  padding: 5px;
  margin: 5px;
  border-color: gray;
}
.card-title{  
  font-size:15px;
  transition:1s;
  cursor:pointer;
}
.card-title i{  
  font-size:15px;
  transition:1s;
  cursor:pointer;
  color:#ffa710
}
.card-title i:hover{
  transform: scale(1.25) rotate(100deg); 
  color:#18d4ca;
  
}
.card:hover{
  transform: scale(1.05);
  box-shadow: 10px 10px 15px rgba(0,0,0,0.3);
}
.card-text{
  height: 20px;  
}

.card::before, .card::after {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  transform: scale3d(0, 0, 1);
  transition: transform .3s ease-out 0s;
  background: rgba(255, 255, 255, 0.1);
  content: '';
  pointer-events: none;
}
.card::before {
  transform-origin: left top;
}
.card::after {
  transform-origin: right bottom;
}
.card:hover::before, .card:hover::after, .card:focus::before, .card:focus::after {
  transform: scale3d(1, 1, 1);
}
.group{
    border: 2px solid gray;
    border-radius: 5px;
    padding: 5px;
    margin-top: 10px;
}
.btn{
    margin-right: 5px;
}
.delete{
    background-color: red;
}

</style>
