<template>
    <div>
        <div v-if="user">
            <h3 v-for="usr in user" :key="usr.id_cliente">Hi, {{ usr.p_nombre }} {{ usr.p_apellido }} </h3> 
        </div>
        <h3 v-if="!user"> You are not logged in </h3> 
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    name: 'Home',
    computed: {
        ...mapGetters(['user'])
    }
}
</script>