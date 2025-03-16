import { Provider } from "react-redux";
import { store } from "./redux/store";
import { AppContent } from "./AppContent";

const App = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Provider store={store}>
        <AppContent />
      </Provider>
    </div>
  );
};

export default App;
