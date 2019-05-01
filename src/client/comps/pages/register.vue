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
            <AlertBox v-bind:message="error.message" 
                v-bind:level="error.level" 
                offset="offset-sm-2 col-sm-10" 
                v-on:closeAlert="closeError" />
            <div class="row">
                <div class="offset-sm-2 col-sm-10">
                    <button type="submit" v-on:click.prevent="submit" class="btn btn-primary col-sm-3">Register</button>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
    import AlertBox from '../core/alert-box'

    export default {
        name: "Register",
        components: {
            "AlertBox": AlertBox,
        },
        data: function() {
            return {
                username: '',
                password: '',
                fullName: '',
                error: {
                    message: '',
                    level: ''
                }
            }
        },
        methods: {
            submit: function(event) {
                if(!this.username || !this.password || !this.fullName) {
                    this.error = {
                        message: 'Some fields are empty',
                        level: 'warning'
                    }
                    return
                }

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
                        res.json().then((obj) => {
                            this.password = ''
                            if(obj.error) {
                                this.error.level = 'error'
                                switch(obj.error) {
                                    case 'username_taken':
                                        this.error.message = 'This email address is already used'
                                        break
                                    default:
                                        this.error.message = obj.error
                                }
                            }
                        })
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