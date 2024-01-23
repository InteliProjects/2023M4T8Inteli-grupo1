import "./App.css";

import { BrowserRouter as Router, Route, Routes, BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from 'react-query'
import RoutesComponent from "./routes/RoutesComponent";


function App() {

  const queryClient = new QueryClient()

  return (
    <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <RoutesComponent />
        </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
