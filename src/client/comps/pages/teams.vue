<template>
    <div>
        <section>
            <h2>Manage Team</h2>
            To manage your games you first need to select your team.
            <form class="mt-4">
                <div class="form-group row">
                    <label for="selected-team" class="col-sm-2 col-form-label">Team Name</label>
                    <div class="col-sm-10">
                    <select v-model="selectedTeam" class="form-control" id="selected-team">
                        <option v-for="(item, index) in teamList" v-bind:key="index">
                            {{ item }}
                        </option>
                    </select>
                    </div>
                </div>
                <div class="row">
                    <div class="offset-sm-2 col-sm-10">
                        <button type="submit" v-on:click.prevent="selectTeam" class="btn btn-primary col-sm-3">Manage</button>
                    </div>
                </div>
                
            </form>
        </section>
        <section class="mt-5">
            <h2>Create Team</h2>
            To manage your games you first need to select your team.
            <form class="mt-4">
                <div class="form-group row">
                    <label for="team-name" class="col-sm-2 col-form-label">Team Name</label>
                    <div class="col-sm-10">
                        <input type="text" class="form-control" id="team-name" v-model="newTeamName" placeholder="Team Name">
                    </div>
                </div>
                <div class="form-group row">
                    <label for="team-lincence" class="col-sm-2 col-form-label">License</label>
                    <div class="col-sm-10">
                        <select v-model="selectedlicense" class="form-control" id="team-lincence">
                        <option v-for="(item, index) in licenseOptions" v-bind:key="index">
                            {{ item }}
                        </option>
                    </select>
                    </div>
                </div>
                <AlertBox v-bind:message="error.message" 
                    v-bind:level="error.level" 
                    offset="offset-sm-2 col-sm-10"
                    v-on:closeAlert="closeError" />
                <div class="row">
                    <div class="offset-sm-2 col-sm-10">
                        <button type="submit" v-on:click.prevent="createTeam" class="btn btn-primary col-sm-3">Create Team</button>
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
                licenseOptions: ['Basic', 'Premium', 'Enterprise'],
                selectedTeam: '---',
                newTeamName: '',
                selectedlicense: 'Basic',
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
            selectTeam: function(event) {
                let teamName = this.selectedTeam
                if(teamName !== '---') {
                    this.$router.push({ path: '/team-detail', query: { teamName: this.selectedTeam } })
                }
            },
            createTeam: function(event) {
                if(!this.newTeamName) {
                    this.error = {
                        message: 'Team name can not be empty',
                        level: 'warning'
                    }
                    return
                }
                fetch('/api/teams/create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': this.$store.getters.getToken
                    },
                    body: JSON.stringify({
                        teamName: this.newTeamName,
                        license: this.selectedlicense,
                    })
                })
                .then(res => res.json())
                .then(res => {
                    if(res.error) {
                        this.error.level = 'error'
                        switch(res.error) {
                            case 'name_taken':
                                this.error.message = 'Team name is already taken'
                                break
                            default:
                                this.error.message = res.error
                        }
                    } else {
                        this.error = {
                            level: 'success',
                            message: 'Team "' + this.newTeamName + '" is successfully created'
                        }
                        this.$store.dispatch('fetchTeams')
                    }
                })
            },
            closeError: function(event) {
                this.error = {
                    message: '',
                    level: ''
                }
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
