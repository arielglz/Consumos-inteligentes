<template>
    <form @submit.prevent="handleSubmit">
        <h3> Registro </h3>
        <div class="form-group">
            <label>Primer nombre</label>
            <input type="text" class="form-control" v-model="p_nombre" placeholder="Primer nombre" />
        </div>
        <div class="form-group">
            <label>Segundo nombre</label>
            <input type="text" class="form-control" v-model="s_nombre" placeholder="Segundo nombre" />
        </div>
        <div class="form-group">
            <label>Primer Apellido</label>
            <input type="text" class="form-control" v-model="p_apellido" placeholder="Primer apellido" />
        </div>
        <div class="form-group">
            <label>Segundo Apellido</label>
            <input type="text" class="form-control" v-model="s_apellido" placeholder="Segundo apellido" />
        </div>
        <div class="form-group">
            <label>Telefono</label>
            <input type="tel" class="form-control" v-model="numero" placeholder="Telefono" />
        </div>
        <div class="form-group">
            <label>Email</label>
            <input type="email" class="form-control" v-model="email" placeholder="Email" />
        </div>  
        <div class="form-group">
            <label>Contraseña</label>
            <input type="password" class="form-control" v-model="password" placeholder="Contraseña" />
        </div>  
        <div class="form-group">
            <label>Confirme Contraseña</label>
            <input type="password" class="form-control" v-model="password_confirm" placeholder="Contraseña" />
        </div>  
        <button class="btn btn-primary btn-block">Registrarme</button>
    </form>
</template>

<script>
import axios from 'axios';

export default {
    name: 'Register',
    data() {
        return {
            p_nombre: '',
            s_nombre: '',
            p_apellido: '',
            s_apellido: '',
            numero: '',
            email: '',
            password: '',
            password_confirm: ''
        }
    },
    methods: {
        async handleSubmit(){
            
            const response = await axios.post('clients', {
                p_nombre: this.p_nombre,
                s_nombre: this.s_nombre,
                p_apellido: this.p_apellido,
                s_apellido: this.s_apellido,
                numero: this.numero,
                email: this.email,
                password: this.password,
                
            });

            console.log(response);
            this.$router.push('/login');

        }
    }
}
</script>