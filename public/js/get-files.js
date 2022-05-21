// get access token

const getFiles = async () => {
  const res = await axios.get("http://localhost:4000/gapi-auth?getToken=yes");
  const accessToken = res.data.accessToken;
  console.log(accessToken);

  const data = await axios.get(
    "https://www.googleapis.com/drive/v3/files?pageSize=50",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  const apiRes = data.data.files;
  const filesDiv = document.querySelector(".files");

  for (let f of apiRes) {
    let fileDiv = document.createElement("div");
    fileDiv.classList.add("file");

    fileDiv.innerHTML = `<a href="https://drive.google.com/uc?export=download&id=${f.id}">${f.name} .............................................. ${f.id}</a>`;
    filesDiv.appendChild(fileDiv);
  }

  // console.log(apiRes);
  // const photos = [];
  // let i = 0;
  // for (let f of apiRes) {
  //   if (f.mimeType === "image/jpeg") {
  //     if (i < 5) {
  //       const t = new Date(photo.mediaMetadata.creationTime);
  //       const p = document.createElement("div");
  //       p.classList.add("photo");
  //       p.innerHTML = `<h2>Taken on ${photo.mediaMetadata.photo.cameraMake} ${
  //         photo.mediaMetadata.photo.cameraModel
  //       } on ${t.getDate()}-${t.getMonth()}-${t.getFullYear()}</h2>
  //       <img
  //         src="${photo.baseUrl}"
  //         alt=""
  //       />`;
  //       photosDiv.appendChild(p);
  //       i++;
  //     } else break;
  //   }
  // }
};

getFiles();
