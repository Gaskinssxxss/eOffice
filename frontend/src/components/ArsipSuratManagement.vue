<template>
  <div class="py-8 space-y-4">
    <div class="flex space-x-2 items-end">
      <div class="flex space-x-2">
        <input
          v-model="filters.q"
          type="text"
          placeholder="Nomor surat..."
          class="w-[10rem] h-[2rem] border rounded-sm text-xs 3xl:text-sm px-2 placeholder-gray-600 text-gray-600"
        />

        <select
          v-model="filters.sender"
          class="w-[10rem] h-[2rem] border rounded-sm text-xs 3xl:text-sm px-2 text-gray-600"
        >
          <option value="">Pengirim</option>
          <option v-for="u in distinctSenders" :key="u" :value="u">
            {{ u }}
          </option>
        </select>

        <select
          v-model="filters.receiver"
          class="w-[10rem] h-[2rem] border rounded-sm text-xs 3xl:text-sm px-2 text-gray-600"
        >
          <option value="">Penerima</option>
          <option v-for="u in distinctReceivers" :key="u" :value="u">
            {{ u }}
          </option>
        </select>
      </div>
      <div class="flex space-x-2">
        <div>
          <label class="block text-sm mb-1">Start :</label>
          <input
            v-model="filters.dateFrom"
            type="date"
            class="w-[10rem] h-[2rem] border rounded-sm text-xs 3xl:text-sm px-2 text-gray-600"
          />
        </div>

        <div>
          <label class="block text-sm mb-1">End:</label>
          <input
            v-model="filters.dateTo"
            type="date"
            class="w-[10rem] h-[2rem] border rounded-sm text-xs 3xl:text-sm px-2 text-gray-600"
          />
        </div>
      </div>
    </div>

    <div class="w-auto overflow-x-auto">
      <table class="min-w-full bg-white border border-gray-200">
        <thead>
          <tr class="bg-gray-100">
            <th
              class="px-4 py-2 border border-gray-200 text-gray-600 font-semibold text-xs uppercase whitespace-nowrap"
            >
              Tanggal Arsip
            </th>
            <th
              class="px-4 py-2 border border-gray-200 text-gray-600 font-semibold text-xs uppercase whitespace-nowrap"
            >
              Nomor Surat
            </th>
            <th
              class="px-4 py-2 border border-gray-200 text-gray-600 font-semibold text-xs uppercase whitespace-nowrap"
            >
              Perihal
            </th>
            <th
              class="px-4 py-2 border border-gray-200 text-gray-600 font-semibold text-xs uppercase whitespace-nowrap"
            >
              Pengirim
            </th>
            <th
              class="px-4 py-2 border border-gray-200 text-gray-600 font-semibold text-xs uppercase whitespace-nowrap"
            >
              Penerima
            </th>
            <th
              class="px-4 py-2 border border-gray-200 text-gray-600 font-semibold text-xs uppercase whitespace-nowrap"
            >
              Status
            </th>
            <th
              class="px-4 py-2 border border-gray-200 text-gray-600 font-semibold text-xs uppercase whitespace-nowrap"
            >
              Tindak Lanjut
            </th>
            <th
              class="px-4 py-2 border border-gray-200 text-gray-600 font-semibold text-xs uppercase whitespace-nowrap"
            >
              Method
            </th>
            <th
              class="px-4 py-2 border border-gray-200 text-gray-600 font-semibold text-xs uppercase whitespace-nowrap"
            >
              Lampiran
            </th>
            <th
              class="px-4 py-2 border border-gray-200 text-gray-600 font-semibold text-xs uppercase whitespace-nowrap"
            >
              Ket
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="arsip in filteredArsips"
            :key="arsip._id"
            class="text-center"
          >
            <td
              class="px-4 border font-light text-xs 3xl:text-sm text-gray-600 capitalize whitespace-nowrap"
            >
              {{ formatDate(arsip.archivedAt) }}
            </td>
            <td
              class="px-4 border font-light text-xs 3xl:text-sm text-gray-600 capitalize whitespace-nowrap w-[15rem] max-w-[15rem] overflow-x-auto"
            >
              {{ arsip.nomorSurat }}
            </td>
            <td
              class="px-4 border font-light text-xs 3xl:text-sm text-gray-600 capitalize whitespace-nowrap w-[15rem] max-w-[15rem] overflow-x-auto"
            >
              {{ arsip.perihal }}
            </td>
            <td
              class="px-4 border font-light text-xs 3xl:text-sm text-gray-600 capitalize whitespace-nowrap"
            >
              {{ parseUser(arsip.pengirim).username }}
            </td>
            <td
              class="px-4 border font-light text-xs 3xl:text-sm text-gray-600 capitalize whitespace-nowrap"
            >
              {{ parseUser(arsip.penerima).username }}
            </td>
            <td
              class="px-4 border font-light text-xs 3xl:text-sm text-gray-600 capitalize whitespace-nowrap"
            >
              {{ arsip.status }}
            </td>
            <td
              class="px-4 border font-light text-xs 3xl:text-sm text-gray-600 capitalize whitespace-nowrap"
            >
              {{ arsip.isiTidakLanjut }}
            </td>
            <td
              class="px-4 border font-light text-xs 3xl:text-sm text-gray-600"
            >
              <span v-if="arsip.method === 'POST'"
                ><span class="lowercase">di </span>Buat</span
              >
              <span v-else-if="arsip.method === 'PUT'"
                ><span class="lowercase">di </span>Edit</span
              >
              <span v-else><span class="lowercase">di </span>Hapus</span>
            </td>
            <td
              class="px-4 border font-light text-xs 3xl:text-sm text-gray-600 capitalize whitespace-nowrap"
            >
              <div class="list-disc list-inside">
                <div
                  v-for="(file, idx) in arsip.lampiran"
                  :key="idx"
                  class="truncate max-w-xs"
                >
                  <a :href="getFullPath(file)" target="_blank">
                    <button class="relative group">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="fill-gray-500 hover:fill-black size-6"
                        viewBox="0 0 256 256"
                      >
                        <path
                          d="M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM160,51.31,188.69,80H160ZM200,216H56V40h88V88a8,8,0,0,0,8,8h48V216Zm-32-80a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h64A8,8,0,0,1,168,136Zm0,32a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h64A8,8,0,0,1,168,168Z"
                        ></path>
                      </svg>
                      <span
                        class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs bg-black text-white rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap"
                      >
                        Lampiran
                      </span>
                    </button>
                  </a>
                </div>
              </div>
            </td>
            <td v-if="arsip.keterangan === ''" class="px-2 border">-</td>
            <td v-else class="px-2 border">
              <button @click="openDescKet(arsip)" class="relative group">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="fill-gray-500 hover:fill-black size-6"
                  viewBox="0 0 256 256"
                >
                  <path
                    d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,160H40V56H216V200ZM184,96a8,8,0,0,1-8,8H80a8,8,0,0,1,0-16h96A8,8,0,0,1,184,96Zm0,32a8,8,0,0,1-8,8H80a8,8,0,0,1,0-16h96A8,8,0,0,1,184,128Zm0,32a8,8,0,0,1-8,8H80a8,8,0,0,1,0-16h96A8,8,0,0,1,184,160Z"
                  ></path>
                </svg>
                <span
                  class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs bg-black text-white rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap"
                >
                  Keterangan
                </span>
              </button>
              <div
                v-if="isDesc"
                class="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50"
              >
                <div
                  class="bg-white p-6 max-w-lg h-auto flex flex-col justify-center items-center space-y-4"
                >
                  <div>
                    <h1>{{ arsip.keterangan }}</h1>
                  </div>
                  <div>
                    <button
                      @click="closeDescKet"
                      class="px-4 py-2 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 transition duration-200"
                    >
                      Tutup
                    </button>
                  </div>
                </div>
              </div>
            </td>
          </tr>
          <tr v-if="filteredArsips.length === 0">
            <td
              colspan="9"
              class="py-4 text-center text-xs 3xl:text-sm text-gray-500 w-full"
            >
              Tidak ada data arsip.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div>
      <div
        class="flex justify-end items-center fixed bottom-10 left-0 right-32 z-10"
      >
        <button
          @click="currentPage = Math.max(1, currentPage - 1)"
          :disabled="currentPage === 1"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15.75 19.5 8.25 12l7.5-7.5"
            />
          </svg>
        </button>
        <span class="px-4 py-2 text-gray-600">
          Page {{ currentPage }} of {{ totalPages }}
        </span>
        <button
          @click="currentPage = Math.min(totalPages, currentPage + 1)"
          :disabled="currentPage === totalPages"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m8.25 4.5 7.5 7.5-7.5 7.5"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import comArsip from "../services/comArsipSurat";

export default {
  name: "ArsipSuratManagement",
  data() {
    return {
      arsips: [],
      baseURL: "http://localhost:3000/",
      filters: {
        q: "",
        dateFrom: "",
        dateTo: "",
        sender: "",
        receiver: "",
      },
      isDesc: false,
      currentPage: 1,
      itemsPerPage: 5,
    };
  },
  computed: {
    loggedInUser() {
      return this.$store.state.user.username;
    },
    role() {
      return this.$store.state.user.role;
    },

    visibleByRole() {
      if (this.role === "admin") {
        return this.arsips;
      }
      return this.arsips.filter((a) => {
        const p = this.parseUser(a.pengirim).username;
        const q = this.parseUser(a.penerima).username;
        return p === this.loggedInUser || q === this.loggedInUser;
      });
    },

    distinctSenders() {
      const set = new Set(
        this.arsips.map((a) => this.parseUser(a.pengirim).username)
      );
      return Array.from(set).sort();
    },

    distinctReceivers() {
      const set = new Set(
        this.arsips.map((a) => this.parseUser(a.penerima).username)
      );
      return Array.from(set).sort();
    },
    filteredArsips() {
      const filteredData = this.visibleByRole
        .filter((a) => {
          const t = this.filters.q.toLowerCase();
          if (t) {
            if (
              !a.nomorSurat.toLowerCase().includes(t) &&
              !a.perihal.toLowerCase().includes(t)
            ) {
              return false;
            }
          }
          return true;
        })
        .filter((a) => {
          const d = new Date(a.archivedAt);
          if (this.filters.dateFrom && d < new Date(this.filters.dateFrom)) {
            return false;
          }
          if (this.filters.dateTo && d > new Date(this.filters.dateTo)) {
            return false;
          }
          return true;
        })
        .filter((a) => {
          if (this.filters.sender) {
            return this.parseUser(a.pengirim).username === this.filters.sender;
          }
          return true;
        })
        .filter((a) => {
          if (this.filters.receiver) {
            return (
              this.parseUser(a.penerima).username === this.filters.receiver
            );
          }
          return true;
        });
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      return filteredData.slice(startIndex, startIndex + this.itemsPerPage);
    },

    totalPages() {
      return Math.ceil(this.visibleByRole.length / this.itemsPerPage);
    },
    // filteredArsips() {
    //   return this.visibleByRole
    //     .filter((a) => {
    //       const t = this.filters.q.toLowerCase();
    //       if (t) {
    //         if (
    //           !a.nomorSurat.toLowerCase().includes(t) &&
    //           !a.perihal.toLowerCase().includes(t)
    //         ) {
    //           return false;
    //         }
    //       }
    //       return true;
    //     })
    //     .filter((a) => {
    //       const d = new Date(a.archivedAt);
    //       if (this.filters.dateFrom && d < new Date(this.filters.dateFrom)) {
    //         return false;
    //       }
    //       if (this.filters.dateTo && d > new Date(this.filters.dateTo)) {
    //         return false;
    //       }
    //       return true;
    //     })
    //     .filter((a) => {
    //       if (this.filters.sender) {
    //         return this.parseUser(a.pengirim).username === this.filters.sender;
    //       }
    //       return true;
    //     })
    //     .filter((a) => {
    //       if (this.filters.receiver) {
    //         return (
    //           this.parseUser(a.penerima).username === this.filters.receiver
    //         );
    //       }
    //       return true;
    //     });
    // },
  },
  mounted() {
    this.fetchArsipSurats();
  },
  methods: {
    openDescKet() {
      this.isDesc = true;
    },
    closeDescKet() {
      this.isDesc = false;
    },
    fetchArsipSurats() {
      comArsip
        .getAllArsipSurat()
        .then((res) => {
          this.arsips = res.data.data.map((a) => ({
            ...a,
            archivedAt: new Date(a.archivedAt),
          }));
        })
        .catch((err) => console.error("Error fetching arsip:", err));
    },
    parseUser(str) {
      try {
        return JSON.parse(str);
      } catch {
        return { username: str };
      }
    },
    formatDate(date) {
      const d = new Date(date);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      return `${yyyy}-${mm}-${dd}`;
    },
    getFullPath(path) {
      return this.baseURL + path.replace(/\\\\/g, "/");
    },
  },
};
</script>
