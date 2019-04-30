<template>
    <div>
        <section>
            <h2>Manage Team</h2>
            To manage your games you first need to select your team.
            <form class="form-inline mt-4">
                <div class="form-group mr-sm-3 mb-2">
                    <label for="selected-team" class="sr-only">Team</label>
                    <select v-model="selectedTeam" class="form-control" id="selected-team">
                        <option v-for="(item, index) in teamOptions" v-bind:key="index">
                            {{ item }}
                        </option>
                    </select>
                </div>
                <button type="submit" v-on:click.prevent="selectTeam" class="btn btn-primary col-sm-2 mb-2">Manage</button>
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
                    <label for="team-lincence" class="col-sm-2 col-form-label">Licence</label>
                    <div class="col-sm-10">
                        <select v-model="selectedLicence" class="form-control" id="team-lincence">
                        <option v-for="(item, index) in licenceOptions" v-bind:key="index">
                            {{ item }}
                        </option>
                    </select>
                    </div>
                </div>
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

    export default {
        name: "Teams",
        data: function() {
            return {
                teamOptions: ['---', 'Team A', 'Team B'],
                licenceOptions: ['Basic', 'Premium', 'Enterprise'],
                selectedTeam: '---',
                newTeamName: '',
                selectedLicence: ''
            }
        },
        computed: {
            team() {
                return this.$store.getters.getTeam
            }
        },
        methods: {
            selectTeam: function(event) {
                let teamName = this.selectedTeam
                if(teamName === '---') {
                    teamName = ''
                }
                this.$store.commit('setTeam', teamName)
            },
            createTeam: function(event) {
                
            }
        }
    }
</script>

<style>
    select {
        min-width: 200px;
    }
</style>
