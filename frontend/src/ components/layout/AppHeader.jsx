import {Button, Layout, Select, Space, Modal, Drawer} from 'antd'
import {useCrypto} from '../../context/crypto-context'
import {useEffect, useState} from 'react'
import CoinInfoModal from '../CoinInfoModal.jsx'
import AddAssetForm from '../AddAssetForm.jsx'

const headerStyle = {
	width: '100%',
	textAlign: 'center',
	height: 60,
	padding: '1rem',
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
	background: 'white'
}

// eslint-disable-next-line no-unused-vars
const handleChange = (value) => {
	console.log(`selected ${value}`);
}

export default function AppHeader() {
	const [select, setSelect] = useState(false)
	const [coin, setCoin] = useState(null)
	const [drawer, setDrawer] = useState(false)
	const [modal, setModal] = useState(false)
	const {crypto} = useCrypto()

	useEffect(() => {
		const keypress = (event) => {
			if (event.key === '/') {
				setSelect((prev) => !prev)
			}
		}
		document.addEventListener('keypress', keypress)
		return () => document.removeEventListener('keypress', keypress)
	}, [])

	function handleSelect(value)
	{
		console.log(value)
		setCoin(crypto.find((c) => c.id === value))
		setModal(true)
	}

	return (
		<Layout.Header style={headerStyle}>
			<Select
				style={{width: 250}}
				value="press / to open"
				optionLabelProp="label"
				options={crypto.map(coin => ({
					label: coin.name,
					value: coin.id,
					icon: coin.icon
				}))}
				onSelect={handleSelect}
				onClick={() => setSelect((prev) => !prev)}
				open={select}
				optionRender={(option) => (
					<Space>
						<img
							style={{width: 20}}
							src={option.data.icon}
							alt={option.data.label}
						/>{' '}
						{option.data.label}
					</Space>
				)}
			/>

			<Button type="primary" onClick={() => setDrawer(true)}>
				Add Asset
			</Button>

			<Modal
				open={modal}
				onCancel={() => setModal(false)}
				footer={null}>
				<CoinInfoModal coin={coin}/>
			</Modal>

			<Drawer
				width={600}
				title="Add Asset"
				onClose={() => setDrawer(false)}
				open={drawer}
				destroyOnClose>
				<AddAssetForm onClose={() => setDrawer(false)}/>
			</Drawer>

		</Layout.Header>);
}
