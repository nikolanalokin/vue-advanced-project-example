export default {
  props: {
    numberDisplayedResults: Number
  },
  data () {
    return {
      itemsList: [],
      itemsPage: 0,
      itemsOffset: 0,
      itemsTotalCount: null,
      itemsLoadedCount: 0,

      members: {
        users: [],
        unions: []
      },

      loaderId: +new Date(),
    }
  },
  watch: {
    numberDisplayedResults () {
      this.update()
    }
  },
  methods: {
    update () {
      this.itemsList = []
      this.itemsPage = 0
      this.itemsOffset = 0
      this.itemsTotalCount = null
      this.itemsLoadedCount = 0
      this.loaderId++
    },
    async load ($state) {
      try {
        let response = await this.infiniteFn(this.infiniteOpts)
        
        if (response.user_ids) this.members.users.push(...response.user_ids)
        if (response.union_ids) this.members.unions.push(...response.union_ids)

        if (this.itemsPage == 0) this.itemsList = response.items
        else this.itemsList.push(...response.items)

        this.itemsLoadedCount += response.items.length
        this.itemsTotalCount = +response.count

        this.itemsPage++
        this.itemsOffset = this.itemsPage * this.infiniteCount

        if (this.numberDisplayedResults) {
          if (this.itemsLoadedCount >= this.numberDisplayedResults) {
            if (this.itemsLoadedCount > this.numberDisplayedResults) {
              this.itemsLoadedCount = this.numberDisplayedResults
              this.itemsList = this.itemsList.slice(0, this.numberDisplayedResults)
            }
            $state.complete()
          }
        }
        
        if (!this.itemsLoadedCount) $state.complete()
        else $state.loaded()

        if (this.itemsLoadedCount == this.itemsTotalCount) $state.complete()
        if (this.itemsLoadedCount == 0) this.$emit('update:isEmpty', true)
      }
      catch (err) {
        console.warn(err)
        if ($state) $state.error()
      }
    }
  }
}