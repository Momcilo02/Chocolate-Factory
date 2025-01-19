<template>
    <div class="container">
      <h1 class="font-weight-bolder display-4 ">Add New Factory</h1>
      <form @submit.prevent="validate" class="form-container" novalidate>
        <div class="form-group">
          <label for="name">Name:</label>
          <input type="text" v-model="factory.name" class="form-control" required>
          <div v-if="!factory.name && submited" class="invalid-feedback">Name is required*</div>
        </div>
        <div class="form-group">
          <label for="street">Street:</label>
          <input type="text" v-model="factory.location.street" class="form-control" required>
          <div v-if="!factory.location.street && submited" class="invalid-feedback">Street is required*</div>
        </div>
        <div class="form-group">
          <label for="city">City:</label>
          <input type="text" v-model="factory.location.city" class="form-control" required>
          <div v-if="!factory.location.city && submited" class="invalid-feedback">City is required*</div>
        </div>
        <div class="form-group">
          <label for="state">State:</label>
          <input type="text" v-model="factory.location.state" class="form-control" required>
          <div v-if="!factory.location.state && submited" class="invalid-feedback">State is required*</div>
        </div>
        <div class="form-group">
          <label for="longitude">Longitude:</label>
          <input type="number" v-model="factory.location.longitude" class="form-control" required>
          <div v-if="!factory.location.longitude && submited" class="invalid-feedback">Longitude is required*</div>
        </div>
        <div class="form-group">
          <label for="latitude">Latitude:</label>
          <input type="number" v-model="factory.location.latitude" class="form-control" required>
          <div v-if="!factory.location.latitude && submited" class="invalid-feedback">Latitude is required*</div>
        </div>
        <div class="form-group">
          <label for="workHours">Work Hours:</label>
          <input type="text" v-model="factory.workHours" class="form-control" required>
          <div v-if="!factory.workHours && submited" class="invalid-feedback">Work Hours is required*</div>
        </div>
        <div class="form-group">
          <label>Logo:</label>
          <input type="file" @change="fileAdded" class="form-control">
        </div>
        <h3 v-if="selectedMenager">Selected menager: --{{ selectedMenager.username }}--:{{ selectedMenager.firstname }} {{ selectedMenager.lastname }} </h3>
        <div class="form-group" v-if="!noMenagers">
          
          <h3 v-if="!selectedMenager">Select on of the menagers belows</h3>
          <table class="table">
            <thead>
              <tr>
                <th scope="col">Username</th>
                <th scope="col">First Name</th>
                <th scope="col">Last Name</th>
                <th scope="col">Assign </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="menager in freeMenagers" :key="menager.username">
                <td>{{ menager.username }}</td>
                <td>{{ menager.firstname }}</td>
                <td>{{ menager.lastname }}</td>
                <td><button type="button" class="btn btn-primary btn-block" @click="assign(menager)">Assign</button></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="form-group" v-if="noMenagers && addedMenager === false">
          <form class="form-horizontal" role="form" @submit.prevent="validateUser">
                <h2>No, Menagers Available, Registration New Menager</h2>
                <div class="form-group">
                    <label for="firstName" class="col-sm-3 control-label">First Name*</label>
                    <div class="col-sm-9">
                        <input type="text" id="firstName" v-model="newUser.firstname" class="form-control" autofocus>
                    </div>
                </div>
                <div class="form-group">
                    <label for="lastName" class="col-sm-3 control-label">Last Name*</label>
                    <div class="col-sm-9">
                        <input type="text" id="lastName" v-model="newUser.lastname" class="form-control" autofocus>
                    </div>
                </div>
                <div class="form-group">
                    <label for="username" class="col-sm-3 control-label">Username*</label>
                    <div class="col-sm-9">
                        <input type="text" id="username" v-model="newUser.username" class="form-control" autofocus>
                    </div>
                </div>
                <div class="form-group">
                    <label for="password" class="col-sm-3 control-label">Password*</label>
                    <div class="col-sm-9">
                        <input type="password" id="password" v-model="newUser.password" class="form-control">
                    </div>
                </div>
                <div class="form-group">
                    <label for="password2" class="col-sm-3 control-label">Confirm Password*</label>
                    <div class="col-sm-9">
                        <input type="password" id="password2" class="form-control">
                    </div>
                </div>
                <div class="form-group">
                    <label for="birthDate" class="col-sm-3 control-label">Date of Birth*</label>
                    <div class="col-sm-9">
                        <input type="date" id="birthDate" v-model="newUser.birthday" class="form-control">
                    </div>
                </div>
                <div class="form-group">
                    <label for="gender" class="col-sm-3 control-label">Gender*</label>
                    <div class="col-sm-9">
                        <select data-mdb-select-init v-model="newUser.gender" id="gender">
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                        <option value="Other">Other</option>
                  </select>
                    </div>
                    
                </div>
                 
                 <!-- /.form-group -->
                <div class="form-group">
                    <div class="col-sm-9 col-sm-offset-3">
                        <span class="help-block">*Required fields</span>
                    </div>
                </div>
                <button type="submit" class="btn btn-primary btn-block">Register</button>
            </form> <!-- /form -->
        </div>
        <div class="button-group">
          <button type="submit" class="btn btn-outline-primary btn-rounded">Save</button>

        </div>
      </form>
  
      
    </div>
  </template>
<script>
import axios from 'axios';
import { error } from 'jquery';
export default{
    name: 'AddFactoryView',
    data(){
        return{
            factory:{
                  name: '',
                  location: {
                      street: '',
                      city:'',
                      state: '',
                      longitude: '',
                      latitude: ''
                  },
                  workHours: '',
                  logo: '',
                  rating: '',
                  chocolates: [],
                  manager: null,
                  status: ''
                
            },
            newUser: {
                username:'',
                password:'',
                firstname:'',
                lastname:'',
                birthday:'',
                gender:'',
                role: 'Menager',
                purchases: [],
                cart: [],
                factory: null,
                points: 0,
                customerType: null,
                blocked: false
            },
            submited: false,
            freeMenagers: [],
            selectedMenager: null,
            noMenagers: false,
            correctNewUser: false,
            addedMenager: false
        };
    },
    mounted(){
        this.getFreeMenagers();
    },
    methods:{
        validate(){
            this.submited = true;
            if(this.factory.name && this.factory.location.street && this.factory.location.city && this.factory.location.state && this.factory.location.longitude && this.factory.location.latitude && this.factory.workHours && this.selectedMenager){
                this.createFactory();
            }
        },
        validateUser(){
          this.submited = true;
            if(this.newUser.username && this.newUser.password && this.newUser.firstname && this.newUser.lastname && this.newUser.birthday && this.newUser.gender){
                this.selectedMenager = {...this.newUser}
                axios.post('http://localhost:4000/users/register',this.newUser).then(response => {
                    console.log("usp reg", response);
                    this.noMenagers = false
                this.getFreeMenagers();
                }).catch(error => {
                    console.error("Greska pri registraciji", error)
                });
                
            }
        },
        getFreeMenagers(){
            axios.get('http://localhost:4000/users').then(responce => {
              this.freeMenagers = responce.data;
              let all = this.freeMenagers;
              all =all.filter(u => u.role === 'Menager');
              all = all.filter(u => u.factory === null);
              this.freeMenagers = all;
              console.log(all);
              if(this.freeMenagers.length === 0){
                  this.noMenagers=true;
              }

              
            })
        },
        assign(menager){
          this.selectedMenager = {...menager}
        },
        createFactory(){
              this.factory.menager = {...this.selectedMenager};
              this.selectedMenager.factory = {...this.factory};
              axios.put(`http://localhost:4000/users/${this.selectedMenager.username}`, this.selectedMenager).then(responce =>{
                console.log("uspesno dodavanje menadzera");
            }).catch(error => {
              console.error("Greska pri asajnovanju usera", error);
            })
            
            
            axios.post('http://localhost:4000/factories', this.factory).then(response => {
                this.$router.push({name: 'Factories'});
            }).catch(error => {
                console.error("Greska pri dodavanju nove fabrike", error);
            });
        },
        fileAdded(event){
            const filepath = event.target.files[0];
            this.factory.logo = filepath ? filepath.name : '';
        }
    }
}


</script>