const axios = require('axios')
const FormData = require('form-data')
const logger = require('log4js').getLogger()

logger.level = 'debug'

const key = `test-${Date.now()}`
const content = `${key}-content`
const host = 'http://localhost:3000/files/'

/**
 * @function sendFormData
 * @description send form-data to server with key and content
 * @param {string} _key - unique index
 * @param {string} _content - content
 */
const sendFormData = (_key, _content, _forceFlag = '0') => {
  const formData = new FormData()
  formData.append('key', _key)
  formData.append('content', _content)
  formData.append('forceFlag', _forceFlag)
  return axios.post(`${host}create`, formData, {
    headers: formData.getHeaders(),
  })
}

/**
 * @function uploadFile
 * @description upload test key and test content
 * @param {string} _key - unique index
 * @param {string} _content - contnet to upload
 */
const uploadFile = (_key, _content, _force = '0') =>
  sendFormData(_key, _content, _force)
  .then(res => {
    logger.info('expect to upload file success')
    logger.info(res.data)
  })
  .catch(err => {
    logger.error(err)
  })

/**
 * @function getFile
 * @description query file from server and verify the content
 * @param {string} _key - unique index
 * @param {string} _content - content to verify
 */
const getFile = (_key, _content) =>
  axios
  .get(`${host}show/${_key}`)
  .then(res => {
    logger.info(`expect to receive ${_content}`)
    logger.info(res.data)
  })
  .catch(err => loggger.warn(err))

/**
 * @function sendExistFile
 * @param {string} _key - unique index
 * @param {string} _content - content to upload
 */
const sendExistFile = (_key, _content) =>
  sendFormData(_key, _content)
  .then(res => {
    logger.info('if with forceFlag 0, expect to upload file failed, with forceFlag 1, expect to update file success')
    logger.info(res.data)
  })
  .catch(err => {
    logger.error(err)
  })

/**
 * @function getFileNotExist
 * @param {string} _key - unique index
 */
const getFileNotExist = _key =>
  axios
  .get(`${host}show/${_key}`)
  .then(res => {
    logger.info('expect file not found')
    logger.info(res.data)
  })
  .catch(err => logger.error(err))

const debugWithFlag = async (flag) => {
  await uploadFile(key, content, flag)
  await getFile(key, content)
  await sendExistFile(key, content)
  await getFileNotExist('notExist')
}

debugWithFlag(0)
