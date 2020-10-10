const { parentPort } = require("worker_threads");
const axios = require("axios");

const KEY = "dc6zaTOxFJmzC";



parentPort.once("message", async (message) => {
  setInterval(async function () {
    const output = await axios
      .get(
      `http://api.giphy.com/v1/gifs/search?q=${message.name}&api_key=${KEY}`
      )
      .then((res) => res.data.data)
      .catch((error) => {
        console.log(error);
      });
      let index = Math.floor(Math.random() * output.length);
      let image = output[index];
      let result = JSON.stringify({image: image.images.original.url, id: message.id})
      parentPort.postMessage(result);
  }, message.seconds);

});
