import {useRef, useState} from 'react'
import {useCrypto} from "../context/crypto-context.jsx";
import {Divider, Select, Space, Form, Button, InputNumber, DatePicker, Result} from "antd";
import CoinInfo from "./CoinInfo.jsx";

export default function AddAssetForm({onClose}) {
	const [form] = Form.useForm()
	const [coin, setCoin] = useState(null)
	const [submitted, setSubmitted] = useState(false)
	const assetRef = useRef()
	const {crypto, addAsset} = useCrypto()

	if (submitted) {
		return (
			<Result
				status="success"
				title="New Asset has been added!"
				subTitle={`Added ${assetRef.current.amount} of ${coin.name} by the price of ${assetRef.current.price}$`}
				extra={[
					<Button type="primary" key="console" onClick={onClose}>
						Close
					</Button>,
				]}
			/>
		)
	}

	const validateMessages = {
		required: '$(label) is required!',
		types: {
			number: '${label} is not valid number!'
		},
		number: {
			range: '${label} must be in range of ${min} and ${max}'
		}
	}

	if (!coin) {
		return (
			<Select
				style={{
					width: '100%'
				}}
				optionLabelProp="label"
				options={crypto.map(coin => ({
					label: coin.name,
					value: coin.id,
					icon: coin.icon
				}))}
				onSelect={(v) => setCoin(crypto.find((c) => c.id === v))}
				placeholder="Select coin"
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
		)
	}

	function onFinish(values)
	{
		const newAsset = {
			id: coin.id,
			amount: values.amount,
			price: values.price,
			date: values.date ?. $d ?? new Date()
		}
		assetRef.current = newAsset
		setSubmitted(true)
		addAsset(newAsset)
	}

	function handleAmountChange (value) {
		const price = form.getFieldValue('price')
		form.setFieldsValue({
			total: +(price * value).toFixed(2)
		})
	}

	function handlePriceChange (value) {
		const amount = form.getFieldValue('amount')
		form.setFieldsValue({
			total: +(amount * value).toFixed(2)
		})
	}

	return (
		<Form
			form={form}
			name="basic"
			labelCol={{
				span: 4,
			}}
			wrapperCol={{
				span: 10,
			}}
			style={{
				maxWidth: 600,
			}}
			initialValues={{
				price: +coin.price.toFixed(2)
			}}
			onFinish={onFinish}
			validateMessages={validateMessages}
		>
			<CoinInfo coin={coin}/>
			<Divider/>
			<Form.Item
				label="Amount"
				name="amount"
				rules={[
					{
						required: true,
						type: 'number',
						min: 0,
					},
				]}
			>
				<InputNumber placeholder="Enter coin amount" onChange={handleAmountChange} style={{width: '100%'}}/>
			</Form.Item>

			<Form.Item label="Price" name="price">
				<InputNumber onChange={handlePriceChange} style={{width: '100%'}}/>
			</Form.Item>

			<Form.Item label="Date & Time" name="date">
				<DatePicker showTime/>
			</Form.Item>

			<Form.Item label="Total" name="total">
				<InputNumber disabled style={{width: '100%'}}/>
			</Form.Item>

			<Form.Item>
				<Button type="primary" htmlType="submit">
					Add Asset
				</Button>
			</Form.Item>
		</Form>
	)
}
