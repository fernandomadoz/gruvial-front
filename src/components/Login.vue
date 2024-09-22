<template>

  <v-card
    class="mx-auto"
    max-width="644"
    outlined
  >

  
    <v-img
      class="white--text align-end"
      width="100%"
      src="https://img.freepik.com/free-vector/smart-factory-working-person-using-wireless-technology-control_1150-43092.jpg?w=2000"
    ></v-img>
      <v-form
      ref="form"
      v-model="valid"
      lazy-validation
      @submit.prevent="login"
   >

         <v-text-field
            v-model="email"
            :rules="emailRules"
            label="E-mail"
            required
         ></v-text-field>

          <v-text-field
            v-model="password"
            :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
            :passwordRules="[passwordRules.required, passwordRules.min]"
            :type="show1 ? 'text' : 'password'"
            name="input-10-1"
            label="Normal with hint text"
            hint="At least 8 characters"
            counter
            @click:append="show1 = !show1"
          ></v-text-field>

         <v-btn
            color="yellow"
            class="mr-4"
            @click="login"
         >
            Ingresar
         </v-btn>
         <v-alert v-if="error" type="error">{{ result_login }}</v-alert>

      </v-form>
   </v-card>
</template>


<script setup>
   import auth from "@/logic/auth";
   import { ref } from "vue";


  let valid = true;
  let error = false;
  let show1 = false;
  let password = '123456';
  const passwordRules = {
      required: value => !!value || 'Required.',
      min: v => v.length >= 8 || 'Min 8 characters',
      emailMatch: () => (`The email and password you entered don't match`),
  };
  let email = 'fernandomadoz@hotmail.com';
  const emailRules = [
    v => !!v || 'E-mail is required',
    v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
  ];
  let result_login = null;
        
  const login = () => {
        console.log(222);       

        error = true;
        result_login = auth.login(email, password);
        console.log(result_login);       
        let token = result_login['data']['access_token'];
        console.log(token);       
        const user_id = result_login['data']['user_id'];    
        const name = result_login['data']['name'];    
        auth.setUserLogged(email, true, token,name, user_id);  
        console.log(token);       
        //router.push("/");
        
  };

  const validate = () => {
    //refs.form.validate();
    login();
  };

/*
validate () {
this.$refs.form.validate();
this.login();
},
async traerUser () {
    try {
    this.result_login = 'cargando';
    this.result_login = await auth.laravelUser();
    } catch (error) {
    this.error = true;
    this.result_login = error;            
    }        
},
reset () {
this.$refs.form.reset()
},
resetValidation () {
this.$refs.form.resetValidation()
},
*/
</script>