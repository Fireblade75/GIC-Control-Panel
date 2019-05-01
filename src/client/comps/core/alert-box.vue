<template>
    <div class="form-group row" v-if="message">
        <div v-bind:class="[offset]">
            <div class="alert alert-warning bm-0" v-bind:class="[alertLevel, 'alert', 'bm-0']">
                {{ message }}
                <button type="button" class="close" v-on:click.prevent="closeError" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "AlertBox",
        props: {
            message: String,
            level: String,
            offset: String
        },
        computed: {
            alertLevel: function() {
                switch(this.level) {
                    case 'error': return 'alert-danger'
                    case 'danger': return 'alert-danger'
                    case 'warning': return 'alert-warning'
                    case 'success': return 'alert-success'
                    default: return 'alert-info'
                }
            }
        },
        methods: {
            closeError: function(event) {
                this.message = ''
            }
        }
    }
</script>

