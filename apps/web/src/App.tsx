import { Alerts } from "@/features/alert/components/Alerts";
import { Drawer } from "@/features/drawer/components/Drawer";
import { Map } from "@/features/map/components/Map";
import { Modal } from "@/features/modal/components/Modal";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <Drawer />

        <Alerts />

        <Modal />

        <Map />
      </div>
    </QueryClientProvider>
  );
}

export default App;
