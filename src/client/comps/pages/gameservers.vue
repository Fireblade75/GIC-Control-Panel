<template>
    <div>
        <section>
            <h2>Manage Game Servers</h2>
            On this page you can manage the game servers for all your teams.
        </section>
        <ServerBlock 
            v-for="(team, index) in teams" 
            v-bind:key="index"
            v-bind:team="team" />
    </div>
</template>

<script>
    import ServerBlock from '../core/server-block'

    export default {
        name: "GameServers",
        components: {
            "ServerBlock": ServerBlock
        },
        computed: {
            teams() {
                return this.$store.getters.getTeams
            }
        },
        beforeMount: function() {
            this.$store.dispatch('fetchTeams')
            this.$store.dispatch('fetchlicenses')
        }
    }
</script>

