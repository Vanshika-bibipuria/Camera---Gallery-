let videoElem = document.querySelector("video");
let recordBtn = document.querySelector(".record-btn");
let captureBtn = document.querySelector(".capture-btn");
let recording = false;
let recorder;
let chunks = [];

// Set up the video stream
navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
    videoElem.srcObject = stream;
    recorder = new MediaRecorder(stream);

    recorder.ondataavailable = (e) => chunks.push(e.data);
    recorder.onstop = () => {
        let blob = new Blob(chunks, { type: "video/mp4" });
        chunks = [];
        saveMedia("video", blob);
    };
});

recordBtn.addEventListener("click", () => {
    if (!recorder) return;

    recording = !recording;
    if (recording) {
        recorder.start();
        recordBtn.classList.add("recording");
    } else {
        recorder.stop();
        recordBtn.classList.remove("recording");
    }
});

captureBtn.addEventListener("click", () => {
    let canvas = document.createElement("canvas");
    canvas.width = videoElem.videoWidth;
    canvas.height = videoElem.videoHeight;

    let context = canvas.getContext("2d");
    context.drawImage(videoElem, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => saveMedia("image", blob));
});

function openGallery() {
    location.assign("gallery.html");
}

function saveMedia(type, blobData) {
    if (!db) return;
    let id = `${type}-${Date.now()}`;
    let transaction = db.transaction(type, "readwrite");
    let store = transaction.objectStore(type);

    let mediaObj = { id, blobData };
    store.add(mediaObj);
}
