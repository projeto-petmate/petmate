import { createRoot } from 'react-dom/client';
import './index.css';

import { RouterProvider } from 'react-router-dom';
import router from './router/routes.jsx';
import { GlobalContextProvider } from './contexts/GlobalContext.jsx';
import { PetContextProvider } from './contexts/PetContext';
import { UserContextProvider } from './contexts/UserContext';
import { OngContextProvider } from './contexts/OngContext.jsx';

createRoot(document.getElementById('root')).render(
  <GlobalContextProvider>
    <UserContextProvider>
      <OngContextProvider>
      <PetContextProvider>
        <RouterProvider router={router} />
      </PetContextProvider>
      </OngContextProvider>
    </UserContextProvider>
  </GlobalContextProvider>
);