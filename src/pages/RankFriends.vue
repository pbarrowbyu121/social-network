<template>
	<div>
		<div class="title text-h4 q-mx-auto">Rank Your Friends</div>
		<draggable
			class="list-group"
			tag="transition-group"
			:component-data="{
				tag: 'div',
				type: 'transition-group',
				name: !drag ? 'flip-list' : null,
			}"
			v-model="list"
			v-bind="dragOptions"
			@start="drag = true"
			@end="drag = false"
			item-key="order"
		>
			<template #item="{ element }">
				<div class="list-group-item">
					<q-separator v-if="list.indexOf(element) === 0" />
					<q-item clickable v-ripple>
						<q-item-section avatar>
							<div class="row">
								<q-avatar class="relative" size="4rem">
									<span class="ranking-number">
										{{ list.indexOf(element) + 1 }}
									</span>
									<img :src="element.avatar" />
								</q-avatar>
							</div>
						</q-item-section>
						<q-item-section>{{ element.name }}</q-item-section>
					</q-item>
					<q-separator />
				</div>
			</template>
		</draggable>
		<div class="absolute-bottom q-mb-sm q-mx-auto" style="width: 75px">
			<q-btn
				color="primary"
				label="Submit"
				@click="confirm = true"
				:disable="!canSubmit"
			/>
		</div>
	</div>
	<!-- Confirm submit -->
	<q-dialog v-model="confirm" persistent>
		<q-card>
			<q-card-section class="row items-center">
				<q-avatar icon="check" color="primary" text-color="white" size="2rem" />
				<span class="q-ml-sm"
					>Are you sure you want to lock in these rankings?</span
				>
			</q-card-section>

			<q-card-actions align="right">
				<q-btn flat label="Cancel" color="primary" v-close-popup />
				<q-btn
					flat
					label="Confirm"
					color="primary"
					v-close-popup
					@click="submitRankings"
				/>
			</q-card-actions>
		</q-card>
	</q-dialog>
</template>

<script>
import draggable from "vuedraggable";
import { mapActions, mapGetters } from "vuex";
import { uploadRankings } from "../helpers";

export default {
	name: "Ranking Friend Page",
	display: "Transitions",
	order: 7,
	components: {
		draggable,
	},
	data() {
		return {
			list: [],
			drag: false,
			me: {},
			canSubmit: true,
			confirm: false,
		};
	},
	methods: {
		// sort() {
		// 	this.list = this.list.sort((a, b) => a.order - b.order);
		// },
		submitRankings() {
			const submittedDate = new Date();
			const submitObj = {
				date: submittedDate,
				submittedBy: this.me.uid,
				rankings: {},
			};
			this.list.forEach((item, index) => {
				submitObj.rankings[item.createdBy] = index + 1;
			});
			uploadRankings(submitObj).then(() => {
				this.canSubmit = false;
				this.$q.notify({ message: "Rankings Submitted" });
			});
		},
	},
	computed: {
		...mapGetters("userstore", ["getFriends"]),
		dragOptions() {
			return {
				animation: 200,
				group: "description",
				disabled: false,
				ghostClass: "ghost",
			};
		},
	},
	created() {
		const me = this.$store.state.userstore.user;
		const stateFriends = this.$store.state.userstore.friends
			.filter((friend) => friend.createdBy !== me.uid)
			.map((friend, index) => {
				return {
					name: friend.firstName + " " + friend.lastName,
					createdBy: friend.createdBy,
					avatar: friend.avatar,
					rank: index + 1,
				};
			});
		console.log("me", me);
		console.log("stateFriends", stateFriends);
		this.list = stateFriends;
		this.me = me;
	},
};
</script>

<style lang="sass">
.list-group-item


.ranking-number
	position: absolute
	top: -2px
	left: -2px
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

.title
	width: 90%
</style>
