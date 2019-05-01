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
            <AlertBox 
                v-bind:message="error.message" 
                v-bind:level="error.level" 
                offset="offset-sm-2 col-sm-10"
                v-on:closeAlert="closeError" />
            <div class="row">
                <div class="offset-sm-2 col-sm-10">
                    <button type="submit"  v-on:click.prevent="submit" class="btn btn-primary col-sm-3">Login</button>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
    import AlertBox from '../core/alert-box'

    export default {
        name: "Login",
        components: {
            "AlertBox": AlertBox,
        },
        data: function() {
            return {
                username: '',
                password: '',
                error: {
                    message: '',
                    level: ''
                }
            }
        },
        methods: {
            submit: function(event) {
                if(!this.username || !this.password) {
                    this.error = {
                        message: 'Some fields are empty',
                        level: 'warning'
                    }
                    return
                }

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
                        this.error.level = 'error'
                        switch(res.error) {
                            case 'invalid_credentials':
                                this.error.message = 'Invalid Credentials'
                                break
                            default:
                                this.error.message = res.error
                        }
                    } else {
                        this.$store.commit('setUser', res)
                        this.$router.push('/teams')
                    }
                })
            },
            closeError: function(event) {
                this.error = {
                    message: '',
                    level: ''
                }
            }
        }
    }
</script>

