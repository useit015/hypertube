<template>
    <nav class="navbar">
        <v-toolbar color="grey darken-2" dark class="elevation-0 px-3">
            <v-layout align-center justify-space-around>
                <nuxt-link to="/" class="px-4">
                    <v-toolbar-title class="text-uppercase grey--text">
                        <span>H</span>
                        <span class="font-weight-light logo">ypertube</span>
                    </v-toolbar-title>
                </nuxt-link>
                <v-spacer></v-spacer>
                <v-text-field
                    v-if="authenticated"
                    hide-details
                    append-icon="search"
                    single-line
                    rounded
                    outlined
                    class="nav_search"
                    v-model="query"
                    @keyup.13="searchMovie"
                    @change="clearSearch"
                ></v-text-field>
                <v-spacer></v-spacer>
                <v-btn v-if="!authenticated" @click="changeLange('fr')" icon>FR</v-btn>
                <v-btn v-if="!authenticated" @click="changeLange('en')" icon>EN</v-btn>
                <v-menu v-if="authenticated" offset-y>
                    <template v-slot:activator="{ on }">
                        <v-avatar v-on="on">
                            <img :src="`https://hypertube.tk${user.image}`" style="width: 36px; height: 36px;" />
                        </v-avatar>
                    </template>
                    <v-list>
                        <v-list-item to="/profile" nuxt>
                            <v-btn icon>
                                <v-icon>account_circle</v-icon>
                            </v-btn>
                            <v-list-item-title>{{ user.username }}</v-list-item-title>
                        </v-list-item>
                        <v-list-item @click="logout">
                            <v-btn icon>
                                <v-icon>exit_to_app</v-icon>
                            </v-btn>
                            <v-list-item-title>Logout</v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-menu>
            </v-layout>
        </v-toolbar>
    </nav>
</template>

<script>
import axios from 'axios'
import { mapGetters, mapActions } from 'vuex'
export default {
    name: 'Navbar',
    data: () => ({
        query: ''
    }),
    computed: {
        ...mapGetters(['authenticated']),
        ...mapGetters(['user'])
    },
    methods: {
        ...mapActions({
            out: 'logout'
        }),
        async logout() {
            try {
                const url = `https://hypertube.tk/api/users/logout`
                const token = localStorage.getItem('token')
                const headers = { Authorization: `jwt ${token}` }
                const res = await axios.get(url, { headers })
                if (res.data.ok) this.out()
                this.$router.push('sign')
            } catch (err) {
                console.log('problem with -->', err)
            }
        },
        searchMovie() {
            this.$bus.$emit('searchMovie', this.query)
        },
        clearSearch() {
            if (!this.query) {
                this.$bus.$emit('searchMovie', this.query)
            }
        },
        changeLange(lang) {
            if (lang != this.$i18n.locale) {
                this.$i18n.locale = lang
                this.$bus.$emit('langChange')
            }
        }
    }
}
</script>

<style>
.navbar {
    z-index: 3;
    width: 100vw;
    position: fixed;
}
.logo {
    margin-left: -3px;
    letter-spacing: 1px;
}
.nuxt-link-active {
    text-decoration: none;
}
.nav_search > .v-input__control > .v-input__slot > .v-input__append-inner {
    margin-top: 0.45rem !important;
    margin-right: -0.35rem !important;
}
.nav_search > .v-input__control > .v-input__slot {
    height: 2.4rem !important;
    min-height: 2.4rem !important;
    max-width: 30vw !important;
    overflow: hidden;
}
</style>
