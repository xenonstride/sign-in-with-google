const client = google.accounts.oauth2.initCodeClient({
  client_id:
    "350261747582-qg3vsk4r3d1h58014ioeuik0abcds34s.apps.googleusercontent.com",
  scope:
    "https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.readonly",
  ux_mode: "redirect",
  redirect_uri: "http://localhost:4000/gapi-save-rtoken",
  // callback: useToken,
  state: "myState",
});

document.querySelector("#get-files").addEventListener("click", async () => {
  const res = await axios.get("http://localhost:4000/gapi-auth?getToken=no");
  console.log(res.data);
  if (res.data.refreshTokenPresent) {
    // use access token
    window.location.href = "http://localhost:4000/my-files";
  } else {
    //get user consent and send auth code to the backend
    client.requestCode();
  }
});

document.querySelector("#signout").addEventListener("click", async () => {
  await axios.post("http://localhost:4000/signout");
  window.location.href = "http://localhost:4000/";
});

// const useToken = async (response) => {
//   // send auth token to server
//   if (response.prompt === "consent") {
//     console.log(response);
//     const res = await axios.post(
//       "http://localhost:4000/gapi-save-rtoken",
//       {
//         ...response,
//       },
//       {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     );
//     console.log(res.data);
//     window.location.href = "http://localhost:4000/my-files";
//   }
// };
