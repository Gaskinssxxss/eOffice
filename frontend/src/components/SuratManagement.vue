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
    <div class="border shadow">
      <table class="w-full divide-y divide-gray-200">
        <thead class="bg-gray-100 uppercase">
          <tr>
            <th
              class="px-6 py-2 text-center text-xs font-semibold text-gray-700 border border-gray-200"
            >
              No Surat
            </th>
            <th
              class="px-6 py-2 text-center text-xs font-semibold text-gray-700 border border-gray-200"
            >
              Lembar Disposisi
            </th>
            <th
              class="px-6 py-2 text-center text-xs font-semibold text-gray-700 border border-gray-200"
            >
              Tanggal Surat
            </th>
            <th
              class="px-6 py-2 text-center text-xs font-semibold text-gray-700 border border-gray-200"
            >
              Lampiran
            </th>
            <th
              class="px-6 py-2 text-center text-xs font-semibold text-gray-700 border border-gray-200"
            >
              Status Lampiran
            </th>
            <th
              class="px-6 py-2 text-center text-xs font-semibold text-gray-700 border border-gray-200"
            >
              Status Surat
            </th>
            <th
              class="px-6 py-2 text-center text-xs font-semibold text-gray-700"
            >
              Aksi
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200 w-full">
          <tr
            v-for="surat in filteredSuratList"
            :key="surat._id"
            class="hover:bg-gray-50 relative"
            style="position: relative"
          >
            <td
              class="px-4 py-4 text-xs border border-gray-200 text-gray-800 text-center"
            >
              {{ surat.noSurat }}
            </td>
            <td class="px-4 py-4 text-sm border border-gray-200 text-center">
              <button
                @click="openLembarDisposisiModal(surat)"
                class="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
              >
                Lihat
              </button>
            </td>
            <td
              class="px-4 py-4 text-xs border border-gray-200 text-gray-800 text-center"
            >
              {{ formatDate(surat.tglSurat) }}
            </td>
            <td
              class="px-4 py-4 text-xs border border-gray-200 text-gray-800 text-center"
            >
              <span v-if="surat.lampiran && surat.lampiran.length">
                <div
                  v-for="(file, index) in surat.lampiran"
                  :key="file"
                  class="flex space-x-2"
                >
                  <div>
                    <a
                      :href="getLampiranUrl(file)"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="text-blue-600 hover:underline"
                    >
                      {{ file }}
                    </a>
                  </div>
                  <div
                    v-if="
                      surat.diteruskanKepada &&
                      surat.diteruskanKepada.includes(loggedUser) &&
                      surat.statusLampiran !== 'ditandatangani'
                    "
                  >
                    <button
                      @click="openTandaTanganModal(surat)"
                      class="ml-2 text-sm text-green-600 hover:underline"
                    >
                      Tanda Tangan
                    </button>
                  </div>
                  <span v-if="index < surat.lampiran.length - 1">, </span>
                </div>
              </span>
              <span v-else>-</span>
            </td>
            <td
              class="px-4 py-4 text-xs border border-gray-200 text-gray-800 text-center"
            >
              {{ surat.statusLampiran || "-" }}
            </td>
            <td
              class="px-4 py-4 text-xs border border-gray-200 text-gray-800 text-center"
            >
              {{ surat.statusSurat || "-" }}
            </td>
            <td
              v-if="surat.statusSurat !== 'diarsipkan'"
              class="px-2 py-4 text-sm border border-gray-200 text-center space-x-2"
            >
              <button @click="openModalEdit(surat)" class="relative group">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                  />
                </svg>
                <span
                  class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs bg-black text-white rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap"
                >
                  Edit Surat
                </span>
              </button>
              <button
                @click="onDeleteSurat(surat._id)"
                :disabled="loading"
                class="relative group"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#000000"
                  class="size-6"
                  viewBox="0 0 256 256"
                >
                  <path
                    d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z"
                  ></path>
                </svg>
                <span
                  class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs bg-black text-white rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap"
                >
                  Hapus Surat
                </span>
              </button>
              <button
                v-if="adminRole && surat.parafLembarDisposisi !== null"
                @click="onArsipkanSurat(surat)"
                :disabled="loading"
                class="relative group"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="size-6"
                  fill="#000000"
                  viewBox="0 0 256 256"
                >
                  <path
                    d="M224,48H32A16,16,0,0,0,16,64V88a16,16,0,0,0,16,16v88a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V104a16,16,0,0,0,16-16V64A16,16,0,0,0,224,48ZM208,192H48V104H208ZM224,88H32V64H224V88ZM96,136a8,8,0,0,1,8-8h48a8,8,0,0,1,0,16H104A8,8,0,0,1,96,136Z"
                  ></path>
                </svg>
                <span
                  class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs bg-black text-white rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap"
                >
                  Arsipkan Surat
                </span>
              </button>
            </td>

            <td
              v-if="
                surat.diteruskanKepada &&
                surat.diteruskanKepada.includes(loggedUser) &&
                surat.statusSurat !== 'diterima' &&
                surat.statusSurat !== 'diarsipkan'
              "
              class="absolute inset-0 bg-gray-200 bg-opacity-80 flex items-center justify-center z-10"
              colspan="100"
            >
              <button
                @click="unlockSurat(surat)"
                class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Terima Surat
              </button>
            </td>
          </tr>

          <tr v-if="suratList.length === 0 && !loadingSurat">
            <td colspan="7" class="text-center py-6 text-gray-600">
              Belum ada surat yang terdaftar.
            </td>
          </tr>

          <tr v-if="loadingSurat">
            <td colspan="7" class="text-center py-6">Memuat data surat...</td>
          </tr>
        </tbody>

        <!-- <tbody class="bg-white divide-y divide-gray-200">
          <tr
            v-for="surat in filteredSuratList"
            :key="surat._id"
            class="hover:bg-gray-50"
          >
            <td class="px-4 py-4 text-xs border border-gray-200 text-gray-800 text-center">
              {{ surat.noSurat }}
            </td>
            <td class="px-4 py-4 text-sm border border-gray-200 text-center">
              <button
                @click="openLembarDisposisiModal(surat)"
                class="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
              >
                Lihat
              </button>
            </td>
            <td class="px-4 py-4 text-xs border border-gray-200 text-gray-800 text-center">
              {{ formatDate(surat.tglSurat) }}
            </td>
            <td class="px-4 py-4 text-xs border border-gray-200 text-gray-800 text-center">
              <span v-if="surat.lampiran && surat.lampiran.length">
                <div
                  v-for="file in surat.lampiran"
                  :key="file"
                  class="flex space-x-2"
                >
                  <div>
                    <a
                      :href="getLampiranUrl(file)"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="text-blue-600 hover:underline"
                    >
                      {{ file }}
                    </a>
                  </div>
                  <div
                    v-if="
                      surat.diteruskanKepada &&
                      surat.diteruskanKepada.includes(loggedUser) &&
                      surat.statusLampiran !== 'ditandatangani'
                    "
                  >
                    <button
                      v-if="surat.lampiran && surat.lampiran.length"
                      @click="openTandaTanganModal(surat)"
                      class="ml-2 text-sm text-green-600 hover:underline"
                    >
                      Tanda Tangan
                    </button>
                  </div>

                  <span v-if="index < surat.lampiran.length - 1">, </span>
                </div>
              </span>
              <span v-else>-</span>
            </td>
            <td class="px-4 py-4 text-xs border border-gray-200 text-gray-800 text-center">
              {{ surat.statusSurat || "-" }}
            </td>
            <td class="px-4 py-4 text-xs border border-gray-200 text-gray-800 text-center">
              {{ surat.statusLampiran || "-" }}
            </td>
            <td
              class="px-2 py-4 text-sm border border-gray-200 text-center space-x-2"
            >
              <button @click="openModalEdit(surat)" class="relative group">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                  />
                </svg>
                <span
                  class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs bg-black text-white rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap"
                >
                  Edit Surat
                </span>
              </button>
              <button
                @click="onDeleteSurat(surat._id)"
                :disabled="loading"
                class="relative group"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  fill="#000000"
                  viewBox="0 0 256 256"
                >
                  <path
                    d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z"
                  ></path>
                </svg>
                <span
                  class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs bg-black text-white rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap"
                >
                  Hapus Surat
                </span>
              </button>
              <button
                v-if="adminRole && surat.parafLembarDisposisi !== null"
                @click="onArsipkanSurat(surat)"
                :disabled="loading"
                class="relative group"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  fill="#000000"
                  viewBox="0 0 256 256"
                >
                  <path
                    d="M224,48H32A16,16,0,0,0,16,64V88a16,16,0,0,0,16,16v88a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V104a16,16,0,0,0,16-16V64A16,16,0,0,0,224,48ZM208,192H48V104H208ZM224,88H32V64H224V88ZM96,136a8,8,0,0,1,8-8h48a8,8,0,0,1,0,16H104A8,8,0,0,1,96,136Z"
                  ></path>
                </svg>
                <span
                  class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs bg-black text-white rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap"
                >
                  Arsipkan Surat
                </span>
              </button>
            </td>
          </tr>
          <tr v-if="suratList.length === 0 && !loadingSurat">
            <td colspan="5" class="text-center py-6 text-gray-600">
              Belum ada surat yang terdaftar.
            </td>
          </tr>
          <tr v-if="loadingSurat">
            <td colspan="5" class="text-center py-6">Memuat data surat...</td>
          </tr>
        </tbody> -->
      </table>
    </div>

    <transition name="fade">
      <div
        v-if="modalVisible"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4"
      >
        <div
          class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 relative shadow-lg text-sm font-sans"
          @click.self="closeModal"
        >
          <div class="flex justify-center space-x-2 border-b">
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
            class="text-lg font-bold text-center mb-6 uppercase tracking-wide border-b pb-3"
          >
            {{ isEditing ? "Lembar Disposisi" : "Lembar Disposisi" }}
          </h2>

          <form @submit.prevent="onSubmit" class="space-y-6">
            <div
              class="grid grid-cols-2 gap-8 border border-gray-300 rounded p-4"
            >
              <div class="space-y-3">
                <div>
                  <label class="block font-semibold mb-1"
                    >Surat Dari <span class="text-red-600">*</span></label
                  >
                  <input
                    v-model="form.surat_dari"
                    type="text"
                    required
                    class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-200 text-xs font-semibold placeholder-gray-400 capitalize"
                  />
                </div>

                <div>
                  <label class="block font-semibold mb-1"
                    >No. Surat <span class="text-red-600">*</span></label
                  >
                  <input
                    v-model="form.noSurat"
                    type="text"
                    required
                    class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-200 text-xs font-semibold placeholder-gray-400 capitalize"
                  />
                </div>

                <div>
                  <label class="block font-semibold mb-1"
                    >Tgl. Surat <span class="text-red-600">*</span></label
                  >
                  <input
                    v-model="form.tglSurat"
                    type="date"
                    required
                    class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-200 text-xs font-semibold placeholder-gray-400 capitalize"
                  />
                </div>
              </div>

              <div class="space-y-3">
                <div>
                  <label class="block font-semibold mb-1"
                    >Diterima Tgl <span class="text-red-600">*</span></label
                  >
                  <input
                    v-model="form.diterimaTgl"
                    type="date"
                    required
                    class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-200 text-xs font-semibold placeholder-gray-400 capitalize"
                  />
                </div>

                <div>
                  <label class="block font-semibold mb-1"
                    >No. Agenda <span class="text-red-600">*</span></label
                  >
                  <input
                    v-model="form.noAgenda"
                    type="text"
                    required
                    class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-200 text-xs font-semibold placeholder-gray-400 capitalize"
                  />
                </div>

                <div>
                  <label class="block font-semibold mb-1"
                    >Sifat Surat <span class="text-red-600">*</span></label
                  >
                  <div class="grid grid-cols-2 gap-x-4">
                    <label class="inline-flex items-center space-x-2">
                      <input
                        type="radio"
                        name="sifatSurat"
                        value="Segera"
                        v-model="form.sifatSurat"
                        required
                        class="form-radio text-blue-600"
                      />
                      <span>Segera</span>
                    </label>
                    <label class="inline-flex items-center space-x-2">
                      <input
                        type="radio"
                        name="sifatSurat"
                        value="Penting"
                        v-model="form.sifatSurat"
                        class="form-radio text-blue-600"
                      />
                      <span>Penting</span>
                    </label>
                    <label class="inline-flex items-center space-x-2">
                      <input
                        type="radio"
                        name="sifatSurat"
                        value="Rahasia"
                        v-model="form.sifatSurat"
                        class="form-radio text-blue-600"
                      />
                      <span>Rahasia</span>
                    </label>
                    <label class="inline-flex items-center space-x-2">
                      <input
                        type="radio"
                        name="sifatSurat"
                        value="Biasa"
                        v-model="form.sifatSurat"
                        class="form-radio text-blue-600"
                      />
                      <span>Biasa</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div class="border border-gray-300 rounded p-4 flex space-x-2">
              <label class="block font-semibold mb-2"
                >Perihal Surat / Catatan
                <span class="text-red-600">*</span></label
              >
              <textarea
                v-model="form.catatan"
                rows="4"
                required
                class="w-full border border-gray-300 rounded-md px-3 py-2 resize-2 focus:outline-none focus:ring-1 focus:ring-gray-200 text-xs font-semibold placeholder-gray-400 capitalize"
              ></textarea>
            </div>

            <div class="border border-gray-300 rounded p-4 flex space-x-2">
              <label class="block font-semibold mb-2"
                >Diteruskan Kepada <span class="text-red-600">*</span></label
              >
              <div>
                <div>
                  <label>
                    <input
                      type="radio"
                      value="Kepala Bagian Perencanaan dan Pelaporan"
                      v-model="form.diteruskanKepada"
                      class="form-radio text-green-600"
                    />
                    <span class="pl-2"
                      >Kepala Bagian Perencanaan dan Pelaporan</span
                    >
                  </label>
                </div>
                <div>
                  <label>
                    <input
                      type="radio"
                      value="Kepala Bagian Protokol"
                      v-model="form.diteruskanKepada"
                      class="form-radio text-green-600"
                    />
                    <span class="pl-2">Kepala Bagian Protokol</span>
                  </label>
                </div>
                <div>
                  <label>
                    <input
                      type="radio"
                      value="Kepala Bagian Materi dan Komunikasi Pimpinan"
                      v-model="form.diteruskanKepada"
                      class="form-radio text-green-600"
                    />
                    <span class="pl-2"
                      >Kepala Bagian Materi dan Komunikasi Pimpinan</span
                    >
                  </label>
                </div>
                <div>
                  <label>
                    <input
                      type="radio"
                      value="Kepala Sub Bagian Tata Usaha"
                      v-model="form.diteruskanKepada"
                      class="form-radio text-green-600"
                    />
                    <span class="pl-2">Kepala Sub Bagian Tata Usaha</span>
                  </label>
                </div>
              </div>
            </div>

            <div class="border border-gray-300 rounded p-4">
              <label class="block font-semibold mb-2"
                >Disposisi <span class="text-red-600">*</span></label
              >
              <div class="grid grid-cols-2 gap-x-8">
                <label class="inline-flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value="Proses Tindak Lanjut"
                    v-model="form.disposisi"
                    class="form-checkbox text-purple-600"
                  />
                  <span>Proses Tindak Lanjut</span>
                </label>
                <label class="inline-flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value="Tanggapan dan Saran"
                    v-model="form.disposisi"
                    class="form-checkbox text-purple-600"
                  />
                  <span>Tanggapan dan Saran</span>
                </label>
                <label class="inline-flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value="Jadwalkan"
                    v-model="form.disposisi"
                    class="form-checkbox text-purple-600"
                  />
                  <span>Jadwalkan</span>
                </label>
                <label class="inline-flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value="Wakili/Dampingi"
                    v-model="form.disposisi"
                    class="form-checkbox text-purple-600"
                  />
                  <span>Wakili/Dampingi</span>
                </label>
                <label class="inline-flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value="Koordinasikan"
                    v-model="form.disposisi"
                    class="form-checkbox text-purple-600"
                  />
                  <span>Koordinasikan</span>
                </label>
                <label class="inline-flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value="File/Arsip"
                    v-model="form.disposisi"
                    class="form-checkbox text-purple-600"
                  />
                  <span>File/Arsip</span>
                </label>
              </div>
            </div>

            <div>
              <label class="block font-semibold mb-1"
                >Lampiran (File multiple)</label
              >
              <input
                type="file"
                accept="image/*,.pdf,.doc,.docx"
                multiple
                @change="onLampiranFilesChange"
                class="w-full"
              />
              <p v-if="form.lampiran.length" class="text-sm mt-1 text-gray-600">
                <a
                  :href="getLampiranUrl(form.lampiran)"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-blue-600 hover:underline"
                >
                  {{ form.lampiran }}
                </a>
              </p>
            </div>

            <div v-if="isEditing">
              <label class="block font-semibold mb-1"
                >Paraf Lembar Disposisi</label
              >
              <input
                type="file"
                accept="image/*,.pdf"
                @change="onParafFileChange"
                class="w-full"
              />
              <p
                v-if="form.parafLembarDisposisi"
                class="text-sm mt-1 text-gray-600"
              >
                <a
                  :href="getLampiranUrl(form.parafLembarDisposisi)"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-blue-600 hover:underline"
                >
                  {{ form.parafLembarDisposisi }}
                </a>
              </p>
            </div>

            <div v-if="isEditing">
              <label class="block font-semibold mb-1"
                >Tanggal Paraf Lembar Disposisi
                <span class="text-red-600">*</span></label
              >
              <input
                v-model="form.tglParafLembarDisposisi"
                type="date"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-200 text-xs font-semibold placeholder-gray-400 capitalize"
              />
            </div>

            <div class="flex justify-end space-x-4 mt-6">
              <button
                type="button"
                @click="closeModal"
                class="px-4 py-2 rounded border border-gray-400 hover:bg-gray-100 transition"
                :disabled="loading"
              >
                Batal
              </button>
              <button
                type="submit"
                class="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
                :disabled="loading"
              >
                {{ isEditing ? "Update Surat" : "Buat Surat" }}
              </button>
            </div>
          </form>

          <button
            @click="closeModal"
            aria-label="Close modal"
            class="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
      </div>
    </transition>

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
                {{ detailSurat.surat_dari || "-" }}
              </div>
              <div>
                <span class="font-semibold">No. Surat :</span>
                {{ detailSurat.noSurat || "-" }}
              </div>
              <div>
                <span class="font-semibold">Tgl. Surat :</span>
                {{ formatDate(detailSurat.tglSurat) }}
              </div>
            </div>

            <div class="space-y-1">
              <div>
                <span class="font-semibold">Diterima Tgl. :</span>
                {{ formatDate(detailSurat.diterimaTgl) }}
              </div>
              <div>
                <span class="font-semibold">No. Agenda :</span>
                {{ detailSurat.noAgenda || "-" }}
              </div>
              <div class="flex space-x-2">
                <span class="font-semibold">Sifat Surat :</span>
                <div class="mt-1">
                  <div>
                    <label>
                      <input
                        type="checkbox"
                        disabled
                        :checked="detailSurat.sifatSurat === 'Segera'"
                        class="form-checkbox text-blue-600"
                      />
                      <span>Segera</span>
                    </label>
                    <div>
                      <label>
                        <input
                          type="checkbox"
                          disabled
                          :checked="detailSurat.sifatSurat === 'Penting'"
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
                          :checked="detailSurat.sifatSurat === 'Rahasia'"
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
                          :checked="detailSurat.sifatSurat === 'Biasa'"
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
              <span class="font-normal">{{ detailSurat.catatan || "-" }}</span>
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
                      detailSurat.diteruskanKepada &&
                      detailSurat.diteruskanKepada.includes(
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
                      detailSurat.diteruskanKepada &&
                      detailSurat.diteruskanKepada.includes(
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
                      detailSurat.diteruskanKepada &&
                      detailSurat.diteruskanKepada.includes(
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
                      detailSurat.diteruskanKepada &&
                      detailSurat.diteruskanKepada.includes(
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
                      detailSurat.disposisi &&
                      detailSurat.disposisi.includes('Proses Tindak Lanjut')
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
                      detailSurat.disposisi &&
                      detailSurat.disposisi.includes('Tanggapan dan Saran')
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
                      detailSurat.disposisi &&
                      detailSurat.disposisi.includes('Jadwalkan')
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
                      detailSurat.disposisi &&
                      detailSurat.disposisi.includes('Wakili/Dampingi')
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
                      detailSurat.disposisi &&
                      detailSurat.disposisi.includes('Koordinasikan')
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
                      detailSurat.disposisi &&
                      detailSurat.disposisi.includes('File/Arsip')
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
              <span class="font-normal">{{ detailSurat.catatan || "-" }}</span>
            </div>
          </div>

          <div class="flex justify-end space-x-8 text-sm">
            <div class="text-center">
              <div
                v-if="detailSurat.parafLembarDisposisi"
                class="flex space-x-2"
              >
                <div>
                  <div class="flex space-x-2">
                    <div class="font-semibold mb-1">
                      Paraf dan : <span></span>
                    </div>

                    <div>
                      <img
                        :src="getLampiranUrl(detailSurat.parafLembarDisposisi)"
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
                          detailSurat.tglParafLembarDisposisi
                            ? detailSurat.tglParafLembarDisposisi.split("T")[0]
                            : ""
                        }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div v-else>
                <div
                  v-if="
                    detailSurat.diteruskanKepada &&
                    detailSurat.diteruskanKepada.includes(loggedUser)
                  "
                >
                  <div class="font-semibold mb-1">Paraf dan :</div>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    @change="onLembarParafChange"
                    class="mb-2 block w-full text-xs text-gray-700"
                  />
                  <button
                    @click="onUploadParaf(detailSurat._id)"
                    :disabled="!newParafFile || uploadingParaf"
                    class="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition disabled:opacity-50"
                  >
                    {{ uploadingParaf ? "Uploading…" : "Upload Paraf" }}
                  </button>

                  <div class="text-center mt-2">
                    <div class="font-semibold mb-1">
                      Tanggal :
                      <span>
                        {{
                          detailSurat.tglParafLembarDisposisi
                            ? detailSurat.tglParafLembarDisposisi.split("T")[0]
                            : ""
                        }}
                      </span>
                    </div>
                  </div>
                </div>
                <div v-else>
                  <div class="font-semibold mb-1">Paraf dan :</div>
                  <div class="text-center mt-2">
                    <div class="font-semibold mb-1">
                      Tanggal :
                      <span>
                        {{
                          detailSurat.tglParafLembarDisposisi
                            ? detailSurat.tglParafLembarDisposisi.split("T")[0]
                            : ""
                        }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
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

    <TandaTangan
      v-if="tandaTanganModalVisible && selectedSurat"
      :pdfUrl="getLampiranUrl(selectedSurat.lampiran[0])"
      :originalFileName="selectedSurat.lampiran[0]"
      @signed-pdf-ready="(file) => onSignedPdfReady(selectedSurat, file)"
      @close="closeTandaTanganModal"
    />
  </div>
</template>

<script>
import comArsipSurat from "@/services/comArsipSurat";
import suratApi from "../services/comSuratApi";
import TandaTangan from "./TandaTangan.vue";

export default {
  name: "SuratManagement",
  components: {
    TandaTangan,
  },
  data() {
    return {
      suratList: [],
      loadingSurat: false,
      loading: false,
      isEditing: false,
      editingId: null,
      modalVisible: false,
      lembarDisposisiModalVisible: false,
      form: {
        surat_dari: "",
        noSurat: "",
        tglSurat: "",
        diterimaTgl: "",
        noAgenda: "",
        sifatSurat: "",
        diteruskanKepada: [],
        disposisi: [],
        catatan: "",
        parafLembarDisposisi: null,
        tglParafLembarDisposisi: "",
        statusSurat: "",
        statusLampiran: "",
        lampiran: [],
      },
      detailSurat: {},
      newParafFile: null,
      uploadingParaf: false,
      tandaTanganModalVisible: false,
      selectedSurat: null,
      filters: {
        noSurat: "",
        surat_dari: "",
        sifatSurat: "",
        tglSuratStart: "",
        tglSuratEnd: "",
        diteruskanKepada: "",
        disposisi: "",
      },
    };
  },
  methods: {
    async unlockSurat(surat) {
      if (this.loading) return;
      this.loading = true;
      try {
        const formData = new FormData();
        formData.append("statusSurat", "diterima");

        await suratApi.updateSuratApi(surat._id, formData);

        alert(`Surat No. ${surat.noSurat} berhasil di-unlock dan diterima.`);

        await this.fetchSurat();
      } catch (error) {
        alert("Gagal unlock surat: " + (error.message || error));
      } finally {
        this.loading = false;
      }
    },

    async onArsipkanSurat(surat) {
      if (!confirm(`Arsipkan surat No. ${surat.noSurat} ?`)) return;
      this.loading = true;
      try {
        const payload = {
          idSurat: surat._id,
        };
        await comArsipSurat.postArsipSurat(payload);

        const formData = new FormData();
        formData.append("statusSurat", "diarsipkan");

        await suratApi.updateSuratApi(surat._id, formData);
        alert(`Surat No. ${surat.noSurat} berhasil diarsipkan.`);
        this.fetchSurat();
      } catch (error) {
        alert(`Gagal mengarsipkan surat: ${error.message || error}`);
      } finally {
        this.loading = false;
      }
    },
    openTandaTanganModal(surat) {
      this.selectedSurat = surat;
      this.tandaTanganModalVisible = true;
    },
    closeTandaTanganModal() {
      this.tandaTanganModalVisible = false;
      this.selectedSurat = null;
    },

    async onSignedPdfReady(surat, fileFinal) {
      if (!fileFinal || !(fileFinal instanceof File)) {
        alert("File tidak valid.");
        return;
      }

      try {
        const formData = new FormData();
        formData.append("lampiran", fileFinal);
        formData.append("statusLampiran", "ditandatangani");

        await suratApi.updateSuratApi(surat._id, formData);
        alert("Surat berhasil diupdate dengan file hasil tanda tangan.");
        this.tandaTanganModalVisible = false;
        await this.fetchSurat();
      } catch (error) {
        alert("Gagal update surat dengan file tanda tangan: " + error.message);
      }
    },
    pdfLampiranUrl() {
      if (!this.detailSurat.lampiran || this.detailSurat.lampiran.length === 0)
        return null;
      return this.getLampiranUrl(this.detailSurat.lampiran[0]);
    },
    onLembarParafChange(event) {
      this.newParafFile = event.target.files[0] || null;
    },
    async onUploadParaf(id) {
      if (!this.newParafFile) return;
      this.uploadingParaf = true;
      try {
        const formData = new FormData();
        formData.append("parafLembarDisposisi", this.newParafFile);

        const today = new Date().toISOString().slice(0, 10);
        formData.append("tglParafLembarDisposisi", today);

        await suratApi.updateSuratApi(id, formData);

        this.lembarDisposisiModalVisible = false;
        await this.fetchSurat();
        setTimeout(() => {
          this.lembarDisposisiModalVisible = true;
        }, 300);
        this.detailSurat.parafLembarDisposisi = this.newParafFile.name;
        this.detailSurat.tglParafLembarDisposisi = today;
        this.newParafFile = null;
      } catch (err) {
        alert("Gagal upload paraf: " + err.message);
      } finally {
        this.uploadingParaf = false;
      }
    },

    getLampiranUrl(filename) {
      const baseUrl =
        process.env.VUE_APP_FILE_BASE_URL || "http://localhost:3000/uploads/";
      return baseUrl + filename;
    },

    async fetchSurat() {
      this.loadingSurat = true;
      try {
        const res = await suratApi.getAllSuratApi();
        this.suratList = res.data.data;
      } catch {
        alert("Gagal mengambil data surat");
      } finally {
        this.loadingSurat = false;
      }
    },
    openModalCreate() {
      this.resetForm();
      this.isEditing = false;
      this.modalVisible = true;
    },
    openModalEdit(surat) {
      this.isEditing = true;
      this.editingId = surat._id;

      this.form.surat_dari = surat.surat_dari || "";
      this.form.noSurat = surat.noSurat || "";
      this.form.tglSurat = surat.tglSurat ? surat.tglSurat.slice(0, 10) : "";
      this.form.diterimaTgl = surat.diterimaTgl
        ? surat.diterimaTgl.slice(0, 10)
        : "";
      this.form.noAgenda = surat.noAgenda || "";
      this.form.sifatSurat = surat.sifatSurat || "";
      this.form.diteruskanKepada = surat.diteruskanKepada || [];
      this.form.disposisi = surat.disposisi || [];
      this.form.catatan = surat.catatan || "";
      this.form.tglParafLembarDisposisi = surat.tglParafLembarDisposisi
        ? surat.tglParafLembarDisposisi.slice(0, 10)
        : "";
      this.form.statusSurat = surat.statusSurat || "";
      this.form.statusLampiran = surat.statusLampiran || "";
      this.form.parafLembarDisposisi = surat.parafLembarDisposisi || "";
      this.form.lampiran = surat.lampiran || [];

      this.modalVisible = true;
    },
    closeModal() {
      if (this.loading) return;
      this.modalVisible = false;
      this.resetForm();
    },
    openLembarDisposisiModal(surat) {
      this.detailSurat = surat;
      this.lembarDisposisiModalVisible = true;
    },
    closeLembarDisposisiModal() {
      this.lembarDisposisiModalVisible = false;
      this.detailSurat = {};
    },
    onParafFileChange(event) {
      this.form.parafLembarDisposisi = event.target.files[0] || null;
    },
    onLampiranFilesChange(event) {
      this.form.lampiran = Array.from(event.target.files);
    },
    async onSubmit() {
      this.loading = true;
      try {
        const formData = new FormData();

        for (const key in this.form) {
          if (key === "lampiran" || key === "parafLembarDisposisi") continue;

          if (Array.isArray(this.form[key])) {
            this.form[key].forEach((val) => formData.append(key, val));
          } else if (this.form[key] !== null && this.form[key] !== undefined) {
            formData.append(key, this.form[key]);
          }
        }

        if (this.form.parafLembarDisposisi) {
          formData.append(
            "parafLembarDisposisi",
            this.form.parafLembarDisposisi
          );
        }

        if (this.form.lampiran.length) {
          this.form.lampiran.forEach((file) => {
            formData.append("lampiran", file);
          });
        }

        if (this.isEditing) {
          await suratApi.updateSuratApi(this.editingId, formData);
          alert("Surat berhasil diperbarui");
          setTimeout(() => {
            this.modalVisible = false;
            this.fetchSurat();
          }, 200);
        } else {
          await suratApi.createSuratApi(formData);
          alert("Surat berhasil dibuat");
          setTimeout(() => {
            this.modalVisible = false;
            this.fetchSurat();
          }, 200);
        }
      } catch (error) {
        alert("Gagal menyimpan surat: " + error.message);
      } finally {
        this.loading = false;
      }
    },
    async onDeleteSurat(id) {
      if (!confirm("Anda yakin ingin menghapus surat ini?")) return;
      this.loading = true;
      try {
        await suratApi.deleteSuratApi(id);
        alert("Surat berhasil dihapus");
        if (this.editingId === id) this.resetForm();
        await this.fetchSurat();
      } catch {
        alert("Gagal menghapus surat");
      } finally {
        this.loading = false;
      }
    },
    formatDate(dateStr) {
      if (!dateStr) return "";
      const d = new Date(dateStr);
      return d.toLocaleDateString("id-ID");
    },
    resetForm() {
      this.isEditing = false;
      this.editingId = null;
      this.form = {
        surat_dari: "",
        noSurat: "",
        tglSurat: "",
        diterimaTgl: "",
        noAgenda: "",
        sifatSurat: "",
        diteruskanKepada: [],
        disposisi: [],
        catatan: "",
        parafLembarDisposisi: null,
        tglParafLembarDisposisi: "",
        statusSurat: "",
        statusLampiran: "",
        lampiran: [],
      };
    },
  },
  mounted() {
    this.fetchSurat();
    this.loggedUser = this.$store.state.user.jabatan;
    this.adminRole = this.$store.state.user.role === "admin";
  },
  computed: {
    currentUser() {
      return this.$store.state.user || {};
    },
    sortedSuratList() {
      if (!this.suratList || this.suratList.length === 0) return [];

      const userJabatan = this.currentUser.jabatan;

      const suratBelumDiterimaUser = this.suratList.filter(
        (surat) =>
          surat.diteruskanKepada &&
          surat.diteruskanKepada.includes(userJabatan) &&
          surat.statusSurat !== "diterima"
      );

      const arsipSurat = this.suratList.filter(
        (surat) =>
          surat.parafLembarDisposisi !== null &&
          surat.parafLembarDisposisi !== "" &&
          (surat.statusSurat === "diterima" || surat.statusSurat === "")
      );

      const nonArsipSurat = this.suratList.filter(
        (surat) =>
          !suratBelumDiterimaUser.includes(surat) && !arsipSurat.includes(surat)
      );

      suratBelumDiterimaUser.sort(
        (a, b) => new Date(b.tglSurat) - new Date(a.tglSurat)
      );
      arsipSurat.sort((a, b) => new Date(b.tglSurat) - new Date(a.tglSurat));
      nonArsipSurat.sort((a, b) => new Date(b.tglSurat) - new Date(a.tglSurat));

      return [...suratBelumDiterimaUser, ...arsipSurat, ...nonArsipSurat];
    },

    filteredSuratList() {
      const list = this.sortedSuratList;
      if (!list || list.length === 0) return [];

      const userJabatan = this.currentUser.jabatan;

      let filtered =
        this.currentUser.role === "admin"
          ? list
          : list.filter(
              (surat) =>
                surat.diteruskanKepada &&
                surat.diteruskanKepada.includes(userJabatan)
            );

      if (this.filters.noSurat.trim() !== "") {
        const val = this.filters.noSurat.trim().toLowerCase();
        filtered = filtered.filter((surat) =>
          surat.noSurat?.toLowerCase().includes(val)
        );
      }

      if (this.filters.surat_dari.trim() !== "") {
        const val = this.filters.surat_dari.trim().toLowerCase();
        filtered = filtered.filter((surat) =>
          surat.surat_dari?.toLowerCase().includes(val)
        );
      }

      if (this.filters.sifatSurat) {
        filtered = filtered.filter(
          (surat) => surat.sifatSurat === this.filters.sifatSurat
        );
      }

      if (this.filters.tglSuratStart) {
        const startDate = new Date(this.filters.tglSuratStart);
        filtered = filtered.filter((surat) => {
          const tgl = new Date(surat.tglSurat);
          return tgl >= startDate;
        });
      }
      if (this.filters.tglSuratEnd) {
        const endDate = new Date(this.filters.tglSuratEnd);
        filtered = filtered.filter((surat) => {
          const tgl = new Date(surat.tglSurat);
          return tgl <= endDate;
        });
      }

      if (this.filters.diteruskanKepada) {
        filtered = filtered.filter(
          (surat) =>
            surat.diteruskanKepada &&
            surat.diteruskanKepada.includes(this.filters.diteruskanKepada)
        );
      }

      if (this.filters.disposisi) {
        filtered = filtered.filter(
          (surat) =>
            surat.disposisi && surat.disposisi.includes(this.filters.disposisi)
        );
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
