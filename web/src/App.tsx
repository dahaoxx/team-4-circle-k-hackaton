import { Route, Routes } from 'react-router-dom'
import { PhoneFrame } from './components/PhoneFrame'
import { KvilProvider } from './lib/state'
import { RouteScreen } from './screens/RouteScreen'
import { PlugInScreen } from './screens/PlugInScreen'
import { SnoggScreen } from './screens/SnoggScreen'
import { StayScreen } from './screens/StayScreen'
import { PlaceScreen } from './screens/PlaceScreen'
import { KvilpassetScreen } from './screens/KvilpassetScreen'
import { DataPanelScreen } from './screens/DataPanelScreen'
import { HostScreen } from './screens/HostScreen'
import { OpsScreen } from './screens/OpsScreen'

function App() {
  return (
    <KvilProvider>
      <PhoneFrame>
        <Routes>
          <Route path="/" element={<RouteScreen />} />
          <Route path="/plug-in" element={<PlugInScreen />} />
          <Route path="/snogg" element={<SnoggScreen />} />
          <Route path="/stay" element={<StayScreen />} />
          <Route path="/place/:placeId" element={<PlaceScreen />} />
          <Route path="/kvilpasset" element={<KvilpassetScreen />} />
          <Route path="/data" element={<DataPanelScreen />} />
          <Route path="/host" element={<HostScreen />} />
          <Route path="/ops" element={<OpsScreen />} />
        </Routes>
      </PhoneFrame>
    </KvilProvider>
  )
}

export default App
