<template>
  <div class="mt-10 3xl:mt-20 flex justify-center">
    <form
      @submit.prevent="register"
      class="border border-gray-200 rounded-md p-4 3xl:p-8"
    >
      <h1 class="text-xl font-semibold text-center mb-6">Register</h1>
      <div class="form-part mb-2 3xl:mb-4">
        <label
          for="username"
          class="block text-xs 3xl:text-sm font-medium text-gray-700"
          >Username</label
        >
        <input
          type="text"
          v-model="username"
          id="username"
          placeholder="Username"
          required
          class="mt-2 p-2 w-[20rem] text-xs 3xl:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div class="form-part mb-2 3xl:mb-4">
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
          class="mt-2 p-2 w-[20rem] text-xs 3xl:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div class="form-part mb-2 3xl:mb-4">
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
          class="mt-2 p-2 w-[20rem] text-xs 3xl:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div class="form-part mb-2 3xl:mb-4">
        <label
          for="role"
          class="block text-xs 3xl:text-sm font-medium text-gray-700"
          >Role</label
        >
        <select
          v-model="role"
          id="role"
          required
          class="mt-2 p-2 w-[20rem] text-xs 3xl:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Role</option>
          <option value="admin">Admin</option>
          <option value="pimpinan">Pimpinan</option>
          <option value="staf">Staf</option>
        </select>
      </div>

      <div class="form-part mb-6">
        <label
          for="jabatan"
          class="block text-xs 3xl:text-sm font-medium text-gray-700"
          >Jabatan</label
        >
        <select
          v-model="jabatan"
          class="w-[10rem] h-[2rem] border rounded-sm text-xs 3xl:text-sm px-2 text-gray-600"
        >
          <option value="">Semua Jabatan</option>
          <option value="Kepala Bagian Perencanaan dan Pelaporan">
            Kepala Bagian Perencanaan dan Pelaporan
          </option>
          <option value="Kepala Bagian Protokol">Kepala Bagian Protokol</option>
          <option value="Kepala Bagian Materi dan Komunikasi Pimpinan">
            Kepala Bagian Materi dan Komunikasi Pimpinan
          </option>
          <option value="Kepala Sub Bagian Tata Usaha">
            Kepala Sub Bagian Tata Usaha
          </option>
          <option value="staf">staf</option>
        </select>
      </div>

      <button
        class="w-[20rem] py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
      >
        Register
      </button>
    </form>
  </div>
</template>

<script>
import Api from "@/services/api";

export default {
  name: "RegisterView",
  data() {
    return {
      username: "",
      email: "",
      password: "",
      role: "",
      jabatan: "",
    };
  },
  methods: {
    register() {
      Api.post("/users/register", {
        username: this.username,
        email: this.email,
        password: this.password,
        role: this.role,
        jabatan: this.jabatan,
      })
        .then(() => {
          this.$toast.success("Registration succeeded!", {
            position: "bottom-left",
            duration: 1000,
          });
          this.$router.push("/login");
        })
        .catch((err) => {
          console.log(err);
          this.$toast.error("Registration failed!", {
            position: "bottom-left",
            duration: 1000,
          });
        });
    },
  },
};
</script>
