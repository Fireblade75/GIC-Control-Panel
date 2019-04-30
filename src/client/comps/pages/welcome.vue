<template>
    <div>
        <h2>Welcome</h2>
        <p>
            Your account is now active.<br/> Your username is {{username}}.
        </p>
        <button type="submit"  v-on:click.prevent="submit" class="btn mt-3 btn-primary col-sm-3">Let's Start</button>
    </div>
</template>

<script>

    export default {
        name: "Welcome",
        computed: {
            username() {
                return this.$store.getters.getUsername || 'error@example.com'
            }
        },
        methods: {
            submit: function(event) {
                this.$router.push('/login')
            }
        }
    }
</script>

<style>
    
</style>
