<template>
  <div
    class="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50"
  >
    <div class="w-auto h-[30rem] overflow-y-auto bg-white p-6">
      <div>
        <div class="flex justify-end space-x-4 pb-2">
          <div @click="zoomIn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              fill="#000000"
              viewBox="0 0 256 256"
            >
              <path
                d="M152,112a8,8,0,0,1-8,8H120v24a8,8,0,0,1-16,0V120H80a8,8,0,0,1,0-16h24V80a8,8,0,0,1,16,0v24h24A8,8,0,0,1,152,112Zm77.66,117.66a8,8,0,0,1-11.32,0l-50.06-50.07a88.11,88.11,0,1,1,11.31-11.31l50.07,50.06A8,8,0,0,1,229.66,229.66ZM112,184a72,72,0,1,0-72-72A72.08,72.08,0,0,0,112,184Z"
              ></path>
            </svg>
          </div>
          <div @click="zoomOut">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              fill="#000000"
              viewBox="0 0 256 256"
            >
              <path
                d="M152,112a8,8,0,0,1-8,8H80a8,8,0,0,1,0-16h64A8,8,0,0,1,152,112Zm77.66,117.66a8,8,0,0,1-11.32,0l-50.06-50.07a88.11,88.11,0,1,1,11.31-11.31l50.07,50.06A8,8,0,0,1,229.66,229.66ZM112,184a72,72,0,1,0-72-72A72.08,72.08,0,0,0,112,184Z"
              ></path>
            </svg>
          </div>
        </div>
        <div class="flex items-center space-x-2">
          <div>
            <canvas
              ref="canvas"
              :width="canvasWidth"
              :height="canvasHeight"
              class="mb-4 border border-black"
            ></canvas>
          </div>
        </div>
        <div>
          <div class="py-2 3xl:py-6">
            <div class="flex justify-end space-x-2 3xl:space-x-4">
              <button
                @click="activateSignatureMode"
                class="px-4 py-2 bg-gray-800 text-white font-semibold rounded-sm hover:bg-gray-700 transition duration-200 text-xs 3xl:text-sm"
              >
                Tanda Tangan
              </button>

              <button
                @click="finishSignatureMode"
                v-if="isSignatureMode"
                class="px-4 py-2 bg-gray-800 text-white font-semibold rounded-sm hover:bg-gray-700 transition duration-200 text-xs 3xl:text-sm"
              >
                Selesai
              </button>

              <button
                @click="clearCanvas"
                class="px-4 py-2 bg-red-600 text-white font-semibold rounded-sm hover:bg-red-500 transition duration-200 text-xs 3xl:text-sm"
              >
                Bersihkan
              </button>

              <button
                @click="finishAndReturnSignedImage"
                class="px-4 py-2 bg-blue-500 text-white font-semibold rounded-sm hover:bg-blue-400 transition duration-200 text-xs 3xl:text-sm"
              >
                Selesai & Kembali
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { fabric } from "fabric";

export default {
  props: {
    imageUrl: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      canvas: null,
      isSignatureMode: false,
      signatureGroup: null,
      zoomLevel: 1,
      canvasWidth: 0,
      canvasHeight: 0,
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.canvas = new fabric.Canvas(this.$refs.canvas);
      this.loadImage();
    });
  },
  methods: {
    loadImage() {
      fabric.Image.fromURL(
        this.imageUrl,
        (img) => {
          const { width: imgW, height: imgH } = img;

          this.canvas.setWidth(imgW);
          this.canvas.setHeight(imgH);
          this.canvasWidth = imgW;
          this.canvasHeight = imgH;

          this.canvas.add(img);
          this.canvas.renderAll();
        },
        { crossOrigin: "anonymous" }
      );
    },
    activateSignatureMode() {
      const pencilBrush = new fabric.PencilBrush(this.canvas);
      pencilBrush.width = 1.5;
      this.canvas.freeDrawingBrush = pencilBrush;
      this.canvas.isDrawingMode = true;
      this.isSignatureMode = true;
    },
    finishSignatureMode() {
      this.canvas.isDrawingMode = false;
      const strokes = this.canvas.getObjects().filter((o) => o.type === "path");
      if (!strokes.length) return;

      const sel = new fabric.ActiveSelection(strokes, { canvas: this.canvas });
      this.canvas.setActiveObject(sel);

      const group = sel.toGroup();
      this.signatureGroup = group;

      this.canvas.discardActiveObject();
      this.canvas.requestRenderAll();
    },
    groupAndUnlock() {
      const objects = this.canvas.getObjects();
      if (objects.length > 1) {
        const group = new fabric.Group(objects, {
          left: 100,
          top: 100,
        });

        this.canvas.add(group);
        this.signatureGroup = group;

        this.canvas.discardActiveObject();
      }
    },

    clearCanvas() {
      this.canvas.clear();
      this.loadImage();
      this.signatureGroup = null;
    },

    zoomIn() {
      this.zoomLevel += 0.1;
      this.canvas.setZoom(this.zoomLevel);
    },

    zoomOut() {
      this.zoomLevel -= 0.1;
      if (this.zoomLevel < 0.1) this.zoomLevel = 0.1;
      this.canvas.setZoom(this.zoomLevel);
    },

    finishAndReturnSignedImage() {
      const dataUrl = this.canvas.toDataURL("image/png");
      this.$emit("updateSignedImage", dataUrl);
      this.$emit("closeModal");
      this.$emit("openVerificationModal");
    },
  },
};
</script>
