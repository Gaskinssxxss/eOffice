<template>
  <div class="mt-20 3xl:mt-40 flex justify-center">
    <form
      @submit.prevent="login()"
      class="border border-gray-200 rounded-md p-4 3xl:p-8"
    >
      <h1 class="text-xl font-semibold text-center mb-6">Login</h1>

      <div class="form-part mb-4">
        <label
          for="email"
          class="block text-xs 3xl:text-sm font-medium text-gray-700"
          >Email</label
        >
        <input
          type="email"
          v-model="email"
          id="email"
          placeholder="Email"
          required
          class="mt-2 p-2 w-[20rem] border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div class="form-part mb-4">
        <label
          for="password"
          class="block text-xs 3xl:text-sm font-medium text-gray-700"
          >Password</label
        >
        <input
          type="password"
          v-model="password"
          id="password"
          placeholder="Password"
          required
          class="mt-2 p-2 w-[20rem] border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        class="w-[20rem] py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 text-base"
      >
        Login
      </button>
    </form>
  </div>
</template>

<script>
export default {
  name: "LoginView",
  data() {
    return {
      email: "",
      password: "",
    };
  },
  computed: {
    isUserLoggedIn() {
      return this.$store.state.userLoggedIn;
    },
  },
  methods: {
    async login() {
      try {
        await this.$store.dispatch("login", {
          email: this.email,
          password: this.password,
        });

        await this.$store.dispatch("updateStore");

        if (this.isUserLoggedIn) {
          this.$toast.success("Login Sukses.", {
            position: "bottom-left",
            duration: 1000,
          });
          this.$router.push("/").then(() => {
            window.location.reload();
          });
        }
      } catch (err) {
        console.log(err);
        this.$toast.error(`Login Gagal! Akun Anda Belum Aktif.`, {
          position: "bottom-left",
          duration: 1000,
        });
      }
    },
  },
};
</script>
