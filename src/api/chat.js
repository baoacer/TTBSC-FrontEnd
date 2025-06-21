import axios from './axios'

export const getChatHistory = (userID) => {
  return axios.get('/chat', {
    headers: {
      'user-id': userID
    }
  })
}

export const ask = (userID, message) => {
  return axios.post('/chat', 
    { message }, 
    {
      headers: {
        'user-id': userID
      }
    }
  )
}


