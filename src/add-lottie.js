import { Animation as LottieAnimation } from "@lottiefiles/lottie-js";
import Wave from "./wave.json";

export async function loadAnimation() {
  console.log(Wave);
  // Create Lottie instance
  // (you can also use Animation.fromJSON method if you already have the Lottie JSON loaded)
  const anim = await LottieAnimation.fromJSON(Wave);

  // Print some data of the animation
  console.log("Frame Rate", anim.frameRate);
  console.log("Number of Layers", anim.layers.length);
  console.log(anim.getColors());

  // Manipulate animation
  anim.name = "Woohoo";
  anim.width = 512;
  anim.height = 512;

  // Get the new JSON
  const woohooLottie = JSON.stringify(anim);
  console.log(woohooLottie);
}
