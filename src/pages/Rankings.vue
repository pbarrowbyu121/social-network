<template>
	<div>
		<q-list class="q-mx-auto q-mt-md" style="width: 90%" bordered separator>
			<q-item :key="player.createdBy" v-for="player in rankings">
				<q-item-section avatar>
					<div class="row">
						<q-avatar class="relative" size="4rem">
							<span v-if="player.rank > 2" class="ranking-number">
								{{ player.rank }}
							</span>
							<span class="top-rank relative" v-else>
								<i class="star-icon fas fa-star fa-sm" />
								<span class="star-number">{{ player.rank }}</span>
							</span>
							<q-img :src="player.avatar" :ratio="1" />
						</q-avatar>
					</div>
				</q-item-section>
				<q-item-section>{{
					player.firstName + " " + player.lastName
				}}</q-item-section>
			</q-item>
		</q-list>
	</div>
</template>

<script>
import { getRankings, averageRankings, getRank } from "../helpers";
export default {
	name: "Rankings Page",
	data() {
		return {
			rankings: [],
		};
	},
	async created() {
		const rankingsArr = await getRankings();
		const stateFriends = this.$store.state.userstore.friends;
		const friendsWithRanks = getRank(rankingsArr, stateFriends);
		this.rankings = friendsWithRanks;
	},
};
</script>

<style lang="sass">
.ranking-number
	position: absolute
	top: -3px
	left: -3px
	height: 25px
	width: 25px
	background-color: #1976D2
	border-radius: 50%
	color: #fff
	font-size: 20px
	text-align: center
	display: flex
	align-items: center
	justify-content: center
	z-index: 1

.star-icon
	color: #d4af37
	display: flex
	align-items: center
	justify-content: center
	text-align: center
	z-index: 1

.star-number
	position: absolute
	top: 7px
	left: 10px
	display: flex
	justify-content: center
	align-items: center
	text-align: center
	z-index: 10
	font-size: 18px

.top-rank
	position: absolute
	top: -5px
	left: -5px
	color: #fff
	display: flex
	align-items: center
	justify-content: center
	text-align: center
</style>
