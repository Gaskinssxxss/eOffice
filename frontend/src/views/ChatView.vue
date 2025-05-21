<template>
  <div class="flex h-[90vh] 3xl:h-[82vh] py-14">
    <aside class="w-[15rem] border border-gray-400 overflow-y-auto">
      <div class="py-2">
        <h2 class="text-lg font-bold text-gray-600 px-2">Users</h2>
        <div class="border-b border-gray-400"></div>
      </div>
      <ul>
        <li
          v-for="user in users"
          :key="user.username"
          @click="selectUser(user)"
          :class="{
            'bg-blue-300 text-white':
              selectedUser && selectedUser.username === user.username,
          }"
          class="flex justify-between text-sm items-center cursor-pointer py-1 hover:bg-blue-300 px-2"
        >
          <span class="text-gray-900">{{ user.username }}</span>
          <span v-if="user.unread" class="h-3 w-3 bg-black block"></span>
        </li>
      </ul>
    </aside>

    <section
      class="flex-1 flex flex-col relative border-r border-y border-gray-400"
    >
      <div class="flex-1 p-4 overflow-y-auto pb-16" ref="chatContainer">
        <div
          v-for="msg in messages"
          :key="msg.id"
          class="flex mb-2"
          :class="msg.from === loggedInUser ? 'justify-end' : 'justify-start'"
        >
          <div
            class="p-2 border border-gray-700 text-sm min-w-[15rem]"
            :class="
              msg.from === loggedInUser
                ? 'bg-white text-gray-900'
                : 'bg-gray-100 text-gray-900'
            "
          >
            {{ msg.text }}
            <div class="text-xs text-gray-600 mt-1 flex justify-between">
              <div>
                {{ new Date(msg.timestamp).toLocaleTimeString() }}
              </div>
              <div>
                <div v-if="msg.read != true" class="text-gray-300">
                  belum dibaca
                </div>
                <div v-else class="text-blue-600">dibaca</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer
        class="absolute bottom-0 left-0 right-0 border-t border-gray-400 bg-white p-2 flex"
      >
        <form @submit.prevent="sendMessage" class="flex flex-1">
          <input
            v-model="newMessage"
            type="text"
            placeholder="Type a message..."
            class="flex-1 p-2 border border-gray-400 bg-white text-gray-900 focus:outline-none"
            :disabled="!selectedUser"
          />
          <button
            type="submit"
            class="ml-2 p-2 border border-gray-400 bg-blue-500 hover:bg-blue-600 rounded-sm text-white"
            :disabled="!newMessage || !selectedUser"
          >
            Send
          </button>
        </form>
      </footer>
    </section>
  </div>
</template>

<script>
import { io } from "socket.io-client";
import comUser from "@/services/comUser";

export default {
  name: "ChatFeature",
  data() {
    return {
      socket: null,
      users: [],
      selectedUser: null,
      messages: [],
      newMessage: "",
      loggedInUser: "",
      notification: { active: false, from: "", text: "" },
    };
  },
  async mounted() {
    this.loggedInUser = this.$store.state.user.username;
    const res = await comUser.getUsersByStatus("active");
    this.users = res.data.data
      .filter((u) => u.username !== this.loggedInUser)
      .map((u) => ({ ...u, unread: false }));

    this.socket = io("http://localhost:3000", { withCredentials: true });
    this.socket.emit("join", this.loggedInUser);

    this.socket.on("unread_list", (list) => {
      this.users.forEach((u) => {
        u.unread = list.includes(u.username);
      });
    });

    this.socket.on("receive_message", (payload) => {
      const isForCurrentChat =
        payload.from === this.selectedUser?.username &&
        payload.to === this.loggedInUser;
      const isSentByMe = payload.from === this.loggedInUser;

      if (!isForCurrentChat && payload.to === this.loggedInUser) {
        this.setUnread(payload.from);
        this.triggerNotification(payload.from, payload.text);
      }

      if (isForCurrentChat || isSentByMe) {
        this.messages.push(payload);
        this.scrollDown();
      }
    });

    this.socket.on("history", (history) => {
      this.messages = history;
      this.clearUnread(this.selectedUser.username);
      this.scrollDown();
    });
  },
  methods: {
    selectUser(user) {
      this.selectedUser = user;
      this.messages = [];
      this.clearUnread(user.username);
      this.socket.emit("clear_unread", { withUser: user.username });
      this.socket.emit("get_history", { withUser: user.username });
    },
    sendMessage() {
      if (!this.selectedUser) return;
      const payload = {
        id: Date.now(),
        from: this.loggedInUser,
        to: this.selectedUser.username,
        text: this.newMessage,
        timestamp: new Date().toISOString(),
      };
      this.socket.emit("send_message", payload);
      this.messages.push(payload);
      this.newMessage = "";
      this.scrollDown();
    },
    triggerNotification(from, text) {
      this.notification.from = from;
      this.notification.text = text;
      this.notification.active = true;
      setTimeout(() => {
        this.notification.active = false;
      }, 3000);
    },
    setUnread(username) {
      const u = this.users.find((u) => u.username === username);
      if (u) u.unread = true;
    },
    clearUnread(username) {
      const u = this.users.find((u) => u.username === username);
      if (u) u.unread = false;
    },
    scrollDown() {
      this.$nextTick(() => {
        const c = this.$refs.chatContainer;
        if (c) c.scrollTop = c.scrollHeight;
      });
    },
  },
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: none;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
