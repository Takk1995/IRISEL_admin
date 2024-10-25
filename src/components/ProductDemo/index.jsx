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
        id: null,
        name: '',
        number: '',
        class: null,
        image: null,
        description: '',
        price: 0,
        capacity: null,
        quantity: 0
    }
    
    useEffect(() => {
        const fetchProducts = async() => {
            try {
                const response = await axios.get('http://localhost:8000/api/admin')
                setProducts(response.data)
            } catch (error) {
                console.log(error);
                
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
        setProductDialog(true)
    }

    const deleteProduct = (product) => {
        setProduct(product);
        setDelProductDialog(true);
    }

    const confirmDel = async() => {
        try {
            await axios.delete(`http://localhost:8000/api/admin/${product.id}`);
            setProducts(products.filter((p) => p.id !== product.id));
            setDelProductDialog(false);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: '已刪除', life: 3000 });
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: '刪除失敗', life: 3000 });
        }
    }

    const saveProduct = async() => {
        setSubmitted(true);
        if (product.name.trim() && product.class && product.price >= 0 && product.quantity >= 0 && product.capacity) {
            let _products = [...products];
            let _product = { ...product };

            if (product.id) {
                await axios.put(`http://localhost:8000/api/admin/${product.id}`, _product);
                const index = findIndexById(product.id);
                _products[index] = _product;
                toast.current.show({ severity: 'success', summary: '成功', detail: '產品更新', life: 3000 });
            } else {
                const response = await axios.post('http://localhost:8000/api/admin', _product);
                _product.id = createId();
                _products.push(_product);
                toast.current.show({ severity: 'success', summary: '成功', detail: '產品新增', life: 3000 });
            }
            setProducts(_products);
            setProductDialog(false);
            setProduct(emptyProduct);
        } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: '請確保都已填寫', life: 3000 });
        }
    }

    const findIndexById = (id) => {
        let index = -1
        for (let i = 0; i < products.length; i++) {
            if (products[i].id === id) {
                index = i
                break
            }
        }
        return index
    }

    const createId = () => {
        const maxId = products.reduce((max, product) => Math.max(max, parseInt(product.id)), 0);
        return (maxId + 1).toString()
    }

    const onClassChange = (e) => {
        let _product = { ...product }
        _product['class'] = e.value
        setProduct(_product)
    }

    const onCapacityChange = (e) => {
        let _product = { ...product }
        _product['capacity'] = e.value
        setProduct(_product)
    }

    const filteredProducts = products.filter(product =>
        product.name?.toLowerCase().includes(search.toLowerCase())
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
                    dataKey='id'
                    paginator rows={5}
                    rowsPerPageOptions={[5, 10, 20]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                >
                    <Column field='id' header='Id' sortable></Column>
                    <Column field='number' header='產品編號' sortable></Column>
                    <Column field='name' header='產品名稱' sortable></Column>
                    <Column field='class' header='產品系列' sortable></Column>
                    {/* <Column field='description' header='產品介紹'></Column> */}
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
                <div className="field">
                    <p htmlFor="name" className="font-bold">產品名稱</p>
                    <InputText id="name" value={product.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.name })} />
                    {submitted && !product.name && <small className="p-error">請輸入產品名稱.</small>}
                </div>
                <div className="field">
                    <p className="mb-3 font-bold">產品系列</p>
                    <div className="formgrid grid">
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="class1" name="class" value="class1" onChange={onClassChange} checked={product.class === 'class1'} />
                            <label htmlFor="category1">1</label>
                        </div>
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="class2" name="class" value="class2" onChange={onClassChange} checked={product.class === 'class2'} />
                            <label htmlFor="category2">2</label>
                        </div>
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="class3" name="class" value="class3" onChange={onClassChange} checked={product.class === 'class3'} />
                            <label htmlFor="category3">3</label>
                        </div>
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="class4" name="class" value="class4" onChange={onClassChange} checked={product.class === 'class4'} />
                            <label htmlFor="category4">4</label>
                        </div>
                    </div>
                </div>
                <div className="field">
                    <p className="mb-3 font-bold">容量</p>
                    <div className="formgrid grid">
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="capacity1" name="capacity" value="30" onChange={onCapacityChange} checked={product.capacity === '30'} />
                            <label htmlFor="capacity1">30ml</label>
                        </div>
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="capacity2" name="capacity" value="50" onChange={onCapacityChange} checked={product.capacity === '50'} />
                            <label htmlFor="capacity2">50ml</label>
                        </div>
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="capacity3" name="capacity" value="100" onChange={onCapacityChange} checked={product.capacity === '100'} />
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
                    <p htmlFor="description" className="font-bold">產品介紹</p>
                    <InputTextarea id="description" value={product.description} onChange={(e) => onInputChange(e, 'description')} required rows={3} cols={20} />
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