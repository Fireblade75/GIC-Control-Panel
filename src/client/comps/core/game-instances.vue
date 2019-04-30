<template>
    <div class="form-group row">
        <label class="col-sm-2 col-form-label">{{gameName}}</label>
        <div class="col-sm-10">
            <select v-model="selectedItem" class="form-control">
                <option v-for="(item, index) in instanceOptions" v-bind:key="index">
                    {{ item }}
                </option>
            </select>
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
            addGame: function(event) {
                
            }
        }
    }
</script>

