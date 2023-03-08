import { BrowserRouter, BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import { adminRoutes, agentRoutes, authProtectedRoutes, managerRoutes, publicRoutes } from './routes';
import Authmiddleware from './routes/route';
import NonAuthLayout from './components/Layout/NonAuthLayout';
import AuthLayout from './components/Layout/AuthLayout';

import "./assets/scss/theme.scss"
import 'react-toastify/dist/ReactToastify.css'
import { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getUserLogued } from './helpers/auth';
import { setUser } from './redux/userSlice';
import NotFoundPage from './pages/Utility/NotFoundPage';

function App() {
  const [authRoutes, setAuthRoutes] = useState(authProtectedRoutes)
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch();

  useMemo(() => {
    if(user.name){
      if(user.roles.includes('ROLE_ADMIN')){
        setAuthRoutes([...authProtectedRoutes, ...agentRoutes, ...managerRoutes, ...adminRoutes]);
      }else if(user.roles.includes('ROLE_ADMIN')){
        setAuthRoutes([...authProtectedRoutes, ...agentRoutes, ...managerRoutes]);
      }else{
        setAuthRoutes([...authProtectedRoutes, ...agentRoutes]);
      }
    }
  }, [user.name, user.roles])


  useEffect(() => {
    if(sessionStorage.getItem('sunsetadmiralauth')){
      async function  fetchUserInfoApi(){
        const response = await getUserLogued();
        if(response.data.length > 0){
          const user = {
              ...response.data[0],
              ...JSON.parse(sessionStorage.getItem("sunsetadmiralauth"))
          }
          dispatch(setUser(user)) 
        }
      }
      fetchUserInfoApi();
    }
  },[sessionStorage.getItem('sunsetadmiralauth')])

  return (
    <BrowserRouter>
        <Router>
        <Switch>
          {publicRoutes.map((route, idx) => (
            <Authmiddleware
              path={route.path}
              layout={NonAuthLayout}
              component={route.component}
              key={idx}
              isAuthProtected={false}
              exact
            />
          ))}

          {authRoutes.map((route, idx) => (
            <Authmiddleware
              path={route.path}
              layout={AuthLayout}
              component={route.component}
              key={idx}
              isAuthProtected={true}
              exact
            />
          ))}
          <Route 
            path={"*"}
            render={props => {
              if (!sessionStorage.getItem("sunsetadmiralauth")) {
                return (
                  <Redirect
                    to={{ pathname: "/login", state: { from: props.location } }}
                  />
                )
              }
        
              return <NotFoundPage />
            }}
          />
        </Switch>
      </Router>
    </BrowserRouter>
  )
}

export default App;
