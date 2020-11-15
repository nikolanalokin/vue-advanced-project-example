export default {
  computed: {
    /**
     * albums: "1"
     * audios: "81"
     * contacts: "0"
     * events: "2"
     * links: "0"
     * members: "1"
     * photos: "1"
     * posts: "0"
     * videos: "0"
     * radios: "0"
     */
    cAlbums () { 
      return this.gData.counters && +this.gData.counters.albums
    },
    cAudios () { 
      return this.gData.counters && +this.gData.counters.audios
    },
    cContacts () { 
      return this.gData.counters && +this.gData.counters.contacts
    },
    cEvents () { 
      return this.gData.counters && +this.gData.counters.events
    },
    cLinks () { 
      return this.gData.counters && +this.gData.counters.links
    },
    cMembers () { 
      return this.gData.counters && +this.gData.counters.members
    },
    cPhotos () { 
      return this.gData.counters && +this.gData.counters.photos
    },
    cPosts () { 
      return this.gData.counters && +this.gData.counters.posts
    },
    cVideos () { 
      return this.gData.counters && +this.gData.counters.videos
    },
    cRadios () { 
      return this.gData.counters && +this.gData.counters.radios
    },
    cStocks () { 
      return this.gData.counters && +this.gData.counters.stocks
    },
    сStickers () { 
      return this.gData.counters && +this.gData.counters.stickers
    },
  }
}