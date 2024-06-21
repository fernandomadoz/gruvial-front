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
            @click="validate"
         >
            Ingresar
         </v-btn>

         <v-btn
            color="yellow"
            class="mr-4"
            @click="traerUser"
         >
            User
         </v-btn>
         <v-alert v-if="error" type="error">{{ result_login }}</v-alert>

      </v-form>
   </v-card>
</template>


<script>
   import auth from "@/logic/auth";

   export default {
     
    data: () => ({
      valid: true,
      error: false,
      show1: false,
      password: '123456',
      passwordRules: {
         required: value => !!value || 'Required.',
         min: v => v.length >= 8 || 'Min 8 characters',
         emailMatch: () => (`The email and password you entered don't match`),
      },
      email: 'fernandomadoz@hotmail.com',
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      ],
      result_login: null
    }),

    methods: {
      async login() {
         try {
            this.result_login = await auth.login(this.email, this.password);
            
            
            // Con Login Laravel 5.4 (Laravel Passport)
            //const token = this.result_login['data']['success']['token'];            

            // Con Login Laravel 9 (Sanctum)
            const token = this.result_login['data']['access_token'];
            const name = this.result_login['data']['name'];
            const user_id = this.result_login['data']['user_id'];
            const rol_de_usuario_id = this.result_login['data']['rol_de_usuario_id'];

            auth.setUserLogged(this.email, true, token, name, user_id, rol_de_usuario_id); 
                    
            this.$router.push("/");
         } catch (error) {
            this.error = true;
            this.result_login = error;
         }
      },
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
    },
   }
</script>