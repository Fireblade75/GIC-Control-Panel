<template>
    <div>
        <section>
            <h2>Add a Game</h2>
            To manage your games you first need to select your team.
            <form class="mt-4">
                <div class="form-group row">
                    <label for="game-name" class="col-sm-2 col-form-label">Game Name</label>
                    <div class="col-sm-10">
                        <input type="text" class="form-control" id="game-name" v-model="newGameName" placeholder="Game Name">
                    </div>
                </div>
                <div class="form-group row">
                    <label for="team-name" class="col-sm-2 col-form-label">Team Name</label>
                    <div class="col-sm-10">
                        <select v-model="selectedTeam" class="form-control" id="team-name">
                        <option v-for="(item, index) in teamList" v-bind:key="index">
                            {{ item }}
                        </option>
                    </select>
                    </div>
                </div>
                <AlertBox v-bind:message="addError.message" 
                    v-bind:level="addError.level" 
                    offset="offset-sm-2 col-sm-10"
                    v-on:closeAlert="closeAddError" />
                <div class="row">
                    <div class="offset-sm-2 col-sm-10">
                        <button type="submit" v-on:click.prevent="addGame" class="btn btn-primary col-sm-3">Add Game</button>
                    </div>
                </div>
            </form>
        </section>
        <section class="mt-5">
            <h2>Manage Games</h2>
            Manage the games of your team
            <div class="mt-4">
                <GameInstance 
                    v-for="(game, index) in games" v-bind:key="index" 
                    v-bind:gameName="game.gameName" 
                    v-bind:instances="game.instances" />
            </div>
        </section>
    </div>
</template>

<script>
    import GameInstance from '../core/game-instances'
    import AlertBox from '../core/alert-box'

    export default {
        name: "Games",
        components: {
            "GameInstance": GameInstance,
            "AlertBox": AlertBox
        },
        data: function() {
            return {
                newGameName: '',
                selectedTeam: '---',
                games: [
                    { gameName: 'Zombies', instances: 0 },
                    { gameName: 'Dragons', instances: 1 },
                    { gameName: 'Space Shooter', instances: 0 }
                ],
                addError: {
                    message: '',
                    level: ''
                },
                manageError: {
                    message: '',
                    level: ''
                }
            }
        },
        computed: {
            team() {
                return this.$store.getters.getTeam
            },
            teamList() {
                return [ '---', ...this.$store.getters.getTeamList]
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
            closeAddError: function(event) {
                this.addError = {
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

