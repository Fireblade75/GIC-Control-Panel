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
                <AlertBox v-bind:message="error.message" 
                    v-bind:level="error.level" 
                    offset="offset-sm-2 col-sm-10"
                    v-on:closeAlert="closeError" />
                <div class="row">
                    <div class="offset-sm-2 col-sm-10">
                        <button type="submit" v-on:click.prevent="addGame" class="btn btn-primary col-sm-3">Add Game</button>
                    </div>
                </div>
            </form>
        </section>
    </div>
</template>

<script>
    import AlertBox from '../core/alert-box'

    export default {
        name: "Games",
        components: {
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
                error: {
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
            teamList() {
                return [ '---', ...this.$store.getters.getTeamNames]
            }
        },
        methods: {
            addGame: function(event) {
                if(!this.newGameName) {
                    this.error = {
                        message: 'Game name can not be empty',
                        level: 'warning'
                    }
                } else if(this.selectedTeam === '---') {
                    this.error = {
                        message: 'Please select a team',
                        level: 'warning'
                    }
                } else {
                    fetch('/api/games/create', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': this.$store.getters.getToken
                        },
                        body: JSON.stringify({
                            teamName: this.selectedTeam,
                            gameName: this.newGameName,
                        })
                    })
                    .then(res => res.json())
                    .then(res => {
                        if(res.error) {
                            this.error.level = 'error'
                            switch(res.error) {
                                case 'game_name_taken':
                                    this.error.message = 'This name is already taken'
                                    break
                                case 'game_limit_reached':
                                    this.error.message = 'license error: Max game limit reached'
                                    break
                                default:
                                    this.error.message = res.error
                            }
                        } else {
                            this.error = {
                                level: 'success',
                                message: '"' + this.newGameName + '" is successfully created'
                            }
                            this.newGameName = ''
                        }
                    })
                }
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

