<template>
  <div>
    <div v-if="isDesktop">
      <div class="bg-blue-500">
        <NavigationBar class="px-12 2xl:px-32 3xl:px-52" />
      </div>
      <router-view class="font-Public px-12 2xl:px-32 3xl:px-52 capitalize" />
    </div>

    <div v-if="!isDesktop">
      <SuggestlView />
    </div>
  </div>
</template>

<script>
import NavigationBar from "./components/NavigationBar.vue";
import SuggestlView from "./views/SuggestlView.vue";

export default {
  components: {
    NavigationBar,
    SuggestlView,
  },
  data() {
    return {
      isDesktop: false,
    };
  },
  mounted() {
    this.checkScreenSize();
    window.addEventListener("resize", this.checkScreenSize);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.checkScreenSize);
  },
  methods: {
    checkScreenSize() {
      this.isDesktop = window.innerWidth >= 1024;
    },
  },
};
</script>
