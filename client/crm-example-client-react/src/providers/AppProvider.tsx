import React, { useState } from 'react'

export interface IAppProviderProps {
  children: React.ReactNode
}

/**
 * Context props
 * * Contains values that should be shared across the client app.
 */
export interface IAppContext {
  authenticated: boolean;
  setAuthenticated: (authenticated: boolean) => void;
  drawerOpen: boolean
  setDrawerOpen: (open: boolean) => void;
}

/**
 * Default AppContext
 * * Contains values that should be shared across the client app.
 */
export const AppContext = React.createContext<IAppContext>({
  // Defaults.
  authenticated: false,
  drawerOpen: false,
  setAuthenticated: () => {},
  setDrawerOpen: () => {},
})

export const AppProvider = (props: IAppProviderProps) => {
  const [authenticated, setAuthenticated] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <AppContext.Provider value={{
      authenticated, setAuthenticated,
      drawerOpen, setDrawerOpen,
    }}>
      {props.children}
    </AppContext.Provider>
  )
}