<template>

  <NLayout @scroll="onLayoutScroll" @resize="onLayoutResize" ref="layout" class="main-layout">
    <NHeader>
      <NToolbar class="bg-dark">
        <div class="width-container mx-auto full-height row items-center justify-between">

          <div class="col-2 row">
            <router-link class="header__logo" :to="$isAuthenticated ? { name: 'communityProfile', params: { oid: 1 } } : { name: 'index' }">
              <img draggable="false" src="../assets/img/logo.svg" class="logo" alt="">
            </router-link>
          </div>

          <div class="col-auto">
            <div class="nav-header header__nav-header" v-if="$isAuthenticated">
              <div class="nav-header__item nav-header__notification" :class="notifSettingsOpened ? 'is-opened' : void 0" title="Уведомления">
                <NIcon size="30px" name="main_notifications" />
                <NIcon size="30px" name="main_notifications_fill" />

                <NMenu
                  contentClass="rounded-borders-bottom"
                  triggerEvent="click"
                  anchor="bottom middle"
                  self="top middle"
                  @before-show="notifSettingsOpened = true"
                  @before-hide="notifSettingsOpened = false">
                  
                  <NForm class="pa-md" style="width: 300px;">
                    <NSwitch
                      row
                      label="Включить уведомления"
                      v-model="notifEnable" />
                    <NSwitch
                      row
                      label="Включить звук у уведомлений"
                      v-model="notifSoundEnable" />
                  </NForm>
                  
                </NMenu>
              </div>

              <transition name="fade" mode="out-in" duration="400" @after-enter="afterSearchEnter">
                <div key="container" class="nav-header__container" v-if="!searchMode">
                  
                  <router-link class="nav-header__item" title="Профиль" :to="$currentUser ? getLinkByData($currentUser, -1) : ''">
                    <NIcon size="30px" name="main_profile" />
                    <NIcon size="30px" name="main_profile_fill" />
                  </router-link>
                
                  <router-link class="nav-header__item" title="Общение" :to="{ name: 'chats' }">
                    <NIcon size="30px" name="main_communication" />
                    <NIcon size="30px" name="main_communication_fill" />
                  </router-link>
                
                  <router-link class="nav-header__item" title="Контакты" :to="{ name: 'contactsMain', query: { filter: 'all' } }">
                    <NIcon size="30px" name="main_contacts" />
                    <NIcon size="30px" name="main_contacts_fill" />
                  </router-link>
                
                  <router-link class="nav-header__item" title="Галерея" :to="{ name: `gallery` }">
                    <NIcon size="30px" name="main_gallery" />
                    <NIcon size="30px" name="main_gallery_fill" />
                  </router-link>
                
                  <router-link class="nav-header__item" title="Сообщества" :to="{ name: 'communitiesMain' }">
                    <NIcon size="30px" name="main_communities" />
                    <NIcon size="30px" name="main_communities_fill" />
                  </router-link>

                  <div class="flex">
                    <router-link class="nav-header__item" title="Музыка" :to="{ name: 'musicMain' }">
                      <NIcon size="30px" name="main_music" />
                      <NIcon size="30px" name="main_music_fill" />
                    </router-link>
                  </div>
                
                  <router-link class="nav-header__item" title="Медиа" :to="{ name: 'mediaMain' }">
                    <NIcon size="30px" name="main_media" />
                    <NIcon size="30px" name="main_media_fill" />
                  </router-link>
                
                  <router-link class="nav-header__item" title="Места" :to="{ name: 'placesMain' }">
                    <NIcon size="30px" name="main_places" />
                    <NIcon size="30px" name="main_places_fill" />
                  </router-link>
                
                  <router-link class="nav-header__item" title="События" :to="{ name: 'eventsMain' }">
                    <NIcon size="30px" name="main_events" />
                    <NIcon size="30px" name="main_events_fill" />
                  </router-link>
                
                  <router-link class="nav-header__item" title="Новости" :to="{ name: 'news', query: { filter: 'all' } }">
                    <NIcon size="30px" name="main_news" />
                    <NIcon size="30px" name="main_news_fill" />
                  </router-link>
                </div>
                
                <div key="search" class="header-search nav-header__header-search" v-else>
                  <NIcon size="30px" name="main_search" color="white" />
                  <input class="input header-search__input" placeholder="Поиск по миру" 
                    ref="searchInput" 
                    v-model="search"
                    @keyup.enter="$refs.searchModule.goToSearchPage()"
                    v-click-outside="onClickOusideSearchInput">
                </div>
              </transition>

              <div class="nav-header__item nav-header__search-toggle" title="Поиск" @click="toggleSearch">
                <NIcon v-if="!searchMode" size="30px" name="main_search" />
                <NIcon v-else size="30px" name="main_close" />
              </div>

            </div>
          </div>

          <div class="col-2 row justify-end">
            <div class="row items-center gutter-x-sm text-light nav-header__profile" v-if="$isAuthenticated">
              <NAvatar
                type="user"
                size='30'
                :urls="$currentUser && $currentUser.photo" />
              <span class="text-body-n">{{ $currentUser && $currentUser.first_name }}</span>
              <NIcon name="arrow_down" size="16px" style="transition: transform .2s" :class="{ 'rotate-180': miniProfileOpened }" />

              <NMenu
                contentClass="rounded-borders-bottom"
                triggerEvent="click"
                anchor="bottom middle"
                self="top middle"
                auto-close
                @before-show="miniProfileOpened = true"
                @before-hide="miniProfileOpened = false">
                <NList>
                  <NItem
                    class="no-border-radius"
                    clickable
                    :to="{ name: 'profileSettingAccount' }">
                    <NItemSection side>
                      <NIcon name="settings" />
                    </NItemSection>
                    <NItemSection>
                      <NItemLabel class="text-body-n">Настройки</NItemLabel>
                    </NItemSection>
                  </NItem>
                  <NItem v-if="$isDevelopment"
                    class="no-border-radius"
                    clickable
                    :to="{ name: 'wallet' }">
                    <NItemSection side>
                      <NSVG name="wallet" />
                    </NItemSection>
                    <NItemSection>
                      <NItemLabel class="text-body-n">Кошелёк</NItemLabel>
                    </NItemSection>
                  </NItem>
                  <NDivider />
                  <NItem
                    class="no-border-radius"
                    clickable
                    @click="logOut()">
                    <NItemSection side>
                      <NIcon name="logout" />
                    </NItemSection>
                    <NItemSection>
                      <NItemLabel class="text-body-n">Выйти</NItemLabel>
                    </NItemSection>
                  </NItem>
                </NList>
              </NMenu>
            </div>

            <div class="row flex-center" v-else>
              <NBtn
                flat
                color="white"
                label="Войти/Зарегистрироваться"
                @click="$store.dispatch('MODAL_OPEN', {
                  name: 'log-in'
                })" />
            </div>
          </div>
        </div>
      </NToolbar>

      <!-- <portal to="utils"> -->
        <transition name="fade">
          <MainSearchModule v-if="searchMode"
            ref="searchModule"
            :search="search" 
            @close="onSearchClose" />
        </transition>
      <!-- </portal> -->
      
      <NToolbar class="n-page-nav" v-if="currentAppBar">
        <div class="width-container mx-auto" style="height: 47px;">
          <div class="row items-center justify-between full-height">
            <NBtn v-if="currentAppBar.back"
              flat
              icon="back"
              @click="$router.back()" />

            <NToolbarTitle v-if="currentAppBar.title">{{ currentAppBar.title }}</NToolbarTitle>
            <PortalTarget v-else name="page-nav-title" slim></PortalTarget>

            <template v-if="currentAppBar.right">
              <div class="gutter-x-xs" v-if="Array.isArray(currentAppBar.right)">
                <NBtn v-for="item1 in currentAppBar.right"
                  :key="item1.icon"
                  flat
                  color="dark-s"
                  :icon="item1.icon" 
                  @click="item1.callback ? runCallback(item1.callback) : void 0" />
              </div>

              <NBtn v-else
                flat
                color="dark-s"
                :icon="currentAppBar.right.icon" 
                @click="currentAppBar.right.callback ? runCallback(currentAppBar.right.callback) : void 0" />
            </template>
            <PortalTarget v-else name="page-nav-right" slim></PortalTarget>
            
            <template v-if="currentAppBar.center && currentAppBar.center.type == 'dropdown'">
              <NTabs class="pl-md"
                :items="currentAppBar.center.items"
                routerMode />
            </template>
          </div>
        </div>
      </NToolbar>
    </NHeader>
    
    <NPageContainer>
      <!-- <transition name="page-transition" mode="out-in"> -->
        <router-view />
      <!-- </transition> -->
    </NPageContainer>

    <transition name="fade">
      <div class="main-btn-go-to-bottom" v-if="scrollPos > 400">
        <NBtn
          round
          icon="arrow_up"
          color="white"
          textColor="dark"
          @click="goToTop" />
      </div>
    </transition>
  </NLayout>

</template>

<script>

import bus from '../utils/bus'
import * as types from '../store/mutation-types'
import logoSrc from '../assets/img/logo-simple-black.svg'

import { getLinkByData, tsNow } from '../utils'
import { getScrollTarget, setScrollPosition } from '../utils/scroll'
import { getAnchorProps } from '../utils/position-engine'

import { mapGetters, mapMutations, mapActions } from 'vuex'

export default  {
  name: 'MainContainer',
  data () {
    return {
      logoSrc,

      search: '',
      searchMode: false,

      notifSettingsOpened: false,
      miniProfileOpened: false,

      scrollPos: 0
    }
  },
  computed: {
    notifEnable: {
      set (value) {
        this.$store.commit(types.NOTIFICATIONS_SET_ENABLED, value)
      },
      get () {
        return this.$store.getters.notifEnabled
      }
    },
    notifSoundEnable: {
      set (value) {
        this.$store.commit(types.NOTIFICATIONS_SET_SOUND_ENABLED, value)
      },
      get () {
        return this.$store.getters.notifSoundEnabled
      }
    },
    ...mapGetters([
      'currentAppBar',
      'countersData',
      'mpInited'
    ])
  },
  methods: {
    getLinkByData,
    onClickOusideSearchInput (e) {
      if (e.target.closest('.search-layer')) return false
      else {
        this.$refs.searchModule.clear()
        this.onSearchClose()
      }
    },
    onSearchClose () {
      this.search = ''
      this.toggleSearch()
    },
    toggleSearch () {
      this.searchMode = !this.searchMode
    },
    afterSearchEnter () {
      if (this.searchMode) this.$refs.searchInput.focus()
    },

    logOut () {
      this.$store.dispatch(types.AUTH_LOG_OUT)
      this.$router.push({ name: 'index' })
    },

    onLayoutScroll ({ position }) {
      this.scrollPos = position
    },

    onLayoutResize () {},

    goToTop () {
      const target = getScrollTarget(this.$refs.layout.$el)
      setScrollPosition(target, 0, 200)
    },
    
    runCallback (callback) {
      bus.$emit('appbar-cb', callback)
    }
  }
}

</script>

<style lang="scss">
@import '../sass/_imports.scss';

.main-btn-go-to-bottom {
  position: fixed;
  bottom: 0;
  padding: 16px;
  right: 50%;
  transform: translateX(564px);
  .n-btn {
    box-shadow: $bs--border-outer;
  }
}

</style>