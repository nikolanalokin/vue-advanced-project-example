export default {
  // data () {
  //   return {
  //     cuid: null
  //   }
  // },
  computed: {
    $isAdmin () {
      let index = this.cuid < 0 ? this.$store.getters.adminUnions.findIndex(item => +item.id == Math.abs(this.cuid)) : -1
      return index > -1
    },
    $isOwn () {
      return this.cuid == this.$store.getters.uid
    },
    $isAuthenticated () {
      return this.$store.getters.isAuthenticated
    },
    $currentUser () {
      return this.$store.getters.currentUser
    },
    $uid () {
      return this.$store.getters.uid
    }
  }
}