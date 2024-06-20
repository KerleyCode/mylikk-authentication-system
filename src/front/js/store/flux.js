const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            token: null,
            signupMessage: null,
            isSignUpSuccessful: false,
            loginMessage: null,
            isLoginSuccessful: false,
            invoiceMessage: null,
            message: null,
            invoices: []
        },
        actions: {
            getMessage: async () => {
                try {
                    const resp = await fetch(process.env.BACKEND_URL + "/api/hello")
                    const data = await resp.json();
                    setStore({ message: data.message });
                    return data;
                } catch (error) {
                    console.log("Error loading message from backend", error)
                }
            },
            signUp: async (userEmail, userPassword) => {
                const options = {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: userEmail,
                        password: userPassword
                    })
                };
                const response = await fetch(`${process.env.BACKEND_URL}api/signup`, options)
                if (!response.ok) {
                    const data = await response.json();
                    setStore({ signupMessage: data.msg });
                    return {
                        error: {
                            status: response.status,
                            statusText: response.statusText
                        }
                    };
                }
                const data = await response.json();
                setStore({ signupMessage: data.msg });
                return data;
            },
            login: async (userEmail, userPassword) => {
                const options = {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: userEmail,
                        password: userPassword
                    })
                };
                const response = await fetch(`${process.env.BACKEND_URL}api/token`, options)
                if (!response.ok) {
                    const data = await response.json();
                    setStore({ loginMessage: data.msg });
                    return {
                        error: {
                            status: response.status,
                            statusText: response.statusText
                        }
                    };
                }
                const data = await response.json();
                setStore({
                    loginMessage: data.msg,
                    token: data.access_token,
                    isLoginSuccessful: true
                })
                localStorage.setItem('token', data.access_token);
                return data;
            },
            syncSessionTokenFromStore: () => {
                const sessionToken = localStorage.getItem('token');
                if (sessionToken && sessionToken !== "" && sessionToken !== undefined) {
                    setStore({ token: sessionToken })
                }
            },
            logout: () => {
                localStorage.removeItem('token');
                setStore({
                    token: null,
                    signupMessage: null,
                    isSignUpSuccessful: false,
                    loginMessage: null,
                    isLoginSuccessful: false,
                    invoiceMessage: null,
                    message: null,
                    invoices: []
                })
            },
            getInvoices: async () => {
                const store = getStore()
                const options = {
                    method: 'GET',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${store.token}`
                    }
                }
                const response = await fetch(`${process.env.BACKEND_URL}api/invoices`, options)
                if (!response.ok) {
                    return {
                        error: {
                            status: response.status,
                            statusText: response.statusText
                        }
                    };
                }
                const data = await response.json();
                setStore({
                    invoices: data.invoices,
                    invoiceMessage: data.msg
                });
                return data;
            }
        }
    };
};

export default getState;

