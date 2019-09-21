<template>
    <div>
        <h1>{{ movie.title }}</h1>
        <h1>{{ movie.year }}</h1>
        <p>{{ movie.description }}</p>
    </div>
</template>

<script>
import axios from 'axios'

export default {
    components: {},
    data: () => ({
        movie: {
            type: Object,
            default: () => ({})
        }
    }),
    async asyncData({ params }) {
        console.log(params)
        let url = `http://api.apiumadomain.com/movie?imdb=${params.imdb}&short=1&cb=&quality=720p,1080p,3d`
        const data = await axios.get(url)
        console.log(data)
        return { movie: data.data }
    }
}
</script>

<style></style>
