<template>
    <section class="vh-100">
  <div class="container-fluid">
    <div class="row">
      <div class="col-sm-6 text-black">

        <div class="d-flex align-items-center h-custom-2 px-5 ms-xl-4 mt-5 pt-5 pt-xl-0 mt-xl-n5">

          <form style="width: 23rem;" @submit.prevent="login">

            <h3 class="fw-normal mb-3 pb-3" style="letter-spacing: 1px;">Log in</h3>

            <div data-mdb-input-init class="form-outline mb-4">
              <input type="text" id="form2Example18" class="form-control form-control-lg"  required v-model="username"/>
              <label class="form-label" for="form2Example18">Username</label>
            </div>

            <div data-mdb-input-init class="form-outline mb-4">
              <input type="password" id="form2Example28" class="form-control form-control-lg" required v-model="password" />
              <label class="form-label" for="form2Example28">Password</label>
            </div>

            <div class="pt-1 mb-4">
              <button data-mdb-button-init data-mdb-ripple-init class="btn btn-primary btn-block" type="button" @click="login">Login</button>
            </div>
            <p v-if="errorMsg">{{ errorMsg }}</p>
            <p>Don't have an account? <RouterLink to="/register"> Register here!</RouterLink></p> 

          </form>
        </div>
      </div>
    </div>
  </div>
</section>
</template>
<script>
import axios from 'axios';
import { RouterLink } from 'vue-router';
export default{
    name :'Login',
    data(){
        return{
            username : '',
            password: '',
            errorMsg: ''
        };
    },
    methods:{
        login(){
            axios.post('http://localhost:4000/users/login', {
                username: this.username,
                password: this.password
            }).then(response =>{
                if(response.data.blocked === true){
                  this.errorMsg = 'Your account has been blocked';
                }else{
                  console.log("uspesan login", response);
                  this.errorMsg ='';
                  console.log(response.data.role)
                  localStorage.setItem('userRole', JSON.stringify(response.data.role));
                  localStorage.setItem('user', JSON.stringify(response.data));
                  this.$router.push({name: 'Factories'});
                }
                
            }).catch(error => {
                console.error("Greska pri logovanju", error);
                this.errorMsg = 'Incorect username or password';
            });
        },
        goToRegister(){
            this.$router.push({name: 'Register'});
        }
    }
};
</script>
<style scoped>

</style>
