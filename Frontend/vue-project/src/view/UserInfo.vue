<template>
<div class="containter">
    <nav class = "navbar navbar-default" role = "navigation" style="background: gray;color:white;">
         <div class = "navbar-header">
            <a  class = "navbar-brand" href = "#">Factories</a>
         </div>
         <div>
            <button v-if="!isLoggedIn" type = "button" class = "btn btn-default navbar-btn  navbar-left" @click="goToLogin">Login</button>
            <button v-if="!isLoggedIn" type = "button" class = "btn btn-default navbar-btn  navbar-left" @click="goToRegister">Register</button>
            <button v-if="isLoggedIn" type = "button" class = "btn btn-default navbar-btn  navbar-left" @click="goToProfile">Profile</button>
            <button v-if="isLoggedIn" type = "button" class = "btn btn-default navbar-btn  navbar-left" @click="logout">Logout</button>
            <button v-if="isUserAdmin" type = "button" class = "btn btn-default navbar-btn  navbar-left" @click="goToAddFactory">Add Factory</button>
         </div>
    </nav>
    <div v-if="selected" class="col-sm-10">
        <div class="group col-sm-4">
            <h4>Username: {{ selected.username }}</h4>
            <h4>Password: {{ selected.password }}</h4>
            <h4>First Name: {{ selected.firstname }}</h4>
            <h4>Last Name: {{ selected.lastname }}</h4>
            <h4>Birthday: {{ selected.birthday }}</h4>
            <h4>Gender: {{ selected.gender }}</h4>
            <h4 v-if="isUserCustomer">Points: {{ selected.points }}</h4>
            <button class="btn btn-primary btn-block" type="button" @click="editUserClick">Edit your profile info</button>
        </div>
        
        <div v-if="updatingUser" class="group col-sm-4">
            <h2>Edit your data</h2>
            <form @submit.prevent="validate"> 
                <div class="form-group">
                    <label>Username:</label>
                    <input type="text" v-model="newUser.username" class="form-control" required>
                    <div v-if="!newUser.username && submited" class="invalid-feedback">Username Is Required*</div>
                </div>
                <div class="form-group">
                    <label>Password:</label>
                    <input type="text" v-model="newUser.password" class="form-control" required>
                    <div v-if="!newUser.password && submited" class="invalid-feedback">Password Is Required*</div>
                </div>
                <div class="form-group">
                    <label>First Name:</label>
                    <input type="text" v-model="newUser.firstname" class="form-control" required>
                    <div v-if="!newUser.firstname && submited" class="invalid-feedback">First name Is Required*</div>
                </div>
                <div class="form-group">
                    <label>Last Name:</label>
                    <input type="text" v-model="newUser.lastname" class="form-control" required>
                    <div v-if="!newUser.lastname && submited" class="invalid-feedback">Last name Is Required*</div>
                </div>
                <div class="form-group">
                    <label>Birthday:</label>
                    <input type="date" v-model="newUser.birthday" class="form-control" required>
                    <div v-if="!newUser.birthday && submited" class="invalid-feedback">Birthday Is Required*</div>
                </div>
                <div class="form-group">
                    <label>Gender:</label>
                    <select data-mdb-select-init v-model="newUser.gender">
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                        <option value="Other">Other</option>
                    </select>
                    <div v-if="!newUser.gender && submited" class="invalid-feedback">Birthday Is Required*</div>
                </div>
                <button type="submit" class="btn btn-primary btn-block">Confirm</button>
                <button type="button" class="btn btn-secondary btn-block" @click="editUserCancel">Cancel</button>
            </form>
        </div>
        
        <div v-if="isUserAdministrator"  class="group col-sm-7">
            <div class="filters">
                <input v-model="searchFilters.username" placeholder="Enter Username" @input="sortAndFilter">
                <input v-model="searchFilters.firstname" placeholder="Enter First Name" @input="sortAndFilter">
                <input v-model="searchFilters.lastname" placeholder="Enter Last Name" @input="sortAndFilter">
                <select v-model="sortBy" @change="sortAndFilter">
                    <option value="username">Username</option>
                    <option value="firstname">First Name</option>
                    <option value="lastname">Last Name</option>
                    <option value="points">Points</option>
                </select>

                <select v-model="sortFrom" @change="sortAndFilter">
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                </select>
                <select v-model="filt.userRole" @change="sortAndFilter">
                    <option value="">All</option>
                    <option value="Administrator">Administrator</option>
                    <option value="Menager">Menager</option>
                    <option value="Worker">Worker</option>
                    <option value="Customer">Customer</option>
                </select>
                <select v-model="filt.customerType" @change="sortAndFilter">
                    <option value="">All</option>
                    <option value="Gold">Gold</option>
                    <option value="Silver">Silver</option>
                    <option value="Bronze">Bronze</option>
                </select>

            </div>
            <table class="table">
            <thead>
              <tr>
                <th scope="col">Username</th>
                <th scope="col">First Name</th>
                <th scope="col">Last Name</th>
                <th scope="col">Role </th>
                <th scope="col">Block </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in filteredUsers" :key="user.username">
                <td>{{ user.username }}</td>
                <td>{{ user.firstname }}</td>
                <td>{{ user.lastname }}</td>
                <td>{{ user.role}}</td>
                <td v-if="user.role !=='Administrator'">
                    <button v-if="!user.blocked" class="btn btn-primary btn-block" @click="blockClick(user)">Block</button>
                    <p v-if="user.blocked">Blocked</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="isUserCustomer" class="group col-sm-9">
            <div class="filters">
                <input v-model="searchFilters.factoryName" placeholder="Enter factory name" @input="sortPurcheser">
                <input v-model="searchFilters.minPrice" placeholder="Enter min price" min="1" type="number" @input="sortPurcheser">
                <input v-model="searchFilters.maxPrice" placeholder="Enter max price" min="1" type="number" @input="sortPurcheser">
                <input v-model="searchFilters.minDate" placeholder="Enter start date" type="date" @input="sortPurcheser">
                <input v-model="searchFilters.maxDate" placeholder="Enter end date" type="date" @input="sortPurcheser">
                <select v-model="sortBy" @change="sortPurcheser">
                    <option value="factoryName">Factory Name</option>
                    <option value="price">Price</option>
                    <option value="date">Date</option>
                </select>

                <select v-model="sortFrom" @change="sortPurcheser">
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                </select>
                

            </div>
        </div>
        <div v-if="isUserCustomer"  class="group col-sm-9">
            <h2>All Purchses</h2>
            <table class="table">
                <thead>
                <tr>
                    <th scope="col">Factory:</th>
                    <th scope="col">Price:</th>
                    <th scope="col">Date</th>
                    <th scope="col">Status </th>
                    <th scope="col"></th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="purchase in filteredPurchases" :key="purchase.id">
                    <td>{{ purchase.factory.name }}</td>
                    <td>{{ purchase.price }}</td>
                    <td>{{ purchase.date }}</td>
                    <td>
                        <p v-if="purchase.status !== 'Pending'">{{ purchase.status }}</p>
                        
                        <button v-if="purchase.status ==='Pending'" class="btn btn-danger btn-block" @click="cancelPurchase(purchase)">Cancle</button>
                    </td>
                    <td>
                        <button v-if="purchase.status ==='Approved'" class="btn btn-primary btn-block" @click="commentClick(purchase)">Comment</button>
                    </td>

                    
                </tr>
                </tbody>
            </table>
            <div v-if="isAddingComment">
                <form class="form-horizontal" role="form" @submit.prevent="createComment()">
                    <div class="form-group">
                        <label class="col-sm-3 control-label">Comment*</label>
                        <div class="col-sm-8">
                            <input type="text" id="firstName" v-model="newComment.text" class="form-control" autofocus>
                            <div v-if="!newComment.text && submited" class="invalid-feedback">Comment Is Required*</div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-3 control-label">Leave a grade between 1 and 5*</label>
                        <div class="col-sm-8">
                            <input type="number" id="firstName" v-model="newComment.review" class="form-control" autofocus>
                            <div v-if="!newComment.review && submited" class="invalid-feedback">grade Is Required*</div>
                        </div>
                    </div>
                    <button type="submit" class="btn btn-success btn-block">Confirm</button>
                    <button type="button" class="btn btn-secondary btn-block" @click="cancelClicked">Cancel</button>
                </form>
            </div>
        </div>
    </div>
</div>
</template>
<script>
import axios from 'axios';
import { error } from 'jquery';

export default{
    name: 'UserInfo',
    data(){
        return{
            selected: null,
            updatingUser:false,
            newUser: {
                    username:'',
                    password:'',
                    firstname:'',
                    lastname:'',
                    birthday:'',
                    gender:'',
                    role: '',
                    purchases: [],
                    cart: [],
                    factory: null,
                    points: 0,
                    customerType: null
            },
            searchFilters: {
                username: '',
                firstname: '',
                lastname: ''
            },
            sortBy: 'username',
            sortFrom: 'asc',
            filt: {
                userRole: '',
                customerType: ''
            },
            submited: false,
            isUserAdministrator: false,
            isUserCustomer: false,
            allUsers: null,
            filteredUsers: [],
            newComment:{
                factory: null,
                user: null,
                text: '',
                review: 0,
                status: 'Pending'
            },
            isAddingComment: false,
            selectedPurches: null,
            submited: false,
            purchases: [],
            filteredPurchases: [],
            searchFilters: {
                factoryName: '',
                minPrice: 0,
                maxPrice: 0,
                minDate: null,
                maxDate: null
            },
            sortBy: 'factoryName',
            sortFrom: 'asc',
            blockedUser: null
        }
    },
    mounted(){
        this.getUser();
        this.getAllUsers();
        
    },
    methods:{
        getPurceses(){
            axios.get('http://localhost:4000/purchases').then(responce=>{
                this.purchases = responce.data;
                this.sortPurcheser();
            })
        },
        blockClick(user){
            this.blockedUser = user;
            this.blockedUser.blocked = true;

            this.updateBlockUser();
        },
        updateBlockUser(){
            axios.put(`http://localhost:4000/users/${this.blockedUser.username}`, this.blockedUser).then(responce =>{
                this.getAllUsers();
            }).catch(error =>{
                console.error("Greska pri updejtu usera", error);
            })
        },
        sortPurcheser(){
            let all = this.purchases.filter(p => p.customer.username === this.selected.username);
            if(this.searchFilters.factoryName){
                all =all.filter(p => p.factory.name.toLowerCase().includes(this.searchFilters.factoryName))
            }
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
                if(this.sortBy ==='factoryName'){
                    sortLike = a.factory.name.toLowerCase().localeCompare(b.factory.name.toLowerCase());
                }else if(this.sortBy === 'price'){
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
        commentClick(purchase){
            this.selectedPurches = purchase;
            this.isAddingComment = true;
        },
        cancelClick(){
            this.isAddingComment = false;
            this.defaultComment();
        },
        editUserCancel(){
            this.updatingUser = false;
            this.resetNewUser();
        },
        defaultComment(){
            this.newComment = {
                factory: null,
                user: null,
                text: '',
                review: 0,
                status: 'Pending'
            }
        },
        cancelPurchase(purchase){
            this.selectedPurches = purchase
            this.selectedPurches.status = 'Canceled'
            this.selectedPurches.chocolates.forEach(chocolate => {
                const i = this.selectedPurches.chocolates.findIndex(c => c.name === chocolate.name)
                this.selectedPurches.factory.chocolates[i].quantity += chocolate.quantity;
            });
            axios.put(`http://localhost:4000/factories/${this.selectedPurches.factory.id}`, this.selectedPurches.factory).then(responce => {
                console.log("izmenio stock fabrike")
                this.selected.points -=  Math.round((this.selectedPurches.price/1000) *133 * 4)
                if(this.selected.points < 0){
                    this.selected.points = 0;
                }             
                axios.put(`http://localhost:4000/users/${this.selected.username}`, this.selected).then(responce =>{
                    this.getUser();
                    this.updatingUser = false;
                    this.resetNewUser();
                    this.updatePurhcase();
                }).catch(error =>{
                    console.error("Greska pri updejtu usera", error);
                })
                }).catch(error =>{
                    console.error("Error while updationg a factory", error);
                })
        },
        
        createComment(){
            this.submited = true;
            if(this.newComment.text && this.newComment.review && this.newComment.review > 0 && this.newComment.review <6){
                this.newComment.factory = this.selectedPurches.factory;
                this.newComment.user = this.selected;
                axios.post('http://localhost:4000/comments', this.newComment).then(responce =>{
                    console.log("Uspesno dodat komentar");
                    this.isAddingComment = false;
                    this.defaultComment();
                    //dodaj da ne moze da komentrise
                })
            }
        },
        updatePurhcase(){
            axios.put(`http://localhost:4000/purchases/${this.selectedPurches.id}`, this.selectedPurches).then(responce =>{
                
            }).catch(error=>{
                console.error("Greska pri izmeni kupovine", error);
            })
        },
        getUser(){
            const selectedId = this.$route.params.id;
            axios.get(`http://localhost:4000/users/${selectedId}`).then(responce =>{
                this.selected = responce.data;
                localStorage.setItem('user', JSON.stringify(this.selected))
                if(this.selected.role === 'Administrator'){
                    this.isUserAdministrator = true;
                }
                if(this.selected.role === 'Customer'){
                    this.isUserCustomer = true;
                }
                this.getPurceses();
            }).catch(error =>{
                console.error("Error geting user by id");
            });
        },
        getAllUsers(){
            axios.get('http://localhost:4000/users').then(responce =>{
                this.allUsers = responce.data;
                this.sortAndFilter();
            }).catch(error=>{
                console.error("greska pri ucitavanju fabrika");
            });
        },
        sortAndFilter(){
            let all = this.allUsers;
            if(this.searchFilters.username){
                all = all.filter(u => u.username.toLowerCase().includes(this.searchFilters.username.toLowerCase()));
            }
            if(this.searchFilters.firstname){
                all = all.filter(u => u.firstname.toLowerCase().includes(this.searchFilters.firstname.toLowerCase()));
            }
            if(this.searchFilters.lastname){
                all = all.filter(u => i.lastname.toLowerCase().includes(this.searchFilters.lastname.toLowerCase()));
            }

            if(this.filt.userRole){
                all = all.filter(u => u.role === this.filt.userRole);
            }
            if(this.filt.customerType){
                all = all.filter(u => u.customerType === this.filt.customerType);
            }
            all = all.slice().sort((a,b) => {
                let sortLike = 0;
                if(this.sortBy === 'username'){
                    sortLike = a.username.toLowerCase().localeCompare(b.username.toLowerCase());
                }else if(this.sortBy === 'firstname'){
                    sortLike = a.firstname.toLowerCase().localeCompare(b.firstname.toLowerCase());
                }else if(this.sortBy === 'lastname'){
                    sortLike = a.lastname.toLowerCase().localeCompare(b.lastname.toLowerCase());
                }else if(this.sortBy === 'points'){
                    sortLike = a.points - b.points;
                }
                if(this.sortFrom === 'desc'){
                    sortLike = sortLike * (-1);
                }
                return sortLike;
            });
            this.filteredUsers = all;
            console.log("zavrsio sam filtriranje");
        },
        editUserClick(){
            this.updatingUser = true;
            this.newUser = {...this.selected}
        },
        validate(){
            this.submited = true;
            if(this.newUser.firstname && this.newUser.lastname && this.newUser.username && this.newUser.password && this.newUser.birthday && this.newUser.gender){
                this.updateUser();
            }
        },
        updateUser(){
            axios.put(`http://localhost:4000/users/${this.selected.username}`, this.newUser).then(responce =>{
                this.getUser();
                this.updatingUser = false;
                this.resetNewUser();
            }).catch(error =>{
                console.error("Greska pri updejtu usera", error);
            })
        },
        resetNewUser(){
            this.newUser = {
                username:'',
                password:'',
                firstname:'',
                lastname:'',
                birthday:'',
                gender:'',
                role: '',
                purchases: [],
                cart: [],
                factory: null,
                points: 0,
                customerType: null
            }
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
        }
        
    }
    
}
</script>
<style>
.navbar{
    width: 97%;
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
.filters{
    margin-bottom: 25px;
}
</style>