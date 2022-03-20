import React from "react";
import {
  BrowserRouter as Router,
} from "react-router-dom";
import {Provider as MobxStoreProvider} from 'mobx-react';
import mobxStoresToInject from './mobx'
import Root from './Root'


const mobxStores = {
  ...mobxStoresToInject
}

function App() {
  return (
    <MobxStoreProvider {...mobxStores}>
      <Router>
        <Root />
      </Router>
    </MobxStoreProvider>
  );
}


export default App
