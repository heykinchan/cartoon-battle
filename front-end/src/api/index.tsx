import axios, {  AxiosRequestConfig } from 'axios'
import { Modal } from 'antd'

const API_DOMAIN = 'http://web.capstone.egoist.host/api/'


interface ApiConfig {
    method: 'get' | 'post' | 'put' | 'delete';
    url?: string;
    data?: object;
    params?: URLSearchParams;
    header?: Record<string, string>;
    formData?: boolean;
    success?: (res: any) => void;
    fail?: (err?: any) => void;
    done?: () => void;
}
interface ErrorResponse {
    data: {
      error: string;
    };

  }
  
  interface Error {
    response: ErrorResponse;
    
  }



export const apiReqs = {
    
    signUp: (config: ApiConfig) => {
        axios
        .post(API_DOMAIN + 'users/registerUser', config.data)
        .then((res) => {
            const result = res.data;
            if (result.token) {
                config.success?.(result);
            } else {
                config.fail?.({
                    message: result.message 
                });
            }
        })
        .catch((error: Error) => {
            console.log('error', error);
            config.fail?.({
               
            });
            Modal.error({
                title: 'Sign Up Failed',
                content: error.response.data.error,
            });
        })
        .finally(() => {
            config.done?.();
        });
    },
    signIn: (config: ApiConfig) => {
        axios
        .post(API_DOMAIN + 'users/loginUser',config.data)
        .then((res) => {
            const result = res.data
            console.log(result)
            if (result.token) {
                window.localStorage.setItem('authToken', result.token)
                window.localStorage.setItem('name', result.user.firstname)
                window.localStorage.setItem('id', result.user.id)
                config.success?.(result)
            }

        })
        .catch((error:Error) => {
            console.log(error)
            config.fail?.({
                message: error.response.data.error,
            })
            Modal.error({
                title: "Sign In Fail",
                content: error.response.data.error
            })
        })
    },
    getCharacters: (config : ApiConfig) => {
        const token = window.localStorage.getItem('authToken');
        if (!token) {
            console.log("No token found");
            config.fail?.({
                message: "No authentication token found",
            });
            return;
        }
        config.url = API_DOMAIN + 'characters/ruledCharacters'
        config.header =   {'Authorization': `Bearer ${token}`}
        apiRequest(config)
    },
    Character: (config : ApiConfig) => {
        const token = window.localStorage.getItem('authToken');
        if (!token) {
            console.log("No token found");
            config.fail?.({
                message: "No authentication token found",
            });
            return;
        }
        config.url = API_DOMAIN + 'contributions/contribution'
        config.header = {'Authorization': `Bearer ${token}`}
        apiRequest(config)
    },
    addFavourite: (config : ApiConfig) => {
        const token = window.localStorage.getItem('authToken');
        if (!token) {
            console.log("No token found");
            config.fail?.({
                message: "No authentication token found",
            });
            return;
        }
        config.url = API_DOMAIN + 'favourites'
        config.header = {'Authorization': `Bearer ${token}`}
        apiRequest(config)
    },
    removeFavourite: (config : ApiConfig) => {
        const token = window.localStorage.getItem('authToken');
        if (!token) {
            console.log("No token found");
            config.fail?.({
                message: "No authentication token found",
            });
            return;
        }
        config.url = API_DOMAIN + 'favourites'
        config.header = {'Authorization': `Bearer ${token}`}
        apiRequest(config)
    },
    checkFavourite: (config : ApiConfig) => {
        const token = window.localStorage.getItem('authToken');
        if (!token) {
            console.log("No token found");
            config.fail?.({
                message: "No authentication token found",
            });
            return;
        }
        config.url = API_DOMAIN + `favourites/isFavourite?characterId=${(config.data as { id: string }).id}`
        
        config.header = {'Authorization': `Bearer ${token}`}
        apiRequest(config)
    },
    
    
    getFavouriteCharacters: (config: ApiConfig) => {
        const token = window.localStorage.getItem('authToken');
        if (!token) {
            console.log("No token found");
            config.fail?.({ message: "No authentication token found" });
            return;
        }
        config.url = API_DOMAIN + 'favourites';
        config.header = {'Authorization': `Bearer ${token}`};
        apiRequest(config);
    },
    getContributions: (config: ApiConfig) => {
        const token = window.localStorage.getItem('authToken');
        if (!token) {
            console.log("No token found");
            config.fail?.({ message: "No authentication token found" });
            return;
        }
        config.url = API_DOMAIN + 'contributions/getSelfContribution';
        config.header = {'Authorization': `Bearer ${token}`};
        apiRequest(config);
    },

    revokeContribution: (config: ApiConfig) => {
        const token = window.localStorage.getItem('authToken');
        if (!token) {
            console.log("No token found");
            config.fail?.({ message: "No authentication token found" });
            return;
        }
        config.url = API_DOMAIN + 'contributions/resolveContribution';
        config.header = {'Authorization': `Bearer ${token}`};
        apiRequest(config);
    }
    ,
    isAdmin: (config : ApiConfig) => {
        const token = window.localStorage.getItem('authToken');
        if (!token) {
            console.log("No token found");
            config.fail?.({
                message: "No authentication token found",
            });
            return;
        }
        config.url = API_DOMAIN + `admin/isAdmin?userId=${(config.data as { id: string }).id}`
        
        config.header = {'Authorization': `Bearer ${token}`}
        apiRequest(config)
    },
    getContrubutions: (config : ApiConfig) => {
        const token = window.localStorage.getItem('authToken');
        if (!token) {
            console.log("No token found");
            config.fail?.({
                message: "No authentication token found",
            });
            return;
        }
        config.url = API_DOMAIN + `contributions/pending`
        
        config.header = {'Authorization': `Bearer ${token}`}
        apiRequest(config)
    },
    resolveContribution: (config : ApiConfig) => {
        const token = window.localStorage.getItem('authToken');
        if (!token) {
            console.log("No token found");
            config.fail?.({
                message: "No authentication token found",
            });
            return;
        }
        config.url = API_DOMAIN + `contributions/resolve`
        
        config.header = {'Authorization': `Bearer ${token}`}
        apiRequest(config)
    },
    getAllAdmins: (config : ApiConfig) => {
        const token = window.localStorage.getItem('authToken');
        if (!token) {
            console.log("No token found");
            config.fail?.({
                message: "No authentication token found",
            });
            return;
        }
        config.url = API_DOMAIN + `admin/admins`
        
        config.header = {'Authorization': `Bearer ${token}`}
        apiRequest(config)
    },
    admin: (config : ApiConfig) => {
        const token = window.localStorage.getItem('authToken');
        if (!token) {
            console.log("No token found");
            config.fail?.({
                message: "No authentication token found",
            });
            return;
        }
        config.url = API_DOMAIN + `admin/admin`
        
        config.header = {'Authorization': `Bearer ${token}`}
        apiRequest(config)
    },
    removeCharacter: (config : ApiConfig) => {
        const token = window.localStorage.getItem('authToken');
        if (!token) {
            console.log("No token found");
            config.fail?.({
                message: "No authentication token found",
            });
            return;
        }
        config.url = API_DOMAIN + `characters/character`
        
        config.header = {'Authorization': `Bearer ${token}`}
        apiRequest(config)
    },
    getContribution: (config : ApiConfig) => {
        const token = window.localStorage.getItem('authToken');
        if (!token) {
            console.log("No token found");
            config.fail?.({
                message: "No authentication token found",
            });
            return;
        }
        const userId = (typeof config.data === 'object' && config.data !== null) ? config.data.id : window.localStorage.getItem('id');

        config.url = API_DOMAIN + `contributions/userId?userId=${userId}`;
  

        config.header = {'Authorization': `Bearer ${token}`}
        apiRequest(config)
    },
    resolveSelfContribution: (config : ApiConfig) => {
        const token = window.localStorage.getItem('authToken');
        if (!token) {
            console.log("No token found");
            config.fail?.({
                message: "No authentication token found",
            });
            return;
        }
        config.url = API_DOMAIN + `contributions/resolve`
        
        config.header = {'Authorization': `Bearer ${token}`}
        apiRequest(config)
    },
    getContributor: (config : ApiConfig) => {
        const token = window.localStorage.getItem('authToken');
        if (!token) {
            console.log("No token found");
            config.fail?.({
                message: "No authentication token found",
            });
            return;
        }
        config.url = API_DOMAIN + `contributions/characterIdName?characterName=${config.data?.id}`
        
        config.header = {'Authorization': `Bearer ${token}`}
        apiRequest(config)
    },
    getAllContribution: (config : ApiConfig) => {
        const token = window.localStorage.getItem('authToken');
        if (!token) {
            console.log("No token found");
            config.fail?.({
                message: "No authentication token found",
            });
            return;
        } 

        config.url = API_DOMAIN + `contributions/contributions`;
  

        config.header = {'Authorization': `Bearer ${token}`}
        apiRequest(config)
    },
    

    getOtherFavouriteCharacters: (config: ApiConfig) => {
        const token = window.localStorage.getItem('authToken');
        if (!token) {
            console.log("No token found");
            config.fail?.({ message: "No authentication token found" });
            return;
        }
        config.url = API_DOMAIN + `favourites/as?id=${config.data?.id}`;
        config.header = {'Authorization': `Bearer ${token}`};
        apiRequest(config);
    },
   

}

export function apiRequest(config : ApiConfig):void {
    const axiosConfig : AxiosRequestConfig = {
        method: config.method,
        url: config.url!,
        headers: config.header,
        params: config.params ? Object.fromEntries(config.params) : undefined
    }
    if (config.data) {
        axiosConfig.data = config.data;
      }
    axios(axiosConfig)
    .then((res) => {
        config.success?.(res.data);
    })
    .catch((error) => {
        console.log(error)
        config.fail?.({
            message: error,
        });
    })

}