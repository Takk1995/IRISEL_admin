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
        { Id: '1', Code: '101000', Name: '1', Class: '1', Image: '', Description: 'Product Description', Price: 5600, Capacity: '100ml', Quantity: 10 },
        { Id: '2', Code: '102000', Name: '2', Class: '2', Image: '', Description: 'Product Description', Price: 5400, Capacity: '100ml', Quantity: 10 },
        { Id: '3', Code: '103000', Name: '3', Class: '3', Image: '', Description: 'Product Description', Price: 5200, Capacity: '100ml', Quantity: 10 },
        { Id: '4', Code: '101100', Name: '1-1', Class: '1', Image: '', Description: 'Product Description', Price: 2800, Capacity: '50ml', Quantity: 5 },
        { Id: '5', Code: '102100', Name: '2-2', Class: '2', Image: '', Description: 'Product Description', Price: 2700, Capacity: '50ml', Quantity: 5 },
        { Id: '6', Code: '103100', Name: '3-3', Class: '3', Image: '', Description: 'Product Description', Price: 2600, Capacity: '50ml', Quantity: 5 },
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
            <Toast ref={toast}/>
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
                    <Column field='Id' header='Id'></Column>
                    <Column field='Code' header='產品編號'></Column>
                    <Column field='Name' header='產品名稱'></Column>
                    <Column field='Class' header='產品系列'></Column>
                    <Column field='Description' header='產品介紹'></Column>
                    <Column field='Price' header='產品價格'></Column>
                    <Column field='Capacity' header='產品容量'></Column>
                    <Column field='Quantity' header='產品庫存'></Column>
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
                    <label htmlFor="name" className="font-bold">產品名稱</label>
                    <InputText id="name" value={product.Name} onChange={(e) => onInputChange(e, 'Name')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.Name })} />
                    {submitted && !product.Name && <small className="p-error">請輸入產品名稱.</small>}
                </div>
                <div className="field">
                    <label className="mb-3 font-bold">產品系列</label>
                    <div className="formgrid grid">
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="Class1" name="Class" value="1" onChange={onClassChange} checked={product.Class === '1'} />
                            <label htmlFor="category1">1</label>
                        </div>
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="Class2" name="Class" value="2" onChange={onClassChange} checked={product.Class === '2'} />
                            <label htmlFor="category2">2</label>
                        </div>
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="Class3" name="Class" value="3" onChange={onClassChange} checked={product.Class === '3'} />
                            <label htmlFor="category3">3</label>
                        </div>
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="Class4" name="Class" value="4" onChange={onClassChange} checked={product.Class === '4'} />
                            <label htmlFor="category4">4</label>
                        </div>
                    </div>
                </div>
                <div className="field">
                    <label htmlFor="description" className="font-bold">產品介紹</label>
                    <InputTextarea id="description" value={product.Description} onChange={(e) => onInputChange(e, 'Description')} required rows={3} cols={20} />
                </div>
                <div className="field">
                    <label className="mb-3 font-bold">容量</label>
                    <div className="field-radiobutton col-6">
                        <RadioButton inputId="Capacity1" name="Capacity" value="50ml" onChange={onCapacityChange} checked={product.Capacity === '50ml'} />
                        <label htmlFor="category1">50ml</label>
                    </div>
                    <div className="field-radiobutton col-6">
                        <RadioButton inputId="Capacity2" name="Capacity" value="100ml" onChange={onCapacityChange} checked={product.Capacity === '100ml'} />
                        <label htmlFor="category1">100ml</label>
                    </div>
                </div>
                <div className="formgrid grid">
                    <div className="field col">
                        <label htmlFor="price" className="font-bold">Price</label>
                        <InputNumber id="price" value={product.Price} onValueChange={(e) => onInputNumberChange(e, 'Price')} />
                    </div>
                    <div className="field col">
                        <label htmlFor="quantity" className="font-bold">Quantity</label>
                        <InputNumber id="quantity" value={product.Quantity} onValueChange={(e) => onInputNumberChange(e, 'Quantity')} />
                    </div>
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