import React, { useState, useEffect, useRef } from 'react'; // 引入 React 和 Hooks
import { classNames } from 'primereact/utils'; // 引入工具函數
import { DataTable } from 'primereact/datatable'; // 引入資料表元件
import { Column } from 'primereact/column'; // 引入資料表列元件
import { ProductService } from './service/ProductService'; // 引入產品服務
import { Toast } from 'primereact/toast'; // 引入通知元件
import { Button } from 'primereact/button'; // 引入按鈕元件
import { FileUpload } from 'primereact/fileupload'; // 引入檔案上傳元件
import { Rating } from 'primereact/rating'; // 引入評價元件
import { Toolbar } from 'primereact/toolbar'; // 引入工具欄元件
import { InputTextarea } from 'primereact/inputtextarea'; // 引入文字區域元件
import { IconField } from 'primereact/iconfield'; // 引入圖示欄位元件
import { InputIcon } from 'primereact/inputicon'; // 引入圖示輸入元件
import { RadioButton } from 'primereact/radiobutton'; // 引入單選按鈕元件
import { InputNumber } from 'primereact/inputnumber'; // 引入數字輸入元件
import { Dialog } from 'primereact/dialog'; // 引入對話框元件
import { InputText } from 'primereact/inputtext'; // 引入文字輸入元件
import { Tag } from 'primereact/tag'; // 引入標籤元件

export default function ProductsDemo() {
    // 初始空白產品資料
    let emptyProduct = {
        id: null,
        name: '',
        image: null,
        description: '',
        category: null,
        price: 0,
        quantity: 0,
        rating: 0,
        inventoryStatus: 'INSTOCK' // 初始庫存狀態為有貨
    };

    const [products, setProducts] = useState(null); // 產品狀態
    const [productDialog, setProductDialog] = useState(false); // 產品對話框狀態
    const [deleteProductDialog, setDeleteProductDialog] = useState(false); // 刪除單個產品對話框狀態
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false); // 刪除多個產品對話框狀態
    const [product, setProduct] = useState(emptyProduct); // 當前產品狀態
    const [selectedProducts, setSelectedProducts] = useState(null); // 被選中的產品
    const [submitted, setSubmitted] = useState(false); // 提交狀態
    const [globalFilter, setGlobalFilter] = useState(null); // 全局過濾器
    const toast = useRef(null); // 用於顯示通知
    const dt = useRef(null); // 用於資料表的參考

    // 使用效果鉤子，獲取產品數據
    useEffect(() => {
        ProductService.getProducts().then((data) => setProducts(data)); // 獲取產品數據並設置狀態
    }, []);

    // 格式化貨幣
    const formatCurrency = (value) => {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    };

    // 開啟新增產品對話框
    const openNew = () => {
        setProduct(emptyProduct); // 重置產品
        setSubmitted(false); // 重置提交狀態
        setProductDialog(true); // 開啟對話框
    };

    // 隱藏產品對話框
    const hideDialog = () => {
        setSubmitted(false); // 重置提交狀態
        setProductDialog(false); // 隱藏對話框
    };

    // 隱藏刪除產品對話框
    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };

    // 隱藏刪除多個產品對話框
    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
    };

    // 保存產品
    const saveProduct = () => {
        setSubmitted(true); // 設置為已提交

        if (product.name.trim()) { // 確保產品名稱不為空
            let _products = [...products]; // 複製產品數組
            let _product = { ...product }; // 複製當前產品

            if (product.id) { // 如果是編輯產品
                const index = findIndexById(product.id); // 根據 ID 找到索引

                _products[index] = _product; // 更新產品
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
            } else { // 如果是新增產品
                _product.id = createId(); // 創建新 ID
                _product.image = 'product-placeholder.svg'; // 設置默認圖片
                _products.push(_product); // 添加新產品
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
            }

            setProducts(_products); // 更新產品狀態
            setProductDialog(false); // 隱藏對話框
            setProduct(emptyProduct); // 重置產品
        }
    };

    // 編輯產品
    const editProduct = (product) => {
        setProduct({ ...product }); // 設置當前產品
        setProductDialog(true); // 開啟對話框
    };

    // 確認刪除單個產品
    const confirmDeleteProduct = (product) => {
        setProduct(product); // 設置當前產品
        setDeleteProductDialog(true); // 開啟刪除對話框
    };

    // 刪除單個產品
    const deleteProduct = () => {
        let _products = products.filter((val) => val.id !== product.id); // 過濾掉被刪除的產品

        setProducts(_products); // 更新產品狀態
        setDeleteProductDialog(false); // 隱藏對話框
        setProduct(emptyProduct); // 重置產品
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
    };

    // 根據 ID 找到產品的索引
    const findIndexById = (id) => {
        let index = -1;

        for (let i = 0; i < products.length; i++) {
            if (products[i].id === id) {
                index = i; // 設置索引
                break;
            }
        }

        return index; // 返回索引
    };

    // 創建唯一 ID
    const createId = () => {
        let id = '';
        let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length)); // 隨機生成字符
        }

        return id; // 返回 ID
    };

    // 導出 CSV
    const exportCSV = () => {
        dt.current.exportCSV(); // 使用資料表的導出功能
    };

    // 確認刪除選中的產品
    const confirmDeleteSelected = () => {
        setDeleteProductsDialog(true); // 開啟刪除對話框
    };

    // 刪除選中的產品
    const deleteSelectedProducts = () => {
        let _products = products.filter((val) => !selectedProducts.includes(val)); // 過濾掉選中的產品

        setProducts(_products); // 更新產品狀態
        setDeleteProductsDialog(false); // 隱藏對話框
        setSelectedProducts(null); // 清空選中的產品
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
    };

    // 類別變更事件處理
    const onCategoryChange = (e) => {
        let _product = { ...product };

        _product['category'] = e.value; // 更新類別
        setProduct(_product); // 更新產品狀態
    };

    // 輸入變更事件處理
    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || ''; // 獲取輸入值
        let _product = { ...product };

        _product[`${name}`] = val; // 更新產品屬性

        setProduct(_product); // 更新產品狀態
    };

    // 數字輸入變更事件處理
    const onInputNumberChange = (e, name) => {
        const val = e.value || 0; // 獲取數值
        let _product = { ...product };

        _product[`${name}`] = val; // 更新產品屬性

        setProduct(_product); // 更新產品狀態
    };

    // 左側工具欄模板
    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button label="New" icon="pi pi-plus" severity="success" onClick={openNew} /> {/* 新增按鈕 */}
                <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedProducts || !selectedProducts.length} /> {/* 刪除按鈕 */}
            </div>
        );
    };

    // 右側工具欄模板
    const rightToolbarTemplate = () => {
        return <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />; // 導出按鈕
    };

    // 圖片欄位模板
    const imageBodyTemplate = (rowData) => {
        return <img src={`https://primefaces.org/cdn/primereact/images/product/${rowData.image}`} alt={rowData.image} className="shadow-2 border-round" style={{ width: '64px' }} />; // 顯示產品圖片
    };

    // 價格欄位模板
    const priceBodyTemplate = (rowData) => {
        return formatCurrency(rowData.price); // 顯示格式化的價格
    };

    // 評價欄位模板
    const ratingBodyTemplate = (rowData) => {
        return <Rating value={rowData.rating} readOnly cancel={false} />; // 顯示評價
    };

    // 庫存狀態欄位模板
    const statusBodyTemplate = (rowData) => {
        return <Tag value={rowData.inventoryStatus} severity={getSeverity(rowData)}></Tag>; // 顯示庫存狀態標籤
    };

    // 行動欄位模板
    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editProduct(rowData)} /> {/* 編輯按鈕 */}
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteProduct(rowData)} /> {/* 刪除按鈕 */}
            </React.Fragment>
        );
    };

    // 獲取庫存狀態的嚴重性
    const getSeverity = (product) => {
        switch (product.inventoryStatus) {
            case 'INSTOCK':
                return 'success'; // 有貨

            case 'LOWSTOCK':
                return 'warning'; // 低庫存

            case 'OUTOFSTOCK':
                return 'danger'; // 無庫存

            default:
                return null;
        }
    };

    // 資料表標題
    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0">Manage Products</h4> {/* 管理產品 */}
            <IconField iconPosition="left">
                <InputIcon className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." /> {/* 搜索框 */}
            </IconField>
        </div>
    );

    // 產品對話框底部
    const productDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} /> {/* 取消按鈕 */}
            <Button label="Save" icon="pi pi-check" onClick={saveProduct} /> {/* 保存按鈕 */}
        </React.Fragment>
    );

    // 刪除產品對話框底部
    const deleteProductDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteProductDialog} /> {/* 不刪除按鈕 */}
            <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteProduct} /> {/* 確認刪除按鈕 */}
        </React.Fragment>
    );

    // 刪除多個產品對話框底部
    const deleteProductsDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteProductsDialog} /> {/* 不刪除按鈕 */}
            <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteSelectedProducts} /> {/* 確認刪除按鈕 */}
        </React.Fragment>
    );

    return (
        <div>
            <Toast ref={toast} /> {/* 通知元件 */}
            <div className="card">
                <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar> {/* 工具欄 */}

                <DataTable ref={dt} value={products} selection={selectedProducts} onSelectionChange={(e) => setSelectedProducts(e.value)}
                        dataKey="id"  paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products" globalFilter={globalFilter} header={header}>
                    <Column selectionMode="multiple" exportable={false}></Column> {/* 選擇列 */}
                    <Column field="code" header="Code" sortable style={{ minWidth: '12rem' }}></Column> {/* 產品代碼 */}
                    <Column field="name" header="Name" sortable style={{ minWidth: '16rem' }}></Column> {/* 產品名稱 */}
                    <Column field="image" header="Image" body={imageBodyTemplate}></Column> {/* 產品圖片 */}
                    <Column field="price" header="Price" body={priceBodyTemplate} sortable style={{ minWidth: '8rem' }}></Column> {/* 價格 */}
                    <Column field="category" header="Category" sortable style={{ minWidth: '10rem' }}></Column> {/* 類別 */}
                    <Column field="rating" header="Reviews" body={ratingBodyTemplate} sortable style={{ minWidth: '12rem' }}></Column> {/* 評價 */}
                    <Column field="inventoryStatus" header="Status" body={statusBodyTemplate} sortable style={{ minWidth: '12rem' }}></Column> {/* 庫存狀態 */}
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column> {/* 行動按鈕 */}
                </DataTable>
            </div>

            {/* 產品對話框 */}
            <Dialog visible={productDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Product Details" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                {product.image && <img src={`https://primefaces.org/cdn/primereact/images/product/${product.image}`} alt={product.image} className="product-image block m-auto pb-3" />} {/* 產品圖片 */}
                <div className="field">
                    <label htmlFor="name" className="font-bold">Name</label> {/* 產品名稱標籤 */}
                    <InputText id="name" value={product.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.name })} /> {/* 產品名稱輸入 */}
                    {submitted && !product.name && <small className="p-error">Name is required.</small>} {/* 錯誤提示 */}
                </div>
                <div className="field">
                    <label htmlFor="description" className="font-bold">Description</label> {/* 產品描述標籤 */}
                    <InputTextarea id="description" value={product.description} onChange={(e) => onInputChange(e, 'description')} required rows={3} cols={20} /> {/* 產品描述輸入 */}
                </div>

                <div className="field">
                    <label className="mb-3 font-bold">Category</label> {/* 類別標籤 */}
                    <div className="formgrid grid">
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="category1" name="category" value="Accessories" onChange={onCategoryChange} checked={product.category === 'Accessories'} /> {/* 類別選擇 */}
                            <label htmlFor="category1">Accessories</label>
                        </div>
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="category2" name="category" value="Clothing" onChange={onCategoryChange} checked={product.category === 'Clothing'} />
                            <label htmlFor="category2">Clothing</label>
                        </div>
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="category3" name="category" value="Electronics" onChange={onCategoryChange} checked={product.category === 'Electronics'} />
                            <label htmlFor="category3">Electronics</label>
                        </div>
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="category4" name="category" value="Fitness" onChange={onCategoryChange} checked={product.category === 'Fitness'} />
                            <label htmlFor="category4">Fitness</label>
                        </div>
                    </div>
                </div>

                <div className="formgrid grid">
                    <div className="field col">
                        <label htmlFor="price" className="font-bold">Price</label> {/* 價格標籤 */}
                        <InputNumber id="price" value={product.price} onValueChange={(e) => onInputNumberChange(e, 'price')} mode="currency" currency="USD" locale="en-US" /> {/* 價格輸入 */}
                    </div>
                    <div className="field col">
                        <label htmlFor="quantity" className="font-bold">Quantity</label> {/* 數量標籤 */}
                        <InputNumber id="quantity" value={product.quantity} onValueChange={(e) => onInputNumberChange(e, 'quantity')} /> {/* 數量輸入 */}
                    </div>
                </div>
            </Dialog>

            {/* 刪除產品對話框 */}
            <Dialog visible={deleteProductDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} /> {/* 警告圖標 */}
                    {product && (
                        <span>
                            Are you sure you want to delete <b>{product.name}</b>? {/* 確認刪除訊息 */}
                        </span>
                    )}
                </div>
            </Dialog>

            {/* 刪除多個產品對話框 */}
            <Dialog visible={deleteProductsDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} /> {/* 警告圖標 */}
                    {product && <span>Are you sure you want to delete the selected products?</span>} {/* 確認刪除多個產品訊息 */}
                </div>
            </Dialog>
        </div>
    );
}
