export default {
  computed: {
    /**
     * albums: "4"
     * audios: "14"
     * communities: "7"
     * events: "2"
     * friends: "25"
     * places: "15"
     * posts: "15"
     * subscribers: "0"
     * videos: "3"
     * gifts: "0"
     */
    cAlbums () { 
      return this.uData.counters && +this.uData.counters.albums
    },
    cAudios () { 
      return this.uData.counters && +this.uData.counters.audios
    },
    cCommunities () { 
      return this.uData.counters && +this.uData.counters.communities
    },
    cPlaces () { 
      return this.uData.counters && +this.uData.counters.places
    },
    cEvents () { 
      return this.uData.counters && +this.uData.counters.events
    },
    cContancts () { 
      return this.uData.counters && +this.uData.counters.friends
    },
    cSubscribers () { 
      return this.uData.counters && +this.uData.counters.subscribers
    },
    cPosts () { 
      return this.uData.counters && +this.uData.counters.posts
    },
    cVideos () { 
      return this.uData.counters && +this.uData.counters.videos
    },
    cPhotos () { 
      return this.uData.counters && +this.uData.counters.photos
    },
    cGifts () { 
      return this.uData.counters && +this.uData.counters.gifts
    },
  }
}