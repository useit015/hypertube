<template>
    <v-app dark class="app">
        <navbar />
        <v-content>
            <v-container fluid class="py-0 px-0">
                <nuxt />
            </v-container>
        </v-content>
    </v-app>
</template>

<script>
import axios from 'axios'
import { mapActions } from 'vuex'
import navbar from '@/components/navbar'

export default {
    components: {
        navbar
    },
    data() {
        return {}
    }
}
</script>

<style>
body {
    overflow: hidden;
}

.app {
    background: #424242;
    background: -webkit-linear-gradient(#424242 0%, #212121 100%);
    background: linear-gradient(#424242 0%, #212121 100%) !important;
}

.cta_btn {
    border: 1px solid rgba(100, 214, 196, 0.5) !important;
    height: 40px !important;
    transform: scale(1.1);
    letter-spacing: 2px;
    font-weight: 300;
}

.main_container {
    margin-top: 64px;
}

.page-enter-active,
.page-leave-active {
    transition: opacity 0.5s;
}

.page-enter,
.page-leave-to {
    opacity: 0;
}

@media all and (max-width: 1000px) {
    .main_container {
        margin-top: 56px;
    }
}
</style>
