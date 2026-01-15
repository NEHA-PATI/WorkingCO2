import { Routes, Route, Link } from 'react-router-dom';
import OrgDashboard from './pages/OrgDashboard';
import AddAsset from './components/AddAsset';
import FleetManagement from './components/FleetManagement';

function App() {
  return (
    <Routes>
      <Route path="/" element={<OrgDashboard />} />
      <Route path="/add-asset" element={<AddAsset />} />
      <Route path="/view-fleet" element={<FleetManagement />} />
    </Routes>
  );
}
export default App;