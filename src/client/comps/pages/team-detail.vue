<template>
    <div>
        <section>
            <h2>Manage Team: {{teamName}}</h2>
            To manage your games you first need to select your team.
        </section>
        <section class="mt-5">
            <h3>Game List</h3>
            These games are currently manged by this team:
            
        </section>
        <section class="mt-5">
            <h3>Team Members</h3>
            These members are currently part of your team:
        </section>
        <section class="mt-5">
            <h3>Add a team Members</h3>
            Add a member to your team so they can also manage your games:
            <form class="mt-4">
                <div class="form-group row">
                    <label for="username" class="col-sm-2 col-form-label">Username</label>
                    <div class="col-sm-10">
                        <input type="text" class="form-control" id="username" v-model="newUsername" placeholder="user@example.com">
                    </div>
                </div>
                <AlertBox v-bind:message="error.message" 
                    v-bind:level="error.level" 
                    offset="offset-sm-2 col-sm-10"
                    v-on:closeAlert="closeError" />
                <div class="row">
                    <div class="offset-sm-2 col-sm-10">
                        <button type="submit" v-on:click.prevent="inviteMember" class="btn btn-primary col-sm-3">Invite</button>
                    </div>
                </div>
            </form>
        </section>
    </div>
</template>

<script>
    import AlertBox from '../core/alert-box'

    export default {
        name: "Teams",
        components: {
            "AlertBox": AlertBox,
        },
        data: function() {
            return {
                teamName: this.$route.query.teamName,
                selectedTeam: '---',
                newUsername: '',
                selectedLicence: 'Basic',
                error: {
                    message: '',
                    level: ''
                }
            }
        },
        computed: {
            teamList() {
                return [ '---', ...this.$store.getters.getTeamNames]
            }
        },
        methods: {
            closeError: function(event) {
                this.error = {
                    message: '',
                    level: ''
                }
            },
            inviteMember: function(event) {
                
            }
        },
        beforeMount: function() {
            this.$store.dispatch('fetchTeams')
        }
    }
</script>

<style>
    select {
        min-width: 200px;
    }
</style>
