<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <a class="navbar-brand" href="#">Game Manager</a>
        <button
            class="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
        >
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav ml-auto" v-if="token">
                <li class="nav-item">
                    <router-link class="nav-link" to="/teams">Teams</router-link>
                </li>
                <li class="nav-item">
                    <router-link class="nav-link" to="/games">Games</router-link>
                </li>
            </ul>
            <ul class="navbar-nav ml-auto" v-else>
                <li class="nav-item">
                    <router-link class="nav-link" to="/login">Login</router-link>
                </li>
                <li class="nav-item">
                    <router-link class="nav-link" to="/register">Register</router-link>
                </li>
            </ul>
        </div>
    </nav>
</template>



<script>
export default {
    name: "Header",
    computed: {
        token() {
            return this.$store.getters.getToken
        }
    }
}
</script>

<style scoped>
    .router-link-active {
        color: rgba(0,0,0,.9) !important;
    }
</style>
