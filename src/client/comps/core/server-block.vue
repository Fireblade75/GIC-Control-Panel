<template>
    <section class="mt-5">
        <h3>{{team.name}}</h3>
        <div class="mt-4">
            <ServerInstance 
                v-for="i in instances" v-bind:key="i" 
                v-bind:serverId="i"
                v-bind:games="team.games"
                v-on:applyUpdate="applyUpdate"
                v-bind:slots="team.slots" />
        </div>
        <AlertBox 
                v-bind:message="error.message" 
                v-bind:level="error.level" 
                v-on:closeAlert="closeError"
                v-bind:formAlert="false" />
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
                const licenseList = this.$store.getters.getLicenses
                if(!licenseList) {
                    console.error('Licenses not avaible in the store')
                    return 0
                }
                const license = licenseList[this.team.license]
                return license ? license.instances : 0
            }
        },
        methods: {
            closeError: function(event) {
                this.error = {
                    message: '',
                    level: ''
                }
            },
            applyUpdate: function(slot, gameName) {
                fetch('/api/games/setslot', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': this.$store.getters.getToken
                    },
                    body: JSON.stringify({
                        gameName: gameName,
                        slotId: slot,
                        teamName: this.team.name
                    })
                })
                .then(res => {
                    const status = res.status
                    if(status == 200 || status == 201) {
                        this.error = {
                            message: gameName + ' is now runing on server ' + slot,
                            level: 'success'
                        }
                    }
                })
            }
        }
    }
</script>

