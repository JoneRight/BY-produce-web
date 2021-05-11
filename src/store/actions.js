export default {
    checkLogin({ commit }, next) {
        axios('get', '/check-auth')
          .then(res => {
            if (res.status == 200) {
              commit('user', res.data.data);
              next();
            }
          })
          .catch(err => {
            commit('user', null);
            next('/login');
          })
      }
};