async function loadUsers() {
    try {
        const response = await fetch("/api/users");
        const users = await response.json();
        console.log("Fetched users:", users); // Debugging

        const userSelect = document.getElementById("userSelect");

        if (!userSelect) {
            console.error("Dropdown element not found!");
            return;
        }

        if (users.length === 0) {
            userSelect.innerHTML = `<option value="">No users found</option>`;
            return;
        }

        // Populate dropdown
        userSelect.innerHTML = users.map(user => 
            `<option value="${user._id}">${user.name}</option>`
        ).join("");

    } catch (err) {
        console.error("Error fetching users:", err);
        alert("Failed to load users. Check console for details.");
    }
}

// Load users when the page loads
document.addEventListener("DOMContentLoaded", loadUsers);

// 🌟 Join chat room
const currentUser = prompt("Enter your user ID:"); // Replace this with actual login
socket.emit("join", currentUser);

// 🌟 Handle message sending
document.getElementById("sendMessage").addEventListener("click", () => {
    const receiver = document.getElementById("userSelect").value;
    const messageInput = document.getElementById("messageInput");
    const message = messageInput.value.trim();

    if (receiver && message) {
        socket.emit("sendMessage", { sender: currentUser, receiver, message });
        messageInput.value = "";
    }
});

// 🌟 Receive messages
socket.on("receiveMessage", (message) => {
    const chatBox = document.getElementById("chat-box");
    chatBox.innerHTML += `<p><strong>${message.sender}:</strong> ${message.message}</p>`;
});

// 🌟 Load previous messages when a user is selected
document.getElementById("userSelect").addEventListener("change", async () => {
    const receiver = document.getElementById("userSelect").value;
    if (!receiver) return;

    socket.emit("loadMessages", { sender: currentUser, receiver });

    socket.on("messagesLoaded", (messages) => {
        const chatBox = document.getElementById("chat-box");
        chatBox.innerHTML = messages.map(msg =>
            `<p><strong>${msg.sender}:</strong> ${msg.message}</p>`
        ).join("");
    });
});
