<template>
<div class="user">
    <div v-if="user">
        <h1>{{user.firstName}}</h1>
        <h1>{{user.lastName}}</h1>
        <h1>{{user.username}}</h1>
    </div>
    <div v-else>
        <h1>User not found</h1>
    </div>
</div>
</template>

<script>
    import axios from "axios";

    const fetchUser = async (username) => {
        const res = await axios.get(`https://hypertube.tk/api/users/user/${username}`)
        if (!res.data.err) {
            return res.data
        }
        else {
            return null
        }
    }
    export default {
        middleware: "authenticated",
        data: () => ({
                user: null
        }),
        async created() {
            const res = await fetchUser(this.$route.params.username)
            this.user = res
            console.log(this.user)
        }
    }
</script>
<style>
.user {
    margin-top: 64px;
}
</style>
