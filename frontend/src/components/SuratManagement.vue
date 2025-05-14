<template>
  <div class="py-10">
    <div class="flex justify-between items-end -mt-2">
      <div class="flex space-x-2 items-end">
        <div class="flex space-x-2">
          <input
            v-model="filters.q"
            type="text"
            placeholder="Nomor surat..."
            class="w-[10rem] h-[2rem] border rounded-sm px-2 text-xs 3xl:text-sm placeholder-gray-600 text-gray-600"
          />

          <select
            v-model="filters.sender"
            class="w-[10rem] h-[2rem] border rounded-sm px-2 text-xs 3xl:text-sm text-gray-600"
          >
            <option value="">Pengirim</option>
            <option v-for="u in distinctSenders" :key="u" :value="u">
              {{ u }}
            </option>
          </select>

          <select
            v-model="filters.receiver"
            class="w-[15rem] h-[2rem] border rounded-sm px-2 text-xs 3xl:text-sm text-gray-600"
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
              class="w-full h-[2rem] border rounded-sm px-2 text-xs 3xl:text-sm text-gray-600"
            />
          </div>

          <div>
            <label class="block text-sm mb-1">End:</label>
            <input
              v-model="filters.dateTo"
              type="date"
              class="w-full h-[2rem] border rounded-sm px-2 text-xs 3xl:text-sm text-gray-600"
            />
          </div>
        </div>
      </div>
      <div class="flex">
        <div
          class="flex items-center px-2 py-0.5 text-white bg-blue-500 hover:bg-blue-600 transition duration-300 rounded-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="fill-white size-6"
            viewBox="0 0 256 256"
          >
            <path
              d="M216,72H130.67L102.93,51.2a16.12,16.12,0,0,0-9.6-3.2H40A16,16,0,0,0,24,64V200a16,16,0,0,0,16,16H216.89A15.13,15.13,0,0,0,232,200.89V88A16,16,0,0,0,216,72Zm0,128H40V64H93.33L123.2,86.4A8,8,0,0,0,128,88h88Zm-56-56a8,8,0,0,1-8,8H136v16a8,8,0,0,1-16,0V152H104a8,8,0,0,1,0-16h16V120a8,8,0,0,1,16,0v16h16A8,8,0,0,1,160,144Z"
            ></path>
          </svg>
          <button @click="openModal" class="px-2 text-xs 3xl:text-sm">
            Buat Surat
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="isModalOpen"
      class="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center"
    >
      <div class="bg-white max-w-lg overflow-y-auto rounded-md px-6 py-4">
        <div class="flex justify-between">
          <h1>{{ isEditMode ? "Edit Surat" : "Buat Surat" }}</h1>
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
        <form
          @submit.prevent="isEditMode ? updateSurat() : createSurat()"
          class="space-y-4 pt-4"
        >
          <div>
            <input
              v-model="surat.nomorSurat"
              type="text"
              placeholder="Nomor Surat"
              required
              class="w-full px-2 py-2 border border-gray-400 rounded-sm text-xs 3xl:text-sm"
            />
          </div>
          <div>
            <input
              v-model="surat.perihal"
              type="text"
              placeholder="Perihal"
              required
              class="w-full px-2 py-2 border border-gray-400 rounded-sm text-xs 3xl:text-sm"
            />
          </div>
          <div>
            <h1
              class="w-full px-2 py-2 border border-gray-400 rounded-sm text-xs 3xl:text-sm bg-gray-100 placeholder-black"
            >
              {{ loggedInUser }}({{ jabatan }})
            </h1>
          </div>
          <div>
            <select
              v-model="surat.penerima"
              required
              class="w-full px-2 py-2 border border-gray-400 rounded-sm text-xs 3xl:text-sm"
            >
              <option value="" disabled selected>Penerima</option>
              <option
                v-for="user in users"
                :key="user._id"
                :value="JSON.stringify(user)"
              >
                {{ user.username }}({{ user.jabatan }})
              </option>
            </select>
          </div>
          <div>
            <input
              v-model="surat.isiTidakLanjut"
              type="text"
              placeholder="Deskripsi Tindak Lanjut"
              required
              class="w-full px-2 py-2 border border-gray-400 rounded-sm text-xs 3xl:text-sm"
            />
          </div>
          <div>
            <input
              type="file"
              @change="handleFileUpload"
              multiple
              accept=".jpg,.png"
              class="w-full px-2 py-2 border border-gray-400 rounded-sm text-xs 3xl:text-sm"
            />
          </div>
          <div class="mt-4 overflow-y-auto max-h-52">
            <div class="grid grid-cols-4 gap-2">
              <div
                v-for="(image, index) in surat.lampiran"
                :key="index"
                class="relative"
              >
                <img
                  :src="image.preview"
                  alt="Lampiran"
                  class="w-40 h-40 object-cover rounded-sm cursor-pointer"
                  @click="openLightbox(index)"
                />
                <button
                  @click="removeImage(index)"
                  class="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                  title="Remove"
                >
                  &times;
                </button>
              </div>
            </div>
          </div>
          <div class="pb-2">
            <button
              type="submit"
              class="w-full py-2 bg-blue-500 text-white hover:bg-blue-600 transition duration-300 rounded-sm text-xs 3xl:text-sm"
            >
              {{ isEditMode ? "Edit Surat" : "Buat Surat" }}
            </button>
          </div>
        </form>
      </div>
      <div
        v-if="isLightboxOpen"
        class="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
      >
        <div class="relative bg-white p-2">
          <div @click="closeLightbox" class="flex justify-end">
            <button>
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
          <img :src="currentImage.preview" class="max-w-full max-h-[80vh]" />
        </div>
      </div>
    </div>

    <div
      v-if="isImageModalOpen"
      class="fixed inset-0 bg-gray-800 bg-opacity-50 z-10 px-10"
    >
      <div class="flex justify-end pt-4">
        <button @click="closeImageModal">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            class="fill-black"
            viewBox="0 0 256 256"
          >
            <path
              d="M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32Zm0,176H48V48H208V208ZM165.66,101.66,139.31,128l26.35,26.34a8,8,0,0,1-11.32,11.32L128,139.31l-26.34,26.35a8,8,0,0,1-11.32-11.32L116.69,128,90.34,101.66a8,8,0,0,1,11.32-11.32L128,116.69l26.34-26.35a8,8,0,0,1,11.32,11.32Z"
            ></path>
          </svg>
        </button>
      </div>

      <div
        class="flex justify-center items-center h-screen space-x-4 -mt-10 3xl:-mt-0"
      >
        <button @click="showPrevImage" :disabled="currentIndex === 0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            fill="#000000"
            viewBox="0 0 256 256"
          >
            <path
              d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z"
            ></path>
          </svg>
        </button>
        <div class="w-auto rounded-md">
          <div class="flex justify-between space-x-4">
            <div class="flex space-x-4 overflow-x-auto">
              <img
                :src="getFullImgPath(lampiranPreview[currentIndex])"
                alt="Lampiran Image"
                class="w-[20rem] 3xl:w-[20rem] h-[30rem] 3xl:h-[30rem] object-cover"
              />
            </div>
          </div>
          <div>
            <button
              v-if="checkSign === loggedInUser"
              @click="openTandaTanganModal(lampiranPreview[currentIndex])"
              class="py-1 px-4 w-full bg-blue-500 text-white hover:bg-blue-600 transition duration-300 rounded-b-md"
            >
              Tanda Tangani
            </button>
          </div>
        </div>
        <button
          @click="showNextImage"
          :disabled="currentIndex === lampiranPreview.length - 1"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            fill="#000000"
            viewBox="0 0 256 256"
          >
            <path
              d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"
            ></path>
          </svg>
        </button>
      </div>
    </div>

    <div>
      <div class="w-auto overflow-x-auto">
        <div v-if="role !== 'admin'" class="mt-4">
          <table class="bg-white border border-gray-300">
            <thead>
              <tr class="bg-gray-100">
                <th
                  class="px-4 py-2 border border-gray-200 text-gray-600 font-semibold text-xs uppercase whitespace-nowrap"
                >
                  Tanggal
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
                  Tindak Lanjut
                </th>
                <th
                  class="px-4 py-2 border border-gray-200 text-gray-600 font-semibold text-xs uppercase whitespace-nowrap"
                >
                  Status
                </th>
                <th
                  class="px-4 py-2 border border-gray-200 text-gray-600 font-semibold text-xs uppercase whitespace-nowrap"
                >
                  Lampiran
                </th>
                <th
                  class="px-4 py-2 border border-gray-200 text-gray-600 font-semibold text-xs uppercase whitespace-nowrap"
                >
                  Exect
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
                v-for="item in filteredSurats"
                :key="item._id"
                class="text-center"
              >
                <td
                  class="border font-light text-xs 3xl:text-sm text-gray-600 capitalize whitespace-nowrap"
                >
                  {{ item.tanggalTindakLanjut.split("T")[0] }}
                </td>
                <td
                  class="px-4 border font-light text-xs 3xl:text-sm text-gray-600 capitalize whitespace-nowrap"
                >
                  {{ item.nomorSurat }}
                </td>
                <td
                  class="px-4 border font-light text-xs 3xl:text-sm text-gray-600 capitalize whitespace-nowrap w-[15rem] max-w-[15rem] overflow-x-auto"
                >
                  {{ item.perihal }}
                </td>
                <td
                  class="px-4 border font-light text-xs 3xl:text-sm text-gray-600 capitalize whitespace-nowrap"
                >
                  {{ item.pengirim.username }}
                </td>
                <td
                  class="px-4 border font-light text-xs 3xl:text-sm text-gray-600 capitalize whitespace-nowrap"
                >
                  {{ item.penerima.username }}
                </td>
                <td
                  class="px-4 border font-light text-xs 3xl:text-sm text-gray-600 capitalize whitespace-nowrap"
                >
                  <button @click="openTindakLanjut(item)" class="group">
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
                    v-if="isTindakLanjut"
                    class="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50"
                  >
                    <div
                      class="bg-white p-6 max-w-lg h-auto flex flex-col justify-center items-center space-y-4"
                    >
                      <div>
                        <h1>{{ item.isiTidakLanjut }}</h1>
                      </div>
                      <div>
                        <button
                          @click="closeTindakLanjut"
                          class="px-4 py-2 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 transition duration-200"
                        >
                          Tutup
                        </button>
                      </div>
                    </div>
                  </div>
                </td>
                <td
                  class="px-4 border font-light text-xs 3xl:text-sm text-gray-600 capitalize whitespace-nowrap"
                >
                  {{ item.status }}
                </td>

                <td
                  class="px-4 border font-light text-xs 3xl:text-sm text-gray-600 capitalize whitespace-nowrap"
                >
                  <div class="flex justify-center">
                    <div v-if="item.penerima.username === loggedInUser">
                      <button
                        v-if="
                          item.penerima.username === loggedInUser &&
                          item.status === 'dikirim'
                        "
                        @click="openImageModal(item)"
                        class="px-2 py-1 relative group"
                      >
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
                      <button
                        v-if="
                          item.penerima.username === loggedInUser &&
                          item.status !== 'dikirim'
                        "
                        @click="openImageModal(item)"
                        class="px-2 py-1 relative group"
                      >
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
                    </div>

                    <div v-else-if="item.pengirim.username === loggedInUser">
                      <button
                        v-if="item.pengirim.username"
                        @click="openImageModalPengirim(item)"
                        class="px-2 py-1"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="fill-gray-500 hover:fill-black size-6"
                          viewBox="0 0 256 256"
                        >
                          <path
                            d="M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM160,51.31,188.69,80H160ZM200,216H56V40h88V88a8,8,0,0,0,8,8h48V216Zm-32-80a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h64A8,8,0,0,1,168,136Zm0,32a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h64A8,8,0,0,1,168,168Z"
                          ></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </td>

                <td
                  class="px-4 border font-light text-xs 3xl:text-sm text-gray-600 capitalize whitespace-nowrap"
                >
                  <div v-if="item.penerima.username === loggedInUser">
                    <div v-if="item.status === 'dikirim'">
                      <button
                        @click="unlockSurat(item._id)"
                        class="px-4 py-2 bg-green-500 text-white hover:bg-green-600 transition duration-300"
                      >
                        Unlock & Terima Surat
                      </button>
                    </div>
                    <div v-else class="space-x-4">
                      <button
                        @click="openRevisiModal(item)"
                        class="relative group fill-gray-400"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="size-6"
                          viewBox="0 0 256 256"
                        >
                          <path
                            d="M227.32,73.37,182.63,28.69a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H216a8,8,0,0,0,0-16H115.32l112-112A16,16,0,0,0,227.32,73.37ZM92.69,208H48V163.31l88-88L180.69,120ZM192,108.69,147.32,64l24-24L216,84.69Z"
                          ></path>
                        </svg>
                        <span
                          class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs bg-black text-white rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-no-wrap"
                        >
                          Revisi
                        </span>
                      </button>

                      <button class="relative group">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          class="size-6 stroke-red-500"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636"
                          />
                        </svg>

                        <span
                          class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs bg-black text-white rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap"
                        >
                          tolak
                        </span>
                      </button>
                    </div>
                  </div>
                  <div
                    v-else-if="item.pengirim.username === loggedInUser"
                    class="space-x-4"
                  >
                    <button
                      v-if="item.status === 'revisi'"
                      @click="RevSurat(item._id)"
                      class="px-4 py-2 bg-yellow-500 text-white hover:bg-yellow-600 transition duration-300"
                    >
                      Tandai direvisi
                    </button>
                    <button
                      @click="editSurat(item)"
                      class="py-2 transition duration-300"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        class="size-6 stroke-blue-500"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                        />
                      </svg>
                    </button>
                    <button
                      @click="deleteSurat(item._id)"
                      class="py-2 transition duration-300"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="fill-red-500 size-6"
                        viewBox="0 0 256 256"
                      >
                        <path
                          d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z"
                        ></path>
                      </svg>
                    </button>
                  </div>
                </td>
                <td v-if="item.keterangan !== ''" class="px-4 py-2 border">
                  <button @click="openDescKet(item)" class="relative group">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="fill-gray-600 hover:fill-black size-6"
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
                    v-if="revKet"
                    class="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50"
                  >
                    <div
                      class="bg-white p-6 max-w-lg h-auto flex flex-col justify-center items-center space-y-4"
                    >
                      <div>
                        <h1>{{ item.keterangan }}</h1>
                      </div>
                      <div>
                        <button
                          @click="closeRevKet"
                          class="px-4 py-2 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 transition duration-200"
                        >
                          Tutup
                        </button>
                      </div>
                    </div>
                  </div>
                </td>
                <td v-else class="px-4 py-2 border">-</td>
              </tr>
              <tr v-if="filteredSurats.length === 0">
                <td
                  colspan="9"
                  class="py-4 text-center text-xs 3xl:text-sm text-gray-500 w-full"
                >
                  Tidak ada data surat.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="mt-4">
          <table class="w-auto bg-white border border-gray-300">
            <thead>
              <tr class="bg-gray-100">
                <th
                  class="px-4 py-2 border border-gray-200 text-gray-600 font-semibold text-xs uppercase whitespace-nowrap"
                >
                  Tanggal
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
                  Tindak Lanjut
                </th>
                <th
                  class="px-4 py-2 border border-gray-200 text-gray-600 font-semibold text-xs uppercase whitespace-nowrap"
                >
                  Status
                </th>
                <th
                  class="px-4 py-2 border border-gray-200 text-gray-600 font-semibold text-xs uppercase whitespace-nowrap"
                >
                  Lampiran
                </th>
                <th
                  class="px-4 py-2 border border-gray-200 text-gray-600 font-semibold text-xs uppercase whitespace-nowrap"
                >
                  Exect
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
                v-for="item in filteredAdminSurats"
                :key="item._id"
                class="text-center"
              >
                <td
                  class="px-4 border font-light text-xs 3xl:text-sm text-gray-600 capitalize whitespace-nowrap whitespace-nowrap"
                >
                  {{ item.tanggalTindakLanjut.split("T")[0] }}
                </td>
                <td
                  class="px-4 border font-light text-xs 3xl:text-sm text-black capitalize whitespace-nowrap underline"
                >
                  {{ item.nomorSurat }}
                </td>
                <td
                  class="px-4 border font-light text-xs 3xl:text-sm text-gray-600 capitalize whitespace-nowrap w-[15rem] max-w-[15rem] overflow-x-auto"
                >
                  {{ item.perihal }}
                </td>
                <td
                  class="px-4 border font-light text-xs 3xl:text-sm text-gray-600 capitalize whitespace-nowrap"
                >
                  {{ item.pengirim.username }} ({{ item.pengirim.jabatan }})
                </td>
                <td
                  class="px-4 border font-light text-xs 3xl:text-sm text-gray-600 capitalize whitespace-nowrap"
                >
                  {{ item.penerima.username }} ({{ item.penerima.jabatan }})
                </td>
                <td
                  class="px-4 border font-light text-xs 3xl:text-sm text-gray-600 capitalize"
                >
                  <button @click="openTindakLanjut(item)" class="group">
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
                    v-if="isTindakLanjut"
                    class="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50"
                  >
                    <div
                      class="bg-white p-6 max-w-lg h-auto flex flex-col justify-center items-center space-y-4"
                    >
                      <div>
                        <h1>{{ item.isiTidakLanjut }}</h1>
                      </div>
                      <div>
                        <button
                          @click="closeTindakLanjut"
                          class="px-4 py-2 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 transition duration-200"
                        >
                          Tutup
                        </button>
                      </div>
                    </div>
                  </div>
                </td>
                <td
                  class="px-4 border font-light text-xs 3xl:text-sm text-gray-600 capitalize whitespace-nowrap"
                >
                  {{ item.status }}
                </td>

                <td
                  class="px-4 border font-light text-xs 3xl:text-sm text-gray-600 capitalize whitespace-nowrap"
                >
                  <div class="flex justify-center">
                    <div>
                      <button
                        @click="openImageModal(item)"
                        class="relative group"
                      >
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
                    </div>
                  </div>
                </td>

                <td
                  class="px-4 border font-light text-xs 3xl:text-sm text-gray-600 capitalize whitespace-nowrap w-full"
                >
                  <div class="space-x-4 py-2 flex">
                    <button @click="editSurat(item)" class="relative group">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        class="size-6 stroke-blue-500"
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
                        Edit
                      </span>
                    </button>
                    <button
                      @click="deleteSurat(item._id)"
                      class="relative group"
                    >
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
                <td v-if="item.keterangan !== ''" class="px-4 py-2 border">
                  {{ item.keterangan }}
                </td>
                <td v-else class="px-4 py-2 border">-</td>
              </tr>
              <tr v-if="filteredAdminSurats.length === 0">
                <td
                  colspan="9"
                  class="py-4 text-center text-xs 3xl:text-sm text-gray-500 w-full"
                >
                  Tidak ada data surat.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div
      v-if="isVerificationModalOpen"
      class="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50"
    >
      <div class="bg-white p-6 max-w-sm h-auto space-y-4">
        <h3 class="text-xs 3xl:text-sm font-medium">
          Apakah Anda yakin ingin memperbarui surat dengan lampiran tanda
          tangan?
        </h3>
        <div class="flex justify-end space-x-4">
          <button
            @click="updateSuratWithNewLampiran"
            class="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-200 text-xs 3xl:text-sm"
          >
            Perbarui
          </button>
          <button
            @click="closeVerificationModal"
            class="px-4 py-2 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 transition duration-200 text-xs 3xl:text-sm"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>

    <TandaTangan
      class=""
      :imageUrl="imageUrlForTandaTangan"
      v-if="isTandaTanganModalOpen"
      @closeModal="closeTandaTanganModal"
      @updateSignedImage="handleSignedImageUpdate"
      @openVerificationModal="openVerificationModal"
    />

    <div
      v-if="isRevisiModalOpen"
      class="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50"
    >
      <div
        class="bg-white p-6 w-[40rem] h-[20rem] flex flex-col justify-center items-center space-y-4"
      >
        <h3 class="text-xl font-medium">Masukkan Deskripsi Revisi Surat</h3>
        <textarea
          v-model="keteranganRevisi"
          rows="4"
          placeholder="Masukkan deskripsi revisi..."
          class="w-full p-3 border border-gray-400"
        ></textarea>
        <div class="space-x-4">
          <button
            @click="updateSuratStatusToRevisi"
            class="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-200"
          >
            Ya, Perbarui Surat
          </button>
          <button
            @click="closeRevisiModal"
            class="px-4 py-2 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 transition duration-200"
          >
            Tidak, Batalkan
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TandaTangan from "./TandaTangan.vue";
import comSurat from "../services/comSurat";
import comUser from "../services/comUser";

export default {
  components: {
    TandaTangan,
  },
  data() {
    return {
      isTandaTanganModalOpen: false,
      imageUrlForTandaTangan: "",
      surats: [],
      listSuratAdmin: [],
      users: [],
      surat: {
        nomorSurat: "",
        perihal: "",
        pengirim: "",
        penerima: "",
        status: "dikirim",
        isiTidakLanjut: "",
        lampiran: [],
        keterangan: "",
      },
      isModalOpen: false,
      isEditMode: false,
      selectedSuratId: null,
      isImageModalOpen: false,
      lampiranPreview: [],
      isLightboxOpen: false,
      currentImage: null,
      isSignedImageUpdated: false,
      signedImage: null,
      isVerificationModalOpen: false,
      isRevisiModalOpen: false,
      selectedSuratIdForRevisi: null,
      keteranganRevisi: "",
      revKet: false,
      checkSign: "",
      currentIndex: 0,
      filters: {
        q: "",
        dateFrom: "",
        dateTo: "",
        sender: "",
        receiver: "",
      },
      isTindakLanjut: false,
    };
  },
  computed: {
    loggedInUser() {
      return this.$store.state.user.username;
    },
    role() {
      return this.$store.state.user.role;
    },

    distinctSenders() {
      const list = this.role === "admin" ? this.listSuratAdmin : this.surats;
      return Array.from(new Set(list.map((s) => s.pengirim.username))).sort();
    },

    distinctReceivers() {
      const list = this.role === "admin" ? this.listSuratAdmin : this.surats;
      return Array.from(new Set(list.map((s) => s.penerima.username))).sort();
    },
    visibleSurats() {
      if (this.role === "admin") return this.surats;
      return this.surats.filter((s) => {
        return [s.pengirim.username, s.penerima.username].includes(
          this.loggedInUser
        );
      });
    },
    visibleAdmin() {
      return this.listSuratAdmin;
    },

    filteredSurats() {
      return this.visibleSurats
        .filter((s) => {
          const t = this.filters.q.toLowerCase();
          return (
            !t ||
            s.nomorSurat.toLowerCase().includes(t) ||
            s.perihal.toLowerCase().includes(t)
          );
        })
        .filter((s) => {
          const d = new Date(s.tanggalTindakLanjut);
          if (this.filters.dateFrom && d < new Date(this.filters.dateFrom))
            return false;
          if (this.filters.dateTo && d > new Date(this.filters.dateTo))
            return false;
          return true;
        })
        .filter((s) => {
          return (
            !this.filters.sender || s.pengirim.username === this.filters.sender
          );
        })
        .filter((s) => {
          return (
            !this.filters.receiver ||
            s.penerima.username === this.filters.receiver
          );
        });
    },

    filteredAdminSurats() {
      return this.visibleAdmin
        .filter((s) => {
          const t = this.filters.q.toLowerCase();
          return (
            !t ||
            s.nomorSurat.toLowerCase().includes(t) ||
            s.perihal.toLowerCase().includes(t)
          );
        })
        .filter((s) => {
          const d = new Date(s.tanggalTindakLanjut);
          if (this.filters.dateFrom && d < new Date(this.filters.dateFrom))
            return false;
          if (this.filters.dateTo && d > new Date(this.filters.dateTo))
            return false;
          return true;
        })
        .filter((s) => {
          return (
            !this.filters.sender || s.pengirim.username === this.filters.sender
          );
        })
        .filter((s) => {
          return (
            !this.filters.receiver ||
            s.penerima.username === this.filters.receiver
          );
        });
    },
  },
  mounted() {
    this.loggedInUser = this.$store.state.user.username;
    this.jabatan = this.$store.state.user.jabatan;
    this.role = this.$store.state.user.role;
    this.fetchSurats();
    this.fetchUsers();
    this.fetchAllSurat();
  },
  methods: {
    openTindakLanjut() {
      this.isTindakLanjut = true;
    },
    closeTindakLanjut() {
      this.isTindakLanjut = false;
    },
    showPrevImage() {
      if (this.currentIndex > 0) {
        this.currentIndex--;
      }
    },
    showNextImage() {
      if (this.currentIndex < this.lampiranPreview.length - 1) {
        this.currentIndex++;
      }
    },
    RevSurat(id) {
      comSurat
        .updateSuratKeterangan(id, {
          keterangan: "",
          status: "direvisi",
        })
        .then(() => {
          this.fetchSurats();
        })
        .catch((error) => {
          console.error("Error updating surat keterangan:", error);
        });
      alert("Revisi Telah Dikirim");
      this.fetchSurats();
    },
    openDescKet() {
      this.revKet = true;
    },
    closeRevKet() {
      this.revKet = false;
    },
    openRevisiModal(surat) {
      this.selectedSuratIdForRevisi = surat._id;
      this.keteranganRevisi = "";
      this.isRevisiModalOpen = true;
    },
    closeRevisiModal() {
      this.isRevisiModalOpen = false;
    },
    updateSuratStatusToRevisi() {
      comSurat
        .updateSuratKeterangan(this.selectedSuratIdForRevisi, {
          keterangan: this.keteranganRevisi,
          status: "revisi",
        })
        .then(() => {
          alert("Surat berhasil diperbarui dengan keterangan revisi!");
          this.fetchSurats();
          this.closeRevisiModal();
        })
        .catch((error) => {
          console.error("Error updating surat keterangan:", error);
        });
    },
    fetchAllSurat() {
      comSurat
        .getAllSurat()
        .then((response) => {
          if (this.role === "admin") {
            this.listSuratAdmin = response.data.data;
            this.listSuratAdmin = response.data.data.map((surat) => ({
              ...surat,
              pengirim: JSON.parse(surat.pengirim),
              penerima: JSON.parse(surat.penerima),
            }));
          } else {
            response.status(403);
          }
        })
        .catch((error) => {
          console.error("Error fetching surats:", error);
        });
    },
    fetchSurats() {
      const loggedInUser = this.$store.state.user.username;
      comSurat
        .getAllSurat()
        .then((response) => {
          const parsedData = response.data.data.map((surat) => ({
            ...surat,
            pengirim: JSON.parse(surat.pengirim),
            penerima: JSON.parse(surat.penerima),
          }));

          this.surats = parsedData.filter((surat) => {
            return (
              surat.pengirim.username === loggedInUser ||
              surat.penerima.username === loggedInUser
            );
          });

          const suratForCheckSign = this.surats.find(
            (surat) => surat.penerima.username === loggedInUser
          );
          if (suratForCheckSign) {
            this.checkSign = suratForCheckSign.penerima.username;
            console.log(this.checkSign);
          } else {
            this.checkSign = "";
          }
        })
        .catch((error) => {
          console.error("Error fetching surats:", error);
        });
    },
    handleSignedImageUpdate(signedBase64) {
      const byteString = atob(signedBase64.split(",")[1]);
      const mimeString = signedBase64.split(",")[0].split(":")[1].split(";")[0];

      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }

      const blob = new Blob([ab], { type: mimeString });
      const file = new File([blob], "signed-lampiran.png", {
        type: mimeString,
      });

      this.signedImage = file;
      this.isSignedImageUpdated = true;
    },
    openVerificationModal() {
      this.isVerificationModalOpen = true;
    },
    closeVerificationModal() {
      this.isVerificationModalOpen = false;
    },
    updateSuratWithNewLampiran() {
      const formData = new FormData();
      formData.append("signature", this.signedImage);
      const original = this.imageUrlForTandaTangan.replace(
        "http://localhost:3000/",
        ""
      );
      formData.append("originalPath", original);

      comSurat
        .updateSignatureReplace(this.selectedSuratId, formData)
        .then(() => {
          alert("Surat & lampiran tandatangan dah di-replace!");
          this.fetchSurats();
          this.closeAllModals();
        })
        .catch((error) => {
          console.error("Error replace signature:", error);
        });
    },
    closeAllModals() {
      this.isImageModalOpen = false;
      this.isTandaTanganModalOpen = false;
      this.isVerificationModalOpen = false;
    },
    removeImage(index) {
      this.surat.lampiran.splice(index, 1);
    },
    openLightbox(index) {
      this.currentImage = this.surat.lampiran[index];
      this.isLightboxOpen = true;
    },
    closeLightbox() {
      this.isLightboxOpen = false;
      this.currentImage = null;
    },
    unlockSurat(id) {
      comSurat
        .updateStatusSurat(id, "diterima")
        .then(() => {
          alert("Surat berhasil diterima!");
          this.fetchSurats();
        })
        .catch((error) => {
          console.error("Error updating surat status:", error);
        });
    },
    openImageModalPengirim(surat) {
      this.lampiranPreview = surat.lampiran;
      this.isImageModalOpen = true;
    },
    openImageModal(surat) {
      if (this.role !== "admin") {
        if (surat.status === "dikirim") {
          alert("Harap unlock surat terlebih dahulu sebelum melihat lampiran!");
          return;
        }

        if (surat.status === "diterima" && surat.status !== "dibaca") {
          this.setDibaca(surat);
        }

        this.lampiranPreview = surat.lampiran;
        this.currentIndex = 0;
        this.isImageModalOpen = true;
      } else {
        this.lampiranPreview = surat.lampiran;
        this.currentIndex = 0;
        this.isImageModalOpen = true;
      }
    },
    closeImageModal() {
      this.isImageModalOpen = false;
    },
    setDibaca(surat) {
      comSurat
        .updateStatusSurat(surat._id, "dibaca")
        .then(() => {
          this.fetchSurats();
        })
        .catch((error) => {
          console.error("Error updating surat status:", error);
        });
    },
    openTandaTanganModal(image) {
      this.imageUrlForTandaTangan = this.getFullImgPath(image);
      this.isTandaTanganModalOpen = true;

      const surat = this.surats.find(
        (s) =>
          s.lampiran.includes(image) ||
          s.lampiran.includes(image.file) ||
          s.lampiran.includes(image.preview)
      );

      if (surat) {
        this.selectedSuratId = surat._id;
      } else {
        console.warn("Surat tidak ditemukan untuk lampiran ini.");
      }
    },
    closeTandaTanganModal() {
      this.isTandaTanganModalOpen = false;
    },

    getFullImgPath(img) {
      return `http://localhost:3000/${img}`;
    },
    fetchUsers() {
      comUser
        .getUsersByStatus("active")
        .then((response) => {
          this.users = response.data.data;
        })
        .catch((error) => {
          console.error("Error fetching users:", error);
        });
    },
    createSurat() {
      const pengirimx = this.$store.state.user;
      console.log("Pengirim:", pengirimx);
      this.surat.pengirim = JSON.stringify(pengirimx);

      const formData = new FormData();
      for (const key in this.surat) {
        if (key === "lampiran") {
          this.surat.lampiran.forEach((file) =>
            formData.append("lampiran", file.file)
          );
        } else {
          formData.append(key, this.surat[key]);
        }
      }

      comSurat
        .createSurat(formData)
        .then(() => {
          alert("Surat created successfully!");
          this.fetchSurats();
          this.closeModal();
        })
        .catch((error) => {
          console.error("Error creating surat:", error);
        });
    },
    editSurat(surat) {
      this.isModalOpen = true;
      this.isEditMode = true;
      this.selectedSuratId = surat._id;
      this.surat = { ...surat };
      this.surat.status = surat.status;
      this.surat.pengirim = JSON.stringify(surat.pengirim);
      this.surat.penerima = JSON.stringify(surat.penerima);
      this.surat.lampiran = this.surat.lampiran.map((image) => ({
        file: image.file,
        preview: image.preview || this.getFullImgPath(image),
      }));
    },
    updateSurat() {
      const formData = new FormData();
      this.surat.lampiran.forEach((imgObj) => {
        if (imgObj.file) {
          formData.append("newFiles", imgObj.file);
        }
      });
      const remaining = this.surat.lampiran
        .filter((imgObj) => !imgObj.file)
        .map((imgObj) => imgObj.preview.replace("http://localhost:3000/", ""));
      formData.append("existingPaths", JSON.stringify(remaining));
      formData.append("nomorSurat", this.surat.nomorSurat);
      formData.append("perihal", this.surat.perihal);
      formData.append("pengirim", this.surat.pengirim);
      formData.append("penerima", this.surat.penerima);
      formData.append("status", this.surat.status);
      formData.append("isiTidakLanjut", this.surat.isiTidakLanjut);
      formData.append("keterangan", this.surat.keterangan);

      comSurat
        .updateSurat(this.selectedSuratId, formData)
        .then(() => {
          alert("Surat updated successfully!");
          this.fetchSurats();
          this.closeModal();
        })
        .catch((err) => console.error(err));
    },
    deleteSurat(id) {
      if (confirm("Are you sure you want to delete this surat?")) {
        comSurat
          .deleteSurat(id)
          .then(() => {
            alert("Surat deleted successfully!");
            this.fetchSurats();
          })
          .catch((error) => {
            console.error("Error deleting surat:", error);
          });
      }
    },
    openModal() {
      this.isModalOpen = true;
      this.isEditMode = false;
      this.resetSuratForm();
    },
    closeModal() {
      this.isModalOpen = false;
    },
    resetSuratForm() {
      this.surat = {
        nomorSurat: "",
        perihal: "",
        pengirim: "",
        penerima: "",
        status: "dikirim",
        isiTidakLanjut: "",
        lampiran: [],
        keterangan: "",
      };
    },
    handleFileUpload(event) {
      const files = event.target.files;
      const validFiles = [];

      if (this.surat.lampiran.length + files.length <= 10) {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const fileExtension = file.name.split(".").pop().toLowerCase();
          if (fileExtension === "jpg" || fileExtension === "png") {
            validFiles.push(file);

            const reader = new FileReader();
            reader.onloadend = () => {
              this.surat.lampiran.push({
                file: file,
                preview: reader.result,
              });
            };
            reader.readAsDataURL(file);
          } else {
            alert(
              `${file.name} is not a valid file type! Only JPG and PNG are allowed.`
            );
          }
        }
      } else {
        alert("You can only upload a maximum of 10 images.");
      }
    },
  },
};
</script>
