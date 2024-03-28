import {CryptoContextProvider} from './context/crypto-context.jsx'
import AppLayout from "./ components/layout/AppLayout.jsx";

function App()
{
	return (
		<CryptoContextProvider>
			<AppLayout />
		</CryptoContextProvider>
	)
}

export default App
