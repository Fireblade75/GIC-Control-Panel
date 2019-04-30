<template>
    <div>
        <h2>Login</h2>
        <form>
            <div class="form-group row">
                <label for="login-email" class="col-sm-2 col-form-label">Email address</label>
                <div class="col-sm-10">
                    <input type="email" class="form-control" id="login-email" v-model="username" placeholder="name@example.com">
                </div>
            </div>
            <div class="form-group row">
                <label for="login-password" class="col-sm-2 col-form-label">Password</label>
                <div class="col-sm-10">
                    <input type="password" class="form-control" id="login-password" v-model="password" placeholder="password">
                </div>
            </div>
            <div class="row">
                <div class="offset-sm-2 col-sm-10">
                    <button type="submit"  v-on:click.prevent="submit" class="btn btn-primary col-sm-3">Login</button>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
    export default {
        name: "Login",
        data: function() {
            return {
                username: '',
                password: ''
            }
        },
        methods: {
            submit: function(event) {
                fetch('/api/users/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        username: this.username,
                        password: this.password
                    })
                })
                .then(res => res.json())
                .then(res => {
                    if (res.error) {
                        console.error(res.error)
                    } else {
                        this.$store.commit('setUser', res)
                        this.$router.push('/teams')
                    }
                })
            }
        }
    }
</script>

<style>
    
</style>
