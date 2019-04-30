<template>
    <div>
        <h2>Register</h2>
        <form>
            <div class="form-group row">
                <label for="register-name" class="col-sm-2 col-form-label">Full Name</label>
                <div class="col-sm-10">
                    <input type="text" class="form-control" id="register-name" placeholder="John Doe">
                </div>
            </div>
            <div class="form-group row">
                <label for="register-email" class="col-sm-2 col-form-label">Email address</label>
                <div class="col-sm-10">
                    <input type="email" class="form-control" id="register-email" placeholder="name@example.com">
                </div>
            </div>
            <div class="form-group row">
                <label for="register-password" class="col-sm-2 col-form-label">Password</label>
                <div class="col-sm-10">
                    <input type="password" class="form-control" id="register-password" placeholder="password">
                </div>
            </div>
            <div class="row">
                <div class="offset-sm-2 col-sm-10">
                    <button type="submit" class="btn btn-primary col-sm-3">Register</button>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
    export default {
        name: "Register",
    }
</script>