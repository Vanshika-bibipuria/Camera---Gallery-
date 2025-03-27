document.addEventListener("DOMContentLoaded", () => {
    if (db) {
        loadMedia("video");
        loadMedia("image");
    }
});

function loadMedia(type) {
    let transaction = db.transaction(type, "readonly");
    let store = transaction.objectStore(type);
    let request = store.getAll();

    request.onsuccess = () => {
        let galleryContainer = document.querySelector(".gallery-container");
        request.result.forEach((mediaObj) => {
            let mediaElement = document.createElement("div");
            mediaElement.classList.add("media-element");
            mediaElement.setAttribute("id", mediaObj.id);

            let url = URL.createObjectURL(mediaObj.blobData);
            let content = type === "video" ? `<video src="${url}" autoplay loop></video>` : `<img src="${url}" alt="Captured Image"/>`;

            mediaElement.innerHTML = `
                <div class="media-content">${content}</div>
                <button class="download-btn" onclick="downloadMedia('${url}', '${type}')">DOWNLOAD</button>
                <button class="delete-btn" onclick="deleteMedia('${mediaObj.id}', '${type}')">DELETE</button>
            `;

            galleryContainer.appendChild(mediaElement);
        });
    };
}

function downloadMedia(url, type) {
    let a = document.createElement("a");
    a.href = url;
    a.download = type === "video" ? "video.mp4" : "image.jpg";
    a.click();
}

function deleteMedia(id, type) {
    let transaction = db.transaction(type, "readwrite");
    let store = transaction.objectStore(type);
    store.delete(id);

    document.getElementById(id).remove();
}
