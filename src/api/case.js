import axios from './http'

const cases = {

  getCaseList(params){
    // return axios.get('/testCase/list', {params})
    return axios({
      url: '/testCase/list',
      method: 'GET',
      params: params
    })
  },

  createCaseByText(params){
    // return axios
    return axios.post('/testCase/text', params)
  },
  createCaseByFile(params){
    // return axios
    return axios.post('/testCase/file', params)
  },
  // createCaseByFile(params){
  //   return axios('/testCase/file', {
  //     method: 'post',
  //     data: params,
  //     headers: {'Content-type':'multipart/form-data'}
  //   })
  // },
  deleteCaseById(params){
    return axios.delete('/testCase/'+params.caseId,params)
  },

  editCase(params){
    return axios.put('/testCase/', params)
  },

  addTask(params){
    return axios.post('/task',params)
  }
}

export default cases