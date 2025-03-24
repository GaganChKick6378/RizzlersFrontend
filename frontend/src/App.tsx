import { Provider } from "react-redux";
import { store } from "./redux/store";
import { AppContent } from "./AppContent";
import "./App.css";

const App = () => {
  return (
    <div className="site-container">
      <Provider store={store}>
        
          <AppContent />
       
      </Provider>
    </div>
  );
};

export default App;
