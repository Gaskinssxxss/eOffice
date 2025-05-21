<template>
  <div class="mt-6">
    <div class="flex justify-between items-center">
      <div class="flex space-x-2 items-center">
        <div>
          <input
            v-model="filters.noSurat"
            type="text"
            placeholder="Cari No Surat"
            class="w-[10rem] border px-2 py-2 focus:outline-none focus:ring-1 focus:ring-gray-200 text-xs font-semibold placeholder-gray-400 capitalize"
          />
        </div>

        <div>
          <input
            v-model="filters.surat_dari"
            type="text"
            placeholder="Cari Surat Dari"
            class="w-[10rem] border px-2 py-2 focus:outline-none focus:ring-1 focus:ring-gray-200 text-xs font-semibold placeholder-gray-400 capitalize"
          />
        </div>

        <div>
          <select
            v-model="filters.sifatSurat"
            class="w-[10rem] border px-2 py-2 focus:outline-none focus:ring-1 focus:ring-gray-200 text-xs font-semibold placeholder-gray-400 capitalize"
          >
            <option value="">Semua Sifat Surat</option>
            <option value="Segera">Segera</option>
            <option value="Penting">Penting</option>
            <option value="Rahasia">Rahasia</option>
            <option value="Biasa">Biasa</option>
          </select>
        </div>

        <div>
          <select
            v-model="filters.diteruskanKepada"
            class="w-[10rem] border px-2 py-2 focus:outline-none focus:ring-1 focus:ring-gray-200 text-xs font-semibold placeholder-gray-400 capitalize"
          >
            <option value="">Semua Penerima</option>
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
          </select>
        </div>

        <div>
          <select
            v-model="filters.disposisi"
            class="w-[10rem] border px-2 py-2 focus:outline-none focus:ring-1 focus:ring-gray-200 text-xs font-semibold placeholder-gray-400 capitalize"
          >
            <option value="">Semua Disposisi</option>
            <option value="Proses Tindak Lanjut">Proses Tindak Lanjut</option>
            <option value="Tanggapan dan Saran">Tanggapan dan Saran</option>
            <option value="Jadwalkan">Jadwalkan</option>
            <option value="Wakili/Dampingi">Wakili/Dampingi</option>
            <option value="Koordinasikan">Koordinasikan</option>
            <option value="File/Arsip">File/Arsip</option>
          </select>
        </div>

        <div>
          <input
            v-model="filters.tglSuratStart"
            type="date"
            placeholder="tanggal"
            class="w-[10rem] border px-2 py-2 focus:outline-none focus:ring-1 focus:ring-gray-200 text-xs font-semibold placeholder-gray-400 capitalize"
          />
        </div>
      </div>

      <div>
        <div class="flex">
          <div>
            <button
              @click="openModalCreate"
              class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm transition"
            >
              Tambah Surat
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="w-full py-6">
    <div class="overflow-x-auto border shadow">
      <table class="w-full divide-y divide-gray-200">
        <thead class="bg-gray-100 uppercase">
          <tr>
            <th
              class="px-4 text-xs py-2 text-center font-semibold text-gray-700 border border-gray-200"
            >
              No Surat
            </th>
            <th
              class="px-4 text-xs py-2 text-center font-semibold text-gray-700 border border-gray-200"
            >
              Lembar Disposisi
            </th>
            <th
              class="px-4 text-xs py-2 text-center font-semibold text-gray-700 border border-gray-200"
            >
              Tanggal Surat
            </th>
            <th
              class="px-4 text-xs py-2 text-center font-semibold text-gray-700 border border-gray-200"
            >
              Lampiran
            </th>
            <th
              class="px-4 text-xs py-2 text-center font-semibold text-gray-700 border border-gray-200"
            >
              Status Lampiran
            </th>
            <th
              class="px-4 text-xs py-2 text-center font-semibold text-gray-700 border border-gray-200"
            >
              Status Surat
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200 w-full">
          <tr
            v-for="arsip in filteredArsipList"
            :key="arsip._id"
            class="hover:bg-gray-50"
          >
            <td
              class="px-4 py-4 text-xs border border-gray-200 text-gray-800 text-center"
            >
              {{ arsip.idSurat?.noSurat || "-" }}
            </td>

            <td class="px-4 py-4 text-xs border border-gray-200 text-center">
              <button
                @click="openLembarDisposisiModal(arsip)"
                class="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
              >
                Lihat
              </button>
            </td>

            <td
              class="px-4 py-4 text-xs border border-gray-200 text-gray-800 text-center"
            >
              {{ formatDate(arsip.idSurat?.tglSurat) }}
            </td>

            <td
              class="px-4 py-4 text-xs border border-gray-200 text-gray-800 text-center"
            >
              <span
                v-if="arsip.idSurat?.lampiran && arsip.idSurat.lampiran.length"
              >
                <div
                  v-for="(file, index) in arsip.idSurat.lampiran"
                  :key="file"
                  class="flex space-x-2"
                >
                  <a
                    :href="getLampiranUrl(file)"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-blue-600 hover:underline"
                  >
                    {{ file }}
                  </a>
                  <span v-if="index < arsip.idSurat.lampiran.length - 1"
                    >,
                  </span>
                </div>
              </span>
              <span v-else>-</span>
            </td>

            <td
              class="px-4 py-4 text-xs border border-gray-200 text-gray-800 text-center"
            >
              {{ arsip.idSurat.status || "-" }}
            </td>
            <td
              class="px-4 py-4 text-xs border border-gray-200 text-gray-800 text-center"
            >
              {{ arsip.Status || "-" }}
            </td>
          </tr>
          <tr v-if="filteredArsipList.length === 0">
            <td colspan="100" class="text-center py-6 text-gray-600">
              Tidak ada arsip surat tersedia.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <transition name="fade">
      <div
        v-if="lembarDisposisiModalVisible"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4"
      >
        <div
          class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 relative shadow-lg text-sm font-sans"
          @click.self="closeLembarDisposisiModal"
        >
          <div class="flex space-x-2 border-b">
            <div>
              <img src="../assets/client/Gambar25.png" alt="" />
            </div>
            <div class="text-center font-bold">
              <h2 class="text-base uppercase tracking-wide">
                PEMERINTAH PROVINSI NUSA TENGGARA BARAT
              </h2>
              <h1 class="text-2xl">SEKRETARIAT DAERAH</h1>
              <h1 class="text-sm font-normal">
                Jln Pejanggik Nomor 12 Telepon 0370 - 622373 Kode Pos 83121<br />
                Website: biroapdim.ntbprov.go.id | Email:
                biroapdim@ntbprov.go.id
              </h1>
            </div>
          </div>

          <h2
            class="text-lg font-bold text-center mb-4 uppercase tracking-wide border-b pb-2"
          >
            LEMBAR DISPOSISI
          </h2>

          <div class="grid grid-cols-2 gap-x-8 mb-4">
            <div class="space-y-1">
              <div>
                <span class="font-semibold">Surat dari :</span>
                {{ detailArsip.idSurat?.surat_dari || "-" }}
              </div>
              <div>
                <span class="font-semibold">No. Surat :</span>
                {{ detailArsip.idSurat?.noSurat || "-" }}
              </div>
              <div>
                <span class="font-semibold">Tgl. Surat :</span>
                {{ formatDate(detailArsip.idSurat?.tglSurat) }}
              </div>
            </div>

            <div class="space-y-1">
              <div>
                <span class="font-semibold">Diterima Tgl. :</span>
                {{ formatDate(detailArsip.idSurat?.diterimaTgl) }}
              </div>
              <div>
                <span class="font-semibold">No. Agenda :</span>
                {{ detailArsip.idSurat?.noAgenda || "-" }}
              </div>
              <div class="flex space-x-2">
                <span class="font-semibold">Sifat Surat :</span>
                <div class="mt-1">
                  <div>
                    <label>
                      <input
                        type="checkbox"
                        disabled
                        :checked="detailArsip.idSurat?.sifatSurat === 'Segera'"
                        class="form-checkbox text-blue-600"
                      />
                      <span>Segera</span>
                    </label>
                    <div>
                      <label>
                        <input
                          type="checkbox"
                          disabled
                          :checked="
                            detailArsip.idSurat?.sifatSurat === 'Penting'
                          "
                          class="form-checkbox text-blue-600"
                        />
                        <span>Penting</span>
                      </label>
                    </div>
                    <div>
                      <label>
                        <input
                          type="checkbox"
                          disabled
                          :checked="
                            detailArsip.idSurat?.sifatSurat === 'Rahasia'
                          "
                          class="form-checkbox text-blue-600"
                        />
                        <span>Rahasia</span>
                      </label>
                    </div>
                    <div>
                      <label>
                        <input
                          type="checkbox"
                          disabled
                          :checked="detailArsip.idSurat?.sifatSurat === 'Biasa'"
                          class="form-checkbox text-blue-600"
                        />
                        <span>Biasa</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="mb-4 border border-gray-300 rounded p-2 min-h-[60px]">
            <div class="font-semibold mb-1">
              Perihal Surat :
              <span class="font-normal">{{
                detailArsip.idSurat?.catatan || "-"
              }}</span>
            </div>
          </div>

          <div class="flex space-x-2 mb-4 border border-gray-300 rounded p-2">
            <div class="font-semibold mb-2">Diteruskan Kepada :</div>
            <div>
              <div>
                <label>
                  <input
                    type="checkbox"
                    disabled
                    :checked="
                      detailArsip.idSurat?.diteruskanKepada &&
                      detailArsip.idSurat.diteruskanKepada.includes(
                        'Kepala Bagian Perencanaan dan Pelaporan'
                      )
                    "
                    class="form-checkbox text-green-600"
                  />
                  <span>Kepala Bagian Perencanaan dan Pelaporan</span>
                </label>
              </div>
              <div>
                <label>
                  <input
                    type="checkbox"
                    disabled
                    :checked="
                      detailArsip.idSurat?.diteruskanKepada &&
                      detailArsip.idSurat.diteruskanKepada.includes(
                        'Kepala Bagian Protokol'
                      )
                    "
                    class="form-checkbox text-green-600"
                  />
                  <span>Kepala Bagian Protokol</span>
                </label>
              </div>
              <div>
                <label>
                  <input
                    type="checkbox"
                    disabled
                    :checked="
                      detailArsip.idSurat?.diteruskanKepada &&
                      detailArsip.idSurat.diteruskanKepada.includes(
                        'Kepala Bagian Materi dan Komunikasi Pimpinan'
                      )
                    "
                    class="form-checkbox text-green-600"
                  />
                  <span>Kepala Bagian Materi dan Komunikasi Pimpinan</span>
                </label>
              </div>
              <div>
                <label>
                  <input
                    type="checkbox"
                    disabled
                    :checked="
                      detailArsip.idSurat?.diteruskanKepada &&
                      detailArsip.idSurat.diteruskanKepada.includes(
                        'Kepala Sub Bagian Tata Usaha'
                      )
                    "
                    class="form-checkbox text-green-600"
                  />
                  <span>Kepala Sub Bagian Tata Usaha</span>
                </label>
              </div>
            </div>
          </div>

          <div class="flex space-x-2 mb-4 border border-gray-300 rounded p-2">
            <div class="font-semibold mb-2">Disposisi :</div>
            <div>
              <div>
                <label>
                  <input
                    type="checkbox"
                    disabled
                    :checked="
                      detailArsip.idSurat?.disposisi &&
                      detailArsip.idSurat.disposisi.includes(
                        'Proses Tindak Lanjut'
                      )
                    "
                    class="form-checkbox text-purple-600"
                  />
                  <span>Proses Lebih Lanjut</span>
                </label>
              </div>
              <div>
                <label>
                  <input
                    type="checkbox"
                    disabled
                    :checked="
                      detailArsip.idSurat?.disposisi &&
                      detailArsip.idSurat.disposisi.includes(
                        'Tanggapan dan Saran'
                      )
                    "
                    class="form-checkbox text-purple-600"
                  />
                  <span>Tanggapan dan Saran</span>
                </label>
              </div>
              <div>
                <label>
                  <input
                    type="checkbox"
                    disabled
                    :checked="
                      detailArsip.idSurat?.disposisi &&
                      detailArsip.idSurat.disposisi.includes('Jadwalkan')
                    "
                    class="form-checkbox text-purple-600"
                  />
                  <span>Jadwalkan</span>
                </label>
              </div>
              <div>
                <label>
                  <input
                    type="checkbox"
                    disabled
                    :checked="
                      detailArsip.idSurat?.disposisi &&
                      detailArsip.idSurat.disposisi.includes('Wakili/Dampingi')
                    "
                    class="form-checkbox text-purple-600"
                  />
                  <span>Wakili / Dampingi</span>
                </label>
              </div>
              <div>
                <label>
                  <input
                    type="checkbox"
                    disabled
                    :checked="
                      detailArsip.idSurat?.disposisi &&
                      detailArsip.idSurat.disposisi.includes('Koordinasikan')
                    "
                    class="form-checkbox text-purple-600"
                  />
                  <span>Koordinasikan</span>
                </label>
              </div>
              <div>
                <label>
                  <input
                    type="checkbox"
                    disabled
                    :checked="
                      detailArsip.idSurat?.disposisi &&
                      detailArsip.idSurat.disposisi.includes('File/Arsip')
                    "
                    class="form-checkbox text-purple-600"
                  />
                  <span>File / Arsip</span>
                </label>
              </div>
            </div>
          </div>

          <div class="mb-12 border border-gray-300 rounded p-2 min-h-[80px]">
            <div class="font-semibold mb-1">
              Catatan :
              <span class="font-normal">{{
                detailArsip.idSurat?.catatan || "-"
              }}</span>
            </div>
          </div>

          <div class="flex justify-end space-x-8 text-sm">
            <div class="text-center">
              <div
                v-if="detailArsip.idSurat?.parafLembarDisposisi"
                class="flex space-x-2"
              >
                <div>
                  <div class="flex space-x-2">
                    <div class="font-semibold mb-1">
                      Paraf dan : <span></span>
                    </div>

                    <div>
                      <img
                        :src="
                          getLampiranUrl(
                            detailArsip.idSurat?.parafLembarDisposisi
                          )
                        "
                        alt="Paraf"
                        class="mx-auto max-h-20 object-contain mb-2 border border-gray-300 rounded"
                      />
                    </div>
                  </div>
                  <div class="mt-2">
                    <div class="font-semibold mb-1">
                      Tanggal :
                      <span>
                        {{
                          detailArsip.idSurat?.tglParafLembarDisposisi
                            ? detailArsip.idSurat.tglParafLembarDisposisi.split(
                                "T"
                              )[0]
                            : ""
                        }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else>-</div>
            </div>
          </div>

          <button
            @click="closeLembarDisposisiModal"
            aria-label="Close modal"
            class="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import arsipApi from "../services/comArsipSurat";

export default {
  name: "ArsipSurat",
  data() {
    return {
      arsipList: [],
      loading: false,
      lembarDisposisiModalVisible: false,
      detailArsip: {},
      filters: {
        noSurat: "",
        surat_dari: "",
        sifatSurat: "",
        diteruskanKepada: "",
        disposisi: "",
        tglSuratStart: "",
        tglSuratEnd: "",
      },
    };
  },
  methods: {
    async fetchArsip() {
      this.loading = true;
      try {
        const res = await arsipApi.getAllArsipSurat();
        this.arsipList = res.data.data || [];
      } catch (err) {
        alert("Gagal mengambil data arsip surat: " + (err.message || err));
      } finally {
        this.loading = false;
      }
    },
    openLembarDisposisiModal(arsip) {
      this.detailArsip = arsip;
      this.lembarDisposisiModalVisible = true;
    },
    closeLembarDisposisiModal() {
      this.lembarDisposisiModalVisible = false;
      this.detailArsip = {};
    },
    formatDate(dateStr) {
      if (!dateStr) return "-";
      const d = new Date(dateStr);
      if (isNaN(d)) return dateStr;
      return d.toLocaleDateString("id-ID");
    },
    getLampiranUrl(filename) {
      const baseUrl =
        process.env.VUE_APP_FILE_BASE_URL || "http://localhost:3000/uploads/";
      return baseUrl + filename;
    },
  },
  mounted() {
    this.fetchArsip();
  },
  computed: {
    filteredArsipList() {
      if (!this.arsipList || this.arsipList.length === 0) return [];

      let filtered = this.arsipList;

      if (this.filters.noSurat.trim() !== "") {
        const val = this.filters.noSurat.trim().toLowerCase();
        filtered = filtered.filter((arsip) =>
          (arsip.idSurat?.noSurat || "").toLowerCase().includes(val)
        );
      }

      if (this.filters.surat_dari.trim() !== "") {
        const val = this.filters.surat_dari.trim().toLowerCase();
        filtered = filtered.filter((arsip) =>
          (arsip.idSurat?.surat_dari || "").toLowerCase().includes(val)
        );
      }

      if (this.filters.sifatSurat) {
        filtered = filtered.filter(
          (arsip) => arsip.idSurat?.sifatSurat === this.filters.sifatSurat
        );
      }

      if (this.filters.diteruskanKepada) {
        filtered = filtered.filter(
          (arsip) =>
            arsip.idSurat?.diteruskanKepada &&
            arsip.idSurat.diteruskanKepada.includes(
              this.filters.diteruskanKepada
            )
        );
      }

      if (this.filters.disposisi) {
        filtered = filtered.filter(
          (arsip) =>
            arsip.idSurat?.disposisi &&
            arsip.idSurat.disposisi.includes(this.filters.disposisi)
        );
      }

      if (this.filters.tglSuratStart) {
        const startDate = new Date(this.filters.tglSuratStart);
        filtered = filtered.filter((arsip) => {
          const tgl = new Date(arsip.idSurat?.tglSurat);
          return tgl >= startDate;
        });
      }

      if (this.filters.tglSuratEnd) {
        const endDate = new Date(this.filters.tglSuratEnd);
        filtered = filtered.filter((arsip) => {
          const tgl = new Date(arsip.idSurat?.tglSurat);
          return tgl <= endDate;
        });
      }

      return filtered;
    },
  },
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
