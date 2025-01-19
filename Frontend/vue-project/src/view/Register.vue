<template>
<div class="container">
            <form class="form-horizontal" role="form" @submit.prevent="validate">
                <h2>Registration</h2>
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
        </div> <!-- ./container -->
</template>
<script>
import axios from 'axios';
import { data } from 'jquery';

export default{
    name: 'Register',
    data(){
        return{
            newUser: {
                username:'',
                password:'',
                firstname:'',
                lastname:'',
                birthday:'',
                gender:'',
                role: 'Customer',
                purchases: [],
                cart: {
                    chocolates: [],
                    price: 0
                },
                factory: null,
                points: 0,
                customerType: 'Bronze',
                blocked: false
            },
            submited: false
            
        };
    },methods: {
        registerUser(){
            axios.post('http://localhost:4000/users/register',this.newUser).then(response => {
                console.log("usp reg", response);
                this.$router.push('/login');
            }).catch(error => {
                console.error("Greska pri registraciji", error)
            });
        },
        validate(){
            this.submited = true;
            if(this.newUser.username && this.newUser.password && this.newUser.firstname && this.newUser.lastname && this.newUser.birthday && this.newUser.gender){
                this.registerUser();
            }
        }
    }
};

</script>
<style scoped>
    
</style>