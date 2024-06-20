import React, { useState, useEffect } from "react";

// The getState function defines the initial state and actions
const getState = ({ getStore, getActions, setStore }) => {
  return {
    store: {
      // Your initial store state goes here
      token: null,
      user: null,
      invoices: [],
    },
    actions: {
      // Here you can define your actions
      syncSessionTokenFromStore: () => {
        const token = localStorage.getItem("token");
        if (token) {
          setStore({ token });
        }
      },
      login: (email, password) => {
        // Fetch login data from an API and update the store
        fetch("/api/login", {
          method: "POST",
          body: JSON.stringify({ email, password }),
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => response.json())
          .then((data) => {
            setStore({ token: data.token, user: data.user });
            localStorage.setItem("token", data.token);
          })
          .catch((error) => console.error("Error logging in:", error));
      },
      logout: () => {
        setStore({ token: null, user: null });
        localStorage.removeItem("token");
      },
      getInvoices: () => {
        // Fetch invoices from an API and update the store
        fetch("/api/invoices", {
          headers: {
            Authorization: `Bearer ${getStore().token}`,
          },
        })
          .then((response) => response.json())
          .then((data) => setStore({ invoices: data }))
          .catch((error) => console.error("Error fetching invoices:", error));
      },
    },
  };
};

// The Context and injectContext functions
export const Context = React.createContext(null);

const injectContext = (PassedComponent) => {
  const StoreWrapper = (props) => {
    const [state, setState] = useState(
      getState({
        getStore: () => state.store,
        getActions: () => state.actions,
        setStore: (updatedStore) =>
          setState({
            store: Object.assign(state.store, updatedStore),
            actions: { ...state.actions },
          }),
      })
    );

    useEffect(() => {
      state.actions.syncSessionTokenFromStore();
    }, []);

    return (
      <Context.Provider value={state}>
        <PassedComponent {...props} />
      </Context.Provider>
    );
  };
  return StoreWrapper;
};

export default injectContext;
