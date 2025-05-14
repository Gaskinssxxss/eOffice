<template>
  <nav class="font-roboto">
    <div class="pt-4 pb-4 flex justify-between items-center">
      <div class="text-lg font-semibold cursor-pointer">
        <router-link to="/" class="font-Oswald">
          <h1 class="text-white text-xl tracking-wider font-normal">
            e-Office
          </h1>
        </router-link>
      </div>
      <div v-if="isLoggin">
        <div class="flex justify-between space-x-2 2xl:space-x-4">
          <div class="flex space-x-2 2xl:space-x-4">
            <div>
              <router-link
                to="/"
                class="text-white transition duration-300 rounded-t-md py-2 px-4"
                :class="{
                  'bg-gray-200 text-black rounded-t-md': $route.path === '/',
                  'text-white': $route.path !== '/',
                }"
              >
                Beranda
              </router-link>
            </div>
            <div>
              <router-link
                to="/surat"
                class="text-white transition duration-300 rounded-t-md py-2 px-4"
                :class="{
                  'bg-gray-200 text-black rounded-t-md':
                    $route.path === '/surat',
                  'text-white': $route.path !== '/surat',
                }"
              >
                Managemen Surat
              </router-link>
            </div>
            <div>
              <router-link
                to="/surat/arsip"
                class="text-white transition duration-300 rounded-t-md py-2 px-4"
                :class="{
                  'bg-gray-200 text-black rounded-t-md':
                    $route.path === '/surat/arsip',
                  'text-white': $route.path !== '/surat/arsip',
                }"
              >
                Data Arsip
              </router-link>
            </div>
            <div v-if="userInfo.role === 'admin'">
              <router-link
                to="/users"
                class="text-white transition duration-300 rounded-t-md py-2 px-4"
                :class="{
                  'bg-gray-200 text-black rounded-t-md':
                    $route.path === '/users',
                  'text-white': $route.path !== '/users',
                }"
              >
                Managemen User
              </router-link>
            </div>
            <div>
              <router-link
                to="/chat"
                class="text-white transition duration-300 rounded-t-md py-2 px-4"
                :class="{
                  'bg-gray-200 text-black rounded-t-md':
                    $route.path === '/chat',
                  'text-white': $route.path !== '/chat',
                }"
              >
                Chat
              </router-link>
            </div>
          </div>
        </div>
      </div>
      <div v-if="isLoggin" class="flex space-x-2 2xl:space-x-4 items-center">
        <div>
          <h1 class="text-white">
            {{ userInfo.username }} ({{ userInfo.jabatan }})
          </h1>
        </div>
        <button @click="logout" class="bg-red-700 hover:bg-red-800 rounded-sm">
          <h1 class="text-white px-4 py-1">Logout</h1>
        </button>
      </div>
      <div v-else class="flex space-x-2 2xl:space-x-4">
        <div>
          <router-link
            to="/login"
            class="text-white transition duration-300 rounded-t-md py-2 px-4"
            :class="{
              'bg-gray-200 text-black rounded-t-md': $route.path === '/login',
              'text-white': $route.path !== '/login',
            }"
          >
            Login
          </router-link>
        </div>
        <div>
          <router-link
            to="/register"
            class="text-white transition duration-300 rounded-t-md py-2 px-4"
            :class="{
              'bg-gray-200 text-black rounded-t-md':
                $route.path === '/register',
              'text-white': $route.path !== '/register',
            }"
          >
            Register
          </router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import router from "@/services/router";

export default {
  computed: {
    isLoggin() {
      return this.$store.getters.isUserLoggedIn;
    },
    userInfo() {
      const user = this.$store.state.user || {};
      return {
        username: user.username || "",
        role: user.role || "",
        email: user.email || "",
        jabatan: user.jabatan || "",
      };
    },
  },
  methods: {
    async logout() {
      try {
        await this.$store.dispatch("logout");
        if (!this.isUserLoggedIn) {
          this.$toast.success("Successfully logged out.", {
            position: "bottom-left",
            duration: 1000,
          });
        }
        setTimeout(() => {
          window.location.reload();
          router.push("/login");
        }, 100);
      } catch (e) {
        console.log(e);
        this.$toast.error("Couldn't log out.", {
          position: "bottom-left",
          duration: 1000,
        });
      }
    },
  },
};
</script>

<style scoped>
.router-link-active {
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
  color: black;
}

.router-link-active,
.router-link-active:hover {
  transition: all 0.3s ease-in-out;
}
</style>
