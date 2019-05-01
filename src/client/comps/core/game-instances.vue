<template>
    <div class="form-group row">
        <label class="col-sm-2 col-form-label">{{gameName}}</label>
        <div class="col-sm-8 mb-3">
            <select v-model="selectedItem" class="form-control">
                <option v-for="(item, index) in instanceOptions" v-bind:key="index">
                    {{ item }}
                </option>
            </select>
        </div>
        <div class="col-sm-2 mb-3">
            <button type="submit" v-on:click.prevent="apply" class="btn btn-primary btn-block">Apply</button>
        </div>
    </div>
</template>

<script>

    export default {
        name: "GameInstance",
        props: {
            gameName: String,
            instances: Number
        },
        data: function() {
            return {
                instanceOptions: ['Disabled', '1 Instance', '2 Instances']
            }
        },
        computed: {
            selectedItem: function() {
                return this.instanceOptions[this.instances]
            }
        },
        methods: {
            apply: function(event) {
                
            }
        }
    }
</script>

