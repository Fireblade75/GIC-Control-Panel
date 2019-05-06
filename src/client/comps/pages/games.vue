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
                <div class="form-group row">
                    <label for="game-file" class="col-sm-2 col-form-label">File (.zip)</label>
                    <div class="col-sm-10">
                        <div class="custom-file">
                            <input type="file" class="custom-file-input" id="game-file" @change="processFile('gameFile', $event)">
                            <label class="custom-file-label" for="game-file">{{gameFile.fileName}}</label>
                        </div>
                    </div>
                </div>
                <AlertBox v-bind:message="errors.createError.message" 
                    v-bind:level="errors.createError.level" 
                    offset="offset-sm-2 col-sm-10"
                    v-on:closeAlert="closeCreateError" />
                <AlertBox v-bind:message="errors.fileError.message" 
                    v-bind:level="errors.fileError.level" 
                    offset="offset-sm-2 col-sm-10"
                    v-on:closeAlert="closeFileError" />
                <div class="row">
                    <div class="offset-sm-2 col-sm-10">
                        <button type="submit" v-on:click.prevent="addGame" class="btn btn-primary col-sm-3">Add Game</button>
                    </div>
                </div>
            </form>
        </section>
        <section class="mt-5">
            <h2>Update a Game</h2>
            Release a new version of your game:
            <form class="mt-4">
                <div class="form-group row">
                    <label for="update-game-name" class="col-sm-2 col-form-label">Game Name</label>
                    <div class="col-sm-10">
                        <select v-model="selectedGame" class="form-control" id="update-game-name">
                        <option v-for="(game, index) in gameList" v-bind:key="index">
                            {{ game }}
                        </option>
                    </select>
                    </div>
                </div>
                <div class="form-group row">
                    <label for="update-file" class="col-sm-2 col-form-label">File (.zip)</label>
                    <div class="col-sm-10">
                        <div class="custom-file">
                            <input type="file" class="custom-file-input" id="update-file" @change="processFile('updateFile', $event)">
                            <label class="custom-file-label" for="update-file">{{updateFile.fileName}}</label>
                        </div>
                    </div>
                </div>
                <AlertBox v-bind:message="errors.updateError.message" 
                    v-bind:level="errors.updateError.level" 
                    offset="offset-sm-2 col-sm-10"
                    v-on:closeAlert="closeUpdateError" />
                <div class="row">
                    <div class="offset-sm-2 col-sm-10">
                        <button type="submit" v-on:click.prevent="updateGame(selectedGame, updateFile)" class="btn btn-primary col-sm-3">Update Game</button>
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
                selectedGame: '---',
                gameList: ['---'],
                errors: {
                    createError: {
                        message: '',
                        level: ''
                    },
                    fileError: {
                        message: '',
                        level: ''
                    },
                    updateError: {
                        message: '',
                        level: ''
                    }
                },
                gameFile: {
                    fileName: 'Choose file',
                    blob: null
                },
                updateFile: {
                    fileName: 'Choose file',
                    blob: null
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
                    this.errors.createError = {
                        message: 'Game name can not be empty',
                        level: 'warning'
                    }
                } else if(this.selectedTeam === '---') {
                    this.errors.createError = {
                        message: 'Please select a team',
                        level: 'warning'
                    }
                } else if(this.gameFile.fileName === 'Choose file') {
                    this.errors.createError = {
                        level: 'warning',
                        message: 'Please select a .zip file'
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
                            this.errors.createError.level = 'error'
                            switch(res.error) {
                                case 'game_name_taken':
                                    this.errors.createError.message = 'This name is already taken'
                                    break
                                case 'game_limit_reached':
                                    this.errors.createError.message = 'License error: Max game limit reached'
                                    break
                                default:
                                    this.errors.createError.message = res.error
                            }
                        } else {
                            this.errors.createError = {
                                level: 'success',
                                message: '"' + this.newGameName + '" is successfully created'
                            }
                            this.uploadFile(this.newGameName, this.gameFile, true)
                            this.newGameName = ''
                            this.gameFile = {
                                fileName: 'Choose file',
                                blob: null
                            }
                        }
                    })
                }
            },
            updateGame: function(gameName, gameFile) {
                if(this.updateFile.fileName === 'Choose file') {
                    this.errors.updateError = {
                        level: 'warning',
                        message: 'Please select a .zip file'
                    }
                } else {
                    this.uploadFile(gameName, gameFile, false)
                    this.updateFile = {
                        fileName: 'Choose file',
                        blob: null
                    }
                }
            },
            uploadFile: function(gameName, gameFile, create = true) {
                const formData = new FormData()
                formData.append('gameName', gameName)
                formData.append('gameFile', gameFile.blob, gameFile.fileName)

                fetch('/api/games/set-sources', {
                    method: 'POST',
                    headers: {
                        'Authorization': this.$store.getters.getToken
                    },
                    body: formData
                }).then(res => {
                    const status = res.status
                    let message =  {}
                    if(status !== 200) {
                        res.json().then(err => {
                            message.level = 'error'
                            if(err.error === 'wrong_mime_type') {
                                message.message = 'File is not a zip'
                            } else {
                                message.message = err.error
                            }
                        })
                    } else {
                        message = {
                            level: 'success',
                            message: 'Successfully uploaded game sources'
                        }
                    }
                    if(create) {
                        this.errors.fileError = message
                    } else {
                        this.errors.updateError = message
                    }
                })
            },
            closeCreateError: function(event) {
                this.errors.createError = {
                    message: '',
                    level: ''
                }
            },
            closeFileError: function(event) {
                this.errors.fileError = {
                    message: '',
                    level: ''
                }
            },
            closeUpdateError: function(event) {
                this.errors.createError = {
                    message: '',
                    level: ''
                }
            },
            processFile(field, event) {
                const files = event.target.files || event.dataTransfer.files
                let fileData = {
                    fileName: 'Choose file',
                    blob: null
                }
                let error = null

                if (files.length) {
                    const fileName = files[0].name
                    if(fileName.endsWith('.zip')) {
                        fileData = {
                            blob: files[0],
                            fileName: fileName
                        }
                    } else {
                        error = {
                            level: 'warning',
                            message: 'Only .zip files are supported'
                        }
                    }
                }
                if(field === 'gameFile') {
                    this.gameFile = fileData
                    if(error) this.errors.fileError = error
                } else if(field === 'updateFile') {
                    this.updateFile = fileData
                    if(error) this.errors.updateError = error
                }
            },
            fetchGames() {
                fetch('/api/games/gamelist', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': this.$store.getters.getToken
                    }
                })
                .then(res => res.json())
                .then(res => {
                    if(res.error) {
                        console.error(res.error)
                    } else {
                        this.gameList = [ '---', ...res]
                    }
                })
            },
        },
        beforeMount: function() {
            this.$store.dispatch('fetchTeams')
        },
        created: function() {
            this.fetchGames()
        }
    }
</script>

