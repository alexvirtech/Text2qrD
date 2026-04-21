import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Text2QR from './pages/Text2QR'
import QR2Text from './pages/QR2Text'
import EncText from './pages/EncText'
import DecText from './pages/DecText'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/text2qr" element={<Text2QR />} />
        <Route path="/qr2text" element={<QR2Text />} />
        <Route path="/enctext" element={<EncText />} />
        <Route path="/dectext" element={<DecText />} />
      </Routes>
    </Layout>
  )
}
