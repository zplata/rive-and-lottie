# Rive Lottie Comparison

A small app (in the works) to showcase Rive performance alongside Lottie with respect to the web. Hoping to make this a lot prettier and more informative up front!

I'm using the `@rive-app/canvas` high-level JS runtime, as well as the `lottie-player` for comparison.

## How to measure performance?

If you go to http://imzachy.com/rive-and-lottie, you'll notice two links, "To Rive" and "To Lottie". Each renders the same animation. To measure performance against each tech stack, we can look to a sample of the following:

- File size
- GPU Memory usage
- JS Heap
- CPU usage

### File Size

If you clone this project down to your machine, you can take a look at the comparison of the files by looking in the `public/` folder and comparing for example `rocket.riv` against `lottie-rocket.json`.

### GPU Memory Usage

Resource: [Chrome Rendering Tab](https://developer.chrome.com/docs/devtools/rendering/performance/#frame-rendering-stats)

If you're using Google Chrome, the dev tools has a nifty tool in the `Rendering` tab where you can look at `Frame Rendering Stats` (via a clicked checkbox) and see statistics on the page of fps, as well as GPU memory usage

### JS Heap

Look to the `Memory` tab in the Chrome dev tools and check out the Total JS Heap Size at the bottom.

### CPU Usage

You can look to the `Task Manager` in Chrome to see the GPU Process task on your CPU, as well as a tool like the Activity Monitor (for MacOS devices) to measure % CPU taken up

