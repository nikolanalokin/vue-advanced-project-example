<template>

<NPage class="py-md">
  <div class="row no-wrap">
    <div class="col-9 pr-md">
      <NBlock class="pa-md" v-if="$route.name == 'legal'">
        <h2 class="text-center pb-md pt-sm">Правовая информация</h2>
        <NList>
          <NItem :to="{ name: 'licence' }">
            <NItemSection side>
              <NIcon name="note" color="dark-s" />
            </NItemSection>

            <NItemSection>
              <NItemLabel class="text-body-n-bold">Лицензионное соглашение</NItemLabel>
            </NItemSection>
          </NItem>
          <NItem :to="{ name: 'terms' }">
            <NItemSection side>
              <NIcon name="note" color="dark-s" />
            </NItemSection>

            <NItemSection>
              <NItemLabel class="text-body-n-bold">Правила пользования</NItemLabel>
            </NItemSection>
          </NItem>
          <NItem :to="{ name: 'ccterms' }">
            <NItemSection side>
              <NIcon name="note" color="dark-s" />
            </NItemSection>

            <NItemSection>
              <NItemLabel class="text-body-n-bold">Правила рассмотрения заявлений</NItemLabel>
            </NItemSection>
          </NItem>
        </NList>
      </NBlock>

      <NBlock class="pa-lg" v-else>
        <router-view />
      </NBlock>
    </div>
    
    <div class="col-3">
      <div v-sticky="{ stickyTop: 48 + 16, zIndex: 1 }">
        <NBlock class="py-sm">
          <NSideNav
            v-model="section"
            :items="navItems" />
        </NBlock>
      </div>
    </div>
  </div>
</NPage>

</template>

<script>

export default  {
  name: 'TermsPage',
  data () {
    return {
      section: null
    }
  },
  watch: {
    '$route' (to) {
      this.section = to.name
    }
  },
  computed: {
    navItems () {
      return [
        {
          to: { name: 'licence' },
          value: 'licence',
          label: 'Лицензионное соглашение',
        },
        {
          to: { name: 'terms' },
          value: 'terms',
          label: 'Правила пользования',
        },
        {
          to: { name: 'ccterms' },
          value: 'ccterms',
          label: 'Правила рассмотрения заявлений',
        }
      ]
    }
  },
  meta () {
    return {
      meta: [
        {
          vmid: 'description',
          name: 'description',
          content: 'Правила и лицензионное соглашение'
        }
      ]
    }
  }
}

</script>