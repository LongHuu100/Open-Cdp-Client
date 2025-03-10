import FuseUtils, { InAppEvent } from './FuseUtils';
import axios from 'axios';
import { CHANGE_STORE, ACTIONS } from "configs";
import RequestUtils from './RequestUtils';

class jwtService extends FuseUtils.EventEmitter {

    init() {
        this.handleAuthentication();
    }

    handleAuthentication = () => {
        let access_token = this.getAccessToken();
        if (!access_token) {
            this.emit('onNoAccessToken');
            return;
        }

        if (this.isAuthTokenValid(access_token)) {
            this.emit('onAutoLogin', true);
        } else {
            this.setSession(null);
            this.emit('onAutoLogout', 'access_token expired');
        }
    };

    signInWithToken = async() => {
        try {
            const { data, success } = await RequestUtils.Post('/auth/sign-with-token', { 
                token: this.getAccessToken()
            });
            this.setSession(success ? data : null);
        } catch(e) {
            this.emit('onAutoLogout', 'sign-in-with-token ' + e.message);
        }
        return "done";
    };

    setSession = (data) => {
        if (data) {
            const { jwtToken: token, user } = data;
            localStorage.setItem('jwt_access_token', token);
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
            InAppEvent.emit(CHANGE_STORE, { type: ACTIONS.ADD_USER, data: user });
        } else {
            localStorage.removeItem('jwt_access_token');
            delete axios.defaults.headers.common['Authorization'];
        }
    };

    logout = () => {
        this.setSession(null);
    };

    isAuthTokenValid = access_token => {
        return (access_token || '') !== '';
    };

    getAccessToken = () => {
        return window.localStorage.getItem('jwt_access_token');
    };
}

const instance = new jwtService();
export default instance;
