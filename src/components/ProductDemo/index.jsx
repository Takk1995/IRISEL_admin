import React, { useRef, useState } from 'react';
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
        Id: null,
        Name: '',
        Class: null,
        Image: null,
        Description: '',
        Price: 0,
        Capacity: null,
        Quantity: 0
    }

    const [products, setProducts] = useState([
        { Id: '1', Code: '101000', Name: 'Product1', Class: 'Class1', Image: '', Description: 'Product Description', Price: 5600, Capacity: '100', Quantity: 10 },
        { Id: '2', Code: '102000', Name: 'Product2', Class: 'Class2', Image: '', Description: 'Product Description', Price: 5400, Capacity: '100', Quantity: 11 },
        { Id: '3', Code: '103000', Name: 'Product3', Class: 'Class3', Image: '', Description: 'Product Description', Price: 5200, Capacity: '100', Quantity: 7 },
        { Id: '4', Code: '101100', Name: 'Product1-1', Class: 'Class1', Image: '', Description: 'Product Description', Price: 2800, Capacity: '50', Quantity: 0 },
        { Id: '5', Code: '102100', Name: 'Product2-1', Class: 'Class2', Image: '', Description: 'Product Description', Price: 2700, Capacity: '50', Quantity: 9 },
        { Id: '6', Code: '103100', Name: 'Product3-1', Class: 'Class3', Image: '', Description: 'Product Description', Price: 2600, Capacity: '50', Quantity: 5 },
        { Id: '7', Code: '101200', Name: 'Product1-2', Class: 'Class1', Image: '', Description: 'Product Description', Price: 1600, Capacity: '30', Quantity: 0 },
        { Id: '8', Code: '102200', Name: 'Product2-2', Class: 'Class2', Image: '', Description: 'Product Description', Price: 1500, Capacity: '30', Quantity: 4 },
        { Id: '9', Code: '103200', Name: 'Product3-2', Class: 'Class3', Image: '', Description: 'Product Description', Price: 1400, Capacity: '30', Quantity: 12 },
        { Id: '10', Code: '104000', Name: 'Product4', Class: 'Class4', Image: '', Description: 'Product Description', Price: 5800, Capacity: '100', Quantity: 3 }
    ]);
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
            <span style={{ color: rowData.Quantity === 0 ? 'red' : 'inherit' }}>
                {rowData.Quantity}
            </span>
        )
    }

    const onInputChange = (e, Name) => {
        const val = (e.target && e.target.value) || ''
        let _product = { ...product }
        _product[Name] = val
        setProduct(_product)
    }

    const onInputNumberChange = (e, Name) => {
        let _product = { ...product }
        _product[Name] = e.value
        setProduct(_product)
    }

    const openNew = () => {
        setProduct(emptyProduct)
        setSubmitted(false)
        setProductDialog(true)
    }

    const hideDialog = () => {
        setSubmitted(false)
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

    const confirmDel = () => {
        setProducts(products.filter((p) => p.Id !== product.Id))
        setDelProductDialog(false)
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 })
    }

    const saveProduct = () => {
        setSubmitted(true);
        if (product.Name.trim() && product.Class && product.Price >= 0 && product.Quantity >= 0) {
            let _products = [...products];
            let _product = { ...product };

            if (product.Id) {
                const index = findIndexById(product.Id);
                _products[index] = _product;
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
            } else {
                _product.Id = createId();
                _products.push(_product);
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
            }
            setProducts(_products);
            setProductDialog(false);
            setProduct(emptyProduct);
        } else {
            toast.current.show({ severity: 'error', summary: 'false', detail: '', life: 3000 });
        }
    }

    const findIndexById = (Id) => {
        let index = -1
        for (let i = 0; i < products.length; i++) {
            if (products[i].Id === Id) {
                index = i
                break
            }
        }
        return index
    }

    const createId = () => {
        const maxId = products.reduce((max, product) => Math.max(max, Number(product.Id)), 0);
        return (maxId + 1).toString()
    }

    const onClassChange = (e) => {
        let _product = { ...product }
        _product['Class'] = e.value
        setProduct(_product)
    }

    const onCapacityChange = (e) => {
        let _product = { ...product }
        _product['Capacity'] = e.value
        setProduct(_product)
    }

    const filteredProducts = products.filter(product =>
        product.Name.toLowerCase().includes(search.toLowerCase())
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
                    dataKey='Id'
                    paginator rows={10}
                    rowsPerPageOptions={[5, 10, 20]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                >
                    <Column field='Id' header='Id' sortable></Column>
                    {/* <Column field='Code' header='產品編號' sortable></Column> */}
                    <Column field='Name' header='產品名稱' sortable></Column>
                    <Column field='Class' header='產品系列' sortable></Column>
                    {/* <Column field='Description' header='產品介紹'></Column> */}
                    <Column field='Price' header='產品價格(NT)' sortable></Column>
                    <Column field='Capacity' header='產品容量(ml)' sortable></Column>
                    <Column field='Quantity' body={quantityBodyTemplate} header='產品庫存' sortable></Column>
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
                    <InputText id="name" value={product.Name} onChange={(e) => onInputChange(e, 'Name')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.Name })} />
                    {submitted && !product.Name && <small className="p-error">請輸入產品名稱.</small>}
                </div>
                <div className="field">
                    <p className="mb-3 font-bold">產品系列</p>
                    <div className="formgrid grid">
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="Class1" name="Class" value="Class1" onChange={onClassChange} checked={product.Class === 'Class1'} />
                            <label htmlFor="category1">1</label>
                        </div>
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="Class2" name="Class" value="Class2" onChange={onClassChange} checked={product.Class === 'Class2'} />
                            <label htmlFor="category2">2</label>
                        </div>
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="Class3" name="Class" value="Class3" onChange={onClassChange} checked={product.Class === 'Class3'} />
                            <label htmlFor="category3">3</label>
                        </div>
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="Class4" name="Class" value="Class4" onChange={onClassChange} checked={product.Class === 'Class4'} />
                            <label htmlFor="category4">4</label>
                        </div>
                    </div>
                </div>
                <div className="field">
                    <p className="mb-3 font-bold">容量</p>
                    <div className="formgrid grid">
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="Capacity1" name="Capacity" value="30ml" onChange={onCapacityChange} checked={product.Capacity === '30'} />
                            <label htmlFor="category1">30ml</label>
                        </div>
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="Capacity2" name="Capacity" value="50ml" onChange={onCapacityChange} checked={product.Capacity === '50'} />
                            <label htmlFor="category2">50ml</label>
                        </div>
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="Capacity3" name="Capacity" value="100ml" onChange={onCapacityChange} checked={product.Capacity === '100'} />
                            <label htmlFor="category3">100ml</label>
                        </div>
                    </div>
                </div>
                <div className="formgrid grid">
                    <div className="field col">
                        <label htmlFor="price" className="font-bold">金額</label>
                        <InputNumber id="price" value={product.Price} onValueChange={(e) => onInputNumberChange(e, 'Price')} />
                    </div>
                    <div className="field col">
                        <label htmlFor="quantity" className="font-bold">庫存</label>
                        <InputNumber id="quantity" value={product.Quantity} onValueChange={(e) => onInputNumberChange(e, 'Quantity')} />
                    </div>
                </div>
                <div className="field">
                    <p htmlFor="description" className="font-bold">產品介紹</p>
                    <InputTextarea id="description" value={product.Description} onChange={(e) => onInputChange(e, 'Description')} required rows={3} cols={20} />
                </div>
            </Dialog>
            <Dialog visible={delProductDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={delProductDialogFooter} onHide={hideDelProductDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {product && (
                        <span>
                            你確定要刪除 <b>{product.Name}</b> 嗎?
                        </span>
                    )}
                </div>
            </Dialog>
        </div>
    )
}

export default ProductDemo;