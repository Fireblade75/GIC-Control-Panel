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
            <ul class="navbar-nav ml-auto">
                <li class="nav-item active">
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
import { mapGetters } from "vuex";
export default {
    name: "Header",
    computed: mapGetters({
        page: "getPage"
    })
};
</script>