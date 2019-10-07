import rcsolver from "./rcsolver";

let key = process.argv[2];
if (!key) {
    throw new Error("No key");
}

rcsolver(key).then(result => console.log(result));
