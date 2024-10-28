import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { RadioButton } from 'primereact/radiobutton';
import { Toast } from 'primereact/toast';
import classNames from 'classnames';

const ProductDemo = () => {
    let emptyProduct = {
        product_id: '',
        product_name: '',
        product_code: '',
        main_type_id: '',
        img_url: null,
        product_intro: '',
        scent_profile: '',
        summary: '',
        price: '',
        capacity: '',
        quantity: ''
    }

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/admin');
                const productsWithStringCodes = response.data.map(product => ({
                    ...product,
                    product_code: String(product.product_code)
                }));
                setProducts(productsWithStringCodes);
            } catch (error) {
                console.log(error)
                console.error('Error fetching')
            }
        }
        fetchProducts()
    }, [])

    const [products, setProducts] = useState([]);
    const [product, setProduct] = useState(emptyProduct)
    const [productDialog, setProductDialog] = useState(false)
    const [delProductDialog, setDelProductDialog] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [search, setSearch] = useState('')
    const [image, setImage] = useState([])
    const [existingImage, setExistingImage] = useState([])
    const toast = useRef(null)

    const reviseTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editProduct(rowData)} />
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => deleteProduct(rowData)} />
            </React.Fragment>
        )
    }

    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button label="New" icon="pi pi-plus" severity="success" onClick={openNew} />
            </div>
        )
    }

    const quantityBodyTemplate = (rowData) => {
        return (
            <span style={{ color: rowData.quantity === 0 ? 'red' : 'inherit' }}>
                {rowData.quantity}
            </span>
        )
    }

    const onImageChange = (e) => {
        const files = Array.from(e.target.files)
        const imageUrls = files.map(file => URL.createObjectURL(file))
        setImage(imageUrls)
    }

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || ''
        let _product = { ...product }
        _product[name] = val
        setProduct(_product)
    }

    const onInputNumberChange = (e, name) => {
        let _product = { ...product }
        _product[name] = e.value
        setProduct(_product)
    }

    const openNew = () => {
        setProduct(emptyProduct)
        setImage([])
        setExistingImage([])
        setSubmitted(false)
        setProductDialog(true)
    }

    const hideDialog = () => {
        setSubmitted(false)
        setProduct(emptyProduct)
        setProductDialog(false)
    }

    const hideDelProductDialog = () => {
        setDelProductDialog(false)
    }

    const editProduct = (product) => {
        setProduct({ ...product })
        setExistingImage(product.image || [])
        setProductDialog(true)
    }

    const deleteProduct = (product) => {
        setProduct(product);
        setDelProductDialog(true)
    }

    const confirmDel = async () => {
        try {
            await axios.delete(`http://localhost:8000/api/admin/${product.product_id}`)
            setProducts(products.filter((p) => p.product_id !== product.product_id))
            setDelProductDialog(false)
            toast.current.show({ severity: 'success', summary: 'Successful', detail: '已刪除', life: 3000 })
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: '刪除失敗', life: 3000 })
        }
    }

    const saveProduct = async () => {
        setSubmitted(true);
        if (product.product_name.trim() && product.main_type_id && product.price >= 0 && product.quantity >= 0 && product.capacity) {
            let _products = [...products]
            let _product = { ...product }

            const productCodePrefix = `10${product.main_type_id}${getCapacity(product.capacity)}0`
            const nextZ = getNextZValue(_products, productCodePrefix)
            _product.product_code = `${productCodePrefix}${nextZ}`

            const formData = new FormData();

            if (product.product_id) {
                formData.append('product', JSON.stringify(_product))
                await axios.put(`http://localhost:8000/api/admin/${product.product_id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                const index = findIndexById(product.product_id)
                _products[index] = _product
                toast.current.show({ severity: 'success', summary: '成功', detail: '產品更新', life: 3000 })
            } else {
                formData.append('product', JSON.stringify(_product))
                const response = await axios.post('http://localhost:8000/api/admin', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                _product.product_id = response.data.id
                _products.push(_product)
                toast.current.show({ severity: 'success', summary: '成功', detail: '產品新增', life: 3000 })
            }
            setProducts(_products)
            setProductDialog(false)
            setProduct(emptyProduct)
            setImage([])
            setExistingImage([])
        } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: '請確保都已填寫', life: 3000 })
        }
    }

    const getCapacity = (capacity) => {
        const cap = parseInt(capacity, 10)
        switch (cap) {
            case 30:
                return '1'
            case 50:
                return '2'
            case 100:
                return '3'
        }
    }

    const getNextZValue = (products, prefix) => {
        let maxZ = 0;
        products.forEach(product => {
            if (typeof product.product_code === 'string' && product.product_code.startsWith(prefix)) {
                const zValue = parseInt(product.product_code.slice(prefix.length), 10);
                if (!isNaN(zValue) && zValue > maxZ) {
                    maxZ = zValue;
                }
            }
        });
        return (maxZ + 1).toString().padStart(2, '0');
    }

    const findIndexById = (id) => {
        let index = -1
        for (let i = 0; i < products.length; i++) {
            if (products[i].product_id === id) {
                index = i
                break
            }
        }
        return index
    }

    const createId = () => {
        const maxId = products.reduce((max, product) => Math.max(max, parseInt(product.product_id)), 0)
        return (maxId + 1).toString()
    }

    const onClassChange = (e) => {
        let _product = { ...product }
        _product['main_type_id'] = e.value
        setProduct(_product)
    }

    const onCapacityChange = (e) => {
        let _product = { ...product }
        _product['capacity'] = e.value
        setProduct(_product)
    }

    const truncateText = (text, maxLength = 20) => {
        if (!text) return '';
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    }

    const mainTypeTemplate = (rowData) => {
        switch (rowData.main_type_id) {
            case 1:
                return '花香調';
            case 2:
                return '木質調';
            case 3:
                return '東方香調/琥珀調';
            case 4:
                return '清新調';
        }
    }

    const filteredProducts = products.filter(product =>
        product.product_name?.toLowerCase().includes(search.toLowerCase())
    )

    const header = (
        <div className='flex flex-wrap gap-2 align-items-center justify-content-between'>
            <h2 className="m-0">產品列表</h2>
            <div className="flex align-items-center">
                <i className="pi pi-search" style={{ marginRight: '0.5rem' }}></i>
                <InputText type="search"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
        </div>
    )

    const productDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Yes" icon="pi pi-check" onClick={saveProduct} />
        </React.Fragment>
    )

    const delProductDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDelProductDialog} />
            <Button label="Yes" icon="pi pi-check" severity="danger" onClick={confirmDel} />
        </React.Fragment>
    )

    return (
        <div>
            <Toast ref={toast} />
            <div className='card'>
                <Toolbar className='mb-4' left={leftToolbarTemplate} />
                <DataTable value={filteredProducts}
                    header={header}
                    dataKey='product_id'
                    paginator rows={5}
                    rowsPerPageOptions={[5, 10, 20]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                >
                    <Column field='product_id' header='Id' sortable></Column>
                    <Column field='product_code' header='產品編號' sortable></Column>
                    <Column field='product_name' header='產品名稱' sortable></Column>
                    <Column field='main_type_id' header='產品系列' sortable body={mainTypeTemplate}></Column>
                    <Column field='product_intro' header='產品介紹' body={(rowData) => truncateText(rowData.product_intro)}></Column>
                    <Column field='scent_profile' header='香氛調性' body={(rowData) => truncateText(rowData.scent_profile)}></Column>
                    <Column field='summary' header='產品摘要' body={(rowData) => truncateText(rowData.summary)}></Column>
                    <Column field='price' header='產品價格(NT)' sortable></Column>
                    <Column field='capacity' header='產品容量(ml)' sortable></Column>
                    <Column field='quantity' body={quantityBodyTemplate} header='產品庫存' sortable></Column>
                    <Column body={reviseTemplate}></Column>
                </DataTable>
            </div>
            <Dialog visible={productDialog}
                style={{ width: '32rem' }}
                breakpoints={{ '960px': '75vw', '641px': '90vw' }}
                header="Product Details"
                modal className="p-fluid"
                footer={productDialogFooter}
                onHide={hideDialog}
            >
                {existingImage.length > 0 && (
                    <div className="field">
                        <p className="font-bold">現有圖片</p>
                        <div className="image-preview">
                            {existingImage.map((image, index) => (
                                <img key={index} src={image} alt={`Product ${index}`} style={{ width: '100px', marginRight: '10px' }} />
                            ))}
                        </div>
                    </div>
                )}
                <div className="field">
                    <p htmlFor="images" className="font-bold">上傳新圖片</p>
                    <input type="file" id="images" multiple accept="image/*" onChange={(e) => onImageChange(e)} />
                </div>
                <div className="field">
                    <p htmlFor="name" className="font-bold">產品名稱</p>
                    <InputText id="name" value={product.product_name} onChange={(e) => onInputChange(e, 'product_name')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.product_name })} />
                    {submitted && !product.product_name && <small className="p-error">請輸入產品名稱.</small>}
                </div>
                <div className="field">
                    <p className="mb-3 font-bold">產品系列</p>
                    <div className="formgrid grid">
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="class1" name="class" value="1" onChange={onClassChange} checked={product.main_type_id.toString() === '1'} />
                            <label htmlFor="class1">花香調</label>
                        </div>
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="class2" name="class" value="2" onChange={onClassChange} checked={product.main_type_id.toString() === '2'} />
                            <label htmlFor="class2">木質調</label>
                        </div>
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="class3" name="class" value="3" onChange={onClassChange} checked={product.main_type_id.toString() === '3'} />
                            <label htmlFor="class3">東方香調/琥珀調</label>
                        </div>
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="class4" name="class" value="4" onChange={onClassChange} checked={product.main_type_id.toString() === '4'} />
                            <label htmlFor="class4">清新調</label>
                        </div>
                    </div>
                </div>
                <div className="field">
                    <p className="mb-3 font-bold">容量</p>
                    <div className="formgrid grid">
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="capacity1" name="capacity" value="30" onChange={onCapacityChange} checked={product.capacity.toString() === '30'} />
                            <label htmlFor="capacity1">30ml</label>
                        </div>
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="capacity2" name="capacity" value="50" onChange={onCapacityChange} checked={product.capacity.toString() === '50'} />
                            <label htmlFor="capacity2">50ml</label>
                        </div>
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="capacity3" name="capacity" value="100" onChange={onCapacityChange} checked={product.capacity.toString() === '100'} />
                            <label htmlFor="capacity3">100ml</label>
                        </div>
                    </div>
                </div>
                <div className="formgrid grid">
                    <div className="field col">
                        <label htmlFor="price" className="font-bold">金額</label>
                        <InputNumber id="price" value={product.price} onValueChange={(e) => onInputNumberChange(e, 'price')} />
                    </div>
                    <div className="field col">
                        <label htmlFor="quantity" className="font-bold">庫存</label>
                        <InputNumber id="quantity" value={product.quantity} onValueChange={(e) => onInputNumberChange(e, 'quantity')} />
                    </div>
                </div>
                <div className="field">
                    <p htmlFor="description1" className="font-bold">產品介紹</p>
                    <InputTextarea id="description1" value={product.product_intro} onChange={(e) => onInputChange(e, 'product_intro')} required rows={3} cols={20} />
                </div>
                <div className="field">
                    <p htmlFor="description2" className="font-bold">香氛調性</p>
                    <InputTextarea id="description2" value={product.scent_profile} onChange={(e) => onInputChange(e, 'scent_profile')} required rows={3} cols={20} />
                </div>
                <div className="field">
                    <p htmlFor="description3" className="font-bold">產品摘要</p>
                    <InputTextarea id="description3" value={product.summary} onChange={(e) => onInputChange(e, 'summary')} required rows={3} cols={20} />
                </div>
            </Dialog>
            <Dialog visible={delProductDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={delProductDialogFooter} onHide={hideDelProductDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {product && (
                        <span>
                            你確定要刪除 <b>{product.name}</b> 嗎?
                        </span>
                    )}
                </div>
            </Dialog>
        </div>
    )
}

export default ProductDemo;