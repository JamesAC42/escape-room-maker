// Helper function to make GET requests to the API server.
// Takes in a URL and returns a promise that will resolve
// the data that the server gave
export const getData = (url) => {
  return new Promise((resolve, reject) => {
    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        withCredentials: "true",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        console.error("Error: " + error);
      });
  });
};
