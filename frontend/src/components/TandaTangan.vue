<template>
  <div
    class="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center p-4"
    @click.self="$emit('close')"
  >
    <div
      class="bg-white rounded-lg shadow-lg max-w-[90vw] max-h-[90vh] flex flex-col"
      style="width: 700px; height: 90vh"
    >
      <div
        v-if="pdfData"
        ref="pdfContainer"
        class="relative flex-1 overflow-auto border border-gray-300 rounded-t-lg"
      >
        <pdf
          :src="pdfData"
          :page="currentPage"
          @num-pages="onNumPages"
          style="width: 100%; height: 100%; display: block"
        />

        <img
          v-if="signatureImage"
          :src="signatureImage"
          :style="{
            position: 'absolute',
            top: signaturePos.y + 'px',
            left: signaturePos.x + 'px',
            width: '75px',
            height: '100px',
            cursor: 'grab',
            userSelect: 'none',
            touchAction: 'none',
          }"
          @mousedown="startDrag"
          @touchstart.prevent="startDrag"
          alt="signature"
        />
      </div>

      <div
        class="flex items-center justify-between bg-gray-100 border-t border-gray-300 rounded-b-lg p-3"
      >
        <button
          @click="prevPage"
          :disabled="currentPage <= 1"
          class="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          Sebelumnya
        </button>
        <span class="text-sm text-gray-700">
          Halaman {{ currentPage }} dari {{ totalPages }}
        </span>
        <button
          @click="nextPage"
          :disabled="currentPage >= totalPages"
          class="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          Selanjutnya
        </button>
      </div>

      <div class="flex items-center space-x-3 p-3 border-t border-gray-300">
        <input
          type="file"
          @change="onSignatureChange"
          accept="image/png, image/jpeg"
          class="border rounded px-2 py-1"
        />

        <button
          @click="insertSignatureToPdf"
          :disabled="!pdfDoc || !signatureImage"
          class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
        >
          Tambah Tanda Tangan
        </button>

        <button
          @click="$emit('close')"
          class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Tutup
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import pdf from "pdfvuer";
import { PDFDocument } from "pdf-lib";

export default {
  name: "TandaTangan",
  components: { pdf },

  props: {
    pdfUrl: {
      type: String,
      required: true,
    },
    originalFileName: {
      type: String,
      required: true,
    },
  },
  emits: ["signed-pdf-ready"],

  data() {
    return {
      pdfDoc: null,
      currentPage: 1,
      totalPages: 0,
      signatureImage: null,
      signaturePos: { x: 50, y: 50 },
      dragging: false,
      dragOffset: { x: 0, y: 0 },
    };
  },

  computed: {
    pdfData() {
      return this.pdfUrl;
    },
  },

  watch: {
    pdfUrl: {
      immediate: true,
      async handler(newUrl) {
        if (!newUrl) return;

        const response = await fetch(newUrl);
        const contentType = response.headers.get("content-type");

        if (!contentType || !contentType.includes("application/pdf")) {
          alert("File yang dimuat bukan PDF valid.");
          return;
        }

        const arrayBuffer = await response.arrayBuffer();
        this.pdfDoc = await PDFDocument.load(arrayBuffer);
        this.totalPages = this.pdfDoc.getPageCount();
        this.currentPage = 1;
      },
    },
  },

  methods: {
    onNumPages(num) {
      this.totalPages = num;
    },

    nextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++;
    },

    prevPage() {
      if (this.currentPage > 1) this.currentPage--;
    },

    onSignatureChange(event) {
      const file = event.target.files[0];
      if (!file) return;
      if (this.signatureImage) URL.revokeObjectURL(this.signatureImage);
      this.signatureImage = URL.createObjectURL(file);
      this.signaturePos = { x: 50, y: 50 };
    },

    startDrag(event) {
      event.preventDefault();
      this.dragging = true;
      let clientX, clientY;
      if (event.type === "mousedown") {
        clientX = event.clientX;
        clientY = event.clientY;
        window.addEventListener("mousemove", this.onDrag);
        window.addEventListener("mouseup", this.stopDrag);
      } else {
        clientX = event.touches[0].clientX;
        clientY = event.touches[0].clientY;
        window.addEventListener("touchmove", this.onDrag);
        window.addEventListener("touchend", this.stopDrag);
      }
      const rect = event.target.getBoundingClientRect();
      this.dragOffset.x = clientX - rect.left;
      this.dragOffset.y = clientY - rect.top;
    },

    onDrag(event) {
      if (!this.dragging) return;
      let clientX, clientY;
      if (event.type === "mousemove") {
        clientX = event.clientX;
        clientY = event.clientY;
      } else {
        clientX = event.touches[0].clientX;
        clientY = event.touches[0].clientY;
      }
      const container = this.$refs.pdfContainer;
      const containerRect = container.getBoundingClientRect();
      const scrollTop = container.scrollTop;
      const scrollLeft = container.scrollLeft;

      let newX = clientX - containerRect.left + scrollLeft - this.dragOffset.x;
      let newY = clientY - containerRect.top + scrollTop - this.dragOffset.y;

      newX = Math.max(0, Math.min(newX, container.scrollWidth - 75));
      newY = Math.max(0, Math.min(newY, container.scrollHeight - 100));

      this.signaturePos = { x: newX, y: newY };
    },
    stopDrag() {
      this.dragging = false;
      window.removeEventListener("mousemove", this.onDrag);
      window.removeEventListener("mouseup", this.stopDrag);
      window.removeEventListener("touchmove", this.onDrag);
      window.removeEventListener("touchend", this.stopDrag);
    },

    async insertSignatureToPdf() {
      if (!this.pdfDoc || !this.signatureImage) {
        alert("PDF atau tanda tangan belum siap.");
        return;
      }
      try {
        const pngBytes = await fetch(this.signatureImage).then((res) =>
          res.arrayBuffer()
        );
        const pngImage = await this.pdfDoc.embedPng(pngBytes);
        const page = this.pdfDoc.getPage(this.currentPage - 1);
        const { width: pdfWidth, height: pdfHeight } = page.getSize();

        const container = this.$refs.pdfContainer;

        const scaleX = pdfWidth / container.scrollWidth;
        const scaleY = pdfHeight / container.scrollHeight;

        const x = this.signaturePos.x * scaleX;
        const y = pdfHeight - this.signaturePos.y * scaleY - 100 * scaleY;

        page.drawImage(pngImage, {
          x,
          y,
          width: 75 * scaleX,
          height: 100 * scaleY,
        });

        const pdfBytes = await this.pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: "application/pdf" });

        const fileName = this.originalFileName;
        const file = new File([blob], fileName, { type: "application/pdf" });

        this.$emit("signed-pdf-ready", file);

        alert("PDF dengan tanda tangan berhasil dibuat!");
      } catch (error) {
        alert("Gagal memasukkan tanda tangan: " + error.message);
      }
    },
  },
};
</script>

<style>
img {
  user-select: none;
  touch-action: none;
}
</style>
