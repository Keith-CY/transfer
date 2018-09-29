const fs = require('fs')
const FormData = require('form-data')
const axios = require('axios')
const logger = require('log4js').getLogger()

logger.level = 'debug'

// test('upload a new file', async () => {
//   const formData = new FormData()
//   const text = `testKey-${Date.now()}`

//   formData.append('key', text)
//   formData.append('content', text)

//   const sendResponse = await axios
//     .post('http://localhost:3000/files/create', formData, {
//       headers: formData.getHeaders(),
//     })
//     .then(res => res.data)
//     .catch(err => err)

//   logger.info(sendResponse)

//   expect(sendResponse.data).toBeTruthy()
// })

const host = 'http://localhost:3000/files/'
test('get local file', async () => {
  const key = 'local'
  const result = await axios
    .get(`${host}show/${key}`)
    .then(res => res.data)
    .catch(err => err)
  expect(key).toBe('file to ipfs\nHello World ')
})
