import { Route, Routes } from 'react-router-dom'
import { PhoneFrame } from './components/PhoneFrame'
import { RouteScreen } from './screens/RouteScreen'
import { PlugInScreen } from './screens/PlugInScreen'
import { SnoggScreen } from './screens/SnoggScreen'
import { PlaceScreen } from './screens/PlaceScreen'
import { KvilpassetScreen } from './screens/KvilpassetScreen'
import { DataPanelScreen } from './screens/DataPanelScreen'

function App() {
  return (
    <PhoneFrame>
      <Routes>
        <Route path="/" element={<RouteScreen />} />
        <Route path="/plug-in" element={<PlugInScreen />} />
        <Route path="/snogg" element={<SnoggScreen />} />
        <Route path="/place/:placeId" element={<PlaceScreen />} />
        <Route path="/kvilpasset" element={<KvilpassetScreen />} />
        <Route path="/data" element={<DataPanelScreen />} />
      </Routes>
    </PhoneFrame>
  )
}

export default App
