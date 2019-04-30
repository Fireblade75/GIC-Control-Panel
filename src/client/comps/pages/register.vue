<template>
    <div>
        <h2>Register</h2>
        <form>
            <div class="form-group row">
                <label for="register-name" class="col-sm-2 col-form-label">Full Name</label>
                <div class="col-sm-10">
                    <input type="text" class="form-control" id="register-name" v-model="fullName" placeholder="John Doe">
                </div>
            </div>
            <div class="form-group row">
                <label for="register-email" class="col-sm-2 col-form-label">Email address</label>
                <div class="col-sm-10">
                    <input type="email" class="form-control" id="register-email" v-model="username" placeholder="name@example.com">
                </div>
            </div>
            <div class="form-group row">
                <label for="register-password" class="col-sm-2 col-form-label">Password</label>
                <div class="col-sm-10">
                    <input type="password" class="form-control" id="register-password" v-model="password" placeholder="password">
                </div>
            </div>
            <div class="row">
                <div class="offset-sm-2 col-sm-10">
                    <button type="submit" v-on:click.prevent="submit" class="btn btn-primary col-sm-3">Register</button>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
    export default {
        name: "Register",
        data: function() {
            return {
                username: '',
                password: '',
                fullName: ''
            }
        },
        methods: {
            submit: function(event) {
                fetch('/api/users/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        username: this.username,
                        password: this.password,
                        fullName: this.fullName
                    })
                })
                .then(res => {
                    const status = res.status
                    if(status == 201) {
                        this.$store.commit('setUsername', this.username)
                        this.$router.push('/welcome')
                    } else {
                        res.json().then(obj => {
                            this.password = ''
                            if(obj.error) {
                                console.error(obj.error)
                            }
                        })
                    }
                })
            }
        }
    }
</script>