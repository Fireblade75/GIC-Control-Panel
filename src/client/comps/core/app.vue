<template>
    <div>
        <Header />
        <main class="container">
            <router-view></router-view>
        </main>
    </div>
</template>

<script>
    import Header from './header'
    export default {
        name: "App",
        components: {
            "Header": Header,
        }
    }
</script>