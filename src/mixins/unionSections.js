export default {
  computed: {
    /**
     * albums
     * audios
     * comments
     * messages
     * posts
     * videos
     * contacts
     * links
     */
    sAlbums () {
      return this.gData.sections && +this.gData.sections.albums
    },
    sAudios () {
      return this.gData.sections && +this.gData.sections.audios
    },
    sVideos () {
      return this.gData.sections && +this.gData.sections.videos
    },
    sPosts () {
      return this.gData.sections && +this.gData.sections.posts
    },
    sContacts () {
      return this.gData.sections && +this.gData.sections.contacts
    },
    sComments () {
      return this.gData.sections && +this.gData.sections.comments
    },
    sMessages () {
      return this.gData.sections && +this.gData.sections.messages
    },
    sLinks () {
      return this.gData.sections && +this.gData.sections.links
    },
    sEvents () {
      return this.gData.sections && +this.gData.sections.events
    },
    sRadios () {
      return this.gData.sections && +this.gData.sections.radios
    },
    sStocks () {
      return this.gData.sections && +this.gData.sections.stocks
    },
    sLives () {
      return this.gData.sections && +this.gData.sections.lives
    },
    sStickers () {
      return this.gData.sections && +this.gData.sections.stickers
    },
  }
}