let db;
let openRequest = indexedDB.open("myDatabase", 1);

openRequest.onsuccess = function (e) {
    console.log("Database connection successful");
    db = openRequest.result;
};

openRequest.onerror = function (e) {
    console.log("Database connection error", e);
};

openRequest.onupgradeneeded = function (e) {
    console.log("Database upgraded or initial creation");
    db = openRequest.result;

    if (!db.objectStoreNames.contains("video")) {
        db.createObjectStore("video", { keyPath: "id" });
    }
    if (!db.objectStoreNames.contains("image")) {
        db.createObjectStore("image", { keyPath: "id" });
    }
};
