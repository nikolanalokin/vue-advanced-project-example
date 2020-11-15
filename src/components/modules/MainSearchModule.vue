<template>
  <div v-show="shown"
    class="search-layer">
    <NLoader v-if="loading" />

    <template v-else>
      <NBtn
        flat
        color="primary"
        label="Ко всем результатам"
        @click="goToSearchPage()" />

      <NList v-if="usersLoadedCount">
        <div
          class="link-underline"
          @click="goToSearchPage('users')">
          <NItemLabel header>Пользователи</NItemLabel>
        </div>

        <NItem
          v-for="(item, index) in usersList"
          :key="index"
          :to="getLinkByData(item, -1)"
          @click="close">
          <NItemSection side>
            <NAvatar :size="40" type="user" :urls="item.photo" />
          </NItemSection>
          <NItemSection>
            <NItemLabel primary>{{ item.first_name }} {{ item.last_name }}</NItemLabel>
            <!-- <NItemLabel secondary>{{ item.subtitle }}</NItemLabel> -->
          </NItemSection>
        </NItem>
      </NList>
      
      <NList v-if="communitiesLoadedCount">
        <div
          class="link-underline"
          @click="goToSearchPage('communities')">
          <NItemLabel header>Сообщества</NItemLabel>
        </div>

        <NItem
          v-for="(item, index) in communitiesList"
          :key="index"
          :to="getLinkByData(item, 0)"
          @click="close">
          <NItemSection side>
            <NAvatar :size="40" type="community" :urls="item.photo" />
          </NItemSection>
          <NItemSection>
            <NItemLabel primary>{{ item.name }}</NItemLabel>
            <!-- <NItemLabel secondary>{{ item.subtitle }}</NItemLabel> -->
          </NItemSection>
        </NItem>
      </NList>

      <NList v-if="placesLoadedCount">
        <div
          class="link-underline"
          @click="goToSearchPage('places')">
          <NItemLabel header>Места</NItemLabel>
        </div>

        <NItem
          v-for="(item, index) in placesList"
          :key="index"
          :to="getLinkByData(item, 1)"
          @click="close">
          <NItemSection side>
            <NAvatar :size="40" type="place" :urls="item.photo" />
          </NItemSection>
          <NItemSection>
            <NItemLabel primary>{{ item.name }}</NItemLabel>
            <!-- <NItemLabel secondary>{{ item.subtitle }}</NItemLabel> -->
          </NItemSection>
        </NItem>
      </NList>

      <NList v-if="eventsLoadedCount">
        <div
          class="link-underline"
          @click="goToSearchPage('events')">
          <NItemLabel header>События</NItemLabel>
        </div>

        <NItem
          v-for="(item, index) in eventsList"
          :key="index"
          :to="getLinkByData(item, 2)"
          @click="close">
          <NItemSection side>
            <NAvatar :size="40" type="event" :urls="item.photo" />
          </NItemSection>
          <NItemSection>
            <NItemLabel primary>{{ item.name }}</NItemLabel>
            <!-- <NItemLabel secondary>{{ item.subtitle }}</NItemLabel> -->
          </NItemSection>
        </NItem>
      </NList>
    </template>
  </div>
</template>

<script>

import API from '../../services/api'
import { getLinkByData } from '../../utils'

const _defs = {
  count: 2,
  fields: 'name,photo,type'
}

export default {
  name: 'MainSearchModule',
  props: {
    search: String,
    total: Number
  },
  data () {
    return {
      loading: false,

      usersList: [],
      usersLoadedCount: 0,
      usersTotalCount: null,

      communitiesList: [],
      communitiesLoadedCount: 0,
      communitiesTotalCount: null,

      placesList: [],
      placesLoadedCount: 0,
      placesTotalCount: null,

      eventsList: [],
      eventsLoadedCount: 0,
      eventsTotalCount: null,
    }
  },
  watch: {
    search (val) {
      if (val == '') {
        this.clear()
      } else if (val.length >= 3) this.update()
    }
  },
  computed: {
    totalCount () {
      return this.usersTotalCount + this.communitiesTotalCount + this.placesTotalCount + this.eventsTotalCount
    },
    shown () {
      return (this.usersLoadedCount + this.communitiesLoadedCount + this.placesLoadedCount + this.eventsLoadedCount) > 0 /* || this.loading */
    }
  },
  methods: {
    getLinkByData,
    async update () {
      this.loading = true

      await this.loadUsers()
      await this.loadCommunities()
      await this.loadPlaces()
      await this.loadEvents()

      console.log(
        this.usersList,
        this.usersLoadedCount,
        this.usersTotalCount,
        this.communitiesList,
        this.communitiesLoadedCount,
        this.communitiesTotalCount,
        this.placesList,
        this.placesLoadedCount,
        this.placesTotalCount,
        this.eventsList,
        this.eventsLoadedCount,
        this.eventsTotalCount
      );

      this.loading = false

      this.$emit('update:total', this.totalCount)
    },
    clear () {
      this.usersList = []
      this.usersLoadedCount = 0
      this.usersTotalCount = null
      this.communitiesList = []
      this.communitiesLoadedCount = 0
      this.communitiesTotalCount = null
      this.placesList = []
      this.placesLoadedCount = 0
      this.placesTotalCount = null
      this.eventsList = []
      this.eventsLoadedCount = 0
      this.eventsTotalCount = null

      this.$emit('update:total', this.totalCount)
    },
    async loadUsers () {
      try {
        let response1 = await API.users.search({
          count: _defs.count,
          search: this.search,
        })
        this.usersTotalCount = +response1.count

        let response2 = await API.users.get({
          user_ids: response1.items, 
          fields: 'photo'
        })
        
        this.usersList = response2.items
        this.usersLoadedCount = response2.items.length
      } catch(error) {
        console.warn(error);
      }
    },
    async loadCommunities () {
      try {
        let response = await API.unions.search({
          type: 0,
          fields: _defs.fields,
          count: _defs.count,
          q: this.search,
        })
        this.communitiesList = response.items
        this.communitiesLoadedCount = response.items.length
        this.communitiesTotalCount = +response.count
      } catch (error){
        console.warn(error);
      }
    },
    async loadPlaces () {
      try {
        let response = await API.unions.search({
          type: 1,
          fields: _defs.fields,
          count: _defs.count,
          q: this.search,
        })
        this.placesList = response.items
        this.placesLoadedCount = response.items.length
        this.placesTotalCount = +response.count
      } catch(error) {
        console.warn(error);
      }
    },
    async loadEvents () {
      try {
        let response = await API.unions.search({
          type: 2,
          fields: _defs.fields,
          count: _defs.count,
          q: this.search,
        })
        this.eventsList = response.items
        this.eventsLoadedCount = response.items.length
        this.eventsTotalCount = +response.count
      } catch(error) {
        console.warn(error);
      }
    },
    goToSearchPage (section = 'all') {
      this.$router.push({
        name: 'search',
        query: {
          search: this.search,
          section
        }
      })
      this.close()
    },
    close () {
      this.clear()
      this.$emit('close')
    },
  }
}

</script>

<style lang="scss" scoped>

</style>