<template>
  <div class="mt-6">
    <div class="mb-4 flex justify-between items-center">
      <div class="space-x-2">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari username..."
          class="w-[10rem] h-[2rem] border rounded-sm text-xs 3xl:text-sm px-2 text-gray-600 placeholder-gray-600"
        />

        <select
          v-model="filterRole"
          class="w-[10rem] h-[2rem] border rounded-sm text-xs 3xl:text-sm px-2 text-gray-600"
        >
          <option value="">Semua Role</option>
          <option value="admin">Admin</option>
          <option value="pimpinan">Pimpinan</option>
          <option value="staf">Staf</option>
        </select>

        <select
          v-model="filterJabatan"
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
      <div class="flex">
        <div
          class="bg-blue-500 hover:bg-blue-600 rounded-sm flex items-center px-2 py-1"
        >
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="fill-white size-6"
              viewBox="0 0 256 256"
            >
              <path
                d="M256,136a8,8,0,0,1-8,8H232v16a8,8,0,0,1-16,0V144H200a8,8,0,0,1,0-16h16V112a8,8,0,0,1,16,0v16h16A8,8,0,0,1,256,136Zm-57.87,58.85a8,8,0,0,1-12.26,10.3C165.75,181.19,138.09,168,108,168s-57.75,13.19-77.87,37.15a8,8,0,0,1-12.25-10.3c14.94-17.78,33.52-30.41,54.17-37.17a68,68,0,1,1,71.9,0C164.6,164.44,183.18,177.07,198.13,194.85ZM108,152a52,52,0,1,0-52-52A52.06,52.06,0,0,0,108,152Z"
              ></path>
            </svg>
          </div>
          <div>
            <button
              @click="openModal"
              class="px-2 text-white text-xs 3xl:text-sm"
            >
              Tambah User
            </button>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="isModalOpen"
      class="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center"
    >
      <div class="bg-white p-6 w-96 rounded-md">
        <div class="flex justify-between">
          <div>
            <h3 class="text-xl font-medium mb-4">Tambah User Baru</h3>
          </div>

          <div>
            <button @click="closeModal">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                fill="#000000"
                viewBox="0 0 256 256"
              >
                <path
                  d="M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32Zm0,176H48V48H208V208ZM165.66,101.66,139.31,128l26.35,26.34a8,8,0,0,1-11.32,11.32L128,139.31l-26.34,26.35a8,8,0,0,1-11.32-11.32L116.69,128,90.34,101.66a8,8,0,0,1,11.32-11.32L128,116.69l26.34-26.35a8,8,0,0,1,11.32,11.32Z"
                ></path>
              </svg>
            </button>
          </div>
        </div>
        <form @submit.prevent="createUser" class="space-y-4">
          <div>
            <input
              v-model="newUser.username"
              type="text"
              placeholder="Username"
              required
              class="w-full px-2 py-1 border border-gray-400 text-xs 3xl:text-sm"
            />
          </div>
          <div>
            <input
              v-model="newUser.email"
              type="email"
              placeholder="Email"
              required
              class="w-full px-2 py-1 border border-gray-400 text-xs 3xl:text-sm"
            />
          </div>
          <div>
            <input
              v-model="newUser.password"
              type="password"
              placeholder="Password"
              required
              class="w-full px-2 py-1 border border-gray-400 text-xs 3xl:text-sm"
            />
          </div>
          <div>
            <select
              v-model="newUser.role"
              class="w-full px-2 py-1 border border-gray-400 text-xs 3xl:text-sm"
            >
              <option value="" disabled selected>Role</option>
              <option value="admin">Admin</option>
              <option value="pimpinan">Pimpinan</option>
              <option value="staf">Staf</option>
            </select>
          </div>
          <div>
            <select
              v-model="newUser.jabatan"
              class="w-full px-2 py-1 border border-gray-400 text-xs 3xl:text-sm"
            >
              <option value="" disabled selected>Semua Jabatan</option>
              <option value="Kepala Bagian Perencanaan dan Pelaporan">
                Kepala Bagian Perencanaan dan Pelaporan
              </option>
              <option value="Kepala Bagian Protokol">
                Kepala Bagian Protokol
              </option>
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
            type="submit"
            class="w-full py-2 bg-blue-500 text-white hover:bg-blue-600 transition duration-300"
          >
            Tambah User
          </button>
        </form>
      </div>
    </div>

    <div>
      <table class="min-w-full bg-white border border-gray-300">
        <thead>
          <tr class="bg-gray-100">
            <th
              class="px-4 py-2 border border-gray-200 text-gray-600 font-semibold text-xs uppercase"
            >
              Username
            </th>
            <th
              class="px-4 py-2 border border-gray-200 text-gray-600 font-semibold text-xs uppercase"
            >
              Email
            </th>
            <th
              class="px-4 py-2 border border-gray-200 text-gray-600 font-semibold text-xs uppercase"
            >
              Role
            </th>
            <th
              class="px-4 py-2 border border-gray-200 text-gray-600 font-semibold text-xs uppercase"
            >
              jabatan
            </th>
            <th
              class="px-4 py-2 border border-gray-200 text-gray-600 font-semibold text-xs uppercase"
            >
              Status
            </th>
            <th
              class="px-4 py-2 border border-gray-200 text-gray-600 font-semibold text-xs uppercase"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in filteredUsers" :key="user._id">
            <td
              class="px-4 border font-light text-xs 3xl:text-sm text-gray-600 capitalize text-center"
            >
              {{ user.username }}
            </td>
            <td
              class="px-4 border font-light text-xs 3xl:text-sm text-gray-600 lowercase text-center"
            >
              {{ user.email }}
            </td>
            <td
              class="px-4 border font-light text-xs 3xl:text-sm text-gray-600 capitalize text-center"
            >
              {{ user.role }}
            </td>
            <td
              class="px-4 border font-light text-xs 3xl:text-sm text-gray-600 capitalize text-center"
            >
              {{ user.jabatan }}
            </td>
            <td
              v-if="user.status === 'active'"
              class="px-4 border font-light text-xs 3xl:text-sm text-gray-600 capitalize text-center"
            >
              aktif
            </td>
            <td
              class="px-4 border font-light text-xs 3xl:text-sm text-gray-600 capitalize text-center"
              v-else
            >
              belum aktif
            </td>
            <td
              class="px-4 border font-light text-xs 3xl:text-sm text-gray-600 capitalize text-center"
            >
              <div class="flex justify-center items-center space-x-4">
                <div>
                  <button
                    v-if="user.status === 'inactive'"
                    @click="updateUserStatus(user._id, 'active')"
                    class="relative group"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="32"
                      height="32"
                      class="fill-marydeep"
                      viewBox="0 0 256 256"
                    >
                      <path
                        d="M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34ZM232,128A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z"
                      ></path>
                    </svg>
                    <span
                      class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs bg-black text-white rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap"
                    >
                      Set Aktif
                    </span>
                  </button>
                  <button
                    v-else
                    @click="updateUserStatus(user._id, 'inactive')"
                    class="relative group"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="32"
                      height="32"
                      class="fill-gray-600 size-6"
                      viewBox="0 0 256 256"
                    >
                      <path
                        d="M128,112a28,28,0,0,0-8,54.83V184a8,8,0,0,0,16,0V166.83A28,28,0,0,0,128,112Zm0,40a12,12,0,1,1,12-12A12,12,0,0,1,128,152Zm80-72H176V56a48,48,0,0,0-96,0V80H48A16,16,0,0,0,32,96V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V96A16,16,0,0,0,208,80ZM96,56a32,32,0,0,1,64,0V80H96ZM208,208H48V96H208V208Z"
                      ></path>
                    </svg>
                    <span
                      class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs bg-black text-white rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap"
                    >
                      Set Tidak Aktif
                    </span>
                  </button>
                </div>
                <button @click="deleteUser(user._id)" class="relative group">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="fill-red-500 size-6"
                    viewBox="0 0 256 256"
                  >
                    <path
                      d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z"
                    ></path>
                  </svg>
                  <span
                    class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs bg-black text-white rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap"
                  >
                    Hapus
                  </span>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <p v-if="filteredUsers.length === 0" class="text-gray-500 mt-4">
        No users to display.
      </p>
    </div>
  </div>
</template>

<script>
import UserApi from "../services/comUser";

export default {
  data() {
    return {
      users: [],
      newUser: {
        username: "",
        email: "",
        password: "",
        role: "user",
        jabatan: "",
      },
      isModalOpen: false,
      searchQuery: "",
      filterRole: "",
      filterJabatan: "",
    };
  },
  mounted() {
    this.fetchUsers();
  },
  computed: {
    filteredUsers() {
      return this.users.filter((u) => {
        const matchName = u.username
          .toLowerCase()
          .includes(this.searchQuery.toLowerCase());

        const matchRole = this.filterRole ? u.role === this.filterRole : true;

        const matchJab = this.filterJabatan
          ? u.jabatan === this.filterJabatan
          : true;
        return matchName && matchRole && matchJab;
      });
    },
  },
  methods: {
    openModal() {
      this.isModalOpen = true;
    },

    closeModal() {
      this.isModalOpen = false;
    },
    fetchUsers(status) {
      UserApi.getUsersAll(status)
        .then((response) => {
          this.users = response.data.data;
        })
        .catch((error) => {
          console.error("Error fetching users:", error);
        });
    },
    createUser() {
      UserApi.createUser(this.newUser)
        .then((response) => {
          alert("User created successfully!");
          this.fetchUsers();
          this.closeModal();
          console.log(response);
        })
        .catch((error) => {
          console.error("Error creating user:", error);
        });
    },

    updateUserStatus(id, status) {
      UserApi.updateUserStatus(id, status)
        .then((response) => {
          alert(`User status updated to ${status}`);
          this.fetchUsers();
          console.log(response);
        })
        .catch((error) => {
          console.error("Error updating user status:", error);
        });
    },

    deleteUser(id) {
      if (confirm("Are you sure you want to delete this user?")) {
        UserApi.deleteUser(id)
          .then((response) => {
            alert("User deleted successfully!");
            this.fetchUsers();
            console.log(response);
          })
          .catch((error) => {
            console.error("Error deleting user:", error);
          });
      }
    },
  },
};
</script>
