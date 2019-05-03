<template>
    <div>
        <section>
            <h2>Manage Team: {{teamName}}</h2>
            Here you can manage your team members and remove games from your team.
            Only the owner of the team can add and remove team members.
        </section>
        <section class="mt-5">
            <h3>Game List</h3>
            These games are currently manged by this team:
            <div class="mt-4 team-table">
                <div class="row team-table-header">
                    <div class="col-sm-3">Name</div>
                </div>
                <div class="row" v-for="(game, index) in team.games" v-bind:key="index">
                    <div class="col-sm-3">{{game}}</div>
                    <div class="col-sm-2">
                        <button type="button" v-on:click.prevent="inviteMember" class="btn btn-danger w-100  min-79">Delete</button>
                    </div>
                </div>
            </div>
        </section>
        <section class="mt-5">
            <h3>Team Members</h3>
            These users are currently part of your team:
            <div class="team-table">
                <div class="row team-table-header">
                    <div class="col-lg-3 col-sm-4">Full Name</div>
                    <div class="col-lg-3 col-sm-4">Email</div>
                    <div class="col-lg-3 col-sm-2">Type</div>
                    <div class="col-lg-2 col-sm-2" v-if="team.isOwner">Remove</div>
                </div>
                <div class="row" v-for="(member, index) in team.members" v-bind:key="index">
                    <div class="col-lg-3 col-sm-4">{{member.fullName}}</div>
                    <div class="col-lg-3 col-sm-4">{{member.email}}</div>
                    <div class="col-lg-3 col-sm-2">{{member.type}}</div>
                    <div class="col-sm-2 col-xs-3" v-if="team.isOwner">
                        <button type="button" 
                            v-on:click.prevent="inviteMember" 
                            class="btn btn-danger w-100 min-79"
                            v-bind:disabled="member.type === 'Owner'">Remove</button>
                    </div>
                </div>
            </div>
        </section>
        <section class="mt-5" v-if="team.isOwner">
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
                team: {

                },
                newUsername: '',
                error: {
                    message: '',
                    level: ''
                }
            }
        },
        computed: {
            
        },
        methods: {
            closeError: function(event) {
                this.error = {
                    message: '',
                    level: ''
                }
            },
            inviteMember: function(event) {
                if(!this.newUsername) {
                    this.error = { message: 'Username can not be empty', level: 'warning'}
                    return
                }
                fetch('/api/teams/add-member', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': this.$store.getters.getToken
                    },
                    body: JSON.stringify({
                        teamName: this.teamName,
                        memberEmail: this.newUsername,
                    })
                })
                .then(res => {
                    const status = res.status
                    if(status != 200) {
                        res.json().then(err => {
                            this.error.level = 'error'
                            switch(err.error) {
                                case 'team_not_found':
                                    this.error.message = 'Can no longer find team ' + this.teamName
                                    break
                                default:
                                    this.error.message = err.error
                            }
                        })
                    } else {
                        this.error = {
                            level: 'success',
                            message: '"' + this.teamName + '" is added to the team.'
                        }
                       this.fetchTeam()
                    }
                })
            },
            fetchTeam() {
                const teamNameQuery = encodeURIComponent(this.teamName)
                fetch('/api/teams/detail?teamName=' + teamNameQuery, {
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
                        this.team = res
                    }
                })
            }
        },
        created: function() {
            this.fetchTeam()
        }
    }
</script>

<style>
    select {
        min-width: 200px;
    }

    .team-table .row {
        margin-top: 4px;
        margin-bottom: 4px;
        line-height: 38px;
    }

    .team-table-header {
        font-weight: bold;
    }

    .min-79 {
        min-width: 79px;
    }
</style>
