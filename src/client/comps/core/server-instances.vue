<template>
    <div class="form-group row">
        <label class="col-sm-2 col-form-label">Server {{serverId}}</label>
        <div class="col-sm-8 mb-1">
            <select v-model="selectedItem" class="form-control">
                <option v-for="(item, index) in gameList" v-bind:key="index">
                    {{ item }}
                </option>
            </select>
        </div>
        <div class="col-sm-2 mb-1">
            <button type="submit" v-on:click.prevent="apply" class="btn btn-primary btn-block">Apply</button>
        </div>
    </div>
</template>

<script>

    export default {
        name: "Instance",
        props: {
            serverId: Number,
            games: {
                type: Array,
                default: ['---']
            },
            selectedGame: {
                type: String,
                default: '---'
            }
        },
        data: function() {
            return {
                selectedItem: this.selectedGame
            }
        },
        computed: {
            gameList: function() {
                return ['---', ...this.games ]
            }
        },
        methods: {
            apply: function(event) {
                
            }
        }
    }
</script>

