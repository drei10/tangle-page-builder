export default (function showResults(values) {
  console.log('values', values);
  if (values.id) {
    request('PATCH', `/pages/${values.id}`, values).then(res => console.log('patch res', res))
  } else {
    request('POST', 'pages', values).then(res => console.log('post res', res))
  }
});

const request = (method, path, data) => {
  const host = 'http://localhost:8080'
  // Default options are marked with *
  return new Promise((resolve, reject) => {
    fetch(`${host}/${path}`, {
      body: JSON.stringify(data), // must match 'Content-Type' header
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      //credentials: 'same-origin', // include, same-origin, *omit
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: method, // *GET, POST, PUT, DELETE, etc.
      mode: 'no-cors', // no-cors, cors, *same-origin
      redirect: 'follow', // manual, *follow, error
      referrer: 'no-referrer', // *client, no-referrer
    })
    .then(res => {
      if (res.ok) {
        resolve(res)
      } else {
        reject(res)
      }
    })
  })
}
