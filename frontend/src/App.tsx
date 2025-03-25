import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./redux/store";
import { AppContent } from "./AppContent";
import "./App.css";

const App = () => {
  return (
    <div className="site-container">
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <AppContent />
        </PersistGate>
      </Provider>
    </div>
  );
};

export default App;
