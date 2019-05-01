<template>
    <section class="mt-5">
        <h3>{{team.name}}</h3>
        <div class="mt-4">
            <ServerInstance 
                v-for="i in instances" v-bind:key="i" 
                v-bind:serverId="i" 
                v-bind:instances="1" />
            </div>
        </section>
</template>

<script>
    import ServerInstance from './server-instances'
    import AlertBox from './alert-box'

    export default {
        name: "ServerBlock",
        components: {
            "ServerInstance": ServerInstance,
            "AlertBox": AlertBox
        },
        props: {
            team: Object,
        },
        data: function() {
            return {
                error: {
                    message: '',
                    level: ''
                }
            }
        },
        computed: {
            instances: function() {
                const licenceList = this.$store.getters.getLicences
                if(!licenceList) {
                    console.error('Licenses not avaible in the store')
                    return 0
                }
                const licence = licenceList[this.team.licence]
                return licence ? licence.instances : 0
            }
        },
        methods: {
            addGame: function(event) {
                if(!this.newGameName) {
                    this.addError = {
                        message: 'Game name can not be empty',
                        level: 'warning'
                    }
                    return
                } else if(this.selectedTeam === '---') {
                    this.addError = {
                        message: 'Please select a team',
                        level: 'warning'
                    }
                    return
                }
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

