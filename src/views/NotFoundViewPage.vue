<template>

  <NLayout class="bg-dark theme_dark">

    <NPageContainer>
      <NPage class="py-xl px-md row flex-center">
        <main class="mx-auto text-center column items-center">
          <div class="__logo-svg-container">
            <svg class="__logo-svg">
              <use xlink:href="#logo-svg"></use>
            </svg>
            <svg class="__logo-svg">
              <use xlink:href="#logo-svg"></use>
            </svg>
            <svg class="__logo-svg">
              <use xlink:href="#logo-svg"></use>
            </svg>
          </div>

          <h1 class="not-found-header text-h3 mt-lg" data-text="Страница не найдена">Страница не найдена</h1>

          <svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
            <symbol id="logo-svg" viewBox="0 0 52.16 32">
              <path d="M36.16,0A16,16,0,0,0,22.32,24H14.16a4,4,0,0,1-4-4V5a4,4,0,0,0-4-4H0A15.9,15.9,0,0,1,2.16,9V20a12,12,0,0,0,12,12h22a16,16,0,0,0,0-32ZM44,17.44A8.16,8.16,0,0,1,35.91,24H30.32a15.91,15.91,0,0,1-2.15-7.38,8.19,8.19,0,0,1,6.47-8.48A8,8,0,0,1,44,17.44Z" fill="#fff"/>
            </symbol>
          </svg>

          <NBtn 
            class="mt-xl"
            color="white"
            text-color="black"
            label="Назад"
            @click="$router.back()" />
        </main>
      </NPage>
    </NPageContainer>

  </NLayout>

</template>

<script>

export default  {
  name: 'NotFoundViewPage',
}

</script>