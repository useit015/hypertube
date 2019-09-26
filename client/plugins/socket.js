import Vue from 'vue'
import io from 'socket.io-client'
import VueSocketIOExt from 'vue-socket.io-extended'

const socket = io('ws://104.197.251.98')

export default ({ store }) => {
    const options = {
        store,
        actionPrefix: 'ws_',
        mutationPrefix: 'ws_'
    }
    Vue.use(VueSocketIOExt, socket, options)
}
