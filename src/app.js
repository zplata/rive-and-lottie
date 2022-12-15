// import { loadAnimation } from "./add-lottie";

// async function main() {
//   const x = await loadAnimation();
//   console.log(x);
// }
// main();

import { Rive } from "@rive-app/canvas";

/**
 * Credit: https://stackoverflow.com/questions/10420352/converting-file-size-in-bytes-to-human-readable-string
 * Format bytes as human-readable text.
 *
 * @param bytes Number of bytes.
 * @param si True to use metric (SI) units, aka powers of 1000. False to use
 *           binary (IEC), aka powers of 1024.
 * @param dp Number of decimal places to display.
 *
 * @return Formatted string.
 */
function humanFileSize(bytes, si = true, dp = 1) {
  const thresh = si ? 1000 : 1024;

  if (Math.abs(bytes) < thresh) {
    return bytes + " B";
  }

  const units = si
    ? ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
    : ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
  let u = -1;
  const r = 10 ** dp;

  do {
    bytes /= thresh;
    ++u;
  } while (
    Math.round(Math.abs(bytes) * r) / r >= thresh &&
    u < units.length - 1
  );

  return bytes.toFixed(dp) + " " + units[u];
}

async function main() {
  let currentRiveInstance;
  const riveCanvas = document.getElementById("rive-canvas");
  const player = document.querySelector("lottie-player");
  const dropContainer = document.querySelector(".drop-container");
  const fileSizeContainer = document.querySelector(".file-size");
  const helperTextNode = document.querySelector(".perf-helper-text");

  async function displayFileSizeStats(url) {
    const req = new Request(url);
    const res = await fetch(req);
    const buffer = await res.arrayBuffer();
    const fileSize = humanFileSize(new Blob([buffer]).size);
    const fileSizeText = document.createTextNode(`File Size: ${fileSize}`);
    helperTextNode.style.display = "block";
    fileSizeContainer.appendChild(fileSizeText);
  }

  if (riveCanvas) {
    const { width, height } = riveCanvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    riveCanvas.width = dpr * width;
    riveCanvas.height = dpr * height;

    const url =
      "https://public.rive.app/hosted/40846/11373/jb-r1m2WqEyusZFM4ClF_A.riv";
    currentRiveInstance = new rive.Rive({
      src: url, // host your Rive file and add the url to src
      canvas: document.getElementById("rive-canvas"),
      artboard: "Main",
      stateMachines: ["State Machine 1"],
      autoplay: true,
      layout: new rive.Layout({ fit: "cover", alignment: "center" }),
      onLoad: async () => {
        await displayFileSizeStats(url);
        currentRiveInstance.resizeDrawingSurfaceToCanvas();
      },
    });
  }

  if (player) {
    const url = "https://assets7.lottiefiles.com/packages/lf20_l3qxn9jy.json";
    await displayFileSizeStats(url);
  }

  dropContainer.addEventListener("dragover", function (ev) {
    ev.preventDefault();
  });
  dropContainer.addEventListener("drop", function (ev) {
    ev.preventDefault();

    if (ev.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)
      for (var i = 0; i < ev.dataTransfer.items.length; i++) {
        const droppedItem = ev.dataTransfer.items[i];
        // If dropped items aren't files, reject them
        if (droppedItem.kind === "file") {
          if (currentRiveInstance) {
            currentRiveInstance.cleanup();
            currentRiveInstance = null;
          }
          const droppedFile = droppedItem.getAsFile();
          const splitName = droppedFile.name.split(".");
          const extension = splitName[splitName.length - 1];
          if (extension === "riv" && riveCanvas) {
            loadRiveFile(droppedFile);
          } else if (extension === "json" && player) {
            loadLottieFile(droppedFile);
          }
          break;
        }
      }
    }
  });

  function loadLottieFile(droppedFile) {
    const reader = new FileReader();
    const blob = new Blob([droppedFile], { type: "application/json" });
    reader.onload = function (event) {
      player.load(reader.result);
      const fileSize = humanFileSize(blob.size);
      const fileSizeText = document.createTextNode(`File Size: ${fileSize}`);
      helperTextNode.style.display = "block";
      fileSizeContainer.replaceChildren(fileSizeText);
    };

    reader.readAsText(blob);
  }

  function loadRiveFile(droppedFile) {
    const reader = new FileReader();
    reader.onload = function (event) {
      currentRiveInstance = new Rive({
        buffer: event.target.result,
        canvas: riveCanvas,
        autoplay: false,
        onLoad: () => {
          // Play a state machine if it exists first, otherwise play the configured animation
          const stateMachines = currentRiveInstance.stateMachineNames;
          stateMachines.length
            ? currentRiveInstance.play(stateMachines[0])
            : r.play();
          // currentRiveInstance.enableFPSCounter();
          const fileSize = humanFileSize(new Blob([event.target.result]).size);
          const fileSizeText = document.createTextNode(
            `File Size: ${fileSize}`
          );
          helperTextNode.style.display = "block";
          fileSizeContainer.replaceChildren(fileSizeText);
        },
      });
    };

    reader.readAsArrayBuffer(droppedFile);
  }
}

main();
