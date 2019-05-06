<template>
    <div class="form-group row">
        <label class="col-sm-2 col-form-label">Server {{serverId}}</label>
        <div class="col-sm-5 mb-1">
            <select v-model="selectedItem" class="form-control">
                <option v-for="(item, index) in gameList" v-bind:key="index">
                    {{ item }}
                </option>
            </select>
        </div>
        <div class="col-sm-3 mb-1">
            <select v-model="selectedRegion" class="form-control">
                <option v-for="(region, index) in regions" v-bind:key="index">
                    {{ region }}
                </option>
            </select>
        </div>
        <div class="col-sm-2 mb-1">
            <button type="submit" 
                v-on:click.prevent="$emit('applyUpdate',serverId, selectedItem, selectedRegion)" 
                class="btn btn-primary btn-block">Apply</button>
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
            slots: Array
        },
        data: function() {
            const slot = this.slots.find(slot => slot.id == this.serverId)
            return {
                selectedItem: slot ? slot.game : '---',
                selectedRegion: '---'
            }
        },
        computed: {
            gameList: function() {
                return ['---', ...this.games ]
            },
            regions: function() {
                return this.$store.getters.getServers.map(server => server.regionName)
            }
        },
        beforeMount: function() {
            this.selectedRegion = this.regions[0] || '---'
        }
    }
</script>

