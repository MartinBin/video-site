import {defineStore} from "pinia";
import axios from "axios";

export const useUserStore = defineStore('user',{
  state:()=> ({
      userName: '',
      userId: '',
  }),
  actions:{
    async setUserInfo(){
      try{
        const token = localStorage.getItem("access_token");
        if(token) {
          const response = await axios.get('/users', {
            headers: {Authorization: `Bearer ${token}`},
          });
          this.userId = response.data._id;
          this.userName = response.data.username;
        }
      }catch (e){
        console.error(e);
      }
    },
    logout(){
      this.userId = '';
      this.userName = '';
    }
  },
})
