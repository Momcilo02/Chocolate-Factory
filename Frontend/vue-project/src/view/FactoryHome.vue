<template>
<div class="container">
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
    <div class="filters">
        <input v-model="searchFilters.factoryName" placeholder="Enter factory name" @input="calculateRating">
        <input v-model="searchFilters.chocolateName" placeholder="Enter chocolate name" @input="calculateRating">
        <input v-model="searchFilters.location" placeholder="Enter city or country" @input="calculateRating">
        <input v-model="searchFilters.rating" placeholder="Enter factory rating" min="0" max="5" type="number" @input="calculateRating">
        <select v-model="sortBy" @change="calculateRating">
            <option value="factoryName">Factory Name</option>
            <option value="location">Location</option>
            <option value="rating">Rating</option>
        </select>

        <select v-model="sortFrom" @change="calculateRating">
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
        </select>
        <input type="checkbox" v-model="filt.isOpen" @change="calculateRating">Only open factories
        <select v-model="filt.chocolateType" @change="calculateRating">
            <option value="">All</option>
            <option value="Bar">Bar</option>
            <option value="Cooking">Cooking</option>
            <option value="Hot">Hot Chocolate</option>
        </select>
        <select v-model="filt.chocolateKind" @change="calculateRating">
            <option value="">All</option>
            <option value="Dark">Dark</option>
            <option value="Milk">Milk</option>
            <option value="White">White</option>
        </select>

    </div>
    <div class="row">
        <div class="col-md-3 col-sm-6" v-for="factory in filteredFactories" :key="factory.id" @click="goToDetails(factory.id)">
            <div class="card card-block">
                <img  class="card-logo" :src="setFactoryImageUrl(factory.logo)" :alt="factory.name">
                <h3 class="card-title mt-3 mb-3 text-primary">{{ factory.name }}</h3>
                <p class="card-text">Location: {{ factory.location.state}}, {{ factory.location.city }}, {{ factory.location.street }}</p>
                <small>Work Hours: {{ factory.workHours }}</small>
                <small>Status: {{ factory.status }}</small>
                <small>Rating: {{factory.rating}}</small>
                 
            </div>
        </div>
    
    </div>
</div>
</template>
<script>

import axios from 'axios';
import { error } from 'jquery';

export default{
    name: 'FactoryHome',
    data(){
        return{
            factories:[],
            filteredFactories:[],
            searchFilters: {
                factoryName: '',
                chocolateName: '',
                location: '',
                rating: ''
            },
            sortBy: 'factoryName',
            sortFrom: 'asc',
            filt: {
                isOpen: false,
                chocolateType: '',
                chocolateKind: ''
            },
            isUserAdmin: false,
            isUserMenager: false,
            isUserWorker: false,
            isLoggedIn: false,
            isUSerCustomer: false,
            comments: []
        }
    },
    mounted(){
        this.getFactories();
        this.checkRoles();
    },
    methods:{
        getFactories(){
            axios.get('http://localhost:4000/factories').then(response => {
                console.log("ucitao fabrike");
                this.factories = response.data;
                //this.sortAndFilter();
                
                this.getFactoryStatus();
            }).catch(error => {
                console.error("greska pri ucitavanju fabrika");
            });
        },
        getFactoryStatus(){
            const d = new Date();
            let hours = d.getHours();
            console.log("trenutno vreme:", hours)
            this.factories.forEach(factory=>{
                var times = factory.workHours.split("-")
                console.log(times[1])
                if(parseInt(times[0]) <=hours && parseInt(times[1]) >=hours){
                    factory.status = 'Open'
                }else{
                    factory.status = 'Closed'
                }
            })
            this.getFactoryRating();
        },

        setFactoryImageUrl(filepath){
            if(!filepath){
                console.error("Logo is undefined");
                return '/src/assets/factory-default.png';
            }

            const imgs = import.meta.glob('../assets/*.{jpg,png,jpeg}');
            const imgName = filepath.split('/').pop();
            for(const path in imgs){
                if(path.includes(imgName)){
                    return path.replace('../assets', '/src/assets');
                }
            }
            console.error("Error while loading a picture for chocolate");
            return '/src/assets/factory-default.png';
        },
        getFactoryRating(){
            axios.get('http://localhost:4000/comments').then(response =>{
                this.comments = response.data;
                
                this.calculateRating();
            }).catch(error=>{
                console.error("greska pri ucitavanju komentara");
            })
            
        },
        calculateRating(){
            var sum = 0;
            var i = 0;
            
            this.factories.forEach(factory =>{
                sum=0;
                i=0;
                this.comments.forEach(comment =>{
                    if(comment.factory.id === factory.id){
                        sum+= comment.review;
                        i++;
                    }
                    if(i===0 && this.sortFrom ==='asc'){
                        sum = 99;
                    }else if(i===0 && this.sortFrom ==='desc'){
                        sum = 0;
                    }
                    else{
                        sum = sum/i;
                    }
                    console.log(sum);
                    factory.rating = sum
                });
            });
            
            this.sortAndFilter();
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
        logout(){
            this.isUserAdmin = false;
            this.isUserMenager = false;
            this.isUserWorker = false;
            this.isLoggedIn = false;
            this.isUSerCustomer = false;
            localStorage.clear();
        },
        goToCart(){
            this.$router.push({name: 'Cart'})
        },
        goToDetails(fId){
            this.$router.push({name: 'Details', params:{id:fId}})
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
        goToFactiories(){
            this.$router.push({name: 'Factories'})
        },
        sortAndFilter(){
            let all = this.factories;
            if(this.searchFilters.factoryName){
                all = all.filter(f => f.name.toLowerCase().includes(this.searchFilters.factoryName.toLowerCase()));
            }
            if(this.searchFilters.chocolateName){
                all = all.filter(f => f.chocolates.some(c => c.name.toLowerCase().includes(this.searchFilters.chocolateName.toLowerCase())))
            }
            if(this.searchFilters.location){
                all = all.filter(f => f.location.city.toLowerCase().includes(this.searchFilters.location.toLowerCase()) ||
            f.name.location.state.toLowerCase().includes(this.searchFilters.location.toLowerCase()));
            }
            if(this.searchFilters.rating){
                all = all.filter(f => f.rating >= parseFloat(this.searchFilters.rating) && f.rating <=5 && f.rating>=1);
            }

            if(this.filt.isOpen){
                all = all.filter(f => f.status ==='Open');
            }
            if(this.filt.chocolateKind){
                all = all.filter(f => f.chocolates.some(c => c.kind === this.filt.chocolateKind));
            }
            if(this.filt.chocolateType){
                all = all.filter(f => f.chocolates.some(c => c.type === this.filt.chocolateType));
            }
            
            all = all.slice().sort((a, b) => {
                let sortLike = 0;
                if(this.sortBy === 'factoryName'){
                    sortLike = a.name.toLowerCase().localeCompare(b.name.toLowerCase());
                }else if(this.sortBy === 'location'){
                    sortLike = a.location.city.toLowerCase().localeCompare(b.location.city.toLowerCase())
                } else if(this.sortBy === 'rating'){
                    sortLike = a.rating - b.rating;
                }
                if(this.sortFrom === 'desc'){
                    sortLike = sortLike * (-1);
                }
                return sortLike;
            });
            all.forEach(factory => {
                if(factory.rating <1 || factory.rating > 5){
                    factory.rating = 'not rated';
                }
            });
            this.filteredFactories = all;
            console.log("zavrsio sam filtriranje");
        }
    }
}
</script>
<style scoped>
.container {
    padding: 0px;
    width: 100%;
}
.filters{
    margin-bottom: 25px;
}
.filters input{
    margin-right: 10px;
    margin-bottom: 10px;
}
.filters select{
    margin-right: 10px;
    margin-bottom: 10px;
}
h1{
    color: black;
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
}
.card-title{  
  font-size:18px;
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
  height:80px;  
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

</style>