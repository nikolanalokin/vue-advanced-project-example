export default {
  computed: {
    /**
     * can_add_video_from_other_resources: 1
     * can_delete_comments: 1
     * can_edit_audio: 0
     * can_edit_audio_albums: 1
     * can_edit_black_list: 1
     * can_edit_contacts: 1
     * can_edit_events: 1
     * can_edit_manager: 1
     * can_edit_members: 1
     * can_edit_radio: 1
     * can_edit_photo: 1
     * can_edit_photo_albums: 1
     * can_edit_sections: 1
     * can_edit_settings: 1
     * can_edit_sponsors: 1
     * can_edit_status: 1
     * can_edit_stickers: 1
     * can_edit_stocks: 1
     * can_invite: 1
     * can_message: 1
     * can_post: 1
     * can_remove_members: 1
     */
    canUploadVideo () { 
      return this.gData.actions && !!+this.gData.actions.can_add_video_from_other_resources
    },
    canDeleteComments () { 
      return this.gData.actions && !!+this.gData.actions.can_delete_comments
    },
    canEditAudio () { 
      return this.gData.actions && !!+this.gData.actions.can_edit_audio
    },
    canEditRadio () { 
      return this.gData.actions && !!+this.gData.actions.can_edit_radio
    },
    canEditAudioAlbums () { 
      return this.gData.actions && !!+this.gData.actions.can_edit_audio_albums
    },
    canEditBlackList () { 
      return this.gData.actions && !!+this.gData.actions.can_edit_black_list
    },
    canEditContacts () { 
      return this.gData.actions && !!+this.gData.actions.can_edit_contacts
    },
    canEditEvents () { 
      return this.gData.actions && !!+this.gData.actions.can_edit_events
    },
    canEditManager () { 
      return this.gData.actions && !!+this.gData.actions.can_edit_manager
    },
    canEditMembers () { 
      return this.gData.actions && !!+this.gData.actions.can_edit_members
    },
    canEditPhoto () { 
      return this.gData.actions && !!+this.gData.actions.can_edit_photo
    },
    canEditPhotoAlbums () { 
      return this.gData.actions && !!+this.gData.actions.can_edit_photo_albums
    },
    canEditSections () { 
      return this.gData.actions && !!+this.gData.actions.can_edit_sections
    },
    canEditSettings () { 
      return this.gData.actions && !!+this.gData.actions.can_edit_settings
    },
    canEditSponsors () { 
      return this.gData.actions && !!+this.gData.actions.can_edit_sponsors
    },
    canEditStatus () { 
      return this.gData.actions && !!+this.gData.actions.can_edit_status
    },
    canEditStickers () { 
      return this.gData.actions && !!+this.gData.actions.can_edit_stickers
    },
    canEditStock () { 
      return this.gData.actions && !!+this.gData.actions.can_edit_stocks
    },
    canInvite () { 
      return this.gData.actions && !!+this.gData.actions.can_invite
    },
    canPost () { 
      return this.gData.actions && !!+this.gData.actions.can_post
    },
    canMessage () { 
      return this.gData.actions && !!+this.gData.actions.can_message
    },
    canSendMessage () { 
      return this.gData.actions && !!+this.gData.actions.can_send_message
    },
    canRemoveMembers () { 
      return this.gData.actions && !!+this.gData.actions.can_remove_members
    },
  }
}