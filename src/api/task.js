import axios from './http'

const task = {

  getTaskList(params){
    return axios({
      url: '/task/list',
      method: 'GET',
      params: params
    })
  },
}

export default task