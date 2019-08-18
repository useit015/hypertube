<template>
<div v-if="loaded" class="user">
    <div v-if="user">
        <h1>{{user.firstName}}</h1>
        <h1>{{user.lastName}}</h1>
        <h1>{{user.username}}</h1>
        <img :src="user.image" />
    </div>
    <div v-else>
        <h1>User not found</h1>
    </div>
</div>
<loader v-else/>
</template>

<script>
    import loader from '@/components/loader';
    import { mapGetters } from "vuex";
    export default {
        //middleware: "authenticated",
        components: {
            loader
        },
        data: () => ({
            loaded: false
        }),
        computed: {
            ...mapGetters(['user'])
        },
        async created() {
            this.loaded = true
        },
    }
</script>
<style>
.user {
    margin-top: 64px;
}
</style>
