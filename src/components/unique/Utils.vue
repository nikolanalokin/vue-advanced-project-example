<template>

  <div id="utils">
    <portal-target name="utils" slim></portal-target>

    <NNotificationsContainer />
    
    <NModal />

    <ModalTerms />

    <ModalAlert />
    <ModalConfirm />
    <ModalPrompt />

    <ModalLogIn />
    <ModalAfterRegister />
    
    <iframe id="utils_iframe" src="about:blank" style="display: none"></iframe>
  </div>
  
</template>

<script>

export default {
  name: 'Utils'
}

</script>

<style>

#utils {
  position: absolute;
  left: 0;
  top: 0;
}

</style>